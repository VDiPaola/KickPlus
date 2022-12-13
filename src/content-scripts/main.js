import { waitForElement, onElementObserved,onCustomElementObserved } from "./classes/Helpers";

import { ChatUserbox } from "./Elements/ChatUserBox";
import { NetworkManager } from "../classes-shared/networkManager";
import { TheatreMode } from "./Features/TheatreMode";
import { EmoteResolver } from "./Features/EmoteResolver";
import {ClickableName} from './Features/ClickableName';
import {NameTag} from './Elements/Nametag';
import { EmoteGrabber } from "./Features/EmoteGrabber";


export class KickPlus{
    static userData=null;
    static streamerData=null;
    static emoteKeys=null;

    static isLoggedIn=false;
    static isStreamer=false;

    static #currentStreamer=null;
    static async init (){
        //get user
        this.user = await NetworkManager.getCurrentUserId();
        

        //make sure they are logged in
        if (this.userData?.username) {
            this.isLoggedIn = true;
            //create name tag in header
            NameTag.init(this.userData.username);
        }

        //check for title change
        onCustomElementObserved(document.head.getElementsByTagName("title")[0],this.#onPageChange.bind(this));

        //initialisation
        ChatUserbox.init();
        TheatreMode.init();
        EmoteGrabber.init();

        this.#getStreamerData();
         
        //constantly observe for chat messages
        waitForElement(document.body,".chat-container,.chatroom")
        .then((chatContainer)=>{
            onElementObserved(document.body,"message",(messageContainer)=>{
                //user chat box when click name
                ClickableName.handleMessageRecieve(messageContainer);

                //resolve emotes
                if(this.emoteKeys && this.emoteKeys.length > 0){
                    EmoteResolver.resolve(messageContainer);
                }
                
            });
        })

    }

    static async #getStreamerData(streamerUsername=null){
        //check if they are in a stream(or chatroom) / get streamer data
        const pathnames = window.location.pathname.split("/");
        streamerUsername ??= pathnames[1];
        if(window.location.pathname.length > 1 
        && (pathnames.length == 2
        || pathnames[2] == "chatroom")){
            //get streamer data
            console.log(streamerUsername)
            this.#currentStreamer = streamerUsername;
            NetworkManager.getUserId(streamerUsername)
            .then(streamerData => {
                if(streamerData?.user?.username?.toLowerCase() != streamerUsername.toLowerCase()) return;
                streamerData.emotes = streamerData.emotes.reduce((obj, item) => (obj[item.name] = item.image.full, obj) ,{});
                this.streamerData = streamerData;
                this.isStreamer = streamerUsername == this.userData?.username;
                //update features
                ChatUserbox.update();
                EmoteGrabber.update();
                this.emoteKeys = Object.keys(streamerData.emotes);
            })
            .catch(err => console.error(err));
        }
    }

    static async #onPageChange(e){
        TheatreMode.show();
        try{
            const streamer = e[0].target.innerText.split(" ")[0]
            this.#getStreamerData(streamer);
        }catch(e){
            console.error("KickPlus: failed to update streamer data \n" + e)
        }
        
    }
}

window.addEventListener("load", async () => {
    KickPlus.init();
})