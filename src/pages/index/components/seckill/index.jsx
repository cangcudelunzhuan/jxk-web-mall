// 限时秒杀
import React from 'react';
import { Link } from 'dva/router';
import { Radio } from 'antd';
import {
  Icon,
  RunSecond,
} from '@jxkang/web-cmpt';
import moment from 'moment';
import Product from '@/components/product';
import styles from './index.module.styl';

class Seckill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // seckill: [
      //   {}, {}, {}, {}, {}, {}, {}, {},
      // ],
    };
  }

  onChangeType = (v) => {
    const { value } = v.target;
    this.props.seckillChange(value);
  }

  render() {
    const option = [
      { label: '预热中', value: 1 },
      { label: '在售中', value: 2 },
    ];

    const {
      seckill,
      endTime,
      configId,
      activityType,
    } = this.props;
    return (
      <section className={styles.seckill_box}>
        <div className={styles.box_title}>
          <div className={styles.r_box}>
            <Link className={styles.more_link} to={`/seckill/${configId}/${moment(endTime).valueOf()}`}>更多&gt;</Link>
          </div>
          <Icon type="bianzu3" color="#F9522E" />
          <span className={styles.box_title_label}>限时秒杀</span>
          <Radio.Group options={option} onChange={this.onChangeType} defaultValue={1} />
          {endTime && (
            <div className={styles.run_second}>
              <RunSecond
                secondClassName={styles.secondClassName}
                deadline={moment(endTime).valueOf()}
              />
            </div>
          )}
        </div>
        <div className={styles.content_box}>
          {seckill.map(
            (item, i) => i <= 7 && <Product key={i} item={item} type={activityType} />
          )}
        </div>

      </section>
    );
  }
}

export default Seckill;
