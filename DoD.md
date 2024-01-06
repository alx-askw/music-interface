# Definition of Done

### Must Haves for 1.0

- Fix bugs (see bugs.md)
- DONE Autoplay?
- DONE Ability to repeat songs on a loop automatically
- Basic playlist system (JSON DB)
- Make the application look nicer
  - https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
  - https://www.dofactory.com/html/editor/input-style
  - https://www.quirksmode.org/dom/inputfile.html
  - https://stackoverflow.com/questions/38067298/saving-files-locally-with-electron
  - https://www.electronjs.org/docs/latest/api/dialog
- Come up with a name
- Add a custom icon
- Add multiple backend routes. Some Examples:
  - Just Current Time, Duration, Artist, and Song name
  - Everything, same as above, but image buffer, lyrics
  - Is music paused/Played
  - Volume
- Add custom controls (mainly need to work on seek bar) (https://www.w3schools.com/tags/ref_av_dom.asp)
  - Add icon to mute button to show whether music is muted or not
  - DONE Tray buttons ('Thumbar Buttons')
- Tests
- Test on Linux
- Write documentation
- Remove storeCurrentImage functions as they are now obsolete
- Clean code for DoD

### Beyond 1.0

- Add mongoDB impl of DB
- If no lyrics available + connected to internet - fetch lyrics from an external API
- Add gradient colour to volume slider
- Playlist shuffle
- Conditional rendering;
  - Should lyrics displayed (toggle or if no present then the space isn't used)
- Add API for being able to control app from 3rd party rather than just request song information
- Perhaps overhaul backend - this app won't be hosted, so middleware services will have to be created for communicated with hosted services (making requests to the app is currently just on local host)
- Drag & Drop files into program
- song fading (fading songs into one another for seamless transitions)
- visualiser 
- equaliser
- more playlist functionality:
  - ability to switch songs around
- user code?
- Custom Routes?
- Handshakes?
- Settings persist between sessions (conf file?)
  - volume
  - what was being listened to last
  - how far into the last item 
- video




### Resources to check out:

#### nativeImage
  - Talks about icon sizes for the tray buttons.
  - https://www.electronjs.org/docs/latest/api/native-image

#### BrowserWindow
  - docs for adding thumbar ('thumbnail toolbar')
  - https://www.electronjs.org/docs/latest/api/browser-window#winsetthumbarbuttonsbuttons-windows

#### Taskbar Customization
  - As it says on the tin 
  - https://www.electronjs.org/docs/latest/tutorial/windows-taskbar