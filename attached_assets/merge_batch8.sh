#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "lesothosaurus-reel.mp4:sfx_lesothosaurus.mp3:lesothosaurus-reel-audio.mp4"
  "liaoceratops-reel.mp4:sfx_liaoceratops.mp3:liaoceratops-reel-audio.mp4"
  "ligabuesaurus-reel.mp4:sfx_ligabuesaurus.mp3:ligabuesaurus-reel-audio.mp4"
  "liliensternus-reel.mp4:sfx_liliensternus.mp3:liliensternus-reel-audio.mp4"
  "lophorhothon-reel.mp4:sfx_lophorhothon.mp3:lophorhothon-reel-audio.mp4"
  "lophostropheus-reel.mp4:sfx_lophostropheus.mp3:lophostropheus-reel-audio.mp4"
  "lufengosaurus-reel.mp4:sfx_lufengosaurus.mp3:lufengosaurus-reel-audio.mp4"
  "lurdusaurus-reel.mp4:sfx_lurdusaurus.mp3:lurdusaurus-reel-audio.mp4"
  "lycorhinus-reel.mp4:sfx_lycorhinus.mp3:lycorhinus-reel-audio.mp4"
  "magyarosaurus-reel.mp4:sfx_magyarosaurus.mp3:magyarosaurus-reel-audio.mp4"
  "maiasaura-reel.mp4:sfx_maiasaura.mp3:maiasaura-reel-audio.mp4"
  "majungasaurus-reel.mp4:sfx_majungasaurus.mp3:majungasaurus-reel-audio.mp4"
  "malawisaurus-reel.mp4:sfx_malawisaurus.mp3:malawisaurus-reel-audio.mp4"
  "mamenchisaurus-reel.mp4:sfx_mamenchisaurus.mp3:mamenchisaurus-reel-audio.mp4"
  "mapusaurus-reel.mp4:sfx_mapusaurus.mp3:mapusaurus-reel-audio.mp4"
  "marshosaurus-reel.mp4:sfx_marshosaurus.mp3:marshosaurus-reel-audio.mp4"
  "masiakasaurus-reel.mp4:sfx_masiakasaurus.mp3:masiakasaurus-reel-audio.mp4"
  "massospondylus-reel.mp4:sfx_massospondylus.mp3:massospondylus-reel-audio.mp4"
  "maxakalisaurus-reel.mp4:sfx_maxakalisaurus.mp3:maxakalisaurus-reel-audio.mp4"
  "microraptor-reel.mp4:sfx_microraptor.mp3:microraptor-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 8"
ls "$V"/*-audio.mp4 | wc -l
