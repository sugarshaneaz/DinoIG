#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "emausaurus-reel.mp4:sfx_emausaurus.mp3:emausaurus-reel-audio.mp4"
  "eolambia-reel.mp4:sfx_eolambia.mp3:eolambia-reel-audio.mp4"
  "eoraptor-reel.mp4:sfx_eoraptor.mp3:eoraptor-reel-audio.mp4"
  "eotyrannus-reel.mp4:sfx_eotyrannus.mp3:eotyrannus-reel-audio.mp4"
  "equijubus-reel.mp4:sfx_equijubus.mp3:equijubus-reel-audio.mp4"
  "erketu-reel.mp4:sfx_erketu.mp3:erketu-reel-audio.mp4"
  "erlikosaurus-reel.mp4:sfx_erlikosaurus.mp3:erlikosaurus-reel-audio.mp4"
  "euhelopus-reel.mp4:sfx_euhelopus.mp3:euhelopus-reel-audio.mp4"
  "euoplocephalus-reel.mp4:sfx_euoplocephalus.mp3:euoplocephalus-reel-audio.mp4"
  "europasaurus-reel.mp4:sfx_europasaurus.mp3:europasaurus-reel-audio.mp4"
  "eustreptospondylus-reel.mp4:sfx_eustreptospondylus.mp3:eustreptospondylus-reel-audio.mp4"
  "fukuiraptor-reel.mp4:sfx_fukuiraptor.mp3:fukuiraptor-reel-audio.mp4"
  "fukuisaurus-reel.mp4:sfx_fukuisaurus.mp3:fukuisaurus-reel-audio.mp4"
  "gallimimus-reel.mp4:sfx_gallimimus.mp3:gallimimus-reel-audio.mp4"
  "gargoyleosaurus-reel.mp4:sfx_gargoyleosaurus.mp3:gargoyleosaurus-reel-audio.mp4"
  "garudimimus-reel.mp4:sfx_garudimimus.mp3:garudimimus-reel-audio.mp4"
  "gasosaurus-reel.mp4:sfx_gasosaurus.mp3:gasosaurus-reel-audio.mp4"
  "gasparinisaura-reel.mp4:sfx_gasparinisaura.mp3:gasparinisaura-reel-audio.mp4"
  "gastonia-reel.mp4:sfx_gastonia.mp3:gastonia-reel-audio.mp4"
  "giganotosaurus-reel.mp4:sfx_giganotosaurus.mp3:giganotosaurus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 5"
ls "$V"/*-audio.mp4 | wc -l
