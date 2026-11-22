# Bundled piano recording

“Gymnopedie No. 1” — composition by Erik Satie, recording by Kevin MacLeod (incompetech.com).

Licensed under Creative Commons Attribution 4.0:
https://creativecommons.org/licenses/by/4.0/

Official recording and license page:
https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100787

Downloaded from the artist's official MP3 download endpoint on 2026-10-06.
`table-piano.mp3` is the complete recording transcoded to mono MP3 at 24 kb/s.
`piano-preview.mp3` contains the first 40 seconds, transcoded to mono MP3 at 32 kb/s, for the embedded phone preview.

This is a temporary piano track for playback testing. It is **not** Enzalla's “Lullaby”.
The requested original remains pending a usable download and permission to bundle it;
the official Bandcamp page lists a paid download with all rights reserved:
https://enzalla.bandcamp.com/track/lullaby

## Pocket impact update (2026-10-09)

`pocket-crisp.wav` is a 125 ms mono 44.1 kHz derivative of the existing public-domain `ball-clack-2.wav` collision recording: onset trimming, short exponential decay, and original damped 235/670 Hz body resonances. No new third-party recording was added. The game plays this single impact when the falling ball reaches the modeled bottom, without the old duplicate delayed synthetic impact. Existing collision provenance is documented in README.md (Dsw4, Pool Sounds.ogg, Wikimedia Commons).

## Leather pocket update (2026-10-09)

`pocket-leather.wav` is a 300 ms mono 44.1 kHz derivative of the existing `pocket-soft.wav` (collision recording provenance: README.md). A 2.9 kHz low-pass and a restrained original broad-band fabric tail replace the sharp, short ringing impression. No new third-party recording is added; the old crisp file remains an unused revision asset. Runtime playback preserves the authored decay and uses a minimum pocket gain plus brief music ducking.

## 2026-11-22 背景音乐替换

原 `guangyu-intro.mp3`、`guangyu-game-loop.m4a`（用户提供，来源未确认）已从仓库移除，归档在本地非公开目录。现用曲目：

- **Meditation Impromptu 02** — Kevin MacLeod (incompetech.com)，CC BY 4.0。来源：https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2002.mp3 。处理：截取 0:00–0:36，0.35 秒淡入（不做淡出，循环时由播放器交叉淡化），响度归一至 -18 LUFS，转 112 kb/s 立体声 MP3，文件名 `guangyu-intro.mp3`。
- **Airport Lounge** — Kevin MacLeod (incompetech.com)，CC BY 4.0。来源：https://incompetech.com/music/royalty-free/mp3-royaltyfree/Airport%20Lounge.mp3 。处理：截取 0:15 起的 60 秒，0.3 秒淡入（不做淡出，循环由播放器 0.65 秒交叉淡化衔接），转 112 kb/s 立体声 MP3，文件名 `guangyu-game-loop.mp3`。

许可全文：https://creativecommons.org/licenses/by/4.0/ 。使用时须保留作者署名与许可说明；本仓库已在 README、规则弹窗和本文件中署名。
