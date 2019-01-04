import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.css';

const { Header, Content, Footer } = Layout;

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <Header style={{ background: '#0D2C5A' }}>
      <div style={{ float: 'left' }}>
        <img src={require('../assets/logo7.png')} width={70} alt="" style={{ position: 'absolute' }}/>
        </div>
        <div style={{ float: 'center' }}>
          <img src={require('../assets/logo6.png')} width={170} alt="" style={{ position: 'absolute' }}/>
          </div>
          <div>
          <strong style={{ float: 'right', color: '#fff' }}>今日12:00 BTC价格 vs. 明日12:00 BTC价格</strong>
          </div>

      </Header>
      { props.children }
    </div>
  );
}

export default BasicLayout;
