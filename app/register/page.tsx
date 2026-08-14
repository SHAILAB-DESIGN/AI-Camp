"use client";

import { FormEvent, useState } from "react";
import SiteHeader from "../components/site-header";

const identities = ["本科生", "硕士生", "博士生", "博士后", "高校教师", "科研人员", "其他"];
const fields = ["材料科学", "生命科学", "地球科学", "化学", "其他"];
const sources = ["上海科协", "高校通知", "爱赛思社区", "主办方公众号", "合作媒体", "同学推荐", "其他"];

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) setSubmitted(true);
  }

  return (
    <main>
      <SiteHeader active="register" />
      <header className="subpage-hero register-hero">
        <div className="container subpage-hero-inner">
          <div><p className="section-mark">REGISTRATION</p><h1>AI 科研加速营报名</h1><p>填写信息后，我们将根据研究方向匹配学习分组。带 * 的项目为必填项。</p></div>
          <span className="subpage-index">APPLICATION<br />FORM</span>
        </div>
      </header>

      <div className="container form-layout">
        <aside className="form-aside"><b>报名信息</b><a href="#basic">基本信息</a><a href="#research">学习与研究背景</a><a href="#ability">AI 科研能力</a><a href="#source">活动来源</a></aside>
        {submitted ? (
          <section className="success-sheet">
            <span>✓</span><p className="section-mark">SUBMITTED</p><h2>报名信息已提交</h2><p>正式服务接入后，这里会展示与你研究方向匹配的班级群二维码。</p><a className="primary-button large" href="/">返回活动首页</a>
          </section>
        ) : (
          <form className="camp-form" onSubmit={submit}>
            <section className="form-block" id="basic">
              <div className="form-title"><span>01</span><div><h2>基本信息</h2><p>用于确认身份并接收活动通知</p></div></div>
              <div className="field-grid">
                <label><span>姓名 *</span><input required name="name" placeholder="请输入姓名" /></label>
                <label><span>手机号 *</span><input required name="phone" inputMode="tel" pattern="1[3-9][0-9]{9}" placeholder="请输入11位手机号" /></label>
                <label><span>所在省份</span><input name="province" placeholder="请输入省份" /></label>
                <label><span>所在城市</span><input name="city" placeholder="请输入城市" /></label>
                <label className="wide"><span>学校 / 单位 *</span><input required name="organization" placeholder="请输入学校或单位名称" /></label>
              </div>
            </section>

            <section className="form-block" id="research">
              <div className="form-title"><span>02</span><div><h2>学习与研究背景</h2><p>帮助我们安排更匹配的学习分组</p></div></div>
              <fieldset><legend>当前身份 *</legend><div className="choice-grid">{identities.map(item => <label key={item}><input required type="radio" name="identity" value={item} /><span>{item}</span></label>)}</div></fieldset>
              <fieldset><legend>研究方向 *</legend><div className="choice-grid">{fields.map(item => <label key={item}><input required type="radio" name="field" value={item} /><span>{item}</span></label>)}</div></fieldset>
              <label className="single-field"><span>具体研究内容 *</span><input required name="topic" placeholder="示例：电池材料、蛋白质设计、气候预测" /></label>
            </section>

            <section className="form-block" id="ability">
              <div className="form-title"><span>03</span><div><h2>AI 科研能力</h2><p>请选择最符合当前情况的一项</p></div></div>
              <div className="ability-grid">{[
                ["1", "不了解如何将 AI 应用于科研任务"], ["2", "了解部分工具，但需要较多指导"], ["3", "能用 AI 完成部分科研任务"], ["4", "能独立完成大多数科研任务"], ["5", "已形成稳定、可复用的工作流"],
              ].map(([score, text]) => <label key={score}><input type="radio" name="ability" value={score} /><b>{score}</b><span>{text}</span></label>)}</div>
            </section>

            <section className="form-block" id="source">
              <div className="form-title"><span>04</span><div><h2>活动来源</h2><p>你从哪里了解到本次活动</p></div></div>
              <div className="choice-grid">{sources.map(item => <label key={item}><input type="radio" name="source" value={item} /><span>{item}</span></label>)}</div>
            </section>

            <label className="consent"><input required type="checkbox" /><span>同意将报名信息用于上海人工智能实验室的活动通知、分班和课程运营 *</span></label>
            <div className="form-actions"><a className="line-button large" href="/">取消</a><button className="primary-button large" type="submit">提交报名</button></div>
          </form>
        )}
      </div>
    </main>
  );
}
