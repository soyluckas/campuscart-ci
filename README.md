# CampusCart — CI/CD and secure development seminar

**QHO640 | 120 minutes | Beginner lab**

Today you receive an Amazon-inspired Next.js shop rather than writing it from scratch. Your job is to automate its quality checks, scan it with Semgrep, publish it and improve it. No real orders, accounts or payments are involved.

## 1. Run the starter (0–15 min)

Download and extract the ZIP. Open the `campuscart-ci` folder in VS Code (File → Open Folder). Open Terminal → New Terminal. Install a supported Node.js LTS (22 or 24) from https://nodejs.org if needed, and Git from https://git-scm.com. Check:

```sh
node -v
npm -v
git --version
npm install
npm test
npm run dev
```

`npm install` creates `package-lock.json`; keep and commit it. Three tests should pass. Open http://localhost:3000 (or the port shown). Search for headphones, add two to the basket, click Check order. Expected quote £59.98. Open `/products/headphones` and `/api/products`. Stop the server with Ctrl+C when needed. No extra npm packages are needed.

| File | Purpose |
|---|---|
| app/page.js | Server Component and storefront heading |
| components/Shop.jsx | Client state, props, search, basket and fetch |
| lib/products.js | Product data and trusted price calculation |
| app/products/[id]/page.js | Dynamic route with static parameters |
| app/api/products/route.js | GET JSON |
| app/api/order/route.js | POST quote validation |
| app/globals.css | Styling |
| tests/products.test.js | Automated unit tests |

## 2. Create your GitHub repository (15–30 min)

Sign in at https://github.com. Click + → New repository. Name it `campuscart-ci`. Choose public only if allowed by your institution (all data here is fictional); otherwise private. Do not initialise with README, licence or gitignore. Click Create repository. Copy the HTTPS URL.

In your project terminal:

```sh
git init
git add .
git commit -m "Add CampusCart starter"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/campuscart-ci.git
git push -u origin main
```

Replace YOUR-USERNAME. If Git requests identity, set `git config user.name "Your Name"` and `git config user.email "your GitHub email"` (or GitHub noreply email), then retry commit. Authenticate through Git Credential Manager/browser or VS Code GitHub sign-in; account passwords do not work for HTTPS Git pushes. Never put tokens in files. Refresh GitHub: source files and package-lock.json should appear, but not node_modules.

## 3. Create your first workflow (30–50 min)

In VS Code create `.github`, inside it `workflows`, then `ci.yml`. Type the following using spaces, not tabs. The starter deliberately does not contain this file.

```yaml
name: CampusCart CI
on: [push, pull_request]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

| Line | Meaning |
|---|---|
| name | Label shown in Actions |
| on | Run after pushes and pull request events |
| permissions | Read-only repository access |
| jobs / check | Group of tasks, named check |
| runs-on | GitHub-hosted Linux runner |
| steps | Ordered tasks |
| checkout | Copy repository onto runner |
| setup-node | Install/select Node 22 |
| with / node-version | Input for the action |
| npm ci | Install exactly from committed lockfile |
| npm test | Run automated tests |
| npm run build | Compile production application |

```sh
git add .github/workflows/ci.yml
git commit -m "Add continuous integration"
git push
```

GitHub → Actions → CampusCart CI → latest run → check. Expand each step. Yellow means pending/running, green means success, red means failure. If Actions are disabled, check repository Settings → Actions or ask lecturer. If npm ci fails, check package-lock.json is committed. If build fails, inspect the first actual error. Never skip a failing check just to get green.

## 4. Add Semgrep (50–70 min)

Semgrep is static application security testing (SAST). It reads source code, not the running website. No account, token or local installation is needed for this CI exercise. Create `.github/workflows/security.yml`:

```yaml
name: Semgrep Security
on: [push, pull_request]
permissions:
  contents: read
jobs:
  scan:
    runs-on: ubuntu-latest
    container: semgrep/semgrep
    steps:
      - uses: actions/checkout@v4
      - run: semgrep scan --config .semgrep.yml --error
