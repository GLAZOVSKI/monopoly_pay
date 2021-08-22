let btnAddPlayer = document.getElementById('addPlayer');
let inputPlayerName = document.getElementById('playerName');
let fieldPlayers = document.getElementById('players');
let inputMany = document.getElementById('startSum');
let btnStart = document.getElementById('start');
let windowStart = document.getElementById('modalStart');
let btnNewGame = document.getElementById('newGame');
let fieldPlayersCard = document.getElementById('playersCard');
let inputCircleReward = document.getElementById('circleReward');
let fieldHistory = document.getElementById('history');

let players = [];
let history = [];
let circleReward = 0;

let colors = [
  '#f44336',
  '#2196f3',
  '#4caf50',
  '#ffeb3b',
  '#673ab7',
  '#607d8b',
  '#795548',
  '#3f51b5',
  '#e800d3',
  '#1daf8f',
];

checkSave();

inputMany.addEventListener('input', function () {
  this.value = formatNumber(this.value);
});

inputCircleReward.addEventListener('input', function () {
  this.value = formatNumber(this.value);
});

btnNewGame.addEventListener('click', () => { // Новая игра
  if (confirm('Начать новую игру?')) {
    clearData();
    location.reload();
  }
});

btnStart.addEventListener('click', () => { // Старт игры
  if (players.length > 0) {
    if (inputCircleReward.value !== '') {
      for (let player in players) { // Обновить счет денег у всех игроков
        players[player].many = Number(inputMany.value.replaceAll(' ', ''));
      }

      circleReward = inputCircleReward.value;

      save();
      windowStart.remove();
      startGame();
    } else {
      alert('Установите награду за круг');
    }
  } else {
    alert('Добавьте игроков');
  }
});

btnAddPlayer.addEventListener('click', () => { // Добавить игрока
  let name = inputPlayerName.value;

  if (name.length > 0) {
    if (!issetName(name)) {
      createDivPlayer(name);

      players.push({
        name: inputPlayerName.value,
        many: inputMany.value,
        bankrupt: false,
        color: randColor(colors),
      });

      inputPlayerName.value = '';
    } else {
      alert('Имя игрока занято');
    }
  }
});


// функциАНАЛ

