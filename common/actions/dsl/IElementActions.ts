export interface IElementActions {
    setSelector(selector: string): this;
    click(): Promise<this>;
    doubleClick(): Promise<this>;
    fill(text: string): Promise<this>;
    clearAndFill(text: string): Promise<this>;
    scrollIntoView(): Promise<this>;
    isVisible(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    getText(): Promise<string>;
    getValue(): Promise<string>;
    getAttribute(attr: string): Promise<string | null>;
    waitForVisible(timeout?: number): Promise<this>;
    waitForHidden(timeout?: number): Promise<this>;
}