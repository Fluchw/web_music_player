// app_data.js

// --- Data from former songs_data.js ---
// Background images list
// Ensure these image paths are correct relative to your HTML file, or use full online URLs.
const backgroundImagesList = [
  "img/【哲风壁纸】日本动漫-时崎狂三 (1).png",
  "img/【哲风壁纸】日本动漫-时崎狂三.png",
  "https://placehold.co/1920x1080/1abc9c/ecf0f1?text=Background+3&font=inter",
  "https://placehold.co/1920x1080/8e44ad/f1c40f?text=Background+4&font=inter"
];

// --- Data from former lyrics_data.js ---
// Lyric string for "Letting go"
const lettingGoLyricsData = `[00:00.00]Letting go
[00:00.00]原唱 : 蔡健雅
[00:00.63]制作人 : 汪苏泷/金若晨
[00:03.79]Letting go
[00:06.28]我终于舍得为你放开手
[00:10.48]因为爱你爱到我心痛
[00:15.80]但你却不懂
[00:20.25]这是一封离别信
[00:24.01]写下我该离开的原因
[00:27.58]我在你生命中扮演的角色太模糊了
[00:34.71]对我曾忽冷忽热
[00:38.14]我到底是情人还是朋友
[00:41.64]爱你是否不该太认真
[00:45.71]That’s why
[00:47.75]I'm letting go
[00:50.48]我终于舍得为你放开手
[00:54.52]因为爱你爱到我心痛
[00:59.64]但你却不懂
[01:02.07]Letting go
[01:04.60]你对一切都软弱与怠惰
[01:08.43]让人怀疑你是否爱过我 真的爱过我
[01:18.92]Letting go
[01:22.67]Letting go
[01:31.43]Letting go
[01:36.53]你是呼吸的空气
[01:40.10]脱离不了的地心引力
[01:43.29]你在我生命中 曾经是我存在的原因
[01:50.49]也许就像他们说
[01:54.13]爱情只会让人变愚蠢
[01:57.38]自作多情 爱得太天真
[02:01.43]That’s why
[02:03.74]I’m letting go
[02:06.30]我终于舍得为你放开手
[02:10.04]因为爱你爱到我心痛
[02:15.07]但你却不懂
[02:18.18]Letting go
[02:20.51]你对一切都软弱与怠惰
[02:24.03]让人怀疑你是否爱过我 真的爱过我
[02:33.43]为你再也找不到借口
[02:36.95]That’s when we should let it go
[02:43.90]That’s when we should let it go
[02:45.55]在夜深人静里想着
[02:49.20]心不安 却越沸腾
[02:52.86]我无助 我无助 好想哭 好想哭
[02:56.62]我找不到退路
[02:59.75]在夜深人静里写着
[03:03.50]心慢慢 就越变冷（心不安 却越沸腾）
[03:06.72]我不恨 我不恨 也不哭 也不哭
[03:10.45]我的眼泪 早已哭干了
[03:17.26]Coz I’m letting go
[03:20.41]我终于舍得为你放开手
[03:24.06]因为爱你爱到我心痛
[03:29.78]但你却不懂
[03:32.13]Letting go
[03:34.68]你对一切都软弱与怠惰
[03:38.60]让人怀疑你是否爱过我 真的爱过我
[03:46.31]Letting go
[03:48.75]你对一切都软弱与怠惰
[03:52.74]让人怀疑你是否爱过我
[03:58.17]That’s when we should let it go
[04:05.09]That’s when we should let it go
[04:08.60]That’s when we should let it go
[04:12.17]That’s when we should let it go`;
        
// Placeholder lyric strings for other songs
const summerBreezeLyricsData = `[00:00.00] (Summer Breeze 暂无歌词)`;
const midnightDriveLyricsData = `[00:00.00] (Midnight Drive 暂无歌词)`;
const forestWhisperLyricsData = `[00:00.00] (Forest Whisper 暂无歌词)`;

// Map of all lyric data strings
// The main player logic will use this object to find lyrics by their lyricVarName.
const allLyricsData = {
  "lettingGoLyricsData": lettingGoLyricsData,
  "summerBreezeLyricsData": summerBreezeLyricsData,
  "midnightDriveLyricsData": midnightDriveLyricsData,
  "forestWhisperLyricsData": forestWhisperLyricsData
};

// --- Data from former songs_data.js ---
// Song list
// Ensure audio file paths (src) are correct.
// lyricVarName should correspond to keys in the allLyricsData object defined above.
const songsListFromExternalFile = [
  {
    "title": "Letting go",
    "artist": "蔡健雅 (原唱)",
    "src": "music/letting_go.mp3", // Your updated path
    "lyricVarName": "lettingGoLyricsData"
  },
  {
    "title": "Summer Breeze",
    "artist": "Chill Beats",
    "src": "my_audio/chill_beats_summer_breeze.mp3", 
    "lyricVarName": "summerBreezeLyricsData"
  },
  {
    "title": "Midnight Drive",
    "artist": "Synthwave Rider",
    "src": "my_audio/synthwave_rider_midnight_drive.mp3", 
    "lyricVarName": "midnightDriveLyricsData"
  },
  {
    "title": "Forest Whisper",
    "artist": "Nature Sounds",
    "src": "my_audio/nature_sounds_forest_whisper.mp3", 
    "lyricVarName": "forestWhisperLyricsData"
  }
];

// Log to confirm this combined file is loaded
console.log("app_data.js loaded successfully. Contains backgroundImagesList, allLyricsData, and songsListFromExternalFile.");
