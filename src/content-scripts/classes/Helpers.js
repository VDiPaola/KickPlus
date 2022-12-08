
//waits for selected element to load
export const waitForElement = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

//waits for selected element to load
export const waitForElements = (selector, amount) => {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector).length >= amount) {
            return resolve(document.querySelectorAll(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelectorAll(selector) >= amount) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

//continuously waits for element to appear
export const onElementObserved = (selectorClass, callback) => {
    const observer = new MutationObserver(mutations => {
        for(let mutation of mutations){
            if(mutation.addedNodes.length > 0){
                    for(let addedNode of mutation.addedNodes){
                        
                        if(addedNode?.id && addedNode?.id.includes(selectorClass)){
                            callback(addedNode);
                        }
                    }
                    
                    
            }
        }
        
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

export const elementBuilder = (tagName, elAttributes, parentEl)=>{
    //creates element and sets any attributes passed
    const el = document.createElement(tagName);
    for(let attrKey in elAttributes){
        el[attrKey] = elAttributes[attrKey];
    }
    //append to parent if exist
    if(parentEl) parentEl.appendChild(el);
    return el;
}


export class Token{
    static #token;
    static #isListening = false;

    static get(){
        return new Promise((resolve,reject)=>{
            if(this.#token) resolve(this.#token);
            //listen for background script to send the token back with only 1 lister at a time
            if(!this.#isListening){
                this.#isListening = true;
                const listener = 
                    (data, sender, sendResponse) => {
                        console.log(data)
                        if(data?.type === "token" && data?.message){
                            TOKEN = data.message;
                            chrome.runtime.onMessage.removeListener(listener);
                            this.#isListening = false;
                            this.#token = TOKEN;
                            resolve(TOKEN);
                        }
                        return true;
                    }
                chrome.runtime.onMessage.addListener(listener);
                chrome.runtime.sendMessage({type:"token"})
            }else{
                reject("currently listening for token");
            }
            
        })
        
    }
}