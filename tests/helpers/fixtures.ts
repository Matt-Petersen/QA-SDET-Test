import { test as base } from '@playwright/test';
import { ToDoPage as TodoPage } from './index';


type MyFixtures = {
  todoPage: TodoPage;
};

export const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goTo();
    await use(todoPage);
  },
});
export { expect } from '@playwright/test';