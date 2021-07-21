// import Template from './template';
// import './css/index.scss';
class Player {
  container: HTMLElement | null;
  options: unknown;
  // template!: Template;
  constructor(target: string, options: unknown) {
    this.container = document.querySelector(target);
    this.options = options;

    // this.initTmpl();
  }

  /**
   * 初始化模板
   */
  // initTmpl() {
  //   this.template = new Template(this.options);
  //   console.log(123132);
  // }
}
console.log(123123);
export default Player;
