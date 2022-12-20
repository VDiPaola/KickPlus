import { NetworkManager } from "../../classes-shared/networkManager";
import { Logger } from "../Features/Logger";
import {BROWSER} from './Helpers'

export class DataTags{
    static USER_DATA = "USER_DATA";
    static CURRENT_USER_DATA = "CURRENT_USER_DATA";
    static FOLLOW_USER = "FOLLOW_USER";
    static UNFOLLOW_USER = "UNFOLLOW_USER";
}

export class DataManager{
    static #hasInit = false;
    static #data = {};
    static #dataCallbacks = {}; //callback functions bound to data tags e.g. {USER_DATA=[callback]}

    static #listener = (data) => {
        //when recieve request response from background script
        if(data?.type === "response"){
            if(data.message){
                this.#set(data.dataTag, data.message);
            }else{
                Logger.error("Failed request", data.error);
            }
            for(let callback of this.#dataCallbacks[data.dataTag] || []){
                callback({value:data.message, error:data.error});
            }
        }
        return true;
    }
    static init(){
        if(this.#hasInit) return;
        this.#hasInit = true;
        //get initial values
        BROWSER.runtime.onMessage.addListener(this.#listener);
        NetworkManager.getCurrentUserId();
    }

    static bindCallback(dataTag, callback){
        //push callback function to data callbacks
        if(!this.#dataCallbacks[dataTag]) this.#dataCallbacks[dataTag] = [];
        this.#dataCallbacks[dataTag].push(callback);
    }

    static unBindCallback(dataTag, callback){
        //remove callback function from data callbacks
        if(this.#dataCallbacks[dataTag]) {
            const index = this.#dataCallbacks[dataTag.indexOf].indexOf(callback);
            if (index !== -1) this.#dataCallbacks[dataTag.indexOf].splice(index, 1);
        }
    }


    static #set(dataTag,value){
        this.#data[dataTag] = value;
    }

    static get(dataTag){
        return this.#data[dataTag];
    }
}