//import "./contextMenu/context.js"


chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "token"){
        chrome.cookies.get({name:"XSRF-TOKEN", url:"https://kick.com"})
        .then(token=>{
            chrome.tabs.sendMessage(sender.tab.id, {type:"token", message:token?.value})
        })
    }else{
        return true;
    }
    
});


