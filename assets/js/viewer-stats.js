(function () {
  "use strict";

  var host = window.location.hostname || "local-preview";
  var isLocalHost = host === "localhost" || host === "127.0.0.1";
  var namespace = "mortezagolzan-github-io";
  var totalViewsKey = "site-total-views";
  var storageKey = "viewer-stats-last-hit";

  function todayStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function alreadyCountedToday() {
    try {
      return window.localStorage.getItem(storageKey) === todayStamp();
    } catch (e) {
      return false;
    }
  }

  function markCountedToday() {
    try {
      window.localStorage.setItem(storageKey, todayStamp());
    } catch (e) { /* storage unavailable — count every visit */ }
  }

  async function fetchCount(action) {
    var url = "https://abacus.jasoncameron.dev/" + action + "/" + namespace + "/" + totalViewsKey;
    var response = await fetch(url, { method: "GET", cache: "no-store" });
    if (!response.ok) {
      throw new Error("Count API request failed.");
    }

    var body = await response.json();
    return typeof body.value === "number" ? body.value : 0;
  }

  async function renderFooterViewCount() {
    var target = document.getElementById("footer-view-count");
    if (!target || !window.fetch) {
      return;
    }

    if (isLocalHost) {
      target.textContent = "local";
      return;
    }

    try {
      var action = alreadyCountedToday() ? "get" : "hit";
      var totalViews = await fetchCount(action);
      if (action === "hit") {
        markCountedToday();
      }
      target.textContent = totalViews.toLocaleString();
    } catch (error) {
      target.textContent = "--";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooterViewCount);
  } else {
    renderFooterViewCount();
  }
})();
