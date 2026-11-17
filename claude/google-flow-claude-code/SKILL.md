---
name: google-flow-claude-code
description: Let Claude Code (in the terminal) work inside the user's own, already-open Google Flow project in Chrome via Chrome remote debugging. Plans a short story video, makes free reference and start-frame images first, quotes and asks before every paid clip, reviews each result and redoes single shots. Use when someone asks Claude Code to use, automate or drive Google Flow, make Flow images or videos, or check Flow credits.
---

# Google Flow with Claude Code

You work inside the user's **existing, signed-in Google Flow project tab** in their normal Chrome. Never launch a new browser, never type passwords, never change account, plan or billing settings. If Flow asks for sign-in, stop and let the user sign in, then continue in the same tab.

**Images cost 0 credits. Video costs credits.** Plan first, fix everything in images, then spend on video only after the user approves the price of each clip (or a total budget they gave you).

## Connect
1. The user turns on remote debugging at `chrome://inspect/#remote-debugging` and tells you it's on. Read [references/connect.md](references/connect.md) for attaching, finding controls and reading the cost line.
2. List the tabs and switch to the Flow project tab. Confirm the project name.
3. Read the credit balance (account menu → Google Flow credits), then close the menu.

## The workflow
1. **Story first.** Take the user's storyline. Plan N shots (default 6 × 6 s, 16:9, no dialogue unless asked). For each shot: start-frame description, motion prompt, sound. Show the plan and **wait for OK**. See [references/shots-and-prompts.md](references/shots-and-prompts.md).
2. **References (free).** One reference image per character and per location in Image mode. Check the settings line says **"Generating will use 0 credits"** before submitting. Show them and wait.
3. **Start frames (free).** One start frame per shot with the references attached each time (+ → asset picker → search → check the preview → add). Review every frame against the plan, name the weakest and why, and offer a free redo.
4. **Video (credits).** Video → Frames, the agreed model, resolution and length. Read the live cost line, report it, and **wait for go**. Make one shot first as a test (360p is cheapest), review it, then the rest one at a time unless the user approved a batch or a budget.
5. **Review every clip:** right characters and count, the one action happens, end state, camera, continuity with the previous shot, no text or logos, no speech in a silent shot. Redo only the failing shot.
6. **Finish:** the clips in order, credits used (balance before vs after), what was redone and why, what still looks off. Download or assemble only when asked.

## Rules that save credits
- **Edit-box trap:** clicking a grid tile opens that clip's editor (URL contains `/edit/`). Its prompt box **edits that clip and costs credits**. Never type a new prompt there; if you land in it, clear it without submitting and go back to the project page.
- **Before every submit:** right mode, model, resolution and length → cost read → URL has no `/edit/` → focus is the prompt box → screenshot looked at → submit.
- **Content filter:** if Flow rejects a harmless prompt, find the trigger words (often a vague physical action near someone's hands), describe the motion plainly, retry once. Rejected generations are refunded; confirm in the credit history before retrying.
- **Continuity:** when the next shot keeps the same camera angle, use the previous clip's last frame as its start frame.
- **Watermark:** Flow stills carry a small mark in the bottom-right corner. Keep important detail away from that corner.
- **Budget mode:** if the user gives a credit budget (e.g. "finish within 250"), keep a running total from the cost lines and stop before going over.
- **When done:** remind the user to turn remote debugging off.

## Narration and voices
Omni lip-syncs any voice onto a visible face. For a narrator over a silent character: put the line in a separate Audio section as "Voiceover (V.O.)", keep the character's mouth out of view (profile or back to camera), and avoid expression changes during the line. Most reliable: silent shots plus narration recorded separately and added in an editor. Characters speaking their own lines on camera work well.
