import jsonp from 'jsonp';
import utils from '../utils';

const URL_FOR_GET_LIVE_INFO = '//live-platform-cmsopen.api.autohome.com.cn/api/lives/getliveroom';
const URL_FOR_GET_LIVE_STATUS = '//live-platform-cmsopen.api.autohome.com.cn/api/lives/getliveroomstreamstatus?_appid=cms&id=';
// const URL_FOR_GET_STATUS = '//cms.api.autohome.com.cn/Wcf/LiveService.svc/GetLiveRoomStreamStatus_V2?_appid=cms&type=1&id='
// 获取重播流是否已生成
// wiki: http://wiki.corpautohome.com/pages/viewpage.action?pageId=131138752
const URL_FOR_GET_STATUS = '//pt-live.api.autohome.com.cn/live/client/info/liveStatus';
const URL_FOR_GET_PREVIEW_INFO = '//live.autohome.com.cn/ashx/GetLiveTrailerSrc.ashx?mid=';
const URL_FOR_GET_LINK = '//pt-live.api.autohome.com.cn/api/lives/getliveouterlink?_appid=pc.player&linkPlatform=1&liveId=';

// 获取直播间信息
const getLiveInfo = (id) => {
  const searchRes = utils.getUrlQuerys();
  const rid = searchRes.rid ? '&rid=' + searchRes.rid : '';
  return new Promise((resolve, reject) => {
    jsonp(
      URL_FOR_GET_LIVE_INFO + '?_appid=cms&id=' + id + `${rid}` + '&withSeriesInfo=false&withRouteInfo=false&withPublishInfo=false',
      {
        param: '_callback',
        name: `_YPlayer_${window._player_api_count++}`,
      },
      (err, data) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data);
        }
      }
    );
  });
};

const getLiveStatus = (id) => {
  return new Promise(function (resolve, reject) {
    jsonp(
      URL_FOR_GET_LIVE_STATUS + id,
      {
        param: '_callback',
        name: `_YPlayer_${window._player_api_count++}`,
      },
      function (err, data) {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data);
        }
      }
    );
  }).catch((error) => {
    throw new Error(error);
  });
};

const getStatus = (id) => {
  return new Promise(function (resolve, reject) {
    jsonp(
      `${URL_FOR_GET_STATUS}?_appid=pc.player&liveId=${id}`,
      {
        param: 'callback',
        name: `_YPlayer_${window._player_api_count++}`,
      },
      function (err, data) {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data);
        }
      }
    );
  }).catch((error) => {
    throw new Error(error);
  });
};

const getPreviewInfo = (id) => {
  return new Promise(function (resolve, reject) {
    jsonp(
      URL_FOR_GET_PREVIEW_INFO + id,
      {
        param: 'callback',
        name: `_YPlayer_${window._player_api_count++}`,
      },
      function (err, data) {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data);
        }
      }
    );
  }).catch((error) => {
    throw new Error(error);
  });
};

const getLink = async (id) => {
  return new Promise(function (resolve, reject) {
    jsonp(
      URL_FOR_GET_LINK + id,
      {
        param: '_callback',
        name: `_YPlayer_${window._player_api_count++}`,
      },
      function (err, data) {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(data);
        }
      }
    );
  }).catch((error) => {
    console.error(error);
  });
};

export { getLiveInfo, getStatus, getLiveStatus, getPreviewInfo, getLink };
