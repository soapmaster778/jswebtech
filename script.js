'use strict';

const initialState = () => ({
  level: 1,
  score: 0,
  status: 'menu',
  maxLevel: 5,
  fireAt: 0,
  reaction: 0,
  gunmanTime: 1.5,
  playerTime: 0,
  skin: 1,
  timers: []
});

const getGunmanTime = level => Math.max(0.55, 1.7 - level * 0.22);
const getRandomDelay = () => Math.floor(700 + Math.random() * 1600);
const getSkin = level => ((level - 1) % 5) + 1;
const getWinScore = state => state.score + state.level * 100;
const getNextState = state => ({
  ...state,
  level: state.level + 1,
  status: 'walking',
  skin: getSkin(state.level + 1),
  gunmanTime: getGunmanTime(state.level + 1),
  playerTime: 0,
  fireAt: 0
});
const formatTime = seconds => Number(seconds).toFixed(2);

const menu = document.querySelector('#menu');
const wrapper = document.querySelector('#wrapper');
const winScreen = document.querySelector('#winScreen');
const screen = document.querySelector('#screen');
const gunman = document.querySelector('#gunman');
const message = document.querySelector('#message');
const startBtn = document.querySelector('#startBtn');
const restartBtn = document.querySelector('#restartBtn');
const nextBtn = document.querySelector('#nextBtn');
const playAgainBtn = document.querySelector('#playAgainBtn');
const scoreEl = document.querySelector('#score');
const finalScoreEl = document.querySelector('#finalScore');
const levelEl = document.querySelector('#level');
const gunmanTimeEl = document.querySelector('#gunmanTime');
const playerTimeEl = document.querySelector('#playerTime');

const sounds = {
  intro: new Audio('assets/sfx/intro.m4a'),
  wait: new Audio('assets/sfx/wait.m4a'),
  fire: new Audio('assets/sfx/fire.m4a'),
  shot: new Audio('assets/sfx/shot.m4a'),
  shotFall: new Audio('assets/sfx/shot-fall.m4a'),
  foul: new Audio('assets/sfx/foul.m4a'),
  death: new Audio('assets/sfx/death.m4a'),
  win: new Audio('assets/sfx/win.m4a')
};

let state = initialState();

function stopAllSounds() {
  Object.values(sounds).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function playSound(name, stopOthers = true) {
  if (stopOthers) {
    stopAllSounds();
  }

  const audio = sounds[name];
  audio.pause();
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function clearTimers() {
  state.timers.forEach(timer => clearTimeout(timer));
  state = { ...state, timers: [] };
}

function addTimer(callback, delay) {
  const timer = setTimeout(callback, delay);
  state = { ...state, timers: [...state.timers, timer] };
}

function setMessage(text, className = '') {
  message.textContent = text;
  message.className = `message ${className}`.trim();
}

function setGunmanView(view) {
  gunman.className = `gunman char-${state.skin} ${view}`;
}

function renderPanel() {
  scoreEl.textContent = state.score;
  levelEl.textContent = `Level ${state.level}`;
  gunmanTimeEl.textContent = formatTime(state.gunmanTime);
  playerTimeEl.textContent = formatTime(state.playerTime);
  finalScoreEl.textContent = state.score;
}

function startGame() {
  stopAllSounds();
  clearTimers();
  state = { ...initialState(), status: 'walking', gunmanTime: getGunmanTime(1), skin: 1 };
  menu.style.display = 'none';
  winScreen.style.display = 'none';
  wrapper.style.display = 'block';
  restartBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  screen.classList.remove('game-screen--death');
  renderPanel();
  moveGunman();
  playSound('intro');
}

function restartGame() {
  startGame();
}

function nextLevel() {
  stopAllSounds();
  clearTimers();
  if (state.level >= state.maxLevel) {
    showFinalWin();
    return;
  }
  state = getNextState(state);
  restartBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  screen.classList.remove('game-screen--death');
  renderPanel();
  moveGunman();
  playSound('intro');
}

function moveGunman() {
  setMessage('', '');
  gunman.style.transition = 'none';
  gunman.style.left = '820px';
  setGunmanView('walk');

  requestAnimationFrame(() => {
    gunman.classList.add('moving');
    gunman.style.transition = 'left 3.2s linear';
    gunman.style.left = '345px';
  });

  addTimer(prepareForDuel, 3300);
}

function prepareForDuel() {
  state = { ...state, status: 'waiting' };
  setGunmanView('stand');
  setMessage('WAIT...', 'message--wait');
  playSound('wait');
  addTimer(() => {
    if (state.status !== 'waiting') return;
    state = { ...state, status: 'fire', fireAt: performance.now(), playerTime: 0 };
    setGunmanView('ready');
    setMessage('', 'message--fire');
    playSound('fire');
    timeCounter();
    addTimer(gunmanShootsPlayer, state.gunmanTime * 1000);
  }, getRandomDelay());
}

function timeCounter() {
  if (state.status !== 'fire') return;
  const seconds = (performance.now() - state.fireAt) / 1000;
  state = { ...state, playerTime: seconds };
  playerTimeEl.textContent = formatTime(seconds);
  requestAnimationFrame(timeCounter);
}

function gunmanShootsPlayer() {
  if (state.status !== 'fire') return;
  state = { ...state, status: 'lost' };
  setGunmanView('shoot');
  playSound('shot');
  setMessage('YOU DIED', 'message--dead');
  screen.classList.add('game-screen--death');
  restartBtn.style.display = 'block';
  renderPanel();
  addTimer(() => playSound('death', false), 1900);
}

function playerShootsGunman(event) {
  if (!gunman.contains(event.target)) {
    return;
  }

  if (state.status === 'waiting' || state.status === 'walking') {
    state = { ...state, status: 'lost' };
    setGunmanView('shoot');
    setMessage('FOUL!', 'message--dead');
    restartBtn.style.display = 'block';
    playSound('foul');
    return;
  }

  if (state.status !== 'fire') return;

  const reaction = (performance.now() - state.fireAt) / 1000;
  state = {
    ...state,
    status: 'won',
    reaction,
    playerTime: reaction,
    score: scoreCount(state)
  };

  clearTimers();
  setGunmanView('dead');
  setMessage('YOU WIN!', 'message--win');
  nextBtn.style.display = 'block';
  renderPanel();


  playSound('shot');
  addTimer(() => playSound('win', false), 1900);
}

function scoreCount(currentState) {
  return getWinScore(currentState);
}

function showFinalWin() {
  clearTimers();
  wrapper.style.display = 'none';
  winScreen.style.display = 'block';
  finalScoreEl.textContent = state.score;
  playSound('win');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
nextBtn.addEventListener('click', nextLevel);
playAgainBtn.addEventListener('click', startGame);
gunman.addEventListener('click', playerShootsGunman);
