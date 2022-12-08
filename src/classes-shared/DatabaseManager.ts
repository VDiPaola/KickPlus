export type CacheType = {
    data: any;
    timestamp: number;
}


export enum CACHE_KEYS {
    CURRENT_USER_DATA = "GET_CURRENT_USER",
    USER_DATA = "GET_USER",
    USER_FOLLOW = "USER_FOLLOW"
}

type CacheDataType = {
    minutesUntilRefresh: number
}

export class CacheManager{
    private static _cache = new Map<CACHE_KEYS, CacheType>();
    private static _CACHE_DATA: Record<CACHE_KEYS, CacheDataType> = {
        [CACHE_KEYS.CURRENT_USER_DATA]:{minutesUntilRefresh: 10},
        [CACHE_KEYS.USER_DATA]:{minutesUntilRefresh: 60},
        [CACHE_KEYS.USER_FOLLOW]:{minutesUntilRefresh: 60*12},
    };

    //gets the data from cache, if enough time passed with refresh the data
    static get(key:CACHE_KEYS): Promise<any>{
        return new Promise((resolve,reject)=> {
            if(!this._CACHE_DATA[key]) {
                console.error(`CACHE_DATA doesnt have a key for ${key}`)
                reject();
            }
        
            //key exists in cache and (current date - last updated date) in minutes is less than the threshold
            if(this.has(key) &&  
            ((Date.now() -  this._cache.get(key)!.timestamp) /1000)/60 < this._CACHE_DATA[key]!.minutesUntilRefresh){
                //return the cached data
                resolve(this._cache.get(key)!.data)
            }else{
                reject();
            }
        })
    }
    static has(key:CACHE_KEYS): Boolean{
        return this._cache.has(key);
    }
    static set(key:CACHE_KEYS, data:any): CacheType{
        const cacheData = {data, timestamp: Date.now()};
        this._cache.set(key, cacheData);
        return cacheData;
    }
}




