
import React from 'react';
import {
  RunSecond,
} from '@jxkang/web-cmpt';
import moment from 'moment';
import { Common } from '@jxkang/utils';
import Events from '@jxkang/events';
import styles from './index.module.styl';
import { isBuy } from '@/utils/getTime';
import { formatThousands } from '@/utils/filter';

@Events
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onFinish = (v) => {
    if (v === 'just') {
      setTimeout(() => {
        this.emit('getNewDetail');
      }, 700);
    }
  }

  componentDidMount() {
  }

  render() {
    const { res, skuindex } = this.props;
    const activityType = res.activityType;
    const data = res.activityInfo ? res.activityInfo[0] : [];
    const isInBuy = (dateBegin, dateEnd, dateNow) => {
      const { status, type } = isBuy({ dateBegin, dateEnd, dateNow });
      return (
        <>
          {
            status === true && (
              <span className={styles.time_box}>
                持续热卖中
                {dateEnd && (
                  <span className={styles.runsecond_box}>
                    <RunSecond
                      secondClassName={styles.secondClassName}
                      onFinish={this.onFinish}
                      deadline={moment(dateEnd).valueOf()}
                    />
                  </span>
                )}
              </span>
            )
          }
          {
            type === -1 && (
              <span className={styles.time_box}>
                距离开始还有
                <span className={styles.runsecond_box}>
                  <RunSecond
                    secondClassName={styles.secondClassName}
                    deadline={moment(dateBegin).valueOf()}
                    onFinish={this.onFinish}
                  />
                </span>
              </span>
            )
          }
        </>
      );
    };
    const pusherStep = (recruitTimeBegin, recruitTimeEnd, nowDate, timeBegin, timeEnd) => {
      const canSign = isBuy({ dateBegin: recruitTimeBegin, dateEnd: recruitTimeEnd, dateNow: nowDate });
      const canBuy = isBuy({ dateBegin: timeBegin, dateEnd: timeEnd, dateNow: nowDate });
      return (
        <>
          {
            canSign.status === true && (
              <span className={styles.time_box}>
                火热报名中
                <span className={styles.runsecond_box}>
                  <RunSecond
                    secondClassName={styles.secondClassName}
                    onFinish={this.onFinish}
                    deadline={moment(recruitTimeEnd).valueOf()}
                  />
                </span>
              </span>
            )
          }
          {
            canBuy.status === true && (
              <span className={styles.time_box}>
                持续热卖中
                <span className={styles.runsecond_box}>
                  <RunSecond
                    secondClassName={styles.secondClassName}
                    onFinish={this.onFinish}
                    deadline={moment(timeEnd).valueOf()}
                  />
                </span>
              </span>
            )
          }
          {
            canSign.type === 1 && canBuy.type === -1 && (
              <span className={styles.time_box}>
                等待开售
                <span className={styles.runsecond_box}>
                  <RunSecond
                    secondClassName={styles.secondClassName}
                    onFinish={this.onFinish}
                    deadline={moment(timeBegin).valueOf()}
                  />
                </span>
              </span>
            )
          }
        </>
      );
    };
    return (
      <>
        <article className={styles.super_box}>
          <div className={styles.price_box}>
            <h3 className={`${styles.title} ${styles.hot}`}>
              <span>{activityType === 2 ? '精选爆款限时购' : '招募推客活动'}</span>
              {/* 倒计时 判断是否在购买时间范围内 */}
              {activityType === 2 && isInBuy(data.timeBegin, data.timeEnd, res.nowDate)}
              {/* {activityType === 2 && isInBuy(data.timeBegin, '2020/2/11 22:05:30', res.nowDate)} */}
              {activityType === 1 && pusherStep(data.recruitTimeBegin, data.recruitTimeEnd, res.nowDate, data.timeBegin, data.timeEnd)}
            </h3>
            <div className={styles.bottom_font}>
              价格
              <span className={`${styles.red} ${styles.icon}`}>￥</span>
              <span className={`${styles.red} ${styles.num}`}>
                {skuindex >= 0 ? formatThousands(Common.money2fixed(res.skuInfo[skuindex].vipTradePrice)) : formatThousands(Common.money2fixed(res.vipTradePrice))}
              </span>
              <span style={{ color: '#333' }}>
                原拿货价 ¥
                {skuindex >= 0 ? formatThousands(Common.money2fixed(res.skuInfo[skuindex].scribingPrice)) : formatThousands(Common.money2fixed(res.scribingPrice))}
              </span>
            </div>
          </div>
        </article>
      </>
    );
  }
}

export default Index;
