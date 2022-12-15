
export class Logger{
    static log(message, display=false){
        console.log(message)
    }
    static error(message, error=null, display=false){
        console.error(`Kick Plus: ${message} ${error ? "\n Additional information: " + error : ""}`)
    }
}