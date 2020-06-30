import React from 'react';
import { Pagination, Empty } from 'antd';
import Events from '@jxkang/events';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import styles from './index.module.styl';
// import Classes from './components/classes';
import Product from '@/components/product';
import Model from '@/model';

@Events
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // firstCategoryList: [],
      total: 0,
      pageNo: 1,
      // category1: '',
      // category2: '',
      categoryList: [],
      tabList: [
        {
          name: '云仓商品',
          type: 0,
        },
        {
          name: '活动商品',
          type: 2,
        },
        {
          name: '推客商品',
          type: 1,
        },
      ],
      queryType: 0,
      sortLIst: [
        {
          name: '价格排序',
          type: 1,
          sort: 1,
          active: true,
        },
        {
          name: '销量排序',
          type: 2,
          sort: 1,
          active: false,
        },
        {
          name: '时间排序',
          type: 3,
          sort: 1,
          active: false,
        },
      ],
      productList: [
      ],
    };
  }

  checkTab = (queryType) => {
    // this.setState({
    //   queryType: type,
    // });
    // this.getItemCategory({
    //   queryType: type,
    // });
    const { categoryList } = this.props.match.params;
    location.href = `//${location.host}/prodClass/1/${queryType}/${categoryList}`;
  }

  sort = (type, index) => {
    const { sortLIst } = this.state;
    sortLIst.map((item, i) => {
      item.active = false;
      if (i !== index) {
        item.sort = 1;
      }
      return sortLIst;
    });
    sortLIst[index].sort = (sortLIst[index].sort === 1) ? 2 : 1;
    sortLIst[index].active = true;
    this.setState({
      sortLIst,
    });
    this.getItemCategory({
      sortLIst,
    });
  }

  // changeClass = ({ category1, category2 }) => {
  //   this.setState({
  //     // category1, category2,
  //   });
  //   this.getItemCategory({
  //     category1, category2,
  //   });
  //   this.emit('setActive');
  // }

  getItemCategory = async ({
    queryType = 0,
    sortLIst = this.state.sortLIst,
    pageNo = 1, pageSize = 12,
    categoryList = this.state.categoryList,
    // category1 = this.state.category1,
    // category2 = this.state.category2,
  }) => {
    const i = sortLIst.findIndex((r) => r.active === true);
    const sort = sortLIst[i].sort;
    const sortType = sortLIst[i].type;
    const res = await Model.prodClass.getItemCategory({
      queryType,
      // category1,
      // category2,
      // activityStatus
      categoryList,
      sortType,
      sort,
      pageNo,
      pageSize,
    });
    if (res) {
      this.setState({
        total: res.total,
        pageNo: res.pageNum,
        productList: res.list || [],
      });
      if (res.list) {
        res.list.map((it, index) => this.getNum(it.activityId, index));
      }
    } else {
      this.setState({
        productList: [],
      });
    }
  }

  getNum = async (activityId, i) => {
    if (activityId) {
      const { productList } = this.state;
      const res = await Model.home.getRegisterActivityCount({ activityId });
      productList[i].num = res || 0;
      this.setState({
        productList,
      });
    }
  }

  firstCategory = async () => {
    const res = await Model.prodClass.firstCategory();
    if (res) {
      this.setState({
        // firstCategoryList: res,
      });
    }
  }

  pageChange = (pageNo) => {
    // this.getItemCategory({
    //   pageNo,
    // });
    const { categoryList, queryType } = this.props.match.params;
    location.href = `//${location.host}/prodClass/${pageNo}/${queryType}/${categoryList}`;
  }

  componentDidMount() {
    // this.firstCategory();
    const { categoryList, page, queryType } = this.props.match.params;
    const list = categoryList.split(',');
    this.setState({
      categoryList: list,
      queryType: Number(queryType),
    }, () => {
      this.getItemCategory({ categoryList: list, pageNo: page, queryType });
    });

    // const { type, level } = this.props.match.params;
    // this.setState({
    //   [`category${type}`]: level,
    // });
    // this.getItemCategory({ [`category${type}`]: level });
    // this.on('getClassList', (typeV, v) => {
    //   const notIndex = typeV === 1 ? 2 : 1;
    //   this.setState({
    //     [`category${typeV}`]: v,
    //     [`category${notIndex}`]: '',
    //   });
    //   this.getItemCategory({
    //     [`category${typeV}`]: v,
    //     [`category${notIndex}`]: '',
    //   });
    //   this.Classes.getDefault();
    // });
  }

  render() {
    const { tabList,
      // sortLIst,
      productList,
      // firstCategoryList,
      queryType, total, pageNo } = this.state;
    return (
      <section>
        <Header />
        <div className={styles.wrapper}>
          {/* 类目 */}
          {/* <Classes list={firstCategoryList} changeClass={this.changeClass} onRef={(r) => this.Classes = r} /> */}
          {/* 商品分类 */}
          <div className={styles.tab_box}>
            {
              tabList.map((item) => (
                <span
                  onClick={() => this.checkTab(item.type)}
                  className={`${queryType === item.type ? styles.active : null}`}
                  key={item.type}
                >
                  {item.name}
                </span>
              )
              )
            }
          </div>
          {/* 排序栏 1降序 2升序 默认降序 */}
          {/* <section className={styles.sort_box}>
            {sortLIst.map((item, index) => (
              <span key={index}
                onClick={() => this.sort(item.type, index)}
                className={`
                ${item.sort === 2 && item.active === true ? styles.activeUp : null}
                ${item.sort === 1 && item.active === true ? styles.activeDown : null}
                ${styles.sort_item}
                `}
              >
                {item.name}
              </span>
            )
            )}
          </section> */}
        </div>
        {/* 商品列表 */}
        {productList && productList.length > 0 && (
          <section>
            <div className={styles.product_box}>
              {productList.map(
                (item) => <Product key={item.id} item={item} type={queryType} />
              )}
            </div>
            <Pagination size="small" total={total} pageSize={12} onChange={this.pageChange} current={pageNo} />
          </section>
        )}
        {productList && productList.length <= 0 && (
          <Empty description="暂无数据" />
        )}
        <Footer />
      </section>

    );
  }
}

export default Index;
