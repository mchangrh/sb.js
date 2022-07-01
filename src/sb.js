/* sb.js - SponsorBlock for restrictive environments - by mchangrh

https://github.com/mchangrh/sb.js

Uses SponsorBlock data licensed used under CC BY-NC-SA 4.0 from https://sponsor.ajay.app/

LICENCED UNDER LGPL-3.0-or-later */
const VERSION = "1.1.0"; // version constant

// initial setup
let video, videoID, skipSegments, muteSegments, muteEndTime, videoLabel;

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
    // create full video label
    videoLabel = data.filter((s) => s.actionType === "full")
    createVideoLabel(videoLabel)
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

function createVideoLabel (videoLabel) {
  if (!videoLabel.length) return;
  // await title
  const title = document.querySelector("#title h1, h1.title.ytd-video-primary-info-renderer");
  if (!title) {
    setTimeout(createVideoLabel, 200, videoLabel);
    return
  }
  const category = videoLabel[0].category
  const bgMap = {
    sponsor: "#0d0",
    selfpromo: "#ff0",
    exclusive_access: "#085"
  }
  const fgMap = {
    selfpromo: "#111",
    sponsor: "#fff",
    exclusive_access: "#fff"
  }
  const label = document.createElement("span");
  label.innerText = label
  label.id = "sbjs-videolabel";
  label.style = `color: ${fgMap[category]}; background-color: ${bgMap[category]}; display: flex; margin: 0 5px;`;
  // prepend to title 
  title.style = "display: flex;";
  title.prepend(label);
}

const reset = () => {
  video = undefined;
  videoID = undefined;
  muteEndTime = 0;
  videoLabel = undefined;
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
