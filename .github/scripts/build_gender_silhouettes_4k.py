from pathlib import Path
import cv2
import numpy as np
from PIL import Image
from rembg import remove, new_session

ROOT = Path('.')
OUT = Path('silhouettes')
FILES = [
    '01-debutant.webp','05-debrouillard.webp','10-chasseur.webp','15-hustler.webp',
    '20-pro.webp','30-elite.webp','40-cyber-looter.webp','50-rise-looter.webp'
]

human = new_session('u2net_human_seg')
general = new_session('isnet-general-use')


def build_one(src: Path, out: Path, stage_name: str):
    original = Image.open(src).convert('RGBA')
    w, h = original.size
    if (w, h) != (3072, 4096):
        raise RuntimeError(f'{src} must be 3072x4096, got {w}x{h}')

    special = stage_name in {'30-elite.webp','40-cyber-looter.webp','50-rise-looter.webp'}
    session = general if special else human
    cut = remove(
        original,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=238 if special else 244,
        alpha_matting_background_threshold=6 if special else 10,
        alpha_matting_erode_size=2 if special else 4,
    )

    rgba = np.array(cut)
    alpha = rgba[:, :, 3]
    threshold = 14 if special else 28
    mask = np.where(alpha >= threshold, 255, 0).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3,3), np.uint8), iterations=1)

    n, labels, stats, centroids = cv2.connectedComponentsWithStats((mask > 0).astype(np.uint8), 8)
    if n <= 1:
        raise RuntimeError(f'No subject detected in {src}')

    candidates = []
    for lab in range(1, n):
        x, y, bw, bh, area = stats[lab]
        cx, _ = centroids[lab]
        if area < h*w*0.001:
            continue
        centre = max(0.05, 1.0 - abs(cx - w/2)/(w/2))
        tall = bh / h
        score = area * (0.5 + centre) * (0.6 + 3.0*tall)
        candidates.append((score, lab))
    if not candidates:
        raise RuntimeError(f'No central body in {src}')

    main_lab = max(candidates)[1]
    main = np.where(labels == main_lab, 255, 0).astype(np.uint8)
    keep = main.copy()

    dilation = 120 if stage_name == '50-rise-looter.webp' else (72 if special else 24)
    grown = cv2.dilate(main, np.ones((dilation, dilation), np.uint8), iterations=1)
    bx, by, bw, bh, _ = stats[main_lab]
    body_cx = bx + bw/2
    body_top, body_bottom = by, by + bh

    for lab in range(1, n):
        if lab == main_lab:
            continue
        x, y, cw, ch, area = stats[lab]
        cx, cy = centroids[lab]
        if area < h*w*(0.00025 if special else 0.0008):
            continue
        comp = np.where(labels == lab, 255, 0).astype(np.uint8)
        touches = cv2.countNonZero(cv2.bitwise_and(grown, comp)) > 0
        near = special and abs(cx-body_cx) < w*0.49 and y < body_bottom+h*0.14 and y+ch > body_top-h*0.22
        halo = stage_name == '50-rise-looter.webp' and cy < h*0.26 and abs(cx-body_cx) < w*0.31
        wing = stage_name == '50-rise-looter.webp' and y < h*0.72 and abs(cx-body_cx) < w*0.50 and cw > w*0.035
        if touches or near or halo or wing:
            keep = cv2.bitwise_or(keep, comp)

    # Remove only the known typography corners from the source cards; never alter site text.
    keep[:int(h*0.17), :int(w*0.33)] = 0
    keep[int(h*0.915):, :int(w*0.20)] = 0
    keep[int(h*0.915):, int(w*0.80):] = 0
    if stage_name == '50-rise-looter.webp':
        halo_src = mask[:int(h*0.22), int(w*0.26):int(w*0.78)]
        keep[:int(h*0.22), int(w*0.26):int(w*0.78)] = cv2.bitwise_or(
            keep[:int(h*0.22), int(w*0.26):int(w*0.78)], halo_src
        )

    keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((3,3), np.uint8), iterations=1)
    keep = cv2.GaussianBlur(keep, (3,3), 0)

    # Final silhouette: black character on transparent background, same 4K canvas.
    out_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    out_rgba[:, :, 3] = keep
    out_rgba[:, :, :3] = 0
    out.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out_rgba, 'RGBA').save(out, 'PNG', optimize=True)
    print(f'Wrote {out} from {src}')

for gender in ('male', 'female'):
    for name in FILES:
        src_name = name if gender == 'male' else f'female-{name}'
        build_one(ROOT / src_name, OUT / gender / name.replace('.webp', '.png'), name)
