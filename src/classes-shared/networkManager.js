import { Token } from "../content-scripts/classes/Helpers";

const API = window.location.origin + "/"

export class NetworkManager{

    static async buildOptions(body){
        const token = await Token.get();
        return (
            {
                "credentials": "include",
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    "X-XSRF-TOKEN": token,
                },
                "body": body,
                "method": "POST",
                "mode": "cors"
            }
        );
       
    }

    //basic get
    static REQUEST(endpoint, option={}){
        return new Promise((resolve,reject)=>{
            fetch(API + endpoint, option)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
    }

    //gets id of user by the given username
    static getUserId = (username) => {
        return this.REQUEST(`api/v1/channels/${username}`);
    }

    //gets the id of current logged in user
    static getCurrentUserId = ()  => {
        return this.REQUEST("api/v1/user");
    }

    static async followUser(channel_id){
        const options = await this.buildOptions("{\"channel_id\":"+channel_id+"}");
        return this.REQUEST("api/v1/channels/user/subscribe", options);
    }
    static async unFollowUser(channel_id){
        const options = await this.buildOptions("{\"channel_id\":"+channel_id+"}");
        return this.REQUEST("api/v1/channels/user/unsubscribe", options);
    }

    static async modUser(user_id){
        const options = await this.buildOptions("{\"user_id\":"+user_id+"}");
        return this.REQUEST("channels/add-user", options);
    }
    static async unModUser(id){
        const options = await this.buildOptions("{\"id\":"+id+"}");
        return this.REQUEST("channels/remove-user", options);
    }
}




//SEND MESSAGE
// fetch("https://kick.com/api/v1/chat-messages", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,zh-TW;q=0.7,zh;q=0.6",
//     "authorization": "Bearer =",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-socket-id": "16303.48819",
//     "x-xsrf-token": "="
//   },
//   "referrer": "https://kick.com/trainwreckstv/chatroom",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"chatroom_id\":715,\"user\":{\"id\":64795,\"username\":\"enzon1k\",\"bio\":null,\"country\":null,\"state\":null,\"city\":null,\"instagram\":null,\"twitter\":null,\"youtube\":null,\"discord\":null,\"tiktok\":null,\"facebook\":null,\"profilepic\":null,\"redirect\":null,\"is_live\":false,\"streamer_channel\":{\"id\":64226,\"user_id\":64795,\"name\":\"enzon1k\",\"slug\":\"enzon1k\",\"playback_url\":\"https://fa723fc1b171.us-west-2.playback.live-video.net/api/video/v1/us-west-2.196233775518.channel.mIQYZBpdvXMe.m3u8\"},\"roles\":[],\"role\":null,\"profile_thumb\":null},\"type\":null,\"message\":\"[emote:1515] test\",\"created_at\":"+Date.now().toString().slice(0,-3)+",\"id\":\"temp_"+Date.now().toString()+"\",\"reactions\":[]}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });

