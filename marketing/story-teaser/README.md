# Instagram Story teaser

`inhale-exhale-story-teaser.mp4` — 1080×1920, 60 fps, 24 s, AAC 48 kHz.

Source: `film.html` draws every frame as a pure function of the frame number (`window.render(f)`),
`render.mjs` screenshots it frame by frame with Playwright, and `score.py` synthesises the soundtrack
from the same timeline. To re-render:

```bash
cd marketing/story-teaser
npx tsx ../../scripts/art/export-svgs.tsx cards.json major-17-the-star major-00-the-fool major-01-the-magician major-02-the-high-priestess major-19-the-sun major-18-the-moon major-06-the-lovers
# then build cards.js (window.CARDS = <cards.json>) and fonts.css (Gloock + Bricolage as base64 @font-face)
node render.mjs frames 0 1439 1
python3 score.py
ffmpeg -framerate 60 -i frames/f%04d.png -i soundtrack.wav -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a aac -b:a 256k inhale-exhale-story-teaser.mp4
```

`cards.js`, `fonts.css` and `frames/` are generated and not committed.
