/**
 * Consent for analytics (and optionally marketing), on Google Consent Mode v2.
 * Settings come from the CMS (Privacy → Consent Settings); see consent-settings.ts.
 *
 * Inputs, strongest first:
 *   1. The visitor's own choice in the banner, if it matches the current policy version
 *      and isn't older than the "ask again" window.
 *   2. Browser privacy signals the settings say to honor: Global Privacy Control and
 *      Do Not Track. A signal means "no" and the banner isn't shown. A visitor can still
 *      opt in through Cookie settings; a signal switched on *after* an opt-in wins again.
 *   3. The mode: opt-in (denied until allowed) or opt-out (granted until declined).
 *      Marketing is always opt-in.
 *
 * These rules run twice and must stay in step: once as the inline <head> script built by
 * consentDefaultScript() (before GTM loads), and in ConsentBanner.tsx via decide().
 */
export const CONSENT_KEY = 'fcg-consent'
export const CONSENT_EVENT = 'fcg:consent-settings'
export const CONSENT_ID_KEY = 'fcg-consent-id'

export type Choice = 'granted' | 'denied'
export type PrivacySignal = 'gpc' | 'dnt' | null

export type ConsentConfig = {
  enabled: boolean
  mode: 'opt-in' | 'opt-out'
  honorGpc: boolean
  honorDnt: boolean
  maxAgeDays: number
  version: string
  marketing: boolean
  log: boolean
}

export type ConsentCopy = {
  message: string
  signalMessage: string
  acceptLabel: string
  declineLabel: string
  customizeLabel: string
  policyLinkLabel: string
  analyticsDescription: string
  marketingDescription: string
}

/** What's saved in the browser. v = analytics, m = marketing, sig = signal at the time. */
export type StoredConsent = { v: Choice; m?: Choice; t: number; sig: PrivacySignal; ver: string }

export type Decision = {
  analytics: Choice
  marketing: Choice
  signal: PrivacySignal
  stored: StoredConsent | null // null when missing, expired or for an older policy version
  askNeeded: boolean
}

type Nav = Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string }

export function readSignal(config: ConsentConfig): PrivacySignal {
  if (typeof navigator === 'undefined') return null
  const nav = navigator as Nav
  if (config.honorGpc && nav.globalPrivacyControl === true) return 'gpc'
  const dnt = nav.doNotTrack ?? (window as unknown as { doNotTrack?: string }).doNotTrack ?? nav.msDoNotTrack
  if (config.honorDnt && (dnt === '1' || dnt === 'yes')) return 'dnt'
  return null
}

export function readStored(config: ConsentConfig): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw || raw[0] !== '{') return null
    const s = JSON.parse(raw) as StoredConsent
    if (s.v !== 'granted' && s.v !== 'denied') return null
    if (s.ver !== config.version) return null
    if (!s.t || Date.now() - s.t > config.maxAgeDays * 864e5) return null
    return s
  } catch {
    return null
  }
}

export function decide(config: ConsentConfig): Decision {
  const signal = readSignal(config)
  const stored = readStored(config)
  const overridden = !!stored && !!signal && !stored.sig // signal switched on after the choice
  let analytics: Choice
  if (stored) analytics = stored.v === 'granted' && !overridden ? 'granted' : 'denied'
  else analytics = config.mode === 'opt-out' && !signal ? 'granted' : 'denied'
  const marketing: Choice =
    config.marketing && stored?.m === 'granted' && !overridden ? 'granted' : 'denied'
  return { analytics, marketing, signal, stored, askNeeded: config.enabled && !stored && !signal }
}

export const consentSignals = (analytics: Choice, marketing: Choice) => ({
  analytics_storage: analytics,
  ad_storage: marketing,
  ad_user_data: marketing,
  ad_personalization: marketing,
})

/** Inline <head> script with the settings baked in. Mirrors decide() above. */
export function consentDefaultScript(config: ConsentConfig) {
  return `(function(){
var C=${JSON.stringify(config).replace(/</g, '\\u003c')},K='${CONSENT_KEY}';
var w=window,n=navigator,d=w.dataLayer=w.dataLayer||[];function gtag(){d.push(arguments)}w.gtag=w.gtag||gtag;w.__fcgConsent=C;
var t=n.doNotTrack||w.doNotTrack||n.msDoNotTrack;
var sig=(C.honorGpc&&n.globalPrivacyControl===true)?'gpc':((C.honorDnt&&(t==='1'||t==='yes'))?'dnt':null);
var s=null;try{var r=localStorage.getItem(K);if(r&&r[0]==='{'){s=JSON.parse(r);if((s.v!=='granted'&&s.v!=='denied')||s.ver!==C.version||!s.t||Date.now()-s.t>C.maxAgeDays*864e5)s=null}}catch(e){s=null}
var o=!!s&&!!sig&&!s.sig;
var a=s?(s.v==='granted'&&!o?'granted':'denied'):(C.mode==='opt-out'&&!sig?'granted':'denied');
var m=(C.marketing&&s&&s.m==='granted'&&!o)?'granted':'denied';
gtag('consent','default',{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',m==='denied');gtag('set','url_passthrough',false);
d.push({event:'consent_default',analytics_consent:a,marketing_consent:m,privacy_signal:sig||'none',consent_choice:s?s.v:'none',consent_mode:C.mode});
})();`.replace(/\n/g, '')
}
