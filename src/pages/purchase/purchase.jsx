import React, { Component } from 'react';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import Introduce from '@/cmpt/introduce';
import Schedule from './components/schedule';
// import Model from '@/model';
class Purchase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <section>
        <Header />
        <Introduce title="我的采购日历" desc="精心挑选冰点价的源头厂货，超值精选爆款，大厂直供，天天平价！" />
        <Schedule />
        <Footer />
      </section>
    );
  }
}

export default Purchase;
