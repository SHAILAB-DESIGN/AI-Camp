"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/icons/CheckCircle";
import { DownloadSimple } from "@phosphor-icons/react/dist/icons/DownloadSimple";
import { WarningCircle } from "@phosphor-icons/react/dist/icons/WarningCircle";

const identities = ["本科生", "硕士生", "博士生", "博士后", "高校教师", "科研人员", "其他"];
const fields = ["材料科学", "生命科学", "地球科学", "化学", "其他"];
const sources = ["上海科协", "高校通知", "爱赛思社区", "主办方公众号", "合作媒体", "同学推荐", "其他"];

const provinceCities: Record<string, string[]> = {
  "北京市": ["北京市"], "天津市": ["天津市"], "上海市": ["上海市"], "重庆市": ["重庆市"],
  "河北省": ["石家庄市", "唐山市", "秦皇岛市", "邯郸市", "保定市", "廊坊市"],
  "山西省": ["太原市", "大同市", "长治市", "晋城市", "晋中市", "临汾市"],
  "辽宁省": ["沈阳市", "大连市", "鞍山市", "抚顺市", "锦州市", "营口市"],
  "吉林省": ["长春市", "吉林市", "四平市", "延边朝鲜族自治州"],
  "黑龙江省": ["哈尔滨市", "齐齐哈尔市", "大庆市", "牡丹江市", "佳木斯市"],
  "江苏省": ["南京市", "苏州市", "无锡市", "常州市", "南通市", "扬州市", "徐州市"],
  "浙江省": ["杭州市", "宁波市", "温州市", "嘉兴市", "绍兴市", "金华市", "台州市"],
  "安徽省": ["合肥市", "芜湖市", "蚌埠市", "安庆市", "滁州市", "阜阳市"],
  "福建省": ["福州市", "厦门市", "泉州市", "漳州市", "莆田市", "龙岩市"],
  "江西省": ["南昌市", "九江市", "赣州市", "上饶市", "宜春市", "吉安市"],
  "山东省": ["济南市", "青岛市", "烟台市", "潍坊市", "临沂市", "济宁市", "淄博市"],
  "河南省": ["郑州市", "洛阳市", "开封市", "南阳市", "新乡市", "许昌市", "商丘市"],
  "湖北省": ["武汉市", "宜昌市", "襄阳市", "荆州市", "黄石市", "十堰市"],
  "湖南省": ["长沙市", "株洲市", "湘潭市", "衡阳市", "岳阳市", "常德市", "郴州市"],
  "广东省": ["广州市", "深圳市", "珠海市", "佛山市", "东莞市", "中山市", "惠州市", "汕头市"],
  "海南省": ["海口市", "三亚市", "儋州市", "三沙市"],
  "四川省": ["成都市", "绵阳市", "德阳市", "乐山市", "宜宾市", "南充市", "泸州市"],
  "贵州省": ["贵阳市", "遵义市", "六盘水市", "安顺市", "毕节市"],
  "云南省": ["昆明市", "大理白族自治州", "丽江市", "曲靖市", "玉溪市", "西双版纳傣族自治州"],
  "陕西省": ["西安市", "咸阳市", "宝鸡市", "榆林市", "延安市", "汉中市"],
  "甘肃省": ["兰州市", "天水市", "酒泉市", "张掖市", "庆阳市"],
  "青海省": ["西宁市", "海东市", "海西蒙古族藏族自治州"],
  "内蒙古自治区": ["呼和浩特市", "包头市", "鄂尔多斯市", "赤峰市", "呼伦贝尔市"],
  "广西壮族自治区": ["南宁市", "桂林市", "柳州市", "北海市", "玉林市"],
  "西藏自治区": ["拉萨市", "日喀则市", "林芝市", "昌都市"],
  "宁夏回族自治区": ["银川市", "石嘴山市", "吴忠市", "固原市"],
  "新疆维吾尔自治区": ["乌鲁木齐市", "克拉玛依市", "喀什地区", "伊犁哈萨克自治州", "阿克苏地区"],
  "香港特别行政区": ["香港特别行政区"], "澳门特别行政区": ["澳门特别行政区"], "台湾省": ["台北市", "新北市", "台中市", "台南市", "高雄市"],
};

