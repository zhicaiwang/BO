import { connect } from 'dva';
import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.css';

const { Header, Content, Footer } = Layout;

const BasicLayout = ({
  children,
  home,
}) => {

  const {
    accountData,
  } = home;

  console.log(accountData);

  return (
    <div className={styles.normal}>
      <Header style={{ background: '#0D2C5A' }}>
        <div style={{ float: 'left' }}>
          <img src={require('../assets/logo7.png')} width={60} alt="" style={{ position: 'absolute', top: 5, }}/>
        </div>
        <div style={{ float: 'center' }}>
          <img src={require('../assets/logo6.png')} width={120} alt="" style={{ position: 'absolute', top: 10, left: 120 }}/>
        </div>
        {
          accountData.address ? (
            <div style={{ float: 'right', paddingTop: 6, }}>
              <p style={{ lineHeight: '24px', color: '#fff', margin: 0, width: 360, textAlign: 'left', }}>
                <span>钱包地址：</span>{accountData.address}
              </p>
              <p style={{ lineHeight: '24px', color: '#fff', margin: 0, width: 360, textAlign: 'left', }}>
                <span>账户余额：</span>{accountData.balance}
              </p>
            </div>
          ) : null
        }
      </Header>
      { children }
    </div>
  );
}

export default connect(({ home }) => ({ home }))(BasicLayout);
