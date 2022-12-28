import { ChatUserbox } from "../Elements/ChatUserBox";
import {DEFAULT_PFP} from "../classes/assets"

import { NetworkManager } from "../../classes-shared/networkManager";

export class ClickableName{
    static handleMessageRecieve(messageContainer){
        //get the username element
        const usernameEl = messageContainer.querySelector("div .message > div > div > div span[style]");
        //make sure exists
        if (usernameEl) {
            usernameEl.classList.add("chat-username");
            //on click
            usernameEl.addEventListener("click", (e)=>{
                e.preventDefault();
                e.stopPropagation();
                //get user data
                const username = usernameEl.childNodes[0].nodeValue.trim();
                ChatUserbox.show({user:{username,profile_pic:DEFAULT_PFP}},messageContainer, true);
                NetworkManager.getUserId(username)
                .then(userData => {
                    if(userData && userData.user){
                        //show the user chat box
                        ChatUserbox.show(userData,messageContainer);
                    }
                    
                })
                .catch(err => console.error(err));
                
            })
        }
    }
}

".message > div > div > div:last-child[class]:has(div[class])"