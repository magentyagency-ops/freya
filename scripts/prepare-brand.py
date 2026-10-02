"""Trace the supplied official FREYA / SP mark without changing its lettering.

Run manually with Pillow installed. The regular site build needs no Python.
"""
from pathlib import Path
from collections import defaultdict
from PIL import Image

assets = Path(__file__).resolve().parents[1] / 'src/assets/brand'
source = Image.open(assets / 'freya-sp-mark.png').convert('L')
binary = source.point(lambda p: 255 if p < 140 else 0)
box = binary.getbbox()
box = (box[0] - 8, box[1] - 8, box[2] + 8, box[3] + 8)
mask = binary.crop(box)
w, h = mask.size
px = mask.load()
edges = defaultdict(list)
filled = lambda x, y: 0 <= x < w and 0 <= y < h and px[x, y] != 0
for y in range(h):
    for x in range(w):
        if not filled(x, y):
            continue
        if not filled(x, y - 1): edges[x, y].append((x + 1, y))
        if not filled(x + 1, y): edges[x + 1, y].append((x + 1, y + 1))
        if not filled(x, y + 1): edges[x + 1, y + 1].append((x, y + 1))
        if not filled(x - 1, y): edges[x, y + 1].append((x, y))

def simplify(points, tolerance=.55):
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = (dx * dx + dy * dy) ** .5
    distances = [abs(dx * (a[1] - p[1]) - dy * (a[0] - p[0])) / length if length else ((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2) ** .5 for p in points]
    i = max(range(len(points)), key=distances.__getitem__)
    if distances[i] <= tolerance:
        return [a, b]
    return simplify(points[:i + 1], tolerance)[:-1] + simplify(points[i:], tolerance)

paths = []
while edges:
    start = next(iter(edges))
    current, points = start, [start]
    while True:
        next_point = edges[current].pop()
        if not edges[current]: del edges[current]
        points.append(next_point)
        current = next_point
        if current == start: break
    area = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(points, points[1:]))) / 2
    if area < 5: continue
    points = simplify(points)
    paths.append('M' + 'L'.join(f'{x},{y}' for x, y in points[:-1]) + 'Z')

svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="currentColor"><path fill-rule="evenodd" d="{" ".join(paths)}"/></svg>\n'
(assets / 'freya-sp.svg').write_text(svg)
# Alpha extraction also provides a transparent raster copy for external use.
gray = source.crop(box)
alpha = gray.point(lambda p: round(max(0, min(1, (235 - p) / 205)) * 255))
for name, color in [('freya-sp-transparent.png', (17, 20, 23)), ('freya-sp-white.png', (255, 255, 255))]:
    rgba = Image.new('RGBA', gray.size, color + (0,))
    rgba.putalpha(alpha)
    rgba.save(assets / name)
# The official F is used at small icon sizes.
f = alpha.crop((0, 0, 155, alpha.height))
f = f.crop(f.getbbox())
tile = Image.new('RGBA', (180, 180), (6, 9, 13, 255))
f.thumbnail((106, 126), Image.Resampling.LANCZOS)
white = Image.new('RGBA', f.size, (255, 255, 255, 0))
white.putalpha(f)
tile.alpha_composite(white, ((180 - f.width) // 2, (180 - f.height) // 2))
tile.convert('RGB').save(assets / 'apple-touch-icon.png')
print(f'Official logo: {w} × {h}, {len(paths)} traced contours.')
