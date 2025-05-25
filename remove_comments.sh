#!/bin/bash

# Find all TypeScript and TSX files in the src directory
find /Users/franciscoferraro/Documents/CODE-PROJECTS/logifer-backoffice/src -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  # Remove all comments that begin with // (but not /// which are TypeScript reference comments)
  sed -i '' -e '/^[[:space:]]*\/\/[^\/]/d' -e 's/[[:space:]]*\/\/.*$//' "$file"
done

echo "All comments have been removed from TypeScript and TSX files."