const groupConfigs: Record<string, { name: string; qr: string; download: string }> = {
  "材料科学": { name: "材料科学班级群", qr: "/group-qr-material.png", download: "材料科学班级群-二维码.png" },
  "生命科学": { name: "生命科学班级群", qr: "/group-qr-life.png", download: "生命科学班级群-二维码.png" },
  "地球科学": { name: "地球科学班级群", qr: "/group-qr-earth.png", download: "地球科学班级群-二维码.png" },
  "化学": { name: "化学班级群", qr: "/group-qr-chemistry.png", download: "化学班级群-二维码.png" },
  "其他": { name: "综合科研班级群", qr: "/group-qr-general.png", download: "综合科研班级群-二维码.png" },
};

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [closedPreview, setClosedPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedField, setSelectedField] = useState("其他");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const selectedGroup = groupConfigs[selectedField] ?? groupConfigs["其他"];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (closedPreview) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Record<string, string> = {};
    const value = (name: string) => String(formData.get(name) || "").trim();

    if (!value("name")) nextErrors.name = "请输入姓名";
    if (!value("phone")) nextErrors.phone = "请输入手机号";
    else if (!/^1[3-9][0-9]{9}$/.test(value("phone"))) nextErrors.phone = "请输入正确的 11 位手机号";
    if (!value("province")) nextErrors.province = "请选择所在省份";
    if (!value("city")) nextErrors.city = "请选择所在城市";
    if (!value("organization")) nextErrors.organization = "请输入学校或单位名称";
    if (!value("identity")) nextErrors.identity = "请选择当前身份";
    if (!value("field")) nextErrors.field = "请选择研究方向";
    if (!value("topic")) nextErrors.topic = "请填写具体研究内容";
    if (!value("ability")) nextErrors.ability = "请选择当前 AI 科研能力";
    if (!formData.get("consent")) nextErrors.consent = "请阅读并同意报名信息使用说明";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstField = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => {
        const input = form.elements.namedItem(firstField);
        const target = input instanceof RadioNodeList ? input[0] : input;
        if (!(target instanceof HTMLElement)) return;
        target.focus({ preventScroll: true });
        target.closest("label, fieldset")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setErrors({});
    setSelectedField(String(formData.get("field") || "其他"));
    setSubmitted(true);
  }

  function clearFieldError(name: string) {
    if (!name || !errors[name]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  useEffect(() => {
    const preview = new URL(window.location.href).searchParams.get("preview");
    if (process.env.NODE_ENV !== "production" && preview === "registered") {
      Promise.resolve().then(() => setSubmitted(true));
    }
    if (process.env.NODE_ENV !== "production" && preview === "closed") {
      Promise.resolve().then(() => setClosedPreview(true));
    }
  }, []);

  useEffect(() => {
    const page = document.querySelector("main");
    page?.classList.toggle("registration-complete", submitted);
    return () => page?.classList.remove("registration-complete");
  }, [submitted]);

  useEffect(() => {
    const page = document.querySelector("main");
    page?.classList.toggle("registration-closed", closedPreview);
    return () => page?.classList.remove("registration-closed");
  }, [closedPreview]);

  if (submitted) {
    return (
        <section className="container learner-dashboard" aria-label="报名完成后的学习信息">
          <article className="learner-group-card">
            <div className="learner-success-heading">
              <div className="learner-success-mark" aria-hidden="true"><CheckCircle size={62} weight="regular" /></div>
              <h2>报名成功</h2>
              <p>你的报名信息已提交，请加入下方班级群并关注课程通知。</p>
            </div>
            <img src={selectedGroup.qr} alt={`${selectedGroup.name}二维码`} width="240" height="240" />
            <strong>使用微信扫码加入</strong>
            <p>二维码已根据你的研究方向自动匹配</p>
            <a className="line-button" href={selectedGroup.qr} download={selectedGroup.download}><DownloadSimple size={18} aria-hidden="true" />保存二维码</a>
          </article>
        </section>
    );
  }

  return (
      <div className="container form-layout">
        <form className="camp-form" onSubmit={submit} onChange={(event) => clearFieldError((event.target as HTMLInputElement).name)} noValidate>
            {Object.keys(errors).length > 0 && (
              <div className="form-error-summary" role="alert">
                <WarningCircle size={22} weight="regular" aria-hidden="true" />
                <div><strong>报名信息尚未完成</strong><span>请补充下方标记的 {Object.keys(errors).length} 项信息</span></div>
              </div>
            )}
            <section className="form-block" id="basic">
              <div className="form-title"><span>01</span><div><h2>基本信息</h2><p>用于确认身份并接收活动通知</p></div></div>
              <div className="field-grid">
                <label><span>姓名 <em aria-label="必填">*</em></span><input required name="name" autoComplete="name" placeholder="请输入姓名" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <small className="field-error" id="name-error">{errors.name}</small>}</label>
                <label><span>手机号 <em aria-label="必填">*</em></span><input required name="phone" inputMode="tel" autoComplete="tel" pattern="1[3-9][0-9]{9}" placeholder="请输入手机号" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} /><small className="field-hint">优先填写端砚账号绑定手机号</small>{errors.phone && <small className="field-error" id="phone-error">{errors.phone}</small>}</label>
                <fieldset className="location-fields wide">
                  <legend>所在城市</legend>
                  <div className="location-grid">
                    <label><span>省份 <em aria-label="必填">*</em></span><select required name="province" value={selectedProvince} onChange={(event) => { setSelectedProvince(event.target.value); setSelectedCity(""); }} aria-invalid={Boolean(errors.province)} aria-describedby={errors.province ? "province-error" : undefined}><option value="">请选择省份</option>{Object.keys(provinceCities).map((province) => <option value={province} key={province}>{province}</option>)}</select>{errors.province && <small className="field-error" id="province-error">{errors.province}</small>}</label>
                    <label><span>城市 <em aria-label="必填">*</em></span><select required name="city" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)} disabled={!selectedProvince} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined}><option value="">请选择城市</option>{(provinceCities[selectedProvince] || []).map((city) => <option value={city} key={city}>{city}</option>)}</select>{errors.city && <small className="field-error" id="city-error">{errors.city}</small>}</label>
                  </div>
                </fieldset>
                <label className="wide"><span>学校/单位 <em aria-label="必填">*</em></span><input required name="organization" autoComplete="organization" placeholder="请输入学校或单位名称" aria-invalid={Boolean(errors.organization)} aria-describedby={errors.organization ? "organization-error" : undefined} />{errors.organization && <small className="field-error" id="organization-error">{errors.organization}</small>}</label>
              </div>
            </section>

            <section className="form-block" id="research">
              <div className="form-title"><span>02</span><div><h2>学习与研究背景</h2><p>帮助我们安排更匹配的学习分组</p></div></div>
              <fieldset className={errors.identity ? "field-error-group" : undefined}><legend>当前身份 <em aria-label="必填">*</em></legend><div className="choice-grid">{identities.map(item => <label key={item}><input required type="radio" name="identity" value={item} aria-invalid={Boolean(errors.identity)} aria-describedby={errors.identity ? "identity-error" : undefined} /><span>{item}</span></label>)}</div>{errors.identity && <p className="field-error" id="identity-error">{errors.identity}</p>}</fieldset>
              <fieldset className={errors.field ? "field-error-group" : undefined}><legend>研究方向 <em aria-label="必填">*</em></legend><div className="choice-grid">{fields.map(item => <label key={item}><input required type="radio" name="field" value={item} aria-invalid={Boolean(errors.field)} aria-describedby={errors.field ? "field-error" : undefined} /><span>{item}</span></label>)}</div>{errors.field && <p className="field-error" id="field-error">{errors.field}</p>}</fieldset>
              <label className="single-field"><span>具体研究内容 <em aria-label="必填">*</em></span><input required name="topic" placeholder="示例：电池材料、蛋白质设计、气候预测" aria-invalid={Boolean(errors.topic)} aria-describedby={errors.topic ? "topic-error" : undefined} />{errors.topic && <small className="field-error" id="topic-error">{errors.topic}</small>}</label>
            </section>

            <section className={`form-block${errors.ability ? " field-error-group" : ""}`} id="ability">
              <div className="form-title"><span>03</span><div><h2>AI科研能力</h2><p>请选择最符合当前情况的一项</p></div></div>
              <p className="form-prompt">您使用AI工具完成真实科研任务的能力 <em aria-label="必填">*</em></p>
              <div className="ability-grid">{[
                ["1", "不了解如何将AI应用于科研任务"], ["2", "了解部分工具，但需要较多指导才能使用"], ["3", "能够使用AI完成部分科研任务"], ["4", "能够独立使用AI完成大多数科研任务"], ["5", "能够形成稳定、可复用的AI科研工作流"],
              ].map(([score, text]) => <label key={score}><input required type="radio" name="ability" value={`${score}分`} aria-describedby={errors.ability ? "ability-error" : undefined} /><span><strong>{score}分</strong>{text}</span></label>)}</div>
              {errors.ability && <p className="field-error" id="ability-error">{errors.ability}</p>}
            </section>

            <section className="form-block" id="source">
              <div className="form-title"><span>04</span><div><h2>活动来源</h2><p>您从哪里了解到本次活动</p></div></div>
              <p className="form-prompt">选择您获得活动信息的渠道。</p>
              <div className="choice-grid">{sources.map(item => <label key={item}><input type="radio" name="source" value={item} /><span>{item}</span></label>)}</div>
            </section>

            <label className={`consent${errors.consent ? " consent-error" : ""}`}><input required type="checkbox" name="consent" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} /><span>同意将报名信息用于上海人工智能实验室的活动通知、分班和课程运营 <em aria-label="必填">*</em>{errors.consent && <small className="field-error" id="consent-error">{errors.consent}</small>}</span></label>
            <div className="form-actions"><button className="primary-button large" type="submit" disabled={closedPreview}>{closedPreview ? "报名已截止" : "提交报名"}</button></div>
          </form>
      </div>
  );
}
