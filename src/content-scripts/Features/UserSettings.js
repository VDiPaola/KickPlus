import { elementBuilder, waitForElement } from "../classes/Helpers"
import { SettingsButton, SettingsWindow } from "../Elements/UserSettings/UserSettings";
import { Logger } from "./Logger";

export class UserSettings{
    static #settingsContainer=null;
    static #settingsButtonContainer=null;
    static #isWaiting=false;
    static update(){
        try{
            if(this.#isWaiting) return;
            this.#isWaiting = true;
            //wait for container for options button
            waitForElement(document.body, ".chatroom form > div:has(button[type=button]):last-child")
            .then(settingsContainer => {
                this.#isWaiting = false;
                //create settings button element
                if(!settingsContainer.contains(this.#settingsButtonContainer)){
                    this.#settingsButtonContainer = SettingsButton.create();
                    this.#settingsButtonContainer.addEventListener("click", (()=>{
                        //show settings
                        this.toggleShow();
                    }).bind(this))

                    settingsContainer.prepend(this.#settingsButtonContainer);
                }
            })


            //create settings window
            if(!this.#settingsContainer){
                this.#settingsContainer = SettingsWindow.create();
            }
        }
        catch(e){
            Logger.error("Failed to initialise UserSettings", e);
        }
    }

    static toggleShow(){
        if(this.#settingsContainer?.className?.includes("hidden")){
            this.show();
        }else{
            this.hide();
        }
    }
    static show(){
        this.#settingsContainer?.classList?.remove("hidden");
    }
    static hide(){
        this.#settingsContainer?.classList?.add("hidden");
    }
}