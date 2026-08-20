"use client";

import { useEffect, useState } from "react";
import { NotePencil } from "@phosphor-icons/react/dist/icons/NotePencil";
import { ShareNetwork } from "@phosphor-icons/react/dist/icons/ShareNetwork";
import { Gift } from "@phosphor-icons/react/dist/icons/Gift";
import { CalendarDots } from "@phosphor-icons/react/dist/icons/CalendarDots";
import { UsersThree } from "@phosphor-icons/react/dist/icons/UsersThree";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import SequenceStream from "./components/sequence-stream";
import AsciiSectionMark from "./components/ascii-section-mark";

type Track = "workflow" | "skill" | "cases";

const tracks: Record<Track, { label: string; note: string; courses: Array<{ no: string; title: string; points: string[] }> }> = {
  workflow: {
    label: "科研工作流",
    note: "共 5 讲",
    courses: [
      { no: "01", title: "用AI快速看懂一个研究方向", points: ["掌握高质量科研提问方法", "梳理研究方向的演进脉络与领域全景", "明确关键问题和文献检索入口"] },
      { no: "02", title: "AI论文工作流：检索、精读与核验", points: ["根据科研任务选择快速或深度搜索", "掌握论文精读与关键信息提炼方法", "核验论文来源、观点依据与引用一致性"] },
      { no: "03", title: "建立可持续更新的研究上下文", points: ["理解研究上下文对科研推进的作用", "掌握研究上下文的核心构成", "将阶段成果沉淀为可复用的研究记录"] },
      { no: "04", title: "AI辅助实验设计：科学数据与计算一体化实践", points: ["用 AI 快速设计与优化实验方案", "检索和使用科学数据的方法步骤", "借助科学计算完成分析与验证"] },
      { no: "05", title: "AI辅助论文与课题申请书写作", points: ["基于研究资料形成写作思路与大纲", "辅助完成初稿并优化内容结构", "核验引用真实性与内容一致性"] },
    ],
  },
  skill: {
    label: "Agent Skill",
    note: "共 1 讲",
    courses: [
      { no: "06", title: "把科研方法沉淀为可复用的Agent Skill", points: ["了解Agent Skill及其科研应用场景", "将高频科研流程转化为个人科研Skill", "发现、复用并优化优质科研Skill"] },
    ],
  },
  cases: {
    label: "AI4S案例",
    note: "共 3 讲",
    courses: [
      { no: "07", title: "通往可扩展、统一的蛋白基础模型之路", points: ["蛋白质基座模型：序列、结构、功能的统一建模", "AMix-1:：大模型方法论赋能蛋白质模型", "AMix-2：迈向多模态蛋白质理解生成模型"] },
      { no: "08", title: "大模型时代的物质科学研究", points: ["物质科学是一切自然科学的基础", "化学大模型、智能体和评测集介绍", "人工智能赋能物质科学应用案例"] },
      { no: "09", title: "地球科学中的科学智能：从工具的革命到革命的工具", points: ["风乌全球预报体系", "Earth-o1端到端大气世界模型", "EarthLink自进化人机交互智能体系统"] },
    ],
  },
};

const benefits = [
  ["01", "AI科研工作流", "掌握一套可复用的科研方法", "/benefit-workflow.png"],
  ["02", "个人科研Agent Skill", "将高频流程沉淀为个人工具", "/benefit-agent-skill.png"],
  ["03", "课程结业证书", "符合结业要求即可获得证书", "/benefit-certificate.png"],
  ["04", "免费算力额度", "支持课程实践与科研探索", "/benefit-compute.png"],
  ["05", "社区周边礼品", "周边礼品及后续合作机会", "/benefit-community.png"],
];

const faqs = [
  ["没有 AI 技术背景可以参加吗？", "可以。课程从真实科研任务出发，不要求编程或 AI 技术背景。"],
  ["课程如何学习？", "采用线上微课、工具实操与分领域社群学习相结合的方式。"],
  ["报名后如何进入班级群？", "提交报名后，系统会根据研究方向展示对应班级群二维码。"],
  ["如何获得结业证书？", "完成学习任务并达到最终公布的结业要求即可获得，具体规则以活动通知为准。"],
];

