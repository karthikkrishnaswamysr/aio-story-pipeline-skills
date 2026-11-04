# Generate AIO 6.1 JSON from a long script

Use `aio-6.1-observed.schema.json` as a **single-export reference**, not as an official or importer-confirmed contract. It was derived from `The_Torn_Kite_AIO_Story_Pipeline_v6.1.json` (`version: 6.1-L10N-AUDIENCE`): one scene, 25 frames, 10 assets, 25 generation segments, and no generated clips.

## Script-to-JSON workflow

1. Preserve the entire approved script in `fullMarkdown` and `originalUserPrompt`; the sample had identical values. Put a concise synopsis in `narrativeArcSummary`.
2. Create the character, location, and prop inventory in `assets` before writing shot records. Give each asset a unique `id`; use those IDs in each frame's `linkedAssetIds`.
3. Split the script into scenes and shots. In the observed export there is no top-level `scenes` array: scene identity/title/number are repeated on each frame. Keep `sceneId`, `sceneNumber`, `sceneTitle`, and `shotNumber` coherent.
4. Add one generation segment per shot. Each segment's `shotId` must match its corresponding `frame.id`. Keep frame IDs unique and verify every asset link resolves.
5. Use the selected AIO version's observed defaults for `generationMode`, `promptMode`, language, style, and timing. The sample only demonstrates `reference`, `basic`, English, Global, style weight 70, and durations from 5 to 10 seconds; it does not prove these are the only valid values.
6. Preserve the JSON fields and types from the reference where needed, but do not copy the sample story, IDs, media IDs, base64 images, or any nonempty session token into another project.

## Media and validation limits

- Every asset and frame in the sample contains an embedded base64 image and a `mediaId`. A script alone cannot supply real image bytes or valid AIO media IDs. Do not invent placeholders or copy media from the sample. Use a supported asset/frame creation path and insert its actual returned data, or first prove that the AIO importer accepts empty media fields in a disposable project.
- `segments[].clips` was empty for every shot. This reference does not define the shape of generated video clip records; only include clip objects from a current, verified AIO example.
- `sessionToken` was empty. Keep it empty unless the current product explicitly requires a fresh session value.
- JSON Schema validation checks only this observed structure. It cannot prove that AIO will import the file or accept the field values. Before using a long script, test a small one-scene project in a duplicate/disposable project, inspect the imported UI state, and confirm scene/shot counts and asset links. Do not start paid generation during a schema test without the user's approval.
