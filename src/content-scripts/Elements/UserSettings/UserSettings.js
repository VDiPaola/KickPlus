import { elementBuilder, feather, getWindowWidth } from "../../classes/Helpers";
import settingsIcon from './settingsIcon.svg'
import { UserSettings } from "../../Features/UserSettings";
import { Draggable } from "../functionality";
import { AccessibilityTab, FeaturesTab, GeneralTab } from "./tabs";
import { Logger } from "../../Features/Logger";

export class SettingsButton{
    static create(){
        const container = document.createElement("div");
        elementBuilder("button", {
            className:"my-1 mr-3 rounded-full p-2 transition-colors hover:bg-secondary-light md:mr-1", innerHTML:settingsIcon
        }, container);
        return container;
    }
}

export class SettingsWindow extends Draggable{
    static tabs={}
    static #content;
    static create(){
        //containers
        const container = elementBuilder("div", {className:"hidden flex flex-column settings-container"}, document.body);
        const header = elementBuilder("div", {className:"settings-header flex w-full justify-right"}, container);
        this.dragElement(header, container);
        elementBuilder("div", {innerText:"Kick Plus Settings", className:"flex justify-center flex-grow"}, header);
        //x to close
        const crossSpan = elementBuilder("span", {className:"pointer", innerHTML:feather.icons.x.toSvg()}, header);
        crossSpan.addEventListener("click", (e)=>{
            UserSettings.hide();
        })
        const body = elementBuilder("div", {className:"flex flex-grow"}, container);

        const tabs = elementBuilder("div", {className:"h-full settings-tabs"}, body);
        this.#content = elementBuilder("div", {className:"flex-grow"}, body);

        //tabs
        this.#createTabs();
        const tabNames = Object.keys(this.tabs);
        for(let tabName of tabNames){
            const tab = elementBuilder("div", {className:"w-full text-center", innerText:tabName}, tabs);
            tab.addEventListener("click", (e)=>{
                this.setContentTab(tabName);
            })
        }

        //first tab content
        this.setContentTab(tabNames[0]);

        container.style.right = 0;

        return container;
    }

    static setContentTab(tabName){
        if(this.tabs[tabName]){
            this.#content.innerHTML = "";
            this.#content.appendChild(this.tabs[tabName]);
        }
    }

    static #createTabs(){
        FeaturesTab.create();
        GeneralTab.create();
        AccessibilityTab.create();
    }

}

export class SettingsTab{
    name;
    container;
    constructor(_name){
        //creates a settings tab and adds to tabs object
        const container = elementBuilder("div", {className:"w-full h-full flex flex-column settings-content"}, document.body);
        SettingsWindow.tabs[_name] = container;
        this.name = _name;
        this.container = container;
    }

    addCheckBox(text, setting, callback=null){
        //create element
        const container = elementBuilder("div",{className:"flex"},this.container);
        elementBuilder("p", {innerText:text}, container);
        const checkboxContainer = elementBuilder("div",{className:"flex justify-center items-center"},container);
        const checkbox = elementBuilder("input", {type:"checkbox"}, checkboxContainer);
        //get default value
        setting.Get()
        .then((isChecked)=>{checkbox.checked = isChecked;})
        
        //update setting when toggle checkbox
        checkbox.addEventListener("change", (e)=>{
            setting.Set(e.target.checked)
            .catch(err=> {
                Logger.error("Failed to update chrome storage", err, true);
                e.target.checked = !e.target.checked;
            })
            .finally(()=>{
                if(callback) callback(e.target.checked);
            })
        });
    }

    addDropdown(text, values, setting, callback=null){
        //create element
        const container = elementBuilder("div",{className:"flex items-center"},this.container);
        elementBuilder("p", {innerText:text}, container);
        const select = elementBuilder("select",{className:"flex justify-center items-center color-black"},container);

        //get default value
        setting.Get()
        .then((currentValue)=>{
            for(let value of values){
                const attributes = {innerText:value};
                if (value == currentValue) attributes["selected"] = true;
                elementBuilder("option", attributes , select);
            }
        })

        
        //update setting when select option
        select.addEventListener("change", ()=>{
            setting.Set(select.options[select.options.selectedIndex].text)
            .catch(err=> {
                Logger.error("Failed to update chrome storage", err, true);
            })
            .finally(()=>{
                if(callback) callback(select.options[select.options.selectedIndex].text);
            })
        });
    }


    addTextInput(text, placeholder, callback=null, setting=null){
        //create element
        const container = elementBuilder("div",{className:"flex items-center"},this.container);
        elementBuilder("p", {innerText:text}, container);
        const input = elementBuilder("input",{className:"flex justify-center items-center color-black", type:"text", placeholder},container);

        if(callback){
            input.addEventListener("keyup", function(e) {
                e.preventDefault();
                if (e.key === "Enter") {
                    callback?.(e.target.value);
                }
            });
        }

    }
}