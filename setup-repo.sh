#!/bin/bash
# Motu Repository Setup Script
# Run this script to set up the project directory structure

set -e

echo "Setting up Motu Crew Management System..."
echo ""

# Create directory structure
echo "Creating directory structure..."
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github/workflows
mkdir -p src/app/jobs/new
mkdir -p src/app/jobs/\[id\]
mkdir -p src/app/crew/new
mkdir -p src/app/crew/\[id\]
mkdir -p src/app/schedule/daily
mkdir -p src/app/reports
mkdir -p src/app/api/jobs
mkdir -p src/app/api/crew
mkdir -p src/app/api/assignments
mkdir -p src/components/layout
mkdir -p src/components/jobs
mkdir -p src/components/crew
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/types
mkdir -p scripts
mkdir -p docs

echo "Directory structure created."

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
GITIGNORE

# Create .env.local.example
echo "Creating .env.local.example..."
cat > .env.local.example << 'ENVEXAMPLE'
# Copy this file to .env.local and fill in your values
# NEVER commit .env.local to Git

# Airtable Configuration
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=

# NextAuth Configuration
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ENVEXAMPLE

# Create GitHub Actions CI workflow
echo "Creating CI workflow..."
cat > .github/workflows/ci.yml << 'CIWORKFLOW'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
CIWORKFLOW

# Create bug report template
echo "Creating issue templates..."
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'BUGREPORT'
---
name: Bug Report
about: Report a bug to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of what the bug is.

**To reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Device info**
- Device: [e.g. iPhone 14, Desktop]
- Browser: [e.g. Chrome 120, Safari 17]
- OS: [e.g. iOS 17, Windows 11]
BUGREPORT

# Create feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'FEATUREREQUEST'
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Problem**
What problem does this feature solve?

**Proposed solution**
How should this feature work?

**Alternatives considered**
Other approaches you've thought about.

**Additional context**
Any other information or screenshots.
FEATUREREQUEST

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run: npm init -y  (or copy package.json.template to package.json)"
echo "  2. Run: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir"
echo "  3. Copy .env.local.example to .env.local and add your Airtable credentials"
echo "  4. Run: npm run dev"
echo ""
echo "See QUICK_START.md for the full getting-started guide."
