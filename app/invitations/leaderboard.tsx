"use client";

import { useEffect, useState } from "react";
import AsciiSectionMark from "../components/ascii-section-mark";

const sample = [
  ["01", "林晓宇", "12"],
  ["02", "陈思宇", "9"],
  ["03", "Yang", "7"],
  ["04", "周然", "5"],
  ["05", "科研用户", "3"],
  ["06", "吴越", "2"],
  ["07", "Lin", "2"],
  ["08", "赵宁", "1"],
  ["09", "科研新生", "1"],
  ["10", "Sumi", "1"],
  ["11", "李书宁", "1"],
  ["12", "王清和", "1"],
  ["13", "陈星野", "1"],
  ["14", "赵思远", "1"],
  ["15", "张雨辰", "1"],
  ["16", "刘知行", "1"],
  ["17", "孙景明", "1"],
  ["18", "周子默", "1"],
  ["19", "吴清扬", "1"],
  ["20", "郑予安", "1"],
  ["21", "黄思齐", "0"],
  ["22", "何亦舟", "0"],
  ["23", "宋明希", "0"],
  ["24", "冯晨曦", "0"],
];

const PAGE_SIZE = 20;
const rankIcons = ["/rank-1.svg", "/rank-2.svg", "/rank-3.svg"];

type CurrentUser = { displayName: string; rank: number; invitations: number };

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(sample.length / PAGE_SIZE);
  const visibleRows = sample.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    let activeRequest = true;
    const currentUrl = new URL(window.location.href);
    const queryPreviewAuthenticated = currentUrl.searchParams.get("preview") === "logged-in";
    if (process.env.NODE_ENV !== "production" && queryPreviewAuthenticated) {
      window.sessionStorage.setItem("ai-research-camp-preview-auth", "true");
    }
    const previewAuthenticated = process.env.NODE_ENV !== "production" && (
      queryPreviewAuthenticated || window.sessionStorage.getItem("ai-research-camp-preview-auth") === "true"
    );
    const hasShared = currentUrl.searchParams.get("shared") === "1" || window.localStorage.getItem("ai-research-camp-has-shared") === "true";
    const applyUser = (authenticated: boolean, displayName = "科研用户") => {
      if (!activeRequest || !authenticated || !hasShared) return;
      setCurrentUser({ displayName, rank: sample.length + 1, invitations: 0 });
    };

    if (previewAuthenticated) {
      Promise.resolve().then(() => applyUser(true));
    } else {
      fetch("/api/auth-status", { credentials: "same-origin", cache: "no-store" })
        .then((response) => response.json())
        .then((result: { authenticated?: boolean; displayName?: string }) => applyUser(Boolean(result.authenticated), result.displayName))
        .catch(() => undefined);
    }
    return () => { activeRequest = false; };
  }, []);

  return (
    <div className="leaderboard">
      <div className="leaderboard-head">
        <div>
          <div className="ascii-section-title"><AsciiSectionMark /><h2>邀请排行榜</h2></div>
          {currentUser && <p className="current-user-rank">我的当前排名：第 {currentUser.rank} 名 · {currentUser.displayName} · 已邀请 {currentUser.invitations} 人</p>}
        </div>
        <span>按成功报名人数排序</span>
      </div>
      <div className="leaderboard-table">
        <div className="table-head"><span>排名</span><span>用户昵称</span><span>邀请人数</span></div>
        {visibleRows.map((row, index) => {
          const rankIndex = (page - 1) * PAGE_SIZE + index;
          return <div className={`table-row${rankIndex < 3 ? ` top-rank rank-${rankIndex + 1}` : ""}`} key={row[0]}><b>{rankIndex < 3 ? <img className="rank-icon" src={rankIcons[rankIndex]} alt={`第${rankIndex + 1}名`} /> : row[0]}</b><span>{row[1]}</span><strong>{row[2]}</strong></div>;
        })}
      </div>
      <div className="leaderboard-pagination" aria-label="排行榜分页">
        <span>第 {page} / {totalPages} 页，共 {sample.length} 人</span>
        <div>
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>上一页</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button type="button" className={page === pageNumber ? "active" : undefined} aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} key={pageNumber}>{pageNumber}</button>)}
          <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>下一页</button>
        </div>
      </div>
    </div>
  );
}
