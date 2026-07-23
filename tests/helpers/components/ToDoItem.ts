import { type Locator } from '@playwright/test';

/**
 * Represents a single todo item in the list.
 * Scoped to the item's root element so locators don't bleed across rows.
 */
export class ToDoItem {
    readonly locCheckItem: Locator;
    readonly locButtonDelete: Locator;

    /**
     * @param root - The root locator for this todo item's list element
     */
    constructor(private readonly root: Locator){
        this.locCheckItem = root.getByTestId('todo-item-toggle')
        this.locButtonDelete = root.getByTestId('todo-item-button')
    }

    /** Clicks the delete button to remove this item. */
    async clickDelete(): Promise<void> {
        await this.locButtonDelete.click()
    }

    /** Toggles the completion checkbox for this item. */
    async toggleCheckItem(): Promise<void> {
        await this.locCheckItem.click()
    }

    /** Returns true if this item has the completed CSS class on its root element. */
    async isCompleted(): Promise<boolean> {
        return this.root.evaluate(el => el.classList.contains('completed'));
    }
}
