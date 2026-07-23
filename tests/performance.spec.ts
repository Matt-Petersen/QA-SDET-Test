import { test, expect } from './helpers/fixtures';
import {
  MAX_INITIAL_PAGE_LOAD_MS,
  MAX_BUNDLE_SIZE_BYTES,
  MAX_ADD_TODO_TIME_MS,
  BUNDLE_FILENAME,
  PERFORMANCE_TEST_TODO_TEXT,
} from './helpers';

test.describe('Performance', () => {
  test('initial page load performance test', async ({ page, todoPage: _todoPage }) => {
    const loadTime = await page.evaluate(() => {
      const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return entry.loadEventEnd - entry.startTime;
    });
    expect(loadTime).toBeLessThan(MAX_INITIAL_PAGE_LOAD_MS);
  });

  test('validate bundle size', async ({ page, todoPage: _todoPage }) => {
    const bundleSize = await page.evaluate((bundleFilename) => {
      const entry = performance.getEntriesByType('resource')
        .find(r => r.name.includes(bundleFilename)) as PerformanceResourceTiming;
      return entry.transferSize;
    }, BUNDLE_FILENAME);
    expect(bundleSize).toBeLessThan(MAX_BUNDLE_SIZE_BYTES);
  });

  test('adding a todo performance test', async ({ todoPage }) => {
    const startTime = Date.now();
    await todoPage.addToDo(PERFORMANCE_TEST_TODO_TEXT);
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(MAX_ADD_TODO_TIME_MS);
  });
});
