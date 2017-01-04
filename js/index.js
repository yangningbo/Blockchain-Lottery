var web3, eth;
var balance = {};
var weiToEther = 1000000000000000000;

function timestampToString(timestamp) {
  return Date(+(timestamp) * 1000)
}

function showLog(msg) {
  $('#log').prepend(`<pre>${msg}</pre><br />`);
  console.log('showLog', msg);
}

function showLog2(msg) {
  $('#log2').prepend(`<pre>${msg}</pre><br />`);
  console.log('showLog2', msg);
}

var transactionHashs = []
function ignoreDuplicateEvent(event) {
  var duplicate = true;

  if (transactionHashs.indexOf(event.transactionHash) < 0) {
    duplicate = false;
    transactionHashs.push(event.transactionHash);
  } else {
    console.log('重複', event);
  }

  return duplicate;
}
var selectedLotteryNumber = [];
function selectBall(ball) {
  if (selectedLotteryNumber.indexOf(ball) > -1) {
    return;
  }
  selectedLotteryNumber.push(ball);
  if (selectedLotteryNumber.length > 5) {
    selectedLotteryNumber.shift();
  }
  selectedLotteryNumber.sort(function(a, b) { return a - b; });
  for(var i = 1 ; i <= 20 ; i++) {
    $(`#ball_${i}`).removeClass('selected');
  }
  selectedLotteryNumber.forEach(function(i){
    $(`#ball_${i}`).addClass('selected');
  });
}

