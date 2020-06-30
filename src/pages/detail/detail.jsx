import React from 'react';
import { Tabs, Button } from 'antd';
// import { PreviewImage } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import { Common } from '@jxkang/utils';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import sucai from '@/assets/images/detail/sucai.png';
import Model from '@/model';
import { getFileUrl, getPathName } from '@/utils/index';
import Config from '@/config';
import { downloadFileUrl } from '@/utils';
import OtherProd from './components/otherProd';
import ProdInfo from './components/prodInfo';
import SwiperDetail from './components/swiperDetail';
import styles from './index.module.styl';
// import {
//   setSort,
// } from '@/utils/uploadImgConfig';

const { TabPane } = Tabs;
@Events
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: {},
      otherList: [
      ],
      hotLIst: [
      ],
    };
  }

  getItemDetail = async () => {
    const {
      activityType,
      itemId,
      activityId,
    } = this.props.match.params;
    const res = await Model.detail.getItemDetail({
      activityType,
      itemId,
      activityId,
    });
    if (res) {
      // res.noArea = [
      //   {
      //     areaCode: '620000',
      //     areaName: '甘肃省',
      //     level: 0,
      //     childs: [
      //       {
      //         areaCode: '620001',
      //         areaName: '兰州市',
      //         level: 1,
      //         childs: [
      //           { areaCode: '620105', areaName: '安宁区', level: 2, childs: null },
      //           { areaCode: '620111', areaName: '红古区', level: 2, childs: null },
      //         ],
      //       },
      //       {
      //         areaCode: '620100',
      //         areaName: '1兰州市',
      //         level: 1,
      //         childs: [
      //           { areaCode: '620105', areaName: '1安宁区', level: 2, childs: null },
      //           { areaCode: '620111', areaName: '1红古区', level: 2, childs: null },
      //         ],
      //       },

      //     ],
      //   },
      // ];
      this.setState({
        res,
      });
      if ((!res.propsList || res.propsList.length === 0) && res.skuInfo.length === 1 && res.skuInfo[0].stockQty > 0) {
        this.emit('setSkuIndex', 0);
      }
      const supplierId = res.supplierId;
      this.getSupplierHot({ supplierId });
      this.getSupplierNew({ supplierId });
    }
  }

  getSupplierHot = async ({ supplierId }) => {
    const res = await Model.detail.getSupplierHot({ supplierId });
    if (res) {
      this.setState({
        hotLIst: res,
      });
    }
  }

  getSupplierNew = async ({ supplierId }) => {
    const res = await Model.detail.getSupplierNew({ supplierId });
    if (res) {
      this.setState({
        otherList: res,
      });
    }
  }

  down = (arr = [], type = 'sucai') => {
    const { itemId } = this.props.match.params;
    arr.map((item, i) => {
      const it = typeof (item) === 'string' ? item : item.photo;
      if (type === 'sucai') {
        Common.winOpen({
          url: downloadFileUrl(it),
          target: 'ifm',

        });
      } else {
        Common.winOpen({
          url: `${Config.dowmImgUrl}/${itemId}_${type}${i + 1}.${it.split('.').pop()}`,
          type: 'post',
          target: 'ifm',
          params: {
            ossUri: getPathName(it.split('?')[0]),
            host: Config.imgHost,
          },

        });
      }
      return '';
    });
  }

  goDetail = (id) => {
    location.href = `//${location.host}/detail/0/${id}/-1`;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getItemDetail();
    this.on('getNewDetail', () => {
      this.getItemDetail();
    });
  }

  render() {
    const { otherList, hotLIst, res } = this.state;
    const { itemId } = this.props.match.params;
    return (
      <section>
        <Header />
        <section className={styles.out_box}>
          <div className={styles.wrapper}>
            <div className={styles.title_box}>
              <div className={styles.title_left}>
                <h3>{res.itemTitle}</h3>
                <span className={styles.tag}>一件代发</span>
              </div>
              <div className={styles.title_right}>
                本产品支持七天无理由退货
                <span>举报</span>
              </div>
            </div>
            <section className={styles.detail_out_box}>
              <div className={styles.swiper_box}>
                {/* 左 */}
                <div className={styles.sweiper_inner_box}>
                  {res.photo11 && res.photo11.length > 0 && <SwiperDetail swiperList={res.photo11} name="1-1" itemId={itemId} />}
                  {res.photo169 && res.photo169.length > 0 && <SwiperDetail swiperList={res.photo169} name="3-2" itemId={itemId} />}
                  {res.photo32 && res.photo32.length > 0 && <SwiperDetail swiperList={res.photo32} name="16-9" itemId={itemId} />}
                  {/* 下载商详 */}
                  {
                    ((res.detailImgsMd5 && res.detailImgsMd5.length > 0) || (res.mobileDetailImgsMd5 && res.mobileDetailImgsMd5.length > 0))
                    && (
                      <section className={styles.down_button_box}
                        onClick={() => this.down([...(res.detailImgsMd5 || []), ...(res.mobileDetailImgsMd5 || [])], 'detail')}
                      >
                        <Button type="primary" icon="download" size="large">下载商品详情素材</Button>
                      </section>
                    )
                  }
                  {/* 下载素材 */}
                  {res.sourceMaterial && res.sourceMaterial.length > 0 && (
                    <section onClick={() => this.down(res.sourceMaterial)}>
                      <img src={sucai} alt="" width="380" style={{ marginBottom: '10px', cursor: 'pointer' }} />
                    </section>
                  )}
                  {/* 热销活动 */}
                  {hotLIst && hotLIst.length > 0 && (
                    <div className={styles.hot_box}>
                      <div className={styles.title}>热销商品</div>
                      {hotLIst.map((item, i) => {
                        return (
                          <section className={styles.hot_item} key={i} onClick={() => this.goDetail(item.itemId)}>
                            <img src={getFileUrl(item.mainImgUrl)} alt="" className={styles.hot_item_img} />
                            <div className={styles.hot_bottom}>
                              <span className={styles.red}>
                                ￥
                                {item.vipTradePrice}
                              </span>
                              {/* <span>
                                30天内
                                <i className={styles.red}>
                                  {' '}
                                  {item.monthCount}
                                  {' '}
                                </i>
                                件成交
                              </span> */}
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* 右 */}
                <div className={styles.product_box}>

                  <section className={styles.props_box}>
                    <div className={styles.top_left}>
                      {/* 商品规格及按钮 */}
                      <ProdInfo res={res} />
                    </div>
                    {/* 供应商其他商品 */}
                    <div className={styles.top_right}>
                      <OtherProd swiperList={otherList} {...this.props} />
                    </div>
                  </section>
                  {/* 详情图 */}
                  <section className={styles.detail_box}>
                    <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                      <TabPane tab="商品详情" key="1" style={{ padding: '10px 0' }}>
                        {
                          (res.detailImgsMd5 || []).map((item) => {
                            return <img src={getFileUrl(typeof (item) === 'string' ? item : item.photo)} alt="" width="100%" />;
                          }
                          )
                        }
                      </TabPane>
                      <TabPane tab="移动端详情" key="2" style={{ padding: '20px' }}>
                        {
                          (res.mobileDetailImgsMd5 || []).map((item) => <img src={getFileUrl(typeof (item) === 'string' ? item : item.photo)} alt="" width="100%" />)
                        }
                      </TabPane>
                    </Tabs>

                  </section>
                </div>
              </div>
            </section>
          </div>
        </section>
        <Footer />
      </section>

    );
  }
}

export default Index;
