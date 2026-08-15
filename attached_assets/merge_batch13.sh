#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "sinosauropteryx-reel.mp4:sfx_sinosauropteryx.mp3:sinosauropteryx-reel-audio.mp4"
  "sinovenator-reel.mp4:sfx_sinovenator.mp3:sinovenator-reel-audio.mp4"
  "sonidosaurus-reel.mp4:sfx_sonidosaurus.mp3:sonidosaurus-reel-audio.mp4"
  "spinosaurus-reel.mp4:sfx_spinosaurus.mp3:spinosaurus-reel-audio.mp4"
  "staurikosaurus-reel.mp4:sfx_staurikosaurus.mp3:staurikosaurus-reel-audio.mp4"
  "stegoceras-reel.mp4:sfx_stegoceras.mp3:stegoceras-reel-audio.mp4"
  "stenopelix-reel.mp4:sfx_stenopelix.mp3:stenopelix-reel-audio.mp4"
  "struthiomimus-reel.mp4:sfx_struthiomimus.mp3:struthiomimus-reel-audio.mp4"
  "struthiosaurus-reel.mp4:sfx_struthiosaurus.mp3:struthiosaurus-reel-audio.mp4"
  "styracosaurus-reel.mp4:sfx_styracosaurus.mp3:styracosaurus-reel-audio.mp4"
  "suchomimus-reel.mp4:sfx_suchomimus.mp3:suchomimus-reel-audio.mp4"
  "supersaurus-reel.mp4:sfx_supersaurus.mp3:supersaurus-reel-audio.mp4"
  "talarurus-reel.mp4:sfx_talarurus.mp3:talarurus-reel-audio.mp4"
  "tanius-reel.mp4:sfx_tanius.mp3:tanius-reel-audio.mp4"
  "tarbosaurus-reel.mp4:sfx_tarbosaurus.mp3:tarbosaurus-reel-audio.mp4"
  "tarchia-reel.mp4:sfx_tarchia.mp3:tarchia-reel-audio.mp4"
  "telmatosaurus-reel.mp4:sfx_telmatosaurus.mp3:telmatosaurus-reel-audio.mp4"
  "tenontosaurus-reel.mp4:sfx_tenontosaurus.mp3:tenontosaurus-reel-audio.mp4"
  "thecodontosaurus-reel.mp4:sfx_thecodontosaurus.mp3:thecodontosaurus-reel-audio.mp4"
  "therizinosaurus-reel.mp4:sfx_therizinosaurus.mp3:therizinosaurus-reel-audio.mp4"
  "thescelosaurus-reel.mp4:sfx_thescelosaurus.mp3:thescelosaurus-reel-audio.mp4"
  "torosaurus-reel.mp4:sfx_torosaurus.mp3:torosaurus-reel-audio.mp4"
  "torvosaurus-reel.mp4:sfx_torvosaurus.mp3:torvosaurus-reel-audio.mp4"
  "troodon-reel.mp4:sfx_troodon.mp3:troodon-reel-audio.mp4"
  "tsagantegia-reel.mp4:sfx_tsagantegia.mp3:tsagantegia-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 13"
ls "$V"/*-audio.mp4 | wc -l
