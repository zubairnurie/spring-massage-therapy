# Photo Tips for Shooting the Studio Yourself

A practical guide for shooting your own photos for the Spring Massage website with the Fujifilm X-T5 and the 16-50mm kit lens. No photography theory, no gear lust — just what to point the camera at and what to set it to.

---

## What to Shoot

In rough priority order. Aim for horizontal framing (16:9 or 3:2) on anything that might end up in the hero slideshow — vertical shots get cropped badly there.

### 1. Hero candidates (most important)

These are the big rotating images at the top of the homepage. They need to feel calm, intimate, and not stocky. Three strong candidates:

- **Hands giving massage** with candles in soft focus behind them. Close-ish crop. The hands are the subject, everything else is mood.
- **Hot stones being placed on a back.** Stones in sharp focus, back slightly soft. Steam if you can manage it.
- **Wide treatment-room shot** with a body on the table, lit by candle and window only. Shows the space and the work in one frame.

Shoot all three if you can. Each one is a different chapter of what you do, and the slideshow benefits from variety.

### 2. Studio interior — fresh round

The current interior shots are fine but they're getting tired. A fresh batch makes the whole site feel newer without redesigning anything. Wide shots from the doorway, mid shots of the table dressed and ready, corners and details.

### 3. Detail shots

Small, intimate, texture-driven. Think:

- Salt lamp glowing
- Oil bottle with a drop running down the side
- Folded towels stacked
- Flowers, books, ceramics — anything with texture and warmth

These fill out gallery sections and slot well between bigger images.

### 4. Tudor manor exterior at golden hour

One or two clean shots of the building from the front, golden hour only. The current site already leans heavily on the building — you don't need many. One great shot beats five mediocre ones.

### 5. Portrait of you

Editorial, not corporate. Looking slightly off-camera, soft natural light, in the studio or a doorway. This goes on the About page and probably a few other places. Worth 20 minutes of effort.

### What to skip

- **More building exteriors.** It's already over-represented. One new one is plenty.
- **Generic decor shots with nothing human in them.** A photo of a candle by itself is filler. A photo of a candle next to hands or a body has a story.
- **Posed "therapist smiling at camera" shots.** They read as stock and clash with the editorial tone the rest of the site has.

---

## Light First, Settings Second

Light is 80% of the result. If the light is good, almost any setting works. If the light is bad, no setting saves it.

### Exterior

Shoot 30 minutes before sunset. The light is warm, low, and forgiving — the manor's stonework looks its best then. Avoid midday (harsh, flat) and overcast (the building goes grey).

### Interior

Late afternoon. **Lights off.** Just candles, the salt lamp, and whatever comes through the windows. Yes, it'll look dim to your eye — the camera handles it better than you think, and the resulting mood is what makes the photos feel like *your* studio and not a stock library.

If it's genuinely too dark to focus, you can bounce an off-camera flash off the ceiling for a soft fill. But try without first.

### Embrace shadows

Don't try to light every corner evenly. Shadows read as intimate and premium. Bright and even reads as clinical. The cream/coral palette of the website wants warm pools of light, not fluorescent uniformity.

---

## Camera Settings

Set these once at the start of the shoot and mostly forget them.

### File format

**RAW + JPEG**, not just RAW. The JPEG gives you a finished-looking preview using the film simulation; the RAW gives you flexibility to fix things later.

### Mode

**Aperture priority (A on the dial).** You pick the aperture, the camera picks the shutter speed. This is the right mode for 95% of what you'll shoot.

### ISO

**Auto ISO, max 3200.** The X-T5 handles 3200 cleanly. Higher than that and noise starts showing. If the camera wants to go higher, the room is too dark — add a candle or open a curtain.

### Aperture (the f/ number — controls how blurry the background is)

- **f/2.8 to f/4** for hands, details, hot stones, anything close-up. Soft background, subject pops.
- **f/5.6 to f/8** for wide interior shots. Keeps the whole room sharp.
- **f/4** for portraits. Sharp face, soft background, forgiving on focus.

### White balance

**Auto (AWB).** You're shooting RAW — you can correct it perfectly in Lightroom. Don't overthink it on the day.

### Shutter speed

If the camera picks anything below **1/60s** handheld, you'll see motion blur. Watch the bottom of the viewfinder. If it dips below 1/60, raise the ISO ceiling, open the aperture wider, or brace against a wall.

### Autofocus

- **Single-point AF** (not zone, not wide). You pick exactly where it focuses.
- For portraits: focus on the **eye nearest the camera**. The X-T5 has eye-detect — turn it on.
- For treatment shots: focus on the **hands or stones**, not the body.

---

## Film Simulations

The X-T5's film sims are part of why Fuji is worth shooting. Three to use, ignore the rest:

### Classic Chrome — your default

