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
  ["25", "许嘉言", "0"],
  ["26", "顾明哲", "0"],
  ["27", "沈知远", "0"],
  ["28", "陆文博", "0"],
  ["29", "蒋思源", "0"],
  ["30", "韩清越", "0"],
  ["31", "唐嘉禾", "0"],
  ["32", "曹景行", "0"],
  ["33", "彭书言", "0"],
  ["34", "邹明宇", "0"],
  ["35", "谢知微", "0"],
  ["36", "叶承安", "0"],
  ["37", "苏念初", "0"],
  ["38", "罗星河", "0"],
  ["39", "魏清源", "0"],
  ["40", "余景澄", "0"],
  ["41", "杜思齐", "0"],
  ["42", "卢嘉树", "0"],
  ["43", "傅明川", "0"],
  ["44", "程知夏", "0"],
  ["45", "袁书航", "0"],
  ["46", "董清扬", "0"],
  ["47", "潘景明", "0"],
  ["48", "孟予宁", "0"],
  ["49", "白知行", "0"],
  ["50", "秦若川", "0"],
  ["51", "许明远", "0"],
  ["52", "顾清宁", "0"],
  ["53", "沈嘉树", "0"],
  ["54", "陆知遥", "0"],
  ["55", "蒋星河", "0"],
  ["56", "韩予安", "0"],
  ["57", "唐书言", "0"],
  ["58", "曹明哲", "0"],
  ["59", "彭清越", "0"],
  ["60", "邹嘉禾", "0"],
  ["61", "谢景行", "0"],
  ["62", "叶知微", "0"],
  ["63", "苏承安", "0"],
  ["64", "罗念初", "0"],
  ["65", "魏星野", "0"],
  ["66", "余清和", "0"],
  ["67", "杜明川", "0"],
  ["68", "卢知夏", "0"],
  ["69", "傅书航", "0"],
  ["70", "程清扬", "0"],
  ["71", "袁景明", "0"],
  ["72", "董予宁", "0"],
  ["73", "潘知行", "0"],
  ["74", "孟若川", "0"],
  ["75", "白明远", "0"],
  ["76", "秦清宁", "0"],
  ["77", "许嘉树", "0"],
  ["78", "顾知遥", "0"],
  ["79", "沈星河", "0"],
  ["80", "陆予安", "0"],
];

const rankIcons = ["/rank-1.svg", "/rank-2.svg", "/rank-3.svg"];

type CurrentUser = { displayName: string; rank: number; invitations: number };

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
    const applyUser = (authenticated: boolean, displayName = "科研用户") => {
      if (!activeRequest || !authenticated) return;
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
        <div className="leaderboard-title">
          <div className="ascii-section-title"><AsciiSectionMark /><h2>邀请排行榜</h2></div>
        </div>
        {currentUser
          ? <p className="current-user-rank">我的排名：第 {currentUser.rank} 名，{currentUser.displayName}，已邀请 {currentUser.invitations} 人</p>
          : <span>按成功报名人数排序</span>}
      </div>
      <div className="leaderboard-table">
        <div className="table-head"><span>排名</span><span>用户昵称</span><span>邀请人数</span></div>
        {sample.map((row, index) => {
          const rankIndex = index;
          return <div className={`table-row${rankIndex < 3 ? ` top-rank rank-${rankIndex + 1}` : ""}`} key={row[0]}><b>{rankIndex < 3 ? <img className="rank-icon" src={rankIcons[rankIndex]} alt={`第${rankIndex + 1}名`} /> : row[0]}</b><span>{row[1]}</span><strong>{row[2]}</strong></div>;
        })}
      </div>
    </div>
  );
}
