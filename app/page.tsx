"use client";

import { useEffect, useState } from "react";
import { NotePencil } from "@phosphor-icons/react/dist/icons/NotePencil";
import { ShareNetwork } from "@phosphor-icons/react/dist/icons/ShareNetwork";
import { Gift } from "@phosphor-icons/react/dist/icons/Gift";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import SequenceStream from "./components/sequence-stream";

type Track = "workflow" | "skill" | "cases";

const tracks: Record<Track, { label: string; note: string; courses: Array<{ no: string; title: string; points: string[] }> }> = {
  workflow: {
    label: "科研工作流",
    note: "5讲 · 从问题到成果",
    courses: [
      { no: "01", title: "用 AI 快速看懂一个研究方向", points: ["掌握高质量科研提问方法", "梳理方向演进脉络与领域全景", "明确关键问题和文献检索入口"] },
      { no: "02", title: "AI 论文工作流：检索、精读与核验", points: ["根据科研任务选择快速或深度搜索", "掌握论文精读与关键信息提炼方法", "核验来源、观点依据与引用一致性"] },
      { no: "03", title: "建立可持续更新的研究上下文", points: ["理解研究上下文对科研推进的作用", "掌握研究上下文的核心构成", "将阶段成果沉淀为可复用研究记录"] },
      { no: "04", title: "AI 辅助实验设计：科学数据与计算一体化实践", points: ["用 AI 快速设计与优化实验方案", "检索和使用科学数据", "借助科学计算完成分析与验证"] },
      { no: "05", title: "AI 辅助论文与课题申请书写作", points: ["基于研究资料形成写作思路与大纲", "辅助完成初稿并优化内容结构", "核验引用真实性与内容一致性"] },
    ],
  },
  skill: {
    label: "Agent Skill",
    note: "1讲 · 沉淀个人方法",
    courses: [
      { no: "06", title: "把科研方法沉淀为可复用的 Agent Skill", points: ["了解 Agent Skill 及其科研应用场景", "将高频科研流程转化为个人科研 Skill", "发现、复用并优化优质科研 Skill"] },
    ],
  },
  cases: {
    label: "AI4S 案例",
    note: "3讲 · 前沿科研实践",
    courses: [
      { no: "07", title: "通往可扩展、统一的蛋白基础模型之路", points: ["序列、结构、功能的统一建模", "AMix-1：大模型方法论赋能蛋白质模型", "AMix-2：迈向多模态理解生成模型"] },
      { no: "08", title: "大模型时代的物质科学研究", points: ["物质科学与自然科学基础", "化学大模型、智能体和评测集", "人工智能赋能物质科学应用案例"] },
      { no: "09", title: "地球科学中的科学智能：从工具的革命到革命的工具", points: ["风乌全球预报体系", "Earth-o1 端到端大气世界模型", "EarthLink 自进化人机交互智能体系统"] },
    ],
  },
};

