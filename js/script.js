import playList from "./playList.js";
import langArr from "./langArr.js";

const time = document.querySelector(".time");
const dateOutput = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const userName = document.querySelector(".name");
const body = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuoteButton = document.querySelector(".change-quote");
const playButton = document.querySelector(".play");
const prevButton = document.querySelector(".play-prev");
const nextButton = document.querySelector(".play-next");
const playListContainer = document.querySelector(".play-list");
const select = document.querySelector("select");
const customPlayer = document.querySelector(".player-container");
const currentAudioDuration = document.querySelector(".current");
const progressBar = customPlayer.querySelector(".progress");
const timeline = customPlayer.querySelector(".timeline");
const audioTitle = document.querySelector(".audio-title");
const weatherError = document.querySelector(".weather-error");

let randomNum;

const audio = new Audio();
audio.src = playList[0].src;
let playNum = 0;
let isPlay = false;

let hash = window.location.hash;
if (hash === "") {
  hash = "#en";
}
hash = hash.substr(1);
select.value = hash;
userName.placeholder = langArr["namePlaceholder"][hash];

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}
showTime();

function showDate() {
  const date = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
    hour12: false,
  };
  const currentDate = date.toLocaleDateString(langArr["date"][hash], options);
  dateOutput.textContent = currentDate;
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  const index = Math.floor(hours / 6);
  return index;
}

function showGreeting() {
  let index = getTimeOfDay();
  greeting.textContent = langArr["greet"][hash][index];
}

function setLocalStorage() {
  localStorage.setItem("name", userName.value);
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("name") || localStorage.getItem("city")) {
    userName.value = localStorage.getItem("name");
    city.value = localStorage.getItem("city");
    if (city.value === "") {
      city.value = "Kyiv";
    }
  }
}
window.addEventListener("load", getLocalStorage);

function getRandomNum(min, max) {
  randomNum = Math.floor(Math.random() * (max - min) + min);
  return randomNum;
}
getRandomNum(1, 20);

function setBg() {
  const timeOfDay = getTimeOfDay();
  let bgNum = randomNum;
  bgNum = String(bgNum).padStart(2, "0");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/AaLin-Git/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.webp`;

  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}
setBg();

function getSlideNext() {
  randomNum++;
  if (randomNum + 1 > 20) {
    randomNum = 1;
  }
  setBg();
}
slideNext.addEventListener("click", getSlideNext);

function getSlidePrev() {
  randomNum--;
  if (randomNum - 1 < 0) {
    randomNum = 20;
  }
  setBg();
}
slidePrev.addEventListener("click", getSlidePrev);

if (city.value === "") {
  city.value = "Kyiv";
}
async function getWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${hash}&appid=26310790c7af07b3a6f2f1bf2272d7f2&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    const icon = data.weather[0].id;
    weatherIcon.classList.add(`owf-${icon}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${langArr["wind"][hash]}: ${Math.round(
      data.wind.speed
    )} m/s`;
    humidity.textContent = `${langArr["humidity"][hash]}: ${data.main.humidity}%`;
  } catch (error) {
    weatherError.textContent = "Can't find the city";
    temperature.textContent = "";
    weatherDescription.textContent = "";
    wind.textContent = "";
    humidity.textContent = "";
    weatherIcon.classList.remove(`owf-${icon}`);
  }
}
getWeather();
city.addEventListener("change", getWeather);

async function getQuotes(randomIndex) {
  const quotes = "./assets/quotes/data.json";
  const res = await fetch(quotes);
  const data = await res.json();
  quote.textContent = `"${data[randomIndex][`text-${hash}`]}"`;
  author.textContent = data[randomIndex][`author-${hash}`];
}

function changeQuote() {
  const randomIndex = Math.floor(Math.random() * (32 - 0) + 0);
  getQuotes(randomIndex);
}
changeQuote();
changeQuoteButton.addEventListener("click", changeQuote);

function playAudio() {
  try {
    audio.pause();
    if (!isPlay) {
      audio.play();
      isPlay = true;
      playListContainer.children[playNum].classList.add("item-active");
      audioTitle.textContent = playList[playNum]["title"];
    } else {
      audio.pause();
      isPlay = false;
      playListContainer.children[playNum].classList.remove("item-active");
    }
  } catch (error) {
    audioTitle.textContent = "loading...";
  }
}

function toggleBtn() {
  if (audio.paused) {
    playButton.classList.remove("pause");
    isPlay = false;
  } else {
    playButton.classList.add("pause");
    isPlay = true;
  }
}

playButton.addEventListener("click", () => {
  playAudio();
  toggleBtn();
});

function playNext() {
  if (playButton.classList.contains("pause") && playNum <= 2) {
    playNum++;
    audio.src = playList[playNum].src;
    playAudio();
  }
}

function checkNext() {
  if (playNum < 3) {
    playListContainer.children[playNum].classList.remove("item-active");
  } else if (playNum === 3) {
    playListContainer.children[playNum].classList.remove("item-active");
    playNum = -1;
  }
  isPlay = false;
  playNext();
}
nextButton.addEventListener("click", checkNext);

function playPrev() {
  if (playButton.classList.contains("pause") && playNum > 0) {
    playNum--;
    audio.src = playList[playNum].src;
    playAudio();
  }
}

function checkPrev() {
  if (playNum > 0) {
    playListContainer.children[playNum].classList.remove("item-active");
  } else if (playNum === 0) {
    playListContainer.children[playNum].classList.remove("item-active");
    playNum = 4;
  }
  isPlay = false;
  playPrev();
}
prevButton.addEventListener("click", checkPrev);

audio.addEventListener("ended", checkNext);

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

function showAudioDuration() {
  currentAudioDuration.textContent = getTimeCodeFromNum(audio.currentTime + 1);
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  setTimeout(showAudioDuration, 1000);
}

audio.addEventListener(
  "loadeddata",
  () => {
    customPlayer.querySelector(".length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    showAudioDuration();
  },
  false
);

timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

playList.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = item.title;
  playListContainer.append(li);
});

function changeUrlLang() {
  let lang = select.value;
  location.href = `${window.location.pathname}#${lang}`;
  location.reload();
}
select.addEventListener("change", changeUrlLang);
