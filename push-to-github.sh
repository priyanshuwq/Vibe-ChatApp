#!/bin/bash

echo "🚀 Pushing Vibe Chat to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Commit changes
echo ""
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Check if remote exists
if git remote | grep -q "origin"; then
    echo ""
    echo "✅ Remote 'origin' already exists"
else
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url
    git remote add origin "$repo_url"
    echo "✅ Remote 'origin' added"
fi

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🎉 Your project is now on GitHub!"
