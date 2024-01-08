bugs:

- FIXED - loading up a second song causes two lyrics objects that take turns displaying
- FIXED images don't change with song
  - For future reference:
    - https://stackoverflow.com/questions/20756042/how-to-display-an-image-stored-as-byte-array-in-html-javascript
    - https://stackoverflow.com/questions/6182315/how-can-i-do-base64-encoding-in-node-js
- FIXED - like the previous two bugs, we have to reset app to assign lyrics to songs probably (+ have to reset the app to see the changes - reset to see lyrics)
- not so much a bug but perhaps have a boundary for lyrics. So the last lyric of the song or verse only stays up for a few secs after its timestamp
- DEPRECATED add error handling to image writing
  https://www.electronjs.org/docs/latest/tutorial/application-debugging
- NOTHING TO WORRY ABOUT HERE - Potential bug with adding more than one LRC file to an MP3. Check it out as it might only be potential
- Dynamically find port, just incase 3000 is being used. maybe add 1 each time
- FIXED weird bug when the ended event is fired after the last song causing the list to stop
  - ended event would only add to playlist pointer, so it went out of bounds
  - that's why pressing back button a few times would work
- Some songs can only be removed by playing them first from playlist


things to consider:
  - Not bugs, just notes!

  - Does the main process and server process need to be separate:
    - Or does more of the functionality need to be in the main process - though MOST functionality in that file is for routes and HTTP REQS:
      - LRC object maker could be in the main process?
    - Or does the main.js file just deal with initial rendering plus thumbar?
  - You can added event listeners with just 'htmlTag.onevent = function() {do something};';
    - is my removing and readding event listeners an old/bad approach?