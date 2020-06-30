import React from 'react';
import Loadable from 'react-loadable';
import { Spin } from 'antd';
import Config from '@/config';

const Loading = function ({ error, pastDelay }) {
  const styles = {
    backgroundImage: 'url(https://jxkcdn.jingxiaokang.com/assets/images/1591601686504_3801.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundColor: '#00baff',
    height: '100vh',
  };
  if (error) {
    return <div style={styles} title="系统正处于发布中,请稍后刷新或清缓存后重新登录再试" />; // 'Oh Nooess!';
  } if (pastDelay) {
    return <Spin tip="Loading..." style={{ position: 'absolute', left: '50%', top: '50%' }} />;
  }
  return null;
};

const loadRouter = function (callLoad) {
  return Loadable({
    loader: callLoad,
    loading: Loading,
  });
};

/**
 * 获取完整的文件URL路径
 * @param {String} v 文件路径
 */
const getFileUrl = function (v) {
  const p = `/${v}`.replace(/^\/+/, '/');
  return v && (`${v}`.indexOf('//') > -1 ? v : `${Config.imgHost}${p}`);
};

/**
 * 获取一串url中的pathname
 * @param {String} v
 */
const getPathName = function (v) {
  const iUrl = `${v}`;
  if (iUrl.indexOf('//') > -1) {
    return iUrl.replace(/.*\/\//, '').replace(/[^/]+\//, '/');
  }
  return v;
};

/**
 * 获取文件下载路径
 * @param {String} v 文件下载路径
 */
const downloadFileUrl = function (v) {
  const p = `/${v}`.replace(/^\/+/, '/');
  return v && (`${v}`.indexOf('//') > -1 ? v : `${Config.downImgHost}${p}`);
};

export default {
  loadRouter,
  getFileUrl,
  getPathName,
  downloadFileUrl,
};

export { loadRouter };
export { getFileUrl };
export { getPathName };
export { downloadFileUrl };
