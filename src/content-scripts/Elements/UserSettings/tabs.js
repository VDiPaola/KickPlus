import { GlobalSetting } from "../../../classes-shared/Settings";
import { SettingsTab } from "./UserSettings";
import {NameTag} from '../Nametag'
import { ChatFontSize } from "../../Features/ChatFontSize";
import { ReactHider } from "../../Features/ReactHider";
import { ClickableName } from "../../Features/ClickableName";


export class FeaturesTab{
    static create(){
        const tab = new SettingsTab("Features");
        //NameTag
        tab.addCheckBox("Username in header", GlobalSetting.HEADER_USERNAME, (isChecked)=>{
            if(isChecked) {NameTag.show()}
            else NameTag.hide();
        })
        //User Chat Box
        tab.addCheckBox("Open user box on username click", GlobalSetting.CHAT_USER_BOX);
        //React Hider
        tab.addCheckBox("Hide Chat Reacts", GlobalSetting.REACT_HIDER, (isChecked)=>{
            if(isChecked) {ReactHider.enable()}
            else ReactHider.disable();
        });
    }
}

export class GeneralTab{
    static create(){
        const tab = new SettingsTab("General");
        //enter username for user chat box
        tab.addTextInput("User Info Box: ", "username", (text)=>{
            //open user box
            ClickableName.OpenUserBox(text);
        })

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