import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi, "")
    .replace(/\b(href|src)=["']\/(?!\/)([^"']*)["']/gi, (_, attribute, path) => {
      const suffix = path === "" ? "/" : `/${path}`;
      const normalized = suffix === "/register" || suffix === "/invitations" ? `${suffix}/` : suffix;
      return `${attribute}="${basePath}${normalized}"`;
    })
    .replace("</head>", '<meta name="robots" content="noindex" /></head>');
}

for (const [route, filename] of routes) {
  const response = await worker.fetch(new Request(`http://github-pages.local${route}`), {}, undefined);
  if (!response.ok) throw new Error(`Unable to render ${route}: ${response.status}`);
  await mkdir(dirname(filename), { recursive: true });
  await writeFile(filename, makeStatic(await response.text()));
}

const manifest = JSON.parse(await readFile(join(output, ".vite", "manifest.json"), "utf8"));
for (const entry of Object.values(manifest)) {
  if (!entry.file?.endsWith(".css")) continue;
  const cssPath = join(output, entry.file);
  const css = await readFile(cssPath, "utf8");
  await writeFile(cssPath, css.replaceAll("url(/", `url(${basePath}/`));
}

await writeFile(join(output, ".nojekyll"), "");
