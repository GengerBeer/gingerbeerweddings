# Contributing to Ginger Beer Weddings

Welcome to the team! This guide covers everything you need to contribute smoothly.

---

## 🧑‍💻 Team Setup

### Arkady & Vadym (Antigravity)

1. Open Antigravity → Settings → Git Integration
2. Connect your GitHub account
3. Select the **existing** repo `gingerbeerweddings` — do not create a new one
4. Create your branch: `feat/arkady-ui` or `feat/vadym-*`
5. Push directly from Antigravity

### Gena (Claude Code / terminal)

```bash
git clone https://github.com/GengerBeer/gingerbeerweddings.git
cd gingerbeerweddings
git checkout -b feat/gena-backend
```

---

## 🌿 Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<name>-<description>` | `feat/arkady-gallery` |
| Bug fix | `fix/<description>` | `fix/booking-form-crash` |
| Hotfix | `hotfix/<description>` | `hotfix/typo-homepage` |
| Chore | `chore/<description>` | `chore/update-deps` |

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

Examples:
feat: add photo gallery component
fix: resolve broken API endpoint on booking
chore: update node dependencies
docs: improve README setup section
style: format CSS for hero section
refactor: extract booking logic into custom hook
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Keep the subject line under **72 characters**. Use the body for context if needed.

---

## 🔄 Pull Request Process

1. **Create a PR** against `main` from your feature branch
2. **Fill in the PR template** — don't skip sections
3. **Vercel preview URL** is posted automatically — check it before requesting review
4. **Assign Vadym** as reviewer
5. **Wait for approval** before merging — no self-merges
6. **Squash and merge** unless told otherwise

### PR Checklist

- [ ] Branch is up to date with `main`
- [ ] Build passes locally (`npm run build`)
- [ ] No console errors in the preview
- [ ] PR description explains *what* and *why*
- [ ] Vadym is assigned as reviewer

---

## ⚠️ API Changes (Gena)

If you change or break an existing API contract:

1. **Post in team chat before merging** — not after
2. Describe what changed and what the frontend needs to update
3. Coordinate with Arkady to fix the frontend in the same release if possible

---

## 🚫 Rules

- **Never push directly to `main`** — PRs only
- **Never merge your own PR** without review
- **Never force-push** to shared branches
- **Resolve conflicts** in chat with the team — don't silently overwrite

---

## 🆘 Getting Help

Questions → general team chat  
PR review → Vadym  
Backend API issues → Gena  
Frontend/design → Arkady
