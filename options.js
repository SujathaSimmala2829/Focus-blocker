// options.js
const input = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("sitesList");

async function loadList() {
  const data = await chrome.storage.sync.get({ blockedSites: [] });
  const sites = data.blockedSites || [];
  listEl.innerHTML = "";
  sites.forEach((s, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${s}</strong> <button data-idx="${idx}">Remove</button>`;
    listEl.appendChild(li);
  });
}

addBtn.addEventListener("click", async () => {
  const val = input.value.trim();
  if (!val) return;
  const data = await chrome.storage.sync.get({ blockedSites: [] });
  const sites = data.blockedSites || [];
  sites.push(val);
  await chrome.storage.sync.set({ blockedSites: sites });
  input.value = "";
  loadList();
});

listEl.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const idx = Number(e.target.dataset.idx);
    const data = await chrome.storage.sync.get({ blockedSites: [] });
    const sites = data.blockedSites || [];
    sites.splice(idx, 1);
    await chrome.storage.sync.set({ blockedSites: sites });
    loadList();
  }
});

document.addEventListener("DOMContentLoaded", loadList);
