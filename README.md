# 开发进度

当前处于开发测试阶段！！！

# 理想文档

定位于个人和小团队的云文档。我们倡导私有化部署，数据掌握在自己手里，不用受制于人。

> 本仓库为前端仓库，后端代码仓库请移步：[yomea/lx-doc](https://github.com/yomea/lx-doc)。

## 重要提示！！！

1.不会支持协同编辑；

2.不会支持手机端、客户端；

4.不会提供在线服务，只做私有化部署；

## 功能计划

1.支持分享链接；

2.支持团队空间；

3.支持模板广场；

## 功能限制

编辑器部分因为我们也是站在巨人的肩膀上，所以原则上来说原项目不支持的功能我们也无法支持，原项目的bug，我们也不一定能修复。

# 目录结构

- `workbench`: 工作台项目，提供登录注册、文件夹和文件列表的管理；

- `mind-map`: 思维导图项目，提供思维导图的编辑功能；

- `markdown`: Markdown 项目，提供 Markdown 的编辑功能；

- `doc`: 文档项目，提供文档的编辑功能；

- `sheet`: 电子表格项目，提供电子表格的编辑功能；

- `ppt`: 幻灯片项目，提供幻灯片的编辑功能；

- `whiteboard`: 白板项目，提供白板的编辑功能；

- `flowchart`: 流程图项目，提供流程图的编辑功能；

- `bpmn`: BPMN 项目，提供 BPMN 的编辑功能；

- `note`: 笔记项目，提供笔记的编辑功能；

# 部署

每个目录都为一个单独的项目，需要单独部署，部署的路径规则如下：

- `workbench`: 根路径`/`

- `mind-map`: 路径`/mind-map/`

- `markdown`: 路径`/markdown/`

- `doc`: 路径`/doc/`

- `sheet`: 路径`/sheet/`

- `ppt`: 路径`/ppt/`

- `whiteboard`: 路径`/whiteboard/`

- `bpmn`: 路径`/bpmn/`

- `flowchart`：路径`/flowchart/`

- `note`: 路径`/note/`

每个项目的部署成果物需要自行打包构建，如果您不愿自己动手，那么可以联系我们通过付费的方式获取成果物。

联系我们：前端[wanglin2](https://github.com/wanglin2)、后端[yomea](https://github.com/yomea)。

## 关于图片、文件

项目中的图片和文件均存储在服务器上，如果您需要存储到 OSS，可以自行修改，或联系我们。

# 本项目编辑器部分基于以下开源项目

- 思维导图（MIT 协议）: [mind-map](https://github.com/wanglin2/mind-map)

- Markdown（MIT 协议）：[md-editor-v3](https://github.com/imzbf/md-editor-v3)

- 文档（MIT 协议）：[wangEditor](https://github.com/wangeditor-team/wangEditor)

- 电子表格（MIT 协议）：[Luckysheet](https://github.com/dream-num/Luckysheet)

- 幻灯片（AGPL-3.0 协议）：[PPTist](https://github.com/pipipi-pikachu/PPTist)

- 白板（MIT 协议）: [excalidraw](https://github.com/excalidraw/excalidraw)

- 流程图（Apache-2.0 协议）: [drawio](https://github.com/jgraph/drawio)

- BPMN（自有协议）：[bpmn-js](https://github.com/bpmn-io/bpmn-js)

- 笔记（Apache-2.0 协议）：[editor.js](https://github.com/codex-team/editor.js)

我们做了什么？

> 我们开发了工作台项目，用于管理文件夹和文件，并提供登录注册的功能。
>
> 然后在以上优秀的开源项目基础上添加了数据云存储的功能。

# 开源协议

[AGPL-3.0 License](./LICENSE)

本项目的开源协议为`AGPL-3.0`，简要描述就是您可以商用，但必须保留所使用开源项目的版权，并且源码也必须开源。当然，如果您不想开源，可以联系我们。

不过您也需要关注本项目所使用的项目的开源协议。
