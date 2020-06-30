import React from 'react';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import styles from './index.module.styl';
import Model from '@/model';
import Seckill from './components/seckill';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getAllActivityDetail = async ({ queryType = 2 }) => {
    const activityType = 2;
    const { configId } = this.props.match.params;
    const res = await Model.home.getAllActivityDetail({
      configId: configId - 0,
      activityType,
      queryType,
    });
    if (res) {
      this.setState({
        seckillList: res,
      });
    } else {
      this.setState({
        seckillList: [],
      });
    }
  }

  seckillChange = (queryType) => {
    this.getAllActivityDetail({ queryType });
  }

  componentDidMount() {
    this.getAllActivityDetail({});
  }


  render() {
    const { seckillList } = this.state;
    const { EndTime } = this.props.match.params;
    return (
      <section>
        <Header />
        <div className={styles.banner}>
          <h3>限时秒杀</h3>
          <div>
            精心挑选冰点价的源头厂货，超值精选爆款，大厂直供，天天平价！
          </div>
        </div>
        <Seckill seckill={seckillList}
          endTime={EndTime}
          seckillChange={this.seckillChange}
          activityType={2}
        />
        <Footer />
      </section>
    );
  }
}

export default Index;
