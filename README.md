# AIO Story Pipeline skills

Four separate skill bundles for using the Google Flow AIO Story Pipeline with Codex, Claude, Gemini CLI, and ChatGPT. Each download contains only that platform's `aio-story-pipeline/` skill folder and its references.

## Downloads

- [Codex skill ZIP](releases/aio-story-pipeline-codex.zip)
- [Claude skill ZIP](releases/aio-story-pipeline-claude.zip)
- [Gemini skill ZIP](releases/aio-story-pipeline-gemini.zip)
- [ChatGPT skill ZIP](releases/aio-story-pipeline-chatgpt.zip)

The unpacked versions are in `codex/`, `claude/`, `gemini/`, and `chatgpt/` for inspection or direct installation.
Maintainers can rebuild the labeled ZIPs with `python package_skills.py`.

## Google Flow Stickman & Blocky Videos (ChatGPT)

A separate ChatGPT skill: ChatGPT drives your attached Google Flow tab with Browser Use. It builds reusable characters and voices, plans a short stickman or blocky-avatar film, quotes credits, generates and reviews each shot, and redoes single shots.

- [Download the skill ZIP](releases/flow-stickman-blocky-chatgpt.zip)
- Unpacked: [`chatgpt/flow-stickman-blocky/`](chatgpt/flow-stickman-blocky/)

Install: if Skills are enabled for your workspace, open **Plugins → Skills → Create → Upload from your computer**, choose `flow-stickman-blocky-chatgpt.zip`, and enable it. Then open your Google Flow project in a tab attached to ChatGPT's Browser Use and ask it to use `flow-stickman-blocky`. Availability depends on your plan and workspace settings.

## Google Flow with Claude Code (terminal)

A Claude Code skill: Claude works inside your own, already-open Google Flow project in Chrome. It plans a short story video, makes the reference and start-frame images first (free), reads the credit cost and asks before every paid clip, reviews each shot and redoes only the ones that fail.

- [Download the skill ZIP](releases/google-flow-claude-code.zip)
- Unpacked: [`claude/google-flow-claude-code/`](claude/google-flow-claude-code/)

Install: unzip and copy `google-flow-claude-code/` to `~/.claude/skills/` (user) or `.claude/skills/` in your project. Then:

1. In Chrome, open `chrome://inspect/#remote-debugging` and turn remote debugging on (click Allow if Chrome asks).
2. Open your Google Flow project in that Chrome.
3. In Claude Code: "Use google-flow-claude-code. Remote debugging is on. Find my Flow project and tell me my credits."

Turn remote debugging off when you're done: while it's on, local programs can control that Chrome window.

**Using the Claude in Chrome extension instead?** No skill needed. Open the Claude side panel next to your Flow project and paste a prompt like:

```text
You're working in my open Google Flow project. Plan a short silent film from this storyline: [your storyline]. 6 shots of 6 seconds, 16:9. For each shot give a start-frame image, a motion prompt and the sound, then stop and wait for my OK.
After OK: make the start frames in Image mode (check it says 0 credits), using my character and location images as references, and show them to me.
After I approve: switch to Video, Frames, 360p, 6 s, x1, tell me the credit cost and wait for "go". Make one shot first, then the rest one at a time.
Never type into a clip's edit box (URL with /edit/) — that edits the clip and costs credits.
```

## Google Flow with browser-use (Claude Code): code film to Flow

The skill from TechGyro's "Claude Code animation -> Google Flow" video. Claude Code drives your own signed-in Chrome over
remote debugging with the `browser-use` CLI: it uploads the first and last frames of a code-built film, restyles each into
a cinematic still with Nano Banana (free), then turns each shot into a Frames clip on Omni, reading the credit cost and
asking before every clip. It includes the fixes for Flow's "unusual activity" block and the frame/clip-length lessons.

- [Download the skill ZIP](releases/flow-browser-use-claude-code.zip)
- Unpacked: [`claude/flow-browser-use/`](claude/flow-browser-use/)

Install: `uv tool install browser-use==1.0.4`, then unzip and copy `flow-browser-use/` to `~/.claude/skills/`.

1. In Chrome, open `chrome://inspect/#remote-debugging` and turn remote debugging on.
2. Open your Google Flow project in that Chrome.
3. In Claude Code: "Here's my Flow project [URL]. Remote debugging is on. Use the flow-browser-use skill. Restyle the first
   and last frame of each shot into a cinematic still, then make each shot a clip with Frames. Test one shot at 360p
   first, and ask me before every clip. Budget: 200 credits."

Turn remote debugging off when you're done.

## Google Flow Tools Manager (userscript)

