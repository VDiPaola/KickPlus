import { elementBuilder, waitForElement } from "../classes/Helpers"
import { Selector } from "../Elements/functionality";
import { SettingsButton, SettingsWindow } from "../Elements/UserSettings/UserSettings";
import { Logger } from "./Logger";

export class UserSettings{
    static #settingsContainer=null;
    static #settingsButtonContainer=null;
    static #isWaiting=false;
    static init(){
        try{
            this.#isWaiting = true;
            //create settings window
            if(!this.#settingsContainer){
                this.#settingsContainer = SettingsWindow.create();
            }

            //wait for container for options button
            waitForElement(document.body, ".chatroom form > div")
            .then(bottomChatContainer => {
                const settingsContainer = bottomChatContainer.querySelector("button[type=submit]:last-child")
                if(!settingsContainer) return;
                this.#isWaiting = false;
                //create settings button element
                if(!this.#settingsButtonContainer){
                    this.#settingsButtonContainer = SettingsButton.create();
                    this.#settingsButtonContainer.addEventListener("click", (()=>{
                        //show settings
                        this.toggleShow();
                    }).bind(this))

                    settingsContainer.prepend(this.#settingsButtonContainer);
                }
            })

        }
        catch(e){
            Logger.error("Failed to initialise UserSettings", e);
        }
    }

    static update(){
        if(!this.#isWaiting){
            this.init();
        }
    }

    static toggleShow(){
        if(this.#settingsContainer?.className?.includes("display-none")){
            this.show();
        }else{
            this.hide();
        }
    }
    static show(){
        this.#settingsContainer?.classList?.remove("display-none");
    }
    static hide(){
        this.#settingsContainer?.classList?.add("display-none");
    }
}