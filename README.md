# Tutorial: Make Videos with Claude Code + Remotion

How to create programmatic videos with Remotion (React rendered into MP4), where **Claude Code writes all the code for you**. You describe the video you want in plain language, Claude writes the React components, and Remotion renders them into an MP4 file.

Everything this tutorial uses is the official open source Remotion project on GitHub:

- **The main project:** [github.com/remotion-dev/remotion](https://github.com/remotion-dev/remotion)
- **The official skills for Claude Code:** [github.com/remotion-dev/skills](https://github.com/remotion-dev/skills), with the main skill named `remotion-best-practices`
- **The official documentation:** [remotion.dev/docs](https://www.remotion.dev/docs), with the skills page at [remotion.dev/docs/ai/skills](https://www.remotion.dev/docs/ai/skills)

This tutorial repository itself contains only three things: this complete tutorial, a copy-paste prompt bank in [`PROMPTS.md`](PROMPTS.md), and one small example composition in the [`example/`](example/) folder, written specifically for this tutorial. No other project files are included, and every code reference points to the official open source repositories above.

---

## How it works, in short

- **Remotion** is an open source React framework: one video is one React component. Remotion opens that component in Chromium, photographs it frame by frame, and stitches the frames into an MP4.
- Because a video is code, every animation must be **deterministic**: how an element looks at frame N may only depend on the frame number, never on clocks or timers. That is why animations are written from `useCurrentFrame()` with `interpolate()` and `spring()`, not CSS animations.
- **Claude Code + the official Remotion skills** write the code. The official skills teach Claude the rules of Remotion (frame-based animation, sequencing, rendering, audio, captions, and more), so the code it writes is correct by construction, not just plausible in a preview.

## Prerequisites

| Requirement | Notes |
| --- | --- |
| Node.js 18 or newer | Check with `node -v` |
| npm | Ships with Node.js |
| Claude Code | Installed and signed in (`claude` in your terminal) |
| ffmpeg | Optional, for verifying renders (ffprobe and frame extraction) |
| Disk space | About 500 MB for node_modules and Remotion's bundled Chromium |

---

## Step 1: Install the official Remotion skills into Claude Code

The official skills are published by the Remotion team in the [remotion-dev/skills](https://github.com/remotion-dev/skills) repository. Pick one install method:

**Method A, from inside a Remotion project (easiest):**

```bash
npx remotion skills add
```

**Method B, the general skills CLI, from any folder:**

```bash
npx skills add remotion-dev/skills
```

To install only the main skill:

```bash
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
```

**Method C, as a Claude Code plugin:**

```bash
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
```

Once installed, invoke the skill inside Claude Code with a slash command, for example:

```text
/remotion-best-practices Make a promo video for a record store
```

The `remotion-best-practices` skill is an umbrella that covers the other Remotion skills (creating projects, markup and animation, the Studio, rendering, documentation lookup). The full list lives on the official [Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills) page.

## Step 2: Create a Remotion project from scratch

The official way, using the scaffolding from the open source project:

```bash
npx create-video@latest
```

Follow the prompts (the blank template is enough), then enter the project folder and run `npm install` if asked.

Or the fully manual way, with no scaffolding:

```bash
mkdir my-video
cd my-video
npm init -y
npm install remotion @remotion/cli react react-dom
mkdir src
```

Or start from the small example in this repository:

```bash
cp -r example/* my-video/
cd my-video
npm install
```

## Step 3: Understand the three core files

A minimal Remotion project needs only three files in `src/`.

**`src/index.ts`**, the entry point that registers the root:

```tsx
import {registerRoot} from 'remotion';
import {Root} from './Root';
registerRoot(Root);
```

**`src/Root.tsx`**, the video declaration: id, duration, fps, and size:

```tsx
import React from 'react';
import {Composition} from 'remotion';
import {HelloExample} from './Composition';
export const Root: React.FC = () => (
  <Composition id="HelloExample" component={HelloExample} durationInFrames={300} fps={30} width={1920} height={1080} />
);
```

300 frames at 30 fps means a 10 second video. For vertical Shorts or Reels, set `width` to 1080 and `height` to 1920.

**`src/Composition.tsx`**, the video itself. The basic patterns:

- `AbsoluteFill` is the canvas of one scene.
- `Sequence from={...} durationInFrames={...}` cuts the composition into consecutive scenes.
- `useCurrentFrame()` returns the current frame number. Every movement is computed from this number.
- `interpolate(frame, [start, end], [fromValue, toValue])` maps frames to animation values, always with `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` so values never run out of range.
- `spring({frame, fps, config})` produces natural, bouncy motion for things like text entrances.

The full code of this tutorial's example composition (2 scenes: a title entering with a spring, then an animated progress bar) is in [`example/src/Composition.tsx`](example/src/Composition.tsx). For much larger examples, read the source of the official project at [remotion-dev/remotion](https://github.com/remotion-dev/remotion) and the templates in its documentation.

## Step 4: Ask Claude Code to write your video

Open Claude Code in the project folder, make sure the official skills are installed, then describe the video as clearly as you would to a person. A good prompt states: size and orientation, duration, scene by scene content, the exact text, colors, and motion style.

Main example prompt:

```text
Use the official remotion-best-practices skill. Create a Remotion composition named PromoProduk, 1920x1080, 30 fps, 450 frames (15 seconds), in src/Composition.tsx and register it in src/Root.tsx.

Scene 1 (frames 0-150): kinetic text in the center of the screen. The word "VIDEO" in very large white letters enters with a spring, then "FROM CODE." in pink below it, then a small line "No camera. No manual timeline."
Scene 2 (frames 150-300): the title "One React component = one video", then 4 horizontal animated bars labeled Script 92, Animasi 76, Render 88, Upload 64, each animating its width and its percentage counter from 0.
Scene 3 (frames 300-450): a rotating circle enters with a spring, the text "REMOTION", and the subtitle "React rendered into MP4".

Dark blue gradient background. All animation must come from useCurrentFrame with interpolate and spring, no CSS transitions. When done, render it and verify the result with ffprobe and 3 extracted frames.
```

More ready-to-use prompt variations live in [`PROMPTS.md`](PROMPTS.md): a vertical video for Shorts, a data chart from your own numbers, a channel intro, a lower third, and a countdown video.

Polish rule: ask for changes one at a time, in the language of the result, not the code. "Scene 2 is too fast, add a 15 frame gap between the bars" works far better than editing numbers yourself before you understand the pattern.

## Step 5: Preview before you render

```bash
npx remotion studio src/index.ts
```

Remotion Studio opens in your browser: scrub the playhead, inspect every frame, and tweak values in the props panel. Only run a full render once the preview looks right, because a 1080p render takes several minutes.

For a fast check of a single frame without a full render:

```bash
npx remotion still src/index.ts HelloExample out/frame-check.png --frame=60
```

## Step 6: Render the MP4

```bash
npx remotion render src/index.ts HelloExample out/hello-example.mp4
```

**Note for Linux servers, VPS machines, and headless VMs:** Remotion's bundled Chromium download sometimes stalls on certain networks. If a render hangs at the browser download step, point it at another Chromium that already exists on the machine, for example the Playwright headless shell:

```bash
npx remotion render src/index.ts HelloExample out/hello-example.mp4 \
  --browser-executable /path/to/chrome-headless-shell
```

And if `npx remotion` complains that it cannot determine the executable, the install is incomplete. Reinstall the core packages, then call the local binary:

```bash
npm install @remotion/cli remotion react react-dom
./node_modules/.bin/remotion render src/index.ts HelloExample out/hello-example.mp4
```

## Step 7: Verify the result

Never trust a render just because it printed success. Check two things:

```bash
# 1. The file is valid, with the right duration and resolution
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,codec_name out/hello-example.mp4

# 2. The frames actually look right: extract one frame per scene
ffmpeg -y -ss 2 -i out/hello-example.mp4 -frames:v 1 frame-1.png
ffmpeg -y -ss 7 -i out/hello-example.mp4 -frames:v 1 frame-2.png
```

Open those PNGs. If the text, colors, and scene order match the plan, the video is done.

---

## The golden rules of Remotion animation

1. **One source of truth: the frame number.** Every movement is computed from `useCurrentFrame()`.
2. **Forbidden inside a composition:** CSS `transition`, CSS `animation`, `setTimeout`, `setInterval`, and random values (`Math.random()`). All of them make frames inconsistent, and renders flicker or land in the wrong position.
3. **Always clamp `interpolate`** at both ends.
4. **Entrances feel alive with `spring`**, not linear slides. Tune `damping` and `stiffness` for heavy or light motion.
5. **One scene per component, cut with `Sequence`.** The total composition duration is the sum of its scenes.
6. **Render a still first, the full video second.** It saves a lot of time.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Render hangs while downloading Chromium | The bundled browser download stalls | Use `--browser-executable` pointing at an existing Chromium or Playwright headless shell |
| `npx remotion` cannot find the executable | Incomplete package install | `npm install @remotion/cli remotion react react-dom`, then use `./node_modules/.bin/remotion` |
| Animation flickers or jumps | A CSS transition, a timer, or `Math.random()` inside the composition | Replace all of them with calculations from `useCurrentFrame()` |
| Text overflows the screen | Font size and padding ignore the composition width | Reduce the font, add `padding` to `AbsoluteFill`, check with still renders at several frames |
| Blurry output | Composition resolution below the target | Match `width` and `height` in `Root.tsx` to the final target (1920x1080 or 1080x1920) |
| Very slow renders | Long composition at full resolution | Draft at 720p with `--scale=0.5`, render full resolution only for the final |

## Video ideas that fit this pattern

- Channel intros and bumpers (logo, title, music)
- Data videos: animated bars, counters, and rankings driven by real numbers
- Kinetic typography for Shorts and Reels (vertical 1080x1920)
- Product promos: screenshots plus benefit text entering in turn
- Lower thirds, title cards, and transitions for regular recorded video

## Repository structure

```text
.
├── README.md         This tutorial
├── PROMPTS.md        Copy-paste prompt bank for Claude Code
└── example/
    ├── package.json  Example dependencies
    └── src/
        ├── index.ts        Entry point
        ├── Root.tsx        Composition declaration
        └── Composition.tsx A 2-scene example composition, written for this tutorial
```

## Official sources

- The Remotion open source project: https://github.com/remotion-dev/remotion
- Official skills for AI agents: https://github.com/remotion-dev/skills
- Documentation: https://www.remotion.dev/docs
- Agent Skills page: https://www.remotion.dev/docs/ai/skills

## License

The tutorial and examples in this repository are MIT licensed. Remotion is a separate project with its own license, see its official repository above.
