import { ChatUserbox } from "../Elements/ChatUserBox";
import {DEFAULT_PFP} from "../classes/assets"

import { NetworkManager } from "../../classes-shared/networkManager";

export class ClickableName{
    static handleMessageRecieve(messageContainer){
        //get the username element
        const usernameEl = messageContainer.querySelector("div .message > div > div > div > span");
        //make sure exists
        if (usernameEl) {
            usernameEl.classList.add("chat-username");
            //on click
            usernameEl.addEventListener("click", (e)=>{
                e.preventDefault();
                e.stopPropagation();
                //get user data
                ChatUserbox.show({user:{username:usernameEl.innerText,profile_pic:DEFAULT_PFP}},messageContainer, true);
                NetworkManager.getUserId(usernameEl.innerText)
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