// Lightweight heuristics to analyze an email for teaching purposes
const suspiciousTLDs = ['tk', 'cn', 'info', 'xyz', 'com.co', 'net']; // note: 'net' not suspicious by itself but kept for examples
const urgentWords = ['sofort', 'dringend', 'unverzüglich', 'jetzt', 'sofort', 'innerhalb', '24h', '24 h', 'in 24h', 'sofortige'];
const moneyWords = ['zahlung', 'gebühr', 'kosten', 'bearbeitungsgebühr', 'kreditkarte', 'iban', 'gutschein', 'paypal', 'überweisen'];
const brandList = ['paypal','amazon','netflix','dhl','dropbox','microsoft','instagram','spotify','tesla'];

function extractDomain(address) {
  try {
    return address.split('@')[1].toLowerCase();
  } catch (e) {
    return '';
  }
}

function hasUrgentWords(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  return urgentWords.some(w => t.includes(w));
}

function hasMoneyRequest(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  return moneyWords.some(w => t.includes(w));
}

function looksUnpersonalized(email, userName) {
  if (!email.body) return false;
  if (!userName) return true; // if we don't know the user, treat as impersonal
  return !email.body.toLowerCase().includes(userName.toLowerCase().split(' ')[0]);
}

function suspiciousTLD(domain) {
  if (!domain) return false;
  return suspiciousTLDs.some(tld => domain.endsWith('.' + tld) || domain.includes(tld + '.'));
}

function normalizeForTypos(s) {
  return s.replace(/[0-9]/g, ch => ({'1':'l','0':'o','3':'e','5':'s','4':'a'}[ch]||ch)).replace(/[^a-z]/g,'');
}

function detectTyposquatting(domain) {
  if (!domain) return null;
  const host = domain.split('.')[0];
  const norm = normalizeForTypos(host);
  for (const brand of brandList) {
    const bnorm = normalizeForTypos(brand);
    if (bnorm === norm) return {brand, host};
    // small distance heuristic: startsWith and contains
    if (bnorm.length > 3 && (norm.includes(bnorm) || bnorm.includes(norm))) return {brand, host};
  }
  return null;
}

export function analyzeEmail(email, userName = '') {
  const reasons = [];
  const domain = extractDomain(email.senderAddress || '');

  // Domain mismatch / suspicious TLD
  if (suspiciousTLD(domain)) {
    reasons.push({
      title: 'Verdächtige Domain-Endung',
      message: `Die Domain '${domain}' hat eine ungewöhnliche Endung (z.B. .tk, .cn, .info).`
    });
  }

  // Typosquatting
  const typo = detectTyposquatting(domain);
  if (typo) {
    reasons.push({
      title: 'Mögliche Marken-Imitation',
      message: `Die Domain '${domain}' könnte '${typo.brand}' imitieren (z.B. Zeichen ersetzt).`
    });
  }

  // Urgency
  if (hasUrgentWords((email.subject||'') + ' ' + (email.body||''))) {
    reasons.push({
      title: 'Drohender Zeitdruck',
      message: 'Die Nachricht erzeugt Druck (z.B. „sofort“, „in 24h“). Seriöse Anbieter drohen selten so.'
    });
  }

  // Money request
  if (hasMoneyRequest(email.body || '' ) || hasMoneyRequest(email.subject || '')) {
    reasons.push({
      title: 'Geld / Zahlungsaufforderung',
      message: 'Die Mail fordert Zahlungen oder Kontodaten an — das ist ein häufiges Merkmal von Betrug.'
    });
  }

  // Personalization
  if (looksUnpersonalized(email, userName)) {
    reasons.push({
      title: 'Fehlende Personalisierung',
      message: 'Die Mail spricht Sie nicht persönlich an oder verwendet keine Namen — das ist ein Anzeichen für Massen-Phishing.'
    });
  }

  // Generic checks
  if (email.senderAddress && email.senderName && email.senderName.toLowerCase().includes('support') && !domain.includes('company')) {
    reasons.push({
      title: 'Generischer Absendername',
      message: 'Der Absender nutzt generische Begriffe wie „Support“ kombiniert mit einer ungewöhnlichen Domain.'
    });
  }

  return reasons;
}

export function analyzeDomainForPreview(domain) {
  const flags = [];
  if (!domain) return flags;
  if (suspiciousTLD(domain)) {
    flags.push({title: 'Ungewöhnliche TLD', message: `Die Top-Level-Domain von ${domain} ist verdächtig.`});
  }
  const typo = detectTyposquatting(domain);
  if (typo) flags.push({title: 'Mögliche Marken-Imitation', message: `Domain '${domain}' ähnelt '${typo.brand}'.`});
  return flags;
}

export default { analyzeEmail, analyzeDomainForPreview };
