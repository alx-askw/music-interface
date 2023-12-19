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
