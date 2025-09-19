// service_worker.js
const RULE_PREFIX = "focus_rule_"; // we'll generate numeric rule ids

// Helper: load blocked sites from storage
async function getBlockedSites() {
  const data = await chrome.storage.sync.get({ blockedSites: [] });
  return data.blockedSites;
}

// Helper: save active rule ids
async function saveActiveRules(ids) {
  await chrome.storage.local.set({ activeRuleIds: ids });
}

async function getActiveRules() {
  const data = await chrome.storage.local.get({ activeRuleIds: [] });
  return data.activeRuleIds;
}

// Convert a site entry like "facebook.com" or "*.facebook.com/*" to a dnr rule
function makeRule(id, site) {
  // Use urlFilter for broad matches. Add resourceTypes to main_frame only.
  // urlFilter accepts a simple filter string. We'll try to build a pattern.
  let urlFilter = site;

  // If user provided host only (no wildcard or scheme), accept any path.
  if (!site.includes("/") && !site.includes("*")) {
    // e.g. "facebook.com" -> "||facebook.com^"
    // Using urlFilter "||example.com" blocks subdomains.
    urlFilter = "||" + site;
  }

  return {
    id: id,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: "/blocked.html" } },
    condition: {
      // urlFilter supports simple filters (see Chrome docs).
      urlFilter: urlFilter,
      resourceTypes: ["main_frame"]
    }
  };
}

// Start blocking: add dynamic rules and set an alarm to end
async function startBlocking(durationMinutes) {
  const blockedSites = await getBlockedSites();
  if (!blockedSites || blockedSites.length === 0) {
    // nothing to block
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Focus Blocker",
      message: "No sites are configured to block. Open options to add sites."
    });
    return;
  }

  // Create rules with unique numeric ids
  const ruleIds = [];
  const addRules = blockedSites.map((site, idx) => {
    const id = Date.now() % 1000000000 + idx + Math.floor(Math.random() * 1000);
    ruleIds.push(id);
    return makeRule(id, site);
  });

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules, removeRuleIds: [] });
    await saveActiveRules(ruleIds);

    // create alarm to end blocking
    await chrome.alarms.create("end_block", { delayInMinutes: Number(durationMinutes) });

    // save metadata: end timestamp
    const endTime = Date.now() + durationMinutes * 60 * 1000;
    await chrome.storage.local.set({ blockEnd: endTime, isBlocking: true });

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Focus Blocker",
      message: `Blocking started for ${durationMinutes} minute(s). Stay focused!`
    });

  } catch (err) {
    console.error("Failed to add rules:", err);
  }
}

// Stop blocking: remove dynamic rules and clear alarm
async function stopBlocking() {
  const activeIds = await getActiveRules();
  if (activeIds && activeIds.length > 0) {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({ addRules: [], removeRuleIds: activeIds });
    } catch (err) {
      console.error("Failed to remove rules:", err);
    }
  }
  await chrome.alarms.clear("end_block");
  await saveActiveRules([]);
  await chrome.storage.local.set({ blockEnd: 0, isBlocking: false });
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Focus Blocker",
    message: "Blocking stopped."
  });
}

// Listen for commands from popup/options
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  (async () => {
    if (msg && msg.type === "start") {
      await startBlocking(msg.durationMinutes);
      respond({ status: "started" });
    } else if (msg && msg.type === "stop") {
      await stopBlocking();
      respond({ status: "stopped" });
    } else if (msg && msg.type === "getStatus") {
      const data = await chrome.storage.local.get({ isBlocking: false, blockEnd: 0 });
      respond({ isBlocking: data.isBlocking, blockEnd: data.blockEnd });
    }
  })();
  // Return true to indicate we will call respond asynchronously
  return true;
});

// Alarm handler: when time's up, stop blocking
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "end_block") {
    await stopBlocking();
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Focus Blocker",
      message: "Block period ended — you can now access your sites."
    });
  }
});
