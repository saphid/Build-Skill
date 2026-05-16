#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

function read(path) {
  assert.equal(existsSync(path), true, `missing ${path}`);
  return readFileSync(path, 'utf8');
}

function frontmatter(text, path) {
  assert.equal(text.startsWith('---\n'), true, `${path} must start with YAML frontmatter`);
  const end = text.indexOf('\n---\n', 4);
  assert.notEqual(end, -1, `${path} must close YAML frontmatter`);
  return text.slice(4, end);
}

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.name, 'build-skill');
assert.equal(pkg.license, 'MIT');
assert.deepEqual(pkg.pi.skills, ['./skills']);
assert.deepEqual(pkg.pi.prompts, ['./prompts']);
assert.ok(pkg.keywords.includes('pi-package'));

const skill = read('skills/simple-build/SKILL.md');
const skillFm = frontmatter(skill, 'skills/simple-build/SKILL.md');
assert.match(skillFm, /^name: simple-build$/m);
assert.match(skillFm, /^description: .+/m);
assert.ok(skill.includes('Coders never merge'));
assert.ok(skill.includes('Merge reviewer'));
assert.ok(skill.includes('references/evidence.md'));

const prompt = read('prompts/build.md');
const promptFm = frontmatter(prompt, 'prompts/build.md');
assert.match(promptFm, /^description: .+/m);
assert.ok(prompt.includes('/skill:simple-build'));

read('skills/simple-build/references/evidence.md');
read('README.md');
read('docs/design.md');

console.log('Build Skill package check passed.');
