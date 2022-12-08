import { CacheManager } from "./CacheManager";

const API = window.location.origin + "/api/v1/"

export class NetworkManager{
    //basic get
    static GET(url){
        return new Promise((resolve,reject)=>{
            fetch(url)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
    }

    //gets id of user by the given username
    static getUserId = (username) => {
        CacheManager.get
        return this.GET(`${API}channels/${username}`);
    }

    //gets the id of current logged in user
    static getCurrentUserId = ()  => {
        return this.GET(API+"user");
    }

    static followUser(channel_id, token){
        fetch(API + "channels/user/subscribe", {
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
        });
    }
}


