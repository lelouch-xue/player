import utils from '../utils';
import _debug from '../utils/console';
// import Thumbnails from './thumbnails';
import Icons from './icons';

class Controller {
  constructor(player) {
    this.player = player;

    this.autoHideTimer = 0;

    this.initPlayButton();
    this.initFullScreenButton();
    this.initVolumeButton();
    this.initPlayedBar();
    this.initDanmakuButton();
    this.initInfoPanel();
  }

  initPlayButton() {
    this.player.template.container.addEventListener(
      'click',
      (evt) => {
        // _debug.log(evt.currentTarget, evt.target);
        // evt.stopPropagation();
        // this.player.toggle();
      },
      false
    );
  }

  initPlayedBar() {
    const thumbMove = (e) => {
      let percentage =
        ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.controller.progress)) /
        this.player.template.controller.progress.clientWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      this.player.bar.set('barPlayed', percentage, 'width');
      this.player.template.controller.time.innerHTML = utils.secondToTime(percentage * this.player.video.duration);
    };

    const thumbUp = (e) => {
      document.removeEventListener(utils.nameMap.dragEnd, thumbUp);
      document.removeEventListener(utils.nameMap.dragMove, thumbMove);
      let percentage =
        ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.controller.progress)) /
        this.player.template.controller.progress.clientWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);

      this.player.template.controller.barPlayed.setAttribute('width', `${percentage.toFixed(0)}px`);
      this.player.bar.set('barPlayed', percentage, 'width');
      this.player.seek(this.player.bar.get('barPlayed') * this.player.video.duration);
      // this.player.timer.enable('progress');
    };

    this.player.template.controller.progress.addEventListener(utils.nameMap.dragStart, () => {
      // this.player.timer.disable('progress');
      document.addEventListener(utils.nameMap.dragMove, thumbMove);
      document.addEventListener(utils.nameMap.dragEnd, thumbUp);
    });

    this.player.template.controller.progress.addEventListener(utils.nameMap.dragMove, (e) => {
      if (this.player.video.duration) {
        const px = this.player.template.controller.progress.getBoundingClientRect().left;
        const tx = (e.clientX || e.changedTouches[0].clientX) - px;
        if (tx < 0 || tx > this.player.template.controller.progress.offsetWidth) {
          return;
        }
        const time = this.player.video.duration * (tx / this.player.template.controller.progress.offsetWidth);

        this.player.template.controller.time.style.left = `${tx - (time >= 3600 ? 25 : 20)}px`;
        this.player.template.controller.time.innerText = utils.secondToTime(time);
        // this.player.template.playedBarTime.classList.remove('hidden');
      }
    });

    // this.player.template.playedBarWrap.addEventListener(utils.nameMap.dragEnd, () => {
    //   if (utils.isMobile) {
    //     this.thumbnails && this.thumbnails.hide();
    //   }
    // });
  }

  /**
   * 初始化全屏按钮
   */
  initFullScreenButton() {
    this.player.template.controller.playBtn.addEventListener('click', () => {
      this.player.toggle();
    });
    this.player.template.controller.fullscreenBtn.addEventListener('click', () => {
      this.player.fullScreen.toggle('browser');
    });

    // this.player.template.controller.webFullButton.addEventListener('click', () => {
    //   this.player.fullScreen.toggle('web');
    // });
  }

  initDanmakuButton() {
    // 初始值
    let active = this.player.danmaActive;
    this.player.template.controller.danmakuBtn.addEventListener('click', () => {
      this.player.toggleDanma();
      active = !active;
      this.player.template.controller.danmakuIcon.innerHTML = active ? Icons.danmuOn : Icons.danmuOff;
      console.log(this.player.template.danma);
      this.player.template.danma.style.display = active ? 'block' : 'none';
    });
  }

  initVolumeButton() {
    const vWidth = 85;

    this.player.template.controller.volumeProgress.addEventListener('click', (event) => {
      const e = event || window.event;
      let percentage =
        ((e.clientX || e.changedTouches[0].clientX) -
          utils.getBoundingClientRectViewLeft(this.player.template.controller.volumeProgress) -
          0) /
        vWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      percentage = toFixed(percentage * 100, 0);

      const pw = percentage + '%';
      this.player.template.controller.volumeBar.style.width = pw;
      this.player.template.controller.volumeProgress.setAttribute('aria-label', `音量 ${pw}`);
    });

    this.player.template.controller.muteBtn.addEventListener('click', () => {
      if (this.player.video.muted) {
        this.player.video.muted = false;
        this.player.template.controller.muteIcon.innerHTML = Icons.volumeOn;
        // this.player.bar.set('volume', this.player.volume(), 'width');
      } else {
        this.player.video.muted = true;
        this.player.template.controller.muteIcon.innerHTML = Icons.volumeOff;
        // this.player.bar.set('volume', 0, 'width');
      }
    });

    this.player.template.controller.volumeProgress.addEventListener(utils.nameMap.dragStart, () => {
      document.addEventListener(utils.nameMap.dragMove, volumeMove);
      document.addEventListener(utils.nameMap.dragEnd, volumeEnd);
    });

    const toFixed = (number, precision) => {
      var multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
      return (Math.round(wholeNumber / 10) * 10) / multiplier;
    };
    const volumeMove = (event) => {
      const e = event || window.event;
      let percentage =
        ((e.clientX || e.changedTouches[0].clientX) -
          utils.getBoundingClientRectViewLeft(this.player.template.controller.volumeProgress) -
          0) /
        vWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      const _percentage = toFixed(percentage * 100, 0);

      const pw = _percentage + '%';
      this.player.template.controller.volumeBar.style.width = pw;
      this.player.template.controller.volumeProgress.setAttribute('aria-label', `音量 ${pw}`);
      this.player.video.volume = percentage;

      if (percentage == 0) {
        this.player.template.controller.muteIcon.innerHTML = Icons.volumeOff;
      } else {
        this.player.template.controller.muteIcon.innerHTML = Icons.volumeOn;
      }
    };
    const volumeEnd = () => {
      document.removeEventListener(utils.nameMap.dragEnd, volumeEnd);
      document.removeEventListener(utils.nameMap.dragMove, volumeMove);
    };
  }

  initInfoPanel() {
    const home = this.player.template.info.home;
    const link = this.player.template.info.link;
    const version = this.player.template.info.version;
    const linkinput = this.player.template.info.linkinput;
    const verinput = this.player.template.info.verinput;

    home.onclick = function () {
      _debug.log('home');
      window.open('//autohome.com.cn', '_blank');
    };
    link.onclick = function () {
      _debug.log('link');
      linkinput.select();
      document.execCommand('Copy');
    };
    version.onclick = function () {
      _debug.log('version');
      verinput.select();
      document.execCommand('Copy');
    };
  }

  show() {
    this.player.container.classList.remove('dplayer-hide-controller');
  }

  hide() {
    this.player.container.classList.add('dplayer-hide-controller');
    // this.player.setting.hide();
    // this.player.comment && this.player.comment.hide();
  }

  isShow() {
    return !this.player.container.classList.contains('dplayer-hide-controller');
  }

  toggle() {
    if (this.isShow()) {
      this.hide();
    } else {
      this.show();
    }
  }

  destroy() {
    clearTimeout(this.autoHideTimer);
  }
}

export default Controller;
