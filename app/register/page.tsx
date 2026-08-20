import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import RegistrationAuthGuard from "./registration-auth-guard";
import RegistrationForm from "./registration-form";

export default function RegisterPage() {
  return (
    <main>
      <SiteHeader active="register" />
      <header className="subpage-hero register-hero">
        <div className="container subpage-hero-inner">
          <div>
            <h1 className="split-display-title" aria-label="AI科研加速营报名">
              <span className="hero-title-latin" aria-hidden="true">AI</span>
              <span className="hero-title-cn" aria-hidden="true">科研加速营报名</span>
            </h1>
            <p className="register-required-note">请填写所有带 <em aria-hidden="true">*</em> 的项目</p>
          </div>
        </div>
      </header>

      <RegistrationAuthGuard><RegistrationForm /></RegistrationAuthGuard>
      <SiteFooter />
    </main>
  );
}
