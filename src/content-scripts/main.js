import { waitForElement, onElementObserved,escapeRegExp } from "./classes/Helpers";
import {DEFAULT_PFP} from "./classes/assets"
import { ChatUserbox } from "./Elements/ChatUserBox";
import { NetworkManager } from "../classes-shared/networkManager";

window.addEventListener("load", async () => {
    //Add name to header
    const user = await NetworkManager.getCurrentUserId();
    console.log(user)
    //make sure they are logged in
    if (user.username) {
        //set name next to pfp
        waitForElement(".main-navbar .profile-picture")
        .then(el => {
            //REFACTOR
            const span = document.createElement("span");
            span.innerHTML = user.username;
            span.className = "username";
            const parent = el.parentElement;
            parent.classList.add("custom-btn");
            parent.classList.remove("hidden");
            parent.prepend(span);
        })
    }
    
    //make sure they are in a stream or chatroom
    const pathnames = window.location.pathname.split("/");
    const streamerUsername = pathnames[1];

    let userChatBoxElement;
    if(window.location.pathname.length > 1 
        && (pathnames.length == 2
        || pathnames[2] == "chatroom")){
            
            NetworkManager.getUserId(streamerUsername)
            .then(streamerData => {
                //init chat user box
                userChatBoxElement = new ChatUserbox(streamerData, streamerUsername == user.username);
                streamerData.emotes = streamerData.emotes.reduce((obj, item) => (obj[item.name] = item.image.full, obj) ,{});
                const emoteKeys = Object.keys(streamerData.emotes);
                onElementObserved("message",(messageContainer)=>{
                    //user chat box when click name
                    userChatBox(messageContainer);

                    //resolve emotes from current stream
                    if(emoteKeys && emoteKeys.length > 0){
                        resolveEmotes(messageContainer, streamerData, emoteKeys);
                    }
                    
                });
            })
            .catch(err => console.error(err));
            
    }


    function resolveEmotes(messageContainer, streamerData, emoteKeys){
        //get message element
        const messageElement = messageContainer.querySelector("div .message > div > div > div > span:last-child");
        if(!messageElement) return;
        const words = messageElement.innerText.split(" ");
        const replaceEmote = (emoteName) => {
            //function to replace word with emote
            messageElement.innerHTML = messageElement.innerHTML.replace(
                new RegExp(`\\b${escapeRegExp(emoteName)}\\b`, "g"), 
                `<div class='w-6 h-6 inline-block align-middle'><img src='${streamerData.emotes[emoteName]}' alt='${emoteName}' title='${emoteName}' class='w-full object-contain top-0 left-0' /></div>`);
        }
        //loop through words to check if its an emote
        for(let word of words){
            if(emoteKeys.includes(word)){
                //replace word with emote
                replaceEmote(word);
            }
        }
    }



    function userChatBox(messageContainer){
        //get the username element
        const usernameEl = messageContainer.querySelector("div .message > div > div > div > span");
        if (usernameEl) {
            usernameEl.classList.add("chat-username");
            usernameEl.addEventListener("click", (e)=>{
                e.preventDefault();
                e.stopPropagation();
                //get user data
                userChatBoxElement.show({user:{username:usernameEl.innerHTML,profile_pic:DEFAULT_PFP}},messageContainer, true);
                NetworkManager.getUserId(usernameEl.innerHTML)
                .then(userData => {
                    if(userData && userData.user){
                        userChatBoxElement.show(userData,messageContainer);
                    }
                    
                })
                .catch(err => console.error(err));
                
            })
        }
    }




})