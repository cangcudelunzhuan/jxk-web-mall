// 推客排期表
import React from 'react';
import { Link } from 'dva/router';
import { Icon } from '@jxkang/web-cmpt';
import {
  Radio,
  // message
} from 'antd';
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
      // active: 0,
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
    // this.toDate(0, value);
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
    const {
      queryType,
    } = this.state;
    const { list, configId, activityType } = this.props;
    const option = [
      { label: '招募中', value: 1 },
      { label: '在售中', value: 2 },
    ];

    return (
      <section className={styles.schedule}>
        <div className={styles.box_title}>
          <div className={styles.r_box}>
            <Checkweek weekChange={this.weekChange} />
            <Link className={styles.more_link} to={`/advance/${configId}/${activityType}`}>更多&gt;</Link>
          </div>
          <Icon type="bianzu" color="#F9522E" />
          <span className={styles.box_title_label}>推客招募排期表</span>
          <Radio.Group options={option} onChange={this.onChangeType} defaultValue={1} />
        </div>
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
              <Scheitem itemList={item.list || []} key={index} size={2} activityType={activityType} isInSold={queryType === 2} />
            )
            )
          }
        </div>
      </section>
    );
  }
}

export default Schedule;
