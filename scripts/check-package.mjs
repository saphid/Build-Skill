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
assert.ok(pkg.keywords.includes('planning-slices'));

const skill = read('skills/simple-build/SKILL.md');
const skillFm = frontmatter(skill, 'skills/simple-build/SKILL.md');
assert.match(skillFm, /^name: simple-build$/m);
assert.match(skillFm, /^description: .+/m);
assert.ok(skill.includes('Coders never merge'));
assert.ok(skill.includes('Codex Review'));
assert.ok(skill.includes('codex-review'));
assert.ok(skill.includes('x-hi'));
assert.ok(skill.includes('Merge reviewer'));
assert.ok(skill.includes('Persistent plan document contract'));
assert.ok(skill.includes('Critical findings for next slice'));
assert.ok(skill.includes('Escape hatch'));
assert.ok(skill.includes('gardening'));
assert.ok(skill.includes('references/evidence.md'));

const planningSkill = read('skills/planning-slices/SKILL.md');
const planningSkillFm = frontmatter(planningSkill, 'skills/planning-slices/SKILL.md');
assert.match(planningSkillFm, /^name: planning-slices$/m);
assert.match(planningSkillFm, /^description: .+/m);
assert.ok(planningSkill.includes('Review in 2 minutes'));
assert.ok(planningSkill.includes('Critical findings for next slice'));
assert.ok(planningSkill.includes('Execute with: /build <path>'));

const prompt = read('prompts/build.md');
const promptFm = frontmatter(prompt, 'prompts/build.md');
assert.match(promptFm, /^description: .+/m);
assert.ok(prompt.includes('/skill:simple-build'));
assert.ok(prompt.includes('x-hi'));
assert.ok(prompt.includes('critical findings for the next slice'));

const planPrompt = read('prompts/plan-build.md');
const planPromptFm = frontmatter(planPrompt, 'prompts/plan-build.md');
assert.match(planPromptFm, /^description: .+/m);
assert.ok(planPrompt.includes('/skill:planning-slices'));
assert.ok(planPrompt.includes('Critical findings for next slice'));

read('skills/simple-build/references/evidence.md');
read('README.md');
read('docs/design.md');
read('docs/demo.md');

console.log('Build Skill package check passed.');
