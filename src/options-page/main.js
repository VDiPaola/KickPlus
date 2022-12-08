import {GlobalSetting} from "../classes-shared/Settings";

window.addEventListener("load", async () => {
    //get settings from storage
    const settingsKeys = Object.keys(GlobalSetting);
    GlobalSetting.Get(settingsKeys).then(settingsObj=> {

    })
    
})