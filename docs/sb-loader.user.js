// ==UserScript==
// @name         sb.js userscript loader
// @description  SponsorBlock userscript loader
// @namespace    mchang.name
// @homepage     https://github.com/mchangrh/sb.js
// @icon         https://mchangrh.github.io/sb.js/icon.png
// @version      1.0.1
// @match        https://www.youtube.com/watch*
// @connect      sponsor.ajay.app
// @require      https://mchangrh.github.io/sb.js/sb-nosettings.min.js
// @grant        none
// ==/UserScript==

/* Uses SponsorBlock data licensed used under CC BY-NC-SA 4.0 from https://sponsor.ajay.app/ */
/* LICENCED UNDER LGPL-3.0-or-later *//* START OF SETTINGS */

// https://wiki.sponsor.ajay.app/w/Types
const categories = [
  "sponsor",
  "selfpromo",
  "interaction",
  "intro",
  "outro",
  "preview",
  "music_offtopic",
  "exclusive_access",
  "poi_highlight"
]
const actionTypes = [
  "skip",
  "mute",
  "full",
  "poi"
]
const skipThreshold = [0.2, 1] // skip from between time-[0] and time+[1]
const serverEndpoint = "https://sponsor.ajay.app"
const skipTracking = true
const highlightKey = "Enter"
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

/* END OF SETTINGS */
