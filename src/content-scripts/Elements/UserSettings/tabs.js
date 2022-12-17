import { GlobalSetting } from "../../../classes-shared/Settings";
import { SettingsTab } from "./UserSettings";
import {NameTag} from '../Nametag'
import { ChatFontSize } from "../../Features/ChatFontSize";


export class GeneralTab{
    static create(){
        const tab = new SettingsTab("General");
        //NameTag
        tab.addCheckBox("Username in header", GlobalSetting.HEADER_USERNAME, (isChecked)=>{
            if(isChecked) {NameTag.show()}
            else NameTag.hide();
        })
        //User Chat Box
        tab.addCheckBox("Open user box on username click", GlobalSetting.CHAT_USER_BOX);
        //Emote Resolver
        tab.addCheckBox("Emote Resolver", GlobalSetting.EMOTE_RESOLVER);
    }
}

export class AccessibilityTab{
    static create(){
        const tab = new SettingsTab("Accessibility");
        tab.addDropdown("Chat Font Size", ["default",0.6,0.8,1,1.2,1.4, 1.6], GlobalSetting.CHAT_FONT_SIZE, (fontMultiplier)=>{
            if(fontMultiplier == "default") {ChatFontSize.disable()}
            else ChatFontSize.set(fontMultiplier);
            
        })
    }
}