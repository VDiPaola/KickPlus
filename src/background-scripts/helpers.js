
import { BROWSER } from "../content-scripts/classes/Helpers";


//executes function in main 'world'
export async function execScript(tabId, func, args=[]) {
    const [{result}] = await BROWSER.scripting.executeScript({
      func,
      args,
      target: {
        tabId: tabId ??
          (await BROWSER.tabs.query({active: true, currentWindow: true}))[0].id
      },
      world: 'MAIN',
    });
    return result;
}

//gets current tab
export async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await BROWSER.tabs.query(queryOptions);
    return tab;
}
