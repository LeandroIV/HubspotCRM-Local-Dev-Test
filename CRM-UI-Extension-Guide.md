# Creating a HubSpot CRM UI Extension Card (2026)

## Prerequisites
- HubSpot CLI installed: `npm install -g @hubspot/cli`
- A **Developer Test Account** (not your production portal)
- Node.js >= 20

---

## Step 1 — Authenticate the CLI

```bash
hs auth
```

Select your **developer test account** when prompted.

---

## Step 2 — Create the Project Folder

From the repo root (`HubspotCRM-Local-Dev-Test`):

```bash
mkdir my-crm-card-project
cd my-crm-card-project
hs project create
```

---

## Step 3 — `hs project create` Prompts & What to Select

### Project name
```
ipara-crm-card
```

### Choose what to include in your project
```
> App
  Empty Project
```
Select **App** — gives you CRM UI Extensions and serverless functions.

---

### Choose how to distribute your app
```
> On the HubSpot marketplace
  Privately
```
Select **Privately** — you're building for your own portal, not publishing publicly.

| Option | When to use |
|---|---|
| On the HubSpot marketplace | Selling/sharing your app to all HubSpot customers. Requires HubSpot review. |
| Privately | Internal tools, client builds, personal/test projects. Instant, no review. |

---

### Choose your authentication type
```
> Static Auth
  OAuth
```
Select **OAuth** — recommended standard in 2026.

| Option | Notes |
|---|---|
| Static Auth | Legacy/deprecated. Fixed API key, less secure. |
| OAuth | Secure, scoped, refreshable tokens. Required for CRM UI Extensions. |

---

### Choose which features to add
Use **Space** to select, then **Enter** to confirm.

```
[x] Card [card]
[x] App Function (endpoint) [app-function-endpoint]
[ ] Settings [settings]
[ ] Webhook [webhooks]
[ ] Custom Workflow Action [workflow-action]
[ ] Pages [page]
```

Select **Card** + **App Function (endpoint)** only.

| Feature | What it does | Select? |
|---|---|---|
| Card [card] | React UI component shown on CRM records (contacts, deals, etc.) | Yes |
| App Function (endpoint) | Serverless backend your card calls for data/logic | Yes |
| Settings | Adds a settings/config page for your app | Later |
| Webhook | Listen to HubSpot events (contact created, deal updated) | Later |
| Custom Workflow Action | Add custom actions inside HubSpot workflows | Later |
| Pages | Public-facing app pages | Later |
| App Function (private) | Requires Static Auth — incompatible with OAuth | No |
| Agent Tool | Requires special account access | Locked |
| SCIM Integration | Requires Static Auth | No |
| App Object / App Events | Requires Marketplace distribution | Locked |

---

## Step 4 — Project Structure Generated

```
my-crm-card-project/
└── ipara-crm-card/
    ├── hsproject.json
    └── src/
        └── app/
            ├── app-hsmeta.json
            ├── app.functions/            ← serverless backend
            │   ├── serverless.json
            │   └── example.js
            └── extensions/              ← React UI card
                ├── example-card.json    ← card config
                └── ExampleCard.jsx      ← React component
```

---

## Step 5 — Configure Where the Card Appears

Edit `src/app/extensions/example-card.json`:

```json
{
  "type": "crm-card",
  "data": {
    "title": "iPara CRM Card",
    "uid": "ipara-crm-card",
    "location": "crm.record.tab",
    "objectTypes": [
      { "name": "contacts" }
    ]
  }
}
```

**Location options:**
- `crm.record.tab` — tab on a record page
- `crm.record.sidebar` — right sidebar panel

**Object types:** `contacts`, `companies`, `deals`, `tickets`

---

## Step 6 — Write the Serverless Function (Backend)

Edit `src/app/app.functions/example.js`:

```js
exports.main = async (context = {}) => {
  const { hs_object_id } = context.propertiesToSend;

  return {
    message: `Hello from serverless! Contact ID: ${hs_object_id}`,
    timestamp: new Date().toISOString()
  };
};
```

---

## Step 7 — Write the React Card (Frontend)

Edit `src/app/extensions/ExampleCard.jsx`:

```jsx
import { useState } from "react";
import { hubspot, Text, Button, LoadingSpinner } from "@hubspot/ui-extensions";

hubspot.extend(({ context, runServerlessFunction }) => (
  <ExampleCard runServerless={runServerlessFunction} context={context} />
));

const ExampleCard = ({ runServerless }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await runServerless({ name: "example" });
    setMessage(result.response.message);
    setLoading(false);
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <Button onClick={fetchData}>Run Function</Button>
      {message && <Text>{message}</Text>}
    </>
  );
};
```

---

## Step 8 — Upload & Test

```bash
# Upload to your developer test account
hs project upload

# Or watch for live changes during development
hs project dev
```

> **Note (OAuth apps):** `hs project dev` requires the app to be installed first.
> Run `node oauth-install.js` once to complete the OAuth install, then `hs project dev` will work.
> `oauth-install.js` is in `.gitignore` — never commit it as it contains your Client Secret.

Then in HubSpot → open any **Contact record** → your card will appear under the tab you configured.

---

## Known Limitations (OAuth + CRM Cards)

- **`app-function` (serverless)** is NOT available for OAuth apps on CRM cards — static auth only
- **`hubspot.fetch` to `api.hubapi.com`** fails with a 488 error if your account is on the `na2` hublet — HubSpot routes unauthenticated fetches to na1 by default
- **Best practice for OAuth cards:** read data from `context` directly (no API call needed for basic CRM data), or proxy through your own backend server that holds the OAuth refresh token

```jsx
// Read CRM data directly from context — no API call needed
const objectId = context.crm?.objectId;
const portalId = context.portal?.id;
const userId = context.user?.id;
```

---

## Step 9 — Push to GitHub

From the repo root:

```bash
cd d:\Hubspot_Work\HubspotCRM-Local-Dev-Test
git add my-crm-card-project/
git commit -m "Add ipara CRM UI extension project"
git push
```

The existing `.gitignore` already excludes `node_modules/` and `hubspot.config.yml` so no secrets or bloat will be pushed.

---

## Project Structure Overview (Full Repo)

```
HubspotCRM-Local-Dev-Test/          ← GitHub repo root
├── my-hubspot-project/
│   └── ipara-cms-theme/            ← CMS theme (website pages)
└── my-crm-card-project/
    └── ipara-crm-card/             ← CRM UI Extension (this guide)
```

| | CMS Theme | CRM UI Extension |
|---|---|---|
| Purpose | Website/landing pages | Cards on CRM records |
| Lives in | CMS | Private App |
| Backend | None | Serverless functions |
| Template used | Getting started with CMS React | App > Privately > OAuth > Card + App Function |

---

*Guide created: 2026-04-22*
