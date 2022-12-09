import { Draggable } from "./functionality";
import { elementBuilder } from "../classes/Helpers";
import { NetworkManager } from "../../classes-shared/networkManager";
import { DEFAULT_BANNER_IMAGE, DEFAULT_PFP } from "../classes/assets";
const feather = require("feather-icons")

export class ChatUserbox extends Draggable{
    userData;
    constructor(){
        super()
        this.element = elementBuilder("div", {className:"chatbox-element hidden no-select"});
        this.element.style.backgroundImage = `url('${DEFAULT_BANNER_IMAGE}')`
        const container = elementBuilder("div", {className:"chatbox-container flex flex-column"}, this.element);
        //heading with exit cross
        this.header = elementBuilder("div", {className:"chatbox-header flex w-full justify-right"},container);
        
        const crossSpan = elementBuilder("span", {className:"chatbox-crossSpan pointer", innerHTML:feather.icons.x.toSvg()}, this.header);
        crossSpan.addEventListener("click", (e)=>{
            this.hide();
        })
        

        //container for rest of information
        const body = elementBuilder("div", {className:"chatbox-body flex"}, container);
        const pfpContainer = elementBuilder("div", {className:"chatbox-pfpContainer flex justify-center items-center"}, body);
        this.pfp = elementBuilder("img", {className:"w-8 h-8 w-9 h-9 absolute-cover z-10"}, pfpContainer);

        //container for user details
        const userDetails = elementBuilder("div", {className:"chatbox-userdetails flex  flex-column"}, body);
        this.usernameText = elementBuilder("p", {className:"text-outline pointer"}, userDetails);
        this.usernameText.addEventListener("click", ()=>{
            window.open(`${window.location.origin}/${this.userData?.user?.username}`)
        })
        this.followerCount = elementBuilder("p", {className:"text-outline"}, userDetails);

        //badges container
        const badgesContainer = elementBuilder("div", {className:"chatbox-badges flex"}, container);

        //interactions container
        const interactionsContainer = elementBuilder("div", {className:"chatbox-interactions flex"}, container);

        //follow/unfollow
        this.followButton = elementBuilder("div", {className:"btn kick-btn pointer", innerText:"..."}, interactionsContainer);
        this.followButton.addEventListener("click", ()=>{
            if(this.userData?.id) {
                const innerText = this.followButton.innerText
                if(innerText.includes("Follow")){
                    this.followButton.innerText = "..."
                    NetworkManager.followUser(this.userData.id)
                    .then(()=>{
                        this.followButton.innerText = "Unfollow"
                    })
                    .catch(()=>{this.followButton.innerText = innerText})
                }else if(innerText.includes("Unfollow")){
                    this.followButton.innerText = "..."
                    NetworkManager.unFollowUser(this.userData.id)
                    .then(()=>{
                        this.followButton.innerText = "Follow"
                    })
                    .catch(()=>{this.followButton.innerText = innerText})
                }
                
            }
        })
        //preview
        const previewContainer = elementBuilder("div", {className:"hidden chatbox-previewWrap"}, container);
        const preview = elementBuilder("iframe", {className:"chatbox-preview"}, previewContainer);
        const previewButton = elementBuilder("div", {className:"btn kick-btn pointer", innerText:"Preview"}, interactionsContainer);
        previewButton.addEventListener("click", ()=>{
            if(previewButton.innerText == "Preview"){
                this.prevWidth = this.element.style.getPropertyValue('--width');
                this.element.style.setProperty('--width',  this.prevWidth * 2);
                preview.src = `${window.location.origin}/${this.userData?.user?.username}`
                previewContainer.classList.remove("hidden");
                previewButton.innerText = "Hide Preview";
            }else{
                this.element.style.setProperty('--width',  this.prevWidth);
                previewContainer.classList.add("hidden");
                previewButton.innerText = "Preview";
            }
        })


        document.body.appendChild(this.element);
    }

    hide(){
        this.element.classList.add("hidden");
        this.StopDragElement(this.element);
    }

    show(userData, msgElement, init=false){
        this.userData = userData;
        //set data
        this.pfp.src = userData.user?.profile_pic || DEFAULT_PFP;
        this.usernameText.innerText = userData?.user?.username || DEFAULT_BANNER_IMAGE;
        
        if(!init){
            if(userData?.banner_image?.url){
                this.element.style.setProperty('--chatbox-image', `url('${userData.banner_image.url}')`);
            }
            this.followerCount.innerText = (userData?.followersCount ?? "0") + " followers"
            this.dragElement(this.header, this.element);
            this.followButton.innerText = userData.following ? "Unfollow" : "Follow";
        }else{
            //only on init
            this.followButton.innerText = "...";
            this.followerCount.innerText = ""
            this.element.style.setProperty('--chatbox-image', `url('')`);

            //position
            let rect = msgElement.getBoundingClientRect();
            this.element.style.top = rect.top + "px";
            this.element.style.left = rect.left + "px";
            //size
            const maxWidth = 500;
            this.element.style.setProperty('--width',  rect.width < maxWidth ? rect.width : maxWidth);
        }
        
        this.element.classList.remove("hidden");
    }
}
