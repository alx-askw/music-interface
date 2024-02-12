# Dionysos Music-Interface

### :musical_note: A music player with the ability to display lyrics, make custom playlists, and an Express server to handle HTTP request for 3rd party addons  :musical_note:


<br/>

#### Features:
* Plays MP3 (more formats to come!)
* Ability to add lrc files (and associate lrc files to mp3 files) to display lyrics on screen
* Save and load JSON playlist files
* Make HTTP requests to a local server to use song information in third party apps

<br/>

![Image of App](https://media.discordapp.net/attachments/1108167978714923110/1206429698184454215/readme1.PNG?ex=65dbfa36&is=65c98536&hm=245034ffaa0a2d60d32a70bbf1f8322774cc1b5e4c927f6b96a7bcc07ef22c74&=&format=webp&quality=lossless)

<br/>

![Example of song and lyrics](https://cdn.discordapp.com/attachments/1108167978714923110/1206433595581923379/readme2.PNG?ex=65dbfdd7&is=65c988d7&hm=53436dd144b90a1d61cfac95628ab506aabbfc7b6cd9da7f12152df898d4262e&)

<br/>

#### Installation

Clone the repo
```bash
git clone https://github.com/alx-askw/music-interface.git
```

Install Dependencies
```bash
npm install
```

Start app
```bash
npm start
```
or 

Package into exe
```bash
npm package
```

<br/>

#### Usage (HTTP Requests)

:warning: This is going to be expanded greatly in future versions


```bash
    HTTP REQ GET/
```
This will return a JSON object that looks like:
```
{
    "title": "No song playing",
    "artist": "No artist",
    "duration": "00:00",
    "currentPos": "00:00",
    "imageBuffer": "",
    "currentLyric": " "
}
```
Do with this as you will :smile:

<br/>

#### Discord Rich Presence

<br/>

![Discord Rich Presence](https://cdn.discordapp.com/attachments/1108167978714923110/1206702827804692590/readme3.PNG?ex=65dcf895&is=65ca8395&hm=035dc09d3c46c8b9db3bc314c5acfb5f09b9f709595e491a6790f9a86784a248&)

<br/>

There is currently no client ID for the discord rich presence in the main process. I will re-add this later and it will be an option that can be toggled, so any activity will only be visible if it is turned on.

There are some limitations with the DiscordRPC due to the amount of information that I would like to show. Dev note: It seems to be limited to two lines of text that is updated once per 15 seconds (though it currently updates every second?); furthermore, images have to be uploaded manually, so album art is not really feasible.

:warning: The lyrics are **NOT** censored when discord displays them, so profanities **will** be shown if your lrc files contain them :warning: 

Note: An option to clean lyrics before displaying them is something being worked on for a future release