function formatNumber(number) {
  let N = String(number).replaceAll(' ', '');
  let numberLength = N.length;

  switch (numberLength) {
    case 5: return N.substring(0, 2) + " " + N.substring(2, 5);
    case 6: return N.substring(0, 3) + " " + N.substring(3, 6);
    case 7: return N.substring(0, 1) + " " + N.substring(1, 4)+ " " + N.substring(4, 7);
    case 8: return N.substring(0, 2) + " " + N.substring(2, 5)+ " " + N.substring(5, 8);
    case 9: return N.substring(0, 3) + " " + N.substring(3, 6)+ " " + N.substring(6, 9);
    case 10: return N.substring(0, 1) + " " + N.substring(1, 4)+ " " + N.substring(4, 7)+ " " + N.substring(7, 10);
    default: return N;
  }
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function randColor(colors) {
  let index = randomInteger(0, colors.length - 1);
  let color = colors[index];

  colors.splice(index, 1);

  return color;
}

function addHistory(text, result = 'success') {
  history.unshift(
    {
      text: text,
      result: result,
    }
  );

  createHistoryBlock(text, result, false);
  save();
}

function startGame() {
  fieldPlayersCard.innerHTML = '';
  fieldHistory.innerHTML = '';

  players.forEach((item, index) => {
    if (players[index].bankrupt) return true;
    createCardPlayer(index, item.name, item.many, item.color);
  });

  history.forEach((item, index) => {
    createHistoryBlock(item.text, item.result);
  });
}

function createHistoryBlock (text, result, position = true) {
  let div = document.createElement('div');
  div.className = 'mt-1 h4 bg-black d-flex text-white p-2 rounded-2 border border-'+ result +' border-4';
  div.innerText = text;

  if (position) {
    fieldHistory.append(div);
  } else {
    fieldHistory.prepend(div);
  }
}

function createCardPlayer(id, name, sum, color) {
  let main = document.createElement('div');
  let mainCard = document.createElement('div');
  let card = document.createElement('div');

  let blockPlayerName = document.createElement('div');
  let playerName = document.createElement('h4');

  let cardBody = document.createElement('div');
  let cardSumPlayer = document.createElement('h1');

  let mainFieldSum = document.createElement('div');
  let blockLabelSum = document.createElement('div');
  let labelSum = document.createElement('span');
  let fieldSum = document.createElement('input');

  let mainBlockButtons = document.createElement('div');
  let blockButtons = document.createElement('div');
  let btnMinusMany = document.createElement('button');
  let btnPlusMany = document.createElement('button');
  let dropdownMenu = document.createElement('ul');
  let liDropdownMenu = document.createElement('li');
  let aDropdownMenu = document.createElement('a');

  let btnCircle = document.createElement('button');
  let btnBankrupt = document.createElement('button');

  main.className = 'col-md-4 themed-grid-col p-1 shadow';
  mainCard.className = 'col text-center';
  card.className = 'card mb-4 rounded-3 shadow-sm';

  blockPlayerName.className = 'card-header py-3';
  blockPlayerName.style.background = color;
  playerName.className = 'my-0 fw-normal h2';

  cardBody.className = 'card-body';
  cardSumPlayer.className = 'card-title pricing-card-title';

  mainFieldSum.className = 'input-group mt-3';
  blockLabelSum.className = 'input-group-prepend';
  labelSum.className = 'input-group-text text-large';
  fieldSum.className = 'form-control text-large';

  mainBlockButtons.className = 'd-flex mt-1';
  blockButtons.className = 'btn-group col';
  btnMinusMany.className = 'btn btn-danger btn-lg d-flex col-6 align-items-center justify-content-center';
  btnPlusMany.className = 'btn btn-success btn-lg col-6 dropdown-toggle d-flex align-items-center justify-content-center';
  dropdownMenu.className = 'dropdown-menu';

  btnCircle.className = 'w-100 btn btn-primary mt-5';
  btnBankrupt.className = 'w-100 btn btn-outline-danger mt-2';

  playerName.innerText = name;
  cardSumPlayer.innerText = '$' + formatNumber(sum);
  labelSum.innerText = '$';

  fieldSum.placeholder = 'Сумма';
  fieldSum.type = 'text';
  fieldSum.addEventListener('input', function () {
    this.value = formatNumber(this.value);
  });

  btnMinusMany.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">\n' +
    '<path d="M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z"/>\n' +
    '</svg>';
  btnPlusMany.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">\n' +
    '<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>\n' +
    '</svg>';
  btnPlusMany.dataset.bsToggle = 'dropdown'
  btnCircle.innerText = 'Круг';
  btnBankrupt.innerText = 'Банкрот';

  aDropdownMenu.innerText = 'От банка';
  aDropdownMenu.className = 'dropdown-item';
  cardSumPlayer.id = 'player' + id;

  dropdownMenu.innerHTML = '<li><hr class="dropdown-divider"></li>';
  liDropdownMenu.append(aDropdownMenu);
  dropdownMenu.append(liDropdownMenu);


  players.forEach((item, index) => {
    if (index === id) return true;
    if (players[index].bankrupt) return true;

    let li = document.createElement('li');
    let a = document.createElement('a');

    a.className = 'dropdown-item';
    a.innerText = 'От ' + players[index].name;

    a.addEventListener('click', () => { // Перевод игроку
      let sum = Number(fieldSum.value.replaceAll(' ', ''));

      if (sum > 0) {
        players[id].many += sum;
        players[index].many -= sum;

        document.getElementById('player' + index).innerText = '$' + formatNumber(players[index].many);
        cardSumPlayer.innerText = '$' + formatNumber(players[id].many);
        fieldSum.value = '';
        addHistory(name + ' получил от ' + players[index].name + ' - ' + formatNumber(sum) + ' $', 'success');
        new Audio('audio/transfer.mp3').play();

      }
    });

    li.append(a);
    dropdownMenu.prepend(li);
  });

  aDropdownMenu.addEventListener('click', () => { // Перевод от банка
    let sum = Number(fieldSum.value.replaceAll(' ', ''));

    if (sum > 0) {
      players[id].many += sum;
      cardSumPlayer.innerText = '$' + formatNumber(players[id].many);
      fieldSum.value = '';
      addHistory(name + ' получил от Банка - ' + formatNumber(sum) + ' $', 'primary');
      new Audio('audio/transfer.mp3').play();
    }
  });

  btnCircle.addEventListener('click', () => { // Прохождение круга
    players[id].many += Number(circleReward.replaceAll(' ', ''));
    cardSumPlayer.innerText = '$' + formatNumber(players[id].many);
    addHistory('Игрок ' + name + ' прошел круг', 'warning');
    new Audio('audio/circle.mp3').play();
  });

  btnBankrupt.addEventListener('click', () => { // Банкрот
    if (confirm('Объявить игрока ' + name + ' банкротом?')) {
      players[id].bankrupt = true;
      addHistory(name + ' стал банкротом', 'danger');
      startGame();
      main.remove();
      new Audio('audio/bankrupt.mp3').play();
    }
  });

  btnMinusMany.addEventListener('click', () => { // Списать со счета
    let sum = Number(fieldSum.value.replaceAll(' ', ''));

    if (sum > 0) {
      players[id].many -= sum;
      cardSumPlayer.innerText = '$' + formatNumber(players[id].many);
      fieldSum.value = '';
      addHistory(name + ' отдал банку - ' + formatNumber(sum) + ' $', 'danger');
      new Audio('audio/write-downs.mp3').play();
    }
  });

  blockButtons.append(btnMinusMany, btnPlusMany, dropdownMenu);
  mainBlockButtons.append(blockButtons);
  blockLabelSum.append(labelSum);
  mainFieldSum.append(blockLabelSum, fieldSum);
  cardBody.append(cardSumPlayer, mainFieldSum, mainBlockButtons, btnCircle, btnBankrupt);
  blockPlayerName.append(playerName);
  card.append(blockPlayerName, cardBody);
  mainCard.append(card);
  main.append(mainCard);

  fieldPlayersCard.append(main);
}

function issetName(name) {
  return players.find(item => item.name === name);
}

function checkSave() {
  if (localStorage.players) {
    players = JSON.parse(localStorage.players);
    history = JSON.parse(localStorage.history);
    circleReward = localStorage.circleReward;

    windowStart.remove();
    startGame();
  }
}

function save() {
  localStorage.players = JSON.stringify(players);
  localStorage.circleReward = circleReward;
  localStorage.history = JSON.stringify(history);
}

function clearData() {
  localStorage.clear();
}

function getIdName(name) {
  return players.findIndex(item => item.name === name); // Вернет индекс
}

function deletePlayer(name) {
  if (issetName(name)) {
    players.splice(getIdName(name), 1);
  }
}

function createDivPlayer(name) {
  let main = document.createElement('div');
  let span = document.createElement('span');
  let button = document.createElement('button');

  main.className = 'd-flex my-1';
  span.className = 'flex-grow-1';
  button.className = 'btn btn-danger d-flex align-items-center h-100';

  span.innerText = name;
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n' +
    '<path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>\n' +
    '</svg>';

  button.addEventListener('click', () => {
    deletePlayer(name);
    main.remove();
  });

  main.append(span, button);
  fieldPlayers.append(main);
}