/**
 * Consent for analytics, on Google Consent Mode v2.
 *
 * Inputs, strongest first:
 *   1. The visitor's own choice in the banner, stored in localStorage under CONSENT_KEY.
 *   2. Browser privacy signals: Global Privacy Control (navigator.globalPrivacyControl)
 *      and the older Do Not Track (navigator.doNotTrack).
 *   3. Default: analytics denied until someone says yes.
 *
 * A signal means "no" and the banner isn't shown. A visitor can still opt in through
 * Cookie settings; that choice records whether a signal was on at the time, so a signal
 * switched on *after* an opt-in wins again. Ads storage is never granted on this site.
 *
 * The same rules run twice: as an inline <head> script before GTM loads (the default),
 * and in ConsentBanner.tsx, which also re-checks signals when the visitor returns to the
 * tab. Keep the two in step.
 */
export const CONSENT_KEY = 'fcg-consent'
export const CONSENT_EVENT = 'fcg:consent-settings'

export type Choice = 'granted' | 'denied'
export type PrivacySignal = 'gpc' | 'dnt' | null
export type StoredConsent = { v: Choice; t: number; sig: PrivacySignal }

type Nav = Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string }

export function privacySignal(): PrivacySignal {
  if (typeof navigator === 'undefined') return null
  const nav = navigator as Nav
  if (nav.globalPrivacyControl === true) return 'gpc'
  const dnt = nav.doNotTrack ?? (window as unknown as { doNotTrack?: string }).doNotTrack ?? nav.msDoNotTrack
  return dnt === '1' || dnt === 'yes' ? 'dnt' : null
}

export function readConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    if (raw === 'granted' || raw === 'denied') return { v: raw, t: 0, sig: null } // earlier format
    const parsed = JSON.parse(raw) as StoredConsent
    return parsed.v === 'granted' || parsed.v === 'denied' ? parsed : null
  } catch {
    return null
  }
}

export function effectiveConsent(stored: StoredConsent | null, signal: PrivacySignal): Choice {
  if (!stored) return 'denied'
  if (stored.v === 'granted' && signal && !stored.sig) return 'denied' // signal turned on after the opt-in
  return stored.v
}

/** Inline <head> script: the consent default, set before GTM loads. Mirrors the functions above. */
export const consentDefaultScript = `(function(){
var w=window,n=navigator,d=w.dataLayer=w.dataLayer||[];function gtag(){d.push(arguments)}w.gtag=w.gtag||gtag;
var sig=n.globalPrivacyControl===true?'gpc':((n.doNotTrack||w.doNotTrack||n.msDoNotTrack)==='1'||(n.doNotTrack==='yes')?'dnt':null);
var s=null;try{var r=localStorage.getItem('${CONSENT_KEY}');if(r==='granted'||r==='denied')s={v:r,sig:null};else if(r)s=JSON.parse(r)}catch(e){}
var ok=!!s&&s.v==='granted'&&!(sig&&!s.sig);
gtag('consent','default',{analytics_storage:ok?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',false);
d.push({event:'consent_default',analytics_consent:ok?'granted':'denied',privacy_signal:sig||'none',consent_choice:s?s.v:'none'});
})();`.replace(/\n/g, '')
