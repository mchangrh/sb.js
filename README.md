<p align="center"><img src="docs/icon.png"></p>

# SB.js
![GitHub file size in bytes](https://img.shields.io/github/size/mchangrh/sb.js/docs/sb.js)
![GitHub file size in bytes](https://img.shields.io/github/size/mchangrh/sb.js/docs/sb.min.js?label=size%20%28min%29)
![GitHub package.json version](https://img.shields.io/github/package-json/v/mchangrh/sb.js)

[SponsorBlock](https://github.com/ajayyy/SponsorBlock) for restrictive environments. When possible, use the browser extension.

## CDNs
<p align="center">
    <a href="https://mchangrh.github.io/sb.js"><img src="https://img.shields.io/static/v1?label=%20&message=GitHub%20Pages&color=222&logo=GitHub%20Pages" alt="Badge"></img></a>
    <a href="https://sbjs.pages.dev"><img src="https://img.shields.io/static/v1?label=%20&message=Cloudflare%20Pages&color=222&logo=Cloudflare%20Pages" alt="Badge"></img></a>
    <a href="https://cdn.mchang.xyz/sb.js/docs/index.html"><img src="https://img.shields.io/static/v1?label=%20&message=Cloudflare%20R2&color=222&logo=Cloudflare" alt="Badge"></img></a>
    <a href="https://fs.mchang.icu/sb.js/docs/"><img src="https://img.shields.io/static/v1?label=%20&message=Hetzner%20VPS&color=222&logo=hetzner" alt="Badge"></img></a>
</p>
<p align="center">
  <a href="https://raw.githubusercontent.com/mchangrh/sb.js/main/docs/sb.min.js"><img src="https://img.shields.io/static/v1?label=%20&message=GitHub&color=222&logo=GitHub" alt="Badge"></img></a>
    <a href="https://cdn.jsdelivr.net/gh/mchangrh/sb.js/docs/"><img src="https://img.shields.io/static/v1?label=%20&message=JSDelivr%20%20(GitHub)&color=222&logo=jsDelivr" alt="Badge"></img></a>
    <a href="https://cdn.jsdelivr.net/npm/@mchangrh/sb.js/docs/"><img src="https://img.shields.io/static/v1?label=%20&message=JSDelivr%20%20(npm)&color=222&logo=jsDelivr" alt="Badge"></img></a>
    <a href="https://unpkg.com/@mchangrh/sb.js/docs/"><img src="https://img.shields.io/static/v1?label=%20&message=unpkg&color=222&logo=npm" alt="Badge"></img></a>
</p>

## Usage
Userscripts:
  - With Loader (`sb-loader.user.js`)
    - The loader loads the script every time on startup, settings are preserved between updates with no intervention.
  - Without Loader (`sb.user.js`)
    - The script will load faster each time, but will require user intervention if any settings are changed
  - With config page (`sb-config.user.js`)
    - Loads faster than loader, preserves settings between updates, and has a config page to change settings 
    - The script allows locally storing settings in `GM_setValue`
    - go to [https://mchangrh.github.io/sb.js/config](https://mchangrh.github.io/sb.js/config) to configure

Bookmarklet: `sb.bookmarklet.js`
- Create a new bookmark in your bookmarks bar
- Replace the URL with the text in `sb.bookmarklet.js`

Console: `sb.min.js` or `sb.js`
- Copy the contents of `sb.min.js` or `sb.js` into the console

## Links & CDNs
It is recommended to use the [CDN Check Page](docs/index.html) as it will check and generate links for you.
- GitHub: `https://raw.githubusercontent.com/mchangrh/sb.js/main/docs/sb.min.js`
- GitHub Pages: `https://mchangrh.github.io/sb.js/sb.min.js`
- Cloudflare Pages: `https://sbjs.pages.dev/sb.min.js`
- JSDelivr (npm): `https://cdn.jsdelivr.net/npm/@mchangrh/sb.js/docs/sb.min.js`
- JSDelivr (GitHub): `https://cdn.jsdelivr.net/gh/mchangrh/sb.js/docs/sb.min.js`
- unpkg: `https://unpkg.com/@mchangrh/sb.js/docs/sb.min.js`
- Hetzner VPS: `https://fs.mchang.icu/sb.js/docs/sb.min.js`
- Hetzner VPS (IP): `https://5.161.97.234/sb.js/docs/sb.min.js`

# SB.js vs SponsorBlock (extension)
|  | SB.js | Extension |
|---|---|---|
| Chapters | ❌ | ✅ |
| Accurate Skipping | ❌ | ✅ |
| Manual Skip | ❌ | ✅ |
| UI | ❌ | ✅ |
| Show on player bar | ❌ | ✅ |
| Submitting Segments | ❌ | ✅ |
| Voting | ❌ | ✅ |
| Local Skip Counter | ❌ | ✅ |
| Invidious/ Mobile YT | ❌ | ✅ |