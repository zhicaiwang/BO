import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Divider,
  Form,
  Input,
  Button,
  Table,
  Spin,
  message,
} from 'antd';
import styles from './index.css';
import CONFIG from '../../public/config.js';
import { getHistoryGameId } from '../utils';

const HomePage = ({
  home,
  form,
  dispatch,
}) => {

  const {
    getFieldDecorator,
    validateFields,
  } = form;

  const {
    upPoolAmount,
    downPoolAmount,
    upBettersCount,
    downBettersCount,

    loading,
    myGame,
    balance,
  } = home;

  const {
    today,
    yesterday,
  } = CONFIG;

  const columns = [
    {
      title: '时间',
      dataIndex: 'date',
    },
    {
      title: '竞猜涨跌',
      dataIndex: 'type',
      render: (text) => (
        <span>
          {text === 1 ? '看涨' : '看跌'}
        </span>
      ),
    },
    {
      title: '竞猜金额',
      dataIndex: 'money',
      render: (text) => (
        <span>{text} TRX</span>
      )
    },
    {
      title: '竞猜结果',
      dataIndex: 'result',
      render: (text, record) => {
        let result = ''
        if (+text === 0) {
          result = '尚未开奖';
        } else {
          result = +text === +record.type ? '猜中' : '未猜中';
        }
        return (
          <div>
            {result}
          </div>
        )
      }
    }
  ];

  // 获取收益率
  // type: 1 涨 2 跌
  function getRate(type = 1) {
    if (type === 1 && upPoolAmount > 0) {
      return (downPoolAmount / (upPoolAmount) * 100).toFixed(2);
    } else if (type === 2 && downPoolAmount > 0) {
      return (upPoolAmount / (downPoolAmount) * 100).toFixed(2);
    } else {
      return 0;
    }
  }

  // 计算投注比例
  function getCountPercent(type = 1) {
    const totalAmount = upPoolAmount + downPoolAmount;
    if (totalAmount > 0) {
      if (type === 1) {
        return (upPoolAmount / totalAmount * 100).toFixed(2);
      } else if (type === 2) {
        return (downPoolAmount / totalAmount * 100).toFixed(2);
      }
    }
    return 0;
  }

  function getBitcoinRate() {
    return ((today.bitcoin - yesterday.bitcoin) / yesterday.bitcoin * 100).toFixed(2);
  }

  return (
    <div className="pageContent">
      <Spin tip="加载中" spinning={loading}>
        <Card className={styles.card}>
          <div className={styles.bet}>
            <h2 className={styles.betTitle}>
              竞猜下注
              <span>
                今日 12:00 BTC 价格 vs. 明日 12:00 BTC 价格
              </span>
            </h2>
            <Col
              className={styles.titleCols}
              xs={24}
              sm={24}
              md={8}
              lg={6}
              xl={6}
              xxl={4}
              style={{ float: 'right' }}
            >
              <div className={styles.bitcoinInfos}>
                <strong>今日 BTC </strong>
                <p className={styles.colorUp}>${CONFIG.today.bitcoin}</p>
              </div>
              <div className={styles.bitcoinInfos}>
                <strong>昨日 BTC</strong>
                <p className={styles.colorUp}>${CONFIG.yesterday.bitcoin}</p>
              </div>
              <div className={styles.bitcoinInfos}>
                <strong>涨跌幅</strong>
                <p className={today.bitcoin - yesterday.bitcoin > 0 ? styles.up : styles.down}>
                  { getBitcoinRate() }
                </p>
              </div>
            </Col>
            <Divider />
            <Row>
              <Col span={12}>
                <Form
                  layout="inline"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validateFields((err, values) => {
                      if (!err) {
                        const { upBetAmount } = values;
                        if (upBetAmount > 0) {
                          dispatch({
                            type: 'home/betGame',
                            payload: {
                              type: 1,
                              amount: +upBetAmount * 1e6,
                            }
                          });
                        } else {
                          message.error('请输入看涨金额！');
                        }
                      }
                    });
                  }}
                >
                  <Form.Item label="下注数量">
                    {
                      getFieldDecorator('upBetAmount', {
                        initialValue: 100,
                      })(
                        <Input type="number" />
                      )
                    }
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{
                        background: 'green',
                        color: '#fff',
                      }}
                      htmlType="submit"
                    >
                      看涨
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={12}>
                <Form
                  layout="inline"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validateFields((err, values) => {
                      if (!err) {
                        const { downBetAmount } = values;
                        if (downBetAmount > 0) {
                          dispatch({
                            type: 'home/betGame',
                            payload: {
                              type: 2,
                              amount: +downBetAmount * 1e6,
                            }
                          });
                        } else {
                          message.error('请输入看跌金额！');
                        }
                      }
                    });
                  }}
                >
                  <Form.Item label="下注数量">
                    {
                      getFieldDecorator('downBetAmount',{
                        initialValue: 100,
                      })(
                        <Input type="number" />
                      )
                    }
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{
                        background: 'red',
                        color: '#fff',
                      }}
                      htmlType="submit"
                    >
                      看跌
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.todayStatus}>
            <h2>
              今日竞猜情况
              <span>
                竞猜开放时间：每日的12:00 - 24:00
              </span>
            </h2>
            <Divider />
            <Row>
              <Col
                xs={24}
                sm={24}
                md={{ span: 10, offset: 2 }}
                lg={{ span: 10, offset : 2 }}
                xl={{ span: 8, offset: 4 }}
                xxl={{ span: 6, offset: 6 }}
              >
                <Row>
                  <Col span={12}>
                    当前 TRX 奖池总量
                  </Col>
                  <Col span={12}>
                    <h2>
                      { upPoolAmount + downPoolAmount} TRX
                    </h2>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    看涨人数
                  </Col>
                  <Col span={12} className={styles.upRate}>
                    { upBettersCount }
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    看跌人数
                  </Col>
                  <Col span={12} className={styles.downRate}>
                    { downBettersCount }
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={12}>
                    看涨预期收益率
                  </Col>
                  <Col span={12} className={styles.upRate}>
                    {getRate(1)}%
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    看跌预期收益率
                  </Col>
                  <Col span={12} className={styles.downRate}>
                    {getRate(2)}%
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col span={12}>
                    看涨竞猜金额
                  </Col>
                  <Col span={12} className={styles.upRate}>
                    { upPoolAmount } TRX
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    看跌竞猜金额
                  </Col>
                  <Col span={12} className={styles.downRate}>
                    { downPoolAmount } TRX
                  </Col>
                </Row>
                <br/>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={8}
                xxl={6}
              >
                <Row style={{ height: 210 }} type="flex" justify="center" align="bottom">
                  <Col span={8} className={styles.todayStatusUp}>
                    <p>{ getCountPercent(1) }%</p>
                    <div
                      className={styles.todayStatusUpMap}
                      style={{ height: `${150 * (upPoolAmount / (upPoolAmount + downPoolAmount))}px`}}
                    />
                    <div>看涨</div>
                  </Col>
                  <Col span={8} style={{ height: 105 }}>
                    <span className={styles.pk}>pk</span>
                  </Col>
                  <Col span={8} className={styles.todayStatusDown}>
                    <p>{ getCountPercent(2) }%</p>
                    <div
                      className={styles.todayStatusDownMap}
                      style={{ height: `${150 * (downPoolAmount / (upPoolAmount + downPoolAmount))}px`}}
                    />
                    <div>看跌</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.history}>
            <h2>
              我的竞猜
              {
                balance ? (
                  <div
                    style={{ float: 'right' }}
                  >
                    <span style={{ fontSize: 16, color: 'red' }}>
                      奖金：{balance}
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                      type="primary"
                      onClick={() => { dispatch({ type: 'home/playerWithdraw' })}}
                    >
                      提取奖金
                    </Button>
                  </div>
                ) : null
              }
            </h2>
            <Divider />
            <Table
              rowKey={(record, index) => (`${record.gameId}-${index}`)}
              columns={columns}
              locale={{
                emptyText: '暂无数据'
              }}
              dataSource={myGame.filter((item) => item.money > 0)}
            />
          </div>
        </Card>



        <Card className={styles.card}>
          <div className={styles.rules}>
            <h2>投注规则</h2>
            <Divider />
            <ol>
              <li>
                投注：平台默认单次最低投注数量 100 TRX, 允许多次投注，但不允许双边下注。
              </li>
              <li>
                输赢规则：若中奖，返还投注本金，并按赢方本金占比去分取输方 95% 投注的 TRX，5% 归开发者；若未中奖，失去所有投注本金。
              </li>
              <li>
                如何计算：每局以每天中午 12 点 BTC 价格对比第二天中午 12 点 BTC 价格计算涨／跌 (所有时间以GMT+0800 China Standard Time为基准)。
              </li>
              <li>
                数据来源：BTC 价格来源于 CoinDesk BPI。（<a href="https://www.coindesk.com/price/bitcoin" target="_blank">https://www.coindesk.com/price/bitcoin</a>）
              </li>
              <li>
                竞猜开放时间：用户可在每天中午 12 点至晚上 24 点进行投注，竞猜当天中午 12 点至第二天中午 12 点的 BTC 价格涨跌。
              </li>
              <li>
                平台奖励发放：每日的 18:00 前发放上一日投注结果的奖励。
              </li>
              <li>
                奖励存放于合约中，玩家可以将余额划转提现至投注 TRX 钱包。
              </li>
            </ol>
          </div>
        </Card>

        <Card className={styles.card}>
          <Row className={styles.titleInfos} gutter={16}>
          If you reside in a location where lottery, gambling, or betting over the internet is illegal, please do not click on anything related to these activities on this site.  You must be 21 years of age to click on any gambling related items even if it is legal to do so in your location.  Recognising that the laws and regulations involving online gaming are different everywhere, players are advised to check with the laws that exist within their own jurisdiction or region to ascertain the legality of the activities which are covered.

The games provided by BINARYTRON are based on blockchain, fair, and transparency.  When you start playing these games, please take not that online gambling and lottery is an entertainment vehicle and that it carries with it a certain degree of financial risk.  Players should be aware of these risks and govern themselves accordingly.
            COPYRIGHT ©2018 BINARYTRON.COM ALL RIGHT RESERVED.
          </Row>
        </Card>

      </Spin>
    </div>
  );
}

export default connect(({ home }) => ({ home }))(Form.create()(HomePage));
