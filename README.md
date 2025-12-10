⚠️ **IMPORTANT: READ THIS**

We’ll be developing the **Technovit’25 website** collaboratively using **Next.js** with **pnpm** as the package manager. Follow these steps to contribute and ensure smooth, conflict-free development.

## Getting Started

1. **Fork the Repository**
   Fork the main repository to your own GitHub account:
   [https://github.com/a2ys/technovit25](https://github.com/a2ys/technovit25)

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/<your-username>/technovit25.git
   cd technovit25
   ```

3. **Set Upstream Remote**

   ```bash
   git remote add upstream https://github.com/a2ys/technovit25.git
   ```

4. **Install Dependencies**

   ```bash
   pnpm install
   ```

## Working on Issues

- All tasks will be listed as **GitHub Issues** under the main repository.
- Pick an issue assigned to you (or comment to get assigned).
- **Do not** work on unassigned issues to avoid duplication.
- Limit each pull request to changes in **no more than 2–3 files** to keep reviews quick and clean.

## Workflow

1. **Create a New Branch**

   ```bash
   git checkout -b <issue-number>-<short-description>
   ```

   Example:

   ```bash
   git checkout -b 12-fix-navbar
   ```

2. **Make Changes**

   - Work only on files relevant to your issue.
   - Ensure code is formatted and functional locally before committing.

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "Fix: <short description of change> (#issue-number)"
   ```

4. **Sync with Upstream (Before Pushing)**

   ```bash
   git fetch upstream
   git merge upstream/development
   ```

5. **Push to Your Fork**

   ```bash
   git push origin <branch-name>
   ```

6. **Open a Pull Request**

   - Base branch: `development`
   - Compare: your feature branch
   - Link your PR to the corresponding **Issue Number**

## Good Practices

- Always **pull from upstream/development** before starting new work.
- Keep your PRs **small and focused**.
- Write **clear commit messages**.
- If you face merge conflicts, **resolve them locally** before pushing.
