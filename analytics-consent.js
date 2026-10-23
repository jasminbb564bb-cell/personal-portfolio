(function () {
  'use strict';
  const GA_ID = 'G-3K9NW4BTKZ';
  const STORAGE_KEY = 'the-path-analytics-consent';
  const DISABLE_KEY = 'ga-disable-' + GA_ID;
  const gtag = function () { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); };
  function loadAnalytics() {
    window[DISABLE_KEY] = false;
    if (window.__thePathAnalyticsLoaded) {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      return;
    }
    window.__thePathAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  function track(name, params) { if (localStorage.getItem(STORAGE_KEY) === 'granted' && window[DISABLE_KEY] !== true && window.__thePathAnalyticsLoaded && typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ transport_type: 'beacon', event_timeout: 1000 }, params || {})); }
  window.trackAnalyticsEvent = track;
  function openSettings() {
    localStorage.removeItem(STORAGE_KEY);
    window[DISABLE_KEY] = true;
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    render();
    const accept = document.querySelector('[data-analytics-action="accept"]');
    if (accept) accept.focus();
  }
  function copy(lang) { return lang === 'en' ? { title:'Analytics settings', text:'Optional analytics helps understand visits and project interest. No form contents are sent to Google Analytics.', accept:'Allow analytics', reject:'Decline', settings:'Analytics settings' } : { title:'アクセス解析の設定', text:'任意のアクセス解析により、訪問状況や制作事例への関心を確認します。フォームの入力内容はGoogle Analyticsへ送信しません。', accept:'同意する', reject:'拒否する', settings:'アクセス解析の設定' }; }
  function render() {
    let banner = document.getElementById('analytics-consent');
    if (!banner) {
      banner = document.createElement('aside');
      banner.id = 'analytics-consent';
      banner.className = 'analytics-consent';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-live', 'polite');
      banner.innerHTML = '<div><strong data-analytics-copy="title"></strong><p data-analytics-copy="text"></p></div><div class="analytics-consent-actions"><button type="button" data-analytics-action="accept"></button><button type="button" data-analytics-action="reject"></button></div>';
      document.body.appendChild(banner);
    }
    let settings = document.getElementById('analytics-settings');
    if (!settings) { settings = document.createElement('button'); settings.id = 'analytics-settings'; settings.className = 'analytics-settings'; settings.type = 'button'; settings.addEventListener('click', openSettings); document.body.appendChild(settings); }
    const text = copy(document.documentElement.lang === 'en' ? 'en' : 'ja');
    banner.querySelector('[data-analytics-copy="title"]').textContent = text.title;
    banner.querySelector('[data-analytics-copy="text"]').textContent = text.text;
    banner.querySelector('[data-analytics-action="accept"]').textContent = text.accept;
    banner.querySelector('[data-analytics-action="reject"]').textContent = text.reject;
    if (settings) settings.textContent = text.settings;
    settings.hidden = !localStorage.getItem(STORAGE_KEY);
    banner.hidden = Boolean(localStorage.getItem(STORAGE_KEY));
  }
  function setConsent(value) { localStorage.setItem(STORAGE_KEY, value); if (value === 'granted') loadAnalytics(); else { window[DISABLE_KEY] = true; if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); } render(); }
  document.addEventListener('click', function (event) {
    const action = event.target.closest('[data-analytics-action]');
    if (action) setConsent(action.dataset.analyticsAction === 'accept' ? 'granted' : 'denied');
  });
  document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem(STORAGE_KEY) === 'granted') loadAnalytics();
    render();
    document.querySelectorAll('.locale').forEach(function (button) { button.addEventListener('click', function () { window.setTimeout(render, 0); }); });
    document.querySelectorAll('[data-analytics-event]').forEach(function (link) { link.addEventListener('click', function () { track(link.dataset.analyticsEvent, { link_location: link.dataset.analyticsLocation || 'project' }); }); });
  });
}());
