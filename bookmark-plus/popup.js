
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  document.getElementsByName("name")[0].value=tab.title;
  document.getElementsByName("url")[0].value=tab.url;
  return tab;
}

getCurrentTab()


