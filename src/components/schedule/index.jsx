// 推客排期表
import React from 'react';
// import { Link } from 'dva/router';
import { Icon } from '@jxkang/web-cmpt';
import { message } from 'antd';
import moment from 'moment';
// import { getMonthWeek, getRangeTime } from '@/utils/getTime';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import { formatThousands } from '@/utils/filter';
import { getFileUrl } from '@/utils/index';
import styles from './index.module.styl';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

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

  render() {
    const { size, itemList, isInSold } = this.props;
    const activityType = Number(this.props.activityType);
    return (
      <ul className={styles.sche_ul}>
        {itemList.map((it, i) => (
          (size ? (i < size) : true)
          && (
            <li key={i}
              // onMouseEnter={() => this.hover(it.activityId)}
              className={styles.sche_item_box}
            >
              <article className={styles.sche_item_default_box}>
                <figure className={styles.schedule_img}>
                  {(activityType || it.activityType) === 0 && <div className={styles.type_tag}>云仓商品</div>}
                  {(activityType || it.activityType) === 1 && <div className={`${styles.type_tag} ${styles.tuik_tag}`}>推客招募</div>}
                  {(activityType || it.activityType) === 2 && <div className={`${styles.type_tag} ${styles.baok_tag}`}>爆款活动</div>}
                  <img src={getFileUrl(it.mainImgUrl)} alt="" />
                </figure>
                {((activityType || it.activityType) !== 0)
                  && (
                    <div className={styles.schedule_pubtime}>
                      销售日期:
                      {
                        moment(it.timeBegin || it.sellBegin).format('MMM Do')
                      }
                      -
                      {
                        moment(it.timeEnd || it.sellEnd).format('MMM Do')
                      }
                    </div>
                  )}
                <section>
                  <div className={styles.schedule_content}>
                    {it.itemTitle.substr(0, 22)}
                    {it.itemTitle.length > 22 ? '...' : null}
                  </div>
                  <section className={styles.tag_out}>
                    {(activityType || it.activityType) === 1 && <div className={`${styles.schedule_icon} ${styles.tuik_tag}`}>推客招募</div>}
                    {(activityType || it.activityType) === 2 && <div className={`${styles.schedule_icon} ${styles.baok_tag}`}>爆款活动</div>}
                    {(activityType || it.activityType) === 0 && <div className={` ${styles.baok_tag}`}>超级卖家</div>}
                    <div className={styles.schedule_money}>
                      &yen;
                      {it.vipTradePrice}
                    </div>
                    {(activityType || it.activityType) === 0 && <div className={`${styles.tuik_tag}`}>普通卖家</div>}
                    {(activityType || it.activityType) === 0 && (
                      <div className={styles.schedule_money}>
                        &yen;
                        {it.tradePrice}
                      </div>
                    )}
                  </section>

                  {/* <div className={styles.schedule_volume_count}>
                    月销：
                    {formatThousands(it.monthSale || it.monthCount || 0)}
                    件
                  </div> */}

                </section>
              </article>
              <section className={styles.schedule_hover}>
                {
                  (activityType || it.activityType) === 1 ? (
                    <>
                      <p className={styles.hover_item}>
                        预计招募人数：
                        {formatThousands(it.leastNumber)}
                        人
                      </p>
                      {it.stepPriceList && (
                        <div className={styles.hover_item}>
                          {
                            (it.stepPriceList || []).map((sp, x) => (
                              x <= 1 && (
                                <p key={x}>
                                  满
                                  {sp.number}
                                  人拿货价: &yen;
                                  {formatThousands(Common.money2fixed(sp.discountPrice))}
                                </p>
                              )
                            )
                            )
                          }
                          {it.stepPriceList && it.stepPriceList.length > 2 && ('...')}
                        </div>
                      )}
                      {it.otherRewardList && it.otherRewardList.length > 0 && (
                        <div className={styles.hover_item}>
                          其他奖励:
                          {
                            (it.otherRewardList || []).map((ot, y) => (
                              y <= 1 && (
                                <div key={y}>
                                  {ot.conditionType === 3 ? '活动总销售金额TOP排名' : null}
                                  {
                                    (ot.otherRewardDetails || []).map((d, x) => {
                                      return (
                                        x < 1
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
                                  {it.otherRewardList.length < 2 && ot.otherRewardDetails && ot.otherRewardDetails.length > 2 && ('...')}
                                </div>
                              )
                            )
                            )
                          }
                          {it.otherRewardList && it.otherRewardList.length >= 2 && ('...')}
                        </div>
                      )}
                      <div className={styles.hover_item}>
                        已报名人数:
                        {it.num}
                        人
                      </div>
                    </>
                  )
                    : (
                      <>
                        <h1 className={styles.hover_title}>{it.itemTitle}</h1>
                        {/* <p>
                          月销量：
                          {formatThousands(it.monthSale || it.monthCount || 0)}
                        </p> */}
                        <div className={styles.small_p}>
                          <p>
                            售价：
                            {formatThousands(Common.money2fixed(it.vipTradePrice))}
                            元
                          </p>
                          <p style={{ textDecoration: 'line-through' }}>
                            市场价：
                            {formatThousands(Common.money2fixed(it.scribingPrice))}
                            元
                          </p>
                        </div>
                      </>
                    )
                }

                <div className={styles.schedule_sign}>
                  <div>
                    {/* <Link to={`/detail/${activityType || it.activityType}/${it.itemId}/${it.activityId}`}>
                      <Icon size="xs" type="system-conceal" />
                    </Link> */}
                    <a
                      onClick={
                        () => {
                          window.open(`//${location.host}/detail/${activityType || it.activityType}/${it.itemId}/${it.activityId}`);
                        }
                      }
                    >
                      <Icon size="xs" type="system-conceal" />
                    </a>
                  </div>
                  {(activityType || it.activityType) === 1
                    && (isInSold === false)
                    && (

                      <div>
                        <button type="button" onClick={() => this.registerActivity(it.activityId)}>立即报名</button>
                      </div>
                    )}
                  {((activityType || it.activityType) !== 1 || isInSold === true)
                    && (
                      <div>
                        <button type="button"
                          onClick={() => this.addOrCancelCollect(activityType || it.activityType, it.activityId, it.itemId, it.skuId)}
                        >
                          收藏
                        </button>
                      </div>
                    )}
                </div>
              </section>
            </li>
          )
        )
        )}
      </ul>
    );
  }
}

export default Schedule;
