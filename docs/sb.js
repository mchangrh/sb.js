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
/* sb.js - SponsorBlock for restrictive environments - by mchangrh

https://github.com/mchangrh/sb.js

Uses SponsorBlock data licensed used under CC BY-NC-SA 4.0 from https://sponsor.ajay.app/

LICENCED UNDER LGPL-3.0-or-later */
const VERSION = "1.2.1" // version constant

// initial setup
let video, videoID, skipSegments, muteSegments, muteEndTime, videoLabel, poiLabel

// functions
const getVideoID = () => new URL(window.location.href).searchParams.get("v")

function getJSON(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.responseType = "json"
  xhr.onload = () => xhr.status == 200 ? callback(null, xhr.response) : callback(xhr.status)
  xhr.send()
}

function trackSkip(uuid) {
  if (!skipTracking) return
  const url = `${serverEndpoint}/api/viewedVideoSponsorTime?UUID=${uuid}`
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url)
  xhr.send()
}

function fetch(videoID) {
  if (!video) return console.log("[SB.js] no video")
  const url = `${serverEndpoint}/api/skipSegments?videoID=${videoID}&categories=${JSON.stringify(categories)}&actionTypes=${JSON.stringify(actionTypes)}`
  getJSON(url, (err, data) => {
    if (err) return console.error("[SB.js]", "error fetching segments", err)
    skipSegments = new Map(data
      .filter((s) => s.actionType === "skip")
      .map((s) => [s.segment[0], { end: s.segment[1], uuid: s.UUID }])
    )
    muteSegments = new Map(data
      .filter((segment) => segment.actionType === "mute")
      .map((s) => [s.segment[0], { end: s.segment[1], uuid: s.UUID }])
    )
    // create full video label
    videoLabel = data.filter((s) => s.actionType === "full")
    createVideoLabel(videoLabel)
    // create POI label
    poiLabel = data.filter((s) => s.actionType === "poi")
    if (poiLabel.length) {
      createVideoLabel(poiLabel, "poi")
      // add binding
      const poi_listener = (e) => {
        if (e.key === highlightKey) {
          video.currentTime = poiLabel[0].segment[1]
          trackSkip(poiLabel[0].UUID)
          // remove label
          const label = document.querySelector("#sbjs-label-poi")
          label.style.display = "none"
          document.removeEventListener("keydown", poi_listener)
        }
      }
      document.addEventListener("keydown", poi_listener)
    }
  })
  console.log("[SB.js] Loaded Segments")
}

function skipOrMute() {
  const currentTime = video.currentTime
  // if mute time is over, unmute video
  if (video.muted && currentTime >= muteEndTime) {
    video.muted = false
    muteEndTime = 0
  }
  // check for any skip starts
  const skipEnd = findEndTime(currentTime, skipSegments)
  if (skipEnd) video.currentTime = skipEnd

  // check for any mute starts
  const muteEnd = findEndTime(currentTime, muteSegments)
  if (muteEnd) {
    video.muted = true
    muteEndTime = muteEnd
  }
}

function findEndTime(now, map) {
  let endTime = null
  for (const startTime of map.keys()) {
    if (
      now + skipThreshold[0] >= startTime &&
      now - startTime <= skipThreshold[1]
    ) {
      const segment = map.get(startTime)
      endTime = segment.end
      trackSkip(segment.uuid)
      map.delete(startTime) // only use segment once
      for (const overlapStart of map.keys()) {
        // check for overlap
        if (endTime >= overlapStart && overlapStart >= now) {
          // overlapping segment
          const overSegment = map.get(overlapStart)
          endTime = overSegment.end
          trackSkip(overSegment.uuid)
          map.delete(overlapStart)
        }
      }
      return endTime // early return
    }
  }
  return endTime
}

function createVideoLabel(videoLabel, type = "full") {
  if (!videoLabel.length) return
  // await title
  const title = document.querySelector("#title h1, h1.title.ytd-video-primary-info-renderer")
  if (!title) {
    setTimeout(createVideoLabel, 200, videoLabel)
    return
  }
  const category = videoLabel[0].category
  const fvString = (category) => `The entire video is ${category} and is too tightly integrated to be able to seperate`
  const styles = {
    // fg, bg, hover
    sponsor: ["#0d0", "#111", fvString("sponsor")],
    selfpromo: ["#ff0", "#fff", fvString("selfpromo")],
    exclusive_access: ["#085","#fff","This video showcases a product, service or location that they've received free or subsidized access to"],
    poi_highlight: ["#f18","#fff",`Press ${highlightKey} to skip to the highlight`],
  }
  const style = styles[category]
  const label = document.createElement("span")
  label.title = style[2]
  label.innerText = category
  label.id = `sbjs-label-${type}`
  label.style = `color: ${style[1]}; background-color: ${style[0]}; display: flex; margin: 0 5px;`
  // prepend to title
  title.style = "display: flex;"
  title.prepend(label)
}

const reset = () => {
  video = undefined
  videoID = undefined
  muteEndTime = 0
  videoLabel = undefined
  skipSegments = []
  muteSegments = []
  videoLabel = []
  poiLabel = []
}

function setup() {
  if (videoID === getVideoID()) return // already running correctly
  console.log(`@mchangrh/SB.js ${VERSION} Loaded`)
  if (document.querySelector("#previewbar")) // exit if previewbar exists
    return console.log("[SB.js] Extension Present, Exiting")
  video = document.querySelector("video")
  videoID = getVideoID()
  fetch(videoID)
  // listeners
  video.addEventListener("timeupdate", skipOrMute)
}

// main loop
document.addEventListener("yt-navigate-start", reset)
// will start setup once event listener fired
document.addEventListener("yt-navigate-finish", setup)
setup()
