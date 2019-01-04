import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.css';

const { Header, Content, Footer } = Layout;

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <Header style={{ background: '#0D2C5A', textAlign: 'center' }}>
        <div style={{ display: 'inline' }}>
          <img src={require('../assets/logo7.png')} width={60} alt=""/>
        </div>
        <div style={{ display: 'inline' }}>
          <img src={require('../assets/logo6.png')} width={120} alt=""/>
        </div>
        {/* <div>
          <strong style={{ float: 'right', marginRight: 8, color: '#fff' }}>今日 12:00 BTC 价格 vs. 明日 12:00 BTC 价格</strong>
        </div> */}
      </Header>
      { props.children }
    </div>
  );
}

export default BasicLayout;
