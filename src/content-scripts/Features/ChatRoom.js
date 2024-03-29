import { onElementObserved, waitForElement } from "../classes/Helpers";
import { KickPlus } from "../main";
import { ChatFontSize } from "./ChatFontSize";
import { ClickableName } from "./ClickableName";
import { ReactHider } from "./ReactHider";
import { UserSettings } from "./UserSettings";


export class ChatRoom{
    static #isWaiting = false;
    static #isObserving = false;
    static listen(){
        if(this.#isWaiting) return;
        this.#isWaiting = true;
        waitForElement(document.body, ".chat-container .chatroom,.chatroom")
        .then(chatContainer => {
            this.#isWaiting = false;
            //run every time page changes with new chat box
            ReactHider.update(chatContainer);
            UserSettings.update();
            ChatFontSize.update(chatContainer);
            ClickableName.update(chatContainer);

            //observer can only be on once
            if(this.#isObserving) return;
            this.#isObserving = true;
            //run once
            onElementObserved(document.body,"message",this.#onObserved);
        })
    }

    static #onObserved(messageContainer){
        //user chat box when click name
        try{ClickableName.handleMessageRecieve(messageContainer)}
        catch(e){console.error("KickPlus: ClickableName.handleMessageRecieve  \n" + e)}
    
    }
}