pragma solidity ^0.4.23;

/**
* @title SafeMath
* @dev Math operations with safety checks that throw on error
*/
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

contract BinaryOption {

  /**
  * Private variables
  */
  uint256 private developerShare = 5; // 开发者抽成 5%
  uint256 private winnerShare = 95; // 剩余的95%全部是赢家瓜分
  bool locked; // FOR MODIFIER

  /**
  * Storage
  */
  mapping (uint256 => Game) public games;
  mapping (address => uint256) public gameBank;
  address public contractModifier;

  /**
  * Constructor
  * Define contract modifier, developer address.
  * Initialize values.
  */
  constructor() public {
    contractModifier = msg.sender;
  }

  /**
  * Data structure
  */
  struct Game {
    uint256 gameId;
    uint256 startTime;
    uint256 endTime;
    uint256 result; // 0->NOT SET, 1->UP, 2->DOWN, 3->TIE
    uint256 upPoolAmount;
    uint256 downPoolAmount;
    uint256 upBettersCount;
    uint256 downBettersCount;
    mapping(uint256 => Better) betters;
  }

  struct Better {
    address add;
    uint256 investedAmount;
    uint256 bet; // 1->UP, 2->DOWN
  }

  /**
  * Modifier
  */
  modifier onlyContractModifier() {
    require(msg.sender == contractModifier);
    _;
  }

  modifier noReentrancy() {
    if(locked) revert();
    locked = true;
    _;
    locked = false;
  }

  /**
  * Events
  */
  //event test_value(uint256 indexed value1);

  /**
  * Public functions
  */

  // Fallback
  function () public payable {
    revert();
  }

  function destroy() public onlyContractModifier {
    selfdestruct(contractModifier);
  }

  // Create games 创建游戏，gameId为当天日期，如20181228，startTime是开始时间，endTime为结束时间
  // 开始时间必须大于now，结束时间必须大于开始时间
  function addGame(uint256 gameId, uint256 startTime, uint256 endTime) public onlyContractModifier returns (bool result) {
    require(startTime > now && endTime > startTime);
    require(gameId >= 0);
    Game memory _game = Game(gameId, startTime, endTime, 0, 0, 0, 0, 0);
    games[gameId] = _game;
    return true;
  }
  // 获取某场游戏的开始时间
  function getGameStartTime(uint256 gameId) public constant returns(uint256) {
    require(gameId > 0);
    uint256 result = games[gameId].startTime;
    return result;
  }
  // 获取某场游戏的看涨总额
  function getUpAmount(uint256 gameId) public constant returns(uint256) {
    require(gameId > 0);
    uint256 result = games[gameId].upPoolAmount;
    return result;
  }
  // 获取某场游戏的看跌总额
  function getDownAmount(uint256 gameId) public constant returns(uint256) {
    require(gameId > 0);
    uint256 result = games[gameId].downPoolAmount;
    return result;
  }
  // 获取某场游戏的结果
  function getResult(uint256 gameId) public constant returns(uint256) {
    require(gameId > 0);
    uint256 result = games[gameId].result;
    return result;
  }
  // 获取某场游戏某个玩家的下注 - 看涨或看跌
  function getBetterPlay(uint256 gameId, address add) public view returns (uint256 _result) {
    require(gameId > 0);
    uint256 index = getBetterIndex(gameId, add);
    _result = games[gameId].betters[index].bet;
  }
  // 获取某场游戏某个玩家的下注金额
  function getBetterInvested(uint256 gameId, address add) public view returns (uint256 _result) {
    require(gameId > 0);
    uint256 index = getBetterIndex(gameId, add);
    _result = games[gameId].betters[index].investedAmount;
  }
  // 获取某场游戏的看涨的人数
  function getUpBettersCount(uint256 gameId) public constant returns(uint256) {
    require(gameId > 0);
    uint256 result = games[gameId].upBettersCount;
    return result;
  }
  // 获取某场游戏的看跌的人数
  function getDownBettersCount(uint256 gameId) public constant returns(uint256) {
    require(gameId > 0);
    uint256 result = games[gameId].downBettersCount;
    return result;
  }
  // 获取玩家的余额
  function getBalance() public view returns (uint256 _balance) {
    _balance = gameBank[msg.sender];
  }
  // 获取本合约的余额
  function getContractBalance() public view returns (uint256 _contractBalance) {
    _contractBalance = address(this).balance;
  }

  // 获取某场游戏的详情
/*
  function getGameDetails(uint256 gameId) public constant returns (uint256[]) {
    require(gameId > 0);
    Game memory _game = games[gameId];

    uint256[] memory data = new uint256[](8);
    data[0] = _game.gameId;
    data[1] = _game.startTime;
    data[2] = _game.endTime;
    data[3] = _game.result;
    data[4] = _game.upPoolAmount;
    data[5] = _game.downPoolAmount;
    data[6] = _game.upBettersCount;
    data[7] = _game.downBettersCount;

    return data;
  }
*/

  // 玩家下注游戏，， gameID为要下注的游戏id，即当日日期，bet为要下的注，1为看涨，2为看跌
  function betGame(uint256 gameId, uint256 bet) public payable returns(bool result) {
    require(gameId > 0 && bet > 0 && bet < 3);
    // require(msg.value > 0 && msg.value > 100 && msg.value < 10000);
    require(msg.sender != contractModifier);

    Game storage _game = games[gameId];
    require(_game.result == 0);
    require(_game.endTime > now);

    bool isNewBetter = false;
    uint256 index = 0; // Better index
    uint256 total = getBetterTotal(gameId);

    if(total == 0) {
      isNewBetter = true;
    } else {
      index = getBetterIndex(gameId, msg.sender); // get existing player
    }

    Better storage _better = _game.betters[index];
    _better.add = msg.sender;
    _better.investedAmount = SafeMath.add(_better.investedAmount, msg.value);

    if (!isNewBetter) {
      require(_better.bet == bet); //only can bet UP or DOWN
    } else {
      _better.bet = bet;
    }

    if(bet == 1) {
      _game.upPoolAmount = SafeMath.add(_game.upPoolAmount, msg.value);
      if (isNewBetter) {
        _game.upBettersCount++;
      }
    } else if(bet == 2) {
      _game.downPoolAmount = SafeMath.add(_game.downPoolAmount, msg.value);
      if (isNewBetter) {
        _game.downBettersCount++;
      }
    }
    return true;
  }

  // Set game result and distribute prizes
  // 紧限合约创建者使用，上报游戏结果。 该函数会合理计算并分配奖金。
  function setGameResult(uint256 gameId, uint256 result) public onlyContractModifier returns(bool) {
     require(gameId > 0 && result > 0 && result < 4);
     Game storage _game = games[gameId];

     require(_game.result == 0);
     _game.result = result;

     // Winners profit = losers invested
     uint256 profit = 0;
     uint256 winnersTotalInvested = 0;
     if (result == 1){
       profit = _game.downPoolAmount;
       winnersTotalInvested = _game.upPoolAmount;
     } else if (result == 2){
       profit = _game.upPoolAmount;
       winnersTotalInvested = _game.downPoolAmount;
     }

     uint256 onePercent = SafeMath.div(profit, 100);
     uint256 developerProfit = SafeMath.mul(onePercent, developerShare);
     gameBank[contractModifier] = SafeMath.add(gameBank[contractModifier], developerProfit);

     uint256 winnersProfit = SafeMath.mul(onePercent, winnerShare);

     for(uint256 i = 0; i < SafeMath.add(_game.upBettersCount, _game.downBettersCount); i++) {
       Better memory better = _game.betters[i];

       // Winner profit = (winner invest / all winners invested) * winners profit
       if(better.bet == result && better.investedAmount > 0 && winnersProfit > 0){
         uint256 _gain = SafeMath.div(SafeMath.mul(better.investedAmount, winnersProfit), winnersTotalInvested);
         uint256 _balance = SafeMath.add(better.investedAmount, _gain);
         gameBank[better.add] = SafeMath.add(gameBank[better.add], _balance);
       }
     }
     return true;
  }
  // 玩家把自己的合约的余额转账到钱包地址
  function playerWithdraw() external noReentrancy returns(bool) {
    uint256 refund = gameBank[msg.sender];
    require (refund > 0);
    gameBank[msg.sender] = 0;
    msg.sender.transfer(refund);
    return true;
  }

  /**
   * Private functions
   */
  function getBetterTotal(uint256 gameId) private view returns (uint256 result) {
    require(gameId > 0);
    result = SafeMath.add(games[gameId].upBettersCount, games[gameId].downBettersCount);
  }

  function getBetterIndex(uint256 gameId, address add) private view returns (uint256 result) {
    require(gameId > 0);
    uint256 betterCount = SafeMath.add(games[gameId].upBettersCount, games[gameId].downBettersCount);
    for(uint256 i = 0; i < betterCount; i++){
      if(games[gameId].betters[i].add == add){
        result = i;
        break;
      }
    }
  }
}
