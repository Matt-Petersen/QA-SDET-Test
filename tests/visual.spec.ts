import { test, expect } from './helpers/fixtures';
import { TODO_ITEMS } from './helpers';

test.describe('Visual Regression', () => {
  test('empty todo list matches baseline', async ({ page, todoPage: _todoPage }) => {
    await expect(page).toHaveScreenshot('empty-state.png');
  });

  test('todo list with items matches baseline', async ({ page, todoPage }) => {
    await todoPage.createToDos(TODO_ITEMS);
    await expect(page).toHaveScreenshot('with-items.png');
  });
});
