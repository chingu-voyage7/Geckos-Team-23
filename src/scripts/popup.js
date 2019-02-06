const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.onclick = function() {
  if (navigator.userAgent.includes("Chrome")) {
    chrome.tabs.create({ url: "chrome://newtab" });
  } else {
    const newtabURL = browser.runtime.getURL("views/newTab.html");
    browser.tabs.create({ url: newtabURL });
  }
};
