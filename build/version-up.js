const fs = require("fs")
const { resolve } = require("path")

const { version } = require("../src/version.json")
const bodyFile = resolve(__dirname, "../src/sb.js")
const headerFile = resolve(__dirname, "../build/header.user.js")
const configHeaderFile = resolve(__dirname, "../build/config-header.user.js")
const loaderHeaderFile = resolve(__dirname, "../build/loader-header.user.js")

function bumpBody() {
  let body = fs.readFileSync(bodyFile, "utf8")
  const bodyRegex = new RegExp(/const VERSION = "([\d\.]+)" \/\/ version constant/g)
  const newVersion = `const VERSION = "${version}" // version constant`
  body = body.replace(bodyRegex, newVersion)
  fs.writeFileSync(bodyFile, body)
}

function bumpUserScript(file) {
  let text = fs.readFileSync(file, "utf8")
  const userScriptRegex = new RegExp(/\/\/ @version\s{6}([\d\.]+)/g)
  const newVersion = `// @version      ${version}`
  text = text.replace(userScriptRegex, newVersion)
  fs.writeFileSync(file, text)
}

function bumpPackage() {
  const packageFile = resolve(__dirname, "../package.json")
  const packageInfo = JSON.parse(fs.readFileSync(packageFile, "utf8"))
  packageInfo.version = version
  fs.writeFileSync(packageFile, JSON.stringify(packageInfo, null, 2))
}

bumpBody()
bumpPackage()
bumpUserScript(headerFile)
bumpUserScript(configHeaderFile)
bumpUserScript(loaderHeaderFile)
