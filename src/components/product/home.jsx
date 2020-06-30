import React from 'react';
import { message } from 'antd';
// import { Link } from 'dva/router';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import { formatThousands } from '@/utils/filter';
import { getFileUrl } from '@/utils/index';
import shouqin from '@/assets/images/detail/shouqin1.png';
import styles from './index.module.styl';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // num: 0,
      oneByOne: false,
    };
  }

  // 报名
  registerActivity = async (activityId) => {
    const res = await Model.home.registerActivity({ activityId });
    if (res) {
      message.success('报名成功');
    }
  }

  // 收藏
  addOrCancelCollect = async (activityType, activityId, itemId, skuId, collect = true) => {
    const res = await Model.home.addOrCancelCollect({ activityId, activityType, itemId, skuId, collect });
    if (res) {
      message.success('已收藏');
    }
  }

  componentDidMount() {
    const { pathname } = location;
    const oneArr = ['/searchResult', '/prodClass', '/subject']; // 1:1
    oneArr.map((item) => {
      if (pathname.includes(item)) {
        this.setState({
          oneByOne: true,
        });
      }
      return '';
    });
  }

  // hover = async (type, activityId) => {
  //   if (type !== 1) {
  //     const res = await Model.home.getRegisterActivityCount({ activityId });
  //     this.setState({
  //       num: res || 0,
  //     });
  //   }
  // }

  render() {
    const { item, type } = this.props;
    const { oneByOne } = this.state;
    const { totalStock } = item;
    // const { num } = this.state;
    const activityType = type;
    // if (type === 2) {
    //   activityType = 2;
    // } else if (type === 3) {
    //   activityType = 1;
    // }
    const extrabutton = () => {
      let node = '';
      if (type === 1) {
        node = <span onClick={() => this.registerActivity(item.activityId)}> 立即报名</span>;
      } else {
        node = <span onClick={() => this.addOrCancelCollect(activityType, item.activityId, item.itemId, item.skuId)}> 收藏</span>;
      }
      return node;
    };

    return (
      <>
        <div className={`${styles.product_item} ${oneByOne === true ? styles.oneByOne : null}`}>
          <section className={styles.default_info_box}>
            <figure className={styles.img_box}>
              <img src={getFileUrl(item.mainImgUrl)} alt="" />
              {totalStock <= 0 && <img src={shouqin} className={styles.has_no} alt="has_no" />}
            </figure>
            {type === 2
              && (
                <div className={styles.seckill_selltime}>
                  销售日期：
                  {`${item.timeBegin}`.substr(5, 5)}
                  <span style={{ margin: '0 10px' }}>至</span>
                  {`${item.timeEnd}`.substr(5, 5)}
                </div>
              )}
            <div className={`${type === 2 ? styles.has_timebox : null} ${styles.info_box}`}>
              <h1 className={styles.title}>
                {item.itemTitle.substr(0, 25)}
                {item.itemTitle.length > 25 ? '...' : null}
              </h1>
              <p className={styles.message}>
                {item.itemDescription.substr(0, 35)}
                {item.itemDescription.length > 35 ? '...' : null}
              </p>
              {type !== 0 ? (
                <div className={styles.price_box}>
                  <span className={`${styles.price_num} ${styles.red}`}>{formatThousands(Common.money2fixed(item.vipTradePrice))}</span>
                  元/活动价
                </div>
              )
                : (
                  <div className={`${styles.price_box} ${styles.small_price_box}`}>
                    <div>
                      <span className={`${styles.price_num} ${styles.red}`}>
                        <i className="iconfont">{formatThousands(Common.money2fixed(item.tradePrice))}</i>
                      </span>
                      元/普通卖家价
                    </div>
                    <div>
                      <span className={`${styles.price_num} ${styles.red}`}>
                        <i className="iconfont">{formatThousands(Common.money2fixed(item.vipTradePrice))}</i>
                      </span>
                      元/超级卖家价
                    </div>
                  </div>
                )}
              <div className={styles.small_p}>
                <span>
                  建议零售价：
                  <i className="iconfont">{formatThousands(Common.money2fixed(item.retailPrice))}</i>
                  元
                </span>
                <span style={{ textDecoration: 'line-through', marginLeft: '10px' }}>
                  市场价：
                  <i className="iconfont">
                    {formatThousands(Common.money2fixed(item.scribingPrice))}
                  </i>
                  元
                </span>
              </div>
              {/* <p className={styles.small_p}>
                月销：
                <i className="iconfont">{formatThousands(item.monthSale || item.monthCount || 0)}</i>
                {' '}
                件
              </p> */}
            </div>
          </section>

          <section className={styles.hover_box}>
            {type === 1 ? (
              <div className={styles.hover_inner}>
                <h1 className={styles.hover_title}>{item.itemTitle}</h1>
                <p>
                  预计招募人数：
                  {formatThousands(item.leastNumber)}
                  人
                </p>
                {item.stepPriceList && (
                  <div className={styles.hover_item}>
                    {
                      (item.stepPriceList || []).map((sp, x) => (
                        x <= 1 && (
                          <p key={x}>
                            满
                            {sp.number}
                            人拿货价:&yen;
                            <i className="iconfont">{formatThousands(Common.money2fixed(sp.discountPrice))}</i>
                          </p>
                        )
                      )
                      )
                    }
                    {item.stepPriceList && item.stepPriceList.length > 2 && ('...')}
                  </div>
                )}
                {item.otherRewardList && item.otherRewardList.length > 0 && (
                  <p style={{ margin: '10px 0' }}>
                    其他奖励:
                    {
                      (item.otherRewardList || []).map((ot, y) => (
                        y <= 1 && (
                          <div key={y}>
                            {ot.conditionType === 3 ? '活动总销售金额TOP排名' : null}
                            {
                              (ot.otherRewardDetails || []).map((d, x) => {
                                return (
                                  x <= 2
                                  && (
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
                                  )

                                );
                              }

                              )
                            }
                            {item.otherRewardList.length <= 2 && ot.otherRewardDetails && ot.otherRewardDetails.length > 3 && ('...')}
                          </div>
                        )
                      )
                      )
                    }
                    {item.otherRewardList && item.otherRewardList.length > 2 && ('...')}
                  </p>
                )}

                <p style={{ margin: '10px 0' }}>
                  开团时间：
                  {`${item.timeBegin}`.substr(0, 10)}
                  至
                  {`${item.timeEnd}`.substr(0, 10)}
                </p>
                <div className={styles.hover_item}>
                  已报名人数:
                  {item.num}
                  人
                </div>
              </div>
            )
              : (
                <div className={styles.hover_inner}>
                  <h1 className={styles.hover_title}>{item.itemTitle}</h1>
                  {/* <p>
                    月销量：
                    {formatThousands(item.monthSale || item.monthCount || 0)}
                  </p> */}
                  <div className={styles.small_p}>
                    <p>
                      售价：
                      {formatThousands(Common.money2fixed(item.vipTradePrice))}
                      元
                    </p>
                    <p style={{ textDecoration: 'line-through' }}>
                      市场价：
                      {formatThousands(Common.money2fixed(item.scribingPrice))}
                      元
                    </p>
                  </div>

                </div>
              )}
            <div className={styles.btn_box}>
              <a className={`${totalStock <= 0 && styles.gray}`}
                onClick={
                  () => {
                    window.open(`//${location.host}/detail/${activityType || 0}/${item.itemId}/${item.activityId || -1}`);
                  }
                }
              >
                {`${totalStock <= 0 ? '商品已售罄' : '查看详情'}`}
              </a>

              {totalStock !== 0 && extrabutton()}

            </div>
          </section>
        </div>

      </>

    );
  }
}

export default Index;
