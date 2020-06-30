// 微商采购中心
import React from 'react';
// import { Link } from 'dva/router';
import classnames from 'classnames';
// import { Icon } from '@jxkang/web-cmpt';
import { message, Empty } from 'antd';
import styles from './index.module.styl';
import Model from '@/model';
import Product from '@/components/product';

class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // purchase: [
      //   {}, {}, {}, {}, {}, {}, {}, {}, {},
      // ],
    };
  }

  addOrCancelCollect = async (activityId) => {
    const res = await Model.home.addOrCancelCollect({ activityId });
    if (res) {
      message.success(res);
    }
  }

  render() {
    const { purchase, activityType } = this.props;

    return (
      <section className={classnames(styles.purchase_box)}>
        {
          purchase.length > 0 && (
            <>
              {(purchase || []).map(
                // (item, i) => i <= 7 && <Product key={i} item={item} type={activityType} />
                (item, i) => <Product key={i} item={item} type={activityType} />
              )}
            </>
          )
        }
        {purchase.length <= 0 && (
          <Empty description="暂无数据" />
        )}
      </section>
    );
  }
}

export default Purchase;
