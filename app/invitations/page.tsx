"use client";

import { useState } from "react";
import SiteHeader from "../components/site-header";

const sample = [
  ["01", "林**", "12"], ["02", "陈***宇", "9"], ["03", "Ya***g", "7"], ["04", "周*", "5"], ["05", "研***户", "3"],
];

export default function InvitationsPage() {
  const [copied, setCopied] = useState(false);
  return (
    <main>
      <SiteHeader active="invitations" />
      <header className="subpage-hero invitation-hero">
        <div className="container invitation-title"><div><p className="section-mark">SHARE & LEARN</p><h1>邀请同行<br />一起学习</h1><p>分享活动并邀请新学员完成报名，赢取社区周边、算力额度与研习召集人证书。</p></div><div className="invitation-stamp">AI<br />科研<br />加速营</div></div>
      </header>

      <section className="section"><div className="container reward-layout">
        <div className="section-heading"><p className="section-mark">INVITATION REWARDS</p><h2>邀请福利</h2><p>礼品样式及算力额度以活动最终通知为准。</p></div>
        <div className="reward-list">
          <article><span>TOP 10</span><h3>社区周边礼品</h3><p>邀请排行榜前十名可以获得。</p></article>
          <article><span>待公布</span><h3>免费算力额度</h3><p>积分比例与额度以最终通知为准。</p></article>
          <article><span>10 人以上</span><h3>研习召集人证书</h3><p>成功邀请十人以上即可获得。</p></article>
        </div>
      </div></section>

      <section className="section ranking-section"><div className="container ranking-layout">
        <div className="ranking-share"><p className="section-mark">YOUR INVITATION</p><h2>生成专属分享</h2><p>正式接入登录与推荐服务后，这里将生成带个人推荐码的活动长图与报名链接。</p><button className="primary-button large" type="button" onClick={() => setCopied(true)}>{copied ? "原型链接已复制" : "生成分享海报"}</button></div>
        <div className="leaderboard">
          <div className="leaderboard-head"><div><p className="section-mark">LEADERBOARD</p><h2>分享排行榜</h2></div><span>按成功报名人数排序</span></div>
          <div className="leaderboard-table"><div className="table-head"><span>排名</span><span>用户昵称</span><span>邀请人数</span></div>{sample.map(row => <div className="table-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><strong>{row[2]} 人</strong></div>)}</div>
          <small>当前榜单为视觉原型示例，正式上线后由有效报名数据实时生成。</small>
        </div>
      </div></section>
    </main>
  );
}
