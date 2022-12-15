export const feather = require("feather-icons")

//waits for selected element to load
export const waitForElement = (observeEl,selector) => {
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

        observer.observe(observeEl, {
            childList: true,
            subtree: true
        });
    });
}

//waits for selected element to load
export const waitForElements = (observeEl,selector, amount) => {
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

        observer.observe(observeEl, {
            childList: true,
            subtree: true
        });
    });
}

//continuously waits for element to appear
export const onElementObserved = (observeEl,selectorId, callback) => {
    const observer = new MutationObserver(mutations => {
        for(let mutation of mutations){
            if(mutation.addedNodes.length > 0){
                    for(let addedNode of mutation.addedNodes){
                        
                        if(addedNode?.id && addedNode?.id.includes(selectorId)){
                            callback(addedNode);
                        }
                    }
                    
                    
            }
        }
        
    });

    observer.observe(observeEl, {
        childList: true,
        subtree: true
    });
}

//continuously waits for element to appear and returns mutations
export const onCustomElementObserved = (observerEl, callback) => {
    const observer = new MutationObserver(mutations => {
        callback(mutations);
    });

    observer.observe(observerEl, {
        characterData: true,
        subtree: true,
        childList: true
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
                        if(data?.type === "token" && data?.message){
                            const token = decodeURIComponent(data.message ?? "");
                            chrome.runtime.onMessage.removeListener(listener);
                            this.#isListening = false;
                            this.#token = token;
                            resolve(token);
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


export const escapeRegExp = (string) => {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


export function dataURLtoFile(dataurl, filename="image") {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}


export function toDataURL(image, outputFormat) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      return dataURL
  }


export function getWindowWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

export function getWindowHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}