/* LICENCED UNDER LGPL-3.0-or-later */
// ==UserScript==
// @name         sb.js userscript loader
// @description  sponsorblock userscript loader
// @namespace    mchang.name
// @homepage     https://github.com/mchangrh/sb.js
// @version      1.0.0
// @match        https://www.youtube.com/watch*
// @require      
// @grant        none
// ==/UserScript==/* START OF SETTINGS */

// https://wiki.sponsor.ajay.app/w/Types
const categories = [
  "sponsor",
  "selfpromo",
  "interaction",
  "intro",
  "outro",
  "preview",
  "music_offtopic",
]
const actionTypes = [
  "skip",
  "mute"
]
const skipThreshold = [0.2, 1] // skip from between time-[0] and time+[1]
const serverEndpoint = "https://sponsor.ajay.app"
const skipTracking = true

/* END OF SETTINGS */
