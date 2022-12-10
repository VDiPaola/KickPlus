import { waitForElement } from "../classes/Helpers";

export class NameTag{
   static init(username){
    //set name next to pfp
    waitForElement(document.body,".main-navbar .profile-picture")
    .then(el => {
        //REFACTOR
        const span = document.createElement("span");
        span.innerHTML = username;
        span.className = "username";
        const parent = el.parentElement;
        parent.classList.add("custom-btn");
        parent.classList.remove("hidden");
        parent.prepend(span);
    })
   } 
}