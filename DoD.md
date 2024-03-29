# Definition of Done

### Must Haves for 1.0

- Fix bugs (see bugs.md)
- DONE Autoplay?
- DONE Ability to repeat songs on a loop automatically
- DONE Basic playlist system (JSON DB)
- Make the application look nicer
  - https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
  - https://www.dofactory.com/html/editor/input-style
  - https://www.quirksmode.org/dom/inputfile.html
  - https://stackoverflow.com/questions/38067298/saving-files-locally-with-electron
  - https://www.electronjs.org/docs/latest/api/dialog
  - https://m2.material.io/design/color/dark-theme.html#ui-application
- Come up with a name
- Add a custom icon
- Add multiple backend routes. Some Examples:
  - Just Current Time, Duration, Artist, and Song name
  - Everything, same as above, but image buffer, lyrics
  - Is music paused/Played
  - Volume
- Split the ipc bridges and improve name of API
- DONE Add custom controls (mainly need to work on seek bar) (https://www.w3schools.com/tags/ref_av_dom.asp)
  - Add icon to mute button to show whether music is muted or not
  - DONE Tray buttons ('Thumbar Buttons')
- Tests = https://www.electronjs.org/docs/latest/tutorial/automated-testing
- Test on Linux
- Write documentation
- Remove storeCurrentImage functions as they are now obsolete
- Clean code for DoD
  - Make the code more modular
  - Single responsibility functions

- Make example Gif for readme

### Beyond 1.0

- Left and Right Arrows seek 5 seconds backwards or forwards (customisable?)
- Up and Down Arrows turn follow up or down by .5 ''
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
- Replace all alerts with custom/nicer looking modals
- Track how many time songs are played (like Winamp)



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