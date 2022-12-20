import { DataTags } from "../content-scripts/classes/DataManager";
import { Token, dataURLtoFile } from "../content-scripts/classes/Helpers";
import { BROWSER } from "../content-scripts/classes/Helpers";
const API = window.location.origin + "/"

const BACKEND = "https://api.enzon1k.com/";

export class NetworkManager{

    static async buildOptions(body=null, method="POST", hasBearer=true, contentType="application/json"){
        const token = await Token.get();
        const options = 
            {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "content-type":contentType,
                    "Authorization": "Bearer " + token,
                    "X-XSRF-TOKEN": token,
                   "x-amz-acl": "public-read",

                },
                "referrer": "https://kick.com/",
                "method": method,
                "mode": "cors",
                "credentials": "include"
            };
        if (!hasBearer) {
            delete options.headers["Authorization"];
        }
        if(body){
            options.body = JSON.stringify(body);
        }
       return options;
    }

    //basic get
    static REQUEST(endpoint, options={}, dataTag){
        BROWSER.runtime.sendMessage({type:"request", url:API+endpoint, options, dataTag})
    }

    //gets id of user by the given username
    static async getUserId(username) {
        const options = await this.buildOptions(null, "GET");
        this.REQUEST(`api/v1/channels/${username}`, options, DataTags.USER_DATA);
    }

    //gets the id of current logged in user
    static async getCurrentUserId(){
        const options = await this.buildOptions(null, "GET");
        this.REQUEST("api/v1/user", options, DataTags.CURRENT_USER_DATA);
    }

    static async followUser(channel_id){
        const options = await this.buildOptions({channel_id});
        this.REQUEST("api/v1/channels/user/subscribe", options, DataTags.FOLLOW_USER);
    }
    static async unFollowUser(channel_id){
        const options = await this.buildOptions({channel_id});
        this.REQUEST("api/v1/channels/user/unsubscribe", options, DataTags.UNFOLLOW_USER);
    }

    static async modUser(user_id){
        const options = await this.buildOptions({user_id});
        this.REQUEST("channels/add-user", options);
    }
    static async unModUser(id){
        const options = await this.buildOptions({id});
        this.REQUEST("channels/remove-user", options);
    }

    //gets image data as base64 from proxy server
    static async proxyImage(url) {
        return new Promise((resolve,reject)=>{
            const options = 
            {
                headers: {
                    "content-type":"application/json"
                },
                body:JSON.stringify({url}),
                method: "POST",
                mode: "cors"
            };
            fetch(BACKEND + "proxy", options)
            .then(res=>res.text())
            .then(res=>resolve(res))
            .catch(err=>reject(err))
        })
    }

    //adds an emote to current users channel
    static async addEmote(name, url){
        //get image data
        this.proxyImage(url)
        .then(async (dataURL)=>{
            const fileData = dataURLtoFile(dataURL)
            //get storage information
            const body = {bucket:"",content_type:fileData.type,expires:"",visibility:"public-read"}
            let options = await this.buildOptions(body);
            this.REQUEST("vapor/signed-storage-url", options)
            .then(async (storageData)=>{
                //create request to upload image file
                options = await this.buildOptions({}, "PUT", false, fileData.type);
                const req = new XMLHttpRequest();
                req.open("PUT", storageData.url);
                for(let h in options.headers){
                    req.setRequestHeader(h,options.headers[h])
                }
                req.onloadend= async (e)=>{
                    //when uploaded make request to add emote to channel
                    const options = await this.buildOptions({key:storageData.key,name,uuid:storageData.uuid});
                    return this.REQUEST("emotes", options);
                }
                req.send(fileData);
            })
        })
        .catch(err=>console.error("Kick Plus: " + err))

    }

}


//see users followed - GET with auth
//https://kick.com/api/v1/channels/followed