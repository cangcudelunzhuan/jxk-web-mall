import React from 'react';
import Swiper from 'swiper';
import { Icon } from 'antd';
import styles from './index.module.styl';
import './swiper.styl';
import { getFileUrl } from '@/utils/index';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  initSwiper = () => {
    this.rightSwiper = new Swiper(`.${styles.swiper_contain}`, {
      // slidesPerView: 1,
      spaceBetween: 1,
      // slidesPerColumn: 2,
      direction: 'vertical',
      slidesPerView: 4,
      // delay: 2000, // 2秒切换一次
      // autoplay: true,
      // loop: true,
      autoplay: {
        delay: 2000,
      },
      loop: true,
      pagination: {
        el: `.${styles.swiper_pagination}`,
        clickable: true,
      },
      navigation: {
        nextEl: `.${styles.swiper_button_next}`,
        prevEl: `.${styles.swiper_button_prev}`,
      },
    });
  }

  goDetail = (id) => {
    // location.href = `//${location.host}/detail/0/${id}/-1`;
    window.open(`//${location.host}/detail/0/${id}/-1`);
  }


  componentDidMount() {
    // const swiperLIst = this.props.initSwiper();
    // this.setState({
    //   swiperLIst,
    // });
    // setTimeout(() => {
    //   this.initSwiper();
    // }, 100);
  }

  render() {
    const { swiperList } = this.props;
    this.initSwiper();
    return (
      <section className={styles.other_out}>
        <div style={{ marginBottom: '20px', fontSize: '12px' }}>供应商其他商品</div>
        <section className={`${styles.swiper_contain} `}>
          <div className="swiper-wrapper">
            {(swiperList || []).map((item, i) => {
              return (
                <figure className="swiper-slide" key={i} onClick={() => this.goDetail(item.itemId)}>
                  <img src={getFileUrl(item.mainImgUrl)} alt="" className={styles.swiper_big_img} />
                </figure>
              );
            })}
          </div>
          <div className={`${styles.swiper_pagination} swiper-pagination`}>1</div>
        </section>
        <div className={styles.navigation_box}>
          <div className={`${styles.swiper_button_prev}`}><Icon type="left" /></div>
          <div className={`${styles.swiper_button_next}`}><Icon type="right" /></div>
        </div>
      </section>
    );
  }
}

export default Index;