const benefits = [
  ["01", "AI 科研工作流", "掌握一套能直接进入真实任务的科研方法", "/benefit-workflow.png"],
  ["02", "个人科研 Agent Skill", "把高频流程沉淀成可复用的个人工具", "/benefit-agent-skill.png"],
  ["03", "课程结业证书", "符合最终结业要求即可获得", "/benefit-certificate.png"],
  ["04", "免费算力额度", "支持课程实践与后续科研探索", "/benefit-compute.png"],
  ["05", "社区周边与合作机会", "优秀学员可获得后续社区连接", "/benefit-community.png"],
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
  const [shareStatus, setShareStatus] = useState("复制邀请链接");
  const [activeSection, setActiveSection] = useState("intro");
  const [activeBenefit, setActiveBenefit] = useState(0);

  const shareCampLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("链接已复制");
      window.setTimeout(() => setShareStatus("复制邀请链接"), 2400);
    } catch {
      setShareStatus("请重试");
    }
  };

  useEffect(() => {
    if (!shareOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setShareOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [shareOpen]);

  useEffect(() => {
    const ids = ["intro", "courses", "schedule", "benefits", "audience", "registration"];
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

  const directoryItems = [["intro", "活动介绍"], ["courses", "课程内容"], ["schedule", "活动时间"], ["benefits", "学员权益"], ["audience", "适合人群"], ["registration", "报名方式"]];

  return (
    <main className="home-page">
      <SiteHeader active="home" />
      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true" />
        <SequenceStream />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="kicker">公益培训计划 / 在线学习</p>
            <h1 aria-label="AI 科研加速营">
              <span className="hero-title-latin" aria-hidden="true">AI</span>
              <span className="hero-title-cn" aria-hidden="true">科研加速营</span>
            </h1>
            <p className="hero-en">AI Research Acceleration Camp</p>
            <p className="hero-lead">把 AI 真正带进文献调研、实验设计与科研写作，建立一套可上手、可复用的个人科研工作流。</p>
            <div className="hero-actions">
              <div className="hero-primary-actions">
                <a className="hero-share-card hero-register-card" href="/register"><NotePencil className="hero-action-icon" size={24} weight="regular" aria-hidden="true" /><span>立即报名</span></a>
                <button className="hero-share-card hero-share-card-primary" type="button" onClick={() => setShareOpen(true)}><ShareNetwork className="hero-action-icon" size={24} weight="regular" aria-hidden="true" /><span>分享活动</span></button>
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

      <section className="section intro-section" id="intro">
        <div className="container intro-grid">
          <div className="section-heading">
            <p className="section-mark">ABOUT THE CAMP</p>
            <h2>活动介绍</h2>
          </div>
          <div className="intro-copy">
            <p className="lead-paragraph">围绕真实科研任务，通过线上微课、平台实践和助教陪伴，帮助学员掌握 AI 在文献调研、研究梳理、实验方案、科研写作等环节中的应用方法。</p>
            <p>这不是一组工具清单，而是一段完整的科研训练：从提出问题开始，经过检索、阅读、记录、实验和写作，最终把方法沉淀为自己的科研资产。</p>
          </div>
        </div>
      </section>

      <section className="section courses-section" id="courses">
        <div className="container">
          <div className="section-heading split-heading">
            <div><p className="section-mark">CURRICULUM / 09 LESSONS</p><h2>课程内容</h2></div>
            <p>覆盖科研全流程的 9 讲短课。课程内容以活动最终通知为准。</p>
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
            <p className="section-mark">TIMELINE</p><h2>活动时间</h2>
            <p>三段式学习节奏，把知识逐步转化为科研动作。</p>
          </div>
          <div className="timeline">
            <article><span className="timeline-node">01</span><div><time>9月1日-13日</time><h3>开放报名</h3><p>填写报名信息，关注活动通知。</p></div></article>
            <article><span className="timeline-node">02</span><div><time>9月14日-22日</time><h3>正式学习</h3><p>线上短课、工具实操与社群学习。</p></div></article>
            <article><span className="timeline-node">03</span><div><time>9月24日</time><h3>培训结营</h3><p>完成学习任务，参与结营与评选。</p></div></article>
          </div>
        </div>
      </section>

      <section className="section benefits-section" id="benefits">
        <div className="container">
          <div className="section-heading split-heading">
            <div><p className="section-mark">WHAT YOU TAKE AWAY</p><h2>学员权益</h2></div>
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
            <p className="section-mark">WHO SHOULD JOIN</p><h2>适合人群</h2>
            <p><strong>高校硕博研究生</strong>、<strong>科研工作者</strong>和<strong>科技行业从业者</strong>。无需 AI 技术背景，只需要带着一个真实的科研问题来。</p>
            <img className="audience-illustration" src="/audience-research-illustration.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="container faq-grid">
          <div className="section-heading"><p className="section-mark">QUESTIONS</p><h2>常见问题</h2></div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="registration-section" id="registration">
        <SequenceStream variant="registration" />
        <div className="container registration-grid">
          <div className="registration-content">
            <h2 aria-label="让 AI 成为你的科研助手">
              <span aria-hidden="true">让 </span>
              <span className="hero-title-latin" aria-hidden="true">AI</span>
              <span aria-hidden="true"> 成为你的科研助手</span>
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
            <a className="share-poster-preview" href="/invitation-poster-virtual.png?v=4" target="_blank" rel="noreferrer" aria-label="查看邀请海报大图">
              <img src="/invitation-poster-virtual.png?v=4" alt="AI 科研加速营邀请海报" />
              <span>点击查看大图</span>
            </a>
            <div className="share-reward-summary">
              <Gift className="share-reward-icon" size={24} weight="regular" aria-hidden="true" />
              <p>完成邀请可获得社区周边、算力额度与研习证书。</p>
              <a href="/invitations">查看邀请福利 →</a>
            </div>
            <div className="share-modal-actions">
              <a className="line-button large" href="/invitation-poster-virtual.png?v=4" download="AI科研加速营邀请海报.png">保存海报</a>
              <button className="primary-button large" type="button" onClick={shareCampLink}>{shareStatus}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
