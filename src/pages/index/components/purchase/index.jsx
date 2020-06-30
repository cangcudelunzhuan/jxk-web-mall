// 微商采购中心
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { Icon } from '@jxkang/web-cmpt';
import { message } from 'antd';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import { getFileUrl } from '@/utils/index';
import shouqin from '@/assets/images/detail/shouqin1.png';
import { formatThousands } from '@/utils/filter';
import styles from './index.module.styl';

class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // purchase: [
      //   {}, {}, {}, {}, {}, {}, {}, {}, {},
      // ],
    };
  }

  addOrCancelCollect = async (activityType, activityId, itemId, skuId, collect = true) => {
    const res = await Model.home.addOrCancelCollect({ activityType, activityId, itemId, skuId, collect });
    if (res) {
      message.success(res);
    }
  }

  render() {
    const { type, purchase, activityName, index, configId, activityType, itemIdList, itemInfo } = this.props;
    // const { purchase } = this.state;
    const isPurchase = type === 'purchase';

    return (
      <section className={classnames(styles.purchase_box)}>
        {index === 0 && (
          <div hidden={!isPurchase} className={styles.box_title}>
            {/* <div className={styles.r_box}>
              <Link className={styles.more_link} to="/more">更多&gt;</Link>
            </div> */}
            <Icon type="bianzu2" color="#1F63E2" />
            <span className={styles.box_title_label}>采购中心</span>
          </div>
        )}
        <div className={styles.purchase_content}>
          <div className={`${styles.purchase_aside} ${styles[`${type}_aside_bg`]}`}>
            <h3>{activityName}</h3>
            <div>
              {itemInfo.activityRemark}
            </div>
            <Link className={styles.aside_more} to={{ pathname: `/subject/${configId}/${activityType}`, state: { itemIdList } }}>查看更多爆款</Link>
          </div>
          <ul className={styles.purchase_list}>
            {
              (purchase || []).map((item, i) => (
                i <= 8
                && (
                  <li key={i} className={styles.purchase_items}>
                    <div className={styles.purchase_tag}>
                      <label>心选品质</label>
                      <label>中小微首选</label>
                    </div>
                    <h4>
                      {item.itemTitle.substr(0, 15)}
                      {item.itemTitle.length > 15 ? '...' : null}
                    </h4>
                    <div className={styles.purchase_spec}>
                      {item.itemDescription.substr(0, 19)}
                      {item.itemDescription.length > 19 ? '...' : null}
                    </div>
                    <figure className={styles.purchase_img}>
                      <img src={getFileUrl(item.mainImgUrl)} alt="" />
                    </figure>
                    {item.totalStock <= 0 && <img src={shouqin} alt="has_no" className={styles.has_no} />}
                    <div className={styles.purchase_price}>
                      <div className={styles.purchase_price_box}>
                        <div className={styles.inner}>
                          <i className={`iconfont ${styles.price_num}`}>
                            {formatThousands(Common.money2fixed(item.vipTradePrice))}
                          </i>
                          元/活动价
                        </div>
                        <div className={styles.gray_font}>
                          <del>
                            市场价：
                            <i className="iconfont">{formatThousands(Common.money2fixed(item.scribingPrice))}</i>
                            元
                          </del>
                        </div>
                      </div>
                      <div className={styles.purchase_suggest}>
                        <div>
                          建议零售价：
                          <i className="iconfont">
                            {formatThousands(Common.money2fixed(item.retailPrice))}
                          </i>
                          元
                        </div>
                        {/* <div>
                          月销：
                          {item.monthSale || item.monthCount}
                          件
                        </div> */}
                      </div>
                    </div>
                    <div className={`${styles.purchase_hover} ${item.totalStock <= 0 && styles.gray}`}>
                      <a href={`//${location.host}/detail/${activityType || 0}/${item.itemId}/${item.activityId || -1}`}
                        target="view_window"
                      >
                        {`${item.totalStock <= 0 ? '商品已售罄' : '查看详情'}`}
                      </a>
                      {item.totalStock !== 0 && <span onClick={() => this.addOrCancelCollect(activityType, item.activityId, item.itemId, item.skuId)}>加入收藏</span>}
                    </div>
                  </li>
                )
              ))
            }
          </ul>
        </div>
      </section>
    );
  }
}

export default Purchase;
