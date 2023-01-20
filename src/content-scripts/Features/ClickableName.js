import { ChatUserbox } from "../Elements/ChatUserBox";
import {DEFAULT_PFP} from "../classes/assets"

import { NetworkManager } from "../../classes-shared/networkManager";
import { Logger } from "./Logger";

export class ClickableName{
    static #messageContainer;

    static update(chatContainer){
        this.#messageContainer = chatContainer;
    }

    static handleMessageRecieve(messageContainer){
        this.#messageContainer = messageContainer;
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
                this.OpenUserBox(username);
                
            })
        }
    }

    static OpenUserBox(username){
        if(this.#messageContainer){
            ChatUserbox.show({user:{username,profile_pic:DEFAULT_PFP}},this.#messageContainer, true);
            NetworkManager.getUserId(username)
            .then(userData => {
                if(userData && userData.user){
                    //show the user chat box
                    ChatUserbox.show(userData,this.#messageContainer);
                }
                
            })
            .catch(err => console.error(err));
        }else{
            Logger.error("No message container found", null, true);
        }
        
    }
}

".message > div > div > div:last-child[class]:has(div[class])"