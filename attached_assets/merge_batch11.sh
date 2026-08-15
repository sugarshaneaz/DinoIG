#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "pelorosaurus-reel.mp4:sfx_pelorosaurus.mp3:pelorosaurus-reel-audio.mp4"
  "pentaceratops-reel.mp4:sfx_pentaceratops.mp3:pentaceratops-reel-audio.mp4"
  "piatnitzkysaurus-reel.mp4:sfx_piatnitzkysaurus.mp3:piatnitzkysaurus-reel-audio.mp4"
  "pinacosaurus-reel.mp4:sfx_pinacosaurus.mp3:pinacosaurus-reel-audio.mp4"
  "plateosaurus-reel.mp4:sfx_plateosaurus.mp3:plateosaurus-reel-audio.mp4"
  "podokesaurus-reel.mp4:sfx_podokesaurus.mp3:podokesaurus-reel-audio.mp4"
  "poekilopleuron-reel.mp4:sfx_poekilopleuron.mp3:poekilopleuron-reel-audio.mp4"
  "polacanthus-reel.mp4:sfx_polacanthus.mp3:polacanthus-reel-audio.mp4"
  "prenocephale-reel.mp4:sfx_prenocephale.mp3:prenocephale-reel-audio.mp4"
  "probactrosaurus-reel.mp4:sfx_probactrosaurus.mp3:probactrosaurus-reel-audio.mp4"
  "proceratosaurus-reel.mp4:sfx_proceratosaurus.mp3:proceratosaurus-reel-audio.mp4"
  "procompsognathus-reel.mp4:sfx_procompsognathus.mp3:procompsognathus-reel-audio.mp4"
  "prosaurolophus-reel.mp4:sfx_prosaurolophus.mp3:prosaurolophus-reel-audio.mp4"
  "protarchaeopteryx-reel.mp4:sfx_protarchaeopteryx.mp3:protarchaeopteryx-reel-audio.mp4"
  "protoceratops-reel.mp4:sfx_protoceratops.mp3:protoceratops-reel-audio.mp4"
  "protohadros-reel.mp4:sfx_protohadros.mp3:protohadros-reel-audio.mp4"
  "psittacosaurus-reel.mp4:sfx_psittacosaurus.mp3:psittacosaurus-reel-audio.mp4"
  "quaesitosaurus-reel.mp4:sfx_quaesitosaurus.mp3:quaesitosaurus-reel-audio.mp4"
  "rebbachisaurus-reel.mp4:sfx_rebbachisaurus.mp3:rebbachisaurus-reel-audio.mp4"
  "rhabdodon-reel.mp4:sfx_rhabdodon.mp3:rhabdodon-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 11"
ls "$V"/*-audio.mp4 | wc -l
