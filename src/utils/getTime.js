import moment from 'moment';
// 获取当前从周一到周日
const getRangeTime = (time = {}) => {
  const weekOfday = moment(time).format('E');// 计算今天是这周第几天
  const beginTime = moment(time).subtract(weekOfday - 0, 'days').format('YYYY-MM-DD');// 周一日期
  const endTime = moment(time).add(6 - weekOfday, 'days').format('YYYY-MM-DD');// 周日日期
  return { beginTime, endTime };
};

// 获取第几月第几周
const getMonthWeek = (date) => {
  const currentDay = date ? new Date(date) : new Date();
  const month = currentDay.getMonth() + 1;
  // 获取该日期所在周的周六，如2019.5月的周六有4号、11号、18号、25号、31号
  const theSaturday = currentDay.getDate() + (6 - currentDay.getDay());
  const week = Math.ceil(theSaturday / 7);
  // 获取周日
  // const theSunday = currentDay.getDate() + (7 - (currentDay.getDay() === 0 ? 7 : currentDay.getDay()));
  // const week = Math.ceil(theSunday / 7);
  return { month, week };
};
// 是否在销售时间返回内
const isBuy = ({ dateBegin, dateEnd, dateNow }) => {
  dateBegin = new Date(`${dateBegin}`.replace(/-/g, '/'));
  dateEnd = new Date(`${dateEnd}`.replace(/-/g, '/'));
  dateNow = new Date(`${dateNow}`.replace(/-/g, '/'));// 获取当前时间
  const beginDiff = dateNow.getTime() - dateBegin.getTime();// 时间差的毫秒数
  const beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));// 计算出相差天数
  const endDiff = dateEnd.getTime() - dateNow.getTime();// 时间差的毫秒数
  const endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));// 计算出相差天数
  if (endDayDiff < 0) { // 已过期
    return { status: false, type: 1 };
  }
  if (beginDayDiff < 0) { // 没到开始时间
    return { status: false, type: -1 };
  }
  return { status: true, type: 0 };
};

// 计算相差多少天
const datedifference = (sDate1, sDate2) => { // sDate1和sDate2是2006-12-18格式
  let dateSpan;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  return Math.floor(dateSpan / (24 * 3600 * 1000));
};
export {
  getRangeTime,
  getMonthWeek,
  isBuy,
  datedifference,
};
