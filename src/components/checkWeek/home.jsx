import React from 'react';

import moment from 'moment';
import styles from './index.module.styl';
import {
  getMonthWeek,
  // getRangeTime,
  datedifference,
} from '@/utils/getTime';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: {
        month: getMonthWeek().month,
        week: getMonthWeek().week,
        time: moment().format('YYYY/MM/DD'),
      },
      prev: true,
      next: true,
    };
  }

  toDate = (type) => {
    const { date } = this.state;
    const now = moment(date.time).add('days', 7 * type).format('YYYY/MM/DD');
    const m = moment(now).format('M');
    const d = datedifference(now, moment().format('YYYY/MM/DD'));
    this.setState({
      prev: true,
      next: true,
    });
    if (type === -1 && d > 30) {
      this.setState({
        prev: false,
      });
      return;
    }
    if (type === 1 && d > 90) {
      this.setState({
        next: false,
      });
      return;
    }

    const newDate = {
      month: m,
      week: getMonthWeek(now).week,
      time: now,
    };
    this.setState({
      date: newDate,
    });
    // this.getList({ date: now });
    this.props.weekChange({ newDate });
  }

  componentDidMount() {

  }


  render() {
    const { prev, next, date } = this.state;
    return (
      <>

        {prev === true
          && (
            <span className={`${styles.schedule_week}`}
              onClick={() => this.toDate(-1)}
            >
              上一周
            </span>
          )}
        <em className={`${styles.schedule_active_week} ${styles.schedule_week}`}>
          {date.month}
          月第
          {date.week}
          周
        </em>
        {next === true && (
          <span className={`${styles.schedule_week}`}
            onClick={() => this.toDate(1)}
          >
            下一周
          </span>
        )}

      </>

    );
  }
}

export default Index;
