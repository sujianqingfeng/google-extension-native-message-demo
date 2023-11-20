const CONTEXT_MENU_ID = "context-menu";

chrome.runtime.onInstalled.addListener(function () {
  // 创建右键菜单项
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "port",
    contexts: ["page", "selection", "link", "image"],
  });

  // 添加点击事件处理程序
  chrome.contextMenus.onClicked.addListener(onClickHandler);
});

// 处理右键菜单项点击事件
function onClickHandler(info, tab) {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    // 在这里执行你想要的操作
    const { selectionText } = info;
    // 提取数字
    const numbers = selectionText.match(/\d+/g);
    if (numbers && numbers.length) {
      const port = numbers[0];
      if (+port > 1000) {
        sendNativeMessage(port);
      }
    }
  }
}

let port = null;
function sendNativeMessage(shellPort) {
  if (!port) {
    port = chrome.runtime.connectNative("com.execute");
  }
  port.onMessage.addListener(function (msg) {
    console.log("Received：" + msg);
  });
  port.onDisconnect.addListener(function () {
    console.log("Disconnected");
    port = null;
  });
  port.postMessage(shellPort);
}
