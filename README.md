# Nikki
## 识别衣柜编号

为更简单粗暴的使用[在线工具](http://seal100x.github.io/nikkiup2u3/#)写的小脚本。主要通过对衣柜进行截图上传，裁剪编号并自动识别。

## 自动复制
借助于苹果爸爸的实现，Mac 和 iOS 之间可以实现一个设备复制，另外一个设备粘贴的操作。
将 `js/tampermonkey.js` 添加到油猴插件中（不知道的自行 Google / Baidu）
加载页面，筛选出结果后，按 `,` 键初始化（每次获取结果后需要初始化一次，可在控制台看到所有结果的数组），再按 `.` 可实现逐项复制（可在控制台查看当前复制的选项）。

## FEATURE
- [] 自动识别边框来获取数组
- [] 复制粘贴支持复制 前一个/后一个