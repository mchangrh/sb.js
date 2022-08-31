const fs = require('fs');

const { version } = require("./src/version.json")
const bodyFile = "./src/sb.js"
const headerFile = "./build/header.user.js"
const loaderHeaderFile = "./build/loader-header.user.js"

function bumpBody () {
  let body = fs.readFileSync(bodyFile, 'utf8')
  const bodyRegex = new RegExp(/const VERSION = "([\d\.]+)" \/\/ version constant/g)
  const newVersion = `const VERSION = "${version}" // version constant`
  body = body.replace(bodyRegex, newVersion)
  fs.writeFileSync(bodyFile, body)
}

function bumpUserScript(file) {
  let text = fs.readFileSync(file, 'utf8')
  const userScriptRegex = new RegExp(/\/\/ @version\s{6}([\d\.]+)/g)
  const newVersion = `// @version      ${version}`
  text = text.replace(userScriptRegex, newVersion)
  fs.writeFileSync(file, text)
}

bumpBody()
bumpUserScript(headerFile)
bumpUserScript(loaderHeaderFile)