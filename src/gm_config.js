const getJSONSetting = (key, fallback) => JSON.parse(GM_getValue(key, fallback))

const categories = getJSONSetting("categories", `["sponsor","selfpromo","interaction","intro","outro","preview","music_offtopic","exclusive_access","poi_highlight"]`)
const actionTypes = getJSONSetting("actionTypes", `["skip","mute","full","poi"]`)
const skipThreshold = getJSONSetting("skipThreshold", `[0.2,1]`)
const serverEndpoint = GM_getValue("serverEndpoint","https://sponsor.ajay.app")
const skipTracking = GM_getValue("skipTracking", true)
const highlightKey = GM_getValue("highlightKey", "Enter")
