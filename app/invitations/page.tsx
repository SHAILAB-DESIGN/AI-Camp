import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import Leaderboard from "./leaderboard";
import AsciiSectionMark from "../components/ascii-section-mark";

export default function InvitationsPage() {
  return (
    <main className="invitations-page">
      <SiteHeader active="invitations" />

      <section className="section invitation-rewards"><div className="container reward-layout">
        <div className="reward-section-head">
          <div className="section-heading"><div className="ascii-section-title"><AsciiSectionMark /><h2>邀请好友赢好礼</h2></div><p>我们将为积极宣传活动、成功邀请新学员的伙伴，提供活动周边礼品和免费算力额度作为福利。</p></div>
        </div>
        <div className="reward-list">
          <article><div className="reward-banner reward-banner-gift" aria-hidden="true" /><div className="reward-card-copy"><h3>社区周边礼品</h3><p>邀请排行榜 Top 10 可以获得</p></div></article>
          <article><div className="reward-banner reward-banner-compute" aria-hidden="true" /><div className="reward-card-copy"><h3>免费算力额度</h3><p>邀请排行榜 Top 50 可获得 10 墨点算力</p></div></article>
          <article><div className="reward-banner reward-banner-certificate" aria-hidden="true" /><div className="reward-card-copy"><h3>研习召集人证书</h3><p>成功邀请 10 人以上可获得</p></div></article>
        </div>
        <p className="reward-note">礼品样式及算力额度以活动最终通知为准。</p>
      </div></section>

      <section className="section ranking-section"><div className="container ranking-layout">
        <Leaderboard />
      </div></section>
      <SiteFooter />
    </main>
  );
}
