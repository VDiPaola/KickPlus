import { feather,waitForElement, elementBuilder } from "../classes/Helpers";

export class TheatreMode{
    isObserving=false; //tracks if the observer is on or not
    element = null;
    controlBar = null;
    static show(){
        if(this.element && this.controlBar){
            this.controlBar.remove();
        }
        this.init();
    }
    static init(){
        
        if(this.isObserving) return;
        this.isObserving = true;
        
        //sidebar icons
        const sidebarIcon = feather.icons.sidebar;
        sidebarIcon.attrs.class += " flip-x";
        const toggleButton = elementBuilder("span", {title:"Theatre Mode",className:"pointer flex justify-center items-center custom-tooltip", innerHTML:feather.icons.table.toSvg()});
        let isTheatre = false;
        this.element = toggleButton
        //get control bar element
        waitForElement(document.body,".vjs-control-bar")
        .then(controlBar => {
            if(controlBar == toggleButton.parentNode){
                //keep observing
                this.isObserving = false;
                this.init();
                return;
            }
            this.controlBar = controlBar;
            const nav = document.getElementsByClassName("main-navbar")[0];
            const sidebar = document.getElementsByClassName("sidebar")[0];
            if(!nav || !sidebar) return;
            toggleButton.addEventListener("click", (e)=>{
                if(!isTheatre){
                    //turn on theatre mode
                    toggleButton.innerHTML = sidebarIcon.toSvg();
                    sidebar.classList.add("display-none")
                    nav.classList.add("display-none")
                }else{
                    //turn off theatre mode
                    toggleButton.innerHTML = feather.icons.table.toSvg();
                    sidebar.classList.remove("display-none")
                    nav.classList.remove("display-none")
                }
                isTheatre = !isTheatre;
            })
            controlBar.appendChild(toggleButton);
        })
        .catch(err => console.error(err))
        .finally(()=>{
            this.isObserving=false
        })
    }
}