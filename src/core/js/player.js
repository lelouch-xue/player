/**
 * @Author: Xuejian
 * @Date: 2021-05-26 15:21:24
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-26 15:21:24
 */

// import TplPlayer from './template/TplPlayer';
import '~css/index.scss';
import template from '../template';
import Events from './events';
import utils from '../utils';
import Bar from './bar';
import Icons from './icons';
import _debug from '../utils/console';
import FullScreen from './fullscreen';
import Controller from './controller';
import DanmakuPool from './danmaku';
import ContextMenu from './contextmenu';
import defaultConfig from '../config/default';
import Bezel from './bezel';
import { merge } from 'lodash-es';
import PBP from '../expand/pbp';
class Player {
  // 容器
  // target tag

  constructor(options) {
    this.options = merge(defaultConfig, options);
    this.container = document.querySelector(options.container);

    options = {
      container: this.container,
      options: this.options,
    };
    console.log(options);
    this.template = new template(options);
    this.events = new Events();
    this.video = this.template.video;
    this.bar = new Bar(this.template);
    this.bezel = new Bezel(this.template.bezel.icon);

    this.fullScreen = new FullScreen(this);
    this.controller = new Controller(this);
    this.contextMenu = new ContextMenu(this);

    this.pbp = new PBP(this);

    this.plugins = {};

    this.initConfig();

    this.initVideo();

    this.initDanma();
  }

  /**
   * 初始化一些配置
   */
  initConfig() {
    this.video.volume = 0.4;

    function calculationOffsetY(obj) {
      //obj为所要计算的元素,可用id或class获取
      var top = 0;
      if (obj.offsetParent) {
        do {
          top += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return top;
      }
    }

    const target = this.container;
    const _offset = calculationOffsetY(target);
    const _height = target.offsetHeight;
    const _threshold = 10;
    this.isMini = false;

    window.onscroll = function () {
      //为了保证兼容性，这里取两个值，哪个有值取哪一个
      //scrollTop就是触发滚轮事件时滚轮的高度
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= _offset + _height + _threshold) {
        const _ismini = true;
        if (this.isMini !== _ismini) {
          this.isMini = true;
          _debug.log('trigger mini mode');
        }
      } else {
        const _ismini = false;
        if (this.isMini !== _ismini) {
          this.isMini = false;
          _debug.log('cancel mini mode');
        }
      }
    };
  }

  /**
   * 初始化弹幕
   */
  initDanma() {
    this.danmaku = new DanmakuPool(this);
    this._loopDmRun = () => {
      this.loopDanmaOpt();
      setTimeout(() => {
        this._loopDmRun();
      }, 1000);
    };
    this._loopDmRun();
  }

  loopDanmaOpt() {
    if (!this.danmaActive) return;
    this.danmaku.run();
  }

