import cv2
import numpy as np

# Read image with alpha channel
img = cv2.imread('/Users/tx/Desktop/3d_portfolio/public/logo.png', cv2.IMREAD_UNCHANGED)

# Create binary mask (alpha > 0 or, if no alpha, just use grayscale inverted)
if img.shape[2] == 4:
    mask = img[:, :, 3]
else:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

h, w = mask.shape

svg_paths = ""
for cnt in contours:
    if len(cnt) < 3: continue
    path = f"M {cnt[0][0][0]} {cnt[0][0][1]} "
    for pt in cnt[1:]:
        path += f"L {pt[0][0]} {pt[0][1]} "
    path += "Z "
    svg_paths += f'<path d="{path}" fill="#FFFFFF" />\n'

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{svg_paths}
</svg>'''

with open('/Users/tx/Desktop/3d_portfolio/public/logo.svg', 'w') as f:
    f.write(svg)

print("SVG created")
