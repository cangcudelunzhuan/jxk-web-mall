import React, { Component } from 'react';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import Introduce from '@/cmpt/introduce';
// import styles from './index.module.styl';
import Model from '@/model';
import Purchase from './components/purchase';

class Subject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchase: [],
    };
  }

  getAllActivityDetail = async () => {
    // const activityType = 2;
    const { configId, activityType } = this.props.match.params;
    const { itemIdList } = this.props.location.state;
    const res = await Model.home.getAllActivityDetail({
      configId: configId - 0,
      activityType,
      itemIdList,
    });
    if (res) {
      this.setState({
        purchase: res,
      });
    } else {
      this.setState({
        purchase: [],
      });
    }
  }

  componentDidMount() {
    this.getAllActivityDetail();
  }

  render() {
    const style = {
      textAlign: 'center',
    };
    const { purchase } = this.state;
    const { activityType } = this.props.match.params;
    return (
      <section>
        <Header />
        <Introduce title="精选爆款" desc="精心挑选冰点价的源头厂货，超值精选爆款，大厂直供，天天平价！" style={style} />
        <Purchase type="purchase"
          purchase={purchase}
          activityType={activityType}
        />
        <Footer />
      </section>
    );
  }
}

export default Subject;
