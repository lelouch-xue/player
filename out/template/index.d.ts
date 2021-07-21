declare class Template {
    controls: unknown;
    options: unknown;
    container: HTMLElement;
    constructor(options: any);
    init(): void;
    /**
     * 初始化控制栏
     */
    initControls(): void;
}
export default Template;
