function setupConfigPage() {
  // clear placeholder
  document.getElementById("placeholder").style.display = "none"
  document.getElementById("config").display = "block"

  const categoryInput = document.getElementById("categories")
  const actionTypesInput = document.getElementById("actionTypes")
  const skipThresholdStart = document.getElementById("skipThresholdStart")
  const skipThresholdEnd = document.getElementById("skipThresholdEnd")
  const serverEndpointInput = document.getElementById("serverEndpoint")
  const highlightKeyInput = document.getElementById("highlightKey")

  const setHtml = (elem, value) => (elem.value = value)
  const prettyPrint = obj => JSON.stringify(obj, null, 2)
  const rinseJSON = obj => JSON.stringify(JSON.parse(obj))
  const setValue = (key, value, defaultValue) => {
    if (value !== defaultValue) GM_setValue(key, value)
  }

  setHtml(categoryInput, prettyPrint(categories))
  setHtml(actionTypesInput, prettyPrint(actionTypes))
  setHtml(skipThresholdStart, skipThreshold[0])
  setHtml(skipThresholdEnd, skipThreshold[1])
  setHtml(serverEndpointInput, serverEndpoint)
  setHtml(highlightKeyInput, highlightKey)

  const submitButton = document.getElementById("submit")
  submitButton.addEventListener("click", () => {
    setValue("categories", rinseJSON(categoryInput.value), JSON.stringify(categories))
    setValue("actionTypes", rinseJSON(actionTypesInput.value), JSON.stringify(actionTypes))
    setValue("skipThreshold", JSON.stringify([skipThresholdStart.value, skipThresholdEnd.value]), JSON.stringify(skipThreshold))
    setValue("serverEndpoint", serverEndpointInput.value, serverEndpoint)
    setValue("highlightKey", highlightKeyInput.value, highlightKey)
  })
}
if (document.URL === "https://mchangrh.github.io/sb.js/config") setupConfigPage()
