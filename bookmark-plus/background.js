// 创建菜单
chrome.contextMenus.create({
    id: "selectword-save",
    title: "划词保存",
    contexts: ["selection"]
}, () => {
    console.log('contextMenus are create.');
})

chrome.contextMenus.create({
    id: "clearBadge",
    title: "清除徽章",
    contexts: ["page"]
}, () => {
    console.log('contextMenus are create.');
})


// 右键菜单点击监听事件
chrome.contextMenus.onClicked.addListener((info) => {
    if(info.menuItemId == "clearBadge"){
        setBadgeTextAndColor("","#000000");
        return
    }
    fetch("http://localhost:3007/api/english", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `name=${info.selectionText}`
    }).then(response => {
        return response.json();
    }).then(data => {
        if(data.meta.status == "201"){
            setBadgeTextAndColor("Ok", "green");
        } else if(data.meta.status == "422"){
            setBadgeTextAndColor("Have", "#FFCC00");
        } else {
            setBadgeTextAndColor("Err", "red");
        }
        
        // 报错信息：Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
        // setTimeout(setBadgeTextAndColor("","#000000"), 10000)
    })
})

// 设置徽章的文本及颜色
function setBadgeTextAndColor(text, color){
    chrome.action.setBadgeText(
        {text: text},  // Also, also green
        () => {},
    )

    if(color){
        chrome.action.setBadgeBackgroundColor(
            {color: color},  // Also, also green
            () => {}
        )
    }
}