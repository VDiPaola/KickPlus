function something({a,b,c}){

}


export default class Injector{
  static onMessage(message){
    switch(message){
      case "something":
        return something;
    }
    
  }
}