```

Create `.semgrep.yml` at the project root:

```yaml
rules:
  - id: classroom-no-eval
    languages: [javascript, typescript]
    message: Avoid eval; use safe parsing or explicit operations.
    severity: ERROR
    pattern: eval(...)
```

The container provides Semgrep. `--config` selects our local rule; `--error` makes findings fail the job. The rule searches for calls to eval. It is a teaching rule, not a complete security audit.

```sh
git add .github/workflows/security.yml .semgrep.yml
git commit -m "Add Semgrep security check"
git push
```

Open Actions → Semgrep Security → scan. Expect zero findings. Optional broader scan: change the command to `semgrep scan --config .semgrep.yml --config p/javascript --error` (requires registry access; findings need review). For optional hosted dashboard, sign in at https://semgrep.dev, connect your own GitHub repository using its onboarding instructions and use its generated workflow and repository secret if required. This is separate from hosting the app. Account/plan and organisation permissions may vary.

### Controlled red-to-green security experiment

Create a branch before introducing a finding:

```sh
git switch -c security-demo
```

Create `lib/security-demo.js` with this inert, never-imported example:

```js
export function demo() {
  return eval('2 + 2');
}
```

Do not execute it. Commit and push:

```sh
git add lib/security-demo.js
git commit -m "Demonstrate security finding"
git push -u origin security-demo
```

Observe the red Semgrep run, expand scan and identify file, line and rule. Replace `eval('2 + 2')` with `2 + 2`. Commit and push again. Observe green. Do not merge this demo branch; return to main with `git switch main`.

## 5. Publish the website (70–85 min)

Use https://vercel.com (personal educational use, subject to plan limits). Sign in with GitHub → Add New → Project → import campuscart-ci. Authorise only the repository needed. Framework: Next.js; root: repository root; defaults for build/install; no environment variables. Click Deploy. Open the generated URL and test basket and API. If import is blocked, ask lecturer to demonstrate using their repository. Never publish secrets or personal data.

Vercel normally deploys main to production and other branches to preview. GitHub Actions and Vercel run independently by default: a green check is NOT automatically a deployment gate. For this lab, wait for green checks before merging. Optional repository rules/branch protection: require the `check` and `scan` checks before merging into main, where supported by your plan. Production should use pinned action versions/digests and reviewed deployment controls.

## 6. Frontend challenges (85–110 min)

Create a branch `git switch -c storefront-improvements`. Complete at least three challenges. Run locally, commit and push, then open a pull request on GitHub. Inspect both checks and the Vercel preview. Merge only after both checks pass; open the production URL and confirm changes.

1. **Brand refresh:** change hero heading in app/page.js and colours in app/globals.css. Verify on desktop and narrow screen.
2. **New product:** add a unique product in lib/products.js (price in pence, stock integer, category from existing options). Verify search, detail page, basket and GET API.
3. **Price sorting:** add a state variable and dropdown in components/Shop.jsx. Sort a copy of visible products by price; never mutate original props. Verify ascending and descending order.
4. **Bonus:** add a favourite button and count using useState; verify it toggles without reloading.

```sh
npm test
npm run build
git add .
git commit -m "Improve storefront"
git push -u origin storefront-improvements
```

Stop dev server before build. After merge: `git switch main` then `git pull`. For an extra CI failure demonstration on a separate branch, temporarily change the expected total in tests/products.test.js from 5998 to 1, push, observe failure, restore 5998 and push again. Never merge the deliberately failing version.

## 7. Evidence and recap (110–120 min)

Submit repository URL, production URL (if deployment succeeded), screenshot of green CI and Semgrep, screenshot of the red finding and fixed result, and a short description of three improvements. Do not expose tokens or personal details.

Questions: What triggers a workflow? What is a runner? Why use npm ci? What does Semgrep inspect? Does a green scan prove security? Does GitHub Actions automatically block Vercel? What changes when you merge a PR?

Official references: https://docs.github.com/actions ; https://semgrep.dev/docs/ ; https://vercel.com/docs/git ; https://nextjs.org/docs
