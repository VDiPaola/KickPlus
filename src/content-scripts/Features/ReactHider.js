import { GlobalSetting } from "../../classes-shared/Settings";

export class ReactHider{
    static #chatContainer;
    static update(chatContainer){
        this.#chatContainer = chatContainer;
        //get setting
        GlobalSetting.REACT_HIDER.Get()
        .then(enabled => {
            //if enabled add the class
            if(enabled) {
                this.enable();
            }
        })
    }

    static enable(){
        if(!this.#chatContainer) return;
        this.#chatContainer.classList.add("kp-react-hider");
    }

    static disable(){
        if(!this.#chatContainer) return;
        this.#chatContainer.classList.remove("kp-react-hider");
    }
}