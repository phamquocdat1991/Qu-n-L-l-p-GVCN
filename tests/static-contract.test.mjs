import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const netlify = await readFile(new URL('../netlify.toml', import.meta.url), 'utf8');

test('uses a compiled production stylesheet instead of the Tailwind browser CDN', () => {
  assert.doesNotMatch(source, /cdn\.tailwindcss\.com/);
  assert.match(source, /href="\/assets\/app\.css"/);
  assert.match(netlify, /publish\s*=\s*"dist"/);
});

test('backup export uses a real Blob URL and a connected download link', () => {
  assert.match(source, /new Blob\(\[dataStr\]/);
  assert.match(source, /document\.body\.appendChild\(linkElement\)/);
  assert.match(source, /URL\.revokeObjectURL\(objectUrl\)/);
});

test('dashboard does not count an unrecorded student as present', () => {
  assert.match(source, /const v=rec\[s\.id\];if\(v==='present'\)present\+\+/);
  assert.match(source, /recorded=present\+late\+excused\+unexcused/);
  assert.match(source, /'Chưa điểm danh'/);
});

test('dashboard derives the current timetable week without replacing the selected editor week', () => {
  assert.match(source, /const currentWeekId=tkbDetectCurrentWeek\(state\.timetable\.weeks\)/);
  assert.match(source, /week\?\.startDate\|\|state\.trucNhat\?\.currentWeekStart/);
});

test('friendly classroom UI includes quick actions, mobile navigation and accessibility helpers', () => {
  assert.match(source, /id="classroom-friendly-c-2026"/);
  assert.match(source, /class="classroom-quick-actions"/);
  assert.match(source, /classroom-mobile-nav/);
  assert.match(source, /Bỏ qua đến nội dung chính/);
  assert.match(source, /aria-current/);
});

test('third-party runtime libraries are version pinned', () => {
  assert.match(source, /@phosphor-icons\/web@\d+\.\d+\.\d+/);
  assert.match(source, /xlsx-\d+\.\d+\.\d+\/package/);
  assert.doesNotMatch(source, /xlsx-latest/);
});

test('all inline classic scripts are valid JavaScript', () => {
  const scripts = [...source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs]) => !/\bsrc\s*=/.test(attrs) && !/\btype\s*=\s*["']module["']/.test(attrs));
  assert.ok(scripts.length > 0);
  scripts.forEach(([, , code], index) => {
    assert.doesNotThrow(() => new Function(code), `inline classic script ${index + 1} must parse`);
  });
});