  initMSE(video, type) {
    this.type = type;

    if (this.type === 'auto') {
      if (/m3u8(#|\?|$)/i.exec(video.src)) {
        this.type = 'hls';
      } else if (/.flv(#|\?|$)/i.exec(video.src)) {
        this.type = 'flv';
      } else if (/.mpd(#|\?|$)/i.exec(video.src)) {
        this.type = 'dash';
      } else {
        this.type = 'normal';
      }
    }

    if (this.type === 'hls' && (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL'))) {
      this.type = 'normal';
    }

    switch (this.type) {
      // https://github.com/video-dev/hls.js
      case 'hls':
        if (window.Hls) {
          if (window.Hls.isSupported()) {
            const options = this.options.pluginOptions.hls;
            const hls = new window.Hls(options);
            this.plugins.hls = hls;
            hls.loadSource(video.src);
            hls.attachMedia(video);
            this.events.on('destroy', () => {
              hls.destroy();
              delete this.plugins.hls;
            });
          } else {
            // this.notice('Error: Hls is not supported.');
          }
        } else {
          // this.notice("Error: Can't find Hls.");
        }
        break;

      // https://github.com/Bilibili/flv.js
      case 'flv':
        if (window.flvjs) {
          if (window.flvjs.isSupported()) {
            const flvPlayer = window.flvjs.createPlayer(
              Object.assign(this.options.pluginOptions.flv.mediaDataSource || {}, {
                type: 'flv',
                url: video.src,
                cors: true,
              }),
              this.options.pluginOptions.flv.config
            );
            this.plugins.flvjs = flvPlayer;
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
            this.events.on('destroy', () => {
              flvPlayer.unload();
              flvPlayer.detachMediaElement();
              flvPlayer.destroy();
              delete this.plugins.flvjs;
            });
          } else {
            // this.notice('Error: flvjs is not supported.');
          }
        } else {
          // this.notice("Error: Can't find flvjs.");
        }
        break;

      // https://github.com/Dash-Industry-Forum/dash.js
      case 'dash':
        if (window.dashjs) {
          const dashjsPlayer = window.dashjs.MediaPlayer().create().initialize(video, video.src, false);
          const options = this.options.pluginOptions.dash;
          dashjsPlayer.updateSettings(options);
          this.plugins.dash = dashjsPlayer;
          this.events.on('destroy', () => {
            window.dashjs.MediaPlayer().reset();
            delete this.plugins.dash;
          });
        } else {
          this.notice("Error: Can't find dashjs.");
        }
        break;

      // https://github.com/webtorrent/webtorrent
      case 'webtorrent':
        if (window.WebTorrent) {
          if (window.WebTorrent.WEBRTC_SUPPORT) {
            this.container.classList.add('dplayer-loading');
            const options = this.options.pluginOptions.webtorrent;
            const client = new window.WebTorrent(options);
            this.plugins.webtorrent = client;
            const torrentId = video.src;
            video.src = '';
            video.preload = 'metadata';
            video.addEventListener('durationchange', () => this.container.classList.remove('dplayer-loading'), {
              once: true,
            });
            client.add(torrentId, (torrent) => {
              const file = torrent.files.find((file) => file.name.endsWith('.mp4'));
              file.renderTo(this.video, {
                autoplay: this.options.autoplay,
                controls: false,
              });
            });
            this.events.on('destroy', () => {
              client.remove(torrentId);
              client.destroy();
              delete this.plugins.webtorrent;
            });
          } else {
            this.notice('Error: Webtorrent is not supported.');
          }
        } else {
          this.notice("Error: Can't find Webtorrent.");
        }
        break;
    }
  }

  /**
   * 初始化播放器
   */
  initVideo() {
    this.initMSE(this.video, this.options.video.type);

    const video = this.video;
    /**
     * video events
     */
    // show video time: the metadata has loaded or changed
    this.on('durationchange', () => {
      // compatibility: Android browsers will output 1 or Infinity at first
      if (video.duration !== 1 && video.duration !== Infinity) {
        this.template.controller.duration.innerHTML = utils.secondToTime(video.duration);
      }
    });

    // show video loaded bar: to inform interested parties of progress downloading the media
    this.on('progress', () => {
      const percentage = video.buffered.length ? video.buffered.end(video.buffered.length - 1) / video.duration : 0;
      this.bar.set('barLoaded', percentage, 'width');
    });

    // video download error: an error occurs
    this.on('error', () => {
      if (!this.video.error) {
        // Not a video load error, may be poster load failed, see #307
        return;
      }
    });

    // video end
    this.on('ended', () => {
      this.bar.set('barPlayed', 1, 'width');
      if (!this.options.video.loop) {
        this.pause();
      } else {
        this.seek(0);
        this.play();
      }
    });

    this.on('play', () => {
      if (this.paused) {
        this.play(true);
      }
    });

    this.on('pause', () => {
      if (!this.paused) {
        this.pause(true);
      }
    });

    this.on('timeupdate', () => {
      // this.bar.set('played', this.video.currentTime / this.video.duration, 'width');
      this.bar.set('barPlayed', video.currentTime / video.duration, 'width');
      const currentTime = utils.secondToTime(this.video.currentTime);
      // _debug.log('current', currentTime);
      // if (this.template.ptime.innerHTML !== currentTime) {
      //   // this.template.ptime.innerHTML = currentTime;
      // console.log(video.currentTime)
      this.template.controller.current.innerHTML = currentTime;
    });

    for (let i = 0; i < this.events.videoEvents.length; i++) {
      video.addEventListener(this.events.videoEvents[i], () => {
        this.events.trigger(this.events.videoEvents[i]);
      });
    }
  }

  static get version() {
    // eslint-disable-next-line no-undef
    return GLOBAL_VERSION;
  }

  /**
   * attach event
   */
  on(name, callback) {
    this.events.on(name, callback);
  }

  play() {
    if (this.video.paused) {
      this.bezel.switch(Icons.play);
    }

    this.template.controller.playIcon.innerHTML = Icons.pause;
    this.video.play();
  }

  pause() {
    if (!this.video.paused) {
      this.bezel.switch(Icons.pause);
    }

    this.template.controller.playIcon.innerHTML = Icons.play;
    this.video.pause();
  }

  /**
   * Toggle between play and pause
   */
  toggle() {
    _debug.log('status', this.video.paused);
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * 发送弹幕
   * @param {*} danma
   */
  addBarrage(danma) {
    this.danmaku.add(danma);
  }

  /**
   * Seek video
   */
  seek(time) {
    time = Math.max(time, 0);
    if (this.video.duration) {
      time = Math.min(time, this.video.duration);
    }
    // if (this.video.currentTime < time) {
    //   this.notice(
    //     `${this.tran('FF')} ${(time - this.video.currentTime).toFixed(0)} ${this.tran(
    //       's'
    //     )}`
    //   );
    // } else if (this.video.currentTime > time) {
    //   this.notice(
    //     `${this.tran('REW')} ${(this.video.currentTime - time).toFixed(0)} ${this.tran(
    //       's'
    //     )}`
    //   );
    // }

    this.video.currentTime = time;
    // this.video.load();

    // this.bar.set('played', time / this.video.duration, 'width');
    this.bar.set('barPlayed', time / this.video.duration, 'width');
    this.template.controller.time.innerHTML = utils.secondToTime(time);
  }

  get danmaActive() {
    return this.options.danmaku.active;
  }

  toggleDanma() {
    this.options.danmaku.active = !this.options.danmaku.active;

    const active = this.options.danmaku.active;
    if (!active) {
      this.danmaku.clear();
    }
    _debug.log(this.danmaku.danmaku);
  }

  resize() {
    if (this.controller.thumbnails) {
      this.controller.thumbnails.resize(160, (this.video.videoHeight / this.video.videoWidth) * 160, this.template.barWrap.offsetWidth);
    }
    this.events.trigger('resize');
    if (this.danmaku)
      setTimeout(() => {
        this.danmaku.resize();
      }, 50);
  }
}

export default Player;
