---
name: aio-story-pipeline
description: Plan, operate, review, or recover a Google Flow AIO Story Pipeline project from script and assets through shots, scene locks, Assembly, and export. Use for this Flow tool, not NOE Storyboard Studio.
---

# Google Flow AIO Story Pipeline

Work from the actual project state. The pipeline can create a script, asset references, scene and shot frames, video takes, and an assembled film, but a generated take or a started merge is not a verified finished episode.

## Recover the existing Flow connection

- If Codex cannot connect to the user's Google Flow project, consult the documented Chrome runtime/browser integration available in this environment. Reinitialize that runtime when needed, then list the available browser providers and tabs.
- Locate the already-open Flow tab for the requested project and claim that existing tab through the Chrome provider using its documented interface. Confirm the claimed tab is the requested project and inspect its current page state before project actions.
- Do not silently switch to a different browser automation surface, create a duplicate tab, change browser/security configuration, or claim access succeeded based only on a navigation attempt.
- If the Chrome provider is missing or the tab cannot be claimed, report the exact sanitized error and provider state, then stop Flow-dependent actions.
- Say that the runtime was reinitialized and the existing tab was claimed only after those operations succeeded and the current page confirms the requested project.

## Create AIO 6.1 JSON from long scripts

- When asked to create/import a project JSON, read `references/aio-6.1-script-to-json.md` and `references/aio-6.1-observed.schema.json` first. The schema is inferred from one AIO 6.1 export, not an official or importer-confirmed specification.
- Preserve the full approved script, create coherent assets/frames/segments, use unique IDs, and keep `linkedAssetIds` and segment `shotId` references consistent. Never fabricate base64 media, `mediaId` values, or generated clip objects.
- The reference export has frame and segment records but no top-level `scenes` array; it has 25 shots in one scene. Do not generalize this into a universal scene layout without another verified export.
- Treat JSON Schema validation as structural only. Confirm the import in a disposable/duplicate AIO project and verify its UI state before relying on generated JSON for a long script. Do not begin paid generation during schema validation without user approval.

## Inspect before changing anything

- Identify the intended scene and shot roster, current stage, linked assets, selected takes, locked scenes, and any Assembly job. Count both shots and scenes. A count such as `3/3` may describe one scene, not the whole episode.
- Inspect the current project and its export or handoff when available. Treat a project JSON export as a recovery source only after checking what state it actually contains; embedded media does not prove locks, take selections, or Assembly state are preserved.
- Distinguish this Google Flow AIO Story Pipeline from NOE Storyboard Studio and from Flow MCP. Do not transfer controls, costs, or completion claims across these tools.

## Build and review the story

- Establish the story's scene order and each shot's visible action before generating. Keep an asset ledger for recurring characters, props, locations, vehicles, and their defining features. For important objects, state the exact count and how they move or change.
- Compare refined intent, frame, and animation prompt with the intended shot. Record what the model is allowed to add or change. Check the actual rendered frame and clip before treating prompt text as evidence.
- Use the previous clip's last frame as the next shot's visual anchor when continuity needs it. Inspect scale, silhouette, costume, prop state, and camera direction at the handoff. If a source clip changes, recheck every shot that depends on its final frame.
- For silent shots, explicitly specify no dialogue, speech, narration, music, or sound effects. Review the rendered audio; text instructions alone do not establish silence.
- Keep rejected takes and the reason for rejection visible in the project record. Re-render the affected shot or dependent chain, then review the new take. Track credits and distinguish attempts from accepted clips.

## Comedy and dialogue checks

- A sitcom look and laugh track do not make a scene funny. Before generating, do a separate comedy pass on the script: give each character a distinct comic point of view; build a clear setup, escalation, reversal or payoff; prefer playable physical behavior and reaction beats over exposition; and put the strongest button at the end. Check that each shot has a specific comic turn and enough silence/hold time for the joke to land. Do not add laugh cues to compensate for weak writing.
- Before approving each dialogue render, inspect **FINAL PIPELINE REVIEW**. Some script parsers place the speaker and voice label inside `[DIALOGUE]` (for example, `Maya — Autonoe: ...`), which may be spoken aloud. Replace the field with only the exact utterance; retain the character-to-voice mapping in `[VOICE_PROFILE]` or the pipeline's voice control. Confirm the speaker, voice, language, and utterance, then check the rendered audio for unwanted labels or extra speech.
- Review comedy in the assembled cut as well as in individual shots: listen for pacing, overlap, laugh-track placement, and whether setup/payoff survives the edit. A completed assembly can still fail creatively; record the user's assessment plainly and do not report it as successful just because it rendered.

## Assemble the full episode

1. Open every intended scene. Lock its accepted clips with **Lock All**, then verify that the scene displays the locked state or **Unlock Scene** control.
2. In Assembly, compare the selected scene and clip counts with the intended roster and inspect their order. Do not infer full coverage from a percentage or a `3/3` count alone.
3. Run **Fast Join / Merge Timeline** only for the intended selection. If the browser or control connection detaches, inspect the existing job and output before retrying so a running merge is not mistaken for a failed one.
4. Verify the completed preview or downloaded MP4: start, every scene boundary, last shot, picture, audio, duration, and story order. Report completion only after this check.

## Leave a useful handoff

Record the project and tool version, scene/shot counts, accepted take per shot, locked scenes, continuity dependencies, credits spent, known failures, current Assembly status, final export path, and what was actually verified. For a behind-the-scenes video, capture the real UI and decisions, including failed takes and fixes; do not recreate an unrecorded click path as footage.
