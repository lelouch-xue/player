/**
 *
 * 代码copy DPlayer
 * 此处为入口文件
 *
 * @Author: Xuejian
 * @Date: 2021-06-02 14:50:59
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-06-02 14:50:59
 */

import '../css/index.scss';
import DPlayer from './player';

/* global DPLAYER_VERSION GIT_HASH */
console.log(
  `${'\n'} %c DPlayer v${DPLAYER_VERSION} ${GIT_HASH} %c http://dplayer.js.org ${'\n'}${'\n'}`,
  'color: #fadfa3; background: #030307; padding:5px 0;',
  'background: #fadfa3; padding:5px 0;'
);

export default DPlayer;
