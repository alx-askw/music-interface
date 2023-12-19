# Definition of Done

### Must Haves for 1.0

- Fix bugs (see bugs.md)
- Basic playlist system (JSON DB)
- Make the application look nicer
- Come up with a name
- Add a custom icon
- Add multiple backend routes (if someone wants lyrics and song name that's a route, just name that's a route, etc). Some Examples:
  - Just Current Time, Duration, Artist, and Song name
  - Everything, same as above, but image buffer, lyrics
  - Is music paused/Played
  - Volume
- Add custom controls (mainly need to work on seek bar)
- Tests
- Test on Linux
- Write documentation

### Beyond 1.0

- Add mongoDB impl of DB
- If no lyrics available + connected to internet - fetch lyrics from an external API
- Add gradient colour to volume slider
- Playlist shuffle
- Conditional rendering;
  - Should lyrics displayed (toggle or if no present then the space isn't used)
- Add API for being able to control app from 3rd party rather than just request song information