function generateLotteryBall() {
  for(var i = 1 ; i <= 20 ; i++) {
    $('#lotteryBall').append(`<div class='ball' id='ball_${i}'onclick='selectBall(${i})'>${i}</div>`)
  }
}
function showDialog(msg) {
  $('#dialog').html(`<p>${msg}</p>`).dialog('open');
}
// 當頁面載入完成時
$(function() {
  $('#player').selectmenu();
  $('#tabs').tabs();

  generateLotteryBall();
  $('#dialog').dialog({
      autoOpen: false,
      show: {
        effect: "puff",
        duration: 500
      },
      hide: {
        effect: "puff",
        duration: 500
      }
    });

  //$('#container').height($(window).height());
  // 連結 enode
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  eth = web3.eth;
  var contractOwner = web3.eth.accounts[1];
  // 放置 web3 deploy 程式碼
  var lotteryserviceContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint8[5]"}],"name":"betting","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"seed","type":"uint256"}],"name":"randomGen","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"checkMyBetLog","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"remove","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"checkAllBetLog","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"player","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"BettingSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"player","type":"address"},{"indexed":false,"name":"msg","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"BettingFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"numbers","type":"uint8[5]"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":true,"name":"player","type":"address"}],"name":"BetLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":true,"name":"player","type":"address"}],"name":"NoBetLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"numbers","type":"uint8[]"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"LotteryNumbers","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"TotalBetAmount","type":"event"}]);
  var lotteryservice = lotteryserviceContract.new(
     {
       from: contractOwner,
       data: '0x606060405234610000575b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6113578061005c6000396000f30060606040523615610081576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f146100865780630fee0ab8146100d5578063434b14e7146101105780637d3c618514610147578063a7f4377914610156578063ba13a57214610165578063c0c4bf9a14610174575b610000565b3461000057610093610183565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61010e6004808060a0019060058060200260405190810160405280929190826005602002808284378201915050505050919050506101a9565b005b346100005761012b6004808035906020019091905050610672565b604051808260ff1660ff16815260200191505060405180910390f35b34610000576101546106b9565b005b3461000057610163610888565b005b346100005761017261091c565b005b3461000057610181610d2b565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a60ff16670de0b6b3a76400003481156100005704141561050457600280548060010182818154818355818115116102465760030281600302836000526020600020918201910161024591905b80821115610241576000600082016000905560018201600090556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506003016101f7565b5090565b5b505050916000526020600020906003020160005b6060604051908101604052808581526020014281526020013373ffffffffffffffffffffffffffffffffffffffff168152509091909150600082015181600001906005826005601f016020900481019282156103265791602002820160005b838211156102f757835183826101000a81548160ff021916908360ff16021790555092602001926001016020816000010492830192600103026102b9565b80156103245782816101000a81549060ff02191690556001016020816000010492830192600103026102f7565b505b50905061035691905b8082111561035257600081816101000a81549060ff02191690555060010161032f565b5090565b50506020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060010182818154818355818115116104325781836000526020600020918201910161043191905b8082111561042d576000816000905550600101610415565b5090565b5b505050916000526020600020900160005b600160028054905003909190915055503373ffffffffffffffffffffffffffffffffffffffff167fb0321cd950dc9e61b6b07389923b09b32515c27b013263d774dcb902980aeaf9426040518082815260200191505060405180910390a27f8d9e9ca2b2c5fecd3a724db6a8c683e3bc016ac80a00eddb7ee221afc87070d3670de0b6b3a76400003073ffffffffffffffffffffffffffffffffffffffff1631811561000057046040518082815260200191505060405180910390a161066e565b600a60ff16670de0b6b3a7640000348115610000570411156105ac573373ffffffffffffffffffffffffffffffffffffffff167f5b1922653b9a12b267af5f88aaf8380c5dea6179372d166f58d33f964f3cc961426040518080602001838152602001828103825260128152602001807fe4b88be6b3a8e98791e9a18de9818ee5a49a00000000000000000000000000008152506020019250505060405180910390a2610634565b3373ffffffffffffffffffffffffffffffffffffffff167f5b1922653b9a12b267af5f88aaf8380c5dea6179372d166f58d33f964f3cc961426040518080602001838152602001828103825260128152602001807fe4b88be6b3a8e98791e9a18de4b88de8b6b300000000000000000000000000008152506020019250505060405180910390a25b3373ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051809050600060405180830381858888f19350505050505b5b50565b60006001600a60ff1660014303408460405180836000191660001916815260200182815260200192505050604051809103902060019004811561000057060190505b919050565b600060006000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209250600091505b82805490508260ff161015610826576002838360ff16815481101561000057906000526020600020900160005b5054815481101561000057906000526020600020906003020160005b5090508060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f0b8a5b11fc0ca5ae9da7030f6818c3545e327dc85b249c24beb7e85efc83aee0826000018360010154604051808360058015610804576020028201916000905b82829054906101000a900460ff1660ff16815260200190600101906020826000010492830192600103820291508084116107cd5790505b50508281526020019250505060405180910390a25b8180600101925050610705565b600083805490501415610882573373ffffffffffffffffffffffffffffffffffffffff167f56bb25bd7020a5d66c207321ae17c712db7b1aaf0f52fcb6472af69f92a5c826426040518082815260200191505060405180910390a25b5b505050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561091957600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060006000600060006000610930610e9e565b4295506002805490508601955060006006818154818355818115116109815781836000526020600020918201910161098091905b8082111561097c576000816000905550600101610964565b5090565b5b50505050600680548060010182818154818355818115116109ce578183600052602060002091820191016109cd91905b808211156109c95760008160009055506001016109b1565b5090565b5b505050916000526020600020900160005b60009091909150555060068054806001018281815481835581811511610a3157818360005260206000209182019101610a3091905b80821115610a2c576000816000905550600101610a14565b5090565b5b505050916000526020600020900160005b6002600280549050811561000057049091909150555060068054806001018281815481835581811511610aa157818360005260206000209182019101610aa091905b80821115610a9c576000816000905550600101610a84565b5090565b5b505050916000526020600020900160005b60016002805490500390919091505550600094505b600680549050851015610b53576002600686815481101561000057906000526020600020900160005b5054815481101561000057906000526020600020906003020160005b5093508360020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661ffff16860195508360010154860195505b8480600101955050610ac7565b5b60056004805490501015610c7657610b6b86610672565b925060009150600090505b6004805490508160ff161015610bd6578260ff1660048260ff1681548110156100005790600052602060002090602091828204019190065b9054906101000a900460ff1660ff161415610bc857600191505b5b8080600101915050610b76565b8260ff1686019550811515610c715760048054806001018281815481835581811511610c3c57601f016020900481601f01602090048360005260206000209182019101610c3b91905b80821115610c37576000816000905550600101610c1f565b5090565b5b50505091600052602060002090602091828204019190065b85909190916101000a81548160ff021916908360ff160217905550505b610b54565b7f268d298f3b783a8c524cb92b3d87cbed198509ea2d076d49851e29963d190f9f60044260405180806020018381526020018281038252848181548152602001915080548015610d0b57602002820191906000526020600020906000905b82829054906101000a900460ff1660ff1681526020019060010190602082600001049283019260010382029150808411610cd45790505b5050935050505060405180910390a1610d22610f3f565b5b505050505050565b60006000600091505b6002805490508260ff161015610e3c5760028260ff16815481101561000057906000526020600020906003020160005b5090508060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f0b8a5b11fc0ca5ae9da7030f6818c3545e327dc85b249c24beb7e85efc83aee0826000018360010154604051808360058015610e1a576020028201916000905b82829054906101000a900460ff1660ff1681526020019060010190602082600001049283019260010382029150808411610de35790505b50508281526020019250505060405180910390a25b8180600101925050610d34565b60006002805490501415610e99573373ffffffffffffffffffffffffffffffffffffffff167f56bb25bd7020a5d66c207321ae17c712db7b1aaf0f52fcb6472af69f92a5c826426040518082815260200191505060405180910390a25b5b5050565b6000600481815481835581811511610ef057601f016020900481601f01602090048360005260206000209182019101610eef91905b80821115610eeb576000816000905550600101610ed3565b5090565b5b505050506000600581815481835581811511610f3857818360005260206000209182019101610f3791905b80821115610f33576000816000905550600101610f1b565b5090565b5b505050505b565b600060006000600060006000600095505b60028054905086101561129757600286815481101561000057906000526020600020906003020160005b50945060019350600092505b6004805490508360ff16101561103c5760009150600090505b60058160ff1610156110225760048360ff1681548110156100005790600052602060002090602091828204019190065b9054906101000a900460ff1660ff16856000018260ff16600581101561000057602091828204019190065b9054906101000a900460ff1660ff16141561101457600191505b5b8080600101915050610f9f565b83801561102c5750815b93505b8280600101935050610f86565b8315611103576005805480600101828181548183558181151161108b5781836000526020600020918201910161108a91905b8082111561108657600081600090555060010161106e565b5090565b5b505050916000526020600020900160005b8760020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505b600380548060010182818154818355818115116111845760030281600302836000526020600020918201910161118391905b8082111561117f576000600082016000905560018201600090556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600301611135565b5090565b5b505050916000526020600020906003020160005b8790919091506000820181600001906005826005601f016020900481019282156111e35791601f016020900482015b828111156111e25782548255916001019190600101906111c7565b5b50905061121391905b8082111561120f57600081816101000a81549060ff0219169055506001016111ec565b5090565b5050600182015481600101556002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505b8580600101965050610f50565b61129f611328565b600060028181548183558181151161131b5760030281600302836000526020600020918201910161131a91905b80821115611316576000600082016000905560018201600090556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506003016112cc565b5090565b5b505050505b505050505050565b5b5600a165627a7a72305820901ce6e7a002946e48461c3b47ca89f93fb6da124c70346128b031cdcb9f932e0029', 
       gas: '4700000'
     }, function (e, contract){
      if (e) {
        showLog('錯誤', e);
      }
      if (typeof contract.address !== 'undefined') {
        showLog('Lottery Service 合約部屬完成!');
        contractControl();
      }
   })

  //--------------------------------

  var lotteryPlayer;

  function getPlayerEther() {
    web3.eth.getBalance(lotteryPlayer,
      function(err, balance) {
        playerEther = balance.toNumber();
        $('#playerEther').html(`乙太幣餘額： ${Number(web3.fromWei(playerEther, 'ether'), 10).toFixed(2)} ether`);
      }
    );
  }

  function getContractEther(amount) {
    if (!amount) {
      web3.eth.getBalance(lotteryservice.address,
        function(err, balance) {
          $('#contractEther').html(`總下注金額： ${Number(web3.fromWei(balance.toNumber(), 'ether'), 10).toFixed(2)} ether`);
        }
      );
    } else {
      $('#contractEther').html(`總下注金額： ${Number(amount, 10).toFixed(2)} ether`);
    }
  }
  function contractControl() {
    console.log('進入合約控制');

    var options = [];
    for(var i = 0 ; i < eth.accounts.length ; i++ ) {
      options.push(`<option ${(i == 0) ? 'selected' : ''} value='${eth.accounts[i]}'>${eth.accounts[i]}</option>`);
    }
    lotteryPlayer = eth.accounts[0];
    getPlayerEther();
    getContractEther();

    $('#player')
      .append(options.join(''))
      .selectmenu('destroy')
      .selectmenu({
        change: function( event, ui ) {
          lotteryPlayer = ui.item.value;
          console.log('lotteryPlayer', lotteryPlayer);
          getPlayerEther();
        }
      });

    lotteryservice.BettingSuccess({}, function(err, event) {
      if (!ignoreDuplicateEvent(event)) {
        getPlayerEther();
        showLog(`下注成功
        下注者：${event.args.player}
        時間：${timestampToString(event.args.timestamp)}
        `);
        showLog2(`下注記錄
        下注者：${event.args.player}
        時間：${timestampToString(event.args.timestamp)}
        `);
      }
    });

    lotteryservice.BettingFailed({}, function(err, event) {
      if (!ignoreDuplicateEvent(event)) {
        getPlayerEther();
        showLog(`下注失敗
下注者：${event.args.player}
原因：${event.args.msg}
時間：${timestampToString(event.args.timestamp)}
        `);
      }
    });

    lotteryservice.TotalBetAmount({}, function(err, event) {
      /*showLog(`總下注金額
      $：${event.args.amount}
      `);*/
      getContractEther(event.args.amount);
    });

    lotteryservice.BetLog({}, function(err, event) {
      showLog(`下注記錄
下注者：${event.args.player}
號碼：${event.args.numbers}
時間：${timestampToString(event.args.timestamp)}
      `)
    });

    lotteryservice.NoBetLog({}, function(err, event) {
      showLog(`沒有下注記錄
下注者：${event.args.player}
時間：${timestampToString(event.args.timestamp)}
      `)
    });

    lotteryservice.LotteryNumbers({}, function(err, event) {
      showLog2(`開獎號碼
號碼：${event.args.numbers}
時間：${timestampToString(event.args.timestamp)}
      `)
    });

    // 綁定事件
    $('#checkMyBet').on('click', function() {
      if (!lotteryPlayer || !lotteryPlayer.length) return;

      console.log('checkMyBetLog', lotteryPlayer);
      lotteryservice.checkMyBetLog({
        from: lotteryPlayer,
        gas: 300000,
      })
    });

    $('#bet').on('click', function() {
      if (!lotteryPlayer || !lotteryPlayer.length) return;
      if (selectedLotteryNumber.length != 5) {
        showDialog('請選擇五個下注號碼')
        return;
      }

      var betValue = web3.toWei(10, 'ether');
      if (playerEther < betValue) {
        betValue = playerEther - 400000;
      }
      lotteryservice.betting(selectedLotteryNumber, {
        from: lotteryPlayer,
        value: betValue,
        gas: 300000,
      })
    });

    $('#lottery').on('click', function() {
      lotteryservice.lottery({
        from: contractOwner,
        gas: 300000,
      })
    });
  }
});