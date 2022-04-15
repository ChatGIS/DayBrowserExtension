
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
let httpReq;

// 保存按钮点击
formSubmitBtn.addEventListener("click", () => {
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
  // 设置响应类型为json，返回结果不再需要JSON.parse()
  httpReq.responseType = "json";
  httpReq.open('POST', url, true);
  httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpReq.onreadystatechange = getRes;
  httpReq.send(`name=${encodeURIComponent(formName)}&url=${encodeURIComponent(formUrl)}&type=${encodeURIComponent(formType)}`);
});

// 返回结果处理
function getRes(){
    if (httpReq.readyState === XMLHttpRequest.DONE) {
      // let res = null;
      // 只有XMLHttpRequest是""或者"text"的时候，才有responseText属性
      // if(httpReq.responseText){
      //   res = JSON.parse(httpReq.responseText)
      // }
      
      let res = httpReq.response;
      if (res.meta.status === 201) {
        tipShow.innerHTML = `<span style="color: green">${res.meta.msg}</span>`;
      } else if(res.meta.status === 422){
        tipShow.innerHTML = `<span style="color: yellow;background-color: black;">${res.meta.msg}</span>`;
      }else {
        aletipShow.innerHTML = `<span style="color: red">${res.meta.msg}</span>`;
      }
    }
}