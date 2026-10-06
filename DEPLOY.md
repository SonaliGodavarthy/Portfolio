# Deploying the portfolio on your own Vercel account

Right now the site runs on Aditya's Vercel account at
https://sonali-portfolio-one.vercel.app. That account can't redeploy when
you push, because Vercel's free plan only deploys commits from the account
owner. Moving it to your account fixes that: once you've done the steps
below, **every `git push` to `main` redeploys the site automatically**.

It takes about 10 minutes and costs nothing.

---

## 1. Create your Vercel account

1. Go to https://vercel.com/signup.
2. Choose the **Hobby** plan (free, for personal projects).
3. Click **Continue with GitHub** and sign in as **SonaliGodavarthy**.
   Signing up with GitHub is important: it links your commits to your Vercel
   account, which is what makes auto-deploy work.
4. If GitHub asks to authorize Vercel, approve it.

## 2. Get a Gemini API key (for the chatbot)

The "Ask About Sonali" chat needs a Gemini key. Without one, the site still
works, but the chat tells visitors to email you instead.

1. Go to https://aistudio.google.com/apikey and sign in with your Google account.
2. Click **Create API key** and copy it.
3. Keep it private: don't commit it to the repo or paste it into chats.
   It only goes into Vercel's settings (step 3) and, optionally, your
   local `.env.local`, which git ignores.

## 3. Import the repo

1. Go to https://vercel.com/new.
2. Under **Import Git Repository**, find `SonaliGodavarthy/Portfolio` and
   click **Import**.
   - If it isn't listed, click **Adjust GitHub App Permissions**, give Vercel
     access to the `Portfolio` repo, then come back.
3. On the configure screen:
   - **Project Name:** `sonali-portfolio` (or anything you like; it becomes
     part of your URL).
   - **Framework Preset:** Next.js (detected automatically).
   - **Root Directory**, **Build** and **Output** settings: leave as they are.
4. Open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `GEMINI_API_KEY` | the key from step 2 |

5. Click **Deploy**. The first build takes 1–2 minutes. When it's done,
   Vercel shows your live URL, something like
   `https://sonali-portfolio-xyz.vercel.app`.

## 4. Site URL (automatic)

Link previews (LinkedIn, WhatsApp, etc.) need the site's address. Vercel
supplies the project's permanent address to the build
(`VERCEL_PROJECT_PRODUCTION_URL`), and `app/layout.tsx` uses it, so there is
nothing to set. Only add `NEXT_PUBLIC_SITE_URL` if you connect a custom
domain (see below).

## 5. Check it

- Open your URL and scroll through the site.
- Open the chat (bottom right) and ask a question. You should get an answer
  rather than the "email me instead" message.
- Paste your URL into a LinkedIn post draft (don't publish it) and check the
  preview image shows up.

## 6. Tell Aditya

Once your site works, let Aditya know so he can delete the old project on
his account. Until then there are two copies online.

---

## Day to day

Deploying is now just pushing:

```bash
git add -A
git commit -m "describe what changed"
git push
```

Vercel builds and publishes within a couple of minutes. You can watch it
under **Deployments** in your Vercel dashboard. If a build fails, the live
site stays on the previous version and Vercel emails you the error.

Every branch other than `main` also gets its own **preview URL**, which is
handy for trying a change before it goes live.

**Commits must come from you.** The free plan only deploys commits authored
by the account owner, and Vercel matches them by email. Make sure your git
email is one that's on your GitHub account:

```bash
git config user.email   # should print an email that's on your GitHub account
```

If someone else (e.g. Aditya) pushes a commit, Vercel blocks that deploy.
Push any commit of your own afterwards and the site updates with everything.

## Custom domain (later)

When you buy a domain:

1. In your project, go to **Settings → Domains** and add it.
2. Vercel shows the DNS records to create at your domain registrar. Add
   them; it can take from a few minutes to a few hours to take effect.
3. Change `NEXT_PUBLIC_SITE_URL` to the new domain (e.g. `https://sonali.dev`)
   and redeploy.

## Optional: Gemini model

The chat uses `gemini-flash-latest` and falls back to lighter models if
that's busy. To pick a different model, add a `GEMINI_MODEL` environment
variable with the model name.
