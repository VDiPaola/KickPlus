import { GlobalSetting } from "../../classes-shared/Settings";
import { Logger } from "./Logger";

const defaultFontSize = .875;
const defaultLineHeight = 1.8;
const defaultImageSize = 1.5;
const defaultSvgSize = 1.25;
export class ChatFontSize{
    static chatContainer;
    static update(chatContainer){
        this.chatContainer = chatContainer;
        GlobalSetting.CHAT_FONT_SIZE.Get()
        .then(value => {
            if(isNaN(value)) {this.disable()}
            else this.set(value);
        })
    }
    static set(multiplier){
        try{
            if(!this.chatContainer) {
                this.chatContainer = document.querySelector(".chat-container .chatroom,.chatroom");
            }
            document.body.style.setProperty("--kp-default-chat-font-size", (defaultFontSize*multiplier) + "rem")
            document.body.style.setProperty("--kp-default-chat-line-height", (defaultLineHeight*multiplier) + "rem")
            document.body.style.setProperty("--kp-default-chat-image-size", (defaultImageSize*multiplier) + "rem")
            document.body.style.setProperty("--kp-default-chat-svg-size", (defaultSvgSize*multiplier) + "rem")
            this.chatContainer.classList.add("kp-fontsize")
        }catch(e){
            Logger.error("Could not set font size", e);
        }
    }
    static disable(){
        if(!this.chatContainer) return;
        this.chatContainer.classList.remove("kp-fontsize");
    }
}