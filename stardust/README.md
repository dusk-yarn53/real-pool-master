# 掌间星河

单手手势驱动的三维粒子实验室，提供爱心、花朵、土星、烟花、地球、千里江山和昙花模型，支持颜色调节、全屏、鼠标和触控。

## 在线体验

https://dusk-yarn53.github.io/real-pool-master/stardust/

星河位于仓库的 stardust 子目录，由现有 GitHub Pages（main 分支 / 根目录）发布。仓库根目录继续提供原有台球网站。

## 使用

在 HTTPS 下打开页面，点击开启摄像头并授权。手掌张合控制粒子聚散，伸出食指左右移动控制旋转，手指靠近或远离摄像头控制缩放。无摄像头时可使用鼠标或触控。

识别代码、模型和 WebAssembly 均随站点提供，访客无需访问 Google 或第三方脚本 CDN。摄像头画面仅在访客设备处理，不上传。

## 验证与维护

部署前已验证 JavaScript、粒子模型、资源 SHA256、模型完整性和 WebAssembly 编译。中国大陆各运营商网络可达性与摄像头真机效果需实测。

本地运行：在本目录执行 `python -m http.server 8080`，浏览器打开 http://localhost:8080/ 。

资源来源见 vendor/ASSET-MANIFEST.json，MediaPipe 许可证见 vendor/mediapipe/LICENSE。
