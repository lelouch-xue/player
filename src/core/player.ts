import Template from "./template";
import Controller, { IController } from "./controller";
import { merge } from "lodash-es";
import "../css/index.scss";
import defaultConfig from "./config/default";
import ContextMenu from "./menu";
import { generate } from "./config";
import { Loadjs } from "@/utils";
import Icons from "./icons";

class Player {
  container: HTMLDivElement;
  options: unknown;
  template!: Template;
  infoMenu: ContextMenu;
  isloading = true;
  video!: HTMLVideoElement;
  controller!: IController;

  constructor(target: string, options: IPlayerConfig) {
    this.container = <HTMLDivElement>document.querySelector(target);

    this.infoMenu = new ContextMenu(this);

    this.init(options);
  }

  async init(options) {
    this.options = merge(options, defaultConfig, { isloading: this.isloading });
    this.initTmpl();
    const info = await generate(103090);
    this.onComplateCanPlay(info);
  }

  /**
   * 获取到房间信息后开始加载对应的类型，播放
   */
  async onComplateCanPlay(info) {
    this.isloading = false;
    console.log(this.template);
    this.template.loading.block.style.display = "none";

    // 假设这里是Hls m3u8

    const complate = await Loadjs(
      "https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"
    );
    // console.log(window.Hls);

    if (complate && Hls.isSupported()) {
      this.video.src = info.url;
      this.video.poster = info.poster;
      // this.video.type = "hls";
      this.playHls();
    }
  }

  /**
   * 播放HLS
   */
  playHls() {
    console.log(Hls);
    const hls = new Hls();
    hls.loadSource(this.video.src);
    hls.attachMedia(this.video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (this.video.muted) {
        const allow = this.video.play();
        if (allow !== undefined) {
          allow
            .then(() => {
              this.video.play();
            })
            .catch(() => {
              this.video.play();
            });
        }
      }
    });
    // 监控流是否为正常状态
    hls.on(Hls.Events.ERROR, (event, data) => {
      const { status } = data.networkDetails;
      if (status == 404) {
        // this.template.loading.classList.remove("y-player-hide");
      }
    });
  }

  /**
   * 初始化模板
   */
  initTmpl() {
    this.template = new Template(this.options);
    this.controller = new Controller(this);
    this.video = this.template.video;
  }

  /**
   * 是否为播放状态
   */
  get isPlaying() {
    return !this.video.paused;
  }

  static get version() {
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return GLOBAL_VERSION;
  }

  toggle() {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    // if (this.video.paused) {
    //   this.bezel.switch(Icons.play);
    // }

    this.template.controls.playIcon.innerHTML = Icons.pause;
    this.video.play();
  }

  pause() {
    // if (!this.video.paused) {
    //   this.bezel.switch(Icons.pause);
    // }

    this.template.controls.playIcon.innerHTML = Icons.play;
    this.video.pause();
  }
}

export interface IPlayer {
  template: Template;
  container: HTMLDivElement;
  video: HTMLVideoElement;
  [arg: string]: unknown | null;

  new (arg1: string, arg2: IPlayerConfig);

  initTmpl(): void;
}

export default Player;
