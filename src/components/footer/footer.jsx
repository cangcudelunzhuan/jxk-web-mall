import React from 'react';
import styles from './index.module.styl';

class Footer extends React.Component {
  render() {
    return (
      <section className={styles.footer}>
        <div className={styles.content}>
          京小康 &copy; 备案号: 浙ICP备19046630号-4
        </div>
      </section>
    );
  }
}

export default Footer;
