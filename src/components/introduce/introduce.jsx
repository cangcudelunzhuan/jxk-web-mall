import React, { Component } from 'react';
import styles from './index.module.styl';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, desc, style } = this.props;
    return (
      <section className={styles.banner_box} style={style}>
        <section className={styles.banner_content}>
          <p className={styles.banner_text}>{title}</p>
          <p>{desc}</p>
        </section>

      </section>
    );
  }
}

export default Banner;
