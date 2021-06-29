/**
 *
 * 控制栏模板
 *
 * @Author: Xuejian
 * @Date: 2021-06-04 16:24:31
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-06-04 16:24:31
 */

class TplController {
  constructor(options) {
    this.container = options.container;
    this.options = options.options;
    console.log(this.container);
    this.init();
  }

  /**
   * 初始化控制栏
   */
  init() {
    // controller
    const _progress = '.atplayer-video-controls--wrap .atplayer-controls--progress';
    const _content = '.atplayer-video-controls--wrap .atplayer-controls--content';

    // controller progress
    const progressDom = this.container.querySelector(`${_progress}`);
    const _pd = progressDom ?? this.container;

    const progress = progressDom;
    const time = _pd.querySelector(`.atplayer-bar-time`);
    const thumbnails = _pd.querySelector(`.atplayer-bar-thumbnails`);
    const bar = _pd.querySelector(`.atplayer-bar`);
    const barMark = _pd.querySelector(`.atplayer-bar-mark`);
    const barLoaded = _pd.querySelector(`.atplayer-bar-loaded`);
    const barPlayed = _pd.querySelector('.atplayer-bar-played');

    // controller content
    const contentDom = this.container.querySelector(`${_content}`);
    const _cd = contentDom ?? this.container;

    const playBtn = _cd.querySelector(`${_content} .atplayer-play-btn`);
    const playIcon = (playBtn ?? this.container).querySelector(`.atplayer-play-icon`);
    const current = _cd.querySelector(`.atplayer-time-current`);
    const duration = _cd.querySelector(`.atplayer-time-duration`);
    const danmakuBtn = _cd.querySelector(`.atplayer-danmu-btn`);
    const danmakuIcon = danmakuBtn;
    const muteBtn = _cd.querySelector(`.atplayer-volume-btn`);
    const muteIcon = _cd.querySelector(`.atplayer-volume-icon`);
    const volumeProgress = _cd.querySelector(`.atplayer-volume-progress`);
    const volumeBar = _cd.querySelector(`.atplayer-volume-bar-size`);
    const volumeThumb = _cd.querySelector(`.atplayer-volume-bar-thumb`);
    const fullscreenBtn = _cd.querySelector(`.atplayer-fullscreen-btn`);
    const fullscreenIcon = _cd.querySelector(`.atplayer-fullscreen-btn .atplayer-fullscreen-icon`);

    console.log(progress);

    if (this.options.live) {
      progress.classList.add('atplayer-hide');
      progress.classList.remove('atplayer-show');
    } else {
      progress.classList.remove('atplayer-hide');
      progress.classList.add('atplayer-show');
    }

    this.template = {
      progress,
      time,
      thumbnails,
      bar,
      barMark,
      barLoaded,
      barPlayed,

      playBtn,
      playIcon,
      current,
      duration,
      danmakuBtn,
      danmakuIcon,
      muteBtn,
      muteIcon,
      volumeProgress,
      volumeBar,
      volumeThumb,
      fullscreenBtn,
      fullscreenIcon,
    };
  }
}

export default TplController;
