import { NetworkManager } from "../../classes-shared/networkManager";
import { KickPlus } from "../main";
import { Logger } from "./Logger";

export class EmoteGrabber{
    static #isOn=false;
    static #currentElement=null;

    static #handleContextMenu = (e)=>{
        if(!this.#isOn) return null;
        this.#currentElement = e.target;
    }
    static #handleOnMessage = (data)=>{
        try{
            if(!this.#isOn) return true;
            if (data.type === "emoteGrabber"){
                //make sure its an emote
                const emoteName = this.#currentElement?.alt;
                if(KickPlus.streamerData && emoteName && KickPlus.emoteKeys.includes(emoteName)){
                    //try to add the emote
                    NetworkManager.addEmote(emoteName, KickPlus.streamerData.emotes[emoteName])
                    .then(()=>{Logger.log("Emote Added", true)})
                    .catch((e)=>{Logger.error("Failed adding emote", e, true)})
                }
                
            }else{
                return true;
            }
        }catch(e){
            Logger.error("failed at EmoteGrabber.#handleOnMessage", e);
        }
    }

    static init(){
        if(this.#isOn) return;
        this.on();
    }

    static off(){
        document.removeEventListener("contextmenu", this.#handleContextMenu, true);
        chrome.runtime.onMessage.removeListener(this.#handleOnMessage);
        this.#isOn = false;
    }

    static on(){
        //get element right clicked on
        document.addEventListener("contextmenu", this.#handleContextMenu, true);
        chrome.runtime.onMessage.addListener(this.#handleOnMessage);
        this.#isOn = true;
    }

    static update(){
        if(this.#isOn){
            this.off();
            this.on();
        }else{
            this.off();
        }
        
    }
}