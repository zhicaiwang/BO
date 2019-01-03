import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.css';

const { Header, Content, Footer } = Layout;

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <Header style={{ background: '#fff' }}>
        <div style={{ float: 'left' }}>
          <img src={require('../assets/logo.png')} width={64} alt="" style={{ position: 'absolute' }}/>
          </div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <a href="/">Home</a>
          </Menu.Item>
          <Menu.Item key="2">
            <a href="https://tron.network/">Tron</a>
          </Menu.Item>
          <Menu.Item key="3">
            <a href="https://dapps.house/">Dapp</a>
          </Menu.Item>
        </Menu>
      </Header>
      { props.children }
    </div>
  );
}

export default BasicLayout;
