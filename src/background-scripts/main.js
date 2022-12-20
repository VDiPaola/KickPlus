import "./contextMenu/context.js"
import { BROWSER } from "../content-scripts/classes/Helpers.js";
import { Logger } from "../content-scripts/Features/Logger.js";


BROWSER.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "token"){
        BROWSER.cookies?.get({name:"XSRF-TOKEN", url:"https://kick.com"})
        .then(token=>{
            BROWSER.tabs.sendMessage(sender.tab.id, {type:"token", message:token?.value})
        })
        .catch(err => Logger.error("Couldnt get token from cookies", err, true))
        .finally(()=>{return true})
    }else if (data.type == "request" && data.dataTag){
        fetch(data.url, data.options)
            .then(res => res.json())
            .then(res => BROWSER.tabs.sendMessage(sender.tab.id, {type:"response", message:res, dataTag:data.dataTag}))
            .catch(err => BROWSER.tabs.sendMessage(sender.tab.id, {type:"response", error:err, dataTag:data.dataTag}));
    }else{
        return true;
    }
    
});

// BROWSER.webRequest.onBeforeRequest.addListener(
//     (req)=>{console.log(req)},
//     {urls:["*://*.kick.com/*", "*://kick.com/*"]}
// )