// ==UserScript==
// @name         Outlook Calendar Join Teams App
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables join team meeting without confirmation
// @author       Vitor M
// @match        https://outlook.office.com/calendar/view/week
// @icon         https://www.google.com/s2/favicons?domain=office.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function findReactComponent(el) {
    for (const key in el) {
      if (key.startsWith("__reactInternalInstance$")) {
        const fiberNode = el[key];
        return fiberNode && fiberNode.return;
      }
    }
    return null;
  }

  function addLiveEventListener(selector, event, handler) {
    document.querySelector("body").addEventListener(
      event,
      function (evt) {
        var target = evt.target;
        while (target != null) {
          var isMatch = target.matches(selector);
          if (isMatch) {
            handler.call(target, target, evt);
            return;
          }
          target = target.parentElement;
        }
      },
      true
    );
  }

  addLiveEventListener("button[title='Join Teams meeting']", "click", (target, evnt) => {
    evnt.stopPropagation();
    var joinButton = target;
    var reactComponent = findReactComponent(joinButton.parentElement.parentElement);
    var meetingUrl = reactComponent.memoizedProps.item.OnlineMeetingJoinUrl;
    var teamsMeetingUrl = meetingUrl.replace("https://teams.microsoft.com/l/meetup-join/19%3a", "msteams:/l/meetup-join/19:");
    window.open(teamsMeetingUrl);
    //   document.querySelector("body").click();
  });
})();
