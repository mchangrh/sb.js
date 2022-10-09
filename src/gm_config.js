const getJSONSetting = async (key, fallback) => JSON.parse(await GM_getValue(key, fallback))

const categories = await getJSONSetting("categories", `["sponsor","selfpromo","interaction","intro","outro","preview","music_offtopic","exclusive_access","poi_highlight"]`)
const actionTypes = await getJSONSetting("actionTypes", `["skip","mute","full","poi"]`)
const skipThreshold = await getJSONSetting("skipThreshold", `[0.2,1]`)
const serverEndpoint = await GM_getValue("serverEndpoint","https://sponsor.ajay.app")
const skipTracking = await GM_getValue("skipTracking", true)
const highlightKey = await GM_getValue("highlightKey", "Enter")
