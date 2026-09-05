#!/usr/bin/env python3
"""
🖨️  Teachers' Day card PDF repatcher — `python3 scripts/fix-card-pdf.py`

Repatches Teachers_Day_Cards_5.pdf (5 double-sided A4-landscape fold cards) in place:

  • QR codes + tap links now point at THIS site, one per teacher:
        https://teacher-s-day-aakash.vercel.app/teacher.html?id=<teacher-id>
    (the old file had one shared QR on every card, pointing at a different site)
  • the "PHOTO" circle on each front cover gets that teacher's hand-painted
    portrait from src/assets/teachers/<id>.webp (circular crop, dashed ring kept)
  • branding / details: AAKASH INSTITUTE · TEACHERS' DAY 2026 and
    CLASS 9R01 · ROLL NO. 00016051586 (was the old school, class IX-B, roll 9231)
  • the inside "four hidden secrets" list is replaced by a 3-step HOW TO SCAN
  • Harshita Ma'am's card no longer reads "three things SIR remember"
  • the mis-placed link on the inside page now really sits over the QR

Nothing is re-laid-out: the original vector art, colours and fonts stay. Re-drawn
text reuses the same DejaVu faces the PDF already carried (subset on the fly).

Needs:  pip install pymupdf qrcode pillow fonttools
"""

from __future__ import annotations

import io
import os
import sys

import pymupdf
import qrcode
from PIL import Image, ImageDraw, ImageFilter
from qrcode.constants import ERROR_CORRECT_M

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = os.path.join(ROOT, "Teachers_Day_Cards_5.pdf")
ASSET_DIR = os.path.join(ROOT, "src", "assets", "teachers")

SITE = "https://teacher-s-day-aakash.vercel.app"
DOMAIN = "teacher-s-day-aakash.vercel.app"
SCHOOL = "AAKASH INSTITUTE"
SESSION = "TEACHERS\u2019 DAY 2026"
CLASS_ROLL = "CLASS 9R01  \u00b7  ROLL NO. 00016051586"
INk = "#261e40"  # the navy the original codes were printed in
BULLET = "\u273f"

CARDS = [
    {"id": "gaurav-sir", "name": "Gaurav Sir", "fix_heading": False},
    {"id": "harshita-mam", "name": "Harshita Ma'am", "fix_heading": True},
    {"id": "rahul-sir", "name": "Rahul Sir", "fix_heading": False},
    {"id": "wajid-sir", "name": "Wajid Sir", "fix_heading": False},
    {"id": "shivam-sir", "name": "Shivam Sir", "fix_heading": False},
]
HEADING_FIX = "T H R E E T H I N G S M A \u2019 A M R E M E M B E R"

FONT_FILES = {
    "sans-bold": "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "sans": "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "serif-bold": "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
}
TMP = "/tmp/card-fonts"
MEASURE_CACHE: dict[tuple[str, float], tuple[float, float]] = {}


# --------------------------------------------------------------------------- fonts
def build_fonts(text: str) -> dict:
    """Subset the DejaVu faces down to `text` so embedding costs a few KB."""
    out: dict[str, object] = {}
    os.makedirs(TMP, exist_ok=True)
    try:
        from fontTools.subset import Options, Subsetter
        from fontTools.ttLib import TTFont
    except Exception as exc:
        print(f"   (fonttools unavailable: {exc} — embedding full faces)")
        for key, path in FONT_FILES.items():
            if os.path.exists(path):
                out[key] = pymupdf.Font(fontfile=path)
    else:
        for key, path in FONT_FILES.items():
            if not os.path.exists(path):
                continue
            sub = os.path.join(TMP, f"{key}.subset.ttf")
            font = TTFont(path)
            ss = Subsetter(options=Options())
            ss.populate(text=text)
            ss.subset(font)
            font.save(sub)
            try:
                f = pymupdf.Font(fontfile=sub)
                if all(f.has_glyph(ord(c)) for c in set(text)):
                    out[key] = f
                    continue
            except Exception:
                pass
            out[key] = pymupdf.Font(fontfile=path)
    out["italic"] = pymupdf.Font("tiro")  # Times-Italic — base-14, already in the doc
    return out


