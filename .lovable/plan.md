
## Goal (what “a frame around the image like a painting” means in this UI)
Make the featured image feel *mounted inside* a decorative frame:
- The decorative PNG should be visible as the outer border (50% opacity).
- The photo should **not** be covered by the frame artwork (no ornament overlay on top of the photo area).
- The whole framed unit should read as one “painting”: slight mat/inset + subtle depth/shadow.

## What’s going wrong with the current implementation
Current structure (from `FeaturedEssay.tsx`) uses an absolute “frame layer” with a `backgroundImage` and then places the photo inside via padding.

That can still look wrong when:
1. **Aspect ratio mismatch** between the container and the frame PNG’s intended proportions. When we stretch the frame with `backgroundSize: '100% 100%'`, the transparent “window” may no longer line up with the padded inset, so the ornament can appear to intrude into the photo area or feel misaligned.
2. **Padding-only inset is not sufficient** to guarantee the frame’s inner window stays clear across responsive widths/heights, especially with `max-h-[400px]` on the image (height clamps, width can vary).
3. The “painting” effect usually needs a **mat + depth**: a background mat color, a small inner border, and a gentle shadow so the frame reads as an object surrounding the image (not just a graphic behind it).

## Implementation approach (robust, “painting-like”)
### A) Normalize the framed block’s geometry
Make the framed unit have a predictable aspect ratio (or at least predictable behavior), so the frame PNG scales consistently:
- Wrap the framed image in a container that controls aspect ratio.
- Use `aspect-[X/Y]` (Tailwind) or a fixed ratio derived from the frame PNG proportions.
- The *photo* should fill the inner window with `object-cover`.

If we don’t know the intended ratio, we’ll implement:
- A safe default ratio close to typical editorial imagery (e.g. `aspect-[16/10]` or `aspect-[4/3]`)
- And ensure it degrades gracefully on very wide/narrow screens.

### B) Use a “frame shell” + “inner window” (no overlay on photo)
Instead of putting the frame in an absolute overlay, treat the frame as the *outermost shell* and put the photo in a nested “window”:

Structure:
```text
Link
  OuterWrapper (centers, max width)
    FrameShell (relative, background frame PNG at 50% opacity, provides padding)
      MatLayer (optional: parchment/cream background + inner border)
        Photo (object-cover, full opaque, hover scale)
```

Key detail:
- The frame PNG is applied to `FrameShell` as a **background image** (not an overlay layer).
- The frame fades via `opacity` applied to a pseudo-layer is tricky because opacity affects children; so instead we’ll:
  - Keep children fully opaque
  - Fade the frame via a dedicated background layer using an absolutely positioned element but **behind everything**, *and then* clip/photo inset is handled by a separate inner window.
  - Or use CSS `background-color` + `background-image` combined with alpha-friendly rendering (best effort), but the reliable way is a dedicated “frame background layer” that doesn’t change photo opacity.

### C) Add “painting depth”
Add subtle realism:
- `shadow` on the whole frame block (`shadow-elegant` or a custom soft shadow).
- A thin “mat” border inside the frame window (e.g. `ring-1 ring-border/40`).
- A slightly warm mat background (`bg-secondary/40` or `bg-card`) behind the photo so the photo doesn’t visually merge into the frame opening.

### D) Tuning controls (no more guessing)
Introduce named constants (in the component) for:
- `FRAME_INSET_PERCENT` (e.g. 9% instead of 8%)
- optional `FRAME_OUTSET_PERCENT` (slight negative inset to let the frame protrude beyond the photo region, if needed)
- `ASPECT_RATIO_CLASS` (e.g. `aspect-[4/3]`)

This makes it easy to adjust until it matches the screenshot reference.

## Concrete code changes (what I will edit)
### 1) Update `src/components/home/FeaturedEssay.tsx`
Replace the current “padding + absolute frame background” block with a 3-layer composition:

- **Outer**: `relative max-w-2xl mx-auto`
- **FrameShell**:
  - `relative w-full aspect-[4/3]` (initial default; we’ll pick the best match after comparing to your frame image proportions)
  - `overflow-visible` (frame can breathe)
- **Frame background layer** (does not affect photo opacity):
  - `absolute inset-0 pointer-events-none`
  - background image: `baroqueFrame`
  - `opacity-50`
  - `bg-no-repeat bg-center`
  - `bg-[length:100%_100%]` (or `backgroundSize: '100% 100%'`)
- **Inner window** (the “opening”):
  - `absolute inset-[X%]` rather than padding-based layout (more predictable than padding)
  - `overflow-hidden` (ensures the photo stays within the window)
  - `bg-card` (mat)
  - `ring-1 ring-border/40` (subtle inner border)
- **Photo**:
  - `w-full h-full object-cover`
  - hover scale applies to photo only

This change ensures the “frame surrounds photo” because the photo is constrained to the inner window area, and the frame art lives in a separate layer.

### 2) (Optional) Add a tiny caption-like spacing under the frame for realism
If desired: small “plaque” spacing or subtle divider, but we can skip unless you ask.

## Verification steps (what you should see on `/`)
1. The featured image appears *smaller than* the overall framed block (because it sits inside the frame window).
2. The frame ornament is visible around the outside at ~50% opacity.
3. No ornament pattern sits on top of the photo area (photo stays clean).
4. On hover, only the photo subtly scales; the frame stays static.

## Edge cases & how we’ll handle them
- **No featured image**: current “Essays Coming Soon” remains unchanged.
- **Very tall/wide images**: `object-cover` will crop gracefully inside the window.
- **Responsive widths**: aspect ratio keeps the frame stable; window inset uses percentage so it scales with the frame.

## Open question (non-blocking, but improves accuracy)
Even though you skipped questions: the only thing that materially affects “perfect painting look” is the frame’s intended aspect ratio.
- If your frame PNG is designed for a specific ratio (e.g. closer to 3:2 vs 4:3), we’ll set the container ratio to match so the opening aligns naturally.
- If you want, you can tell me: “prefer portrait” or “prefer landscape” and I’ll pick the correct default ratio immediately.

## Files involved
- `src/components/home/FeaturedEssay.tsx` (primary change)
- No backend changes needed
