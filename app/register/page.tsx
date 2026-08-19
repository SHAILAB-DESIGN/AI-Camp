import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import RegistrationForm from "./registration-form";

export default function RegisterPage() {
  return (
    <main>
      <SiteHeader active="register" />
      <header className="subpage-hero register-hero">
        <div className="container subpage-hero-inner">
          <div>
            <p className="section-mark">REGISTRATION</p>
            <h1 className="split-display-title" aria-label="AI 科研加速营报名">
              <span className="hero-title-latin" aria-hidden="true">AI</span>
              <span className="hero-title-cn" aria-hidden="true">科研加速营报名</span>
            </h1>
            <p>填写信息后，我们将根据研究方向匹配学习分组。带 * 的项目为必填项。</p>
          </div>
        </div>
      </header>

      <RegistrationForm />
      <SiteFooter />
    </main>
  );
}