def key_of(F: pymupdf.Font) -> str:
    return F.name or "font"


def metrics(F: pymupdf.Font, size: float) -> tuple[float, float]:
    """Box height above / below the baseline, measured exactly as MuPDF reports it."""
    cache = (key_of(F), round(size, 3))
    if cache in MEASURE_CACHE:
        return MEASURE_CACHE[cache]
    doc = pymupdf.open()
    page = doc.new_page(width=300, height=120)
    tw = pymupdf.TextWriter(page.rect)
    tw.append((100, 60), "Hpg", font=F, fontsize=size)
    tw.write_text(page)
    got = (size * 0.76, size * 0.24)
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                got = (60 - span["bbox"][1], span["bbox"][3] - 60)
                break
    doc.close()
    MEASURE_CACHE[cache] = got
    return got


def color_of(span: dict) -> tuple[float, float, float]:
    c = span.get("color", 0) or 0
    return ((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255


# --------------------------------------------------------------------------- assets
def qr_png(url: str, target_px: int = 560) -> bytes:
    """Square QR in the card's ink colour, quiet zone included, error correction M."""
    code = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=1, border=3)
    code.add_data(url)
    code.make(fit=True)
    code.box_size = max(4, target_px // (code.modules_count + 2 * code.border))
    img = code.make_image(fill_color=INk, back_color="white").convert("RGB")
    buf = io.BytesIO()
    img.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def portrait_masked(path: str, size: int = 760) -> tuple[bytes, bytes]:
    """Circular-crop a painted portrait -> (image bytes, alpha mask bytes)."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    side = min(w, h)
    im = im.crop(((w - side) // 2, (h - side) // 2, (w - side) // 2 + side, (h - side) // 2 + side))
    if side > size:
        im = im.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size - 1, size - 1], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.1))
    a, b = io.BytesIO(), io.BytesIO()
    im.save(a, "JPEG", quality=84, optimize=True)  # ~70KB per face at print size
    mask.save(b, "PNG", optimize=True)
    return a.getvalue(), b.getvalue()


# --------------------------------------------------------------------------- drawing
def put(page, F, text, size, color, pivot, rotated, track=0.0, m=None):
    """Draw text starting at `pivot` (first glyph). Rotated text mirrors about that
    same point, so it grows left and reads correctly on the upside-down inside page."""
    px, py = pivot
    tw = pymupdf.TextWriter(page.rect)
    x = 0.0
    if track:
        for ch in text:
            tw.append((px + x, py), ch, font=F, fontsize=size)
            x += F.text_length(ch, fontsize=size) + track
    else:
        tw.append((px, py), text, font=F, fontsize=size)
        x = F.text_length(text, fontsize=size)
    if rotated:
        tw.write_text(page, color=color, morph=(pymupdf.Point(px, py), pymupdf.Matrix(180)))
    else:
        tw.write_text(page, color=color)
    return x


def find_spans(page, pred):
    hits = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                if pred(span, line):
                    hits.append(span)
    return hits


def union(spans):
    rect = pymupdf.Rect(spans[0]["bbox"])
    for s in spans[1:]:
        rect |= pymupdf.Rect(s["bbox"])
    return rect


def char_space(F, span, size):
    """The letter-spacing the original line was drawn with."""
    bbox = pymupdf.Rect(span["bbox"])
    n = max(1, len(span["text"]) - 1)
    return max(0.0, (bbox.width - F.text_length(span["text"], size)) / n)


def line_box(F, span, size, rotated=True):
    """(baseline_y, anchor_x, color) reusing the original span's slot."""
    m = metrics(F, size)
    bbox = pymupdf.Rect(span["bbox"])
    anchor = bbox.y1 - m[0] if rotated else bbox.y0 + m[0]
    return anchor, bbox, m


def main() -> int:
    if not os.path.exists(PDF_PATH):
        print(f"missing {PDF_PATH}")
        return 1
    doc = pymupdf.open(PDF_PATH)
    if doc.page_count != 10:
        print(f"!! expected 10 pages, found {doc.page_count} — is this the right file?")
        return 1

    sample = " ".join([
        SCHOOL, SESSION, DOMAIN, CLASS_ROLL + "  ·  " + SCHOOL,
        "teacher.html?id=harshita-mam0123456789-.·",
        "HOW TO SCAN THIS CODE", "Open the camera on your phone",
        "Point it at this code — no app needed", "Tap the link that pops up on screen",
        "scan the code below — it opens Harshita Ma'am's page",
        HEADING_FIX, "you'll land on", BULLET,
    ])
    print("subsetting fonts …")
    FONTS = build_fonts(sample)
    for key in ("sans-bold", "sans", "serif-bold"):
        if key not in FONTS:
            print(f"!! font {key} unavailable — install DejaVu")
            return 1

    print("building QR codes + circular portraits …")
    urls, qrs, art = [], {}, {}
    for card in CARDS:
        url = f"{SITE}/teacher.html?id={card['id']}"
        urls.append(url)
        qrs[url] = qr_png(url, 560)
        for ext in ("webp", "png", "jpg", "jpeg"):
            src = os.path.join(ASSET_DIR, f"{card['id']}.{ext}")
            if os.path.exists(src):
                art[card["id"]] = portrait_masked(src)
                break
        if card["id"] not in art:
            print(f"   ⚠️  no painted portrait for {card['id']} — initials avatar stays")

    for i, card in enumerate(CARDS):
        url = urls[i]
        front, back = doc[2 * i], doc[2 * i + 1]

        # ============================== FRONT (upright) — cover with the photo
        circle = None
        for dr in front.get_drawings():
            r = dr["rect"]
            if (dr["type"] == "fs" and dr.get("fill") == (1.0, 1.0, 1.0) and r.x0 > 420
                    and 150 < r.width < 220 and len(dr.get("items") or []) == 4):
                circle = r
        qr_front = None
        for img in front.get_images(full=True):
            for r in front.get_image_rects(img[0]):
                if r.y0 > 250 and r.x0 < 300:
                    qr_front = r
        if qr_front is None:
            print(f"!! card {i+1}: front QR not found")
            return 1

        school = find_spans(front, lambda s, l: "ACADEMY" in s["text"] or "INSTITUTE" in s["text"])
        session = find_spans(front, lambda s, l: "TEACHERS" in s["text"].upper() and "·" in s["text"])
        note = find_spans(front, lambda s, l: s["text"].strip().startswith("This is card"))
        roll_f = find_spans(front, lambda s, l: "ROLL NO." in s["text"].upper())
        photo = find_spans(front, lambda s, l: s["text"].strip() == "PHOTO")
        monogram = [s for s in find_spans(front, lambda s, l: s["size"] > 30)
                    if circle and pymupdf.Rect(s["bbox"]).intersects(circle)]

        front_edits = [
            (school, SCHOOL, "serif-bold", 16.5, True),
            (session, SESSION, "sans-bold", 8.0, True),
            (note, f"scan the code below \u2014 it opens {card['name']}\u2019s page", "italic", 9.5, False),
            (roll_f, CLASS_ROLL, "sans", 7.5, False),
        ]
        for span in school + session + note + roll_f + photo + monogram:
            front.add_redact_annot(pymupdf.Rect(span["bbox"]) + (-1.5, -1.5, 1.5, 1.5), fill=False)
        front.add_redact_annot(qr_front, fill=False)
        front.apply_redactions(
            images=pymupdf.PDF_REDACT_IMAGE_REMOVE,
            graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
            text=pymupdf.PDF_REDACT_TEXT_REMOVE,
        )

        # portrait inside the ring (leaves the white ring + dashed circle intact)
        if circle and card["id"] in art:
            cx, cy = (circle.x0 + circle.x1) / 2, (circle.y0 + circle.y1) / 2
            r_in = circle.width / 2 - 10
            base, mask = art[card["id"]]
            front.insert_image(pymupdf.Rect(cx - r_in, cy - r_in, cx + r_in, cy + r_in),
                               stream=base, mask=mask, overlay=True, keep_proportion=True)
        front.insert_image(qr_front, stream=qrs[url], overlay=True, keep_proportion=True)

        # re-draw the replaced front copy in the same slots
        for group, text, font_key, size, keep_track in front_edits:
            if not group:
                print(f"   ⚠️  card {i+1}: front line '{text[:24]}' not found")
                continue
            span = union_spans(group)
            F = FONTS.get(font_key) or FONTS["sans-bold"]
            base_y, bbox, m = line_box(F, span, size, rotated=False)
            track = char_space(F, group[0], size) if keep_track else 0.0
            width = F.text_length(text, size) + (track * max(0, len(text) - 1) if track else 0)
            put(front, F, text, size, color_of(span),
                ((bbox.x0 + bbox.x1) / 2 - width / 2, base_y), rotated=False, track=track, m=m)

        for link in list(front.get_links()):
            if link.get("kind") == pymupdf.LINK_URI:
                front.delete_link(link)
        front.insert_link({"kind": pymupdf.LINK_URI, "from": qr_front + (-13, -13, 13, 13), "uri": url})
        if circle:
            front.insert_link({"kind": pymupdf.LINK_URI, "from": circle, "uri": url})

        # ============================== BACK (printed upside-down) — QR + letter
        addr = find_spans(back, lambda s, l: "vercel.app" in s["text"] or s["text"].strip() == "/")
        roll_b = find_spans(back, lambda s, l: "ROLL NO." in s["text"].upper())
        block = [s for s in find_spans(back, lambda s, l: True)
                 if 158 < pymupdf.Rect(s["bbox"]).y0 < 285 and pymupdf.Rect(s["bbox"]).x1 < 380]
        if i == 0:
            print("   (block captured:", [s["text"].strip()[:30] for s in block], ")")
        heading = [s for s in block if "FOUR THINGS" in s["text"].upper()]
        tail = [s for s in block if "page turns gold" in s["text"].lower()]
        steps_old = [s for s in block if s["size"] > 9.2 and s["text"].strip() != BULLET
                     and len(s["text"].strip()) > 8 and "page turns gold" not in s["text"]]
        # this PDF tracks its capitals with real spaces ("T H R E E  T H I N G S"),
        # so heading matchers compare a space-stripped copy of the text
        def squash(span):
            return span["text"].replace(" ", "").upper()

        remember = [s for s in find_spans(back, lambda s, l: True) if "THREETHINGS" in squash(s)]
        qr_back = None
        for img in back.get_images(full=True):
            for r in back.get_image_rects(img[0]):
                qr_back = r if qr_back is None else qr_back | r
        if qr_back is None:
            print(f"!! card {i+1}: inside QR not found")
            return 1

        # the "MA'AM" heading grows left, so clear a wider box for it
        extra = pymupdf.Rect()
        if card["fix_heading"] and remember:
            Fh = FONTS["sans-bold"]
            sp = remember[0]
            track = char_space(Fh, sp, 9.0)
            w = Fh.text_length(HEADING_FIX, 9.0) + track * max(0, len(HEADING_FIX) - 1)
            bb = pymupdf.Rect(sp["bbox"])
            extra = pymupdf.Rect(bb.x1 - w, bb.y0 - 2, bb.x1 + 2, bb.y1 + 2)

        for span in addr + roll_b + block + ([remember[0]] if not extra.is_empty else []):
            back.add_redact_annot(pymupdf.Rect(span["bbox"]) + (-1.5, -1.5, 1.5, 1.5), fill=False)
        if not extra.is_empty:
            back.add_redact_annot(extra, fill=False)
        back.add_redact_annot(qr_back, fill=False)
        back.apply_redactions(
            images=pymupdf.PDF_REDACT_IMAGE_REMOVE,
            graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
            text=pymupdf.PDF_REDACT_TEXT_REMOVE,
        )
        back.insert_image(qr_back, stream=qrs[url], rotate=180, overlay=True, keep_proportion=True)

        # two-line address: the domain keeps the old slot, the path sits under it
        if addr:
            Fb = FONTS["sans-bold"]
            base_y, bbox, m = line_box(Fb, union_spans(addr), 8.6)
            col = color_of(addr[0])
            cx = (bbox.x0 + bbox.x1) / 2
            w1 = Fb.text_length(DOMAIN, 8.6)
            put(back, Fb, DOMAIN, 8.6, col, (cx + w1 / 2, base_y), rotated=True, m=m)
            path = f"teacher.html?id={card['id']}"
            m2 = metrics(Fb, 8.0)
            w2 = Fb.text_length(path, 8.0)
            put(back, Fb, path, 8.0, col, (cx + w2 / 2, base_y - 12.0), rotated=True, m=m2)

        def back_line(span, text, font_key, size, mode="right", color=None, track_from_span=False):
            if span is None:
                print(f"   ⚠️  card {i+1}: back line '{text[:24]}' not found")
                return
            F = FONTS.get(font_key) or FONTS["sans-bold"]
            base_y, bbox, m = line_box(F, span, size)
            col = color or color_of(span)
            track = char_space(F, span, size) if track_from_span else 0.0
            width = F.text_length(text, size) + (track * max(0, len(text) - 1) if track else 0)
            px = (bbox.x0 + bbox.x1) / 2 + width / 2 if mode == "center" else bbox.x1
            put(back, F, text, size, col, (px, base_y), rotated=True, track=track, m=m)

        if roll_b:
            back_line(union_spans(roll_b), CLASS_ROLL + "  \u00b7  " + SCHOOL, "sans", 7.2, "right")
        if heading:
            back_line(heading[0], "HOW TO SCAN THIS CODE", "sans-bold", 9.0, "center")
        for j, step in enumerate([
            "Open the camera on your phone",
            "Point it at this code \u2014 no app needed",
            "Tap the link that pops up on screen",
        ]):
            if j >= len(steps_old):
                continue
            anchor = steps_old[j]
            back_line(anchor, step, "sans", 9.5, "right", color=(0.24, 0.22, 0.33))
            for s in block:
                if s["text"].strip() == BULLET and abs(pymupdf.Rect(s["bbox"]).y0 - pymupdf.Rect(anchor["bbox"]).y0) < 6:
                    Fb = FONTS["sans"]
                    bb = pymupdf.Rect(s["bbox"])
                    mb = metrics(Fb, 10.0)
                    put(back, Fb, BULLET, 10.0, color_of(heading[0]) if heading else (0.02, 0.59, 0.41),
                        (bb.x1, bb.y1 - mb[0]), rotated=True, m=mb)
        back_line(tail[0] if tail else None,
                  f"you\u2019ll land on {card['name']}\u2019s page \u2014 letter, photo and secrets",
                  "italic", 9.0, "center", color=(0.49, 0.46, 0.58))

        if card["fix_heading"] and remember:
            Fh = FONTS["sans-bold"]
            sp = remember[0]
            base_y, bbox, m = line_box(Fh, sp, 9.0)
            track = char_space(Fh, sp, 9.0)
            put(back, Fh, HEADING_FIX, 9.0, color_of(sp), (bbox.x1, base_y),
                rotated=True, track=track, m=m)

        for link in list(back.get_links()):
            if link.get("kind") == pymupdf.LINK_URI:
                back.delete_link(link)
        back.insert_link({"kind": pymupdf.LINK_URI, "from": qr_back + (-13, -13, 13, 13), "uri": url})

        print(f"   card {i+1}: {card['name']:<16} → …/teacher.html?id={card['id']}")

    doc.set_metadata({**doc.metadata, "title": "Teachers\u2019 Day Cards \u2014 set of 5 (A4 fold)"})
    out = PDF_PATH
    doc.save(out + ".tmp", garbage=4, deflate=True, clean=True)
    doc.close()
    os.replace(out + ".tmp", out)
    print(f"\ndone → {os.path.basename(out)}  ({os.path.getsize(out)/1024:.0f} KB)")
    return 0


def union_spans(spans):
    """A fake span whose bbox covers a group (keeps line_box() simple)."""
    r = union(spans)
    src = spans[0]
    return {"bbox": tuple(r), "size": src["size"], "color": src["color"], "text": src["text"], "font": src["font"]}


if __name__ == "__main__":
    sys.exit(main())
