#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "bellusaurus-reel.mp4:sfx_bellusaurus.mp3:bellusaurus-reel-audio.mp4"
  "caudipteryx-reel.mp4:sfx_caudipteryx.mp3:caudipteryx-reel-audio.mp4"
  "cedarpelta-reel.mp4:sfx_cedarpelta.mp3:cedarpelta-reel-audio.mp4"
  "centrosaurus-reel.mp4:sfx_centrosaurus.mp3:centrosaurus-reel-audio.mp4"
  "ceratosaurus-reel.mp4:sfx_ceratosaurus.mp3:ceratosaurus-reel-audio.mp4"
  "cetiosauriscus-reel.mp4:sfx_cetiosauriscus.mp3:cetiosauriscus-reel-audio.mp4"
  "cetiosaurus-reel.mp4:sfx_cetiosaurus.mp3:cetiosaurus-reel-audio.mp4"
  "chaoyangsaurus-reel.mp4:sfx_chaoyangsaurus.mp3:chaoyangsaurus-reel-audio.mp4"
  "chasmosaurus-reel.mp4:sfx_chasmosaurus.mp3:chasmosaurus-reel-audio.mp4"
  "chindesaurus-reel.mp4:sfx_chindesaurus.mp3:chindesaurus-reel-audio.mp4"
  "chinshakiangosaurus-reel.mp4:sfx_chinshakiangosaurus.mp3:chinshakiangosaurus-reel-audio.mp4"
  "chirostenotes-reel.mp4:sfx_chirostenotes.mp3:chirostenotes-reel-audio.mp4"
  "chubutisaurus-reel.mp4:sfx_chubutisaurus.mp3:chubutisaurus-reel-audio.mp4"
  "chungkingosaurus-reel.mp4:sfx_chungkingosaurus.mp3:chungkingosaurus-reel-audio.mp4"
  "citipati-reel.mp4:sfx_citipati.mp3:citipati-reel-audio.mp4"
  "coelophysis-reel.mp4:sfx_coelophysis.mp3:coelophysis-reel-audio.mp4"
  "coelurus-reel.mp4:sfx_coelurus.mp3:coelurus-reel-audio.mp4"
  "coloradisaurus-reel.mp4:sfx_coloradisaurus.mp3:coloradisaurus-reel-audio.mp4"
  "compsognathus-reel.mp4:sfx_compsognathus.mp3:compsognathus-reel-audio.mp4"
  "conchoraptor-reel.mp4:sfx_conchoraptor.mp3:conchoraptor-reel-audio.mp4"
  "confuciusornis-reel.mp4:sfx_confuciusornis.mp3:confuciusornis-reel-audio.mp4"
  "corythosaurus-reel.mp4:sfx_corythosaurus.mp3:corythosaurus-reel-audio.mp4"
  "cryolophosaurus-reel.mp4:sfx_cryolophosaurus.mp3:cryolophosaurus-reel-audio.mp4"
  "dacentrurus-reel.mp4:sfx_dacentrurus.mp3:dacentrurus-reel-audio.mp4"
  "daspletosaurus-reel.mp4:sfx_daspletosaurus.mp3:daspletosaurus-reel-audio.mp4"
  "datousaurus-reel.mp4:sfx_datousaurus.mp3:datousaurus-reel-audio.mp4"
  "deinocheirus-reel.mp4:sfx_deinocheirus.mp3:deinocheirus-reel-audio.mp4"
  "deinonychus-reel.mp4:sfx_deinonychus.mp3:deinonychus-reel-audio.mp4"
  "deltadromeus-reel.mp4:sfx_deltadromeus.mp3:deltadromeus-reel-audio.mp4"
  "dicraeosaurus-reel.mp4:sfx_dicraeosaurus.mp3:dicraeosaurus-reel-audio.mp4"
  "dilophosaurus-reel.mp4:sfx_dilophosaurus.mp3:dilophosaurus-reel-audio.mp4"
  "diplodocus-reel.mp4:sfx_diplodocus.mp3:diplodocus-reel-audio.mp4"
  "dromaeosaurus-reel.mp4:sfx_dromaeosaurus.mp3:dromaeosaurus-reel-audio.mp4"
  "dromiceiomimus-reel.mp4:sfx_dromiceiomimus.mp3:dromiceiomimus-reel-audio.mp4"
  "dryosaurus-reel.mp4:sfx_dryosaurus.mp3:dryosaurus-reel-audio.mp4"
  "dryptosaurus-reel.mp4:sfx_dryptosaurus.mp3:dryptosaurus-reel-audio.mp4"
  "dubreuillosaurus-reel.mp4:sfx_dubreuillosaurus.mp3:dubreuillosaurus-reel-audio.mp4"
  "edmontonia-reel.mp4:sfx_edmontonia.mp3:edmontonia-reel-audio.mp4"
  "edmontosaurus-reel.mp4:sfx_edmontosaurus.mp3:edmontosaurus-reel-audio.mp4"
  "einiosaurus-reel.mp4:sfx_einiosaurus.mp3:einiosaurus-reel-audio.mp4"
  "elaphrosaurus-reel.mp4:sfx_elaphrosaurus.mp3:elaphrosaurus-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging"
ls "$V"/*-audio.mp4 | wc -l
