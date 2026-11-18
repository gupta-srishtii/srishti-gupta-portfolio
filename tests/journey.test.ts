import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialJourney, journeyReducer } from '../src/lib/journey.ts';
test('exploration returns from inspection to gallery, book, and studio', () => {
  let state = initialJourney;
  for (const type of ['skip', 'open', 'portal', 'gallery'] as const)
    state = journeyReducer(state, { type });
  state = journeyReducer(state, { type: 'inspect', index: 2 });
  state = journeyReducer(state, { type: 'back' });
  assert.equal(state.view, 'gallery');
  assert.equal(state.inspected, null);
  state = journeyReducer(state, { type: 'back' });
  assert.equal(state.view, 'book');
  state = journeyReducer(state, { type: 'back' });
  assert.equal(state.view, 'studio');
});
test('page turns wrap in both directions', () => {
  let state = journeyReducer(initialJourney, { type: 'page', direction: -1 });
  assert.equal(state.page, 5);
  state = journeyReducer(state, { type: 'page', direction: 1 });
  assert.equal(state.page, 0);
});
test('recruiter bypass clears narrative and inspection immediately', () => {
  assert.deepEqual(journeyReducer({ view: 'gallery', inspected: 1, page: 3 }, { type: 'skip' }), {
    view: 'studio',
    inspected: null,
    page: 0,
  });
});
test('replaying the opening clears chapter and inspection state', () => {
  assert.deepEqual(
    journeyReducer({ view: 'gallery', page: 4, inspected: 2 }, { type: 'replay' }),
    initialJourney,
  );
});
