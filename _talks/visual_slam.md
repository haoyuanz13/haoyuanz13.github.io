---
title: "SFM and Visual SLAM"
collection: talks
type: "Research Project @GRASP Lab"
permalink: /talks/visual_slam
venue: "CIS Department@UPenn"
date: 2017-03-05
location: "Philadelphia, PA"
---

Implemented Visual SLAM package and built 3D trajectory as well as 3D point cloud map.
1. **Structure From Motion(SFM)**: implemented Triangulation, PnP and Bundle Adjustment manually with Jacobian for camera state and 3D landmarks estimation and optimization. *[`source code`](https://github.com/haoyuanz13/Visual_SLAM/tree/master/Structure_From_Motion)*
2. **Visual SLAM Package on a Quadrotor**: based on SFM structure, succeeded to implement Visual Odometry(VO), applied local BA(Bundle Adjustment) and combined g2O package to increase the SLAM efficiency as well as performance. *[`source code`](https://github.com/haoyuanz13/Visual_SLAM/tree/master/Visual_SLAM_3DMap)*

