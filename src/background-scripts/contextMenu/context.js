
chrome.runtime.onInstalled.addListener( () => {
  chrome.contextMenus.create({
    id: 'kp',
    title: "Kick Plus", 
    contexts:[ "editable" ],
    documentUrlPatterns: ["*://kick.com/*"]
  });

  chrome.contextMenus.create({
    parentId: 'kp',
    id: "test",
    title: "test", 
    contexts:[ "editable" ]
  });

});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
  if (info.parentMenuItemId == "kp") {
        
  }
});
