import Player from "./player";
import FullScreen, { IFullscreen } from "./fullscreen";
import Template from "./template";

type TDragStart = "mousedown" | "touchstart";
type TDragMove = "mousemove" | "touchmove";
type TDrayEnd = "mouseup" | "touchend";

const dragStart: TDragStart = "mousedown";
const dragMove: TDragMove = "mousemove";
const dragEnd: TDrayEnd = "mouseup";

/**
 * 控制绑定事件
 */
class Controller implements IController {
  player: Player;
  template: Template;
  fullscreen!: IFullscreen;
  a = "";

  constructor(options) {
    this.player = options;
    this.template = options.template;

    this.fullscreen = new FullScreen(options);

    this.initPlay();
    this.initVolume();
    this.initFullscreen();
  }

  /**
   * 播放按钮
   * 此后考虑视频的reload
   */
  initPlay() {
    this.template.controls.playBtn.addEventListener("click", () => {
      this.player.toggle();
    });
  }

  /**
   * 初始化声音控制
   */
  initVolume() {
    const vHeight = 80;

    const toFixed = (number, precision) => {
      const multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
      return (Math.round(wholeNumber / 10) * 10) / multiplier;
    };

    const _ptop =
      this.template.controls.volumeProgress.getBoundingClientRect().top;
    const _pheight =
      this.template.controls.volumeProgress.getBoundingClientRect().height;

    this.template.controls.volumeProgress.addEventListener("click", (event) => {
      const e = event || window.event;

      console.log(_ptop + _pheight, e.clientY);
      let percentage = (_ptop + _pheight - e.clientY - 0) / vHeight;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      percentage = toFixed(percentage * 100, 0);
      console.log(percentage);
      const pw = percentage + "%";
      this.template.controls.volumeBar.style.height = pw;
    });

    this.template.controls.volumeBar.addEventListener(dragStart, () => {
      document.addEventListener(dragMove, volumeMove);
      document.addEventListener(dragEnd, volumeEnd);
    });

    const volumeMove = (event) => {
      const e = event || window.event;

      let percentage = (_pheight + _ptop - e.clientY - 0) / vHeight;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      const _percentage = toFixed(percentage * 100, 0);

      const pw = _percentage + "%";
      this.player.template.controls.volumeBar.style.height = pw;

      this.player.video.volume = percentage;
      this.template.controls.volumeMark.innerHTML = `${_percentage}`;

      // if (percentage == 0) {
      //   this.player.template.controller.muteIcon.innerHTML = Icons.volumeOff;
      // } else {
      //   this.player.template.controller.muteIcon.innerHTML = Icons.volumeOn;
      // }
    };

    const volumeEnd = () => {
      document.removeEventListener(dragEnd, volumeEnd);
      document.removeEventListener(dragMove, volumeMove);
    };
  }

  /**
   * 初始化全屏按钮
   */
  initFullscreen() {
    this.template.controls.fullscreenBtn.addEventListener("click", () => {
      this.fullscreen.toggle("browser");
    });
  }
}

export interface IController {
  a: string;
}

export default Controller;
