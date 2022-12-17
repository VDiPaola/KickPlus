import { GlobalSetting } from "../../classes-shared/Settings";
import { escapeRegExp } from "../classes/Helpers";
import { KickPlus } from "../main";

export class EmoteResolver{
    static resolve(messageContainer){
        //make sure its enabled
        GlobalSetting.EMOTE_RESOLVER.Get()
        .then(isEnabled => {
            if(!isEnabled) return;
            //get message element
            const messageElement = messageContainer.querySelector("div .message > div > div > div > span:last-child");
            if(!messageElement) return;
            const words = messageElement.innerText.split(" ");
            const replaceEmote = (emoteName) => {
                //function to replace word with emote
                messageElement.innerHTML = messageElement.innerHTML.replace(
                    new RegExp(`\\b${escapeRegExp(emoteName)}\\b`, "g"), 
                    `<div class='w-6 h-6 inline-block align-middle'><img src='${KickPlus.streamerData.emotes[emoteName]}' alt='${emoteName}' title='${emoteName}' class='w-full object-contain top-0 left-0' /></div>`);
            }
            //loop through words to check if its an emote
            for(let word of words){
                if(KickPlus.emoteKeys.includes(word)){
                    //replace word with emote
                    replaceEmote(word);
                }
            }
        })
        
    }
}