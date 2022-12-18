import { GlobalSetting } from "../../classes-shared/Settings";
import { waitForElement } from "../classes/Helpers";

export class NameTag{
    static #container;
    static #usernameElement;
   static init(username){
    //set name next to pfp
    waitForElement(document.body,".main-navbar .profile-picture")
    .then(el => {
        //create element
        this.#usernameElement = document.createElement("span");
        this.#usernameElement.innerHTML = username;
        this.#usernameElement.className = "username";
        this.#container = el.parentElement;
        this.#container.classList.add("custom-btn");
        this.#container.classList.remove("display-none");

        //hide if disabled in settings
        GlobalSetting.HEADER_USERNAME.Get()
        .then(isChecked => {if(!isChecked) this.hide()})

        //add to DOM
        this.#container.prepend(this.#usernameElement);
    })
   }

   static hide(){
        this.#container?.classList?.remove("custom-btn");
        this.#usernameElement?.classList?.add("display-none");
   }

   static show(){
        this.#container?.classList?.add("custom-btn");
        this.#usernameElement?.classList?.remove("display-none");
   }
}