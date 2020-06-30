import React from 'react';
import {
  Table,
  // InputNumber,
  message,
  Checkbox,
} from 'antd';
import { Common } from '@jxkang/utils';
import Header from '@/cmpt/header';
import Footer from '@/cmpt/footer';
import styles from './index.module.styl';
import Model from '@/model';
import { formatPoint, formatThousands } from '@/utils/filter';
import { getFileUrl } from '@/utils/index';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      checkedStatus: false,
      columns: [
        {
          title: '',
          dataIndex: 'mainImgUrl',
          render: (text) => <img src={getFileUrl(text)} alt="" width={90} height={90} />,
        },
        {
          title: '商品名称',
          dataIndex: 'itemTitle',
          // width: '450px',
          render: (text, record) => (
            <div className={styles.name_box}>
              <div>
                {text}
              </div>
              <div className={styles.props_box}>
                {(record.propsList || []).map((item) => <span>{item}</span>)}
              </div>
            </div>
          ),
        },
        {
          title: '数量',
          dataIndex: 'monthCount',
          width: '150px',
          render: () => (
            // <InputNumber
            //   min={1}
            //   max={999}
            //   formatter={(value) => `${value}`}
            //   parser={(value) => value.replace('.', '')}
            //   onChange={this.onChange}
            //   defaultValue={1}
            // />
            1
          ),
        },
        {
          title: '单价',
          dataIndex: 'scribingPrice',
          width: '150px',
          render: (text) => {
            return (
              <div className={styles.red}>
                {formatThousands(Common.money2fixed(text))}
                元
              </div>
            );
          },
        },
        {
          title: '优惠',
          width: '150px',
          dataIndex: 'activityType',
          render: (text) => (
            <>
              <span className={styles.hotTag}>
                {text === 0 && '云仓商品'}
                {text === 1 && '推客活动'}
                {text === 2 && '爆款活动'}
              </span>
            </>
          ),
        },
        {
          title: '金额(元)',
          dataIndex: 'vipTradePrice',
          width: '150px',
          render: (text, record) => (
            <div className={styles.price_box}>
              <div className={styles.red} style={{ marginBottom: '2px', fontWeight: 'bold' }}>
                {formatThousands(Common.money2fixed(text))}
                元
              </div>
              <div className={styles.green}>
                共省
                {formatThousands(formatPoint(record.scribingPrice - text))}
                元
              </div>
              {/* <div>
                <a href="" className={`${styles.red} ${styles.hasline}`}>升级超级卖家 </a>
                可省
                {formatPoint(record.scribingPrice - text)}
              </div> */}
            </div>
          ),
        },
      ],
      res: [],
    };
  }

  getList = async () => {
    const res = await Model.collection.listCollectInfo();
    if (res) {
      this.setState({
        res,
      });
    }
  }

  batchCancelCollect = async (collectIdList) => {
    const res = await Model.collection.batchCancelCollect({ collectIdList });
    if (res) {
      message.success(res);
      this.getList();
    }
  }

  selectAll = (v) => {
    const { checked } = v.target;
    const { res } = this.state;
    const selectedRowKeys = [];
    if (checked === true) {
      res.map((item) => selectedRowKeys.push(item.collectId));
    }
    this.setState({
      selectedRowKeys,
      checkedStatus: checked,
    });
  };

  goDetail = (record) => {
    window.open(`//${location.host}/detail/${record.activityType}/${record.itemId}/${record.activityId || -1}`);
    // this.props.history.push(`/detail/${record.activityType}/${record.itemId}/${record.activityId || -1}`);
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    const { columns, res, selectedRowKeys, checkedStatus } = this.state;
    const rowSelection = {
      onChange: (key) => {
        this.setState({
          selectedRowKeys: key,
          checkedStatus: res.length === key.length,
        });
      },
      getCheckboxProps: () => ({
        // disabled: record.key === '1', // Column configuration not to be checked
        // name: record.name,
      }),
      selectedRowKeys,
    };
    return (
      <section>
        <Header />
        <div className={styles.wrapper}>
          <h1 className={styles.title}>我的收藏单</h1>
          <div className={styles.table_box}>
            <Table columns={columns}
              rowKey="collectId"
              dataSource={res}
              pagination={false}
              rowSelection={rowSelection}
              onRow={(record) => {
                return {
                  onClick: () => this.goDetail(record), // 点击行

                };
              }}
            />
            <div className={styles.table_tool}>
              <Checkbox onChange={this.selectAll} checked={checkedStatus}><span style={{ marginLeft: '30px' }}>全选</span></Checkbox>
              {/* <span style={{ marginLeft: '20px' }}>删除</span> */}
              <div className={styles.right_box}>
                {/* 共计
                <span className={styles.red}>4</span>
                件
                <span className={styles.red}>9999.00</span>
                元 */}
                {
                  selectedRowKeys.length > 0
                    ? (<span className={styles.btn} onClick={() => this.batchCancelCollect(selectedRowKeys)}>删除</span>)
                    : (
                      <span className={styles.btn} style={{ background: '#dddddd', cursor: 'default' }}>删除</span>
                    )
                }
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>

    );
  }
}

export default Index;
