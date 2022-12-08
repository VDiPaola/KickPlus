import { waitForElement, onElementObserved, DEFAULT_PFP } from "./classes/Helpers";
import { GlobalSetting } from "../classes-shared/Settings";
import { ChatUserbox } from "./Elements/ChatUserBox";
import { NetworkManager } from "../classes-shared/networkManager";


window.addEventListener("load", async () => {
    //INIT custom elements
    const userChatBox = new ChatUserbox();
    //Add name to header
    const user = await NetworkManager.getCurrentUserId();
    //make sure they are logged in
    if (user.username) {
        waitForElement(".main-navbar .profile-picture")
        .then(el => {
            //REDO THIS
            const span = document.createElement("span");
            span.innerHTML = user.username;
            span.className = "username";
            const parent = el.parentElement;
            parent.classList.add("custom-btn");
            parent.classList.remove("hidden");
            parent.prepend(span);
        })
    }
    
   
    //clickable names
    if(window.location.pathname.length > 1 
        && window.location.pathname.split("/").length == 2){
            onElementObserved("message",(messageContainer)=>{
                //get the username element
                let usernameEl = messageContainer.querySelector("div .message > div > div > div > span");
                if (usernameEl) {
                    usernameEl.classList.add("chat-username");
                    usernameEl.addEventListener("click", (e)=>{
                        //get user data
                        userChatBox.show({user:{username:usernameEl.innerHTML,profile_pic:DEFAULT_PFP}},messageContainer);
                        NetworkManager.getUserId(usernameEl.innerHTML)
                        .then(userData => {
                            if(userData && userData.user){
                                userChatBox.show(userData,messageContainer);
                            }
                            
                        })
                        .catch(err => console.error(err));
                        
                    })
                
                }
            });
    }
})