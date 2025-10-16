#!/bin/bash

echo "🧹 Cleaning up Git staging area..."
echo ""

# Unstage everything first
git reset

echo "✅ Unstaged all files"
echo ""

# Remove node_modules from git cache if it was tracked
echo "🗑️  Removing node_modules from git tracking..."
git rm -r --cached backend/node_modules 2>/dev/null || true
git rm -r --cached frontend/node_modules 2>/dev/null || true
git rm -r --cached node_modules 2>/dev/null || true

echo "✅ Removed node_modules from tracking"
echo ""

# Add gitignore first
git add .gitignore
git add backend/.gitignore
git add frontend/.gitignore
git add backend/.env.example

echo "✅ Added .gitignore files"
echo ""

# Add all other files (node_modules will be ignored now)
git add .

echo "✅ Added all project files (excluding node_modules)"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
git status --short
echo ""

# Ask for confirmation
read -p "Do you want to proceed with the commit? (y/n): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    # Commit
    read -p "Enter commit message: " commit_message
    git commit -m "$commit_message"
    
    echo ""
    echo "✅ Committed successfully"
    echo ""
    
    # Check if remote exists
    if ! git remote | grep -q "origin"; then
        read -p "Enter your GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo "✅ Remote 'origin' added"
        echo ""
    fi
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git branch -M main
    git push -u origin main --force
    
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🎉 Your Vibe Chat project is now on GitHub!"
else
    echo "❌ Commit cancelled"
fi
