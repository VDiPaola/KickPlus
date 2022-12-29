import { GlobalSetting } from "../../classes-shared/Settings";
import { waitForElement } from "../classes/Helpers";

export class Plus18AutoClick{
    static isWaiting = false;
    static listen(){
        if(this.isWaiting) return;
        this.isWaiting = true;
        waitForElement(document.body, "#headlessui-portal-root button:last-child")
        .then(button => {
            this.isWaiting = false;
            //get setting
            GlobalSetting.PLUS_18_CLICK.Get()
            .then(isEnabled => {
                if(!isEnabled) return;
                //click button
                button.click();
            })
        })
    }
}