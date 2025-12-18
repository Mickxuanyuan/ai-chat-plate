import { readFile } from "node:fs/promises";

const filePath = process.argv[2];
if (!filePath) {
  console.error("verify-commit-msg: missing commit message file path");
  process.exit(1);
}

const message = (await readFile(filePath, "utf8")).trim();

// Allow merge commits created by git.
if (/^Merge\b/.test(message)) process.exit(0);

// Conventional Commits (minimal).
// Examples:
// - feat(sidebar): add configurable nav items
// - fix(router): migrate to next/navigation
// - chore: add husky hooks
const pattern =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?: .+/;

if (!pattern.test(message)) {
  console.error("Invalid commit message.\n");
  console.error("Expected Conventional Commits format:");
  console.error('  <type>(optional scope): <subject>\n');
  console.error("Examples:");
  console.error("  feat(sidebar): add configurable nav items");
  console.error("  fix(router): migrate to next/navigation");
  console.error("  chore: add husky hooks\n");
  console.error("Your message was:");
  console.error(`  ${message}`);
  process.exit(1);
}

