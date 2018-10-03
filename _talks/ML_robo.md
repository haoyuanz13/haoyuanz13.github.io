---
title: "Machine Learning applied in the modern robot"
collection: talks
type: "Research Project @GRASP Lab"
permalink: /talks/ML_robo
venue: "CIS Department@UPenn"
date: 2017-02-14
location: "Philadelphia, PA"
---

Implemented some of the most popular used machine learning algorithms and applied them into the real robot cases.  
1. **Object Detection and Geometry distance estimation based on GMM**: trained some GMMs based on the image color data, also combined image processing and geometry algorithms to detetct any read barrel in a robot's view and estimate its real geometry distance from robot. *[`source code`](https://github.com/haoyuanz13/Machine_Learning_in_Robotics/tree/master/object_detection_GMM)*
2. **Robot Gesture Recoginition using Hidden Markov Model (HMM)**: built an algorithm based on the HMM to recognize different robot arm motion gestures. Finally, it was able to classify unknown arm motions within almost real-time. *[`source code`](https://github.com/haoyuanz13/Machine_Learning_in_Robotics/tree/master/HMM-Gesture%20Recognition)*
3. **Reinforcement Learning using Policy Gradient Methods**: implemented several methods for dealing with the Robot Walking on the Frozen Lake problem. The situation can be represented via a Markov Decision Process(MDP) and a strategy for retrieving the frisbee can be obtained using value iteration (VI), policy iteration (PI), and policy gradient optimization (PGO). *[`source code`](https://github.com/haoyuanz13/Machine_Learning_in_Robotics/tree/master/Reinforcement_Learning)*

