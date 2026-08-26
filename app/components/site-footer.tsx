import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-main">
        <div className="site-footer-brand">
          <a href="https://discovery.intern-ai.org.cn/chat/" aria-label="前往书生·端砚">
            <img src="/intern-discovery-logo.png" alt="书生·端砚" />
          </a>
          <small>主办：上海人工智能实验室<br />联合主办：上海市科学技术协会</small>
        </div>
        <nav className="site-footer-column" aria-label="活动导航">
          <b>活动</b>
          <Link href="/#courses">课程内容</Link>
          <Link href="/#schedule">活动时间</Link>
          <Link href="/#benefits">学员福利</Link>
        </nav>
        <nav className="site-footer-column" aria-label="参与导航">
          <b>参与</b>
          <Link href="/register">活动报名</Link>
          <Link href="/invitations">排行榜</Link>
        </nav>
        <nav className="site-footer-column" aria-label="法律信息">
          <b>法律</b>
          <a href="https://ai4scompetition.intern-ai.org.cn/protocol#p-service">法律协议</a>
          <a href="https://ai4scompetition.intern-ai.org.cn/protocol#p-privacy">隐私协议</a>
          <a href="https://ai4scompetition.intern-ai.org.cn/protocol#p-privacy">个人信息保护政策</a>
        </nav>
        <div className="site-footer-column site-footer-contact">
          <b>联系我们</b>
          <a href="mailto:interndiscovery@pjlab.org.cn">interndiscovery@pjlab.org.cn</a>
          <div className="site-footer-consultation">
            <img src="/activity-consultation-qr.png" alt="活动咨询微信二维码" width="104" height="104" />
            <span>扫码咨询活动详情</span>
          </div>
        </div>
      </div>
      <div className="container site-footer-bottom">
        <span>© 沪 ICP 备 2021009351 号-21</span>
      </div>
    </footer>
  );
}
