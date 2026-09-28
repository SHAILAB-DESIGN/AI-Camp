import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "docs");
const basePath = "/AI-Camp";

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, "dist", "client"), output, { recursive: true });

const worker = (await import(join(root, "dist", "server", "index.js"))).default;
const routes = [
  ["/", join(output, "index.html")],
  ["/register", join(output, "register", "index.html")],
  ["/invitations", join(output, "invitations", "index.html")],
];

function makeStatic(html) {
  return html
    .replace(/\b(href|src)=["']\/(?!\/|AI-Camp[\/"'])([^"']*)["']/gi, (_, attribute, path) => {
      const suffix = path === "" ? "/" : `/${path}`;
      const normalized = suffix === "/register" || suffix === "/invitations" ? `${suffix}/` : suffix;
      return `${attribute}="${basePath}${normalized}"`;
    })
    // 客户端水合入口是内联脚本里的 import("/assets/...")，属性重写覆盖不到
    .replace(/import\(["']\/(?!\/|AI-Camp\/)/g, `import("${basePath}/`)
    .replace("</head>", '<meta name="robots" content="noindex" /></head>');
}

for (const [route, filename] of routes) {
  const response = await worker.fetch(new Request(`http://github-pages.local${route}`), {}, undefined);
  if (!response.ok) throw new Error(`Unable to render ${route}: ${response.status}`);
  await mkdir(dirname(filename), { recursive: true });
  await writeFile(filename, makeStatic(await response.text()));
}

// manifest 不一定列出 CSS 条目，直接扫描 assets 目录里的所有 CSS 文件，
// 把其中的根路径 url(...) 统一加上 basePath 前缀（含带引号写法）
const assetsDir = join(output, "assets");
for (const file of await readdir(assetsDir)) {
  if (!file.endsWith(".css")) continue;
  const cssPath = join(assetsDir, file);
  const css = await readFile(cssPath, "utf8");
  const rewritten = css
    .replaceAll("url(/", `url(${basePath}/`)
    .replaceAll("url('/", `url('${basePath}/`)
    .replaceAll('url("/', `url("${basePath}/`);
  await writeFile(cssPath, rewritten);
}

await writeFile(join(output, ".nojekyll"), "");
