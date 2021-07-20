/**
 * 此代码深度学习bilibili pbp系统,所以,你懂得,嘘嘘..!
 */
import storage from './storage';
// import Api from '../api';

import { _debugLog, _isSupport } from './utils';

import {
  SVG_WIDTH,
  SVG_HEIGHT,
  INCREASED_HEIGHT_PERCENTAGE,
  CURSOR_COLOR,
  ATHM_ID,
  ATHM_BTN_ID,
  ATHM_LIVE_WRAP,
  ATHM_LIVE_RELY,
  ATHM_LIVE_VIDEO,
  ATHM_REPLAY_WRAP,
  ATHM_REPLAY_RELY,
  ATHM_REPLAY_VIDEO,
  ATHM_REPLAY_ENABLE,
  ATHM_REPLAY_UNABLE,
} from './config';

import { openDB, addData, getDataByKey, getDataByIndex, updateDB } from './indexedDb';
import _debug from '../../utils/console';

const PBP_GENERAL_STYlE = `
  #atplayer_pbp {
    position: absolute;
    bottom: 0;
    left: 12px;
    right: 12px;
    display: flex;
    cursor: pointer;
    height: 30px;
    z-index: 0;
    opacity: 0;
  }
  .ahvp-wrap {
    cursor: pointer;
    position: absolute;
    bottom: calc(8%);
    z-index: 1;
    color: white;
    /* opacity: 0; */
    line-height: 16px;
    text-align: center;
    top: 0;
    // transform: translateY(-50%);
    right: 8px;
    opacity: 1;
  }

  #atplayer_pbp_pin {
    cursor: pointer;
    position: absolute;
    bottom: calc(8%);
    z-index: 1;
    color: white;
    /* opacity: 0; */
    line-height: 16px;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    right: -8px;
    opacity: 1;
  }

  .pbp-icon {
    width: 16px;
    height: 16px;
    background-size: contain;
    transform: rotate(45deg);
  }

  .pbp-icon:hover {
    transform: rotate(60deg) scale(1.2);
    transition: all .1s ease-in-out;
    -webkit-transition: all .1s ease-in-out;
  }

  .pbp-tips {
    position: absolute;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
    line-height: 18px;
    padding: 4px 8px;
    background-color: #000;
    background: rgba(0,0,0,.8);
    white-space: nowrap;
    right: 0;
    top: 0;
    display: none;
  }

  #atplayer_pbp_pin:hover .pbp-tips {
    top: -30px;
    display: block;
    transition: all .3 ease-in-out;
  }

  #atplayer_pbp.pin {
    opacity: 1;
  }

  #atplayer_pbp.show {
    opacity: 1;
  }

  .atplayer-container:hover .pbp-enable.pin {
    opacity: 1 !important;
    bottom: 50px !important;
    transition: opacity 0.1s ease-in-out, bottom .1s ease-in-out;
  }

  .atplayer-container:hover .pbp-enable:not(.pin) {
    opacity: 1 !important;
    bottom: 50px !important;
    transition: opacity 0.1s ease-in-out;
  }

  .atplayer-container:hover .y-player-controls:not(.y-player-controls--unable) {
    opacity: 1 !important;
    bottom: 0;
    transition: opacity 0.1s ease-in-out;
  }

  .pbp-enable:not(.pin) {
    opacity: 0 !important;
    transition: opacity 0.1s ease-in-out;
  }

  .pbp-enable.pin {
    opacity: 1 !important;
    bottom: 0 !important;
    transition: opacity 0.1s ease-in-out 0.15s, bottom 0.01s ease-in-out 0.1s;
  }

  .pbp-enable #atplayer_pbp_pin {
    display: block;
  }

  #atplayer_pbp_pin {
    display: none;
  }
`;
const ATHM_VIDEO_STYLE =
  `
  #atplayer_pbp {
    position: absolute;
    bottom: 0;
    left: 0 !important;
    right: 0 !important;
    display: flex;
    cursor: pointer;
    height: 30px;
    z-index: 0;
    opacity: 0;
  }

  .ahvp-wrap-miniwindow #atplayer_pbp {
    position: absolute;
    bottom: 0;
    left: 0 !important;
    right: 0 !important;
    display: flex;
    cursor: pointer;
    height: 18px;
    z-index: 0;
    opacity: 0;
  }

  .ahvp-wrap-fullwindow #atplayer_pbp {
    position: absolute;
    bottom: 0;
    left: 0 !important;
    right: 0 !important;
    display: flex;
    cursor: pointer;
    height: 35px;
    z-index: 0;
    opacity: 0;
  }
` + PBP_GENERAL_STYlE;

