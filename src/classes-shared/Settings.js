
class Setting{
    constructor(key, defaultValue, local=false){
        this.key = key;
        this.defaultValue = defaultValue;
        this.local = local;
    }

    Get(){
        return new Promise((resolve, reject)=>{
            if(this.local){
                LocalSetting.Get(this.key).then(value=>{
                    let res = value[this.key] ?? this.defaultValue;
                    resolve(res);
                })
                .catch(err => reject(err));
            }else{
                GlobalSetting.Get(this.key).then(value=>{
                    let res = value[this.key] ?? this.defaultValue;
                    resolve(res);
                })
                .catch(err => reject(err));
            }
        })
    }

    Set(value){
        return new Promise((resolve, reject)=>{
            if(this.local){
                LocalSetting.Set(this.key, value).then(value=>{
                    resolve(value);
                })
                .catch(err => reject(err));
            }else{
                GlobalSetting.Set(this.key, value).then(value=>{
                    resolve(value);
                })
                .catch(err => reject(err));
            }
        })
    }
}


export class GlobalSetting {
    static CASE_SENSITIVE = new Setting('CASE_SENSITIVE', false);

    static Get(keys){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(keys, (result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({[key]: value}, (result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
    
}

export class LocalSetting {
    static A = new Setting('A', false, true);

    static Get(keys){
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(keys, (result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({[key]: value}, (result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
}