#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "megalosaurus-reel.mp4:sfx_megalosaurus.mp3:megalosaurus-reel-audio.mp4"
  "melanorosaurus-reel.mp4:sfx_melanorosaurus.mp3:melanorosaurus-reel-audio.mp4"
  "metriacanthosaurus-reel.mp4:sfx_metriacanthosaurus.mp3:metriacanthosaurus-reel-audio.mp4"
  "microceratus-reel.mp4:sfx_microceratus.mp3:microceratus-reel-audio.mp4"
  "micropachycephalosaurus-reel.mp4:sfx_micropachycephalosaurus.mp3:micropachycephalosaurus-reel-audio.mp4"
  "minmi-reel.mp4:sfx_minmi.mp3:minmi-reel-audio.mp4"
  "monolophosaurus-reel.mp4:sfx_monolophosaurus.mp3:monolophosaurus-reel-audio.mp4"
  "mononykus-reel.mp4:sfx_mononykus.mp3:mononykus-reel-audio.mp4"
  "mussaurus-reel.mp4:sfx_mussaurus.mp3:mussaurus-reel-audio.mp4"
  "muttaburrasaurus-reel.mp4:sfx_muttaburrasaurus.mp3:muttaburrasaurus-reel-audio.mp4"
  "nanshiungosaurus-reel.mp4:sfx_nanshiungosaurus.mp3:nanshiungosaurus-reel-audio.mp4"
  "nedoceratops-reel.mp4:sfx_nedoceratops.mp3:nedoceratops-reel-audio.mp4"
  "nemegtosaurus-reel.mp4:sfx_nemegtosaurus.mp3:nemegtosaurus-reel-audio.mp4"
  "neovenator-reel.mp4:sfx_neovenator.mp3:neovenator-reel-audio.mp4"
  "neuquenosaurus-reel.mp4:sfx_neuquenosaurus.mp3:neuquenosaurus-reel-audio.mp4"
  "nigersaurus-reel.mp4:sfx_nigersaurus.mp3:nigersaurus-reel-audio.mp4"
  "nipponosaurus-reel.mp4:sfx_nipponosaurus.mp3:nipponosaurus-reel-audio.mp4"
  "noasaurus-reel.mp4:sfx_noasaurus.mp3:noasaurus-reel-audio.mp4"
  "nodosaurus-reel.mp4:sfx_nodosaurus.mp3:nodosaurus-reel-audio.mp4"
  "nomingia-reel.mp4:sfx_nomingia.mp3:nomingia-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 9"
ls "$V"/*-audio.mp4 | wc -l
