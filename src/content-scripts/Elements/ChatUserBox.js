import { Draggable } from "./functionality";
import { elementBuilder } from "../classes/Helpers";
const feather = require("feather-icons")

export class ChatUserbox extends Draggable{
    constructor(){
        super()
        this.element = elementBuilder("div", {className:"chatbox-container flex flex-column hidden"}, this.element);document.createElement("div");
        //heading with exit cross
        const header = elementBuilder("div", {className:"chatbox-header flex w-full justify-right"},this.element);
        
        this.dragElement(header, this.element);
        const crossSpan = elementBuilder("span", {className:"chatbox-crossSpan pointer", innerHTML:feather.icons.x.toSvg()}, header);
        crossSpan.addEventListener("click", (e)=>{
            this.hide();
        })
        

        //container for rest of information
        const body = elementBuilder("div", {className:"chatbox-body flex"}, this.element);
        const pfpContainer = elementBuilder("div", {className:"chatbox-pfpContainer flex justify-center items-center"}, body);
        this.pfp = elementBuilder("img", {className:"w-8 h-8 w-9 h-9 absolute-cover z-10"}, pfpContainer);

        //container for user details
        const userDetails = elementBuilder("div", {className:"chatbox-userdetails flex  flex-column"}, body);
        const followageContainer = elementBuilder("div", {className: "flex w-full", innerHTML: feather.icons.heart.toSvg()}, userDetails);

        //content for user details
        this.usernameText = elementBuilder("p", {}, userDetails);
        const followageText = elementBuilder("p", {innerHTML: " Followered long time yeah"}, followageContainer);
        const subbedText = elementBuilder("p", {}, userDetails);


        //badges container
        const badgesContainer = elementBuilder("div", {className:"chatbox-badges flex"}, this.element);

        //interactions container
        const interactionsContainer = elementBuilder("div", {className:"chatbox-interactions flex"}, this.element);
        const followButton = elementBuilder("div", {className:"btn btn-secondary-lightest pointer", innerText:"Follow"}, interactionsContainer);
        const subscribeButton = elementBuilder("div", {className:"btn btn-secondary-lightest pointer", innerText:"Subscribe"}, interactionsContainer);


        document.body.appendChild(this.element);
    }

    hide(){
        this.element.classList.add("hidden");
    }

    show(userData, msgElement){
        //set data
        this.pfp.src = userData.user?.profile_pic ?? this.pfp.src;
        this.usernameText.innerText = userData?.user?.username ?? ""
        this.element.style.backgroundImage = userData?.banner_image?.url ?? ""

        //position
        let rect = msgElement.getBoundingClientRect();
        this.element.style.top = rect.top + "px";
        this.element.style.left = rect.left + "px";
        //size
        this.element.style.width = rect.width + "px";

        this.element.classList.remove("hidden");
    }
}
