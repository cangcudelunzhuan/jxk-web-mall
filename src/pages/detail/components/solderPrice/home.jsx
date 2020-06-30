
import React from 'react';
import { Common } from '@jxkang/utils';
import styles from './index.module.styl';
import { formatThousands } from '@/utils/filter';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {

  }

  render() {
    const { res, skuindex } = this.props;
    return (
      <>
        <article className={styles.super_box}>
          <div className={styles.price_box}>
            <h3 className={styles.title}>普通卖家</h3>
            <div className={styles.bottom_font}>
              价格
              <span className={`${styles.red} ${styles.icon}`}>￥</span>
              <span className={`${styles.red} ${styles.num}`}>
                {skuindex >= 0 ? formatThousands(Common.money2fixed(res.skuInfo[skuindex].tradePrice)) : formatThousands(Common.money2fixed(res.tradePrice))}
              </span>
            </div>
          </div>
          <div className={styles.price_box}>
            <h3 className={`${styles.title} ${styles.super_title}`}>超级卖家</h3>
            <div className={styles.bottom_font}>
              价格
              <span className={`${styles.red} ${styles.icon}`}>￥</span>
              <span className={`${styles.red} ${styles.num}`}>
                {skuindex >= 0 ? formatThousands(Common.money2fixed(res.skuInfo[skuindex].vipTradePrice)) : formatThousands(Common.money2fixed(res.vipTradePrice))}
              </span>
            </div>
          </div>
        </article>
      </>
    );
  }
}

export default Index;
