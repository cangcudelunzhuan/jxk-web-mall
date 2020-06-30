
import React from 'react';
import { Progress } from 'antd';
import Events from '@jxkang/events';
import { Common } from '@jxkang/utils';
import styles from './index.module.styl';
import Model from '@/model';

@Events
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      stepPriceList: [],
      now: {
        number: 0,
        left: 0,
        discountPrice: 0,
        originalPrice: 0,
      },
    };
  }

  getNum = async ({ activityId, stepPriceList, skuInfo, maxNumber }) => {
    const { now } = this.state;
    now.discountPrice = Common.money2fixed(skuInfo.vipTradePrice) || Common.money2fixed(stepPriceList[0].originalPrice);
    // const { activityInfo } = this.props;
    // const leastNumber = activityInfo[0].leastNumber;
    const res = await Model.home.getRegisterActivityCount({ activityId });
    if (res >= 0) {
      now.left = this.getLeftLen(res, maxNumber);
      now.number = res;
      stepPriceList.map((item) => {
        if (item.number <= res) {
          now.discountPrice = Common.money2fixed(item.discountPrice);
          (item.stepPriceSkus || []).map((it) => {
            if (it.skuId === skuInfo.skuId) {
              now.discountPrice = it.discountPrice;
              this.emit('setSkuPrice', Common.money2fixed(it.discountPrice));
            }
            return '';
          });
        }
        return now;
      });
      this.setState({
        num: res,
        now,
      });
    }
    this.setState({
      now,
    });
  }

  getStep = (skuInfo = {}) => {
    const { activityId, activityInfo } = this.props;
    const stepPriceList = Common.clone(activityInfo[0].stepPriceList);
    const maxNumber = stepPriceList[stepPriceList.length - 1].number;
    let originalPrice = stepPriceList[0].originalPrice;
    stepPriceList.map((it) => {
      it.left = this.getLeftLen(it.number, maxNumber);
      if (skuInfo && skuInfo.skuId) {
        const x = it.stepPriceSkus.findIndex((r) => r.skuId === skuInfo.skuId);
        it.discountPrice = Common.money2fixed(it.stepPriceSkus[x].discountPrice);
        originalPrice = it.stepPriceSkus[x].originalPrice;
      }
      return '';
    });
    this.setState({
      stepPriceList,
      maxNumber,
      originalPrice,
    });
    this.getNum({ activityId, stepPriceList, skuInfo, maxNumber });
  }

  // 获取价格在进度条的位置
  getLeftLen = (number, leastNumber) => {
    const finalL = 538;
    const len = (number / Number(leastNumber)) * finalL;
    let left = 0;
    if (len <= 100) {
      left = len - 45;
    } else if (len > finalL) {
      left = finalL - 55;
    } else {
      left = len - 55;
    }
    return left;
  }


  componentDidMount() {
    this.getStep();
    this.on('getStepInfo', (skuInfo) => {
      this.getStep(skuInfo);
    });
  }

  render() {
    const { activityInfo } = this.props;
    const data = activityInfo ? activityInfo[0] : {};
    const { num, stepPriceList, now, maxNumber, originalPrice } = this.state;
    return (
      <>
        <div style={{ color: '#999', fontSize: '12px' }}>推客招募活动</div>
        <section className={styles.pusher_info_box}>
          <p style={{ fontSize: '16px' }}>
            预计招募人数：
            {data.leastNumber}
            人(
            {num}
            人已报名)
          </p>
          <div style={{ marginTop: '10px' }}>
            <span>
              招募时间：
              {data.recruitTimeBegin.substr(0, 10)}
              ~
              {data.recruitTimeEnd.substr(0, 10)}
            </span>
            <span style={{ marginLeft: '30px' }}>
              销售时间：
              {data.timeBegin.substr(0, 10)}
              ~
              {data.timeEnd.substr(0, 10)}
            </span>
          </div>
          <div className={styles.progress_box} style={{ paddingTop: '35px' }}>
            {/* <p style={{ textAlign: 'left' }}>
              已报名人数：
              {num}
              人
            </p> */}
            <Progress percent={(num / maxNumber) * 100} showInfo={false} strokeColor="#F9522E" />
            <div className={styles.price_box}>
              {stepPriceList[0] && (
                <section className={`${styles.item}`} style={{ left: '-45px' }}>
                  <p>
                    原始拿货价
                  </p>
                  <div className={`${styles.red} ${styles.price}`}>
                    ¥
                    {Common.money2fixed(originalPrice)}
                  </div>
                </section>
              )}
              {stepPriceList.map((item) => (
                <section className={`${styles.item}`} style={{ left: `${item.left}px` }}>
                  <p>
                    满
                    {item.number}
                    人拿货价
                  </p>
                  <div className={`${styles.red} ${styles.price}`}>
                    ¥
                    {Common.money2fixed(item.discountPrice)}
                  </div>
                </section>
              )
              )}
              {
                <section className={`${styles.item} ${styles.active}`} style={{ left: `${now.left}px` }}>
                  <p>
                    当前拿货价
                  </p>
                  <div className={`${styles.red} ${styles.price}`}>
                    ¥
                    {Common.money2fixed(now.discountPrice)}
                  </div>
                </section>
              }

            </div>
          </div>
        </section>
        {data.otherRewardList && data.otherRewardList.length > 0 && (
          <section className={`${styles.pusher_info_box} ${styles.other_box}`}>
            <label>
              额外奖励
            </label>
            <div className={styles.pusher_info_box_right}>
              {
                (data.otherRewardList || []).map((ot, y) => (
                  <div key={y} className={styles.item}>
                    {/* {ot.conditionType === 1 ? '总推客招募数' : null}
                    {ot.conditionType === 2 ? '推荐好友参与并成交' : null}
                    {`≥${ot.conditionContent}人`} */}
                    <div className={styles.title}>{ot.conditionType === 3 ? '活动总销售金额TOP排名' : null}</div>
                    {
                      (ot.otherRewardDetails || []).map((d) => {
                        return (
                          <section className={styles.other_detail_box}>
                            <span>
                              第
                              {d.conditionValueStart}
                              名~第
                              {d.conditionValueEnd}
                              名
                            </span>
                            {' '}
                            :奖励
                            <span className={styles.red}>
                              {d.rewardType === 1 ? `${d.rewardContent} 一件/每单` : null}
                              {d.rewardType === 2 ? `￥${d.rewardContent} 元/每单` : null}
                            </span>
                          </section>

                        );
                      }

                      )
                    }
                  </div>
                )
                )
              }
            </div>
          </section>
        )}
      </>
    );
  }
}

export default Index;
