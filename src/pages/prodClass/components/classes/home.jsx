import React from 'react';
import styles from './index.module.styl';
import Model from '@/model';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.props.onRef(this);
    this.state = {
      pisition: {
        left: 0,
        top: 100,
        isShow: false,
      },
      active: 0,
      secondList: [],
    };
  }

  getDefault = () => {
    this.setState({
      active: 0,
    });
  }

  openClass = async (id, e) => {
    e.nativeEvent.stopImmediatePropagation();
    const pisition = {
      left: e.target.offsetLeft + (e.target.clientWidth / 2),
      top: e.target.offsetTop + 25,
    };
    const res = await Model.prodClass.secondCategory({ categoryId: id });
    if (res) {
      this.setState({
        secondList: res,
        active: id,
        pisition,
        isShow: true,
      });
    }
  }

  componentDidMount() {
    document.addEventListener('click', () => {
      this.setState({
        isShow: false,
      });
    });
  }

  render() {
    const { pisition, isShow, active, secondList } = this.state;
    const { list } = this.props;

    return (
      <>
        <section className={styles.class_box}>
          {
            list.map((item) => (
              <article key={item.id}
                className={`${styles.class_item} ${active === item.id ? styles.active : ''}`}
                onClick={(e) => this.openClass(item.id, e)}
              >
                {item.catName}
              </article>
            )
            )
          }
        </section>
        <figure className={`${styles.position_box} ${isShow === true ? styles.position_box_show : null} `} style={{ top: `${pisition.top}px` }}>
          <section className={styles.extend_out}>
            <div className={styles.arrow} style={{ left: `${pisition.left}px` }} />
            <div className={`${styles.extend_box}`}>
              {
                secondList.map((item) => (
                  <article key={item.id}
                    className={`${styles.class_item} `}
                    onClick={() => this.props.changeClass({ category1: active, category2: item.id })}
                  >
                    {item.catName}
                  </article>
                )
                )
              }
            </div>
          </section>
        </figure>

      </>

    );
  }
}

export default Index;
