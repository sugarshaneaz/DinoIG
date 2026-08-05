#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "alioramus-reel.mp4:sfx_alioramus.mp3:alioramus-reel-audio.mp4"
  "allosaurus-reel.mp4:sfx_allosaurus.mp3:allosaurus-reel-audio.mp4"
  "alvarezsaurus-reel.mp4:sfx_alvarezsaurus.mp3:alvarezsaurus-reel-audio.mp4"
  "amargasaurus-reel.mp4:sfx_amargasaurus.mp3:amargasaurus-reel-audio.mp4"
  "ammosaurus-reel.mp4:sfx_ammosaurus.mp3:ammosaurus-reel-audio.mp4"
  "ampelosaurus-reel.mp4:sfx_ampelosaurus.mp3:ampelosaurus-reel-audio.mp4"
  "amygdalodon-reel.mp4:sfx_amygdalodon.mp3:amygdalodon-reel-audio.mp4"
  "anchiceratops-reel.mp4:sfx_anchiceratops.mp3:anchiceratops-reel-audio.mp4"
  "anchisaurus-reel.mp4:sfx_anchisaurus.mp3:anchisaurus-reel-audio.mp4"
  "anserimimus-reel.mp4:sfx_anserimimus.mp3:anserimimus-reel-audio.mp4"
  "antarctosaurus-reel.mp4:sfx_antarctosaurus.mp3:antarctosaurus-reel-audio.mp4"
  "apatosaurus-reel.mp4:sfx_apatosaurus.mp3:apatosaurus-reel-audio.mp4"
  "aragosaurus-reel.mp4:sfx_aragosaurus.mp3:aragosaurus-reel-audio.mp4"
  "aralosaurus-reel.mp4:sfx_aralosaurus.mp3:aralosaurus-reel-audio.mp4"
  "archaeoceratops-reel.mp4:sfx_archaeoceratops.mp3:archaeoceratops-reel-audio.mp4"
  "archaeopteryx-reel.mp4:sfx_archaeopteryx.mp3:archaeopteryx-reel-audio.mp4"
  "archaeornithomimus-reel.mp4:sfx_archaeornithomimus.mp3:archaeornithomimus-reel-audio.mp4"
  "argentinosaurus-reel.mp4:sfx_argentinosaurus.mp3:argentinosaurus-reel-audio.mp4"
  "arrhinoceratops-reel.mp4:sfx_arrhinoceratops.mp3:arrhinoceratops-reel-audio.mp4"
  "aucasaurus-reel.mp4:sfx_aucasaurus.mp3:aucasaurus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done"
ls "$V"/*-audio.mp4 | wc -l
