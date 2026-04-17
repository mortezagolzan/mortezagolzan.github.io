(function () {
  "use strict";

  var host = window.location.hostname || "local-preview";
  var isLocalHost = host === "localhost" || host === "127.0.0.1";
  var namespace = host.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  var totalViewsKey = "site-total-views";

  function apiURL(action, key) {
    return "https://api.countapi.xyz/" + action + "/" + namespace + "/" + key;
  }

  async function requestCount(action, key) {
    var response = await fetch(apiURL(action, key), { method: "GET", cache: "no-store" });
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
      // Use "hit" so every page view both increments and returns the latest count.
      var totalViews = await requestCount("hit", totalViewsKey);
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
