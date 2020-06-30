// 推客排期表
import React from 'react';
// import { Link } from 'dva/router';
// import { Icon } from '@jxkang/web-cmpt';
import { Radio, Empty } from 'antd';
import moment from 'moment';
import { getMonthWeek } from '@/utils/getTime';
import styles from './index.module.styl';
// import Model from '@/model';
import Scheitem from '@/components/schedule';
import Checkweek from '@/components/checkWeek';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryType: 1,
      // num: 0,
      date: {
        month: getMonthWeek().month,
        week: getMonthWeek().week,
        time: moment().format('YYYY/MM/DD'),
      },
    };
  }


  onChangeType = (v) => {
    const { value } = v.target;
    this.setState({
      queryType: value,
    });
    this.props.dateChange(this.state.date.time, value);
  }


  weekChange = ({ newDate }) => {
    // this.getList({ date: newDate.time });
    this.props.dateChange(newDate.time, this.state.queryType);
    this.setState({
      date: newDate,
    });
  }

  componentDidMount() {
  }

  render() {
    const { queryType } = this.state;
    const { list, activityType } = this.props;
    const option = [
      { label: '招募中', value: 1 },
      { label: '在售中', value: 2 },
    ];

    return (
      <section className={styles.schedule}>
        <div className={styles.box_title}>
          <div className={styles.r_box}>
            <Checkweek weekChange={this.weekChange} />
          </div>
          <Radio.Group options={option} onChange={this.onChangeType} defaultValue={1} />
        </div>
        {list.length > 0 && (
          <>
            <ol>
              {
                (list || []).map((item) => (
                  <li className="schedule_list">
                    <span className={styles.schedule_day}>{`${item.timeBegin}`.split('-').pop()}</span>
                    <span className={styles.schedule_week}>{item.weekDays}</span>
                  </li>
                )
                )
              }
            </ol>
            <div className={styles.ul_out}>
              {
                (list || []).map((item, index) => (
                  <Scheitem itemList={item.list || []} key={index} activityType={activityType} isInSold={queryType === 2} />
                )
                )
              }
            </div>
          </>
        )}

        {list.length <= 0 && (
          <Empty description="暂无数据" />
        )}
      </section>
    );
  }
}

export default Schedule;
