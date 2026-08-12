#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "atlascopcosaurus-reel.mp4:sfx_atlascopcosaurus.mp3:atlascopcosaurus-reel-audio.mp4"
  "austrosaurus-reel.mp4:sfx_austrosaurus.mp3:austrosaurus-reel-audio.mp4"
  "avaceratops-reel.mp4:sfx_avaceratops.mp3:avaceratops-reel-audio.mp4"
  "avimimus-reel.mp4:sfx_avimimus.mp3:avimimus-reel-audio.mp4"
  "bactrosaurus-reel.mp4:sfx_bactrosaurus.mp3:bactrosaurus-reel-audio.mp4"
  "bagaceratops-reel.mp4:sfx_bagaceratops.mp3:bagaceratops-reel-audio.mp4"
  "bambiraptor-reel.mp4:sfx_bambiraptor.mp3:bambiraptor-reel-audio.mp4"
  "barapasaurus-reel.mp4:sfx_barapasaurus.mp3:barapasaurus-reel-audio.mp4"
  "barosaurus-reel.mp4:sfx_barosaurus.mp3:barosaurus-reel-audio.mp4"
  "baryonyx-reel.mp4:sfx_baryonyx.mp3:baryonyx-reel-audio.mp4"
  "becklespinax-reel.mp4:sfx_becklespinax.mp3:becklespinax-reel-audio.mp4"
  "beipiaosaurus-reel.mp4:sfx_beipiaosaurus.mp3:beipiaosaurus-reel-audio.mp4"
  "borogovia-reel.mp4:sfx_borogovia.mp3:borogovia-reel-audio.mp4"
  "brachylophosaurus-reel.mp4:sfx_brachylophosaurus.mp3:brachylophosaurus-reel-audio.mp4"
  "brachytrachelopan-reel.mp4:sfx_brachytrachelopan.mp3:brachytrachelopan-reel-audio.mp4"
  "buitreraptor-reel.mp4:sfx_buitreraptor.mp3:buitreraptor-reel-audio.mp4"
  "camarasaurus-reel.mp4:sfx_camarasaurus.mp3:camarasaurus-reel-audio.mp4"
  "camptosaurus-reel.mp4:sfx_camptosaurus.mp3:camptosaurus-reel-audio.mp4"
  "carcharodontosaurus-reel.mp4:sfx_carcharodontosaurus.mp3:carcharodontosaurus-reel-audio.mp4"
  "carnotaurus-reel.mp4:sfx_carnotaurus.mp3:carnotaurus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done"
ls "$V"/*-audio.mp4 | wc -l
