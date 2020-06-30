import React from 'react';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import Model from '@/model';
import { getRangeTime } from '@/utils/getTime';
import Banner from './components/banner';
// import Marketbanner from './components/marketBanner';
// import Schedule from './components/schedule';
// import Seckill from './components/seckill';
import Purchase from './components/purchase';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleList: [],
      // seckillList: [],
      otherList: [],
      topBanner: [],
      // marketBanner: [],
    };
  }

  componentDidMount() {
    this.getApolloInfo();
    this.getMarkeBanner();
    this.getApolloBanner();
  }

  getMarkeBanner = async () => {
    const res = await Model.home.getMarkeBanner();
    if (res) {
      this.setState({
        // marketBanner: res,
      });
    }
  }

  getApolloBanner = async () => {
    const res = await Model.home.getApolloBanner();
    if (res) {
      this.setState({
        topBanner: [...res],
      });
    }
  }

  getApolloInfo = async () => {
    const res = await Model.home.getApolloInfo();
    if (res) {
      const scheduType = res[0].activityType;
      const scheduleIdList = res[0].activityList;
      // const scheduConfigId = res[0].configId;
      const seckillType = res[1].activityType;
      const seckillIdList = res[1].activityList;
      // const seckillEndTime = res[1].endTime;
      // const seckillConfigId = res[1].configId;
      const otherList = res.slice(2);
      this.setState({
        scheduType,
        // scheduConfigId,
        scheduleIdList,
        // seckillType,
        // seckillIdList,
        // seckillConfigId,
        // seckillEndTime,
      });
      this.getSchedulList(scheduType, {}, 1, scheduleIdList);
      this.getSeckillList(seckillType, 1, seckillIdList);
      this.getOther(otherList);
    }
  }

  getOther = (otherList) => {
    (otherList || []).map((item) => this.getOtherList(item));
  }

  getOtherList = async (item) => {
    const { otherList } = this.state;
    const activityType = item.activityType;
    const itemIdList = item.itemIdList;
    const activityIdList = item.activityList;
    const re = await Model.home.getActivityDetail({
      activityType,
      activityIdList,
      itemIdList,
    });
    const res = {};
    res.activityName = item.activityName;
    res.list = re;
    res.configId = item.configId;
    res.activityType = item.activityType;
    res.itemIdList = itemIdList;
    res.activityRemark = item.activityRemark;
    otherList.push(res);
    otherList.sort((a, b) => a.configId - b.configId);
    this.setState({
      otherList,
    });
  }

  dateChange = (date, queryType) => {
    const { scheduType, scheduleIdList } = this.state;
    this.getSchedulList(scheduType, date, queryType, scheduleIdList);
  }

  seckillChange = (queryType) => {
    const { seckillType, seckillIdList } = this.state;
    this.getSeckillList(seckillType, queryType, seckillIdList);
  }

  // 限时秒杀数据
  getSeckillList = async (activityType, queryType = 1, activityIdList) => {
    const res = await Model.home.getActivityDetail({
      activityType,
      queryType,
      activityIdList,
    });
    if (res) {
      this.setState({
        // seckillList: res,
      });
    }
  }

  // 推客招募排期数据获取
  getSchedulList = async (activityType, date = {}, queryType = 1, activityIdList) => {
    const { beginTime, endTime } = getRangeTime(date);
    const res = await Model.home.getActivityDetail({
      activityType,
      beginTime,
      endTime,
      queryType,
      activityIdList,
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

  render() {
    const {
      // scheduleList,
      // scheduConfigId,
      // scheduType,
      // seckillList,
      // seckillEndTime,
      // seckillConfigId,
      // seckillType,
      otherList,
      topBanner,
      // marketBanner,
    } = this.state;
    return (
      <section>
        <Header />
        {/** Banner */}
        <Banner list={topBanner} />
        {/** 推客招募排期表 */}
        {/* <Schedule list={scheduleList} dateChange={this.dateChange} configId={scheduConfigId} activityType={scheduType} /> */}
        {/** 这里是一个营销BANNER */}
        {/* <Marketbanner list={marketBanner} /> */}
        {/** 限时秒杀 */}
        {/* <Seckill seckill={seckillList}
          endTime={seckillEndTime}
          seckillChange={this.seckillChange}
          configId={seckillConfigId}
          activityType={seckillType}
        /> */}
        {/** 微商采购中心 */}
        {
          otherList.map((item, i) => (
            <Purchase type="purchase"
              key={i}
              index={i}
              purchase={item.list}
              configId={item.configId}
              activityName={item.activityName}
              activityType={item.activityType}
              itemIdList={item.itemIdList}
              itemInfo={item}
            />
          ))
        }
        {/** 9元专区 */}
        {/* <Purchase type="prefecture" /> */}
        {/** 大牌制造直供 */}
        {/* <Purchase type="major" /> */}
        {/** 微商采购中心 */}
        <Footer />
      </section>
    );
  }
}

export default Index;
