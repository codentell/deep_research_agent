#!/usr/bin/env node

console.log('🔍 Verifying shadcn/ui setup...');

const fs = require('fs');
const path = require('path');

// Check if required files exist
const requiredFiles = [
  'src/lib/utils.ts',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/progress.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/separator.tsx',
  'src/components/ui/textarea.tsx',
  'src/components/ui/select.tsx'
];

const missing = [];
const existing = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    existing.push(file);
  } else {
    missing.push(file);
  }
});

console.log(`✅ Found ${existing.length} components:`);
existing.forEach(file => console.log(`   ${file}`));

if (missing.length > 0) {
  console.log(`❌ Missing ${missing.length} files:`);
  missing.forEach(file => console.log(`   ${file}`));
} else {
  console.log('🎉 All shadcn/ui components are properly set up!');
}

// Check package.json for required dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const requiredDeps = [
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'framer-motion',
  '@radix-ui/react-slot',
  '@radix-ui/react-progress',
  '@radix-ui/react-select',
  '@radix-ui/react-separator'
];

const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.log(`📦 Missing dependencies: ${missingDeps.join(', ')}`);
  console.log('Run: npm install to install missing dependencies');
} else {
  console.log('📦 All required dependencies are installed');
}

console.log('\n🚀 Ready to start development server with: npm run dev');