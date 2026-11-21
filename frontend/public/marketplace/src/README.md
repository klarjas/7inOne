# 7inOne Marketplace source modules

Editable source files for the existing static marketplace assets.

- `html/`: document shell, individual marketplace views, and shared overlays.
- `css/`: ordered style sections.
- `js/`: ordered application sections.

## Compatibility

`scripts/build-marketplace-assets.mjs` concatenates these files in an explicit order into the existing public files: `index.html`, `style.css`, and `app.js`.

The generated output preserves the original markup order, CSS cascade order, JavaScript declaration scope, event-binding order, and runtime entrypoint. JavaScript fragments are assembled into one classic script so existing shared state and cross-feature calls keep working. Do not load source fragments individually in the browser.

This is the safe structural extraction phase. CSS scoping and stricter JavaScript module boundaries should be introduced incrementally after selector and dependency mapping plus regression tests.

Backend, database, Supabase schema, Telegram image-upload code, API endpoints, and storage logic are outside this refactor.