A browser userscript for Google Flow's **Tools** page (My Tools, Community, Templates). If you build tools in Flow, every
version of every tool shows up as its own card. This turns the page into one entry per tool, with all its versions grouped
underneath (latest first). It only changes how the page looks in your own browser: it doesn't send data anywhere,
and settings (stars, view, filters) are saved locally.

- **List and Cards views**, a search box (press `/`), **All / Mine / Shared** filters, sorting by **Recent / A–Z / Most versions**
- **Latest only**, **Hide remixes**, **Collapse all**, and a live count of tools and builds
- **Hover** a tool to see its versions; **expand** to list them all; **star** tools to pin them to the top
- Flow's own **Open, Edit, Remix and Share** on every row

[Install / download `flow-tools-manager.user.js`](https://github.com/karthikkrishnaswamysr/aio-story-pipeline-skills/raw/main/userscripts/flow-tools-manager.user.js)

Install:
1. Add a userscript manager to your browser: [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/). In Chrome, also turn on **Allow user scripts** for the extension (chrome://extensions → the extension's Details).
2. Click the install link above; the manager opens an install page. Click **Install**.
3. Open Google Flow → **Tools**. The manager appears at the top of the page. Updates arrive automatically from this repo.

Unofficial; not made or endorsed by Google. Flow's page can change at any time, which may break the script until it's updated.
Questions or feature requests: Telegram [@TechGyro](https://t.me/TechGyro).

## Install (AIO Story Pipeline)

### Codex

Unzip and copy `aio-story-pipeline/` into either:

- The current repository: `.agents/skills/aio-story-pipeline/`
- Your user skills folder: `~/.agents/skills/aio-story-pipeline/` (on Windows, `%USERPROFILE%\.agents\skills\aio-story-pipeline\`)

Restart or reload Codex skills if needed. Invoke with `$aio-story-pipeline` or ask Codex to work with a Google Flow AIO Story Pipeline project.

### Claude

For Claude Code, copy the unzipped `aio-story-pipeline/` folder to:

- Project: `.claude/skills/aio-story-pipeline/`
- User: `~/.claude/skills/aio-story-pipeline/`

Use `/aio-story-pipeline` or ask Claude Code to use the skill. For claude.ai/Cowork accounts with Skills enabled, use the Skills settings to upload the ZIP and enable the skill. Availability depends on the product/account.

### Gemini CLI

Clone this repository, then link the unpacked Gemini skill folder:

```sh
git clone https://github.com/karthikkrishnaswamysr/aio-story-pipeline-skills.git
gemini skills link ./aio-story-pipeline-skills/gemini/aio-story-pipeline
```

Or copy the folder into `.gemini/skills/aio-story-pipeline/` (project) or `~/.gemini/skills/aio-story-pipeline/` (user). Run `/skills list` to confirm it was discovered.

### ChatGPT

If Skills are enabled for your workspace, open **Plugins → Skills → Create → Upload from your computer**, choose `aio-story-pipeline-chatgpt.zip`, then enable the skill. Availability and uploading depend on the workspace plan and administrator settings. Otherwise, upload `SKILL.md` and the two files in `references/` to a Project or custom assistant that supports knowledge files, then paste the contents of `SKILL.md` into its instructions. Instructions in the skill refer to browser/computer tools only when those tools are available in your ChatGPT session.

## What the skill does

- Inspects current AIO project state before making changes.
- Plans scenes, shots, continuity, character/prop assets, and reviews comedy/dialogue.
- Helps create long-script AIO 6.1 JSON using an observed schema derived from one export.
- Treats JSON validation as structural; it does not prove AIO will import the file. The skill calls for a small disposable-project import check before relying on generated long-script JSON.
- Verifies scene locks, assembly selection, merge status, and exported playback before reporting completion.
- Includes cautious Flow browser recovery guidance that each platform adapts to its actual available tools.

The AIO schema is an observed reference, not an official or importer-confirmed specification. The source export did not include usable generated clips or reusable media. Do not copy its story, IDs, media IDs, base64 data, or session values into other projects.

## Platform notes

The core workflow is shared. The Codex and Claude versions contain tool-recovery guidance tailored to those environments. Gemini and ChatGPT versions state that browser automation depends on the tools enabled in the active session. A skill cannot add a missing Flow connector or browser-control capability.

This repository shares the skill files publicly. No separate license is granted by this repository at this time; contact TechGyro for reuse permission.

## Official platform documentation

- [Codex skills](https://developers.openai.com/codex/skills/)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Gemini CLI Agent Skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/using-agent-skills.md)
- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt/)
