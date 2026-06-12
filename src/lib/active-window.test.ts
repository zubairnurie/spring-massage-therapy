import { isActiveNow } from './active-window';

// Run with: npx tsx src/lib/active-window.test.ts
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  } else {
    console.log('PASS:', msg);
  }
}

const summerStart = new Date('2026-07-15T12:00:00');
const summerEnd = new Date('2026-10-15T12:00:00');

// In-window
assert(isActiveNow({ active: true, startsAt: '2026-06-01', endsAt: '2026-09-21' }, summerStart) === true, 'In-window summer promo shows on July 15');

// After end
assert(isActiveNow({ active: true, startsAt: '2026-06-01', endsAt: '2026-09-21' }, summerEnd) === false, 'Same promo hidden on Oct 15 (past end)');

// Before start
assert(isActiveNow({ active: true, startsAt: '2026-12-01', endsAt: '2027-01-05' }, summerStart) === false, 'Christmas promo hidden in July');

// active=false overrides everything
assert(isActiveNow({ active: false, startsAt: '2026-06-01', endsAt: '2026-09-21' }, summerStart) === false, 'Manually paused promo stays hidden');

// No dates = active
assert(isActiveNow({ active: true }, summerStart) === true, 'Evergreen promo (no dates) always shows when active');

// Only end set
assert(isActiveNow({ active: true, endsAt: '2026-12-31' }, summerStart) === true, 'Only end set: shows before end');
assert(isActiveNow({ active: true, endsAt: '2026-01-01' }, summerStart) === false, 'Only end set: hidden after end');

// Boundary: today === startsAt should show
assert(isActiveNow({ active: true, startsAt: '2026-07-15' }, summerStart) === true, 'Promo shows on its start day');

// Boundary: today === endsAt should still show
assert(isActiveNow({ active: true, endsAt: '2026-07-15' }, summerStart) === true, 'Promo shows on its last day');

// active undefined behaves like active=true
assert(isActiveNow({ startsAt: '2026-06-01', endsAt: '2026-09-21' }, summerStart) === true, 'Undefined active treated as on');

console.log('All tests passed.');
