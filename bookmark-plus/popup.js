
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  document.getElementsByName("name")[0].value=tab.title;
  document.getElementsByName("url")[0].value=tab.url;
  chrome.storage.sync.set({ "tips": "暂无提示信息" });
  return tab;
}


getCurrentTab()

let formSubmitBtn = document.getElementById("formSubmit");
let tipShow = document.getElementById("tip");


chrome.storage.sync.get("tips", ({ tips }) => {
  tipShow.innerHTML = tips;
});

let httpReq;

// 保存按钮点击
formSubmitBtn.addEventListener("click", () => {
  formSubmit()
});

function formSubmit(){
  let formUrl = document.getElementById("form-url").value;
  let formName = document.getElementById("form-name").value;
  let formType = document.getElementById("form-type").value;

  httpReq = new XMLHttpRequest();
  if(!httpReq){
    alert("没有成功创建XMLHTTP实例");
    return false;
  }

  
  let url = "http://localhost:3007/api/websites";
  console.log("点击"+httpReq.readyState);
  httpReq.open('POST', url, false);
  httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpReq.onreadystatechange = getRes;
  httpReq.send(`name=${encodeURIComponent(formName)}&url=${encodeURIComponent(formUrl)}`);
  console.log("点击"+httpReq.readyState);
}

function getRes(){
  console.log("响应"+httpReq.readyState);
  
    if (httpReq.readyState === XMLHttpRequest.DONE) {
      let res = null;
      if(httpReq.responseText){
        res = JSON.parse(httpReq.responseText)
      }
      
      if (res.meta.status === 201) {
        let tips = `<span style="color: green">${res.meta.msg}</span>`
        chrome.storage.sync.set({ tips });
      } else if(res.meta.status === 422){
        let tips = `<span style="color: red">${res.meta.msg}</span>`
        chrome.storage.sync.set({ tips });
      }else {
        alert('状态码' + httpReq.status);
      }
    }
}