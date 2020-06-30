// 首页 banner
import React from 'react';
import Swiper from 'swiper';
// import Model from '@/model';
// import { Link } from 'dva/router';
import './swiper.styl';
import styles from './index.module.styl';
import { getFileUrl } from '@/utils/index';

class Banner extends React.Component {
  componentDidMount() {
  }

  initSwiper = () => {
    this.swiper = new Swiper(`.${styles.header_banner}`, {
      direction: 'vertical',
      autoplay: {
        delay: 7000,
      },
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true,
      // },
    });
    // setTimeout(() => {
    //   this.swiper.slideTo(1);
    // }, 2000);
  }

  goUrl = (url) => {
    location.href = url.includes('//') ? url : `//${location.host}${url}`;
  }

  render() {
    const { list } = this.props;
    this.initSwiper();
    return (
      <section className={`swiper-container ${styles.header_banner}`}>
        <div className="swiper-wrapper">
          {list.map((item) => (
            <figure className="swiper-slide"
              onClick={() => this.goUrl(item.markeUrl)}
              style={{ background: `url(${getFileUrl(item.markeImg)}) top center no-repeat` }}
            >
              {/* <Link to={`/${item.markeUrl}`}> */}
              {/* <img src={getFileUrl(item.markeImg)} alt="" className={styles.banner_item} onClick={() => this.goUrl(item.markeUrl)} /> */}
              {/* </Link> */}
            </figure>
          )
          )}
        </div>
        {/* <div className="swiper-pagination" /> */}
      </section>
    );
  }
}

export default Banner;
