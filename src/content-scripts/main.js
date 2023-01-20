import { waitForElement, onElementObserved,onCustomElementObserved } from "./classes/Helpers";

import { ChatUserbox } from "./Elements/ChatUserBox";
import { NetworkManager } from "../classes-shared/networkManager";
import { TheatreMode } from "./Features/TheatreMode";
import {NameTag} from './Elements/Nametag';
import { ChatRoom } from "./Features/ChatRoom";


export class KickPlus{
    static userData=null;
    static streamerData=null;

    static isLoggedIn=false;
    static isStreamer=false;

    static async init (){
        //get user
        this.userData = await NetworkManager.getCurrentUserId();
        

        //make sure they are logged in
        if (this.userData?.username) {
            this.isLoggedIn = true;
            //create name tag in header
            try{NameTag.init(this.userData.username);}
            catch(e){console.error("KickPlus: failed setting name tag \n" + e)}
            
        }

        //check for title change
        onCustomElementObserved(document.head,this.#onPageChange.bind(this));
       
        //initialisation
        try{ChatUserbox.init()}
        catch(e){console.error("KickPlus: ChatUserbox.init \n" + e)}
        try{TheatreMode.init()}
        catch(e){console.error("KickPlus: TheatreMode.init \n" + e)}

        
        this.#getStreamerData();
    }

    static async #getStreamerData(streamerUsername=null){
        try{
            //check if they are in a stream(or chatroom) / get streamer data
            const pathnames = window.location.pathname.split("/").filter(element => element);
            if(window.location.pathname.length > 1 || streamerUsername){
                if(((pathnames.length == 1 || streamerUsername) || pathnames[1] == "chatroom")){
                    //features that dont require streamer data
                    ChatRoom.listen();
                    //get streamer data
                    streamerUsername ??= pathnames[0];
                    NetworkManager.getUserId(streamerUsername)
                    .then(streamerData => {
                        if(streamerData?.user?.username?.toLowerCase() != streamerUsername.toLowerCase()) return;
                        this.streamerData = streamerData;
                        this.isStreamer = streamerUsername == this.userData?.username;

                        //update features
                        ChatUserbox.update();
                        
                    })
                    .catch(err => console.error(err));
                }
            }
        }catch(e){
            console.error("KickPlus: KickPlus.#getStreamerData \n" + e)
        }
    }

    static async #onPageChange(mutations){
        const title = mutations.find(x => x.target?.tagName.toLowerCase() == "title");
        if(title){
            TheatreMode.show();
            const streamer = title.target.innerText.split(" ")[0]
            if(streamer != "kick.com"){
                this.#getStreamerData(streamer);
            }
            
        }
    }
}

window.addEventListener("load", async () => {
    KickPlus.init();
})