Slightly desaturated, warm shadows, magazine-editorial feel. Use this for almost everything: interiors, details, hero candidates. It's the look that matches the website's whole aesthetic.

### Astia (Soft) — for portraits and skin

Flatters skin tones without going pink or plasticky. Use for the portrait of you and any treatment shot where skin is the subject.

### Eterna — for atmospheric interiors

Cinematic, lifted shadows, muted colours. Use it for the candlelit wide shots where you want mood over accuracy.

### A note on RAW + film sims

Because you're shooting RAW, the film sim only affects the JPEG preview — the RAW file is always neutral. But the preview is still useful: it helps you see whether the *mood* is working as you compose, even though you'll do the real edit later.

Bonus: **Adobe Lightroom ships free Fuji profiles** that match the in-camera sims. So if you liked the Classic Chrome JPEG out of the camera, you can apply that same look to the RAW with one click.

---

## Editing in Lightroom

Three sliders do 80% of the work. Don't overdo any of them.

### The three sliders

- **Highlights -30, Shadows +20.** Recovers blown walls and ceilings, lifts faces out of shadow without making them look fake.
- **White balance temp 5500-6500K.** Bias warm. Cold white balance reads clinical, which is the opposite of what you want.
- **Saturation -5 to -10, Vibrance +5.** Slightly mutes the overall colour to fit the cream/coral palette, but keeps skin and warm tones alive.

### Avoid

- **Heavy clarity.** Makes skin look weathered and pores look like craters. Leave clarity at 0 or +5 max.
- **Crushed blacks.** Kills the candle glow, which is the whole point of the lighting setup.
- **Cool / teal-orange grading.** It's a beautiful look in cinema and absolutely wrong for this brand.

### Crop and straighten

Always level the horizon. Crooked horizons read as careless. Crop tight when the edges are noisy or busy.

---

## Important: the website's CSS filter

The website applies a subtle desaturation and warmth filter on top of card images:

```
saturate(0.92) sepia(0.04) contrast(1.02)
```

This means card thumbnails get pulled slightly more muted and warm than your edit. So:

- **Edit photos slightly MORE vibrant than you think they need to be.** The filter will pull them back.
- If you edit them already muted, they'll come out muddy after the filter compounds.

**Hero images and the About portrait don't get the filter** — only `.card-img` images do (it's opt-in in the CSS). So those should be edited to look exactly how you want them on the page. The card thumbnails should be edited slightly punchier.

If in doubt: deliver one edit and check it on the live site before processing the whole batch.

---

## A 2-Hour Shooting Plan

Tight but realistic. Do it in this order, because the light dictates the schedule.

### 0:00 - 0:30 — Exterior at golden hour

Get the building shot done first while the light is right. 30 minutes is plenty for one or two strong frames. Front of the manor, slightly off-axis (not dead-on — it looks more like a real photo and less like an estate agent listing).

### 0:30 - 1:00 — Portrait + interior environmentals

You're already outside, so do the portrait next while the light is still warm — in a doorway or by a window. 15 minutes for the portrait, then move inside for wide environmental shots of the studio while the late afternoon light is still strong.

### 1:00 - 1:45 — Treatment shots

The big block. You need a model — friend or partner on the table. Shoot:

- Hands working on shoulders, back, neck (close)
- Hot stones being placed (close + medium)
- Oil being poured into hands (close)
- Wider frames showing the room with the body in it

Shoot more than you think you need. You can edit down later, you can't go back.

### 1:45 - 2:00 — Detail shots

By now the light is dim and you're tired. Detail shots are forgiving — small subjects, you can get close. Salt lamp glowing, oil bottle, towels, flowers.

### Volume

Aim for **200-400 frames** total. Expect to deliver **12-20 hero-grade shots** after editing. That's a normal hit rate — not all of them will be keepers, and that's fine.

---

## One Pragmatic Note

The biggest limitation of shooting yourself isn't the camera or your skill. It's that one person can't easily shoot themselves doing massage on someone else.

If you can bring **a friend to model** on the table and **another friend to hold a reflector** (a piece of white card works) to bounce light onto faces or hands, the quality of the treatment shots jumps significantly. No equipment to buy.

If it's just you, prioritise the interior, details, and exterior — the treatment shots can wait until you have help.

---

## Quick Checklist

Print this or screenshot it for the day:

- [ ] RAW + JPEG enabled
- [ ] Aperture priority mode
- [ ] Auto ISO, max 3200
- [ ] Classic Chrome film sim selected
- [ ] Battery charged, second battery in pocket
- [ ] SD card has space (offload before shooting)
- [ ] Studio tidy, table dressed, candles lit
- [ ] Lights off, blinds open
- [ ] Model arriving in time for the treatment block
- [ ] Phone on Do Not Disturb
