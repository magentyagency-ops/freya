import { html } from '../lib/html.mjs';
import { icon, mark } from '../lib/icons.mjs';
import { btn } from '../lib/ui.mjs';
import { site } from '../config.mjs';

export const meta = {
  id: 'login',
  section: 'investors',
  title: 'Investor portal',
  description: 'Sign in to the Freya Sports Partners investor portal: reporting, data room, capital calls and documents.',
  bare: true,
  noindex: true,
};

export function render() {
  return html`
  <div class="portal">
    <section class="portal__visual" data-theme="void" data-gl-host>
      <canvas class="portal__gl" data-gl="surface" data-density="low" data-cam-y="3.6" aria-hidden="true"></canvas>
      <div class="portal__veil" aria-hidden="true"></div>
      <a class="brand portal__brand" href="index.html" aria-label="Freya Sports Partners — Home">${mark()}<span class="brand__word">FREYA</span><span class="brand__sub">Sports<br>Partners</span></a>
      <div class="portal__caption">
        <span class="label label--dot" data-reveal>Investor portal</span>
        <h2 class="h1" data-split>Your portfolio,<br><span class="dim">with full discretion.</span></h2>
        <ul class="portal__feats" data-reveal>
          ${['Quarterly reporting and impact KPIs', 'Data room and board minutes', 'Capital calls and distributions', 'Tax and regulatory documents'].map((f) => `<li>${icon.check}${f}</li>`).join('')}
        </ul>
      </div>
      <p class="portal__sec micro">${icon.shield} Named access · Two-factor authentication</p>
    </section>

    <section class="portal__form" data-theme="dark">
      <div class="portal__top">
        <a class="link" href="index.html">${icon.arrowLeft}<span>Back to website</span></a>
        <a class="link" href="investors.html"><span>Investor relations</span></a>
      </div>
      <div class="portal__box">
        <span class="label">Secure sign-in</span>
        <h1 class="h2">Sign in</h1>
        <p class="body-sm">Enter the credentials provided by the Investor Relations team.</p>
        <form class="login" data-login novalidate>
          <div class="field">
            <label for="login-id">Username</label>
            <input id="login-id" name="username" type="email" autocomplete="username" placeholder="name@organisation.com" required>
          </div>
          <div class="field field--pwd">
            <label for="login-pwd">Password</label>
            <input id="login-pwd" name="password" type="password" autocomplete="current-password" required>
            <button class="field__eye" type="button" data-pwd-toggle aria-label="Show password" aria-pressed="false">${icon.eye}</button>
          </div>
          <div class="login__row">
            <div class="field field--check"><input id="login-remember" type="checkbox" name="remember"><label for="login-remember">Remember this device</label></div>
            <a class="inline-link login__forgot" href="mailto:${site.email}?subject=${encodeURIComponent('Portal — forgotten password')}">Forgotten password?</a>
          </div>
          ${btn(null, 'Sign in', { variant: 'solid', type: 'submit', ico: 'lock', magnetic: false, cls: 'btn--block' })}
          <p class="form__status" data-login-status role="status" aria-live="polite"></p>
        </form>
        <div class="portal__alt">
          <span class="micro">First sign-in</span>
          <a class="link" href="mailto:${site.email}?subject=${encodeURIComponent('Portal — access request')}"><span>Request access</span>${icon.arrowUpRight}</a>
        </div>
      </div>
      <div class="portal__legal micro">
        <span>© ${site.year} ${site.name}</span>
        <a href="legal-notice.html">Legal notice</a>
        <a href="privacy.html">Privacy</a>
      </div>
    </section>
  </div>`;
}
