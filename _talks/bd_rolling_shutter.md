---
title: "Rolling Shutter Compensation with IMU"
collection: talks
type: "Industry Project @ByteDance / PICO"
permalink: /talks/bd_rolling_shutter
venue: "PICO / Inter-Perception RD, ByteDance"
date: 2021-12-15
date_range: "Dec 2021 – Feb 2022"
location: "Shanghai, China"
---

**Project Owner** &middot; Use IMU data to compensate for the rolling-shutter "jelly" effect in RGB cameras under fast motion.

1. Modeled the per-row exposure timing of the RGB sensor and used IMU rotations between rows to undo the rolling-shutter distortion.
2. Cleaned up the visible jelly artifact that shows up during fast head motion, improving downstream tracking and visual quality.
