#!/bin/bash

echo "🔍 NetForge Installation Verification"
echo "======================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
node --version || echo "❌ Node.js not found"

# Check npm
echo "✓ Checking npm..."
npm --version || echo "❌ npm not found"

# Check key files
echo ""
echo "✓ Checking files..."
files=(
  "package.json"
  "server/index.ts"
  "server/config/index.ts"
  "server/database/schema.sql"
  "src/App.tsx"
  "src/pages/SetupPage.tsx"
  "src/lib/api.ts"
  ".gitignore"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ❌ $file MISSING"
  fi
done

# Check dependencies
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "  ✓ node_modules exists"
else
  echo "  ⚠ node_modules not found - run: npm install"
fi

# Check git
echo ""
echo "✓ Checking git status..."
if [ -d ".git" ]; then
  echo "  ✓ Git repository initialized"
  echo "  Commits: $(git rev-list --count HEAD)"
  echo "  Latest: $(git log -1 --oneline)"
else
  echo "  ❌ Not a git repository"
fi

echo ""
echo "======================================"
echo "📋 Next Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   See GIT_SETUP.md for instructions"
echo ""
echo "2. Test the application:"
echo "   npm start"
echo "   Open http://localhost:3000"
echo ""
echo "3. Complete setup wizard"
echo "   Follow on-screen instructions"
echo ""
echo "📚 Documentation:"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - TESTING.md - Testing checklist"
echo "   - MIGRATION_COMPLETE.md - What changed"
echo ""
