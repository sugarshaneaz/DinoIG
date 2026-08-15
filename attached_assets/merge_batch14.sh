#!/bin/bash
V="attached_assets/generated_videos"
A="attached_assets/generated_audio"

pairs=(
  "saurophaganax-reel.mp4:sfx_saurophaganax.mp3:saurophaganax-reel-audio.mp4"
  "saurornithoides-reel.mp4:sfx_saurornithoides.mp3:saurornithoides-reel-audio.mp4"
  "scutellosaurus-reel.mp4:sfx_scutellosaurus.mp3:scutellosaurus-reel-audio.mp4"
  "secernosaurus-reel.mp4:sfx_secernosaurus.mp3:secernosaurus-reel-audio.mp4"
  "segisaurus-reel.mp4:sfx_segisaurus.mp3:segisaurus-reel-audio.mp4"
  "segnosaurus-reel.mp4:sfx_segnosaurus.mp3:segnosaurus-reel-audio.mp4"
  "shanag-reel.mp4:sfx_shanag.mp3:shanag-reel-audio.mp4"
  "tsintaosaurus-reel.mp4:sfx_tsintaosaurus.mp3:tsintaosaurus-reel-audio.mp4"
  "tuojiangosaurus-reel.mp4:sfx_tuojiangosaurus.mp3:tuojiangosaurus-reel-audio.mp4"
  "tylocephale-reel.mp4:sfx_tylocephale.mp3:tylocephale-reel-audio.mp4"
  "udanoceratops-reel.mp4:sfx_udanoceratops.mp3:udanoceratops-reel-audio.mp4"
  "unenlagia-reel.mp4:sfx_unenlagia.mp3:unenlagia-reel-audio.mp4"
  "urbacodon-reel.mp4:sfx_urbacodon.mp3:urbacodon-reel-audio.mp4"
  "utahraptor-reel.mp4:sfx_utahraptor.mp3:utahraptor-reel-audio.mp4"
  "valdosaurus-reel.mp4:sfx_valdosaurus.mp3:valdosaurus-reel-audio.mp4"
  "vulcanodon-reel.mp4:sfx_vulcanodon.mp3:vulcanodon-reel-audio.mp4"
  "yandusaurus-reel.mp4:sfx_yandusaurus.mp3:yandusaurus-reel-audio.mp4"
  "yangchuanosaurus-reel.mp4:sfx_yangchuanosaurus.mp3:yangchuanosaurus-reel-audio.mp4"
  "yimenosaurus-reel.mp4:sfx_yimenosaurus.mp3:yimenosaurus-reel-audio.mp4"
  "yingshanosaurus-reel.mp4:sfx_yingshanosaurus.mp3:yingshanosaurus-reel-audio.mp4"
  "yinlong-reel.mp4:sfx_yinlong.mp3:yinlong-reel-audio.mp4"
  "yuanmousaurus-reel.mp4:sfx_yuanmousaurus.mp3:yuanmousaurus-reel-audio.mp4"
  "yunnanosaurus-reel.mp4:sfx_yunnanosaurus.mp3:yunnanosaurus-reel-audio.mp4"
  "zalmoxes-reel.mp4:sfx_zalmoxes.mp3:zalmoxes-reel-audio.mp4"
  "zephyrosaurus-reel.mp4:sfx_zephyrosaurus.mp3:zephyrosaurus-reel-audio.mp4"
  "zuniceratops-reel.mp4:sfx_zuniceratops.mp3:zuniceratops-reel-audio.mp4"
)

for pair in "${pairs[@]}"; do
  IFS=':' read -r vid sfx out <<< "$pair"
  ffmpeg -i "$V/$vid" -i "$A/$sfx" -c:v copy -c:a aac -shortest -y "$V/$out" 2>/dev/null &
done

wait
echo "Done merging batch 14"
ls "$V"/*-audio.mp4 | wc -l
