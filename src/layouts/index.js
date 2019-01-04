import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.css';

const { Header, Content, Footer } = Layout;

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <Header style={{ background: '#fff' }}>
      <div style={{ float: 'left' }}>
        <img src={require('../assets/logo4.png')} width={65} alt="" style={{ position: 'absolute' }}/>
        </div>
        <div style={{ float: 'center' }}>
          <img src={require('../assets/logo3.png')} width={200} alt="" style={{ position: 'absolute' }}/>
          </div>
          <div>
          <strong style={{ float: 'right' }}>今日12:00 BTC价格 vs. 明日12:00 BTC价格</strong>
          </div>

      </Header>
      { props.children }
    </div>
  );
}

export default BasicLayout;
