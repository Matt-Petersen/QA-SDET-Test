// App configuration
export const APP_URL = 'http://127.0.0.1:7002';

// Performance budgets
export const MAX_INITIAL_PAGE_LOAD_MS = 2_000;
export const MAX_BUNDLE_SIZE_BYTES = 250 * 1024;
export const MAX_ADD_TODO_TIME_MS = 250;
export const BUNDLE_FILENAME = 'app.bundle.js';
export const PERFORMANCE_TEST_TODO_TEXT = 'Todo performance test';

// Shared todo test data
export const TODO_ITEMS = ['Item 1', 'Item 2', 'Item 3'];
export const FIRST_ITEM_INDEX = 0;
export const THIRD_ITEM_INDEX = 2;

// Filters test expectations
export const COMPLETED_COUNT = 1;
export const ACTIVE_COUNT = TODO_ITEMS.length - COMPLETED_COUNT;
export const ALL_COUNT = TODO_ITEMS.length;

// Todo Actions test expectations
export const NUM_ITEMS_TO_COMPLETE = 2;
export const EXPECTED_REMAINING_COUNT = TODO_ITEMS.length - NUM_ITEMS_TO_COMPLETE;

// Delete test expectations
export const NUM_ITEMS_TO_DELETE = 1;
export const EXPECTED_REMAINING_AFTER_DELETE_COUNT = TODO_ITEMS.length - NUM_ITEMS_TO_DELETE;
