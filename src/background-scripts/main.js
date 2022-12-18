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
    }else{
        return true;
    }
    
});