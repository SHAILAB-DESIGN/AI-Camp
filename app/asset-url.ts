// GitHub Pages 静态预览部署在 /AI-Camp/ 子路径下，根路径开头的资源与路由
// 需要加上前缀；本地开发和正式服务器部署在根路径，不需要前缀。
export const BASE_PATH = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/AI-Camp" : "";

/** 静态资源（图片等 public 文件）地址 */
export const assetUrl = (path: string) => `${BASE_PATH}${path}`;

/** 站内页面路由地址；静态预览下各页面是目录（register/index.html），需要补结尾斜杠 */
export const routeUrl = (href: string) => {
  if (!BASE_PATH) return href;
  const match = href.match(/^(\/[^?#]*)([?#].*)?$/);
  if (!match) return href;
  const path = match[1] === "/" ? "/" : `${match[1]}/`;
  return `${BASE_PATH}${path}${match[2] ?? ""}`;
};
