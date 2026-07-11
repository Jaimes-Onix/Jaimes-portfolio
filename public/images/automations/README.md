# Automation screenshots

Drop your workflow screenshots into the matching platform folder:

- `n8n/`          — n8n workflow screenshots
- `make/`         — Make scenario screenshots
- `gohighlevel/`  — GoHighLevel automation screenshots

Then point to them in the `LIBRARY` object in `src/App.jsx`, e.g.:

    img: '/images/automations/n8n/lead-qualification.png'

Anything inside `public/` is served from the site root, so
`public/images/automations/n8n/x.png` becomes `/images/automations/n8n/x.png`.

PNG or JPG both work.
