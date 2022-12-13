import { NetworkManager } from "../../classes-shared/networkManager";
import { KickPlus } from "../main";

export class EmoteGrabber{
    static #isOn=false;
    static #currentElement=null;

    static #handleContextMenu = (e)=>{
        console.log("a")
        if(!this.#isOn) return null;
        this.#currentElement = e.target;
    }
    static #handleOnMessage = (data)=>{
        if(!this.#isOn) return true;
        if (data.type === "emoteGrabber"){
            //make sure its an emote
            const emoteName = this.#currentElement?.alt;
            console.log(KickPlus.streamerData)
            console.log(emoteName)
            console.log(KickPlus.emoteKeys.includes(emoteName))
            if(KickPlus.streamerData && emoteName && KickPlus.emoteKeys.includes(emoteName)){
                //try to add the emote
                try{
                    NetworkManager.addEmote(emoteName, KickPlus.streamerData.emotes[emoteName])
                    .then(()=>{console.log("KickPlus: adding emote")})
                    .catch(()=>{console.error("KickPlus: failed adding emote")})
                }catch{
                    console.error("KickPlus: failed getting uuid")
                }
                
            }
            
        }else{
            return true;
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