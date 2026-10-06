# Sonali Godavarthy — Portfolio

Personal portfolio of Sonali Godavarthy, AI Research Engineer.  
Built with Next.js 16, Tailwind CSS v4, Motion and three.js.

Live: [sonali.dev](https://sonali.dev) *(deploy to Vercel when ready)*  
Repo: [github.com/SonaliGodavarthy/Portfolio](https://github.com/SonaliGodavarthy/Portfolio)

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **conda** (Miniconda or Anaconda) | any | [docs.conda.io](https://docs.conda.io/en/latest/miniconda.html) |
| **Node.js** | 22 (managed via conda) | see below |
| **Git** | any | [git-scm.com](https://git-scm.com) |

> Node.js is installed inside the conda environment — you do **not** need a global Node.js install.

---

## Setup (first time)

```bash
# 1. Clone the repo
git clone https://github.com/SonaliGodavarthy/Portfolio.git
cd Portfolio

# 2. Create the conda environment with Node.js 22
conda create -n sonali_portfolio -c conda-forge nodejs=22 -y

# 3. Install npm dependencies
conda run -n sonali_portfolio npm install
```

---

## Running locally

```bash
# Activate the environment
conda activate sonali_portfolio

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Or without activating the environment:

```bash
conda run -n sonali_portfolio npm run dev
```

---

## Other commands

```bash
npm run build    # production build + type-check
npm run lint     # ESLint
```

---

## Updating content

All portfolio content (experience, projects, tools, impact metrics) lives in one file:

```
lib/data.ts
```

Edit that file to update roles, bullets, tools, or impact numbers. No CMS needed.

---

## Deploying to Vercel (free)

See [DEPLOY.md](DEPLOY.md) for setting up a Vercel account, the environment
variables (`GEMINI_API_KEY`, plus `NEXT_PUBLIC_SITE_URL` only for a custom domain) and auto-deploy on every push.

---

## Tech stack

| Layer | Package |
|-------|---------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Animation | Motion (`motion/react`) |
| Icons | Phosphor Icons v2 |
| Font | System fonts (SF Pro on Apple devices), no web fonts |
| 3D | three.js particle portrait (`lib/particles.ts`) |

---

## Pushing changes

```bash
git add -A
git commit -m "describe what changed"
git push
```
