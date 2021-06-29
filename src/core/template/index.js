import TplController from './controller';
import ArtTemp from '../../art/layout.art';
import icons from '../js/icons';
import TplBezel from './bezel';
import TplInfoPanel from './infopanel';
import Player from '../js/player';

class Template {
  constructor(options) {
    this.container = options.container;
    this.options = options.options;
    this.index = options.index;
    this.tran = options.tran;

    this.init();
  }

  init() {
    this.container.innerHTML = ArtTemp({
      opts: this.options,
      icons,
      source: {
        link: window.location.href,
        version: Player.version,
      },
    });
    console.log(this.options);

    this.video = (this.container ?? document).querySelector('.atplayer-video');

    this.initController();
    this.initBezel();
    this.initDanma();
    this.initInfoPanel();
  }

  /**
   * 初始化控制栏
   */
  initController() {
    const tpl = new TplController(this);
    this.controller = tpl.template;
  }

  initBezel() {
    const tpl = new TplBezel(this);
    this.bezel = tpl.template;
  }

  /**
   * 弹幕模板
   */
  initDanma() {
    console.log(this.container ?? document);
    this.danma = (this.container ?? document).querySelector('#atplayer-video-danmaku-pool');
  }

  initInfoPanel() {
    const tpl = new TplInfoPanel(this);
    this.info = tpl.template;
  }
}

export default Template;
