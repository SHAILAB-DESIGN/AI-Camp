# AI 科研加速营官网

AI 科研加速营活动官网，面向科研人员与科技工作者，提供活动介绍、课程内容、在线报名、报名成功状态和邀请排行榜等页面。

## 功能

- 活动首页：课程、时间安排、学员福利、适合人群与常见问题
- 登录与报名：登录状态识别、必填校验、研究方向分组
- 报名完成页：班级群二维码与课程进度
- 活动分享：邀请海报、链接复制与登录后分享流程
- 排行榜：完整昵称、当前用户排名与分页展示
- 响应式布局：适配桌面端与移动端

## 技术栈

- React 19
- Next.js 16
- vinext / Vite
- Cloudflare Workers
- TypeScript
- Phosphor Icons

## 本地运行

环境要求：Node.js `>= 22.13.0`。

```bash
npm ci
npm run dev
```

打开 [http://localhost:3001](http://localhost:3001)。

常用命令：

```bash
npm run dev       # 启动本地开发服务
npm run build     # 构建检查
npm run lint      # 代码规范检查
npm test          # 构建并运行项目检查
```

## 页面路由

| 路由 | 页面 |
| --- | --- |
| `/` | 活动首页 |
| `/register` | 报名页与报名完成状态 |
| `/invitations` | 邀请福利与排行榜 |

开发环境支持以下预览参数：

- `?preview=logged-in`：模拟登录状态
- `/register?preview=registered`：查看报名完成页面
- `/invitations?preview=logged-in&shared=1`：查看分享后的当前排名

## 目录结构

```text
app/                 页面、组件与接口
public/              图片、二维码和品牌素材
tests/               项目检查
worker/              Cloudflare Worker 入口
.openai/hosting.json 托管配置
```

## GitHub 同步

在 GitHub 创建空仓库后执行：

```bash
git remote add origin <你的仓库地址>
git add .
git commit -m "chore: initialize AI research camp site"
git push -u origin main
```

仓库已配置 GitHub Actions。推送到 `main` 或创建 Pull Request 时，会自动安装依赖并执行构建检查。

## 发布前检查

- 将示例排行榜数据替换为正式接口数据
- 确认班级群二维码、活动日期和合作单位素材为最终版本
- 不要提交密钥或本地环境变量；`.env*` 已默认忽略
- 检查登录回跳地址与生产域名配置

## 许可

当前项目未声明开源许可证。公开仓库前请根据实际使用范围补充许可证或保持仓库为私有。
