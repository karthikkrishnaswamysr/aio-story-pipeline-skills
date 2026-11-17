---
name: flow-browser-use
description: Drive Google Flow (flow.google.com: Nano Banana images, Omni/Veo video, Frames image-to-video) inside the user's own already-running Chrome via the browser-use CLI over CDP, then download the results. Use whenever a task needs Flow stills or clips, "use Flow", "generate in Flow", a Flow project URL, or checking Flow credits. Never launches a new browser.
---

# Google Flow via browser-use (the user's real Chrome)

The user wants Flow driven in **their own open Chrome** (signed in, their project tabs), never a fresh/headless browser.
Images are free; video costs credits, so every submit is verified by screenshot first.

## 0. Setup (once per machine; check before redoing)
- CLI: install `browser-use` 1.0.4 with `uv tool install browser-use==1.0.4` (binary in `~/.local/bin`).
  Every Bash call: `export PATH="$HOME/.local/bin:$PATH"`.
- Chrome remote debugging: the user enables it at `chrome://inspect/#remote-debugging` → "Server running at
  127.0.0.1:9222". If attach fails, ask them to enable it there (don't relaunch Chrome with flags).
- After enabling, run `browser-use --reload` once so the daemon re-attaches to that Chrome. `browser-use --doctor` diagnoses.

## 1. Calling pattern
Feed Python to the CLI on stdin; helpers are pre-imported. Keep each call short and finish with a screenshot.
```bash
export PATH="$HOME/.local/bin:$PATH"; timeout 200 browser-use <<'PY' 2>&1 | tail -8
for t in list_tabs(): print(t.get('title','')[:50], '|', t.get('url','')[:90], '|', t.get('targetId'))
PY
```
Helpers used: `list_tabs()`, `switch_tab(targetId)`, `new_tab(url)`, `close_tab(id)`, `goto_url(url)`, `page_info()`
(has `url`), `click_at_xy(x,y)`, `type_text(s)`, `press_key('Escape')`, `wait(sec)`, `js(expr)` (returns a string; wrap
in an IIFE and `JSON.stringify`), `cdp(method, **params)`, `capture_screenshot(path, max_dim=1200)`.
Then **Read the screenshot PNG** to see the page. Tab IDs change between sessions: always `list_tabs()` first, and
`switch_tab` to the existing Flow project tab rather than opening a new one.

## 2. Find controls instead of trusting old coordinates
Coordinates depend on the user's window size. Locate prompt-bar buttons each session:
```python
print(js("(()=>{const o=[];document.querySelectorAll('button,[role=button],textarea,[contenteditable=true]').forEach(e=>{const b=e.getBoundingClientRect();if(b.width&&b.y>700)o.push([e.tagName,(e.innerText||e.getAttribute('aria-label')||e.placeholder||'').slice(0,40).split(String.fromCharCode(10)).join(' '),Math.round(b.x+b.width/2),Math.round(b.y+b.height/2)])});return JSON.stringify(o)})()"))
```
The bottom bar has: add-reference (+), prompt box, settings chip (mode/model/aspect/resolution), submit arrow.
Settings chip opens a menu: Image / Video tabs; for video, **Frames** (start/end frame), aspect 16:9, 360p/720p.
Read the live cost before any video submit:
```python
print(js("(()=>{const t=document.body.innerText;const i=t.indexOf('Generating will use');return i<0?'(menu closed)':t.slice(i,i+34)})()"))
```

## 3. Generate stills (Nano Banana, 0 credits)
1. Settings → Image. `press_key('Escape')`.
2. Click the prompt box; confirm focus is the prompt and not something else:
   `js("document.activeElement && (document.activeElement.tagName+' '+(document.activeElement.getAttribute('placeholder')||document.activeElement.getAttribute('aria-label')||''))")`
3. `type_text(prompt)`, screenshot, check, then click submit. Images take ~45–70 s.
4. Character consistency: + (add reference) → search box at the top of the picker → type part of the asset name → select →
   **check the preview in a screenshot** (list reorders by recent use) → "Add to prompt" → then type the prompt
   ("...the exact same man from the reference image...").
