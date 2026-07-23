import { test, expect } from './helpers/fixtures';

test.describe('Performance', () => {
  /*
  Performance Budget:
  Initial page load ≤ 2000ms.
  Bundle size ≤ 250 KB.
  Adding a todo ≤ 250ms.
  */

  test('initial page load performance test', async ({ page }) => {
    await page.goto('http://127.0.0.1:7002');
    const loadTime = await page.evaluate(() => {
      const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return entry.loadEventEnd - entry.startTime;
    });
    expect(loadTime).toBeLessThan(2000);
  });

  test('validate bundle size', async ({ page }) => {
    await page.goto('http://127.0.0.1:7002');
    const bundleSize = await page.evaluate(() => {
      const entry = performance.getEntriesByType('resource')
        .find(r => r.name.includes('app.bundle.js')) as PerformanceResourceTiming;
      return entry.transferSize;
    });
    expect(bundleSize).toBeLessThan(250 * 1024);
  });

  test('adding a todo performance test', async ({ todoPage }) => {
    const startTime = Date.now();
    await todoPage.addToDo('Todo performance test');
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(250);
  });
});

test.describe('Filters', () => {
  test('filter views show correct items', async ({ todoPage }) => {
    await todoPage.createToDos(['Item 1', 'Item 2', 'Item 3']);
    await todoPage.completeItem(0);

    await todoPage.clickActiveFilter();
    await expect(todoPage.locTodoItems).toHaveCount(2);

    await todoPage.clickCompleteFilter();
    await expect(todoPage.locTodoItems).toHaveCount(1);

    await todoPage.clickAllFilter();
    await expect(todoPage.locTodoItems).toHaveCount(3);
  });
});

test.describe('Todo Actions', () => {
  test('clear completed items', async ({ todoPage }) => {
    await todoPage.createToDos(['Item 1', 'Item 2', 'Item 3']);

    await todoPage.completeItem(0);
    await todoPage.completeItem(2);

    await todoPage.clickClearCompleted();

    await expect(todoPage.locTodoItems).toHaveCount(1);
  });

  test('verify toggle all button', async ({ todoPage }) => {
    await todoPage.createToDos(['Item 1', 'Item 2', 'Item 3']);

    await todoPage.toggleCompleteAll();
    expect(await todoPage.isItemCompleted(0)).toBe(true);
    expect(await todoPage.isItemCompleted(1)).toBe(true);
    expect(await todoPage.isItemCompleted(2)).toBe(true);

    await todoPage.toggleCompleteAll();
    expect(await todoPage.isItemCompleted(0)).toBe(false);
    expect(await todoPage.isItemCompleted(1)).toBe(false);
    expect(await todoPage.isItemCompleted(2)).toBe(false);
  });
});
