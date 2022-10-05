const fs = require('fs')
const { resolve } = require('path')
const UglifyJS = require("uglify-js")

const bodyFile =  resolve(__dirname, "../src/sb.js")
const headerFile =  resolve(__dirname, "../build/header.user.js")
const loaderHeaderFile =  resolve(__dirname, "../build/loader-header.user.js")
const settingsFile =  resolve(__dirname, "../src/settings.js")

function defaultMerge (minify = true) {
  const body = fs.readFileSync(bodyFile, 'utf8')
  const settings = fs.readFileSync(settingsFile, 'utf8')
  const mergedBody = settings + body
  return minify ? UglifyJS.minify(mergedBody).code : mergedBody
}

function userscript() {
  const header = fs.readFileSync(headerFile, 'utf8')
  const gmConfig = fs.readFileSync("src/gm_config.js", 'utf8')
  const body = fs.readFileSync(bodyFile, 'utf8')
  fs.writeFileSync("docs/sb.user.js", header + gmConfig + body)
  console.log("userscript done")
} 

function loader() {
  const header = fs.readFileSync(loaderHeaderFile, 'utf8')
  const settings = fs.readFileSync(settingsFile, 'utf8')
  fs.writeFileSync("docs/sb-loader.user.js", header + settings)
  // loader payload
  const body = fs.readFileSync(bodyFile, 'utf8')
  const minified = UglifyJS.minify(body).code
  fs.writeFileSync("docs/sb-nosettings.min.js", minified)
  console.log("loader-done")
}

function minimized() {
  const body = defaultMerge()
  fs.writeFileSync('docs/sb.min.js', body)
  console.log("minimized done")
}

function bookmarklet() {
  const body = defaultMerge()
  const header = "javascript: (function () {"
  const footer = "})()"
  fs.writeFileSync("docs/sb.bookmarklet.js", header + body + footer)
  console.log("bookmarklet done")
}

function copy() {
  const body = defaultMerge(false)
  fs.writeFileSync("docs/sb.js", body)
  console.log("copy done")
}

userscript()
loader()
minimized()
bookmarklet()
copy()