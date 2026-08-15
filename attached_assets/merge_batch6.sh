#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "gilmoreosaurus-reel.mp4:sfx_gilmoreosaurus.mp3:gilmoreosaurus-reel-audio.mp4"
  "giraffatitan-reel.mp4:sfx_giraffatitan.mp3:giraffatitan-reel-audio.mp4"
  "gobisaurus-reel.mp4:sfx_gobisaurus.mp3:gobisaurus-reel-audio.mp4"
  "gorgosaurus-reel.mp4:sfx_gorgosaurus.mp3:gorgosaurus-reel-audio.mp4"
  "goyocephale-reel.mp4:sfx_goyocephale.mp3:goyocephale-reel-audio.mp4"
  "graciliceratops-reel.mp4:sfx_graciliceratops.mp3:graciliceratops-reel-audio.mp4"
  "gryposaurus-reel.mp4:sfx_gryposaurus.mp3:gryposaurus-reel-audio.mp4"
  "guaibasaurus-reel.mp4:sfx_guaibasaurus.mp3:guaibasaurus-reel-audio.mp4"
  "guanlong-reel.mp4:sfx_guanlong.mp3:guanlong-reel-audio.mp4"
  "hadrosaurus-reel.mp4:sfx_hadrosaurus.mp3:hadrosaurus-reel-audio.mp4"
  "hagryphus-reel.mp4:sfx_hagryphus.mp3:hagryphus-reel-audio.mp4"
  "haplocanthosaurus-reel.mp4:sfx_haplocanthosaurus.mp3:haplocanthosaurus-reel-audio.mp4"
  "harpymimus-reel.mp4:sfx_harpymimus.mp3:harpymimus-reel-audio.mp4"
  "herrerasaurus-reel.mp4:sfx_herrerasaurus.mp3:herrerasaurus-reel-audio.mp4"
  "hesperosaurus-reel.mp4:sfx_hesperosaurus.mp3:hesperosaurus-reel-audio.mp4"
  "heterodontosaurus-reel.mp4:sfx_heterodontosaurus.mp3:heterodontosaurus-reel-audio.mp4"
  "heyuannia-reel.mp4:sfx_heyuannia.mp3:heyuannia-reel-audio.mp4"
  "homalocephale-reel.mp4:sfx_homalocephale.mp3:homalocephale-reel-audio.mp4"
  "huayangosaurus-reel.mp4:sfx_huayangosaurus.mp3:huayangosaurus-reel-audio.mp4"
  "hylaeosaurus-reel.mp4:sfx_hylaeosaurus.mp3:hylaeosaurus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 6"
ls "$V"/*-audio.mp4 | wc -l
