#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "rhoetosaurus-reel.mp4:sfx_rhoetosaurus.mp3:rhoetosaurus-reel-audio.mp4"
  "rinchenia-reel.mp4:sfx_rinchenia.mp3:rinchenia-reel-audio.mp4"
  "riojasaurus-reel.mp4:sfx_riojasaurus.mp3:riojasaurus-reel-audio.mp4"
  "rugops-reel.mp4:sfx_rugops.mp3:rugops-reel-audio.mp4"
  "saichania-reel.mp4:sfx_saichania.mp3:saichania-reel-audio.mp4"
  "saltasaurus-reel.mp4:sfx_saltasaurus.mp3:saltasaurus-reel-audio.mp4"
  "saltopus-reel.mp4:sfx_saltopus.mp3:saltopus-reel-audio.mp4"
  "sarcosaurus-reel.mp4:sfx_sarcosaurus.mp3:sarcosaurus-reel-audio.mp4"
  "saurolophus-reel.mp4:sfx_saurolophus.mp3:saurolophus-reel-audio.mp4"
  "sauropelta-reel.mp4:sfx_sauropelta.mp3:sauropelta-reel-audio.mp4"
  "scelidosaurus-reel.mp4:sfx_scelidosaurus.mp3:scelidosaurus-reel-audio.mp4"
  "scipionyx-reel.mp4:sfx_scipionyx.mp3:scipionyx-reel-audio.mp4"
  "shamosaurus-reel.mp4:sfx_shamosaurus.mp3:shamosaurus-reel-audio.mp4"
  "shantungosaurus-reel.mp4:sfx_shantungosaurus.mp3:shantungosaurus-reel-audio.mp4"
  "shunosaurus-reel.mp4:sfx_shunosaurus.mp3:shunosaurus-reel-audio.mp4"
  "shuvuuia-reel.mp4:sfx_shuvuuia.mp3:shuvuuia-reel-audio.mp4"
  "silvisaurus-reel.mp4:sfx_silvisaurus.mp3:silvisaurus-reel-audio.mp4"
  "sinocalliopteryx-reel.mp4:sfx_sinocalliopteryx.mp3:sinocalliopteryx-reel-audio.mp4"
  "sinornithosaurus-reel.mp4:sfx_sinornithosaurus.mp3:sinornithosaurus-reel-audio.mp4"
  "sinraptor-reel.mp4:sfx_sinraptor.mp3:sinraptor-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 12"
ls "$V"/*-audio.mp4 | wc -l
