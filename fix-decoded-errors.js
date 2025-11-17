#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix decoded.user patterns
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern 1: decoded.user -> decoded?.["user"]
  if (content.includes('decoded.user')) {
    content = content.replace(/decoded\.user\b/g, 'decoded?.["user"]');
    modified = true;
  }
  
  // Pattern 2: decoded?.user -> decoded?.["user"]
  if (content.includes('decoded?.user')) {
    content = content.replace(/decoded\?\.user\b/g, 'decoded?.["user"]');
    modified = true;
  }
  
  // Pattern 3: decoded?['user'] -> decoded?.["user"] (normalize quotes)
  if (content.includes("decoded?['user']")) {
    content = content.replace(/decoded\?\['user'\]/g, 'decoded?.["user"]');
    modified = true;
  }
  
  // Pattern 4: Fix broken ternary operator: decoded ? ["user"] -> decoded?.["user"]
  content = content.replace(/decoded\s*\?\s*\["user"\]/g, 'decoded?.["user"]');
  
  // Pattern 5: Add optional chaining for property access
  // decoded?.["user"].id -> decoded?.["user"]?.id
  content = content.replace(/decoded\?\["user"\]\.(\w+)/g, 'decoded?.["user"]?.$1');
  
  // Pattern 6: decoded["user"].id -> decoded?.["user"]?.id
  content = content.replace(/decoded\["user"\]\.(\w+)/g, 'decoded?.["user"]?.$1');
  
  if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔍 Searching for TypeScript files...\n');
const tsFiles = findTsFiles('./src/app');
console.log(`📁 Found ${tsFiles.length} TypeScript files\n`);

let fixedCount = 0;
tsFiles.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} files`);
console.log('🎉 All done!');
