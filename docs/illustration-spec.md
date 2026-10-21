# Illustration specification and production workflow

This is the human-readable companion to [`art/style-spec.json`](../art/style-spec.json) (the machine-readable source of truth, version **1.0.0**) and [`art/cards.definitions.json`](../art/cards.definitions.json) (per-card scenes and required Rider–Waite–Smith symbols).

## Visual direction: Celestial Art Nouveau

- **Palette (strict):** midnight navy `#141B3C` skies and shadows · antique gold `#B8913A` gilding and highlights · warm ivory `#F3E9D2` light, skin and fabric · muted burgundy `#7A2E3A` accents · sparing deep teal-green `#2F5550` foliage. Traditional RWS yellows become gold dawn light; bright reds become burgundy; blues become midnight.
- **Treatment:** richly detailed oil-and-gouache painting with fine ink contours, flowing whiplash curves, halo arcs behind the main figure, botanical ornament (lilies, roses, vines, laurel), celestial motifs (gold stars, crescents, faint constellation lines), warm rim light, matte canvas texture. Inspired by the Art Nouveau poster era; every composition is original.
- **Never:** text or lettering (the only exception is the High Priestess's "B" and "J" pillars), borders, frames, watermarks, collages, photorealism, 3D-render look, neon colour, nudity (figures that are nude in the RWS deck are classically draped; recorded as a deviation in the manifest).

## Card format

Every card is an **individual 2:3 portrait asset**. Consistency of border and title is guaranteed by the pipeline, not by the image model:

1. The illustrator or image model produces **unframed, untitled, full-bleed art** at 2:3, at least 1024×1536.
2. `scripts/art/process.ts` composites one deterministic frame (`scripts/art/frame.ts`) over every card on a 1200×1800 master:
   - antique-gold double border with a star-studded midnight field;
   - an arched window (x 84–1116, top 96, shoulders 360, bottom 1518) through which the illustration shows;
   - a crescent-moon spandrel (left) and an eight-pointed star (right), with botanical whiplash vines;
   - a numeral medallion at the top of the arch (Roman numeral for the Major Arcana, a star for the Minor Arcana);
   - a title plate (y 1538–1744) with the card name set in **Cinzel SemiBold**, auto-sized to fit, in ivory on midnight.
3. Delivery files are written to `public/cards/` as **AVIF, WebP and JPEG at 320, 480, 720 and 1200 px wide**, content-hashed for immutable caching, plus a tiny blurred preview. The app's `TarotCard` component serves them through `<picture>` with `srcset`/`sizes`.

### Safe zones (fractions of the source image)

| Zone | Horizontal | Vertical | Rule |
| --- | --- | --- | --- |
| Visible through the arch | 7–93% | 5–84% | Anything outside is hidden by the frame. |
| Subject area | 12–88% | 12–80% | Every required symbol, face and hand. |
| Calm zones | top-centre 12%, bottom 16% | | Sky, ground, water or foliage only (medallion and title plate overlap here). |

## Prompts

Each prompt in [`art/manifest.json`](../art/manifest.json) is built from the same locked blocks: preamble → card identity → scene → required symbols → style → palette → composition → negative instructions. Regenerate them with `npm run art:manifest` after editing definitions. Prompts change only when the spec version changes.

## Production workflow

```bash
# 1. Generate (or commission) art for a card using its prompt in art/manifest.json.
# 2. Save it as art/source/<card-id>.png (or .jpg/.jpeg/.webp), e.g. art/source/major-00-the-fool.png
# 3. Process it (frames, titles, optimises, updates the manifest and the app's registry):
npm run art:process -- major-00-the-fool --tool "Figma generate_image" --ref "<job id or link>"
# Already-framed art that follows this spec:
npm run art:process -- --mode finished major-00-the-fool
# 4. Review (see checklist) and record the result in art/manifest.json → cards[].review.
```

`art:process` refuses images below 1024×1536, and flags any source that isn't 2:3 as an open correction rather than silently cropping it. A card's `assets` stays `null` until real files exist, and the app shows a labelled "Illustration in production" face until then.

## Review checklist (per card)

Record `pass`/`fail` for each check in the manifest, plus notes and corrections:

- **consistency** — palette, brushwork, lighting and ornament density match the reference cards; reads as the same deck at thumbnail size.
- **symbolism** — every item in the card's `symbols` list is present and correct (handedness, count, colour role).
- **readability** — main figure and symbols read clearly at 320 px wide; title plate crisp.
- **cropping** — nothing important cut by the arch, medallion or title plate.
- **color** — stays within the palette; no off-palette saturated colours.
- **suitDetails** — Minor Arcana: correct number and arrangement of suit emblems; court cards show their role.

**Style reference:** The Fool, The Magician and The High Priestess must be generated, processed and approved first. Their approved masters become the visual reference for the remaining 75 cards. Do not change `style-spec.json` after they are approved; if a change becomes unavoidable, bump `version` and re-review every approved card.

## Current status (kept honest)

- **0 of 78** illustrations have been processed into the app.
- **The Fool** was generated once via Canva's image generator (Canva media `MAHYpKCwVBs`, 1024×1536), from an early version of the prompt. The full-resolution file could not be downloaded from the development environment because its network policy blocks `media.canva.com`. A thumbnail check found the main RWS symbols present. It has not been ingested or reviewed.
- A user-supplied 78-card **collage** was rejected as production art (see `rejectedSubmissions` in the manifest). It is kept only as a reference board at `art/reference/`, and no card was cropped from it.

### The exact remaining artwork step

For each card, starting with `major-00-the-fool`, `major-01-the-magician` and `major-02-the-high-priestess`:

1. Generate an image with the card's `prompt` from `art/manifest.json` at 2:3, at least 1024×1536, using any image tool you have access to (Figma `generate_image`, Canva, Higgsfield, or a commissioned illustrator).
2. Save it to `art/source/<card-id>.png`.
3. Run `npm run art:process -- <card-id> --tool "<tool>" --ref "<reference>"`.
4. Review it against the checklist and set its `review.status` to `approved` (or record corrections) in `art/manifest.json`.
5. Commit `art/source/`, `art/manifest.json`, `public/cards/` and `src/generated/card-art.json`.