const ATHM_REPLAY_STYLE =
  `
  #atplayer_pbp {
    position: absolute;
    bottom: 50px;
    display: flex;
    left: 12px;
    right: 12px;
    cursor: pointer;
    height: 30px;
    z-index: 10;
    opacity: 0;
  }


  .atplayer-container:hover .pbp-enable.pin {
    opacity: 1 !important;
    bottom: 50px !important;
    transition: opacity .15s ease-in-out .1s, bottom .1s ease-in-out .1s;
  }

  .atplayer-container:hover .pbp-enable:not(.pin) {
    opacity: 1 !important;
    bottom: 50px !important;
    transition: opacity .15s ease-in-out .1s;
  }

  .atplayer-container:hover .y-player-controls:not(.y-player-controls--unable) {
    opacity: 1 !important;
    bottom: 0;
    transition: opacity .15s ease-in-out .1s;
  }

  .atplayer-container .y-player-controls:not(.y-player-controls--unable) {
    opacity: 0 !important;
    bottom: 0;
    transition: opacity .15s ease-in-out .1s;
  }

  .pbp-enable:not(.pin) {
    opacity: 0 !important;
    transition: opacity .15s ease-in-out .1s;
  }

  .pbp-enable.pin {
    opacity: 1 !important;
    bottom: 0 !important;
    transition: opacity .15s ease-in-out .1s, bottom .1s ease-in-out .3s;
  }

  .pbp-enable #atplayer_pbp_pin {
    display: block;
  }

  #atplayer_pbp_pin {
    display: none;
  }

  .container-fixed #atplayer_pbp{
    display: none;
  }
` + PBP_GENERAL_STYlE;

function toNum(str) {
  return str.slice(0, str.length - 2);
}

function addNormalClass(node) {
  if (node.childNodes.length) {
    node.childNodes.forEach((item) => {
      addNormalClass(item);
    });
  }
  node.classList.add('ahvp__video__node');
}

class PBP {
  constructor(options) {
    this.options = options;

    this.pbpComponent = {};
    // 路径点
    this.points = [];
    // 容器
    this.container = '';
    // 播放器
    this.player = options;
    // 打印debug信息
    this.debug = true;
    // 依赖目标
    this.rely = '';

    this.video = null;

    // 总时长
    this.duration = 0;

    // LIVE  REPLAY
    this.mode = 'video';

    this.timer = null;

    this.init();
  }