Prompt habits: lead with a shared LOOK string ("Cinematic 35mm film still, photorealistic, ... 16:9. No text, no logos,
no watermark."), avoid real brands, one prompt per submit.

## 4. Generate clips (Omni Flash; credits)
Costs seen Nov 2026: 6 s clip = **6 credits at 360p, 18 at 720p**. Quote the user the total before spending.
1. Settings → Video → Frames, 16:9, resolution → read "Generating will use N credits" → Escape.
2. Start-frame slot → picker → search → select → screenshot preview → add.
3. Click prompt box, type a motion-only prompt ("Very slow push-in... No cuts, no text."), screenshot, verify the bar
   shows Video / Frames / right resolution / the right start frame, then submit. Clips take a few minutes.

## 5. Traps that already cost credits
- **Clicking any grid tile opens that asset's editor** (URL contains `/edit/`). Its prompt box is a *video-edit* box that
  spends credits on the user's existing clip. Before submitting, check `page_info()['url']` has no `/edit/`.
- The prompt box grows upward while typing, so a click at a pre-typing coordinate can land on a grid tile.
- Leave an editor with `goto_url(project_url)`, never by clicking around.
- After a misfire, check spend at `https://one.google.com/ai/activity?utm_source=flow` (read `document.body.innerText`
  around "Google Flow credits") and tell the user.

## 6. Download
- **Stills**: fetch in-page as data URLs from the project grid (tiles have alt starting "Tile displaying a user's image"):
```python
import json, base64, os
r = js("""(async()=>{const res=[];for(const im of [...document.querySelectorAll('img')].filter(i=>(i.alt||'').startsWith("Tile displaying a user's image"))){let el=im,cap='';for(let k=0;k<6&&el;k++){el=el.parentElement;if(el&&el.innerText&&el.innerText.trim()){cap=el.innerText.trim();break}}
 const b=await (await fetch(im.currentSrc||im.src)).blob();const d=await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});res.push([cap.slice(0,60),d]);}return JSON.stringify(res)})()""")
for cap, d in json.loads(r):
    open(os.path.join(OUT, ''.join(c if c.isalnum() else '_' for c in cap)[:45] + '.jpg'), 'wb').write(base64.b64decode(d.split(',',1)[1]))
```
- **Videos**: in-page fetch/urllib fails (cookies/CORS). Open the clip (URL gains `/edit/`), click the download icon
  (top-right), then the menu item **"Original size"** (not GIF, not Upscaled; locate it with js text search for
  `/Original size/`). Files land in your Downloads folder; move/rename them into the project. Then `goto_url(project)`.

## 7. Code film -> Flow (restyle frames, then Frames clips)
Used for TechGyro's "Claude Code animation -> Google Flow" video.
1. Upload the first and last frame of every shot of your code-built film (several files at once).
2. Image mode (0 credits): for each frame, attach the uploaded frame as the image reference and prompt a restyle that
   keeps the composition ("same camera angle, same layout, the same single robot... cinematic, photoreal, rainy night").
   Compare every still with its source frame; redo any that add or lose objects (e.g. two robots instead of one).
3. Video -> Frames: start = restyled first frame, end = restyled last frame, a motion-only prompt, silent if you will add
   your own sound. Test one shot at 360p, then the rest.

## 8. Lessons from real runs
- **"We noticed some unusual activity" (Failed tile):** Flow sometimes blocks automated submits. Stop; don't retry in a
  loop. Ask the user to refresh the page, or to click submit once themselves, then continue. Check the activity page to
  confirm failed generations were not charged.
- **Start and end frames must show the same set.** A wall in one frame and not the other makes the model morph it in.
- **Give each action enough time.** 6 s was too short for shots with several actions (objects appeared or vanished);
  8-10 s fixed it. Plan clip length from the action, not a fixed default.
- **Test at 360p, finish at 720p.** Omni 1.2 Flash, Nov 2026: 6 s = 6 cr at 360p, 18 at 720p; 10 s = 10 at 360p, 30 at 720p.
- Turn remote debugging off when you're done: while it's on, local programs can control that Chrome.

## Checklist per submit
mode/model/resolution correct → cost read → URL has no `/edit/` → focus is the prompt box → screenshot looked at → submit.
