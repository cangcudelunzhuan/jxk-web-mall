// 首页 banner
import React from 'react';
import Swiper from 'swiper';
// import Model from '@/model';
// import { Link } from 'dva/router';
import './swiper.styl';
import { Common } from '@jxkang/utils';
import styles from './index.module.styl';
import { getFileUrl } from '@/utils/index';

class Banner extends React.Component {
  componentDidMount() {
  }

  initSwiper = (list) => {
    const bottom = new Swiper('.index_bottom_sweiper', {
      direction: 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 0,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      freeMode: true,
    });
    this.swiper = new Swiper(`.${styles.header_banner}`, {
      direction: 'vertical',
      // autoplay: true,
      autoplay: {
        delay: 5000,
      },
      loop: true,
      thumbs: {
        swiper: bottom,
      },
      on: {
        slideChange() {
          if (this.activeIndex > 7) {
            bottom.setTranslate((bottom.getTranslate()) - 34);
          }
          if (bottom.activeIndex !== 0) {
            bottom.slideTo(0, 100, false);
          }
          if (this.activeIndex === list.length + 1) {
            bottom.setTranslate(0);
          }
        },
      },
    });
  }

  goUrl = (url) => {
    location.href = url.includes('//') ? url : `//${location.host}${url}`;
  }

  render() {
    const { list = [] } = this.props;

    this.initSwiper(list);
    // this.initSwiper();
    return (
      <section className={styles.banner_out}>
        <section className={`swiper-container ${styles.header_banner}`}>
          <div className="swiper-wrapper">
            {list.map((item) => (
              <figure className="swiper-slide"
                onClick={() => this.goUrl(item.bannerUrl)}
                style={{ background: `url(${getFileUrl(item.bannerImg)}) top center no-repeat` }}
              />
            )
            )}
          </div>
          {/* <div className="swiper-pagination" /> */}
        </section>
        <div className={styles.banner_content}>
          <section className="index_bottom_sweiper">
            <div className="swiper-wrapper">
              {list.map((item, i) => (
                <div className={`swiper-slide ${styles.bottom_slide}`} key={i}>
                  <section className={styles.text_box}>
                    <div className={`${styles.line} title`}>
                      {item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].remark.replace(/\s+/g, '').substr(0, 16)}
                      {item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].remark.replace(/\s+/g, '').length > 16 ? '...' : null}
                    </div>
                    <div className={`${styles.title_box} hide`} onClick={() => this.goUrl(item.bannerUrl)}>
                      <p className={styles.title}>
                        {item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].title.substr(0, 19)}
                        {item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].title.length > 19 ? '...' : null}
                      </p>
                      <div className={styles.info}>
                        {item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].remark.substr(0, 45)}
                        {item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].remark.length > 45 ? '...' : null}
                      </div>
                      <div className={styles.price_box}>
                        <span>
                          零售价：
                          {Common.money2fixed(item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].sellPrice)}
                          元
                        </span>
                        <span>
                          采购价：
                          {Common.money2fixed(item.itemInfoList && item.itemInfoList[0] && item.itemInfoList[0].tradePrice)}
                          元
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )
              )}
            </div>
          </section>
        </div>
      </section>
    );
  }
}

export default Banner;
