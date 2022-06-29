const fs = require('fs');
const UglifyJS = require("uglify-js");

const bodyFile = "./src/sb.js"
const headerFile = "./build/header.user.js"
const loaderHeaderFile = "./build/loader-header.user.js"
const settingsFile = "./src/settings.js"

function defaultMerge (minify) {
  const body = fs.readFileSync(bodyFile, 'utf8')
  const settings = fs.readFileSync(settingsFile, 'utf8')
  const mergedBody = settings + body
  return minify ? UglifyJS.minify(mergedBody).code : mergedBody
}

function userscript() {
  const header = fs.readFileSync(headerFile, 'utf8')
  const body = defaultMerge(false)
  fs.writeFileSync("dist/sb.user.js", header + body)
  console.log("userscript done")
} 

function loader() {
  const header = fs.readFileSync(loaderHeaderFile, 'utf8')
  const settings = fs.readFileSync(settingsFile, 'utf8')
  fs.writeFileSync("dist/sb-loader.user.js", header + settings)
  // loader payload
  const body = fs.readFileSync(bodyFile, 'utf8')
  const minified = UglifyJS.minify(body).code
  fs.writeFileSync("dist/sb-nosettings.min.js", minified)
  console.log("loader-done")
}

function minimized() {
  const body = defaultMerge(true)
  fs.writeFileSync('dist/sb.min.js', body)
  console.log("minimized done")
}

function bookmarklet() {
  const body = defaultMerge(true)
  const header = "javascript: (function () {"
  const footer = "})()"
  fs.writeFileSync("dist/sb.bookmarklet.js", header + body + footer)
  console.log("bookmarklet done")
}

userscript()
loader()
minimized()
bookmarklet()