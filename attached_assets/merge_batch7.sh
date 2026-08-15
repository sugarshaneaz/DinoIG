#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "hypacrosaurus-reel.mp4:sfx_hypacrosaurus.mp3:hypacrosaurus-reel-audio.mp4"
  "hypsilophodon-reel.mp4:sfx_hypsilophodon.mp3:hypsilophodon-reel-audio.mp4"
  "iguanodon-reel.mp4:sfx_iguanodon.mp3:iguanodon-reel-audio.mp4"
  "indosuchus-reel.mp4:sfx_indosuchus.mp3:indosuchus-reel-audio.mp4"
  "irritator-reel.mp4:sfx_irritator.mp3:irritator-reel-audio.mp4"
  "isisaurus-reel.mp4:sfx_isisaurus.mp3:isisaurus-reel-audio.mp4"
  "janenschia-reel.mp4:sfx_janenschia.mp3:janenschia-reel-audio.mp4"
  "jaxartosaurus-reel.mp4:sfx_jaxartosaurus.mp3:jaxartosaurus-reel-audio.mp4"
  "jingshanosaurus-reel.mp4:sfx_jingshanosaurus.mp3:jingshanosaurus-reel-audio.mp4"
  "jinzhousaurus-reel.mp4:sfx_jinzhousaurus.mp3:jinzhousaurus-reel-audio.mp4"
  "jobaria-reel.mp4:sfx_jobaria.mp3:jobaria-reel-audio.mp4"
  "juravenator-reel.mp4:sfx_juravenator.mp3:juravenator-reel-audio.mp4"
  "kentrosaurus-reel.mp4:sfx_kentrosaurus.mp3:kentrosaurus-reel-audio.mp4"
  "khaan-reel.mp4:sfx_khaan.mp3:khaan-reel-audio.mp4"
  "kotasaurus-reel.mp4:sfx_kotasaurus.mp3:kotasaurus-reel-audio.mp4"
  "kritosaurus-reel.mp4:sfx_kritosaurus.mp3:kritosaurus-reel-audio.mp4"
  "lambeosaurus-reel.mp4:sfx_lambeosaurus.mp3:lambeosaurus-reel-audio.mp4"
  "lapparentosaurus-reel.mp4:sfx_lapparentosaurus.mp3:lapparentosaurus-reel-audio.mp4"
  "leaellynasaura-reel.mp4:sfx_leaellynasaura.mp3:leaellynasaura-reel-audio.mp4"
  "leptoceratops-reel.mp4:sfx_leptoceratops.mp3:leptoceratops-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 7"
ls "$V"/*-audio.mp4 | wc -l
