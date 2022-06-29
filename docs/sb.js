/* START OF SETTINGS */

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
/* sb.js - SponsorBlock for restrictive environments - by mchangrh

https://github.com/mchangrh/sb.js

Uses SponsorBlock data licensed used under CC BY-NC-SA 4.0 from https://sponsor.ajay.app/

LICENCED UNDER LGPL-3.0-or-later */
const VERSION = "1.0.1"; // version constant

// initial setup
let video, videoID, skipSegments, muteSegments, muteEndTime;

// functions
const getVideoID = () => new URL(window.location.href).searchParams.get("v");

function getJSON (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "json";
  xhr.onload = () =>
    xhr.status == 200 ? callback(null, xhr.response) : callback(xhr.status);
  xhr.send();
}

function trackSkip (uuid) {
  if (!skipTracking) return;
  const url = `${serverEndpoint}/api/viewedVideoSponsorTime?UUID=${uuid}`;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.send();
}

function fetch(videoID) {
  if (!video) return console.log("[SB.js] no video");
  const url = `${serverEndpoint}/api/skipSegments?videoID=${videoID}&categories=${JSON.stringify(categories)}&actionTypes=${JSON.stringify(actionTypes)}`;
  getJSON(url, (err, data) => {
    if (err) return console.error("[SB.js]", "error fetching segments", err);
    skipSegments = new Map(data
      .filter((s) => s.actionType === "skip")
      .map((s) => [s.segment[0], { end: s.segment[1], uuid: s.UUID }])
    );
    muteSegments = new Map(data
      .filter((segment) => segment.actionType === "mute")
      .map((s) => [s.segment[0], { end: s.segment[1], uuid: s.UUID }])
    );
  });
  console.log("[SB.js] Loaded Segments");
}

function skipOrMute() {
  const currentTime = video.currentTime;
  // if mute time is over, unmute video
  if (video.muted && currentTime >= muteEndTime) {
    video.muted = false;
    muteEndTime = 0;
  }
  // check for any skip starts
  const skipEnd = findEndTime(currentTime, skipSegments);
  if (skipEnd) video.currentTime = skipEnd;

  // check for any mute starts
  const muteEnd = findEndTime(currentTime, muteSegments);
  if (muteEnd) {
    video.muted = true;
    muteEndTime = muteEnd;
  }
}

function findEndTime(now, map) {
  let endTime = null;
  for (const startTime of map.keys()) {
    if (
      now + skipThreshold[0] >= startTime &&
      now - startTime <= skipThreshold[1]
    ) {
      const segment = map.get(startTime);
      endTime = segment.end;
      trackSkip(segment.uuid);
      map.delete(startTime); // only use segment once
      for (const overlapStart of map.keys()) {
        // check for overlap
        if (endTime >= overlapStart && overlapStart >= now) {
          // overlapping segment
          const overSegment = map.get(overlapStart);
          endTime = overSegment.end;
          trackSkip(overSegment.uuid)
          map.delete(overlapStart);
        }
      }
      return endTime; // early return
    }
  }
  return endTime;
}

const reset = () => {
  video = null;
  videoID = null;
  muteEndTime = 0;
  skipSegments = [];
  muteSegments = [];
};

function setup() {
  if (videoID === getVideoID()) return // already running correctly
  console.log(`@mchangrh/SB.js ${VERSION} Loaded`);
  // if previewbar exists, exit
  if (document.querySelector("#previewbar")) {
    console.log("[SB.js] Extension Present, Exiting");
    exit();
  }
  video = document.querySelector("video");
  videoID = getVideoID();
  fetch(videoID);
  // listeners
  video.addEventListener("timeupdate", skipOrMute);
}

// main loop
document.addEventListener("yt-navigate-start", reset);
// will start setup once event listener fired
document.addEventListener("yt-navigate-finish", setup);
setup();
