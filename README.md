# Agent Backend — Starter

This is the "core engine" glue between Vapi/Retell and each client's calendar + Stripe account. Vapi calls these endpoints whenever the agent needs to check availability, book an appointment, send a payment link, or transfer a call. It loads the right client config (like `fuentes-landscaping-config.json`) based on which number was called.

Right now the calendar and payment logic are stubbed with `// TODO` comments — this gets you a working, testable skeleton before Carlos's real Google Calendar / Stripe access is ready.

---

## 1. What to install on your computer (one-time)

- **Node.js** (v18 or later) — https://nodejs.org — this is what runs the backend. Download the "LTS" installer for your OS and run it, no config needed.
- **VS Code** (or any code editor) — https://code.visualstudio.com — free, this is where you'll open and edit this project.
- **Git** — https://git-scm.com — lets you save versions of this project and push it to GitHub. Also just download and install.
- A **GitHub account** (free) — https://github.com — where this project's code will live so you (and eventually Ron) can both work on it, and so it can be deployed.

That's it for local installs. Everything else (the actual running agent) lives in the cloud.

## 2. Accounts to create before this becomes "real"

- **Vapi** or **Retell** — https://vapi.ai or https://retellai.com — free to start
- **Twilio** — https://twilio.com — buy a phone number, a few dollars
- **Render** (or Railway) — https://render.com — free tier, this is where this backend actually runs 24/7 once deployed, so your laptop doesn't need to stay on
- **Google Cloud project** with the Calendar API enabled — needed to get credentials that let this backend read/write Fuentes's calendar (do this once Carlos's Google account exists, per the owner checklist)
- **Stripe** — in Carlos's business name, per the earlier checklist — needed for `send_payment_link` to actually work

## 3. Running it locally (to test before deploying)

Open a terminal in this folder and run:

```
npm install
npm start
```

This starts the backend on `http://localhost:3000`. You can test an endpoint like this in a second terminal:

```
curl -X POST http://localhost:3000/check_availability \
  -H "Content-Type: application/json" \
  -d '{"client_id": "fuentes-landscaping", "start_date": "2026-09-10", "end_date": "2026-09-12"}'
```

You should get back mock time slots — that confirms the server, the config loader, and the routing are all working before any real calendar is connected.

## 4. Connecting it to Vapi

Once this is deployed (Step 5), each function in your Vapi agent config (`check_availability`, `book_appointment`, `send_payment_link`, `transfer_to_human`) gets pointed at this backend's matching endpoint, e.g.:

```
https://your-app-name.onrender.com/check_availability
```

Vapi calls that URL mid-conversation whenever the agent needs to run that function, and gets back JSON it uses to keep talking.

## 5. Deploying so it runs without your laptop

1. Push this folder to a new GitHub repo (`git init`, `git add .`, `git commit`, then follow GitHub's "create a new repo" instructions to push it)
2. On Render: "New Web Service" → connect that GitHub repo → it auto-detects Node.js → deploy
3. Render gives you a permanent URL — that's what goes into Vapi's function settings

## 6. Filling in the real logic

Two files have the stubs to replace once accounts are ready:
- `integrations/calendar.js` — swap the mock for real Google Calendar API calls
- `integrations/payments.js` — swap the mock for a real Stripe Payment Link creation call

Everything else (config loading, routing, the shape of what Vapi expects back) is already wired up.
