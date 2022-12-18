import { BROWSER } from "../../content-scripts/classes/Helpers";


BROWSER.runtime.onInstalled.addListener( () => {
  BROWSER.contextMenus.create({
    id: 'kp',
    title: "Kick Plus", 
    contexts:[ "image" ],
    documentUrlPatterns: ["*://kick.com/*"]
  });

  BROWSER.contextMenus.create({
    parentId: 'kp',
    id: "emoteGrabber",
    title: "Add emote to your channel", 
    contexts:[ "image" ]
  });

});

BROWSER.contextMenus.onClicked.addListener( ( info, tab ) => {
  if (info.parentMenuItemId == "kp") {
        if(info.menuItemId == "emoteGrabber"){
            BROWSER.tabs.sendMessage(tab.id, {type:"emoteGrabber"}, {frameId: info.frameId});
        }
  }
});
