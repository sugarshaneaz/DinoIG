#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "nothronychus-reel.mp4:sfx_nothronychus.mp3:nothronychus-reel-audio.mp4"
  "nqwebasaurus-reel.mp4:sfx_nqwebasaurus.mp3:nqwebasaurus-reel-audio.mp4"
  "omeisaurus-reel.mp4:sfx_omeisaurus.mp3:omeisaurus-reel-audio.mp4"
  "opisthocoelicaudia-reel.mp4:sfx_opisthocoelicaudia.mp3:opisthocoelicaudia-reel-audio.mp4"
  "ornitholestes-reel.mp4:sfx_ornitholestes.mp3:ornitholestes-reel-audio.mp4"
  "ornithomimus-reel.mp4:sfx_ornithomimus.mp3:ornithomimus-reel-audio.mp4"
  "orodromeus-reel.mp4:sfx_orodromeus.mp3:orodromeus-reel-audio.mp4"
  "oryctodromeus-reel.mp4:sfx_oryctodromeus.mp3:oryctodromeus-reel-audio.mp4"
  "othnielia-reel.mp4:sfx_othnielia.mp3:othnielia-reel-audio.mp4"
  "ouranosaurus-reel.mp4:sfx_ouranosaurus.mp3:ouranosaurus-reel-audio.mp4"
  "oviraptor-reel.mp4:sfx_oviraptor.mp3:oviraptor-reel-audio.mp4"
  "pachycephalosaurus-reel.mp4:sfx_pachycephalosaurus.mp3:pachycephalosaurus-reel-audio.mp4"
  "pachyrhinosaurus-reel.mp4:sfx_pachyrhinosaurus.mp3:pachyrhinosaurus-reel-audio.mp4"
  "panoplosaurus-reel.mp4:sfx_panoplosaurus.mp3:panoplosaurus-reel-audio.mp4"
  "pantydraco-reel.mp4:sfx_pantydraco.mp3:pantydraco-reel-audio.mp4"
  "paralititan-reel.mp4:sfx_paralititan.mp3:paralititan-reel-audio.mp4"
  "parasaurolophus-reel.mp4:sfx_parasaurolophus.mp3:parasaurolophus-reel-audio.mp4"
  "parksosaurus-reel.mp4:sfx_parksosaurus.mp3:parksosaurus-reel-audio.mp4"
  "patagosaurus-reel.mp4:sfx_patagosaurus.mp3:patagosaurus-reel-audio.mp4"
  "pelicanimimus-reel.mp4:sfx_pelicanimimus.mp3:pelicanimimus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 10"
ls "$V"/*-audio.mp4 | wc -l
