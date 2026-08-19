import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

const sample = [
  ["01", "林**", "12"], ["02", "陈***宇", "9"], ["03", "Ya***g", "7"], ["04", "周*", "5"], ["05", "研***户", "3"],
  ["06", "吴**", "2"], ["07", "Li***n", "2"], ["08", "赵*", "1"], ["09", "科***生", "1"], ["10", "Su***i", "1"],
];

export default function InvitationsPage() {
  return (
    <main className="invitations-page">
      <SiteHeader active="invitations" />

      <section className="section invitation-rewards"><div className="container reward-layout">
        <div className="reward-section-head">
          <div className="section-heading"><p className="section-mark">INVITATION REWARDS</p><h2>邀请福利</h2><p>礼品样式及算力额度以活动最终通知为准。</p></div>
        </div>
        <div className="reward-list">
          <article><div className="reward-banner reward-banner-gift" aria-hidden="true" /><div className="reward-card-copy"><h3>社区周边礼品</h3><p>邀请排行榜前十名可以获得。</p></div></article>
          <article><div className="reward-banner reward-banner-compute" aria-hidden="true" /><div className="reward-card-copy"><h3>免费算力额度</h3><p>积分比例与额度以最终通知为准。</p></div></article>
          <article><div className="reward-banner reward-banner-certificate" aria-hidden="true" /><div className="reward-card-copy"><h3>研习召集人证书</h3><p>成功邀请十人以上即可获得。</p></div></article>
        </div>
      </div></section>

      <section className="section ranking-section"><div className="container ranking-layout">
        <div className="leaderboard">
          <div className="leaderboard-head"><div><p className="section-mark">LEADERBOARD</p><h2>分享排行榜</h2></div><span>按成功报名人数排序</span></div>
          <div className="leaderboard-table"><div className="table-head"><span>排名</span><span>用户昵称</span><span>邀请人数</span></div>{sample.map((row, index) => <div className={`table-row${index < 3 ? ` top-rank rank-${index + 1}` : ""}`} key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><strong>{row[2]} 人</strong></div>)}</div>
          <small>当前榜单为视觉原型示例，正式上线后由有效报名数据实时生成。</small>
        </div>
      </div></section>
      <SiteFooter />
    </main>
  );
}
