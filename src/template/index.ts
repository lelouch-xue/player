// import TplControls from './controls';
import ArtLayout from '../art/layout.art';
// import icons from '../js/icons';
// import TplBezel from './bezel';
// import TplInfoPanel from './infopanel';
// import Player from '../js/player';

class Template {
  controls!: unknown;
  options!: unknown;
  // video!: HTMLVideoElement | null;
  container: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: any) {
    this.container = document.querySelector('#my-player') as HTMLElement;
    // this.options = options.options;
    // this.index = options.index;
    // this.tran = options.tran;
    // this.options = options;
    console.log(options);
    // this.init();
    this.container.innerHTML = ArtLayout(options);
    console.log(this.container.innerHTML);
  }

  init() {
    // this.container.innerHTML = ArtTemp({
    //   opts: this.options,
    //   icons,
    //   source: {
    //     link: window.location.href,
    //     version: Player.version,
    //   },
    // });
    console.log(this.options);

    // this.video = (this.container ?? document).querySelector('.atplayer-video');

    this.initControls();
    // this.initBezel();
    // this.initDanma();
    // this.initInfoPanel();
  }

  /**
   * 初始化控制栏
   */
  initControls() {
    // const tpl = new TplControls(this);
    // this.controls = tpl.template;
  }

  // initBezel() {
  //   const tpl = new TplBezel(this);
  //   this.bezel = tpl.template;
  // }

  // /**
  //  * 弹幕模板
  //  */
  // initDanma() {
  //   console.log(this.container ?? document);
  //   this.danma = (this.container ?? document).querySelector('#atplayer-video-danmaku-pool');
  // }

  // initInfoPanel() {
  //   const tpl = new TplInfoPanel(this);
  //   this.info = tpl.template;
  // }
}

export default Template;
