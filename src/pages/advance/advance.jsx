import React, { Component } from 'react';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import Schedule from './components/schedule';
import Introduce from '@/cmpt/introduce';
import Model from '@/model';
import { getRangeTime } from '@/utils/getTime';

class Advance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleList: [],
    };
  }

  dateChange = (date, queryType) => {
    this.getAllActivityDetail({ date, queryType });
  }

  // getSchedulList = async (activityType, date = {}, queryType = 2, activityIdList) => {
  //   const { beginTime, endTime } = getRangeTime(date);
  //   const res = await Model.home.getActivityDetail({
  //     activityType,
  //     beginTime,
  //     endTime,
  //     queryType,
  //     activityIdList,
  //   });
  //   if (res) {
  //     this.setState({
  //       scheduleList: res,
  //     });
  //   }
  // }

  getAllActivityDetail = async ({ date = {}, queryType = 1 }) => {
    const { configId, activityType } = this.props.match.params;
    const { beginTime, endTime } = getRangeTime(date);
    const res = await Model.home.getAllActivityDetail({
      configId: configId - 0,
      activityType,
      queryType,
      beginTime,
      endTime,
    });
    if (res) {
      this.setState({
        scheduleList: res,
      });
      // 获取已报名人数
      res.map((item, index) => {
        item.list.map((it, i) => this.getNum(it.activityId, index, i));
        return '';
      });
    } else {
      this.setState({
        scheduleList: [],
      });
    }
  }

  getNum = async (activityId, index, i) => {
    const { scheduleList } = this.state;
    const res = await Model.home.getRegisterActivityCount({ activityId });
    scheduleList[index].list[i].num = res || 0;
    this.setState({
      scheduleList,
    });
  }

  componentDidMount() {
    this.getAllActivityDetail({});
  }

  render() {
    const { activityType } = this.props.match.params;
    const { scheduleList } = this.state;
    return (
      <section>
        <Header />
        <Introduce title="推客招募排期表" desc="精心挑选冰点价的源头厂货，超值精选爆款，大厂直供，天天平价！" />
        <Schedule list={scheduleList} dateChange={this.dateChange} activityType={activityType} />
        <Footer />
      </section>
    );
  }
}

export default Advance;