  // 初始化信息
  async init() {
    const { el, rely, biz, target, player } = this.options;

    _debugLog('player', player);
    // 判断是否支持pbp
    if (!_isSupport()) {
      _debugLog('当前浏览器不支持pbp');
      return;
    }

    this.mode = biz === 2 ? 'replay' : 'video';
    // this.mode = "replay";

    const wrap = this.mode === 'video' ? ATHM_LIVE_WRAP : ATHM_REPLAY_WRAP;
    const controls = this.mode === 'video' ? ATHM_LIVE_RELY : ATHM_REPLAY_RELY;
    const video = this.mode === 'video' ? ATHM_LIVE_VIDEO : ATHM_REPLAY_VIDEO;
    console.log(this.player.template.controller);
    this.container = document.querySelector('.atplayer-video--wrap');
    this.rely = this.player.template.controller.wrap;
    this.video = this.player.video;
    console.log(this.video);
    const param = {
      biz_id: biz,
      target_id: target,
    };
    const data = {
      scores: [
        11, 2, 0, 2, 1, 1, 1, 0, 3, 1, 4, 2, 2, 1, 2, 0, 0, 2, 2, 2, 1, 2, 3, 1, 0, 1, 0, 2, 1, 1, 0, 1, 1069, 647, 2, 1, 6, 2, 2, 1, 3, 1,
        1, 1, 0, 2, 0, 1, 1, 1, 0, 0, 2595, 2, 1, 1, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      step_sec: 63,
      video_duration: 5599,
    };
    const { scores, step_sec, video_duration } = data;
    const points = scores;
    const step = step_sec;
    this.duration = video_duration;

    if (!points) return;

    let isCanPlay = false;
    this.video.oncanplay = () => {
      if (isCanPlay) return;
      isCanPlay = true;
      // this.duration = Math.floor(this.video.duration);
      _debugLog('时长对比: 前台:', this.duration, '  后台： ', video_duration);

      // 所有点信息
      this.points = this.calculatePercentage(points, step);
      console.log(this.points, this.points.length);
      // 测试生成区域路径点
      const path = this.generateBezierCurvePath(this.points, SVG_WIDTH, SVG_HEIGHT);
      _debugLog(path);
      this.generateSVG();
      // 显示隐藏控制烂
      // this.initPlayerEvent(player);
      this.initPin();
      this.initStyle();
      this.initEvent();
    };

    // Api.getPbpData(param, (res) => {
    //   if (!res.result || !res.result.scores) return;

    //   const { scores, step_sec, video_duration } = res.result;
    //   const points = scores;
    //   const step = step_sec;
    //   this.duration = video_duration;

    //   if (!points) return;

    //   this.video.oncanplay = function (e) {
    //     console.log(e);
    //     _debugLog('时长对比: 前台:', this.duration, '  后台： ', video_duration);
    //   };
    //   // 所有点信息
    //   this.points = this.calculatePercentage(points, step);
    //   console.log(this.points, this.points.length);
    //   // 测试生成区域路径点
    //   // const path = this.generateBezierCurvePath(
    //   //   this.points,
    //   //   SVG_WIDTH,
    //   //   SVG_HEIGHT
    //   // );
    //   // _debugLog(path);
    //   this.generateSVG();
    //   // 显示隐藏控制烂
    //   // this.initPlayerEvent(player);
    //   this.initPin();
    //   this.initStyle();
    //   this.initEvent();
    // });
  }

  /**
   * 初始化事件
   */
  initEvent() {
    const _this = this;

    this.video.addEventListener('timeupdate', function (evt) {
      const cur = evt.target.currentTime / _this.duration;
      _this.refresh(cur);
    });

    this.container.addEventListener('mouseenter', function (evt) {
      const enable = true;
      enable && _this.changePos('show');
      enable && _this.pbp.classList.add('pbp-enable');
    });
  }

  initStyle() {
    const style = document.createElement('style');
    style.innerHTML = PBP_GENERAL_STYlE;
    document.head.appendChild(style);
  }

  initPin() {
    var pinBtn = document.getElementById(ATHM_BTN_ID);
    pinBtn = document.createElement('div');
    pinBtn.setAttribute('id', ATHM_BTN_ID);
    var icon = document.createElement('div');
    icon.setAttribute('class', 'pbp-icon');
    var text = document.createElement('span');
    text.setAttribute('class', 'pbp-tips');
    pinBtn.appendChild(icon);
    pinBtn.appendChild(text);
    var self = this;
    this.pbp.appendChild(pinBtn);
    var state = storage.get('pbp_pin', '0') === '1';

    this.pinStateChange(icon, text, state);

    pinBtn.addEventListener('click', function (event) {
      var state = storage.get('pbp_pin', '0') !== '1';

      self.pinStateChange(icon, text, state);

      //   if (!window.pinClickCount) {
      //     window.pinClickCount = 1;
      //   }

      //   if (window.pinClickCount >= 10) {
      //     window.pinClickCount = 1;
      //     // set("pbp_debug", this2.debug ? "0" : "1");
      //     window.location.reload();
      //   }

      //   window.pinClickCount++;
    });
  }

  setPin(ctx, val) {
    _debugLog('call setPin');

    if (ctx.pbp) {
      if (val === '1') {
        ctx.pbp.classList.add('pin');
      } else {
        ctx.pbp.classList.remove('pin');
      }
    }
    console.log(val === '1' ? 1 : 0);
    storage.set('pbp_pin', val === '1' ? 1 : 0);
  }

  pinStateChange(icon, text, state) {
    var pbpClassList = document.getElementById(ATHM_ID).classList;
    _debugLog('Pin Debug', 'state', state);
    if (state) {
      this.setPin(this, '1');

      icon.innerHTML =
        '<svg t="1571033023877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3699" width="16" height="16"><path d="M726.646154 466.707692h-9.846154L649.846154 155.569231h17.723077c31.507692 0 57.107692-25.6 57.107692-57.107693s-25.6-57.107692-57.107692-57.107692H356.430769c-31.507692 0-57.107692 25.6-57.107692 57.107692s25.6 57.107692 57.107692 57.107693h17.723077l-64.984615 311.138461h-9.846154c-31.507692 0-57.107692 25.6-57.107692 57.107693s25.6 57.107692 57.107692 57.107692h165.415385v342.646154c0 31.507692 25.6 59.076923 59.076923 59.076923s59.076923-25.6 59.076923-59.076923V582.892308H728.615385c31.507692 0 57.107692-25.6 57.107692-57.107693s-27.569231-59.076923-59.076923-59.076923z" p-id="3700" fill="#ffffff"></path></svg>';
      text.innerText = '《高能进度条》常驻关闭';
      pbpClassList.add('pin');
    } else {
      this.setPin(this, '0');

      icon.innerHTML =
        '<svg t="1571033005936" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3385" width="16" height="16"><path d="M85.333333 224.853333 139.946667 170.666667 853.333333 884.053333 799.146667 938.666667 546.133333 685.653333 546.133333 938.666667 477.866667 938.666667 477.866667 682.666667 256 682.666667 256 597.333333 341.333333 512 341.333333 480.853333 85.333333 224.853333M682.666667 512 768 597.333333 768 682.666667 760.32 682.666667 341.333333 263.68 341.333333 170.666667 298.666667 170.666667 298.666667 85.333333 725.333333 85.333333 725.333333 170.666667 682.666667 170.666667 682.666667 512Z" p-id="3386" fill="#ffffff"></path></svg>';
      text.innerText = '《高能进度条》常驻开启';
      pbpClassList.remove('pin');
    }

    storage.set('pbp_pin', state ? '1' : '0');
  }

  // 计算高度百分比
  calculatePercentage(data, stepSec) {
    // var videoDuration = this._getDuration();
    var videoDuration = this.duration; // 模拟视频时长
    // var len = Math.floor(videoDuration / stepSec);

    // _debugLog("video_len:".concat(len, " data_len:").concat(data.length));

    // if (len > data.length) {
    //   data = data.concat(new Array(len - data.length).fill(0));
    // }

    var totalSec = this.duration;
    _debugLog((data.length - 1) * stepSec, totalSec);

    var baseValue = data.reduce(function (prev, cur) {
      if (prev > cur) {
        return prev;
      } else {
        return cur;
      }
    }, 0);
    var result = [
      {
        value: 0,
        hPercentage: 0,
        wPercentage: 0,
      },
    ];

    for (var i = 0; i < data.length - 1; i++) {
      var item = data[i];
      var hPercentage = item / baseValue;
      hPercentage = hPercentage || 0;
      result.push({
        value: item,
        hPercentage: hPercentage,
        wPercentage: ((i + 1) * stepSec) / totalSec,
      });
    }
    const last = data[data.length - 1];
    result.push({
      value: last,
      hPercentage: last / baseValue || 0,
      wPercentage: 1,
    });
    return result;
  }

  // 生成整体活动区域
  // 贝塞尔曲线
  // 生成svg pash点
  generateBezierCurvePath(points, width, height) {
    var increasedHeight = INCREASED_HEIGHT_PERCENTAGE * height;
    var halfStep = (points[1].wPercentage * width) / 2;
    var path = ['M 0 100 L 0 '.concat(height - increasedHeight)];
    var lastX = 0;
    var lastY = height - increasedHeight;
    const _points = [...points];

    for (var i = 1; i < _points.length; i++) {
      var point = _points[i];
      var x = point.wPercentage * width;
      var y = height - (increasedHeight + (1 - INCREASED_HEIGHT_PERCENTAGE) * point.hPercentage * height);
      var controlX = lastX + halfStep;

      path.push(
        'C '
          .concat(controlX.toFixed(1), ' ')
          .concat(lastY.toFixed(1), ', ')
          .concat(controlX.toFixed(1), ' ')
          .concat(y.toFixed(1), ', ')
          .concat(x.toFixed(1), ' ')
          .concat(y.toFixed(1))
      );
      lastX = x;
      lastY = y;
    }

    path.push('L 1000 100 Z');
    var pathStr = path.join(' ');
    return pathStr;
  }

  // 生成斑马区域
  generateZebraPath(zebraData, width) {
    var path = [];

    for (var i = 0; i < zebraData.length; i++) {
      var point = zebraData[i];
      var x1 = width * point[0];
      var x2 = width * point[1];
      path.push('M '.concat(x1.toFixed(1), ' 100 H ').concat(x2.toFixed(1), ' V 0 H ').concat(x1.toFixed(1), ' Z'));
    }

    var pathStr = path.join(' ');

    _debugLog('call _generateZebraPath: '.concat(pathStr));

    return pathStr;
  }

  // 创建SVG
  generateSVG(points) {
    const ele = '#pbp-svg';

    let pbp = document.getElementById(ele);
    if (pbp) return;

    pbp = document.createElement('div');
    pbp.setAttribute('id', ATHM_ID);
    pbp.classList.add('show');
    var pbpSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pbpSvg.setAttribute('viewBox', '0 0 '.concat(SVG_WIDTH, ' ').concat(SVG_HEIGHT));
    pbpSvg.setAttribute('preserveAspectRatio', 'none');
    pbpSvg.setAttribute('width', '100%');
    pbpSvg.setAttribute('height', '100%');

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var curveClipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    curveClipPath.setAttribute('id', 'pbp-curve-path');
    curveClipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
    var curvePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // console.log(generateBezierCurvePath(this.points, SVG_WIDTH, SVG_HEIGHT))
    curvePath.setAttribute('d', this.generateBezierCurvePath(this.points, SVG_WIDTH, SVG_HEIGHT));
    curveClipPath.appendChild(curvePath);
    var playedClipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    playedClipPath.setAttribute('id', 'pbp-played-path');
    playedClipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
    var currentRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    currentRect.setAttribute('x', '0');
    currentRect.setAttribute('width', '0');
    currentRect.setAttribute('y', '0');
    currentRect.setAttribute('height', '100%');
    playedClipPath.appendChild(currentRect);
    var zebraPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // zebraPath.setAttribute("d", generateZebraPath(this.zebraAreas, SVG_WIDTH));
    playedClipPath.appendChild(zebraPath);
    defs.appendChild(curveClipPath);
    defs.appendChild(playedClipPath); // 组定义，未播放颜色、播放颜色、当前播放指示器

    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('fill-opacity', 0.3);
    group.setAttribute('clip-path', 'url(#pbp-curve-path)');
    var fillRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fillRect.setAttribute('x', '0');
    fillRect.setAttribute('y', '0');
    fillRect.setAttribute('width', '100%');
    fillRect.setAttribute('height', '100%');
    fillRect.setAttribute('fill', 'rgb(35,173,229)');
    group.appendChild(fillRect);
    var playedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    playedRect.setAttribute('x', '0');
    playedRect.setAttribute('y', '0');
    playedRect.setAttribute('width', '100%');
    playedRect.setAttribute('height', '100%');
    playedRect.setAttribute('fill', '#00ff00');
    playedRect.setAttribute('clip-path', 'url(#pbp-played-path)');
    group.appendChild(playedRect);

    // 游标尺指针
    var currentTimeLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    currentTimeLine.setAttribute('y1', '0');
    currentTimeLine.setAttribute('y2', '100%');
    currentTimeLine.setAttribute('x1', '0%');
    currentTimeLine.setAttribute('x2', '0%');
    currentTimeLine.setAttribute('style', 'stroke: '.concat(CURSOR_COLOR, '; stroke-width: 1;'));
    group.appendChild(currentTimeLine);
    pbpSvg.appendChild(defs);
    pbpSvg.appendChild(group);
    pbp.appendChild(pbpSvg);

    console.log(this.container);

    // addNormalClass(pbp);

    var target = this.rely;
    this.container.insertBefore(pbp, target);

    const mode = this.mode;
    function res() {
      // var target = document.querySelector(ATHM_LIVE_RELY);
      var dom = document.getElementById(ATHM_ID);

      if (dom && target) {
        const top = getComputedStyle(target).paddingTop;
        const bottom = getComputedStyle(target).paddingBottom;
        const height = getComputedStyle(target).height;

        const visible = getComputedStyle(target).display;
        if (visible === 'block') {
          const _t = +top.slice(0, top.length - 2);
          const _b = +bottom.slice(0, bottom.length - 2);
          const _h = +height.slice(0, height.length - 2);

          const final = mode === 'video' ? _h + _t + _b + 1 : _h;
          dom.style.bottom = final + 'px';
        } else if (visible === 'none') {
          dom.style.bottom = 0;
        }
      }
    }
    res();

    const _this = this;
    group.addEventListener('click', function (event) {
      var offsetX = event.clientX - pbpSvg.getBoundingClientRect().left;
      var p = offsetX / pbpSvg.getBoundingClientRect().width;

      _this.player.seek(p * _this.duration);

      // 暂时模拟
      _this.refresh(p);
    });
    this.pbp = pbp;
    this.pbpComponent = {
      pbpSvg: pbpSvg,
      group: group,
      currentRect: currentRect,
      zebraPath: zebraPath,
      fillRect: fillRect,
      playedRect: playedRect,
      currentTimeLine: currentTimeLine,
    };
  }

  initPlayerEvent(player) {
    // player.on(AHVP.PLAYER_EVENT.CONTROL_VISIBLE, function(e) {
    //   const { value } = e;
    //   const { visible } = value;
    //   console.log(`visible -- ${visible}`)
    // })
  }

  changePos(visible) {
    var target = this.rely;
    var dom = document.getElementById(ATHM_ID);
    var pbpClassList = dom.classList;
    const mode = this.mode;
    if (dom && target) {
      const top = getComputedStyle(target).paddingTop;
      const bottom = getComputedStyle(target).paddingBottom;
      const height = getComputedStyle(target).height;
      if (visible === 'show') {
        const _t = +top.slice(0, top.length - 2);
        const _b = +bottom.slice(0, bottom.length - 2);
        const _h = +height.slice(0, height.length - 2);

        const final = _h + _t + _b + 2;

        if (mode === 'video') {
          pbpClassList.add('show');
          dom.style.bottom = final + 'px';
        } else if (mode === 'replay') {
          pbpClassList.add('show');
          // pbpClassList.add("bpb-enable");
          // dom.style.bottom = 50 + "px";
        }
      } else if (visible === 'hide') {
        if (mode === 'video') {
          dom.style.bottom = 0;
          pbpClassList.remove('show');
        } else if (mode === 'replay') {
          pbpClassList.remove('show');
          // dom.style.bottom = "0";
        }
      }
    }
  }

  refresh(p) {
    // 更新弹幕块儿
    // 更新游标
    const { currentTimeLine } = this.pbpComponent;
    // console.log(currentTimeLine);
    // eslint-disable-next-line use-isnan
    if (p === NaN) return;
    currentTimeLine && currentTimeLine.setAttribute('x1', ''.concat(SVG_WIDTH * p));
    currentTimeLine && currentTimeLine.setAttribute('x2', ''.concat(SVG_WIDTH * p));
  }
}

export default PBP;
