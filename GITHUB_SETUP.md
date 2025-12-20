# How to Push to GitHub

## Step-by-Step Guide

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository details:
   - **Name**: `elation-by-fmh` (or any name you prefer)
   - **Description**: "Event Planning Web Application - Elation by FMH"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 2: Initialize Git (if not already done)

Open terminal/command prompt in your project folder and run:

```bash
cd "C:\Users\Lenovo\OneDrive - National University of Sciences & Technology\Documents\5th semester\Web Eng\elation\prototype"

# Initialize git repository
git init
```

### Step 3: Add All Files

```bash
# Add all files to staging
git add .
```

**Note:** The `.gitignore` file will automatically exclude:
- `node_modules/` (too large, not needed)
- `.env` (contains secrets, don't share!)
- `uploads/` (user uploads, not needed in repo)

### Step 4: Make Initial Commit

```bash
git commit -m "Initial commit: Elation by FMH - Event Planning Web Application"
```

If this is your first time using Git, you may need to set your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 5: Connect to GitHub Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
If your GitHub username is `john-doe` and repo name is `elation-by-fmh`:
```bash
git remote add origin https://github.com/john-doe/elation-by-fmh.git
git branch -M main
git push -u origin main
```

### Step 6: Enter GitHub Credentials

- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` permissions
  - Copy and paste as password

---

## Quick Commands Summary

```bash
# Navigate to project folder
cd "path/to/prototype"

# Initialize (if needed)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Elation by FMH"

# Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Future Updates (After Initial Push)

When you make changes and want to update GitHub:

```bash
# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## Important Notes

✅ **DO Include:**
- All source code (`.js`, `.ejs`, `.css`, `.json`, etc.)
- `package.json` (so others can run `npm install`)
- `README.md`, `.gitignore`, etc.
- Project structure and configuration files

❌ **DON'T Include (already in .gitignore):**
- `node_modules/` - Too large, regenerated with `npm install`
- `.env` - Contains secrets, create your own
- `uploads/` - User-uploaded files, not needed in repo
- `.DS_Store`, `*.log` - System/temporary files

---

## Troubleshooting

**Error: "remote origin already exists"**
```bash
# Remove existing remote
git remote remove origin
# Then add again
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Error: "fatal: refusing to merge unrelated histories"**
```bash
# If you have commits in both local and remote
git pull origin main --allow-unrelated-histories
# Resolve any conflicts, then:
git push -u origin main
```

**Error: Authentication failed**
- Use Personal Access Token instead of password
- Or set up SSH keys for authentication

**Want to check what will be uploaded?**
```bash
# See what files are staged
git status

# See what files are tracked
git ls-files
```

---

## Alternative: GitHub Desktop (GUI)

If you prefer a graphical interface:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your prototype folder
5. Click "Publish repository" button
6. Enter repository name and description
7. Click "Publish repository"

---

**That's it! Your code is now on GitHub.** 🎉

Others can clone it using:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

