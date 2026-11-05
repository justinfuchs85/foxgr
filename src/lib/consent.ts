/** Google Consent Mode v2. Analytics is opt-in; ads storage is never used on this site. */
export const CONSENT_KEY = 'fcg-consent' // 'granted' | 'denied'
export const CONSENT_EVENT = 'fcg:consent-settings'

/**
 * Inline <head> script, before GTM loads: sets the consent default (denied unless the
 * visitor already said yes) so Google tags wait for a choice. Global Privacy Control
 * counts as a no.
 */
export const consentDefaultScript = `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=window.gtag||gtag;var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}var ok=c==='granted'&&!navigator.globalPrivacyControl;gtag('consent','default',{analytics_storage:ok?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',false);})();`
