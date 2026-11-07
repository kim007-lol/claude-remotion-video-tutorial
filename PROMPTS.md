# Prompt Bank: Remotion Videos via Claude Code

Use every prompt below from inside a Remotion project folder, with the official Remotion skills (`remotion-best-practices`, from github.com/remotion-dev/skills) installed. Copy, replace the bracketed parts, and paste into Claude Code. Always end with a render and verification request, so the result gets checked instead of stopping at "code written".

## 1. Vertical video for Shorts and Reels

```text
Use the official remotion-best-practices skill. Create a vertical composition, 1080x1920, 30 fps, 270 frames (9 seconds), named PromoVertikal.

Frames 0-90: dark background, one big hook sentence entering word by word with a spring: "Make videos without a camera."
Frames 90-180: three benefit points rise in one after another, one short line each: "Write the code once", "Render it to MP4", "Change the text, render again".
Frames 180-270: a closing card with my channel name "[CHANNEL NAME]" and the line "Follow for the next tutorial".

Bold font, high contrast, safe to read on a phone screen. All animation from useCurrentFrame. Render the final video and verify it with extracted frames at seconds 1, 4, and 8.
```

## 2. Data chart from your own numbers

```text
Use the official remotion-best-practices skill. Create a composition, 1920x1080, 30 fps, 360 frames, named GrafikData, that visualizes the following data as an animated bar chart:

[PASTE YOUR DATA, for example: January 120, February 185, March 240, April 310]

Title on top: "[CHART TITLE]". Each bar grows from 0 to its value with interpolate, the number at the end of each bar counts up as it grows, and the tallest bar gets a different accent color. Leave a 10 frame gap between bars. At the end, show one conclusion sentence: "[CONCLUSION SENTENCE]". Render and verify.
```

## 3. Five second channel intro

```text
Use the official remotion-best-practices skill. Create an intro composition, 1920x1080, 30 fps, 150 frames (5 seconds), named IntroChannel. A simple logo circle (the initials "[INITIALS]" inside a circle) scales in with a spring from the center of the screen, the channel name "[CHANNEL NAME]" appears letter by letter below it, then the tagline "[TAGLINE]" fades in. Color palette: background [BACKGROUND COLOR], accent [ACCENT COLOR], white text. Close with a 15 frame fade out at the end. Render and verify with extracted frames at seconds 1 and 4.
```

## 4. Lower third for recorded video

```text
Use the official remotion-best-practices skill. Create a composition, 1920x1080, 30 fps, 240 frames, named LowerThird, with a transparent background (do not fill the background). At frame 20, a lower third panel slides in from the bottom left: first line the name "[NAME]" in bold, second line the role "[ROLE]" in smaller type, with an accent bar in [COLOR] on the left side of the panel. The panel stays until frame 200, then slides out. Render as a still at frame 60 so I can check how it looks.
```

## 5. Countdown and announcement

```text
Use the official remotion-best-practices skill. Create a composition, 1080x1080, 30 fps, 450 frames, named HitungMundur. The numbers 5 down to 1 appear one at a time in the center of the screen, each scaling in with a spring, then shrinking and disappearing, 60 frames per number. After the last number, show the announcement text: "[ANNOUNCEMENT TEXT]" with the subtext "[ADDITIONAL TEXT]". The numbers cycle through the palette [COLOR 1, COLOR 2, COLOR 3]. Render and verify with 3 extracted frames.
```

## 6. Polishing an existing result

A follow-up prompt after the first render, for any composition:

```text
The last render is good. Change only these three things:
1. Slow down the first scene: add 20 extra frames before the second text enters.
2. Change the accent color from [OLD COLOR] to [NEW COLOR] in every scene.
3. Add a 15 frame fade out to the closing scene.
Do not change anything else. Render again and verify the frames that changed.
```

## Tips for writing video prompts

- Always state: the size (or orientation), the fps, the duration in frames or seconds, and the composition name.
- Write the on-screen text **exactly** inside the prompt. Claude cannot guess the words you want.
- Split the video into scenes with frame ranges. This forces a clean `Sequence` structure.
- Ask for one motion style per element: spring for bouncy entrances, linear interpolate for charts and progress.
- Always end with "render and verify", so Claude checks its own final output.
