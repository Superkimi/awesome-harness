# QA · MiMo-Code ch03-loop

- Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
- HyperFrames lint: PASS (0 errors, 0 warnings); raw *.lint.json.
- HyperFrames check: lint/layout/contrast PASS; the non-escalated runtime probe reports local listen EPERM; rendering was executed with elevated local permission and succeeded.
- MP4: renders/ch03-loop.mp4; 132.000s; 1080×1920; 30fps; rendered with the local cached HyperFrames CLI.
- SRT: renders/ch03-loop.srt; 12 cues; independent captions.
- ffprobe and four key-frame checkpoints: PASS; raw *.ffprobe.json and source/qa/frame-*.png.
- Status: PUBLISHED.
