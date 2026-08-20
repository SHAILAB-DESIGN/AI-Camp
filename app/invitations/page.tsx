import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import Leaderboard from "./leaderboard";

export default function InvitationsPage() {
  return (
    <main className="invitations-page">
      <SiteHeader active="invitations" />

      <section className="section invitation-rewards"><div className="container reward-layout">
        <div className="reward-section-head">
          <div className="section-heading"><h2>邀请福利</h2><p>礼品样式及算力额度以活动最终通知为准。</p></div>
        </div>
        <div className="reward-list">
          <article><div className="reward-banner reward-banner-gift" aria-hidden="true" /><div className="reward-card-copy"><h3>社区周边礼品</h3><p>邀请排行榜前十名可以获得。</p></div></article>
          <article><div className="reward-banner reward-banner-compute" aria-hidden="true" /><div className="reward-card-copy"><h3>免费算力额度</h3><p>积分比例与额度以最终通知为准。</p></div></article>
          <article><div className="reward-banner reward-banner-certificate" aria-hidden="true" /><div className="reward-card-copy"><h3>研习召集人证书</h3><p>成功邀请十人以上即可获得。</p></div></article>
        </div>
      </div></section>

      <section className="section ranking-section"><div className="container ranking-layout">
        <Leaderboard />
      </div></section>
      <SiteFooter />
    </main>
  );
}
