# Exploration

Is a process of an entry exploration.

Exploration process can be divided to two major steps: **Detection** and, here it is, **Exploration**.


## Detection

Detection takes folder(s) name(s) and recursively (just a terminology, there is no recursion needed for this)
 reads and classifies folders content. Content classification is important step here, because this is what tells us that
 current folder is an entry.

1. Folder(s) selection (from system dialog)
2. If there're many folders present, then process each folder individually (step 3).
3. Read & classify* all items inside folder.
4. If current folder is not an entry and contain folders, then process each folder individually (step 3).
5. If current folder is not an entry and not contain folders, then skip this folder. 
6. If current folder is an entry (see [Entry Detection](Entry_Detection.md)), then explore that folder.


## Exploration

Dump Bakaru thinks that each entry contains episodes, subtitles and voice-overs, well, only episodes required.
 
So it will attempt to explore'em.

### Episodes

WebChimera.js is pretty broken, so it will tell us that video frame dimensions are differ from real ones.
Video is 1280x720, but wc.js will say that it is 1280x700 (depending on pixel aspect ratio).
So we need to grab'em using lovely ffmpeg `¯\_(ツ)_/¯`

The steps:

1. Apply natural sort to files names
2. Bon voyage extensions
3. Get all the names and extract same part from'em
4. 

**Note on same parts extraction:**

Pretty stupid too, like everything in Bakaru (you didn't see me).
Because of brain malfunction of people, who make episodes files names,
we can not use regular expressions, sad but true.
Actually not sad, because fork regexps.


## *Classification

Fairly simple :) We have this folder item types:

- video
- audio
- folders
- subtitles

We know common file extensions for each type (except folder, obviously), so we're able to classify'em.

- `.mp3` is an audio.
- `.mkv` is a video (actually not always, but we're okay with this).
- `.ass` is a subtitles, not ass you flok.

We don't need others and we're skipping'em.
Simple, huh?!
