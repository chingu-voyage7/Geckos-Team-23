const settings = document.getElementById("dashboard-settings");

const menuOpenBtn = document.getElementById("settings-btn");
menuOpenBtn.onclick = function() {
  settings.style.right = "0rem";
};

const menuCloseBtn = document.getElementById("menu-close-btn");
menuCloseBtn.onclick = function() {
  settings.style.right = "-35rem";
};

// themes
const dashboard = document.getElementById("dashboard");

const blueTheme = document.getElementById("blue");
const greenTheme = document.getElementById("green");
const redTheme = document.getElementById("red");
const tealTheme = document.getElementById("teal");
const violetTheme = document.getElementById("violet");

blueTheme.onclick = function() {
  dashboard.style.background = "#2a94ff";
  saveTheme("#2a94ff");
};
redTheme.onclick = function() {
  dashboard.style.background = "#ee5253";
  saveTheme("#ee5253");
};
greenTheme.onclick = function() {
  dashboard.style.background = "#78e08f";
  saveTheme("#78e08f");
};
tealTheme.onclick = function() {
  dashboard.style.background = "#00cec9";
  saveTheme("#00cec9");
};
violetTheme.onclick = function() {
  dashboard.style.background = "#8e44ad";
  saveTheme("#8e44ad");
};

function saveTheme(color) {
  localStorage.setItem("theme", color);
}

//restore theme if stored in local-storage
if (localStorage.getItem("theme")) {
  dashboard.style.background = localStorage.getItem("theme");
}
