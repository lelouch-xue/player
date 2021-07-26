/**
 * 播放器默认配置
 * @Author: Xuejian
 * @Date: 2021-05-26 14:37:44
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-26 14:37:44
 */

const defaultConfig: IPlayerDefaultConfig = {
  setting: {
    loop: false,
    muted: true,
    autoplay: true,
    volume: 40,
  },
  danmaku: {
    active: false,
  },
  preview: {
    active: false,
  },
  mini: {
    active: false,
  },
};

export default defaultConfig;
