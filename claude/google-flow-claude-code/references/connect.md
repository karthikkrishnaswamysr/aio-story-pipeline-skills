# Connect Claude Code to your Chrome

1. The user turns on **remote debugging** in their normal Chrome: open `chrome://inspect/#remote-debugging` and enable it ("Server running at 127.0.0.1:9222"). Chrome may ask "Allow remote debugging?" the first time you connect; the user clicks Allow.
2. The user opens their Flow project in a tab and tells you remote debugging is on.
3. Attach to that running Chrome (never launch a new one). One working option is the `browser-use` CLI (install: `uv tool install browser-use`), which talks to Chrome over CDP:
   ```bash
   browser-use <<'PY'
   for t in list_tabs(): print(t.get('title','')[:50], '|', t.get('url','')[:90], '|', t.get('targetId'))
   PY
   ```
   Then `switch_tab(<id of the Flow tab>)`, and use `click_at_xy`, `type_text`, `press_key`, `js(...)` and `capture_screenshot(path)`; look at the screenshot before each submit.
4. Find controls each session instead of reusing coordinates (window sizes differ). The prompt box grows upward while typing, so re-locate the submit button after typing.
5. Read the live cost before any video:
   ```python
   print(js("(()=>{const t=document.body.innerText;const i=t.indexOf('Generating will use');return i<0?'(menu closed)':t.slice(i,i+34)})()"))
   ```
6. Turn remote debugging off again when you're done: while it's on, any local program can control that Chrome.

Seen in Flow (Nov 2026): Nano Banana images 0 credits; Omni 1.2 Flash, Frames, 6 s = 6 credits at 360p, 18 at 720p. Prices change, so always read the cost line.
