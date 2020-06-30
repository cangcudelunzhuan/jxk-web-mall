import React from 'react';
import Swiper from 'swiper';
import { Common } from '@jxkang/utils';
import { getFileUrl, getPathName } from '@/utils/index';
// import { downloadFileUrl } from '@/utils';
import styles from './index.module.styl';
import './swiper.styl';
import Config from '@/config';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  initSwiper = () => {
    const { name } = this.props;
    const bottom = new Swiper(`.swiper${name}bottom`, {
      spaceBetween: 0,
      slidesPerView: 5,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
    });
    this.swiper = new Swiper(`.swiper${name}top`, {
      spaceBetween: 0,
      thumbs: {
        swiper: bottom,
      },
    });
  }

  down = (arr, type = '1-1') => {
    const { itemId } = this.props;
    arr.map((item, i) => {
      const it = typeof (item) === 'string' ? item : item.photo;
      Common.winOpen({
        url: `${Config.dowmImgUrl}/${itemId}_${type}-${i + 1}.${it.split('.').pop()}`,
        type: 'post',
        target: 'ifm',
        params: {
          ossUri: getPathName(it.split('?')[0]),
          host: Config.imgHost,
        },
      });
      return '';
    });
  }


  getFileName = (url) => {
    const num = url.lastIndexOf('/') + 1;
    let fileName = url.substring(num);
    // 把参数和文件名分割开
    fileName = decodeURI(fileName.split('?')[0]);
    return fileName;
  }

  componentDidMount() {
    // const swiperLIst = this.props.initSwiper();
    // const { name } = this.props;
    // this.setState({
    //   swiperLIst,
    //   name,
    // });
    // setTimeout(() => {
    //   this.initSwiper();
    // }, 100);
  }

  render() {
    const { swiperList, name } = this.props;
    setTimeout(() => {
      this.initSwiper();
    }, 100);

    return (
      <section>
        {/* 大图 */}
        <section className={`${styles.top_sweiper} swiper${name}top`}>
          <div className="swiper-wrapper">
            {(swiperList || []).map((item, i) => (
              <figure className="swiper-slide" key={i}>
                <img src={getFileUrl(item.photo)} alt="" className={styles.swiper_big_img} />
              </figure>
            )
            )}
          </div>
        </section>
        {/* 小图 */}
        <section className={`${styles.bottom_sweiper} swiper${name}bottom`}>
          <div className="swiper-wrapper">
            {(swiperList || []).map((item, i) => (
              <div className={`swiper-slide ${styles.bottom_slide}`} key={i}>
                <img src={getFileUrl(item.photo)} alt="" className={styles.swiper_small_img} />
              </div>
            )
            )}
          </div>
        </section>
        <div className={styles.downLoad_box}>
          <span className={styles.downLoad} onClick={() => this.down(swiperList, name)}>下载</span>
        </div>

      </section>
    );
  }
}

export default Index;
