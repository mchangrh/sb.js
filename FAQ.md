# how do I enable/disable (category) / (type)
categories: edit the `categories` array in settings

types (full video labels/ mute/ poi): remove them from the `actionTypes` array in settings

# not planned
- Submissions
- UI
- Voting (Skipping is too imprecise)
- Chapters
- Embedded videos/ weird playlists/ YouTube TV/ etc...
- Third party sites (Invidious, CloudTube etc...)
  - Change the `getVideoID()` function to add support for other videoID formats/ sites
  - add domain to `@match`