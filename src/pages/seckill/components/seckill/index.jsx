// 限时秒杀
import React from 'react';
// import { Link } from 'dva/router';
import { Radio, Empty } from 'antd';
import {
  Icon,
  RunSecond,
} from '@jxkang/web-cmpt';
// import moment from 'moment';
import styles from './index.module.styl';
import Product from '@/components/product';

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
      activityType,
    } = this.props;
    return (
      <>
        <section className={styles.seckill_box}>
          <div className={styles.box_title}>

            <Icon type="bianzu3" color="#F9522E" />
            <span className={styles.box_title_label}>限时秒杀</span>
            <Radio.Group options={option} onChange={this.onChangeType} defaultValue={2} />
            <div className={styles.run_second}>
              <RunSecond
                secondClassName={styles.secondClassName}
                deadline={endTime}
              />
            </div>
          </div>
        </section>
        {seckill && seckill.length > 0 && (
          <ul className={styles.seckill_list}>
            {
              (seckill || []).map((item, index) => (
                <>
                  <Product key={index} item={item} type={activityType} />
                </>
              ))
            }
          </ul>
        )}
        {seckill && seckill.length <= 0 && (
          <Empty description="暂无数据" />
        )}
      </>
    );
  }
}

export default Seckill;
