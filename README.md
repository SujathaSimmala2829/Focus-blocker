# Focus Blocker — Chrome Extension

**Focus Blocker** is a lightweight and easy-to-use Chrome extension designed to help you **stay productive** by temporarily blocking distracting websites for a specified period. Ideal for students, professionals, or anyone who wants to improve focus.

---

## **Features**
- ⏱ **Set Focus Duration:** Choose the number of minutes you want to block distractions.  
- 🚫 **Block Websites:** Add sites like Facebook, YouTube, Instagram, or any domain you find distracting.  
- 🛑 **Custom Blocked Page:** Redirects blocked sites to a friendly reminder page with a “Stay Focused!” message.  
- ⏰ **Automatic Unblocking:** Sites become accessible automatically when the timer ends.  
- ⚙️ **Easy Site Management:** Add, edit, or remove blocked sites via the options page.  
- 🔔 **Notifications:** Alerts when blocking starts, stops, or ends.  
- 🌐 **Wildcard Support:** Use patterns like `||facebook.com` to block subdomains or specific pages.  
- ✅ **Persistent Settings:** Stores blocked sites and session duration using Chrome’s storage.  
- 🛠 **MV3 Compatible:** Uses Chrome Manifest V3 with `declarativeNetRequest` for efficient blocking.

---

## **Folder Structure**

focus-blocker/
├── manifest.json # Chrome extension manifest
├── service_worker.js # Background logic & blocking
├── popup.html # Popup UI
├── popup.js # Popup JS logic
├── options.html # Options page to manage blocked sites
├── options.js # Options page JS
├── blocked.html # Blocked page shown for blocked sites
└── icons/
├── icon16.png
├── icon48.png
└── icon128.png



---

## **Installation**
1. Clone or download the repository:

```bash
git clone https://github.com/YOUR_USERNAME/focus-blocker.git
2.Open Chrome → chrome://extensions/

3.Enable Developer Mode (top-right toggle)

4.Click Load unpacked → Select the focus-blocker folder

5.Click the extension icon in the toolbar


Usage

1.Open the popup by clicking the extension icon.

2.Enter the duration in minutes (default is 25 minutes).

3.Click Start Blocking — all websites in your blocked list will be inaccessible.

4.To stop blocking manually, click Stop Blocking in the popup.

5.Manage blocked sites by clicking Manage blocked sites (options):

   -> Add new websites or patterns

   -> Remove sites you no longer want blocked

Tip: Use patterns like ||facebook.com to block subdomains or youtube.com/watch for specific pages.

How it Works

-->The extension uses Chrome Manifest V3 features.

-->declarativeNetRequest dynamically creates blocking rules for sites you add.

-->A service worker handles alarms, notifications, and rule removal.

-->When a blocked site is accessed, you are redirected to blocked.html with a friendly reminder.

-->The block ends automatically after the set duration or can be stopped manually.



Contributing

-Fork the repository

-Create a branch (git checkout -b feature-name)

-Make your changes

-Commit (git commit -m "Add feature")

-Push (git push origin feature-name)

-Open a Pull Request

License

MIT License © SUJATHA_SIMMALA

Privacy

The extension does not send any data to external servers.

Only stores blocked sites and session information in Chrome’s storage.

Future Improvements

-Temporary whitelist (“allow this site for 10 minutes”)

-Recurring schedules (daily focus hours)

-Analytics: track time saved

-Material-UI/React popup for enhanced UI
