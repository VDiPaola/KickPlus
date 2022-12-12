import { Draggable } from "./functionality";
import { elementBuilder, feather } from "../classes/Helpers";
import { NetworkManager } from "../../classes-shared/networkManager";
import { DEFAULT_BANNER_IMAGE, DEFAULT_PFP } from "../classes/assets";
import { KickPlus } from "../main";

export class ChatUserbox extends Draggable{
    hasInit=false;
    userData=null;
    static init(){
        this.element = elementBuilder("div", {className:"chatbox-element hidden no-select"});
        this.element.style.backgroundImage = `url('${DEFAULT_BANNER_IMAGE}')`
        const container = elementBuilder("div", {className:"chatbox-container flex flex-column"}, this.element);
        //heading with exit cross
        this.header = elementBuilder("div", {className:"chatbox-header flex w-full justify-right"},container);
        
        const crossSpan = elementBuilder("span", {className:"pointer", innerHTML:feather.icons.x.toSvg()}, this.header);
        crossSpan.addEventListener("click", (e)=>{
            this.hide();
        })
        

        //container for rest of information
        const body = elementBuilder("div", {className:"chatbox-body flex"}, container);
        const pfpContainer = elementBuilder("div", {className:"chatbox-pfpContainer flex justify-center items-center"}, body);
        this.pfp = elementBuilder("img", {className:"absolute-cover z-10"}, pfpContainer);

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

        //FUNCTIONAL BUTTONS
        this.functionalContainer = elementBuilder("div", {className:"flex"}, interactionsContainer);

        //follow/unfollow
        this.followButton = elementBuilder("div", {className:"btn kick-btn pointer", innerText:"..."}, this.functionalContainer);
        this.followButton.addEventListener("click", ()=>{
            if(this.userData?.id) {
                const innerText = this.followButton.innerText
                if(innerText.includes("Follow")){
                    //follow user
                    this.followButton.innerText = "..."
                    NetworkManager.followUser(this.userData.id)
                    .then(()=>{
                        this.followButton.innerText = "Unfollow"
                    })
                    .catch(()=>{this.followButton.innerText = innerText})
                }else if(innerText.includes("Unfollow")){
                    //unfollow user
                    this.followButton.innerText = "..."
                    NetworkManager.unFollowUser(this.userData.id)
                    .then(()=>{
                        this.followButton.innerText = "Follow"
                    })
                    .catch(()=>{this.followButton.innerText = innerText})
                }
                
            }
        })

        //SOCIALS
        const socialsContainer = elementBuilder("div", {className:"flex"}, interactionsContainer);
        const socialsData = {twitter: "https://twitter.com/",instagram:"https://instagram.com/", facebook:"https://facebook.com/",youtube:"https://youtube.com/"}
        this.socials = {}
        for(let social of Object.keys(socialsData)){
            if(feather.icons?.[social]){
                const socialButton = elementBuilder("span", {className:"pointer hidden", innerHTML:feather.icons[social].toSvg()}, socialsContainer);
                socialButton.addEventListener("click", (e)=>{
                    window.open(socialsData[social] + this.userData?.user?.[social], "_blank");
                })
                this.socials[social] = socialButton;
            }
            
        }

        document.body.appendChild(this.element);
    }

    static update(){
        this.hasInit = true;
        //mod button - only show if in your chat
        if(KickPlus.isStreamer){
            this.modButton = elementBuilder("div", {className:"btn kick-btn pointer", innerText:"..."}, this.functionalContainer);
            this.modButton.addEventListener("click", ()=>{
                if(this.userData?.user_id) {
                    const innerText = this.modButton.innerText
                    if(innerText.includes("Mod")){
                        //mod user
                        this.modButton.innerText = "..."
                        NetworkManager.modUser(this.userData.user_id)
                        .then((res)=>{
                            this.modButton.innerText = "Unmod"
                            KickPlus.streamerData.channel_users.push({id:res.id, user_id:this.userData.user_id})
                        })
                        .catch(()=>{this.modButton.innerText = innerText})
                    }else if(innerText.includes("Unmod")){
                        //unmod user
                        this.modButton.innerText = "..."
                        const id = KickPlus.streamerData.channel_users.filter(c => c.user_id == this.userData.user_id)[0].id;
                        NetworkManager.unModUser(id)
                        .then(()=>{
                            this.modButton.innerText = "Mod"
                        })
                        .catch(()=>{this.modButton.innerText = innerText})
                    }
                    
                }
            })
        }
    }

    static hide(){
        this.element.classList.add("hidden");
        this.StopDragElement(this.element);
    }

    static show(userData, msgElement, init=false){
        if(!this.hasInit) return;
        this.userData = userData;
        //set data
        this.pfp.src = this.userData?.user?.profile_pic || DEFAULT_PFP;
        this.usernameText.innerText = this.userData?.user?.username || "";
        
        if(!init){
            if(this.userData?.banner_image?.url){
                this.element.style.setProperty('--chatbox-image', `url('${this.userData.banner_image.url}')`);
            }
            this.followerCount.innerText = (this.userData?.followersCount ?? "0") + " followers"
            this.dragElement(this.header, this.element);
            this.followButton.innerText = this.userData.following ? "Unfollow" : "Follow";
            //MOD BUTTON
            if(KickPlus.isStreamer && KickPlus.streamerData?.channel_users){
                this.modButton.innerText = "Mod";
                const channelUser = KickPlus.streamerData.channel_users.filter(c => c.user_id == this.userData.user_id)[0];
                if(channelUser && channelUser.role == "moderator"){
                    this.modButton.innerText = "Unmod";
                }
            }

            //SOCIAL BUTTONS
            for(let socialName of Object.keys(this.socials)){
                if(this.userData.user?.[socialName]){
                    this.socials[socialName].classList.remove("hidden")
                }
            }
            
            
        }else{
            //only on init - reset values
            if(KickPlus.isStreamer) this.modButton.innerText = "...";
            this.followButton.innerText = "...";
            this.followerCount.innerText = ""
            this.element.style.setProperty('--chatbox-image', `url('')`);
            for(let socialName of Object.keys(this.socials)){
                this.socials[socialName].classList.add("hidden");
            }

            //position
            let rect = msgElement.getBoundingClientRect();
            this.element.style.top = rect.top + "px";
            this.element.style.left = rect.left + "px";
            //size
            const maxWidth = 500;
            this.element.style.width = (rect.width < maxWidth ? rect.width : maxWidth) + "px"
            
        }
        
        this.element.classList.remove("hidden");
    }
}
