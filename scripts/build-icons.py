#!/usr/bin/env python3

from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
BUILD_DIR = ROOT / "build"
ICONSET_DIR = BUILD_DIR / "icon.iconset"
PNG_PATH = BUILD_DIR / "icon.png"
ICO_PATH = BUILD_DIR / "icon.ico"
ICNS_PATH = BUILD_DIR / "icon.icns"

SIZE = 1024
PADDING = 72
RADIUS = 222


def blend(start: tuple[int, int, int], end: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(round(a + (b - a) * t)) for a, b in zip(start, end))


def rounded_mask(size: int, padding: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(
        (padding, padding, size - padding, size - padding),
        radius=radius,
        fill=255,
    )
    return mask


def vertical_gradient(size: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", (size, size))
    pixels = image.load()
    for y in range(size):
        t = y / (size - 1)
        color = blend(top, bottom, t)
        for x in range(size):
            pixels[x, y] = (*color, 255)
    return image


def add_soft_ellipse(
    layer: Image.Image,
    bounds: tuple[int, int, int, int],
    fill: tuple[int, int, int, int],
    blur: int,
) -> None:
    glow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse(bounds, fill=fill)
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    layer.alpha_composite(glow)


def add_soft_polygon(
    layer: Image.Image,
    points: list[tuple[int, int]],
    fill: tuple[int, int, int, int],
    blur: int,
) -> None:
    glow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.polygon(points, fill=fill)
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    layer.alpha_composite(glow)


def draw_icon() -> Image.Image:
    mask = rounded_mask(SIZE, PADDING, RADIUS)
    background = vertical_gradient(SIZE, (45, 25, 18), (10, 8, 7))

    add_soft_ellipse(background, (-80, -40, 560, 520), (241, 145, 64, 155), 120)
    add_soft_ellipse(background, (400, 40, 1080, 760), (79, 34, 22, 120), 160)
    add_soft_ellipse(background, (220, 320, 960, 1080), (7, 8, 13, 160), 150)

    border = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border)
    border_draw.rounded_rectangle(
        (PADDING, PADDING, SIZE - PADDING, SIZE - PADDING),
        radius=RADIUS,
        outline=(255, 217, 168, 60),
        width=8,
    )
    background.alpha_composite(border)

    inner_shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    inner_draw = ImageDraw.Draw(inner_shadow)
    inner_draw.rounded_rectangle(
        (PADDING + 18, PADDING + 18, SIZE - PADDING - 18, SIZE - PADDING - 18),
        radius=RADIUS - 20,
        outline=(0, 0, 0, 150),
        width=36,
    )
    inner_shadow = inner_shadow.filter(ImageFilter.GaussianBlur(18))
    background.alpha_composite(inner_shadow)

    composed = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    composed.alpha_composite(background)
    composed.putalpha(mask)

    shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((330, 196, 696, 736), radius=88, fill=(0, 0, 0, 92))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    composed.alpha_composite(shadow)

    monolith = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    monolith_draw = ImageDraw.Draw(monolith)
    monolith_draw.rounded_rectangle((328, 178, 698, 728), radius=90, fill=(34, 22, 17, 255))
    monolith_draw.rounded_rectangle((344, 194, 682, 712), radius=74, fill=(17, 12, 11, 255))
    monolith_draw.rounded_rectangle((338, 188, 692, 222), radius=28, fill=(78, 46, 30, 110))
    composed.alpha_composite(monolith)

    frame_highlight = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame_highlight)
    frame_draw.rounded_rectangle((334, 184, 692, 722), radius=84, outline=(255, 191, 108, 54), width=6)
    frame_draw.line((368, 220, 368, 676), fill=(255, 233, 206, 20), width=5)
    frame_draw.line((658, 220, 658, 676), fill=(0, 0, 0, 100), width=6)
    composed.alpha_composite(frame_highlight)

    portal_glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    add_soft_polygon(
        portal_glow,
        [(474, 246), (560, 218), (610, 706), (420, 706)],
        (255, 219, 157, 210),
        44,
    )
    add_soft_polygon(
        portal_glow,
        [(430, 694), (606, 694), (754, 884), (246, 884)],
        (255, 167, 69, 210),
        58,
    )
    add_soft_ellipse(portal_glow, (388, 226, 646, 468), (255, 236, 191, 110), 52)
    composed.alpha_composite(portal_glow)

    details = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    details_draw = ImageDraw.Draw(details)
    details_draw.rounded_rectangle((426, 230, 604, 694), radius=52, fill=(19, 13, 11, 230))
    details_draw.polygon(
        [(482, 254), (551, 230), (590, 690), (442, 690)],
        fill=(255, 235, 189, 245),
    )
    details_draw.line((540, 242, 589, 684), fill=(255, 251, 235, 125), width=5)
    details_draw.polygon(
        [(432, 694), (604, 694), (712, 860), (318, 860)],
        fill=(243, 172, 74, 175),
    )
    details_draw.line((372, 722, 664, 722), fill=(255, 204, 133, 62), width=4)
    details_draw.line((316, 860, 712, 860), fill=(255, 195, 126, 36), width=6)
    composed.alpha_composite(details)

    ledge = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ledge_draw = ImageDraw.Draw(ledge)
    ledge_draw.polygon(
        [(238, 740), (786, 740), (726, 836), (298, 836)],
        fill=(22, 14, 12, 180),
    )
    ledge = ledge.filter(ImageFilter.GaussianBlur(2))
    composed.alpha_composite(ledge)

    specks = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    speck_draw = ImageDraw.Draw(specks)
    for index in range(18):
        angle = index * 0.47
        x = 514 + int(math.cos(angle) * (82 + index * 9))
        y = 544 + int(math.sin(angle * 1.7) * (88 + index * 7))
        radius = 3 + (index % 3)
        alpha = 12 + (index % 4) * 6
        speck_draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(255, 235, 205, alpha))
    specks = specks.filter(ImageFilter.GaussianBlur(2))
    composed.alpha_composite(specks)

    composed.putalpha(mask)
    return composed


def save_pngs(image: Image.Image) -> None:
    BUILD_DIR.mkdir(exist_ok=True)
    image.save(PNG_PATH)

    if ICONSET_DIR.exists():
        shutil.rmtree(ICONSET_DIR)
    ICONSET_DIR.mkdir()

    sizes = [
        ("icon_16x16.png", 16),
        ("icon_16x16@2x.png", 32),
        ("icon_32x32.png", 32),
        ("icon_32x32@2x.png", 64),
        ("icon_128x128.png", 128),
        ("icon_128x128@2x.png", 256),
        ("icon_256x256.png", 256),
        ("icon_256x256@2x.png", 512),
        ("icon_512x512.png", 512),
        ("icon_512x512@2x.png", 1024),
    ]

    for name, size in sizes:
        resized = image.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(ICONSET_DIR / name)

    image.save(
        ICO_PATH,
        sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )


def build_icns() -> None:
    subprocess.run(
        ["iconutil", "-c", "icns", str(ICONSET_DIR), "-o", str(ICNS_PATH)],
        check=True,
    )
    shutil.rmtree(ICONSET_DIR)


def main() -> None:
    icon = draw_icon()
    save_pngs(icon)
    build_icns()


if __name__ == "__main__":
    main()
