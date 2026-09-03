import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const homeSnapshotPath = process.env.CLOSED_HOME_SNAPSHOT || "/private/tmp/ai-camp-closed-home.html";
const registerPath = join(root, "报名截止状态.html");
const outputPath = join(root, "报名截止双页面预览.html");

function bridgeScript() {
  return `<script>
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (/\/register\/?(?:\?|$)/.test(href)) {
        event.preventDefault();
        parent.postMessage({ type: "closed-preview:navigate", page: "register" }, "*");
        return;
      }
      if (href === "/" || /AI-Camp\/(?:\?preview=closed)?(?:#.*)?$/.test(href)) {
        event.preventDefault();
        parent.postMessage({ type: "closed-preview:navigate", page: "home" }, "*");
      }
    });
  </script>`;
}

function prepareHome(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace("<head>", '<head><base href="https://ai-research-camp-duanyan.qimkagauwxzev.chatgpt.site/">')
    .replace("</body>", `${bridgeScript()}</body>`);
}

function prepareRegister(html) {
  return html.replace("</body>", `${bridgeScript()}</body>`);
}

function dataUrl(html) {
  return `data:text/html;base64,${Buffer.from(html, "utf8").toString("base64")}`;
}

const homePage = dataUrl(prepareHome(await readFile(homeSnapshotPath, "utf8")));
const registerPage = dataUrl(prepareRegister(await readFile(registerPath, "utf8")));

const output = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>报名截止状态双页面预览</title>
  <style>
    :root { color-scheme: light; --paper: #f6f5f0; --ink: #17191b; --blue: #0c3c80; --rule: rgba(58, 52, 42, .16); }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
    body { background: var(--paper); color: var(--ink); font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; }
    .preview-shell { height: 100dvh; display: grid; grid-template-rows: 52px minmax(0, 1fr); }
    .preview-bar { padding: 0 20px; border-bottom: 1px solid var(--rule); background: rgba(246, 245, 240, .98); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .preview-title { margin: 0; font-size: 14px; font-weight: 600; }
    .preview-nav { display: flex; align-items: stretch; align-self: stretch; }
    .preview-nav button { min-width: 74px; padding: 0 16px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--ink); font: inherit; cursor: pointer; }
    .preview-nav button[aria-selected="true"] { border-bottom-color: var(--blue); color: var(--blue); }
    iframe { width: 100%; height: 100%; border: 0; background: var(--paper); }
    @media (max-width: 600px) {
      .preview-bar { padding: 0 10px; }
      .preview-title { font-size: 12px; }
      .preview-nav button { min-width: 58px; padding: 0 10px; }
    }
  </style>
</head>
<body>
  <main class="preview-shell">
    <header class="preview-bar">
      <p class="preview-title">报名截止状态预览</p>
      <nav class="preview-nav" aria-label="预览页面切换">
        <button type="button" data-page="home" aria-selected="true">首页</button>
        <button type="button" data-page="register" aria-selected="false">报名</button>
      </nav>
    </header>
    <iframe id="site-preview" title="AI 科研加速营报名截止状态"></iframe>
  </main>
  <script>
    const pages = ${JSON.stringify({ home: homePage, register: registerPage })};
    const frame = document.querySelector("#site-preview");
    const buttons = [...document.querySelectorAll("[data-page]")];
    function showPage(page) {
      const nextPage = pages[page] ? page : "home";
      frame.src = pages[nextPage];
      buttons.forEach((button) => button.setAttribute("aria-selected", String(button.dataset.page === nextPage)));
      history.replaceState({}, "", "#" + nextPage);
    }
    buttons.forEach((button) => button.addEventListener("click", () => showPage(button.dataset.page)));
    window.addEventListener("message", (event) => {
      if (event.source !== frame.contentWindow || event.data?.type !== "closed-preview:navigate") return;
      showPage(event.data.page);
    });
    showPage(location.hash === "#register" ? "register" : "home");
  </script>
</body>
</html>`;

await writeFile(outputPath, output);
console.log(outputPath);
