---
name: Dino Reel Pipeline
description: Status and conventions for the dinosaur video reel generation pipeline
---

## Status
All 311 dinosaurs have `reel_url` set in the `dinosaurs` table. Pipeline complete as of August 2026.

## File locations
- Raw videos: `attached_assets/generated_videos/*-reel.mp4`
- SFX audio: `attached_assets/generated_audio/sfx_*.mp3`
- Merged (video+audio): `attached_assets/generated_videos/*-reel-audio.mp4`
- Served from: `artifacts/api-server/public/videos/` (311 files)
- DB field: `reel_url` TEXT nullable, e.g. `/api/videos/tyrannosaurus-reel-audio.mp4`

## Conventions
- Filename slug: lowercase name, hyphens (e.g. `t-rex` → `t-rex-reel-audio.mp4`)
- Videos: 9:16, 6 seconds, single hero shot — carnivores get action, herbivores get peaceful
- SFX: `generateSoundEffect`, 6 seconds, merged with ffmpeg (`-c:v copy -c:a aac -shortest`)
- Rate limit: ElevenLabs SFX hits 429 at ~20 parallel; launch all, await, retry the 3–6 failures
- Retry artifact: if retry produces `*-reel_2.mp4` (original existed), rename to canonical before merging

## Outstanding TODOs
- Re-enable paywall: revert `artifacts/mobile/lib/usePremium.ts` one-liner back to `const isPremium = isSubscribed || (!isLoading && !hasOfferings)`
- Narration feature (user records voice per dino) — discussed but deferred

**Why this file exists:** The pipeline ran across many sessions; these conventions prevent re-doing decisions on retry behavior, rate limits, and file naming.
