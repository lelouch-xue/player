import Template from './template';
import './css/index.scss';
declare class Player {
    container: HTMLElement | null;
    options: unknown;
    template: Template;
    constructor(target: string, options: unknown);
    /**
     * 初始化模板
     */
    initTmpl(): void;
}
export default Player;
