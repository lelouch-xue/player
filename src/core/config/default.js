/**
 *
 * 播放器默认配置
 *
 * @Author: Xuejian
 * @Date: 2021-05-31 08:55:57
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-31 08:55:57
 */

const defaultConfig = {
  container: '',
  // 是否直播
  live: true,
  // 视频源信息
  video: {
    url: '',
    type: 'mp4',
    poster: '', // 视频封面
    loop: false, // 是否开启循环播放
    muted: false, // 是否开启静音
    autoplay: true, // 是否开启自动播放
    volume: 40, // 默认声音大小
  },
  danmaku: {
    active: false,
  },
  // 预览缩略图
  preview: {
    active: true, // 是否激活
  },
  pluginOptions: { hls: {}, flv: {}, dash: {}, webtorrent: {} },
  mini: {
    active: true,
  }
};

export default defaultConfig;