export default function Home() {
  const [track, setTrack] = useState<Track>("workflow");
  const [shareOpen, setShareOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<"loading" | "anonymous" | "authenticated">("loading");
  const [shareStatus, setShareStatus] = useState("分享链接");
  const [activeSection, setActiveSection] = useState("courses");
  const [activeBenefit, setActiveBenefit] = useState(0);

  const shareCampLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      window.localStorage.setItem("ai-research-camp-has-shared", "true");
      setShareStatus("链接已复制");
      window.setTimeout(() => setShareStatus("分享链接"), 2400);
    } catch {
      setShareStatus("请重试");
    }
  };

  const requestShare = () => {
    if (authStatus === "authenticated") {
      setShareOpen(true);
      return;
    }
    setLoginPromptOpen(true);
  };

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
    const applyAuthStatus = (authenticated: boolean) => {
      if (!activeRequest) return;
      setAuthStatus(authenticated ? "authenticated" : "anonymous");
      if (authenticated && currentUrl.searchParams.get("share") === "1") {
        setLoginPromptOpen(false);
        setShareOpen(true);
        currentUrl.searchParams.delete("share");
        window.history.replaceState({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
      }
    };

    if (previewAuthenticated) {
      Promise.resolve().then(() => applyAuthStatus(true));
    } else {
      fetch("/api/auth-status", { credentials: "same-origin", cache: "no-store" })
        .then((response) => response.json())
        .then((result: { authenticated?: boolean }) => applyAuthStatus(Boolean(result.authenticated)))
        .catch(() => applyAuthStatus(false));
    }
    return () => { activeRequest = false; };
  }, []);

  useEffect(() => {
    if (!shareOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setShareOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [shareOpen]);

  useEffect(() => {
    const ids = ["courses", "schedule", "benefits", "audience", "registration"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, .15, .35, .6] },
    );
    ids.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  const directoryItems = [["courses", "课程内容"], ["schedule", "活动时间"], ["benefits", "学员权益"], ["audience", "适合人群"], ["registration", "报名方式"]];

  return (
    <main className="home-page">
      <SiteHeader active="home" />
      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true" />
        <SequenceStream />
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 aria-label="AI 科研加速营">
              <span className="hero-title-latin" aria-hidden="true">AI</span>
              <span className="hero-title-cn" aria-hidden="true">科研加速营</span>
            </h1>
            <p className="hero-lead">AI科研加速营是专为科研人员和科技工作者设立的公益培训活动。课程围绕文献调研、论文精读、实验设计与科研写作等真实科研任务，采用线上微课与工具实操相结合的学习形式，帮助学员建立一套可上手、可复用的AI科研工作流。</p>
            <div className="hero-actions">
              <div className="hero-meta" aria-label="活动时间与学习方式">
                <div><CalendarDots size={25} weight="regular" aria-hidden="true" /><span>9月14日开营</span></div>
                <div><UsersThree size={25} weight="regular" aria-hidden="true" /><span>线上学习</span></div>
              </div>
              <div className="hero-primary-actions">
                <a className="hero-share-card hero-register-card" href="/register"><NotePencil className="hero-action-icon" size={24} weight="regular" aria-hidden="true" /><span>立即报名</span></a>
                <button className="hero-share-card hero-share-card-primary" type="button" onClick={requestShare}><ShareNetwork className="hero-action-icon" size={24} weight="regular" aria-hidden="true" /><span>分享活动</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="section-nav" aria-label="活动内容索引">
        <div>
          {directoryItems.map(([id, label]) => <a className={activeSection === id ? "active" : ""} href={`#${id}`} key={id}>{label}</a>)}
        </div>
      </nav>

      <section className="section courses-section" id="courses">
        <div className="container">
          <div className="section-heading split-heading">
            <div className="ascii-section-title"><AsciiSectionMark /><h2>课程内容</h2></div>
            <p>课程内容以活动最终通知为准。</p>
          </div>
          <div className="track-tabs" role="tablist" aria-label="课程分类">
            {(Object.keys(tracks) as Track[]).map((key) => (
              <button key={key} type="button" role="tab" aria-selected={track === key} onClick={() => setTrack(key)}>
                <b>{tracks[key].label}</b><small>{tracks[key].note}</small>
              </button>
            ))}
          </div>
          <div className={`course-ledger courses-${track}`} role="tabpanel">
            {tracks[track].courses.map((course) => (
              <article className="course-row" key={course.no}>
                <span className="course-no">{course.no}</span>
                <h3>{course.title}</h3>
                <ul>{course.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section schedule-section" id="schedule">
        <div className="container schedule-grid">
          <div className="section-heading">
            <div className="ascii-section-title"><AsciiSectionMark /><h2>时间安排</h2></div>
            <p>三段式学习节奏，把知识逐步转化为科研动作。</p>
          </div>
          <div className="timeline">
            <article><span className="timeline-node">01</span><div><time>9月1日——9月13日</time><h3>开放报名</h3><p>填写报名信息，关注活动通知</p></div></article>
            <article><span className="timeline-node">02</span><div><time>9月14日——9月22日</time><h3>正式学习</h3><p>线上短课、工具实操与社群学习</p></div></article>
            <article><span className="timeline-node">03</span><div><time>9月24日</time><h3>培训结营</h3><p>完成学习任务，参与结营与评选</p></div></article>
          </div>
        </div>
      </section>

      <section className="section benefits-section" id="benefits">
        <div className="container">
          <div className="section-heading split-heading">
            <div className="ascii-section-title"><AsciiSectionMark /><h2>学员福利</h2></div>
            <p>不只完成课程，也带走可复用的方法、工具与持续探索的资源。</p>
          </div>
          <div className="benefit-explorer">
            <article className="benefit-focus" aria-live="polite">
              <div className="benefit-focus-media">
                <img src={benefits[activeBenefit][3]} alt={`${benefits[activeBenefit][1]}插图`} loading="lazy" decoding="async" />
              </div>
              <div className="benefit-focus-copy">
                <h3>{benefits[activeBenefit][1]}</h3>
                <p>{benefits[activeBenefit][2]}</p>
              </div>
            </article>
            <div className="benefit-options" aria-label="学员权益列表">
              {benefits.map(([no, title, text, image], index) => (
                <button key={title} className={activeBenefit === index ? "active" : ""} type="button" onMouseEnter={() => setActiveBenefit(index)} onFocus={() => setActiveBenefit(index)} onClick={() => setActiveBenefit(index)}>
                  <img className="benefit-option-image" src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  <span>{no}</span><h3>{title}</h3><p>{text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section audience-section" id="audience">
        <div className="container audience-grid">
          <div className="audience-card">
            <div className="ascii-section-title"><AsciiSectionMark /><h2>适合人群</h2></div>
            <p>欢迎<strong>高校硕博研究生</strong>、<strong>科研工作者</strong>和<strong>科技行业从业者</strong>报名，无需AI技术背景。</p>
            <img className="audience-illustration" src="/audience-research-illustration.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="container faq-grid">
          <div className="section-heading"><div className="ascii-section-title"><AsciiSectionMark /><h2>常见问题</h2></div></div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="registration-section" id="registration">
        <SequenceStream variant="registration" />
        <div className="container registration-grid">
          <div className="registration-content">
            <h2 aria-label="准备好，让书生·端砚成为你的科研助手">
              <span aria-hidden="true">准备好，让</span>
              <span aria-hidden="true">书生·端砚</span>
              <span aria-hidden="true">成为你的科研助手</span>
            </h2>
            <p className="registration-lead">登录后填写报名信息，系统将根据研究方向匹配班级群。</p>
            <div className="registration-actions">
              <a className="registration-button registration-button-solid" href="/register"><NotePencil className="hero-action-icon" size={24} weight="regular" aria-hidden="true" /><span>立即报名</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="organizations">
        <div className="container org-grid">
          <article className="org-item">
            <span>主办单位</span>
            <img className="org-logo" src="/org-shlab.png?v=3" alt="上海人工智能实验室" />
          </article>
          <article className="org-item">
            <span>联合主办单位</span>
            <img className="org-logo" src="/org-sast.png?v=3" alt="上海市科学技术协会" />
          </article>
          <article className="org-item">
            <span>协办单位</span>
            <img className="org-logo" src="/org-ai4science.png?v=3" alt="智爱赛思" />
          </article>
          <article className="org-item org-item-secondary">
            <span className="org-label-placeholder" aria-hidden="true">协办单位</span>
            <img className="org-logo" src="/org-koushare.png?v=3" alt="蔻享学术" />
          </article>
        </div>
      </section>

      <SiteFooter />

      {shareOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setShareOpen(false)}>
          <section className="share-modal" role="dialog" aria-modal="true" aria-label="分享活动">
            <button className="modal-close" type="button" aria-label="关闭" onClick={() => setShareOpen(false)}>×</button>
            <a className="share-poster-preview" href="/invitation-poster-virtual.png?v=5" target="_blank" rel="noreferrer" aria-label="查看邀请海报大图">
              <img src="/invitation-poster-virtual.png?v=5" alt="AI 科研加速营邀请海报" />
            </a>
            <div className="share-reward-summary">
              <Gift className="share-reward-icon" size={24} weight="regular" aria-hidden="true" />
              <p>邀请好友报名，有机会获得社区周边、免费算力及研习召集人证书。</p>
              <a href="/invitations">邀请排行 →</a>
            </div>
            <div className="share-modal-actions">
              <a className="line-button large" href="/invitation-poster-virtual.png?v=5" download="AI科研加速营邀请海报.png">保存长图</a>
              <button className="primary-button large" type="button" onClick={shareCampLink}>{shareStatus}</button>
            </div>
          </section>
        </div>
      )}

      {loginPromptOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setLoginPromptOpen(false)}>
          <section className="share-modal share-login-prompt" role="dialog" aria-modal="true" aria-labelledby="share-login-title">
            <button className="modal-close" type="button" aria-label="关闭登录提示" onClick={() => setLoginPromptOpen(false)}>×</button>
            <h2 id="share-login-title">登录后分享活动</h2>
            <p>登录后即可生成专属邀请海报，并查看你在分享排行榜中的当前排名。</p>
            <div className="share-modal-actions">
              <a className="primary-button large" href="/signin-with-chatgpt?return_to=%2F%3Fshare%3D1">去登录</a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
