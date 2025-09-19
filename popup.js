// popup.js
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const durationInput = document.getElementById("duration");
const statusDiv = document.getElementById("status");

async function updateStatus() {
  chrome.runtime.sendMessage({ type: "getStatus" }, (resp) => {
    if (resp && resp.isBlocking) {
      const remaining = Math.max(0, Math.round((resp.blockEnd - Date.now()) / 60000));
      statusDiv.textContent = `Blocking active — ${remaining} minute(s) remaining.`;
    } else {
      statusDiv.textContent = "Not blocking.";
    }
  });
}

startBtn.addEventListener("click", () => {
  const minutes = Number(durationInput.value) || 25;
  chrome.runtime.sendMessage({ type: "start", durationMinutes: minutes }, (resp) => {
    updateStatus();
  });
});

stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stop" }, (resp) => {
    updateStatus();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  updateStatus();
  // Optionally refresh status every 10s while popup open
  setInterval(updateStatus, 10000);
});
