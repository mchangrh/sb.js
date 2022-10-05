
// configs
const defaultCategories = [ "sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "exclusive_access", "poi_highlight" ]
const categories = JSON.parse(await GM_getValue("categories", JSON.stringify(defaultCategories)))
const defaultActionTypes = [ "skip", "mute", "full", "poi" ]
const actionTypes = JSON.parse(await GM_getValue("actionTypes", JSON.stringify(defaultActionTypes)))
const skipThreshold = JSON.parse(await GM_getValue("skipThreshold", "[0.2, 1]"))
const serverEndpoint = await GM_getValue("serverEndpoint", "https://sponsor.ajay.app")
const skipTracking = await GM_getValue("skipTracking", true)
const highlightKey = await GM_getValue("highlightKey", "Enter")

/* Overrides */
const overrides = {
  // skipTracking: false,
  // highlightKey: "Shift",
}

for (const key in overrides) await GM_setValue("key", overrides[key])

