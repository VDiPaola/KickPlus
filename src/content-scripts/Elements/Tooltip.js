export class Tooltip{
    constructor(text){
        this.element = document.createElement("span");
        this.element.innerHTML = text;
        this.element.className = "tooltiptext";
    }

    setPosToMouse(){
        let width = span.offsetWidth;
        let height = span.offsetHeight;
        span.style.left = (e.pageX - width/2) + 'px';
        span.style.top = (e.pageY - height) + 'px';
    }
}
