import { BROWSER } from "../src/content-scripts/classes/Helpers";


//gets current tab
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await BROWSER.tabs.query(queryOptions);
    return tab;
}

(async () => {

})()