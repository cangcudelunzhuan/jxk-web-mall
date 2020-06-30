/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import { Link } from 'dva/router';
import {
  Row, Col,
  // Menu, Dropdown,
} from 'antd';
import { Icon } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import Logo from '@/assets/images/header/shouye_logo.png';
import Model from '@/model';
import styles from './index.module.styl';

@Events
class Header extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    this.state = {
      // 类目菜单
      category: [],
      // current: -1,
      dropMenuLeft: -2000,
      inputV: '',
      menuActive: '',
    };
    this.timer = null;
  }

  initValue = (v) => {
    this.setState({
      inputV: v,
    });
  }

  componentDidMount() {
    // if (this.props.location) {
    //   this.setState({
    //     inputV: this.props.location.state.value,
    //   });
    // }
    this.getCategory();
    this.setInputV();
  }

  getActiveMenu = (category) => {
    const { pathname } = location;
    if (pathname === '/') {
      this.setState({
        menuActive: 'index',
      });
    } else if (pathname.includes('/prodClass')) {
      const arr = pathname.split('/');
      const i = category.findIndex((r) => {
        return (r.categoryList.join()) === arr[4];
      });
      this.setState({
        menuActive: i,
      });
    }
  }

  setInputV = () => {
    const { pathname } = location;
    if (pathname.includes('/searchResult')) {
      const arr = pathname.split('/');
      const inputV = decodeURI(arr[5]);
      this.setState({
        inputV,
      });
    }
  }

  /**
   * 取类目数据
   */
  getCategory = async () => {
    const resModel = await Model.home.getCategory();
    if (resModel) {
      this.setState({ category: resModel });
      this.getActiveMenu(resModel);
    }
  }


  // onOverMenu = (e, record, index) => {
  //   clearTimeout(this.timer);
  //   const parentLeft = e.target.parentNode.offsetLeft;
  //   this.setState({ dropMenuLeft: parentLeft, current: index });
  // }

  onOutMenu = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ dropMenuLeft: -500 });
    }, 1000);
  }

  onOverMenuDrop = () => {
    clearTimeout(this.timer);
  }

  hoveMenu = (e) => {
    const left = e.target.offsetLeft;
    const w = e.target.offsetWidth;
    this.setState({
      dropMenuLeft: left + (w - 35) / 2,
    });
  }

  goSearch = () => {
    const { inputV } = this.state;
    const v = inputV.replace(/\s*/g, '');
    // this.emit('getSearchList', inputV);
    window.open(`//${location.host}/searchResult/1/0/1/${v === '' ? '维生素vc' : v}`);
    // location.href = `//${location.host}/searchResult/1/0/1/${v === '' ? '维生素vc' : v}`;
  }

  goUrl = (url) => {
    window.open(`//${location.host}${url}`);
  }

  changeClass = (type, v, idx = 'index') => {
    if ((type === 'index' || type === 1)) {
      this.setState({
        menuActive: idx,
      });
    }
    // else {
    //   this.setState({
    //     menuActive: '',
    //   });
    // }
    // if (type === 'index') {
    //   return;
    // }
    // this.emit('getClassList', type, v);
    // this.setState({
    //   dropMenuLeft: -2000,
    // });
  }

  getInputV = (v) => {
    const { value } = v.target;
    this.setState({
      inputV: value,
    });
  }

  onGotoLogin = () => {
    // location.href = `//${location.host.replace('www', 'b')}/home`;
    window.open(`//${location.host.replace('www', 'b')}/home`);
  }

  onKeyup = (e) => {
    if (e.keyCode === 13) {
      // if (this.props.location) {
      //   this.goSearch();
      // } else {
      //   document.getElementById('target').click();
      // }
      this.goSearch();
    }
  }


  goClass = (categoryList) => {
    location.href = `//${location.host}/prodClass/1/0/${categoryList}`;
  }

  render() {
    const { category, dropMenuLeft,
      // current,
      inputV, menuActive } = this.state;
    // const menu = (
    //   <Menu onClick={this.menuOnClick}>
    //     {category.slice(14).map((item) => (
    //       <Menu.Item key={item.pCatName.level}>
    //         {item.pCatName.catName}
    //       </Menu.Item>
    //     ))}
    //   </Menu>
    // );
    return (
      <section className={styles.header}>
        <div className={styles.header_content}>
          <Row align="middle" justify="center" type="flex">
            <Col span={7}>
              <div>
                <Link to="/" className={styles.logolink}>
                  <img src={Logo} alt="logo" />
                </Link>
              </div>
            </Col>
            <Col span={9}>
              <div className={styles.web_search_box}>
                <input type="text"
                  placeholder="维生素vc"
                  onBlur={this.getInputV}
                  onChange={this.getInputV}
                  onKeyUp={this.onKeyup}
                  value={
                    inputV
                  }
                />
                {/* <Link to={{ pathname: '/searchResult', state: { value: inputV || '维生素vc' } }} id="target"> */}
                <button type="button" onClick={this.goSearch}>搜好货</button>
                {/* </Link> */}
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.r_box}>
                {/* <Link to="/collection">我的收藏单</Link> */}
                <span onClick={() => this.goUrl('/collection')}>我的收藏单</span>
                <span className={styles.rl_box} onClick={() => this.goUrl('/purchase')}>
                  <Icon type="bianzu1" size="small" />
                  <span className="pl5">我的采购日历</span>
                </span>
                {/* <Link to="/purchase">
                  <Icon type="bianzu1" size="small" />
                  <span className="pl5">我的采购日历</span>
                </Link> */}
                <span type="danger" className={styles.goto_admin} onClick={this.onGotoLogin}>进入管理后台</span>
              </div>
            </Col>
          </Row>
          <div className={styles.menus}>
            <Link to="/" className={`${styles.menu_items}`}>
              <span onClick={() => this.changeClass('index')}
                onMouseOver={(e) => this.hoveMenu(e, 'index')}
                className={`${menuActive === 'index' ? styles.menu_active : null}`}
              >
                首页
              </span>
            </Link>
            {/* {
              category.slice(0, 14).map((item, idx) => (
                <Link key={idx} to={`/prodClass/1/${item.pCatName.level}`} className={`${styles.menu_items}`}>
                  <span
                    onMouseOver={(e) => this.onOverMenu(e, item, idx)}
                    onMouseOut={this.onOutMenu}
                    onClick={() => this.changeClass(1, item.pCatName.level, idx)}
                    className={`${menuActive === idx ? styles.menu_active : null}`}
                  >
                    {item.pCatName.catName}
                  </span>
                </Link>
              ))
            } */}
            {
              category.map((item, idx) => (
                <span
                  className={`${menuActive === idx ? styles.menu_active : null} ${styles.menu_items}`}
                  onClick={() => this.goClass(item.categoryList)}
                  onMouseOver={(e) => this.hoveMenu(e, idx)}
                >
                  {item.menu}
                </span>
              ))
            }
            {/* category.slice(10) */}
            {/* {category.length > 14 && (
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  更多
                  <Icon type="down" />
                </a>
              </Dropdown>
            )} */}
            <Icon type="lujing1" size="xxs" className={styles.first_menu} style={{ left: `${dropMenuLeft}px` }} />
          </div>
        </div>
        {/** 弹框显示子类目 */}
        {/* {
          <div
            className={`${ styles.drop_menu } animated ${ dropMenuLeft >= 0 ? 'fadeIn' : 'fadeOut'}`}
            style={{ left: dropMenuLeft }}
            onMouseOver={(e) => this.onOverMenuDrop(e)}
            onMouseOut={this.onOutMenu}
            >
            {
              category[current] && category[current].pSubcategoryList.map((item, index) => (
                <dl key={index}>

                  <dt>
                    <Link key={index} to={`/prodClass/2/${item.pCatName.level}`}>
                      <span className={styles.catalog_2items} onClick={() => this.changeClass(2, item.pCatName.level)}>
                        {item.pCatName.catName}
                      </span>
                    </Link>
                  </dt>
                  <dd>
                    {
                      Array.isArray(item.pSubcategoryList) && item.pSubcategoryList.map((v, i) => (
                        <Link key={i} to={`/prodClass/2/${v.level}`} className={styles.menu_items}>
                          <span key={i} className={styles.catalog_items} onClick={() => this.changeClass(2, v.level)}>{v.catName}</span>
                        </Link>

                      ))
                    }
                  </dd>
                </dl>
              ))
            }
          </div>
          } */}
      </section>
    );
  }
}

export default Header;
