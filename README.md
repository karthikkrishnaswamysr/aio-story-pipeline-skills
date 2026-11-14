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
