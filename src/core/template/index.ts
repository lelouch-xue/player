import Player from "../player";
import ArtLayout from "@/art/layout.art";
import icons from "../icons";
import ArtBezel, { TArtBezelTmpl } from "./bezel";
import ArtInfo, { TArtInfoTmpl } from "./info";
import ArtControls, { TArtControlsTmpl } from "./controls";
import ArtChat, { TArtChatTmpl } from "./chat";
import ArtLoading, { TArtLoadingTmpl } from "./loading";

class Template {
  options!: unknown;
  video!: HTMLVideoElement;
  container: HTMLElement;
  controls!: TArtControlsTmpl;
  bezel: TArtBezelTmpl;
  info!: TArtInfoTmpl;
  chat!: TArtChatTmpl;
  loading!: TArtLoadingTmpl;

  constructor(options) {
    this.container = document.querySelector("#my-player") as HTMLElement;

    this.init(options);
  }

  init(options) {
    const artRecord = {
      ...options,
      icons,
      status: {
        live: true,
      },
      source: {
        link: window.location.href,
        version: Player.version,
      },
      abc: {
        type: "mp4",
        source: [
          {
            size: 720,
            url: "",
          },
          {
            size: 1080,
            url: "",
          },
        ],
      },
    };

    console.log(artRecord);

    this.container.innerHTML = ArtLayout(artRecord);

    this.video = <HTMLVideoElement>(
      (this.container ?? document).querySelector("#atplayer-currnet-video")
    );

    this.initControls();
    this.initBezel();
    this.initInfoPanel();
    this.initChatPanel();
    this.initLoading();
  }

  /**
   * 初始化控制栏
   */
  initControls() {
    const tpl = new ArtControls(this);
    this.controls = tpl.template;
  }

  initBezel() {
    const tpl = new ArtBezel(this);
    this.bezel = tpl.template;
  }

  // /**
  //  * 弹幕模板
  //  */
  // initDanma() {
  //   console.log(this.container ?? document);
  //   this.danma = (this.container ?? document).querySelector('#atplayer-video-danmaku-pool');
  // }

  initInfoPanel() {
    const tpl = new ArtInfo(this);
    this.info = tpl.template;
  }

  initChatPanel() {
    const tpl = new ArtChat(this);
    this.chat = tpl.template;
  }

  initLoading() {
    const tpl = new ArtLoading(this);
    this.loading = tpl.template;
  }
}

export default Template;
