/**
 * @Author: Xuejian
 * @Date: 2021-07-21 17:06:00
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-07-21 17:06:00
 */
class ArtControls implements IArtControls {
  container: HTMLDivElement;
  options: unknown;
  template!: TArtControlsTmpl;

  constructor(options) {
    this.container = <HTMLDivElement>document.querySelector("#my-player");
    this.options = options.options;
    console.log(this.container);
    this.init();
  }

  /**
   * 初始化控制栏
   */
  init() {
    // controller
    const wrap = <HTMLDivElement>(
      this.container.querySelector(".atplayer-video-controls--wrap")
    );
    const _progress =
      ".atplayer-video-controls--wrap .atplayer-controls--progress";
    const _content =
      ".atplayer-video-controls--wrap .atplayer-controls--content";

    // controller progress
    const progressDom = this.container.querySelector(`${_progress}`);
    const _pd = progressDom ?? this.container;

    const progress = <HTMLDivElement>progressDom;
    const time = <HTMLDivElement>_pd.querySelector(`.atplayer-bar-time`);
    const thumbnails = <HTMLDivElement>(
      _pd.querySelector(`.atplayer-bar-thumbnails`)
    );
    const bar = <HTMLDivElement>_pd.querySelector(`.atplayer-bar`);
    const barMark = <HTMLDivElement>_pd.querySelector(`.atplayer-bar-mark`);
    const barLoaded = <HTMLDivElement>_pd.querySelector(`.atplayer-bar-loaded`);
    const barPlayed = <HTMLDivElement>_pd.querySelector(".atplayer-bar-played");

    // controller content
    const contentDom = <HTMLDivElement>(
      this.container.querySelector(`${_content}`)
    );
    const _cd = contentDom ?? this.container;

    const playBtn = <HTMLDivElement>(
      _cd.querySelector(`${_content} .atplayer-play-btn`)
    );
    const playIcon = <HTMLDivElement>(
      (playBtn ?? this.container).querySelector(`.atplayer-play-icon`)
    );
    const current = <HTMLDivElement>_cd.querySelector(`.atplayer-time-current`);
    const duration = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-time-duration`)
    );
    const danmakuBtn = <HTMLDivElement>_cd.querySelector(`.atplayer-danmu-btn`);
    const danmakuIcon = danmakuBtn;
    const muteBtn = <HTMLDivElement>_cd.querySelector(`.atplayer-volume-btn`);
    const muteIcon = <HTMLDivElement>_cd.querySelector(`.atplayer-volume-icon`);
    const volumeProgress = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-volume-progress`)
    );
    const volumeMark = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-volume-bar-mark`)
    );
    const volumeBar = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-volume-bar-size`)
    );
    const volumeThumb = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-volume-bar-thumb`)
    );
    const fullscreenBtn = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-fullscreen-btn`)
    );
    const fullscreenIcon = <HTMLDivElement>(
      _cd.querySelector(`.atplayer-fullscreen-btn .atplayer-fullscreen-icon`)
    );

    console.log(progress);

    if (this.options) {
      progress.classList.add("atplayer-hide");
      progress.classList.remove("atplayer-show");
    } else {
      progress.classList.remove("atplayer-hide");
      progress.classList.add("atplayer-show");
    }

    this.template = {
      wrap,
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
      volumeMark,
      volumeBar,
      volumeThumb,
      fullscreenBtn,
      fullscreenIcon,
    };
  }
}

export interface IArtControls {
  container: HTMLElement;
  template: {
    [arg: string]: HTMLElement;
  };
}

export type TArtControlsTmpl = IArtControls["template"];

export default ArtControls;
