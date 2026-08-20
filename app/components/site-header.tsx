"use client";

import { useEffect, useRef, useState } from "react";
import { List } from "@phosphor-icons/react/dist/icons/List";
import { SignOut } from "@phosphor-icons/react/dist/icons/SignOut";
import { X } from "@phosphor-icons/react/dist/icons/X";

const pages = [
  { key: "home", label: "首页", href: "/" },
  { key: "register", label: "报名", href: "/register" },
  { key: "invitations", label: "排行榜", href: "/invitations" },
] as const;

const SSO_LOGIN_URL = "https://sso.openxlab.org.cn/login";

function createSsoUrl(returnUrl: string) {
  const params = new URLSearchParams({
    redirect: returnUrl,
    clientId: "dagw07mkg1bazlxzoy31",
    source: "discovery",
  });
  return `${SSO_LOGIN_URL}?${params.toString()}`;
}

type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; displayName: string };

export default function SiteHeader({ active = "home" }: { active?: "home" | "register" | "invitations" }) {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [signInHref, setSignInHref] = useState("");
  const [previewHref, setPreviewHref] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signOutHref, setSignOutHref] = useState("/signout-with-chatgpt?return_to=/");
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let activeRequest = true;
    queueMicrotask(() => {
      if (!activeRequest) return;
      setSignInHref(createSsoUrl(window.location.href));
      const currentUrl = new URL(window.location.href);
      const queryPreviewAuthenticated = currentUrl.searchParams.get("preview") === "logged-in";
      if (process.env.NODE_ENV !== "production" && queryPreviewAuthenticated) {
        window.sessionStorage.setItem("ai-research-camp-preview-auth", "true");
      }
      const previewAuthenticated = process.env.NODE_ENV !== "production" && (
        queryPreviewAuthenticated || window.sessionStorage.getItem("ai-research-camp-preview-auth") === "true"
      );
      const previewUrl = new URL(window.location.href);
      previewUrl.searchParams.set("preview", "logged-in");
      setPreviewHref(`${previewUrl.pathname}${previewUrl.search}${previewUrl.hash}`);
      if (previewAuthenticated) {
        currentUrl.searchParams.delete("preview");
        setSignOutHref(`${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}` || "/");
        setAuth({ status: "authenticated", displayName: "科研用户" });
        return;
      }
      fetch("/api/auth-status", { credentials: "same-origin", cache: "no-store" })
        .then((response) => response.json())
        .then((result: { authenticated?: boolean; displayName?: string }) => {
          if (!activeRequest) return;
          if (result.authenticated && result.displayName) {
            setAuth({ status: "authenticated", displayName: result.displayName });
          } else {
            setAuth({ status: "anonymous" });
          }
        })
        .catch(() => activeRequest && setAuth({ status: "anonymous" }));
    });
    return () => { activeRequest = false; };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const closeAccount = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", closeAccount);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeAccount);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMobileMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const avatarLabel = auth.status === "authenticated"
    ? Array.from(auth.displayName.trim())[0]?.toUpperCase() || "U"
    : "";

  return (
    <>
      <header className="topbar">
        <a className="brand" href="https://discovery.intern-ai.org.cn/chat/" aria-label="前往书生·端砚">
          <img src="/intern-discovery-logo.png" alt="书生·端砚" />
        </a>
        <nav className="main-nav" aria-label="页面导航">
          {pages.map((page) => <a className={active === page.key ? "active" : ""} href={page.href} aria-current={active === page.key ? "page" : undefined} key={page.key}>{page.label}</a>)}
        </nav>
        <div className="topbar-actions">
          {auth.status === "authenticated" ? (
            <div className="account-menu" ref={accountRef}>
              <button className="user-avatar" type="button" aria-label={`已登录：${auth.displayName}，打开用户菜单`} aria-expanded={accountOpen} aria-haspopup="menu" onClick={() => setAccountOpen((open) => !open)}>
                {avatarLabel}
              </button>
              {accountOpen && (
                <div className="account-dropdown" role="menu">
                  <div className="account-dropdown-user"><span>{avatarLabel}</span><div><strong>{auth.displayName}</strong><small>已登录</small></div></div>
                  <a href={signOutHref} role="menuitem" onClick={() => window.sessionStorage.removeItem("ai-research-camp-preview-auth")}><SignOut size={17} aria-hidden="true" />退出登录</a>
                </div>
              )}
            </div>
          ) : auth.status === "loading" ? (
            <span className="auth-placeholder" aria-hidden="true" />
          ) : (
            <>
              {process.env.NODE_ENV !== "production" && <a className="auth-preview-entry" href={previewHref || undefined}>预览登录态</a>}
              <a className="auth-entry" href={signInHref || undefined}>登录</a>
            </>
          )}
        </div>
        <button className="mobile-menu-trigger" type="button" aria-label="打开页面导航" aria-expanded={mobileMenuOpen} aria-controls="mobile-site-menu" onClick={() => setMobileMenuOpen(true)}>
          <List size={25} weight="regular" aria-hidden="true" />
        </button>
      </header>

      {mobileMenuOpen && (
        <>
          <button className="mobile-menu-backdrop" type="button" aria-label="关闭页面导航" onClick={() => setMobileMenuOpen(false)} />
          <aside className="mobile-menu-drawer" id="mobile-site-menu" aria-label="移动端页面导航">
            <div className="mobile-menu-head">
              <a href="https://discovery.intern-ai.org.cn/chat/" aria-label="前往书生·端砚"><img src="/intern-discovery-logo.png" alt="书生·端砚" /></a>
              <button type="button" aria-label="关闭页面导航" onClick={() => setMobileMenuOpen(false)}><X size={24} aria-hidden="true" /></button>
            </div>
            <nav className="mobile-menu-links">
              {pages.map((page) => <a className={active === page.key ? "active" : ""} href={page.href} aria-current={active === page.key ? "page" : undefined} key={page.key} onClick={() => setMobileMenuOpen(false)}>{page.label}</a>)}
            </nav>
            <div className="mobile-menu-account">
              {auth.status === "authenticated" ? (
                <>
                  <div className="mobile-account-card"><span>{avatarLabel}</span><div><strong>{auth.displayName}</strong><small>已登录</small></div></div>
                  <a className="mobile-signout" href={signOutHref} onClick={() => window.sessionStorage.removeItem("ai-research-camp-preview-auth")}><SignOut size={18} aria-hidden="true" />退出登录</a>
                </>
              ) : auth.status === "loading" ? (
                <span className="mobile-auth-loading">正在读取登录状态</span>
              ) : (
                <>
                  <a className="auth-entry" href={signInHref || undefined}>登录 / 注册</a>
                  {process.env.NODE_ENV !== "production" && <a className="auth-preview-entry" href={previewHref || undefined}>预览登录态</a>}
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
