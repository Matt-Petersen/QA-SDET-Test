import { test, expect } from './helpers/fixtures';
import { TODO_ITEMS } from './helpers';

test.describe('Visual Regression', () => {
  // Snapshots are maintained for Chromium only to avoid per-browser baseline drift.
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are Chromium-only.');
  // Baselines are generated on macOS; CI runs on ubuntu and has no matching
  // baseline, so these only run locally until a Linux baseline is added.
  // UPDATE_VISUAL_BASELINE bypasses this so CI can generate one on demand
  // (see the "update_visual_baseline" workflow_dispatch input).
  test.skip(!!process.env.CI && !process.env.UPDATE_VISUAL_BASELINE, 'Visual baselines are macOS-only; not run in CI yet.');

  test('empty todo list matches baseline', async ({ page, todoPage: _todoPage }) => {
    await expect(page).toHaveScreenshot('empty-state.png');
  });

  test('todo list with items matches baseline', async ({ page, todoPage }) => {
    await todoPage.createToDos(TODO_ITEMS);
    await expect(page).toHaveScreenshot('with-items.png');
  });
});
