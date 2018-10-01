---
title: "The Face Detection and Replacement Package Design"
collection: talks
type: "Academic Project @Robotics Program"
permalink: /talks/face_det_replace
venue: "CIS Department@UPenn"
date: 2016-08-20
location: "Philadelphia, PA"
---

*[source code](https://github.com/haoyuanz13/Face_Detection_Replacement)*     
*[demo 1](https://youtu.be/Ubd4mFpVJ3o)* / *[demo 2](https://youtu.be/I11WEwDn78A)*
1. Utilized human skin color as feature to train GMM model to filter out face region candidates. Combined with edge mask to separate union face regions for better detection.
2. Implemented PCA to construct Eigen Faces dataset and included the third-part package Face++ to improve detection performance. The final accuracy of detection reached 82.6%.
3. Implemented image morphing such as TPS and gradient blending to complete face replacement task. 
