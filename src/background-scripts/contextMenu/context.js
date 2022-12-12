
chrome.runtime.onInstalled.addListener( () => {
  chrome.contextMenus.create({
    id: 'kp',
    title: "Kick Plus", 
    contexts:[ "image" ],
    documentUrlPatterns: ["*://kick.com/*"]
  });

  chrome.contextMenus.create({
    parentId: 'kp',
    id: "emoteGrabber",
    title: "Add emote to your channel", 
    contexts:[ "image" ]
  });

});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
  if (info.parentMenuItemId == "kp") {
        if(info.menuItemId == "emoteGrabber"){
            chrome.tabs.sendMessage(tab.id, {type:"emoteGrabber"}, {frameId: info.frameId});
        }
  }
});
