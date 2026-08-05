#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "trex-reel.mp4:sfx_trex.mp3:trex-reel-audio.mp4"
  "triceratops-reel-v2.mp4:sfx_triceratops.mp3:triceratops-reel-audio.mp4"
  "brachiosaurus-reel.mp4:sfx_brachiosaurus.mp3:brachiosaurus-reel-audio.mp4"
  "velociraptor-reel-v3.mp4:sfx_velociraptor.mp3:velociraptor-reel-audio.mp4"
  "stegosaurus-reel.mp4:sfx_stegosaurus.mp3:stegosaurus-reel-audio.mp4"
  "ankylosaurus-reel-v3.mp4:sfx_ankylosaurus.mp3:ankylosaurus-reel-audio.mp4"
  "pterodactyl-reel-v3.mp4:sfx_pterodactyl.mp3:pterodactyl-reel-audio.mp4"
  "aardonyx-reel.mp4:sfx_aardonyx.mp3:aardonyx-reel-audio.mp4"
  "abelisaurus-reel-v5.mp4:sfx_abelisaurus.mp3:abelisaurus-reel-audio.mp4"
  "achelousaurus-reel.mp4:sfx_achelousaurus.mp3:achelousaurus-reel-audio.mp4"
  "achillobator-reel.mp4:sfx_achillobator.mp3:achillobator-reel-audio.mp4"
  "acrocanthosaurus-reel.mp4:sfx_acrocanthosaurus.mp3:acrocanthosaurus-reel-audio.mp4"
  "aegyptosaurus-reel.mp4:sfx_aegyptosaurus.mp3:aegyptosaurus-reel-audio.mp4"
  "afrovenator-reel.mp4:sfx_afrovenator.mp3:afrovenator-reel-audio.mp4"
  "agilisaurus-reel.mp4:sfx_agilisaurus.mp3:agilisaurus-reel-audio.mp4"
  "alamosaurus-reel.mp4:sfx_alamosaurus.mp3:alamosaurus-reel-audio.mp4"
  "albertaceratops-reel.mp4:sfx_albertaceratops.mp3:albertaceratops-reel-audio.mp4"
  "albertosaurus-reel.mp4:sfx_albertosaurus.mp3:albertosaurus-reel-audio.mp4"
  "alectrosaurus-reel.mp4:sfx_alectrosaurus.mp3:alectrosaurus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "All done"
ls "$V"/*-audio.mp4 | wc -l
