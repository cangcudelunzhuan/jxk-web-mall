import React from 'react';
import {
  Form, Radio, InputNumber, Modal, DatePicker, Input, Row,
  Icon,
  message,
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { SelectCity } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import { Common } from '@jxkang/utils';
import regExp from '@/utils/regExp';
import { renderFieldAllLine, formItemLayout } from '@/utils/formConfig.js';
import { formatPoint, formatThousands } from '@/utils/filter';
import shouqin from '@/assets/images/detail/shouqin.png';
import { isBuy } from '@/utils/getTime';
import 'moment/locale/zh-cn';
import Model from '@/model';
import PusherInfo from '../pusherInfo';
import HotActprice from '../hotActPrice';
import Solderprice from '../solderPrice';
import styles from './index.module.styl';

const { TextArea } = Input;
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
@Form.create()
@Events
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dateVisible: false,
      visibleSign: false,
      skuOption: [],
      skuindex: -1,
      buyNum: 0,
      date: [],
      stepPrice: null,
    };
  }

  onChangeSize = (v, label) => {
    const { skuOption } = this.state;
    const { res } = this.props;
    const { value } = v.target;
    const skuInfo = res.skuInfo;
    const option = { label, value };
    const i = skuOption.findIndex((r) => r.label === label);
    if (i >= 0) {
      skuOption[i].value = option.value;
    } else {
      skuOption.push(option);
    }
    const resArr = [];
    skuOption.map((item) => resArr.push(`${item.label}:${item.value}`));
    const skuindex = skuInfo.findIndex((r) => {
      return r.propsValueList.sort().toString() === resArr.sort().toString();
    });
    if (skuindex >= 0) {
      this.setState({
        skuindex,
        buyNum: skuInfo[skuindex].stockQty > 0 ? 1 : 0,
      });
      if (res.activityType === 1) {
        this.emit('getStepInfo', skuInfo[skuindex]);
      }
    } else {
      this.setState({
        skuindex: -1,
        buyNum: 0,
      });
    }
  }

  insertPlan = async () => {
    const { date } = this.state;
    const d0 = moment(date[0]);
    const d1 = moment(date[1]);
    const diff = d1.diff(moment(d0), 'day');
    if (date.length <= 0) {
      message.error('请选择日期');
      return;
    } if (diff > 30) {
      message.error('时间间隔不可超过30天');
      this.setState({
        date: [],
      });
      return;
    }
    const beginTime = date[0];
    const endTime = date[1];
    const {
      skuId, itemId, activityInfo, activityType,
      scribingPrice,
      retailPrice,
      tradePrice, vipTradePrice, itemTitle,
      mainImgUrl,
    } = this.props.res;
    let activityId; let activityBeginTime; let activityEndTime; let sellBegin; let sellEnd; let
      stepPrice; let otherReward; let leastNumber;
    if (activityInfo) {
      activityId = activityInfo[0].activityId;
      activityBeginTime = activityInfo[0].recruitTimeBegin;
      activityEndTime = activityInfo[0].recruitTimeEnd;
      sellBegin = activityInfo[0].timeBegin;
      sellEnd = activityInfo[0].timeEnd;
      stepPrice = activityInfo[0].stepPrice;
      otherReward = activityInfo[0].otherReward;
      leastNumber = activityInfo[0].leastNumber;
    }
    const res = await Model.detail.insertPlan({
      // userId,
      beginTime,
      endTime,
      itemId,
      skuId,
      activityId,
      activityType,
      activityBeginTime,
      activityEndTime,
      sellBegin,
      sellEnd,
      scribingPrice,
      retailPrice,
      tradePrice,
      vipTradePrice,
      stepPrice,
      itemTitle,
      mainImgUrl,
      leastNumber,
      otherReward,
    });
    if (res) {
      this.setState({
        visible: false,
      });
      setTimeout(() => {
        this.setState({
          dateVisible: true,
        });
      }, 300);
      message.success(res);
    }
  }

  okInsertPlan = () => {
    this.insertPlan();
  }

  openTime = () => {
    this.setState({
      visible: true,
    });
    setTimeout(() => {
      this.setState({
        dateVisible: true,
      });
    }, 300);
  }

  closeModal = () => {
    this.setState({
      dateVisible: false,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
      });
    }, 50);
  }

  openSignModal = () => {
    this.setState({
      visibleSign: true,
    });
  }

  closeSignModal = () => {
    this.setState({
      visibleSign: false,
    });
  }

  onChangeNum = (v) => {
    // const value = v;
    const { value } = v.target;
    if (value) {
      this.setState({
        buyNum: value,
      });
    } else {
      this.setState({
        buyNum: 0,
      });
    }
  }

  getAreaAll = ({ noArea = [] }) => {
    let str = '';
    noArea.map((item, i) => {
      str += `${i !== 0 ? '、' : ''}${item.areaName}`;
      if (item.childs) {
        str += `${item.level === 0 ? ':' : ''} ${item.level === 1 ? '(' : ''}  ${this.getAreaAll({ noArea: item.childs })} ${item.level === 1 ? ')' : ''}`;
      }
      return str;
    });
    return str;
  }

  getnoAreaCode = (arr) => {
    let list = [];
    arr.map((item) => {
      if (item.childs && item.childs.length > 0) {
        list = [...list, ...this.getnoAreaCode(item.childs)];
      } else {
        list.push(item.areaCode);
      }
      return list;
    });
    return Array.from(new Set(list));
  }

  setSignModal = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { res } = this.props;
        const noArea = res.noArea || [];
        const arr = this.getnoAreaCode(noArea);
        const { area } = values;
        if (arr.indexOf(`${area.regionId}`) !== -1 || arr.indexOf(`${area.provinceId}`) !== -1 || arr.indexOf(`${area.cityId}`) !== -1) {
          message.error('所选地区不支持发货');
          return;
        }
        this.placeOrder({ ...values, ...values.area });
      }
    });
  }

  placeOrder = async ({
    receiveName, receivePhone,
    provinceCode, cityCode,
    regionCode,
    address,
  }) => {
    const { buyNum, skuindex } = this.state;
    const { itemId, activityInfo, activityType, supplierId, skuInfo } = this.props.res;
    const activityId = activityInfo ? activityInfo[0].activityId : '';
    const res = await Model.detail.placeOrder({
      itemId,
      skuId: skuInfo[skuindex].skuId,
      receiveName,
      receivePhone,
      provinceCode,
      cityCode,
      regionCode,
      address,
      activityId,
      activityType,
      count: buyNum,
      supplierId,
      innerSkuId: skuInfo[skuindex].innerSkuId,
    });
    if (res) {
      this.setState({
        visibleSign: false,
      });
      Modal.confirm({
        title: '下单成功',
        content: '下单成功,已生成支付订单,待支付订单值保留24小时,请尽快支付。支付需要在右上角跳转【进入管理后台】-【订单列表】中支付。',
        okText: '立即跳转去支付',
        cancelText: '继续浏览商品',
        icon: <Icon type="check-circle" twoToneColor="#52c41a" theme="twoTone" />,
        // iconType: 'check-circle',
        centered: true,
        width: 500,
        onOk: () => this.goOrder(res),
      });
      this.emit('getNewDetail');
    }
  }

  goOrder = (res) => {
    location.href = `//${location.host.replace('www', 'b')}/order/detail/${res}?pay=1`;
  }

  registerActivity = async (activityId) => {
    const res = await Model.home.registerActivity({ activityId });
    if (res) {
      message.success('报名成功');
    }
  }

  addOrCancelCollect = async (activityType, activityId, itemId, skuId, collect = true) => {
    const res = await Model.home.addOrCancelCollect({ activityType, activityId, itemId, skuId, collect });
    if (res) {
      message.success(res);
    }
  }

  dateOnChange = (m, d) => {
    this.setState({
      date: d,
    });
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return null;
  };

  getCity = (data) => {
    this.props.form.setFieldsValue({
      area: {
        provinceCode: data[0].areaName,
        cityCode: data[1].areaName,
        regionCode: data[2].areaName,
        provinceId: data[0].areaCode,
        cityId: data[1].areaCode,
        regionId: data[2].areaCode,
      },
    });
  }

  componentDidMount() {
    this.on('setSkuPrice', (price) => {
      this.setState({
        stepPrice: price,
      });
    });
    this.on('setSkuIndex', (index) => {
      this.setState({
        skuindex: index,
        buyNum: 1,

      });
    });
  }

  render() {
    const { visible, dateVisible, visibleSign, skuindex, buyNum, stepPrice } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { res } = this.props;
    const activityType = res.activityType;
    const totalNum = (arr) => {
      if (!arr) {
        return;
      }
      let num = 0;
      (arr || []).map((item) => {
        num += Number(item.stockQty);
        return '';
      });
      return num;
    };
    const isCanBuy = (Num) => {
      return Num > 0 ? (
        <span className={`${styles.button_item}`} onClick={this.openSignModal}>
          立即下单
        </span>
      )
        : (
          <span className={`${styles.button_item} ${styles.disable_item}`}>{skuindex >= 0 ? '暂无库存' : '选择规格立即下单'}</span>
        );
    };
    const isIntime = (dateBegin, dateEnd, dateNow, Num) => {
      if (isBuy({ dateBegin, dateEnd, dateNow }).status === true) {
        return isCanBuy(Num);
      }
      return (
        <span className={`${styles.button_item} ${styles.disable_item}`}>立即下单</span>
      );
    };
    const isCanSign = (dateBegin, dateEnd, dateNow, activityId, timeBegin, timeEnd, Num) => {
      const canSign = isBuy({ dateBegin, dateEnd, dateNow });
      const canBuy = isBuy({ dateBegin: timeBegin, dateEnd: timeEnd, dateNow });
      if (canSign.status === true) {
        return (
          <span className={`${styles.button_item} `} onClick={() => this.registerActivity(activityId)}>
            立即报名
          </span>
        );
      }
      if (canSign.type === 1 && canBuy.type === -1) {
        return (
          <span className={`${styles.button_item} ${styles.disable_item}`}>
            报名已结束，等待开售
          </span>
        );
      }
      if (canSign.type === -1) {
        return (
          <span className={`${styles.button_item} ${styles.disable_item}`}>
            报名尚未开始
          </span>
        );
      }
      if (canBuy.status === true) { // 购买中
        return isIntime(timeBegin, timeEnd, dateNow, Num);
      }
    };
    return (
      <>
        {/* 爆款活动显示 */}
        {/* 无活动显示 */}
        {/* res.activityType 0:无活动 1:推客 有倒计时 2:活动 有倒计时 */}
        {
          res.activityType === 0
            ? (<Solderprice res={res} skuindex={skuindex} />) : (<HotActprice res={res} skuindex={skuindex} />)
        }
        <div className={styles.propose_price}>
          <span>
            <label>建议零售价</label>
            ¥
            {skuindex >= 0 ? formatThousands(Common.money2fixed(res.skuInfo[skuindex].retailPrice)) : formatThousands(Common.money2fixed(res.retailPrice))}
          </span>
          <span>
            <label>市场价</label>
            <i style={{ textDecoration: 'line-through' }}>
              ¥
              {skuindex >= 0 ? formatThousands(Common.money2fixed(res.skuInfo[skuindex].scribingPrice)) : formatThousands(Common.money2fixed(res.scribingPrice))}
            </i>
          </span>
        </div>
        <section className={styles.pro_mes_box}>
          <div className={styles.pro_mes}>
            <span className={styles.name}>商品分类</span>
            <span>{`${res.firstCatName}  ${res.secondCatName ? `>${res.secondCatName}` : ''} ${res.catName ? `>${res.catName}` : ''}`}</span>
          </div>
          <div className={styles.pro_mes}>
            <span className={styles.name}>商品描述</span>
            <div className={styles.info}>
              {res.itemDescription}
            </div>
          </div>
        </section>
        <section className={`${styles.pro_mes_box} ${styles.pro_server_box}`}>
          {/* <div className={styles.pro_mes}>
            <span className={styles.name}>成交</span>
            <span>
              30天内
              <i className={styles.red}>
                {' '}
                {res.monthCount}
                {' '}
              </i>
              件成交
            </span>
          </div> */}
          {(res.itemTagList || []).map((item) => (
            <div className={styles.pro_mes}>
              <span className={styles.name}>{item.groupName}</span>
              <span>
                {(item.tagList || []).map((it) => <i className={`${styles.tag} ${styles.red}`}>{it}</i>)}
              </span>
            </div>
          )
          )}
        </section>
        <section className={`${styles.pro_mes_box} ${styles.pro_server_box} ${styles.pro_size_box}`}>
          {totalNum(res.skuInfo) === 0 && <img src={shouqin} className={styles.has_no} alt="has_no" />}
          {
            (res.propsList || []).map((item) => (
              <div className={styles.pro_mes}>
                <span className={styles.name}>{item.typeName}</span>
                <span className={`${styles.product_radio} ${totalNum(res.skuInfo) === 0 && styles.disabled}`}>
                  <Radio.Group onChange={(e) => totalNum(res.skuInfo) !== 0 && this.onChangeSize(e, item.typeName)}>
                    {
                      (item.typeList || []).map((it) => (
                        <Radio value={it}>
                          <div className={styles.item}>{it}</div>
                        </Radio>
                      )
                      )
                    }
                  </Radio.Group>
                </span>

              </div>
            )
            )
          }
          <div className={styles.pro_mes}>
            <span className={styles.name}>数量</span>
            <span className={styles.product_radio}>
              {skuindex >= 0 ? `${(res.skuInfo[skuindex]).stockQty}可售` : '有库存'}
              <InputNumber
                style={{ marginLeft: '20px' }}
                min={0}
                max={skuindex >= 0 ? (res.skuInfo[skuindex]).stockQty : 0}
                formatter={(value) => `${value}`}
                parser={(value) => value.replace('.', '')}
                onBlur={(e) => this.onChangeNum(e)}
                disabled={totalNum(res.skuInfo) === 0}
                // onChange={(e) => this.onChangeNum(e)}
                value={buyNum}
              />
            </span>
          </div>
        </section>
        {activityType === 1 && res.activityInfo && <PusherInfo activityInfo={res.activityInfo} activityId={res.activityInfo[0].activityId} />}
        {buyNum > 0 && (
          <section className={`${styles.pro_mes_box}`} style={{ marginTop: '20px' }}>
            <div className={styles.pro_mes}>
              <span className={styles.name}>共计</span>
              <span>
                <i className={`${styles.red} ${styles.total_font}`}>
                  {buyNum}
                  件
                </i>
                <i className={`${styles.red} ${styles.total_font}`}>
                  {skuindex >= 0 ? formatThousands(formatPoint((stepPrice || Common.money2fixed(res.skuInfo[skuindex].vipTradePrice)) * buyNum)) : formatThousands(res.vipTradePrice)}
                  元
                </i>
              </span>
            </div>
          </section>
        )}
        {res.noArea && res.noArea.length > 0
          && (
            <div className={styles.noArea_box}>
              {res.noArea.map((item) => (
                <div className={styles.item}>
                  <span className={styles.title}>
                    {item.areaName}
                    <span className={styles.mes}>
                      {
                        item.childs && (
                          this.getAreaAll({ noArea: item.childs })
                        )
                      }
                    </span>
                  </span>
                </div>
              )
              )}
              地区不发货
            </div>
          )}
        <div className={styles.bottom_button_box}>
          <span className={`${styles.button_item}`} onClick={this.openTime}>
            加入销售排期
          </span>
          <span className={`${styles.button_item}`}
            onClick={() => this.addOrCancelCollect(
              activityType,
              res.activityInfo ? res.activityInfo[0].activityId : '',
              res.activityInfo ? res.activityInfo[0].itemId : res.itemId,
              res.skuId)}
          >
            加入收藏夹
          </span>
          {/* 0为无活动 一直显示下单 1推客 时间范围内报名 时间范围内下单  2活动商品 在销售时间范围内显示下单 */}
          {totalNum(res.skuInfo) === 0
            ? (
              <>
                <span className={`${styles.button_item} ${styles.disable_item}`}>商品已售罄</span>
              </>
            ) : (
              <>
                {activityType === 0 ? (
                  isCanBuy(buyNum))
                  : (null)}
                {activityType === 2
                  ? (
                    isIntime(res.activityInfo[0].timeBegin, res.activityInfo[0].timeEnd, res.nowDate, buyNum)
                    // isIntime('2020/02/11 12:41:20', res.activityInfo[0].timeEnd, res.nowDate, buyNum)
                  ) : (null)}
                {(activityType === 1)
                  ? (
                    isCanSign(
                      res.activityInfo[0].recruitTimeBegin,
                      res.activityInfo[0].recruitTimeEnd,
                      res.nowDate,
                      res.activityInfo[0].activityId,
                      res.activityInfo[0].timeBegin,
                      res.activityInfo[0].timeEnd, buyNum
                    )
                  ) : (null)}
              </>
            )}

          {/* {(activityType === 1)
            ? (
              isIntime(res.activityInfo[0].timeBegin, res.activityInfo[0].timeEnd, res.nowDate, buyNum)
            ) : (null)} */}
          <Modal
            title="加入我的采购日历"
            visible={visible}
            onOk={this.okInsertPlan}
            width="600px"
            onCancel={this.closeModal}
            okText="确认"
            cancelText="取消"
          >
            <div className={styles.date_box}>
              <RangePicker onChange={this.dateOnChange}
                locale={locale}
                open={dateVisible && visible}
              />
            </div>

          </Modal>
          <Modal
            title="填写收货人信息"
            visible={visibleSign}
            onOk={this.setSignModal}
            width="700px"
            onCancel={this.closeSignModal}
            okText="确认"
            cancelText="取消"
          >
            <Form {...formItemLayout}>
              <Row gutter={8}>
                {renderFieldAllLine(getFieldDecorator, '收货人姓名', 'receiveName',
                  <Input />,
                  {
                    rules: [
                      { required: true, message: '必填' },
                    ],
                  }
                )}
                {renderFieldAllLine(getFieldDecorator, '收货人号码', 'receivePhone',
                  <Input />,
                  {
                    rules: [
                      { required: true, ...regExp.Phone },
                    ],
                  }
                )}
                {renderFieldAllLine(getFieldDecorator, '所在区域', 'area',
                  <SelectCity
                    onOk={this.getCity}
                    className={styles.city_box}
                    url={Model.detail.getAreaList}
                  />,
                  {
                    rules: [
                      { required: true, message: '请选择合法的省市区信息' },
                    ],
                    getValueFromEvent: this.normFile,
                  }
                )}
                {renderFieldAllLine(getFieldDecorator, '详细地址', 'address',
                  <TextArea rows={4} />,
                  {
                    rules: [
                      { required: true, message: '必填' },
                    ],
                  }
                )}
              </Row>
            </Form>
          </Modal>
        </div>
      </>
    );
  }
}

export default Index;
