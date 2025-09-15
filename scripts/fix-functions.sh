#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FUNCTIONS_DIR="$ROOT_DIR/functions"
SRC_DIR="$FUNCTIONS_DIR/src"

[ -d "$FUNCTIONS_DIR" ] || { echo "❌ Missing functions directory"; exit 1; }

echo "Fixing Functions in: $FUNCTIONS_DIR"

# macOS/BSD sed inline helper
sed_inplace() { sed -i '' "$@"; }

# A) tsconfig tuned for Functions build, isolates types
echo "Writing functions/tsconfig.json"
cat > "$FUNCTIONS_DIR/tsconfig.json" <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "rootDir": "src",
    "outDir": "lib",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["node"],
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "lib"]
}
JSON

# B) Ensure src exists and has an entry
mkdir -p "$SRC_DIR"
if [ -f "$SRC_DIR/index-fixed.ts" ]; then
  echo "Using src/index-fixed.ts as src/index.ts"
  mv -f "$SRC_DIR/index-fixed.ts" "$SRC_DIR/index.ts"
fi
if ! find "$SRC_DIR" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) -print -quit | grep -q .; then
  echo "Creating minimal src/index.ts"
  cat > "$SRC_DIR/index.ts" <<'TS'
import { initializeApp } from "firebase-admin/app";
import { onCall } from "firebase-functions/v2/https";
initializeApp();
export const ping = onCall(async () => ({ ok: true }));
TS
fi

# C) Optional: remove Genkit sample (often causes missing-dep errors)
if [ "${KEEP_GENKIT:-}" != "true" ] && [ -f "$SRC_DIR/genkit-sample.ts" ]; then
  echo "Removing src/genkit-sample.ts"
  rm -f "$SRC_DIR/genkit-sample.ts"
fi

# D) Best-effort code tweaks for common errors in index.ts
if [ -f "$SRC_DIR/index.ts" ]; then
  echo "Patching common issues in src/index.ts"
  # deprecated substr -> substring
  sed_inplace 's/\.substr\s*(/\.substring(/g' "$SRC_DIR/index.ts" || true
  # nodemailer factory name
  sed_inplace 's/createTransporter/createTransport/g' "$SRC_DIR/index.ts" || true
  # Stripe non-null assertions at call sites (keep runtime guards in code when possible)
  sed_inplace 's/stripe\.paymentIntents\.create/stripe!.paymentIntents.create/g' "$SRC_DIR/index.ts" || true
  sed_inplace 's/stripe\.paymentIntents\.retrieve/stripe!.paymentIntents.retrieve/g' "$SRC_DIR/index.ts" || true
  sed_inplace 's/stripe\.refunds\.create/stripe!.refunds.create/g' "$SRC_DIR/index.ts" || true
  sed_inplace 's/stripe\.webhooks\.constructEvent/stripe!.webhooks.constructEvent/g' "$SRC_DIR/index.ts" || true
fi

pushd "$FUNCTIONS_DIR" >/dev/null

# E) Optionally clean install
if [ "${CLEAN:-}" = "true" ]; then
  echo "CLEAN=true: removing node_modules and package-lock.json"
  rm -rf node_modules package-lock.json
  npm cache clean --force >/dev/null 2>&1 || true
fi

# F) Ensure scripts/engines/main
echo "Aligning package.json (engines/main/scripts)"
npm pkg set engines.node="22" >/dev/null
npm pkg set main="lib/index.js" >/dev/null

if [ "${SKIP_LINT:-}" = "true" ]; then
  npm pkg set scripts.lint='echo "Skipping lint"' >/dev/null
else
  npm pkg set scripts.lint='eslint "src/**/*.{ts,tsx,js}"' >/dev/null
fi
npm pkg set scripts.build="tsc" >/dev/null
npm pkg set scripts.build:watch="tsc --watch" >/dev/null
npm pkg set scripts.serve='npm run build && firebase emulators:start --only functions' >/dev/null
npm pkg set scripts.shell='npm run build && firebase functions:shell' >/dev/null
npm pkg set scripts.start='npm run shell' >/dev/null
npm pkg set scripts.deploy='firebase deploy --only functions' >/dev/null
npm pkg set scripts.logs='firebase functions:log' >/dev/null

# G) Install deps (respect existing versions; add missing ones)
echo "Installing functions dependencies"
npm install

# Add commonly-missing types and libs
npm i -D @types/node @types/nodemailer || true
# If you use nodemailer/stripe and they’re not present, add them
npm ls nodemailer >/dev/null 2>&1 || npm i nodemailer
npm ls stripe >/dev/null 2>&1 || npm i stripe

# H) ESLint basic TS config (only if lint not skipped)
if [ "${SKIP_LINT:-}" != "true" ]; then
  echo "Setting up ESLint for TypeScript"
  npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin || true
  cat > .eslintrc.json <<'JSON'
{
  "root": true,
  "env": { "node": true, "es2021": true },
  "parser": "@typescript-eslint/parser",
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "ignorePatterns": ["lib/", "node_modules/"]
}
JSON
fi

echo "Building functions"
npm run build

popd >/dev/null
