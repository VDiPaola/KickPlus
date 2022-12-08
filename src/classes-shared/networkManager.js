import { Token } from "../content-scripts/classes/Helpers";

const API = window.location.origin + "/api/v1/"

export class NetworkManager{
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
        return this.REQUEST(`channels/${username}`);
    }

    //gets the id of current logged in user
    static getCurrentUserId = ()  => {
        return this.REQUEST("user");
    }

    static followUser(channel_id){
        return Token.get().then(token => (
             this.REQUEST("channels/user/subscribe", {
                "credentials": "include",
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    "X-XSRF-TOKEN": token,
                },
                "body": "{\"channel_id\":"+channel_id+"}",
                "method": "POST",
                "mode": "cors"
            })
        ))
        .catch(()=>(null))
    }
    static unFollowUser(channel_id){
        return Token.get().then(token => (
             this.REQUEST("channels/user/unsubscribe", {
                "credentials": "include",
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    "X-XSRF-TOKEN": token,
                },
                "body": "{\"channel_id\":"+channel_id+"}",
                "method": "POST",
                "mode": "cors"
            })
        ))
        .catch(()=>(null))
    }
}


