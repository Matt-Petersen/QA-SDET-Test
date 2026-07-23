import { test, expect } from './helpers/fixtures';
import {
  TODO_ITEMS,
  FIRST_ITEM_INDEX,
  THIRD_ITEM_INDEX,
  ACTIVE_COUNT,
  COMPLETED_COUNT,
  ALL_COUNT,
  EXPECTED_REMAINING_COUNT,
  EXPECTED_REMAINING_AFTER_DELETE_COUNT,
} from './helpers';

test.beforeEach(async ({ todoPage }) => {
  await todoPage.createToDos(TODO_ITEMS);
});

test.describe('Filters', () => {
  test('filter views show correct items', async ({ todoPage }) => {
    await todoPage.completeItem(FIRST_ITEM_INDEX);

    await todoPage.clickActiveFilter();
    await expect(todoPage.locTodoItems).toHaveCount(ACTIVE_COUNT);

    await todoPage.clickCompleteFilter();
    await expect(todoPage.locTodoItems).toHaveCount(COMPLETED_COUNT);

    await todoPage.clickAllFilter();
    await expect(todoPage.locTodoItems).toHaveCount(ALL_COUNT);
  });
});

test.describe('Todo Actions', () => {
  test('clear completed items', async ({ todoPage }) => {
    await todoPage.completeItem(FIRST_ITEM_INDEX);
    await todoPage.completeItem(THIRD_ITEM_INDEX);

    await todoPage.clickClearCompleted();

    await expect(todoPage.locTodoItems).toHaveCount(EXPECTED_REMAINING_COUNT);
  });

  test('verify toggle all button', async ({ todoPage }) => {
    await todoPage.toggleCompleteAll();
    expect(await todoPage.areAllItemsCompleted(true)).toBe(true);

    await todoPage.toggleCompleteAll();
    expect(await todoPage.areAllItemsCompleted(false)).toBe(true);
  });

  test('delete button only appears on hover', async ({ todoPage }) => {
    expect(await todoPage.isDeleteButtonVisible(FIRST_ITEM_INDEX)).toBe(false);

    await todoPage.hoverItem(FIRST_ITEM_INDEX);

    expect(await todoPage.isDeleteButtonVisible(FIRST_ITEM_INDEX)).toBe(true);
  });

  test('deleting an item removes it from the list', async ({ todoPage }) => {
    await todoPage.hoverItem(FIRST_ITEM_INDEX);
    await todoPage.deleteItem(FIRST_ITEM_INDEX);

    await expect(todoPage.locTodoItems).toHaveCount(EXPECTED_REMAINING_AFTER_DELETE_COUNT);
    await expect(todoPage.locTodoItems.first()).toContainText(TODO_ITEMS[1]);
  });
});
