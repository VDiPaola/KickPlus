import { GlobalSetting } from "../../../classes-shared/Settings";
import { SettingsTab } from "./UserSettings";
import {NameTag} from '../Nametag'


export class GeneralTab{
    static create(){
        const tab = new SettingsTab("General");
        tab.addCheckBox("Username in header", GlobalSetting.HEADER_USERNAME, (isChecked)=>{
            if(isChecked) {NameTag.show()}
            else NameTag.hide();
        })
    }
}