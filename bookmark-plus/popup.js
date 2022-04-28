// 获取当前tab页标题、url、图标信息
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  document.getElementsByName("name")[0].value=tab.title;
  document.getElementsByName("url")[0].value=tab.url;
  document.getElementById("form-favicon").value = tab.favIconUrl;
  chrome.storage.sync.set({ "tips": "暂无提示信息" });
  return tab;
}
getCurrentTab()

// 获取网站类型
function getTypes(){
  let xhr = new XMLHttpRequest();
  let url = "http://localhost:3007/api/dictionary";
  // 设置响应类型为json，返回结果不再需要JSON.parse()
  xhr.responseType = "json";
  xhr.open('GET', url);
  xhr.send();
  xhr.onreadystatechange = function(){
    if (xhr.readyState === XMLHttpRequest.DONE) {   
      let res = xhr.response;
      if(res.meta.status === 200){
        var select=document.getElementById("form-type"); 
        const dicts = res.data.dicts;
        for(var i=0;i<dicts.length;i++){
            var option=document.createElement("option");
            option.setAttribute("value", dicts[i].id);
            option.appendChild(document.createTextNode(dicts[i].name));
            select.appendChild(option);
        }
        select.options[0].selected=true;
        tipShow.innerHTML = `<span style="color: green">${res.meta.msg}</span>`;
      }else {
        aletipShow.innerHTML = `<span style="color: red">${res.meta.msg}</span>`;
      }
    }
  };
}
getTypes()


let formSubmitBtn = document.getElementById("formSubmit");
let tipShow = document.getElementById("tip");
let httpReq;

// 保存按钮点击
formSubmitBtn.addEventListener("click", () => {
  let formUrl = document.getElementById("form-url").value;
  let formName = document.getElementById("form-name").value;
  let formFavicon = document.getElementById("form-favicon").value;
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
  httpReq.send(`name=${encodeURIComponent(formName)}&url=${encodeURIComponent(formUrl)}&favicon=${encodeURIComponent(formFavicon)}&type=${encodeURIComponent(formType)}`);
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
        tipShow.innerHTML = `<span style="color: #FFCC00;">${res.meta.msg}</span>`;
      }else {
        aletipShow.innerHTML = `<span style="color: red">${res.meta.msg}</span>`;
      }
    }
}