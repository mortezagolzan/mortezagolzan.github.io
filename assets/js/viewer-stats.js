(function () {
  "use strict";

  var host = window.location.hostname || "local-preview";
  var isLocalHost = host === "localhost" || host === "127.0.0.1";
  var namespace = host.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  var totalViewsKey = "site-total-views";
  var uniqueViewsKey = "site-unique-viewers";
  var uniqueFlagKey = namespace + "-viewer-seen";

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

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = String(value);
    }
  }

  async function incrementSiteCounters() {
    if (isLocalHost || !window.fetch) {
      return;
    }

    try {
      await requestCount("hit", totalViewsKey);
    } catch (error) {
      // Ignore analytics network errors to avoid breaking page interaction.
    }

    try {
      if (!window.localStorage.getItem(uniqueFlagKey)) {
        await requestCount("hit", uniqueViewsKey);
        window.localStorage.setItem(uniqueFlagKey, "1");
      }
    } catch (error) {
      // localStorage can fail in strict privacy modes; treat as non-fatal.
    }
  }

  async function renderStatsPage() {
    var totalTarget = document.getElementById("total-views");
    var uniqueTarget = document.getElementById("unique-viewers");
    if (!totalTarget && !uniqueTarget) {
      return;
    }

    if (isLocalHost) {
      setText("viewer-stats-note", "Stats are disabled on localhost preview.");
      setText("last-updated", "N/A");
      return;
    }

    try {
      var counts = await Promise.all([
        requestCount("get", totalViewsKey),
        requestCount("get", uniqueViewsKey)
      ]);

      setText("total-views", counts[0].toLocaleString());
      setText("unique-viewers", counts[1].toLocaleString());
      setText("viewer-stats-note", "Live counters update automatically as visitors browse the site.");
      setText("last-updated", new Date().toLocaleString());
    } catch (error) {
      setText("viewer-stats-note", "Could not load live stats right now. Please refresh in a moment.");
      setText("last-updated", "Unavailable");
    }
  }

  incrementSiteCounters();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderStatsPage);
  } else {
    renderStatsPage();
  }
})();
