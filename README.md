# Mini Research Team

Mini Research Team is a small full-stack project that demonstrates an AI-powered research workflow. It includes a Next.js client UI (`client/`) and a NestJS backend (`server/`) which runs research "workflows" (summarization, splitting, ranking, cross-checking) and stores documents in MongoDB.

**Tech stack**
- Frontend: Next.js 15 + React 19, Tailwind CSS (client)
- Backend: NestJS 11, Mongoose (server)
- AI: Google Generative AI client packages present in `server` dependencies
- State & data fetching: Redux Toolkit + RTK Query (client)

**Key features**
- Ask a research question from the UI and run a multi-step workflow that produces a final answer and a trace of intermediate steps.
- Upload documents for the knowledge base (documents stored via the `docs` module).
- Trace viewer: inspect JSON trace of workflow steps.

Repository layout
- `client/` — Next.js app (UI, upload page, question input, results)
- `server/` — NestJS API (workflow orchestration, docs, upload, trace endpoints)
- `server/src/workflow/` — services implementing the research workflow (splitter, summarizer, ranker, crosschecker, etc.)

Getting started
Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or hosted) — used by the server
- Google Cloud credentials / API key for the Generative AI client (if you plan to run workflows that call Google APIs)

Local development
1. Start the backend

	 ```bash
	 cd server
	 npm install
	 # set environment variables (see below), then:
	 npm run start:dev
	 ```

2. Start the frontend

	 ```bash
	 cd client
	 npm install
	 npm run dev
	 ```

The frontend runs on the Next.js dev server (see `client/package.json` scripts). The backend default port is 4000 (see `server/src/main.ts`).

Environment
- `MONGODB_URI` — MongoDB connection string (defaults to `mongodb://localhost:27017/mini_research` in `AppModule`).
- `PORT` — backend listen port (defaults to `4000`).
- Google AI credentials — configure according to the Google Generative AI client you use (environment variable or service account JSON). The server currently includes `@google/genai` / `@google/generative-ai` in dependencies.

Useful scripts
- Frontend (`client/package.json`)
	- `dev` — Next.js dev server
	- `build` — build production assets
	- `start` — start built Next app

- Backend (`server/package.json`)
	- `start:dev` — NestJS dev server with watch
	- `start` — start (compiled) server
	- `build` — compile TypeScript to `dist`
	- `seed` — run `ts-node src/seed/seed.ts` to seed sample data
	- `test` — run Jest tests

Important files
- Server bootstrap: [server/src/main.ts](server/src/main.ts)
- Server module & DB config: [server/src/app.module.ts](server/src/app.module.ts)
- Client main UI: [client/app/page.tsx](client/app/page.tsx)
- Workflow services: `server/src/workflow/` (splitter, summarizer, ranker, crosschecker)

Notes & next steps
- The repository is scaffolded with a clear separation of concerns: UI (Next.js) and API (NestJS). To enable actual calls to Google Generative AI, make sure your Google credentials are configured in the environment before starting the server.
- Consider adding a top-level `dev` script or a `docker-compose` to run both services together.

Contributing
- Open an issue or PR when you want to add features or fix bugs. Follow existing code style and tests.

License
- See individual packages. The `server` package.json is marked `UNLICENSED` by default; add a license file if you plan to open-source this project.

