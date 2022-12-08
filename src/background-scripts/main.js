//import "./contextMenu/context.js"

//import background scripts
import Injector from "./injector.js";
import {getCurrentTab, execScript} from './helpers.js'


chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "injector") {
        //intellisense.js
          getCurrentTab().then(tab => {
            if(tab && data.message){
                const func = Injector.onMessage(data.message);
                if(func){
                    execScript(tab.id, func, [data]).then(res => sendResponse(res));
                }
            }
        })
      
    }else if (data.type === "token"){
        chrome.cookies.get({name:"XSRF-TOKEN", url:"https://kick.com"})
        .then(token=>{
            chrome.tabs.sendMessage(sender.tab.id, {type:"token", message:token?.value})
        })
    }else{
        return true;
    }
    
});


