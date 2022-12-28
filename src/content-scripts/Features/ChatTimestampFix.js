export class ChatTimestampFix{
    static handleMessageRecieve(messageContainer){
        //get the timestamp element
        const timeStampEl = messageContainer.querySelector("div .message > div > div > div span:first-child");
        if(timeStampEl?.textContent?.includes("Invalid Date")){
            //replace with current time
            timeStampEl.textContent = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" }).replace(" ","");
        }
    }
}