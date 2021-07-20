/*!
 * pbp | v3.6.2
 * 2021-2-1 7:50:25 ├F10: PM┤
 * wushiyang <wushiyang@bilibili.com>, lipengcheng <lipengcheng@bilibili.com>, tangjunxing <tangjunxing@bilibili.com>
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = global || self), (global.BiliPBP = factory()));
})(this, function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var IndexedDbHelper = /*#__PURE__*/ (function () {
    function IndexedDbHelper() {
      _classCallCheck(this, IndexedDbHelper);

      this.requestQueue = []; // 为同页面多播放器留。
    }

    _createClass(IndexedDbHelper, [
      {
        key: 'getDatabase',
        value: function getDatabase(config) {
          var injectedDatabase = new IndexedDbDatabase(config);
          this.requestQueue.push(injectedDatabase);
          return injectedDatabase;
        },
      },
    ]);

    return IndexedDbHelper;
  })();
  var IndexedDbDatabase = /*#__PURE__*/ (function () {
    function IndexedDbDatabase(config) {
      var _this = this;

      _classCallCheck(this, IndexedDbDatabase);

      this._instance = window.indexedDB.open(config.service + config.version, 1);

      this.onReady =
        config.onReady ||
        function () {
          return null;
        };

      this.onFirstCreate =
        config.onFirstCreate ||
        function () {
          return null;
        };

      this.isReady = false;
      this._dbStore = null;

      this._instance.onerror = function (e) {
        console.error('IDB error' + e);
      };

      this._instance.onsuccess = function (e) {
        _this._dbStore = _this._instance.result;
        _this.isReady = true;
        config.onReady();
      };

      this._instance.onupgradeneeded = function (e) {
        var dbConnection = e.target.result;

        if (!dbConnection.objectStoreNames.contains('pbpZebraCache')) {
          dbConnection.createObjectStore('pbpZebraCache', {
            keyPath: 'cid',
          });
        }

        _this._dbStore = dbConnection;
        config.onFirstCreate();
      };
    }

    _createClass(IndexedDbDatabase, [
      {
        key: 'get',
        value: function get(key, def) {
          var self = this;
          return new Promise(function (resolve, reject) {
            if (self.isReady) {
              var transaction = self._dbStore.transaction(['pbpZebraCache']);

              var getRequest = transaction.objectStore('pbpZebraCache').get(key);

              getRequest.onerror = function (e) {
                resolve(def, e);
              };

              getRequest.onsuccess = function (e) {
                if (getRequest.result) {
                  resolve(getRequest.result);
                } else {
                  resolve(def);
                }
              };
            } else {
              reject(new Error()); // 如果数据库未就绪 返回失败，此时建议重试
            }
          });
        },
      },
      {
        key: 'set',
        value: function set(value, expire) {
          var self = this;
          return new Promise(function (resolve, reject) {
            if (self.isReady) {
              var transaction = self._dbStore.transaction(['pbpZebraCache'], 'readwrite');

              transaction.oncomplete = function (e) {
                resolve(true);
              };

              transaction.onerror = function (e) {
                reject(e);
              };

              value.expireTime = Date.parse(new Date()) + expire;
              transaction.objectStore('pbpZebraCache').put(value);
            } else {
              reject(new Error());
            }
          });
        },
      },
      {
        key: 'checkExpire',
        value: function checkExpire(key) {
          var _this2 = this;

          if (!key) {
            this._dbStore.transaction(['pbpZebraCache'], 'readwrite').objectStore('pbpZebraCache').openCursor().onsuccess = function (e) {
              var cursor = e.target.result;

              if (cursor) {
                _this2.checkExpire(cursor.key);

                cursor.continue();
              }
            };
          } else {
            this.get(key, false).then(function (res) {
              if (res) {
                if (res.expireTime < Date.parse(new Date())) {
                  _this2._dbStore.transaction(['pbpZebraCache'], 'readwrite').objectStore('pbpZebraCache').delete(key).onsuccess =
                    function (e) {};
                }
              }
            });
          }
        },
      },
    ]);

    return IndexedDbDatabase;
  })();

  IndexedDbHelper.getInstance = function (config) {
    if (!window.indexedDbHelperV1) {
      window.indexedDbHelperV1 = new IndexedDbHelper();
    }

    return window.indexedDbHelperV1.getDatabase(config);
  };

  IndexedDbHelper.isSupport = function () {
    if (window.indexedDB) {
      return true;
    } else {
      return false;
    }
  };

  var get = function get(val, def) {
    var value = localStorage.getItem(val);

    if (value == null) {
      set(val, def);
    }

    return value || def;
  };
  var set = function set(key, val) {
    localStorage.setItem(key, val);
  };

  var PBP_ID = 'bilibili_pbp';
  var WRP_CLASS_NAME = 'bilibili-player-video-wrap';
  var CONTROL_CLASS_NAME = 'bilibili-player-video-control';
  var PIN_BTN_ID = 'bilibili_pbp_pin';
  var SVG_WIDTH = 1000;
  var SVG_HEIGHT = 100;
  var CURRENT_VERSION = '3.6.2';
  var INCREASED_HEIGHT_PERCENTAGE = 0.2;
  var CURSOR_COLOR = 'rgba(255,255,255,0.2)';
  var HEIGHT = {
    l: 16,
    m: 28,
    h: 32,
  };
  var OPACITY = {
    l: 0.5,
    m: 0.2,
    h: 0.1,
  };
  var THEME = {
    b: {
      fillColor: '255,255,255',
      playedColor: '35,173,229',
    },
    p: {
      fillColor: '255,255,255',
      playedColor: '251,114,153',
    },
    r: {
      fillColor: '255,255,255',
      // playedColor: '212,63,65'
      playedColor: '178,45,67',
    },
    g: {
      fillColor: '255,255,255',
      // playedColor: '80,161,100'
      playedColor: '11,163,150',
    },
  };

  var BiliPBP = /*#__PURE__*/ (function () {
    _createClass(BiliPBP, null, [
      {
        key: 'isSupport',
        value: function isSupport() {
          // if (getCookie('innersign') && localStorage.bwp_debug === '1') {
          //   new WasmDebug().init(window.cid, window.aid)
          // }
          if (!window.MutationObserver && !window.WebKitMutationObserver && !window.MozMutationObserver) return false;
          if (!Promise) return false;
          if (!localStorage && !sessionStorage) return false;
          if (!IndexedDbHelper.isSupport()) return false;
          return true;
        },
      },
    ]);

    function BiliPBP() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, BiliPBP);

      this.options = options;

      this._clearStore();

      this._status = 'wait'; // show | hide | destroy

      this._pbptag = {};
      this._pbptagstr = '';
      this._player = options.player || window.player;

      if (!this._player) {
        throw new Error('Can not get the player instance');
      } // new player version

      this._isNewPlayer = options.isNewPlayer;
      this._containerClassName = options.containerClassName;

      if (this._isNewPlayer && !this._containerClassName) {
        throw new Error('Can not get the containerId argument');
      }

      this._container = document.getElementsByClassName(this._isNewPlayer ? this._containerClassName : CONTROL_CLASS_NAME)[0];
    }

    _createClass(BiliPBP, [
      {
        key: 'init',
        value: function init() {
          var _this = this;

          var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

          if (this._status === 'destroy') {
            this._status = 'wait';
          }

          if (!BiliPBP.isSupport()) {
            this._debugLog('init unsupported');

            this.destroy();
            return callback(new Error('environment not support'));
          }

          this.eventKey = this.pbpDebugKey || event || 'default';

          this._debugLog('init key =', this.eventKey);

          this._injectBiliPlayer()
            .then(function () {
              if (_this._status === 'destroy') {
                _this.destroy();

                return callback(new Error('_status destroy'));
              }

              _this._debugLog('injectBiliPlayer complete');

              if (!_this.aid || !_this.cid) return callback(new Error('aid || cid miss'));

              if (_this.options && _this.options.data && Object.keys(_this.options.data).length > 0) {
                return new Promise(function (resolve, reject) {
                  resolve(_this.options.data);
                });
              } else {
                return new Promise(function (resolve, reject) {
                  reject(new Error('No Data.'));
                });
              }
            })
            .then(function (progressData) {
              if (_this._status === 'destroy') {
                _this.destroy();

                return callback(new Error('_status destroy'));
              }

              var old = document.getElementById(PBP_ID);

              if (old) {
                _this.destroy();

                return callback(new Error('old pbp not destroy'));
              }

              _this.video = document.querySelector('video') || document.querySelector('bwp-video');

              if (!_this.video) {
                _this.destroy();

                return callback(new Error('video element miss'));
              } // eslint-disable-next-line
  
              var step_sec = progressData.step_sec,
                _progressData$events = progressData.events,
                events = _progressData$events === void 0 ? {} : _progressData$events,
                _progressData$tag = progressData.tag,
                tag = _progressData$tag === void 0 ? {} : _progressData$tag,
                _progressData$tagstr = progressData.tagstr,
                tagstr = _progressData$tagstr === void 0 ? '' : _progressData$tagstr,
                debug = progressData.debug;
              _this._pbptag = tag;
              _this._pbptagstr = tagstr;

              _this._debugLog('init api response debug: ', debug);

              var item = events[_this.eventKey]; // eslint-disable-next-line

              if (!item || !item.length || !step_sec) {
                _this.destroy();

                _this._debugLog('events['.concat(_this.eventKey, '] length empty'), debug);

                return callback(new Error('events[key] length empty'));
              }

              _this._debugLog('init async start: api.cidData complete', _this.eventKey, item);

              _this.st = {
                name: _this.eventKey,
                key: _this.eventKey,
                points: _this._calculatePercentage(item, step_sec),
              };

              _this._checkVersion();

              _this._recoverZebraDataFromCache(callback, _this.st);
            })
            .catch(function (e) {
              if (callback) {
                callback(e);
              } else {
                console.error(e);
              }

              _this._debugLog(e);
            });
        },
      },
      {
        key: 'show',
        value: function show() {
          if (this._status === 'destroy' || this._status === 'show' || !this.st) return;
          this._status = 'show';

          this._debugLog('call show');

          var pbpHeightType = get('pbp_height_v3', 'm'); // eslint-disable-next-line
  
          var pbpHeight = HEIGHT[pbpHeightType] ? HEIGHT[pbpHeightType] : HEIGHT.m; // eslint-disable-next-line
  
          var pbpBottom = this._getPlayerState().gamePlayer ? '-33' : '3';
          this.pbpStyle = document.createElement('style'); // eslint-disable-next-line
  
          var PBP_STYLE = '#bilibili_pbp{display:flex;cursor:pointer;position:absolute;bottom:'
            .concat(pbpBottom, 'px;left:-12px;width:calc(100% + 24px);height:')
            .concat(
              pbpHeight,
              'px;opacity:0;z-index:0}#bilibili_pbp.show{bottom:calc(100% - 2px);opacity:1;left:0;width:100%}.webfullscreen #bilibili_pbp.show,.bilibili-player.mode-fullscreen #bilibili_pbp.show{bottom:calc(100% + 4px + 1px)}.bui-thumb{z-index:1}.bilibili-player-video-toast-wrp{z-index:1000}.bui-slider .bui-track.bui-track-video-progress{height:4px !important;border-radius:0}.bui-slider .bui-track .bui-bar-wrap{border-radius:0}.bilibili-player-video-state{z-index:998}.video-control-show .subtitle-position.subtitle-position-bc{bottom:74px}.mode-fullscreen .video-control-show .subtitle-position.subtitle-position-bc{bottom:84px}.mode-webfullscreen .video-control-show .subtitle-position.subtitle-position-bc{bottom:84px}#bilibili_pbp.pin{opacity:1}.video-control-show .bilibili-player-video-interactive{margin-bottom:16px}.webfullscreen .bilibili-player-video-interactive,.mode-fullscreen .bilibili-player-video-interactive{margin-bottom:24px}#bilibili_pbp_pin{cursor:pointer;position:absolute;bottom:calc(8%);z-index:1;color:white;opacity:0;line-height:16px;text-align:center}.bilibili-player .bilibili-player-area.video-control-show #bilibili_pbp #bilibili_pbp_pin,.bilibili-player .bilibili-player-area .bilibili-player-video-control-wrap:hover #bilibili_pbp #bilibili_pbp_pin{right:-8px;opacity:1}.pbp-tips{position:absolute;font-size:12px;color:#fff;border-radius:4px;line-height:18px;padding:4px 8px;background-color:#000;background:rgba(0,0,0,.8);white-space:nowrap;right:0;top:0;display:none}#bilibili_pbp_pin:hover .pbp-tips{top:-30px;display:block;transition:all .3 ease-in-out;-webkit-transition:all .3 ease-in-out}.pbp-icon{width:16px;height:16px;background-size:contain;transform:rotate(45deg)}.pbp-icon:hover{transform:rotate(60deg) scale(1.2);transition:all .1s ease-in-out;-webkit-transition:all .1s ease-in-out}'
            ); // eslint-disable-next-line
  
          var PBP_NEW_PLAYER_STYLE = '#bilibili_pbp{position:relative;display:flex;cursor:pointer;width:100%;height:'.concat(
            pbpHeight,
            'px;opacity:0;z-index:0}#bilibili_pbp.show{opacity:1}#bilibili_pbp.pin{opacity:1}#bilibili_pbp_pin{cursor:pointer;position:absolute;right:-8px;bottom:calc(8%);z-index:1;color:white;opacity:0;line-height:16px;text-align:center}#bilibili_pbp.show #bilibili_pbp_pin{opacity:1}.pbp-tips{position:absolute;font-size:12px;color:#fff;border-radius:4px;line-height:18px;padding:4px 8px;background-color:#000;background:rgba(0,0,0,.8);white-space:nowrap;right:0;top:0;display:none}#bilibili_pbp_pin:hover .pbp-tips{top:-30px;display:block;transition:all .3 ease-in-out;-webkit-transition:all .3 ease-in-out}.pbp-icon{width:16px;height:16px;background-size:contain;transform:rotate(45deg)}.pbp-icon:hover{transform:rotate(60deg) scale(1.2);transition:all .1s ease-in-out;-webkit-transition:all .1s ease-in-out}'
          );
          this.pbpStyle.innerHTML = !this._isNewPlayer ? PBP_STYLE : PBP_NEW_PLAYER_STYLE;
          document.head.appendChild(this.pbpStyle);

          this._updatePbpConfig();

          this._create();

          this._refresh();

          this._observerChange();

          this._initPin();
        },
      },
      {
        key: 'hide',
        value: function hide() {
          if (this._status === 'destroy' || this._status === 'hide') return;
          this._status = 'hide';

          this._debugLog('call hide');

          if (this.pbp) {
            try {
              this._container.removeChild(this.pbp);

              if (this.video) {
                this.video.removeEventListener('seeking', this.videoSeekingCallback);
              }

              if (this._isNewPlayer) {
                this._player.off(window.nano.EventType.Player_Show_Controls, this.videoControlbarShowCallback);

                this._player.off(window.nano.EventType.Player_Hide_Controls, this.videoControlbarHideCallback);

                this._player.off(window.nano.EventType.Player_TimeUpdate, this.videoProgressUpdateCallback);

                window.removeEventListener('beforeunload', this.onbeforeunload);
              } else {
                this._player.removeEventListener('video_controlbar', this.videoControlbarCallback);

                this._player.removeEventListener('video_heartbeat', this.videoHeartbeatCallback);

                this._player.removeEventListener('video_progress_update', this.videoProgressUpdateCallback);
              }

              if (this.pbpStyle) {
                document.head.removeChild(this.pbpStyle);
              }

              if (this.themeStyle) {
                document.head.removeChild(this.themeStyle);
                this.themeStyle = null;
              }
            } catch (e) {
              console.log(e);
            }
          }
        },
      },
      {
        key: 'destroy',
        value: function destroy() {
          if (this._status === 'destroy') return;

          this._debugLog('call destroy');

          this.hide();

          this._clearStore();

          this._status = 'destroy';
          this._container = null;
        },
      },
      {
        key: '_clearStore',
        value: function _clearStore() {
          this.st = null;
          this.aid = null;
          this.cid = null;
          this.pbpStyle = null;
          this.themeStyle = null;
          this.pbp = null;
          this.video = null;
          this.pbpComponent = null;
          this.timeLine = null;
          this.zebraStart = 0;
          this.zebraEnd = null;
          this.zebraAreas = [];
          this.lastUpdateTime = null;
          this.firstRefreshFlag = false;
          this.videoHeartbeatFirstFlag = false;
          this.eventKey = null;
          this.pbpDebugApi = localStorage.getItem('pbp_debug_api') || '';
          this.pbpDebugKey = localStorage.getItem('pbp_debug_key') || '';
          this.debug = !!this.options.debug || localStorage.getItem('pbp_debug') === '1';
        },
      },
      {
        key: '_checkVersion',
        value: function _checkVersion() {
          this._debugLog('pbp.js version: '.concat(CURRENT_VERSION));

          var pbpVersion = localStorage.getItem('pbp_version');

          if (pbpVersion !== CURRENT_VERSION) {
            localStorage.setItem('pbp_version', CURRENT_VERSION);
          }
        },
      },
      {
        key: '_setThemeStyle',
        value: function _setThemeStyle(color) {
          if (this.themeStyle && this._status === 'show') {
            document.head.removeChild(this.themeStyle);
          }

          if (localStorage.getItem('pbpstate') === '1') {
            this.themeStyle = document.createElement('style');
            this.themeStyle.innerHTML =
              '.bui-slider .bui-track.bui-track-video-progress .bui-bar-normal.bui-bar.bui-bar-normal { background: rgba('.concat(
                color,
                ', 1); }'
              );
            document.head.appendChild(this.themeStyle);
          }
        },
      },
      {
        key: '_updatePbpConfig',
        value: function _updatePbpConfig() {
          var theme = get('pbp_theme_v4', 'b');
          theme = THEME[theme] ? THEME[theme] : THEME.b;
          var opacity = get('pbp_opacity_v3', 'm');
          opacity = OPACITY[opacity] ? OPACITY[opacity] : OPACITY.m;
          this.st.opacity = opacity;
          this.st.fillColor = 'rgb('.concat(theme.fillColor, ')');
          this.st.playedColor = 'rgb('.concat(theme.playedColor, ')');

          this._setThemeStyle(theme.playedColor);
        },
      },
      {
        key: '_setTheme',
        value: function _setTheme(name) {
          this._debugLog('call setTheme');

          var theme = THEME[name] ? THEME[name] : THEME.b;
          this.pbpComponent.fillRect.setAttribute('fill', 'rgb('.concat(theme.fillColor, ')'));
          this.pbpComponent.playedRect.setAttribute('fill', 'rgb('.concat(theme.playedColor, ')'));
          set('pbp_theme_v4', name);

          this._setThemeStyle(theme.playedColor);
        },
      },
      {
        key: '_setHeight',
        value: function _setHeight(ctx, type) {
          ctx._debugLog('call setHeight');

          var height = HEIGHT[type];

          if (ctx.pbp) {
            ctx.pbp.style.height = ''.concat(height, 'px');
          }

          set('pbp_height_v3', type);
        },
      },
      {
        key: '_setOpacity',
        value: function _setOpacity(ctx, name) {
          ctx._debugLog('call setOpacity');

          var opacity = OPACITY[name];

          if (!opacity) {
            return;
          }

          ctx.pbpComponent.group.setAttribute('fill-opacity', opacity);
          set('pbp_opacity_v3', name);
        },
      },
      {
        key: '_setPin',
        value: function _setPin(ctx, val) {
          ctx._debugLog('call setPin');

          if (ctx.pbp) {
            if (val === '1') {
              ctx.pbp.classList.add('pin');
            } else {
              ctx.pbp.classList.remove('pin');
            }
          }

          set('pbp_pin_v3', val === '1' ? 1 : 0);
        },
      },
      {
        key: '_pinStateChange',
        value: function _pinStateChange(icon, text, state) {
          var pbpClassList = document.getElementById(PBP_ID).classList;

          if (state) {
            this._setPin(this, '1');

            icon.innerHTML =
              '<svg t="1571033023877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3699" width="16" height="16"><path d="M726.646154 466.707692h-9.846154L649.846154 155.569231h17.723077c31.507692 0 57.107692-25.6 57.107692-57.107693s-25.6-57.107692-57.107692-57.107692H356.430769c-31.507692 0-57.107692 25.6-57.107692 57.107692s25.6 57.107692 57.107692 57.107693h17.723077l-64.984615 311.138461h-9.846154c-31.507692 0-57.107692 25.6-57.107692 57.107693s25.6 57.107692 57.107692 57.107692h165.415385v342.646154c0 31.507692 25.6 59.076923 59.076923 59.076923s59.076923-25.6 59.076923-59.076923V582.892308H728.615385c31.507692 0 57.107692-25.6 57.107692-57.107693s-27.569231-59.076923-59.076923-59.076923z" p-id="3700" fill="#ffffff"></path></svg>';
            text.innerText = '关闭《高能进度条》常驻';
            pbpClassList.add('pin');
          } else {
            this._setPin(this, '0');

            icon.innerHTML =
              '<svg t="1571033005936" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3385" width="16" height="16"><path d="M85.333333 224.853333 139.946667 170.666667 853.333333 884.053333 799.146667 938.666667 546.133333 685.653333 546.133333 938.666667 477.866667 938.666667 477.866667 682.666667 256 682.666667 256 597.333333 341.333333 512 341.333333 480.853333 85.333333 224.853333M682.666667 512 768 597.333333 768 682.666667 760.32 682.666667 341.333333 263.68 341.333333 170.666667 298.666667 170.666667 298.666667 85.333333 725.333333 85.333333 725.333333 170.666667 682.666667 170.666667 682.666667 512Z" p-id="3386" fill="#ffffff"></path></svg>';
            text.innerText = '打开《高能进度条》常驻';
            pbpClassList.remove('pin');
          }

          set('pbp_pin_v3', state ? '1' : '0');
        },
      },
      {
        key: '_initPin',
        value: function _initPin() {
          var _this2 = this;

          var pinBtn = document.getElementById(PIN_BTN_ID);
          pinBtn = document.createElement('div');
          pinBtn.setAttribute('id', PIN_BTN_ID);
          var icon = document.createElement('div');
          icon.setAttribute('class', 'pbp-icon');
          var text = document.createElement('span');
          text.setAttribute('class', 'pbp-tips');
          pinBtn.appendChild(icon);
          pinBtn.appendChild(text);
          var self = this;
          this.pbp.appendChild(pinBtn);
          var state = get('pbp_pin_v3', '0') === '1';

          this._pinStateChange(icon, text, state);

          pinBtn.addEventListener('click', function (event) {
            var state = get('pbp_pin_v3', '0') !== '1';

            self._pinStateChange(icon, text, state);

            if (!window.pinClickCount) {
              window.pinClickCount = 1;
            }

            if (window.pinClickCount >= 10) {
              window.pinClickCount = 1;
              set('pbp_debug', _this2.debug ? '0' : '1');
              window.location.reload();
            }

            window.pinClickCount++;
          });
        },
      },
      {
        key: '_saveZebraAreas',
        value: function _saveZebraAreas() {
          if (this.zebraStart !== null && this.zebraEnd !== null) {
            for (var i = 0; i < this.zebraAreas.length; i++) {
              var start = this.zebraAreas[i][0];
              var end = this.zebraAreas[i][1];

              if (this.zebraStart > end) {
                if (i + 1 === this.zebraAreas.length) {
                  this.zebraAreas.push([this.zebraStart, this.zebraEnd]);
                  break;
                }

                continue;
              } else if (this.zebraStart >= start && this.zebraEnd <= end) {
                // 子集
                break;
              } else if (this.zebraStart <= start && this.zebraEnd >= start && this.zebraEnd < end) {
                // 尾部和已有数据相交, 合并
                this.zebraAreas[i] = [this.zebraStart, end];
              } else if (this.zebraStart >= start && this.zebraStart <= end && this.zebraEnd > end) {
                // 头部和已有数据相交，合并，可能后面有多个小区间，需要对 后续区间进行合并处理
                this.zebraAreas[i] = [start, this.zebraEnd];
              } else {
                // 在已有区间之中的新区间、或在已有区间之前的新区间
                this.zebraAreas.splice(i, 0, [this.zebraStart, this.zebraEnd]);
              }

              break;
            }

            if (this.zebraAreas.length > 1) {
              var deleteIndexs = [];
              var lastEnd = this.zebraAreas[0][1];
              var lastIndex = 0;

              for (var _i = 1; _i < this.zebraAreas.length; _i++) {
                var _start = this.zebraAreas[_i][0];
                var _end = this.zebraAreas[_i][1];

                if (lastEnd > _start) {
                  if (lastEnd < _end) {
                    this._debugLog('delete merge end');

                    this.zebraAreas[lastIndex] = [this.zebraAreas[lastIndex][0], _end];
                    lastEnd = _end;
                    lastIndex = _i;
                  }

                  this._debugLog('delete: '.concat(_i, ', ').concat(_start, ', ').concat(_end));

                  deleteIndexs.push(_i);
                } else {
                  lastEnd = _end;
                  lastIndex = _i;
                }
              }

              var ctx = this;
              deleteIndexs.forEach(function (v, i) {
                ctx._debugLog('delete start: '.concat(v - i));

                ctx.zebraAreas.splice(v - i, 1);
              });
            } else {
              this.zebraAreas.push([this.zebraStart, this.zebraEnd]);
            }

            this._refreshZebraClipPath();
          }
        },
      },
      {
        key: '_recoverZebraDataFromCache',
        value: function _recoverZebraDataFromCache(callback, state) {
          var _this3 = this;

          var IDBConfig = {
            service: 'pbp',
            version: '3',
            onReady: function onReady() {
              window.PbpIDBHelper.get(_this3.cid, null)
                .then(function (result) {
                  if (result) {
                    try {
                      _this3.zebraAreas = result.data;
                    } catch (e) {
                      _this3._debugLog('Zebra data parse error' + e);
                    } finally {
                      callback(null, state);

                      _this3._refreshZebraClipPath();
                    }
                  } else {
                    callback(null, state);

                    _this3._refreshZebraClipPath();

                    window.PbpIDBHelper.checkExpire(null);
                  }
                })
                .catch(function (e) {
                  // 不可能发生的路径，进入这里代码一定有问题
                  _this3._debugLog('WTF! unkowen' + JSON.stringify(e));
                });
            },
            onFirstCreate: function onFirstCreate() {
              // 这里可以添加新用户或者版本升级后逻辑
            },
          };
          window.PbpIDBHelper = IndexedDbHelper.getInstance(IDBConfig);
        },
      },
      {
        key: '_cacheZebraData',
        value: function _cacheZebraData() {
          if (!this.zebraAreas) {
            return;
          }

          this._debugLog('call _cacheZebraData');

          try {
            window.PbpIDBHelper.set(
              {
                cid: this.cid,
                data: this.zebraAreas,
              },
              1000 * 60 * 60 * 24 * 30
            ); // 30day, 20k数据读取在15ms左右
          } catch (e) {
            this._debugLog('Zebra data stringify or save error' + e);
          }
        },
      },
      {
        key: '_generateBezierCurvePath',
        value: function _generateBezierCurvePath(points, width, height) {
          var increasedHeight = INCREASED_HEIGHT_PERCENTAGE * height;
          var halfStep = (points[1].wPercentage * width) / 2;
          var path = ['M 0 100 L 0 '.concat(height - increasedHeight)];
          var lastX = 0;
          var lastY = height - increasedHeight;
          points.push({
            wPercentage: 1,
            hPercentage: 0,
          });

          for (var i = 1; i < points.length; i++) {
            var point = points[i];
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

          this._debugLog('call _generateBezierCurvePath: '.concat(pathStr));

          return pathStr;
        },
      },
      {
        key: '_generateZebraPath',
        value: function _generateZebraPath(zebraData, width) {
          var path = [];

          for (var i = 0; i < zebraData.length; i++) {
            var point = zebraData[i];
            var x1 = width * point[0];
            var x2 = width * point[1];
            path.push('M '.concat(x1.toFixed(1), ' 100 H ').concat(x2.toFixed(1), ' V 0 H ').concat(x1.toFixed(1), ' Z'));
          }

          var pathStr = path.join(' ');

          this._debugLog('call _generateZebraPath: '.concat(pathStr));

          return pathStr;
        },
      },
      {
        key: '_create',
        value: function _create() {
          var _this4 = this;

          if (!this.st) return;
          var pbp = document.getElementById(PBP_ID);
          if (pbp) return;
          pbp = document.createElement('div');
          pbp.setAttribute('id', PBP_ID);
          var pbpSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          pbpSvg.setAttribute('viewBox', '0 0 '.concat(SVG_WIDTH, ' ').concat(SVG_HEIGHT));
          pbpSvg.setAttribute('preserveAspectRatio', 'none');
          pbpSvg.setAttribute('width', '100%');
          pbpSvg.setAttribute('height', '100%'); // 裁剪路径定义

          var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          var curveClipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
          curveClipPath.setAttribute('id', 'pbp-curve-path');
          curveClipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
          var curvePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          curvePath.setAttribute('d', this._generateBezierCurvePath(this.st.points, SVG_WIDTH, SVG_HEIGHT));
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
          zebraPath.setAttribute('d', this._generateZebraPath(this.zebraAreas, SVG_WIDTH));
          playedClipPath.appendChild(zebraPath);
          defs.appendChild(curveClipPath);
          defs.appendChild(playedClipPath); // 组定义，未播放颜色、播放颜色、当前播放指示器

          var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          group.setAttribute('fill-opacity', this.st.opacity);
          group.setAttribute('clip-path', 'url(#pbp-curve-path)');
          group.setAttribute('class', 'bilibili-player-videoshot-area');
          var fillRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          fillRect.setAttribute('x', '0');
          fillRect.setAttribute('y', '0');
          fillRect.setAttribute('width', '100%');
          fillRect.setAttribute('height', '100%');
          fillRect.setAttribute('fill', this.st.fillColor);
          group.appendChild(fillRect);
          var playedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          playedRect.setAttribute('x', '0');
          playedRect.setAttribute('y', '0');
          playedRect.setAttribute('width', '100%');
          playedRect.setAttribute('height', '100%');
          playedRect.setAttribute('fill', this.st.playedColor);
          playedRect.setAttribute('clip-path', 'url(#pbp-played-path)');
          group.appendChild(playedRect);
          var currentTimeLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          currentTimeLine.setAttribute('y1', '0');
          currentTimeLine.setAttribute('y2', '100%');
          currentTimeLine.setAttribute('style', 'stroke: '.concat(CURSOR_COLOR, '; stroke-width: 1;'));
          group.appendChild(currentTimeLine);
          pbpSvg.appendChild(defs);
          pbpSvg.appendChild(group);
          pbp.appendChild(pbpSvg);

          this._container.appendChild(pbp);

          if (this._getPlayerState().show) {
            pbp.classList.add('show');
          } else {
            pbp.classList.remove('show');
          }

          group.addEventListener('click', function (event) {
            var offsetX = event.clientX - pbpSvg.getBoundingClientRect().left;
            var p = offsetX / pbpSvg.getBoundingClientRect().width;

            _this4._player.seek(p * _this4._getDuration());

            if (_this4._isNewPlayer) {
              _this4._player.eTrack('slidepbp');
            } else {
              _this4._player.track('slidepbp');
            }
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
        },
      },
      {
        key: '_refresh',
        value: function _refresh() {
          // 更新当前播放区域
          if (this.zebraStart !== null && this.zebraEnd !== null && this.zebraEnd > this.zebraStart) {
            var currentRect = this.pbpComponent.currentRect;

            var _x = this.zebraStart * 100;

            var w = this.zebraEnd * 100 - _x;
            currentRect.setAttribute('x', ''.concat(_x.toFixed(2), '%'));
            currentRect.setAttribute('width', ''.concat(w.toFixed(2), '%'));
          } // 更新时间指示器

          var currentTime = this._player.getCurrentTime();

          if (!this.firstRefreshFlag) {
            currentTime = 0;
            this.firstRefreshFlag = true;
          }

          var x = (currentTime / this._getDuration()) * SVG_WIDTH - 0.5;
          x = x >= 0 ? x : 0;
          var currentTimeLine = this.pbpComponent.currentTimeLine;
          currentTimeLine.setAttribute('x1', ''.concat(x));
          currentTimeLine.setAttribute('x2', ''.concat(x));
        },
      },
      {
        key: '_refreshZebraClipPath',
        value: function _refreshZebraClipPath() {
          this.pbpComponent.zebraPath.setAttribute('d', this._generateZebraPath(this.zebraAreas, SVG_WIDTH));
        },
      },
      {
        key: '_observerChange',
        value: function _observerChange() {
          var _this5 = this;

          this._debugLog('observer change');

          this.videoSeekingCallback = function (event) {
            _this5._saveZebraAreas();

            _this5.zebraStart = null;
            _this5.zebraEnd = null;
            _this5.lastUpdateTime = null; // this._refresh();
          };

          this.videoProgressUpdateCallback = function (event, data) {
            var duration = _this5._getDuration();

            var currentTime = _this5._isNewPlayer ? _this5._player.getCurrentTime() : data.currentTime;
            var percentage = currentTime / duration || 0;
            var abnormalUpdate = false;

            if (_this5.lastUpdateTime) {
              abnormalUpdate = currentTime < _this5.lastUpdateTime || currentTime - _this5.lastUpdateTime > 1.5;
            }

            if (!abnormalUpdate) {
              if (_this5.zebraStart === null) {
                _this5.zebraStart = Number(percentage.toFixed(4));
              }

              _this5.zebraEnd = Number(percentage.toFixed(4));

              if (_this5._isNewPlayer && _this5.lastUpdateTime - currentTime >= 15) {
                _this5._executeZebraCached();
              } else {
                _this5.lastUpdateTime = currentTime;
              }
            } else {
              _this5._debugLog('invalid update, ignore.');

              _this5._saveZebraAreas();

              _this5.zebraStart = null;
              _this5.zebraEnd = null;
              _this5.lastUpdateTime = null;
            }

            _this5._refresh();
          };

          this.videoControlbarCallback = function (event, data) {
            _this5._controlbarControl(data.show);
          };

          this.videoHeartbeatCallback = function (event, data) {
            _this5._executeZebraCached();
          };

          this.onbeforeunload = function () {
            _this5.videoHeartbeatCallback();
          };

          this.video.addEventListener('seeking', this.videoSeekingCallback);

          if (this._isNewPlayer) {
            this.videoControlbarShowCallback = function (event) {
              _this5._controlbarControl(true);
            };

            this.videoControlbarHideCallback = function (event) {
              _this5._controlbarControl(false);
            };

            this._player.on(window.nano.EventType.Player_Show_Controls, this.videoControlbarShowCallback);

            this._player.on(window.nano.EventType.Player_Hide_Controls, this.videoControlbarHideCallback);

            this._player.on(window.nano.EventType.Player_TimeUpdate, this.videoProgressUpdateCallback);

            window.addEventListener('beforeunload', this.onbeforeunload);
          } else {
            this._player.addEventListener('video_controlbar', this.videoControlbarCallback);

            this._player.addEventListener('video_heartbeat', this.videoHeartbeatCallback);

            this._player.addEventListener('video_progress_update', this.videoProgressUpdateCallback);
          }
        },
      },
      {
        key: '_calculatePercentage',
        value: function _calculatePercentage(data, stepSec) {
          var videoDuration = this._getDuration();

          var len = Math.floor(videoDuration / stepSec);

          this._debugLog('video_len:'.concat(len, ' data_len:').concat(data.length));

          if (len > data.length) {
            data = data.concat(new Array(len - data.length).fill(0));
          }

          var totalSec = data.length * stepSec;
          var baseValue = data.reduce(function (prev, cur) {
            if (prev > cur) {
              return prev;
            } else {
              return cur;
            }
          }, 0);
          var result = [];

          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var hPercentage = item / baseValue;
            hPercentage = hPercentage || 0;
            result.push({
              value: item,
              hPercentage: hPercentage,
              wPercentage: (i * stepSec) / totalSec,
            });
          }

          return result;
        },
      },
      {
        key: '_getPlayerState',
        value: function _getPlayerState() {
          var state = {
            show: false,
            gamePlayer: false,
          };

          if (this._isNewPlayer) {
            state.show = !this._player.getManifest().majorCtrlHidden;
          } else {
            var playerState = this._player.getPlayerState();

            if (playerState) {
              state.show = playerState.controller && playerState.controller.show;
              state.gamePlayer = playerState.gamePlayer;
            }
          }

          return state;
        },
      },
      {
        key: '_controlbarControl',
        value: function _controlbarControl(show) {
          var classList = this.pbp.classList;

          if (show) {
            classList.add('show');
          } else {
            classList.remove('show');
          }
        },
      },
      {
        key: '_executeZebraCached',
        value: function _executeZebraCached() {
          if (this.videoHeartbeatFirstFlag) {
            var percentage = this._player.getCurrentTime() / this._getDuration() || 0;
            percentage = Number(percentage.toFixed(4));

            this._debugLog(
              'call video heartbeat: '.concat(percentage, ', zebra time: ').concat(this.zebraStart, ' - ').concat(this.zebraEnd)
            );

            this.zebraEnd = percentage;

            this._saveZebraAreas();

            this.zebraStart = this.zebraEnd;
            this.lastUpdateTime = null;

            this._cacheZebraData();
          } else {
            this.videoHeartbeatFirstFlag = true;
          }
        },
      },
      {
        key: '_getDuration',
        value: function _getDuration() {
          if (this._isNewPlayer) {
            return this._player.getDuration(true);
          } else {
            return this._player.getDuration();
          }
        },
      },
      {
        key: '_debugLog',
        value: function _debugLog() {
          var _console;

          for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
            msg[_key] = arguments[_key];
          }

          if (this.debug) (_console = console).log.apply(_console, ['[PBP DEBUG]: '].concat(msg));
        },
      },
      {
        key: '_injectBiliPlayer',
        value: function _injectBiliPlayer() {
          var _this6 = this;

          var limit = 10;

          var execute = function execute(resolve, reject) {
            var player = document.querySelector('.'.concat(WRP_CLASS_NAME));

            if (!_this6._isNewPlayer && (!window.BilibiliPlayer || !player)) {
              limit -= 1;

              if (limit === 0) {
                reject('miss BilibiliPlayer');
                return;
              }

              setTimeout(function () {
                execute(resolve, reject);
              }, 500);
            } else {
              _this6.aid = +window.aid || window.bvid || _this6.options.aid;
              _this6.cid = +window.cid || _this6.options.cid;
              resolve();
            }
          };

          return new Promise(execute);
        },
      },
      {
        key: 'stateStore',
        get: function get$1() {
          var result = {
            /**
             * disable
             * enable
             * enableFail
             */
            status: 'disable',
            data: [],
            // 后端返回接口
            version: '3.6.2', // package.json
          };

          if (this.st && this.st.points) {
            result.data = this.st.points;
          }

          if (result.data.length) {
            if (this._status === 'show') {
              result.status = 'enable';
            } else {
              result.status = 'disable';
            }
          } else {
            result.status = 'enableFail';
          }

          var pinState = get('pbp_pin_v3', '0');
          pinState = pinState === '1' ? pinState : '0';
          var heightState = get('pbp_height_v3', 'm');
          heightState = HEIGHT[heightState] ? heightState : 'm';
          var opacityState = get('pbp_opacity_v3', 'm');
          opacityState = OPACITY[opacityState] ? opacityState : 'm';
          var themeState = get('pbp_theme_v4', 'b');
          themeState = THEME[themeState] ? themeState : 'b';
          var pbpDebug = get('pbp_debug', '0');
          pbpDebug = pbpDebug === '1' ? pbpDebug : '0';
          result.pbpstatus = result.status;
          result.pbptag = this._pbptag;
          result.pbptag.pbppin = Number(pinState);
          result.pbptag.pbpheight = heightState;
          result.pbptag.pbpopacity = opacityState;
          result.pbptag.theme = themeState;
          result.pbptag.debug = pbpDebug;
          result.pbptagstr =
            this._pbptagstr +
            '&pbppin_' +
            pinState +
            '&pbpheight_' +
            heightState +
            '&pbpopacity_' +
            opacityState +
            '&pbptheme_' +
            themeState +
            '&pbpdebug_' +
            pbpDebug;
          return result;
        },
      },
    ]);

    return BiliPBP;
  })();

  return BiliPBP;
});
