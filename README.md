# 理想文档

定位于个人和小团队的云文档。

> 本仓库为前端仓库，后端代码仓库请移步：[yomea/lx-doc](https://github.com/yomea/lx-doc)。

重要提示：

1.不支持协同编辑；

2.不支持手机端、客户端；

3.不提供在线服务，只做私有化部署；

# 目录结构

- `workbench`：工作台项目，提供登录注册、文件夹和文件列表的管理；

- `mind-map`：思维导图项目，提供思维导图的编辑功能；

- `markdown`：Markdown 项目，提供 Markdown 的编辑功能；

# 部署

每个目录都为一个单独的项目，需要单独部署，部署的路径规则如下：

- `workbench`：根路径`/`

- `mind-map`：路径`/mind-map/`

- `markdown`：路径`/markdown/`

每个项目的部署成果物需要自行打包构建，如果您不愿自己动手，那么可以联系我们，我们提供付费服务。

联系我们：前端[wanglin2](https://github.com/wanglin2)、后端[yomea](https://github.com/yomea)。

# 本项目基于以下开源项目构建

完整依赖请查看各个项目下的 package.json 文件。

- 思维导图：[mind-map](https://github.com/wanglin2/mind-map)

- Markdown：[md-editor-v3](https://github.com/imzbf/md-editor-v3)
