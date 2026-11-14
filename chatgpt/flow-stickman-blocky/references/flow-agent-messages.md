# Native prompt patterns

Use these patterns as text you enter through Browser Use. Set project options in the visible UI and attach the actual references as well as naming them in the direction. Replace all braces with concrete values. Include the chosen style once per request and each relevant character identity once. Adapt its lighting to the approved time of day so the prompt remains consistent. Keep Agent messages around 2,500 characters or less as a writing target. Split a long request at a shot boundary.

## Reference images

**Agent on.** Request the agreed number of separate image assets. Identify each one so you can match the resulting tiles. For example:

    Create only these two reference images. Image 1 is {character identity and distinctive item}, full body, alone on a plain background. Image 2 is an empty {location, layout, key prop, colours and light}. Stop after the images. {Style sentence}

**Agent off.** Choose Image, one output. Enter the first description as a standalone image prompt and append the style sentence. Enter the location description separately for its own generation. Use only the reference images approved for the production.

## Video shots

**Agent on.** Attach the selected project references. For one shot:

    Make only shot {shot ID}, one {duration}-second video. Use the attached {character} and {location} references. {Identity line}. {Camera and starting position}. {One action}. End with {precise final state}. Exactly {count} figures. {Audio direction}. {Style sentence}

For an approved multi-shot Agent request, name the shared references and style once, then list distinct shot IDs, timings, action and ending for each. Request one separate clip for each ID. Count the actual playable clips in the grid; variations of one shot do not establish completion of the others.

**Agent off.** Choose Video, Ingredients and one output. Attach this shot's references. Enter a self-contained direction:

    {Camera and framing}. Use the selected {character} and {location} images. {Identity line}. Start with {visible starting state}. {Single movement}. Finish with {visible end state}. {Character and prop count}. {Audio direction}. {Style sentence}

If one native input is used throughout a production, adapt the same shot cards to that input. For a standalone prompt, replace phrases such as “as before” with the actual side of frame, wardrobe, prop and setting.

## Audio and fixes

For effects only, specify “No narration, no dialogue” and one or two sounds. For an off-screen narrator, state that only the quoted words are spoken. For dialogue, identify the speaking character, quote the line and keep other mouths closed. For an externally narrated cut, request effects only in the clips and hand over the ordered voiceover lines separately.

For a silent character under narration, use the pattern below. It fixed lip-sync in TechGyro's tests (Omni Flash 1.2, Nov 2026); the earlier wording ("Tara remains silent", "never mouths", a front-facing closed-mouth smile) still lip-synced. What made the difference:
- **Hide the mouth from the camera.** Profile for a still character; a three-quarter rear view, back mostly to camera, for any shot where the character moves or turns her head. A face that changes expression or turns toward camera while a voice plays gets lip-synced.
- **No facial animation during narration.** Don't ask for widening eyes, smiles changing or "curious expressions" in a narrated shot. Show reactions with the body and head turned away.
- **Call the narrator a Voiceover (V.O.)** and put the line in a separate **Audio** section. Don't repeat "silent / never speaks / no lip movement"; negative instructions draw attention to the mouth.
- **Drop "small mouth" from the style sentence** in narrated films (dot eyes and curved eyebrows only).
- **Pace the line explicitly:** "Speak slowly and clearly over six seconds, finishing the final word naturally before the shot ends, leaving a brief quiet moment after the sentence."

    {Shot ID} of {total}. Create one {duration}-second {aspect} video. Use the attached {character} portrait image reference for her appearance, and the attached {voice} voice for the off-screen Voiceover (V.O.).
    Visuals: {Camera}. {Identity line}. {Position and setting}. She is seen {in profile | from a 3/4 rear angle, with her back mostly to the camera}, looking toward {direction}. {One body or head action, turning away from the lens}. Exactly {count} human figure. {What must not be visible yet}.
    Audio: {Female|Male} Voiceover (V.O.) plays over the scene. The voice is {tone}. The V.O. says exactly: "{line}" Speak slowly and clearly over {duration} seconds, finishing the final word naturally before the shot ends, leaving a brief quiet moment after the sentence. Beneath the voiceover, {one or two sounds}. No other speech. No music, subtitles, captions, or written signs.
    Style: {style sentence without "small mouth"}

Proven example (S02, "The Last Bell"): Tara "seen from a 3/4 rear angle, with her back mostly to the camera. She reacts to an off-screen sound by turning her head further to the right to look down the empty platform." The same shot with "seen in profile… turning her head with a curious expression (eyes widening slightly)" lip-synced.

Keep the same narrator reference and delivery direction across the story. Check the actual audio for skipped words, hurried delivery and a clipped ending. Explicit words such as “leaves” still need listening verification.

For mechanical actions, specify what is attached to what and who moves it. For an observer near a bell, write “Tara keeps both hands behind her back. The brass platform bell swings once. Tara looks upward.” For the reveal, show a single continuous cord between the bell clapper and the crow's beak. Use concrete object motion and safe hand positions.

For a saved speaker, select their actual `@Name` entry in the composer. With `@Tara` selected, try “Tara taps the empty ticket window and says, ‘Then who stamped my ticket?’ The porter stays silent.” When the shot calls for an explicit voice reference, use the matching voice in a supported Ingredients video.

For a redo, name a single visible or audible change, repeat the essential end state, and keep all other approved details. Specify which object moves, which object stays fixed and the intended final positions. Reattach the original references, select one output and follow the quote and review steps.

## Narrated films: choose the route before generating
Tested on Omni Flash 1.2 (TechGyro, Nov 2026, "The Last Bell", six narrated shots): the V.O. pattern fixed two of three lip-sync shots. A full rear view stopped lip-sync in the third, but the model then placed the crow in mid-air beside the bell instead of on the rail. Hiding the face can break other parts of the shot, so check props and contact points as well as the mouth.

Offer the creator two routes when a story has a narrator:
1. **Recommended for reliable narration:** generate every shot with "No narration, no dialogue" and one or two sound effects. Hand over the ordered narration lines with each shot's timing so the creator records them separately (ElevenLabs or a local voice) and combines picture and voice in an editor. No lip-sync risk, and no retakes for audio.
2. **Narration inside Flow:** use the V.O. pattern above, expect up to about three takes per shot that shows the character's face, and let the creator choose between a take with lip-sync and a take with a visual error. Report which compromise each kept take carries.

When characters speak their own lines on camera, use their saved Characters entry and voice; Omni lip-syncs those well.
