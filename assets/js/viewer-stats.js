(function () {
  "use strict";

  var host = window.location.hostname || "local-preview";
  var isLocalHost = host === "localhost" || host === "127.0.0.1";
  var namespace = "mortezagolzan-github-io";
  var totalViewsKey = "site-total-views";

  async function incrementAndGetCount() {
    var url = "https://api.counterapi.dev/v1/" + namespace + "/" + totalViewsKey + "/up";
    var response = await fetch(url, { method: "GET", cache: "no-store" });
    if (!response.ok) {
      throw new Error("Count API request failed.");
    }

    var body = await response.json();
    return typeof body.count === "number" ? body.count : 0;
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
      var totalViews = await incrementAndGetCount();
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
