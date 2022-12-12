import { Token, dataURLtoFile } from "../content-scripts/classes/Helpers";
const API = window.location.origin + "/"

export class NetworkManager{

    static async buildOptions(body={}, method="POST", hasBearer=true, contentType="application/json"){
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
                "body": JSON.stringify(body),
                "method": method,
                "mode": "cors",
                "credentials": "include"
            };
        if (!hasBearer) {
            delete options.headers["Authorization"];
        }
       return options;
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
        const options = await this.buildOptions({channel_id});
        return this.REQUEST("api/v1/channels/user/subscribe", options);
    }
    static async unFollowUser(channel_id){
        const options = await this.buildOptions({channel_id});
        return this.REQUEST("api/v1/channels/user/unsubscribe", options);
    }

    static async modUser(user_id){
        const options = await this.buildOptions({user_id});
        return this.REQUEST("channels/add-user", options);
    }
    static async unModUser(id){
        const options = await this.buildOptions({id});
        return this.REQUEST("channels/remove-user", options);
    }

    static async addEmote(name, dataURL){
        //adds an emote to your channel
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
            req.onload= async (e)=>{
                //when uploaded make request to add emote to channel
                const options = await this.buildOptions({key:storageData.key,name,uuid:storageData.uuid});
                return this.REQUEST("emotes", options);
            }
            req.send(fileData);
        })
        
        
    }
}
