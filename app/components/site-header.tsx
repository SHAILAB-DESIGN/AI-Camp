export default function SiteHeader({ active: _active = "home" }: { active?: "home" | "register" | "invitations" }) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="返回活动首页">
        <img src="/intern-discovery-logo.png" alt="书生·端砚" />
      </a>
      <a className="product-return" href="https://discovery.intern-ai.org.cn/" target="_blank" rel="noreferrer">
        <span aria-hidden="true">←</span> 返回产品页
      </a>
    </header>
  );
}
