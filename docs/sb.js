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
  "poi_highlight",
]
const actionTypes = ["skip", "mute", "full", "poi"]
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
const VERSION = "1.3.2" // version constant

// initial setup
let video, videoID, muteEndTime
let skipSegments = new Map()
let muteSegments = new Map()

// functions
const getVideoID = () => new URL(window.location.href).searchParams.get("v")

function getJSON(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.responseType = "json"
  xhr.onload = () => xhr.status == 200 ? callback(null, xhr.response) : callback(xhr.status)
  xhr.send()
}

const trackSkip = uuid => {
  if (!skipTracking) return
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${serverEndpoint}/api/viewedVideoSponsorTime?UUID=${uuid}`)
  xhr.send()
}

function fetch(videoID) {
  const url = `${serverEndpoint}/api/skipSegments?videoID=${videoID}&categories=${JSON.stringify(categories)}&actionTypes=${JSON.stringify(actionTypes)}`
  const convertSegment = s => [s.segment[0], { end: s.segment[1], uuid: s.UUID }]
  getJSON(url, (err, data) => {
    if (err) return console.error("[SB.js]", "error fetching segments", err)
    data.forEach(s => {
      if (s.actionType === "skip") skipSegments.set(...convertSegment(s))
      else if (s.actionType === "mute") muteSegments.set(...convertSegment(s))
      else if (s.actionType === "full") createVideoLabel(s)
      else if (s.actionType === "poi") createPOILabel(s)
    })
    console.log("[SB.js] Loaded Segments")
  })
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
  let endTime
  for (const startTime of map.keys()) {
    if (
      now + skipThreshold[0] >= startTime &&
      now - startTime <= skipThreshold[1]
    ) { // within threshold
      const segment = map.get(startTime)
      endTime = segment.end
      trackSkip(segment.uuid)
      map.delete(startTime) // only use segment once
      for (const overlapStart of map.keys()) {
        // check for overlap
        if (endTime >= overlapStart && overlapStart >= now) {
          // move to end of overlaps
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
function createPOILabel(poiLabel) {
  createVideoLabel(poiLabel, "poi")
  // add binding
  const poi_listener = e => {
    if (e.key === highlightKey) {
      video.currentTime = poiLabel.segment[1]
      trackSkip(poiLabel.UUID)
      // remove label
      document.querySelector("#sbjs-label-poi").style.display = "none"
      document.removeEventListener("keydown", poi_listener)
    }
  }
  document.addEventListener("keydown", poi_listener)
}
function createVideoLabel(videoLabel, type = "full") {
  // await title
  const title = document.querySelector("#title h1, h1.title.ytd-video-primary-info-renderer")
  if (!title) {
    setTimeout(createVideoLabel, 200, videoLabel)
    return
  }
  const category = videoLabel.category
  const fvString = category => `The entire video is ${category} and is too tightly integrated to be able to seperate`
  const styles = {
    // fg, bg, hover text
    sponsor: ["#0d0", "#111", fvString("sponsor")],
    selfpromo: ["#ff0", "#111", fvString("selfpromo")],
    exclusive_access: ["#085", "#fff", "This video showcases a product, service or location that they've received free or subsidized access to"],
    poi_highlight: ["#f18", "#fff", `Press ${highlightKey} to skip to the highlight`],
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
  skipSegments = new Map()
  muteSegments = new Map()
}

function setup() {
  if (videoID === getVideoID()) return // already running correctly
  console.log(`@mchangrh/SB.js ${VERSION} Loaded`)
  console.log(`Uses SponsorBlock data licensed used under CC BY-NC-SA 4.0 from https://sponsor.ajay.app/`)
  if (document.querySelector("#previewbar")) // exit if previewbar exists
    return console.log("[SB.js] Extension Present, Exiting")
  video = document.querySelector("video")
  videoID = getVideoID()
  fetch(videoID)
  if (!video) return console.log("[SB.js] no video")
  video.addEventListener("timeupdate", skipOrMute) // add event listeners
}

// reset on page change
document.addEventListener("yt-navigate-start", reset)
// will start setup once event listener fired
document.addEventListener("yt-navigate-finish", setup)
setup()
