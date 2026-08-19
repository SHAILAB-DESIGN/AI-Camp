export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-main">
        <div className="site-footer-brand">
          <a href="https://discovery.intern-ai.org.cn/chat/" aria-label="前往书生·端砚">
            <img src="/intern-discovery-logo.png" alt="书生·端砚" />
          </a>
          <p>AI 科研加速营，面向科研人员的公益培训计划，帮助学员建立可上手、可复用的个人科研工作流。</p>
          <small>主办：上海人工智能实验室<br />联合主办：上海市科学技术协会</small>
        </div>
        <nav className="site-footer-column" aria-label="活动导航">
          <b>活动</b>
          <a href="/#intro">活动介绍</a>
          <a href="/#courses">课程内容</a>
          <a href="/#schedule">活动时间</a>
          <a href="/#benefits">学员权益</a>
        </nav>
        <nav className="site-footer-column" aria-label="参与导航">
          <b>参与</b>
          <a href="/register">活动报名</a>
          <a href="/invitations">邀请排行</a>
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
          <a href="https://discovery.intern-ai.org.cn/chat/">书生·端砚平台</a>
        </div>
      </div>
      <div className="container site-footer-bottom">
        <span>© All Rights Reserved. 沪ICP备2021009351号-21</span>
        <span>Powered by Intern Discovery Platform</span>
      </div>
    </footer>
  );
}
