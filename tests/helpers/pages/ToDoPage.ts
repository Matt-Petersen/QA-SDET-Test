import { type Locator, type Page } from '@playwright/test';
import { ToDoItem } from '../components/ToDoItem'
import { APP_URL } from '../constants'

/**
 * Handles navigation and interactions for the PDQ Todo app.
 */
export class ToDoPage {
    readonly locNewTodoInput: Locator;
    readonly locFilterAll: Locator;
    readonly locFilterActive: Locator;
    readonly locFilterCompleted: Locator;
    readonly locButtonClearCompleted: Locator;
    readonly locButtonToggleAll: Locator;
    readonly locTodoItems: Locator;
    readonly locItemCount: Locator;

    constructor(private readonly page: Page){
        this.locNewTodoInput = page.getByPlaceholder('What needs to be done?');
        this.locFilterAll = page.getByRole('link', { name: 'All'});
        this.locFilterActive = page.getByRole('link', { name: 'Active'});
        this.locFilterCompleted = page.getByRole('link', { name: 'Completed'});
        this.locButtonClearCompleted = page.getByRole('button', { name: 'Clear completed'});
        this.locButtonToggleAll = page.getByTestId('toggle-all');
        this.locTodoItems = page.getByTestId('todo-item');
        this.locItemCount = page.locator('.todo-count');
    }

    /**
     * Navigates to the todo app.
     */
    async goTo(): Promise<void> {
        await this.page.goto(APP_URL)
    }

    /**
     * Adds a new todo item to the list.
     * @param text - The text for the new todo
     */
    async addToDo(text: string): Promise<void> {
        await this.locNewTodoInput.fill(text)
        await this.locNewTodoInput.press('Enter')
    }

    /** Clicks the All filter. */
    async clickAllFilter(): Promise<void> {
        await this.locFilterAll.click()
    }

    /** Clicks the Active filter. */
    async clickActiveFilter(): Promise<void> {
        await this.locFilterActive.click()
    }

    /** Clicks the Completed filter. */
    async clickCompleteFilter(): Promise<void> {
        await this.locFilterCompleted.click()
    }

    /** Clicks the Clear completed button. */
    async clickClearCompleted(): Promise<void> {
        await this.locButtonClearCompleted.click()
    }

    /** Clicks the toggle all checkbox to complete or uncomplete all items. */
    async toggleCompleteAll(): Promise<void> {
        await this.locButtonToggleAll.click()
    }
    
    /**
     * Creates multiple todo items from an array of strings.
     * @param items - The text for each todo to create
     */
    async createToDos(items: string[]): Promise<void> {
        for (const item of items) {
            await this.addToDo(item);                                                                                                     
        }
    }

    /**
     * Completes the todo item at the given index.
     * @param index - Zero-based index of the item to complete
     */
    async completeItem(index: number): Promise<void> {
        await this.getItem(index).toggleCheckItem();
    }

    /**
     * Returns true if the todo item at the given index is completed.
     * @param index - Zero-based index of the item to check
     */
    async isItemCompleted(index: number): Promise<boolean> {
        return this.getItem(index).isCompleted();
    }

    /**
     * Hovers over the todo item at the given index.
     * @param index - Zero-based index of the item to hover
     */
    async hoverItem(index: number): Promise<void> {
        await this.getItem(index).hover();
    }

    /**
     * Returns true if the delete button is visible for the item at the given index.
     * @param index - Zero-based index of the item to check
     */
    async isDeleteButtonVisible(index: number): Promise<boolean> {
        return this.getItem(index).isDeleteButtonVisible();
    }

    /**
     * Deletes the todo item at the given index.
     * @param index - Zero-based index of the item to delete
     */
    async deleteItem(index: number): Promise<void> {
        await this.getItem(index).clickDelete();
    }

    /**
     * Returns a ToDoItem scoped to the given index.
     * @param index - Zero-based index of the item
     */
    private getItem(index: number): ToDoItem {
        return new ToDoItem(this.locTodoItems.nth(index));
    }

    /**
     * Returns true if every todo item matches the expected completed state.
     * @param completed - The completed state to check for
     */
    async areAllItemsCompleted(completed: boolean): Promise<boolean> {
        const count = await this.locTodoItems.count();

        for (let index = 0; index < count; index++) {
            if ((await this.isItemCompleted(index)) !== completed) {
                return false;
            }
        }

        return true;
    }
}
