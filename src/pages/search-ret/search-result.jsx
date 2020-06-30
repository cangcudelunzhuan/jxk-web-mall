import React from 'react';
import Events from '@jxkang/events';
import { Pagination, Empty } from 'antd';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import styles from './index.module.styl';
import Model from '@/model';
// import Product from './components/product';
import Product from '@/components/product';

@Events
class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labelList: [],
      labelType: 1,
      total: 0,
      pageNo: 1,
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
      key: '',
    };
  }

  searchAction = async ({
    pageNo = 1, pageSize = 12,
    itemName = this.state.key,
    sortLIst = this.state.sortLIst,
    queryType = 0,
    labelType = this.state.labelType,
  }) => {
    this.setState({
      productList: [],
    });
    const i = sortLIst.findIndex((r) => r.active === true);
    const sort = sortLIst[i].sort;
    const sortType = sortLIst[i].type;
    const res = await Model.search.searchList({
      queryType,
      // activityStatus,
      sortType,
      sort,
      itemName,
      pageNo,
      pageSize,
      labelType,
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

  checkTab = (queryType) => {
    // this.setState({
    //   queryType: type,
    // });
    // this.searchAction({
    //   queryType: type,
    //   pageNo: 1,
    // });
    const { key, labelType } = this.props.match.params;
    location.href = `//${location.host}/searchResult/1/${queryType}/${labelType}/${key}`;
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
    this.searchAction({
      sortLIst,
      pageNo: 1,
    });
  }

  pageChange = (pageNo) => {
    // this.searchAction({
    //   pageNo,
    // });
    const { queryType, key, labelType } = this.props.match.params;
    location.href = `//${location.host}/searchResult/${pageNo}/${queryType}/${labelType}/${key}`;
  }

  getLabel = async () => {
    const res = await Model.search.getLabel();
    if (res) {
      this.setState({
        labelList: res,
      });
    }
  }

  checkLabel = (labelType, itemName) => {
    location.href = `//${location.host}/searchResult/1/0/${labelType}/${itemName}`;
  }

  componentDidMount() {
    const { key, labelType, page, queryType } = this.props.match.params;
    this.searchAction({ itemName: key, labelType, pageNo: page, queryType });
    this.setState({
      key,
      labelType,
      queryType: Number(queryType),
    }, () => {
      this.getLabel();
    });
  }

  render() {
    const { tabList,
      // sortLIst,

      productList, total, queryType, pageNo, labelList } = this.state;
    const {
      key,
      labelType,
    } = this.props.match.params;
    return (
      <section>
        <Header {...this.props} onRef={(r) => this.header = r} />
        {/** 搜索标签 */}
        <section className={styles.search_label_container}>
          <section className={styles.content}>
            {
              (labelList || []).map((item, index) => (
                <>
                  <div className={styles.label_htitle}><em>{item.labelName}</em></div>
                  <div className={styles.plat_label_info}>
                    {
                      (item.label || []).map((label, i) => (
                        <label key={i}
                          className={`${styles.label} ${(label === key && Number(labelType) === Number(item.labelType)) ? styles.active : null}`}
                          onClick={() => this.checkLabel(item.labelType, label, index, i)}
                        >
                          {label}
                        </label>
                      )
                      )
                    }
                  </div>
                </>
              )
              )
            }
          </section>
        </section>
        <div className={styles.wrapper}>
          {/* 商品分类 */}
          <div className={styles.tab_box}>
            {
              (tabList || []).map((item) => (
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
            {(sortLIst || []).map((item, index) => (
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
        {productList && productList.length > 0 && (
          <section>
            <div className={styles.product_box}>
              {productList.map(
                (item, i) => <Product key={i} item={item} type={queryType} />
              )}
            </div>
            <Pagination size="small" total={total} pageSize={12} onChange={this.pageChange} current={pageNo} />
          </section>
        )}
        {(!productList || productList.length <= 0) && (
          <Empty description="暂无数据" />
        )}
        <Footer />
      </section>
    );
  }
}

export default SearchResult;
