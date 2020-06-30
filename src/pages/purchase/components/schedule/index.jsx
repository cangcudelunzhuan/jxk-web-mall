// 推客排期表
import React from 'react';
// import { Link } from 'dva/router';
// import { Icon } from '@jxkang/web-cmpt';
import {
  Radio,
  Empty,
  Select,
  // message,
} from 'antd';
import moment from 'moment';
import {
  getMonthWeek, getRangeTime,
  // datedifference
} from '@/utils/getTime';
import styles from './index.module.styl';
import Model from '@/model';
import Scheitem from '@/components/schedule';
import Checkweek from '@/components/checkWeek';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityStatus: '',
      activityType: '',
      // num: 0,
      list: [],
      // now: {},
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
      activityStatus: value,
    });
    this.getList({ activityStatus: value });
  }

  onChangeType2 = (v) => {
    const value = v;
    this.setState({
      activityType: value,
    });
    if (value === 0 || value === '') {
      this.setState({
        activityStatus: '',
      });
    }
    this.getList({
      activityType: value,
      activityStatus: (value === 0 || value === '') ? '' : this.state.activityStatus,
    });
  }


  getList = async ({ date = this.state.date.time,
    activityStatus = this.state.activityStatus,
    activityType = this.state.activityType }
  ) => {
    // activityStatus 活动状态 1-招募中/预热中 2-在售中
    // activityType 活动类型 0-无活动 1-推客活动 2-爆款活动
    const { beginTime, endTime } = getRangeTime(date);
    const res = await Model.purchase.userPlan({
      beginTime,
      endTime,
      activityType,
      activityStatus,
    });
    if (res) {
      res.sort((a, b) => (a.planDate < b.planDate ? -1 : 1));
      this.setState({
        list: res,
      });
      // 获取已报名人数
      res.map((item, index) => {
        item.infoList.map((it, i) => this.getNum(it.activityId, index, i));
        return '';
      });
    } else {
      this.setState({
        list: [],
      });
    }
  }

  getNum = async (activityId, index, i) => {
    const { list } = this.state;
    if (activityId) {
      const res = await Model.home.getRegisterActivityCount({ activityId });
      list[index].infoList[i].num = res || 0;
      this.setState({
        list,
      });
    }
  }

  weekChange = ({ newDate }) => {
    this.getList({ date: newDate.time });
    this.setState({
      date: newDate,
    });
  }

  componentDidMount() {
    this.getList({});
  }

  render() {
    const { list, activityType, activityStatus } = this.state;
    // const { list, activityType } = this.props;
    const label1 = (key) => {
      if (key === '') {
        return '招募中/预热中';
      }
      if (key === 2) {
        return '预热中';
      }
      return '招募中';
    };
    const option = [
      { label: label1(activityType), value: 1 },
      { label: '在售中', value: 2 },
    ];
    const option2 = [
      { label: '全部商品', value: '' },
      { label: '云仓商品', value: 0 },
      { label: '爆款商品', value: 2 },
      { label: '推客招募', value: 1 },
    ];

    return (
      <section className={styles.schedule}>
        <div className={styles.box_title}>
          <div className={styles.r_box}>
            <Checkweek weekChange={this.weekChange} />
          </div>
          <Select value={activityType} onChange={this.onChangeType2} style={{ marginRight: '10px' }}>
            {option2.map((item, i) => <Select.Option value={item.value} key={i}>{item.label}</Select.Option>)}
          </Select>
          {(activityType !== 0)
            && <Radio.Group options={option} onChange={this.onChangeType} value={activityStatus} />}
        </div>
        {list.length > 0 && (
          <>
            <ol>
              {
                (list || []).map((item) => (
                  <li className="schedule_list">
                    <span className={styles.schedule_day} style={{ marginRight: '5px' }}>
                      {`${item.planDate}`.split('-').pop()}
                      日
                    </span>
                    <span className={styles.schedule_week}>{moment(item.planDate).format('dddd')}</span>
                  </li>
                )
                )
              }
            </ol>
            <div className={styles.ul_out}>
              {
                (list || []).map((item, index) => (
                  <Scheitem itemList={item.infoList} key={index} isInSold={activityStatus === 2} />
                )
                )
              }
            </div>
          </>
        )}
        {
          list.length <= 0 && <Empty description="暂无数据" />
        }
      </section>
    );
  }
}

export default Schedule;
