import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Inbox, AlertTriangle, CheckCircle, XCircle, RefreshCcw, ShieldAlert, User, Star, Send, Lock, Award, Download, LogIn } from 'lucide-react';
// NEUER IMPORT: Diese Bibliothek wird für das PDF-Zertifikat benötigt.
// Du musst sie in StackBlitz installieren: npm install jspdf
import jsPDF from 'jspdf';

// --- ERWEITERTE E-MAIL DATENBANK (Jetzt 20 E-Mails: 10 Legit, 10 Spam) ---
const emailData = [
  // --- 10 SERIÖSE E-MAILS ---
  {
    id: 1,
    senderName: "Herr Müller (Mathe)",
    senderAddress: "h.mueller@ws-staat.muenchen.musin.de",
    subject: "Hausaufgaben für Montag vergessen?",
    date: "Heute, 08:30",
    body: "Hallo zusammen,\n\nich habe gesehen, dass einige von euch die Aufgaben auf Seite 42 noch nicht hochgeladen haben. Bitte holt das bis morgen nach.\n\nViele Grüße\nH. Müller",
    type: "legit",
    explanation: "Eine seriöse Adresse der Schule (ws-staat.muenchen.musin.de). Der Inhalt ist plausibel."
  },
  {
    id: 104,
    senderName: "Sneaker World Newsletter",
    senderAddress: "newsletter@sneaker-world-shop.de",
    subject: "Nur heute: 20% auf alles!",
    date: "Vorgestern",
    body: "Hey Sneaker-Fan,\n\nder Sommer kommt und wir räumen das Lager. Sicher dir jetzt die besten Modelle.\n\n[Hier klicken zum Shop]\n\n(Wenn du keine Mails mehr willst, klicke auf Abbestellen)",
    type: "legit",
    explanation: "Werbung, aber seriös (.de Domain, Abmeldelink vorhanden)."
  },
  {
    id: 109,
    senderName: "Stadtbücherei Neustadt",
    senderAddress: "mahnung@stadtbuecherei-neustadt.de",
    subject: "Erinnerung: Rückgabefrist",
    date: "Vorgestern",
    body: "Guten Tag,\n\nbitte denken Sie daran, dass das Buch 'Der Herr der Ringe' morgen fällig ist. Sie können es online verlängern.\n\nMit freundlichen Grüßen\nIhr Bücherei-Team",
    type: "legit",
    explanation: "Seriöse Erinnerung einer offiziellen Institution (.de Domain)."
  },
  {
    id: 110,
    senderName: "Sekretariat",
    senderAddress: "sekretariat@ws-staat.muenchen.musin.de",
    subject: "Anpassung Busfahrplan (Linie 5)",
    date: "Heute, 11:10",
    body: "Liebe Schülerinnen und Schüler,\n\nbitte beachtet, dass die Buslinie 5 ab nächster Woche (Montag) 10 Minuten früher fährt als gewohnt.\n\nEuer Sekretariat",
    type: "legit",
    explanation: "Offizielle Information von einer korrekten Schuldomain."
  },
  {
    id: 111,
    senderName: "Frau Berger (Englisch)",
    senderAddress: "s.berger@ws-staat.muenchen.musin.de",
    subject: "Verschiebung Vokabeltest 9A",
    date: "Gestern, 15:30",
    body: "Hallo Klasse 9A,\n\nda ich morgen auf Fortbildung bin, müssen wir den Vokabeltest auf nächsten Freitag (21.11.) verschieben.\n\nS. Berger",
    type: "legit",
    explanation: "Eine typische Info-Mail einer Lehrkraft mit der korrekten Domain der Schule."
  },
  {
    id: 112,
    senderName: "IT-Support (Schule)",
    senderAddress: "it-support@ws-staat.muenchen.musin.de",
    subject: "Info: Geplante Wartung am Schulserver",
    date: "Vorgestern",
    body: "Hallo,\n\nam Samstag, den 15.11., führen wir Wartungsarbeiten an den Servern durch. Moodle und der E-Mail-Server sind an diesem Vormittag (ca. 8:00 - 12:00 Uhr) eventuell nicht erreichbar.\n\nEs ist keine Aktion eurerseits nötig.\n\nEuer IT-Support",
    type: "legit",
    explanation: "Echte Info-Mail. Sie kündigt eine Wartung an, verlangt aber kein Passwort. Die Domain ist korrekt."
  },
  {
    id: 113,
    senderName: "Amazon.de",
    senderAddress: "bestellung@amazon.de",
    subject: "Ihre Amazon.de Bestellung (#301-123456) wurde versandt",
    date: "Heute, 14:12",
    body: "Guten Tag,\n\Ihre Bestellung 'Rocketbook Notizbuch' wurde soeben versandt und sollte morgen bei Ihnen eintreffen.\n\nSie können die Sendung hier verfolgen: [Link]\n\nDanke für Ihren Einkauf!",
    type: "legit",
    explanation: "Eine typische, seriöse Bestellbestätigung. Die Domain 'amazon.de' ist korrekt."
  },
  {
    id: 114,
    senderName: "Instagram",
    senderAddress: "notification@instagram.com",
    subject: "Max Mustermann hat Sie in einem Foto markiert",
    date: "Gestern, 20:55",
    body: "Hallo,\n\nMax Mustermann hat Sie in einem Foto auf Instagram markiert.\n\nFoto ansehen: [Link]\n\n(Sie erhalten diese Mail, weil Sie Benachrichtigungen aktiviert haben.)",
    type: "legit",
    explanation: "Eine echte Benachrichtigung von Instagram. Die Domain 'instagram.com' ist korrekt."
  },
  {
    id: 115,
    senderName: "Schulbibliothek",
    senderAddress: "bibliothek@ws-staat.muenchen.musin.de",
    subject: "Verfügbarkeits-Benachrichtigung: 'Das Känguru-Manifest'",
    date: "Heute, 09:01",
    body: "Hallo,\n\ndas von Ihnen vorgemerkte Buch 'Das Känguru-Manifest' ist jetzt verfügbar und liegt 7 Tage zur Abholung bereit.\n\nViele Grüße,\nIhr Bibliotheksteam",
    type: "legit",
    explanation: "Seriöse Benachrichtigung mit korrekter Schuldomain."
  },
   {
    id: 116,
    senderName: "Spotify",
    senderAddress: "info@spotify.com",
    subject: "Dein 'Mix der Woche' ist da!",
    date: "Gestern, 07:00",
    body: "Hallo!\n\nDein persönlicher Mix der Woche ist fertig.\n\n[Jetzt anhören]\n\nWir wünschen viel Spaß,\nDein Spotify Team",
    type: "legit",
    explanation: "Standard-Newsletter eines bekannten Dienstes mit korrekter Domain 'spotify.com'."
  },

  // --- 10 SPAM/PHISHING E-MAILS ---
  {
    id: 2,
    senderName: "PayPal Sicherheitszentrum",
    senderAddress: "security-alert@pay-pal-verify-now24.cn",
    subject: "WICHTIG: Ihr Konto wurde gesperrt!",
    date: "Heute, 09:15",
    body: "Sehr geehrter Kunde,\n\nwir haben verdächtige Aktivitäten festgestellt. Klicken Sie HIER sofort, um Ihre Daten zu bestätigen, sonst wird das Konto gelöscht!\n\nMit freundlichen Grüßen\nPayPal Team",
    type: "spam",
    linkTriggerText: "Klicken Sie HIER sofort", // NEU: Der "Fallen"-Link Text
    explanation: "Phishing! Achte auf die Endung '.cn' (China) statt '.com'. Banken drohen nie mit sofortiger Löschung."
  },
  {
    id: 101,
    senderName: "DHL Paketverfolgung",
    senderAddress: "info@dhl-track-delivery-status.net",
    subject: "Ihr Paket konnte nicht zugestellt werden",
    date: "Heute, 10:05",
    body: "Hallo,\n\nihr Paket DE-49281 liegt im Verteilzentrum. Es fehlt eine Zollgebühr von 2,99€. \n\nBitte bezahlen Sie den Betrag über den [Link zur Zahlung].",
    type: "spam",
    linkTriggerText: "[Link zur Zahlung]", // NEU
    explanation: "Klassischer Paket-Betrug. Die URL 'dhl-track-delivery-status.net' gehört nicht zu DHL."
  },
  {
    id: 102,
    senderName: "Dr. K. Schmidt (Schulleiter)",
    senderAddress: "direktor.schmidt.schule@gmail.com",
    subject: "Dringende Bitte / Vertraulich",
    date: "Heute, 08:15",
    body: "Guten Morgen,\n\nich sitze gerade in einer wichtigen Konferenz und kann nicht telefonieren. Ich brauche einen Gefallen: Könntest du für mich kurzfristig Amazon-Gutscheine im Wert von 100€ besorgen?\n\nBitte antworte schnell.\n\nDr. K. Schmidt",
    type: "spam",
    // Kein Link-Text hier, die Antwort per Mail ist die Falle
    explanation: "Der 'CEO-Fraud'. Der Name stimmt, aber die Adresse ist eine private Gmail-Adresse, nicht die Schul-Adresse!"
  },
  {
    id: 103,
    senderName: "Instagram Support",
    senderAddress: "badge-verify@meta-security-help.tk",
    subject: "Dein Konto wird in 24h gelöscht!",
    date: "Gestern, 23:45",
    body: "Hallo User,\n\njemand hat dein Konto wegen Urheberrechtsverletzung gemeldt. Wenn du das nicht warst, musst du dich verifizieren.\n\nKlicke hier und gib dein Passwort ein, um die Löschung zu verhindern.\n\nMeta Security Team",
    type: "spam",
    linkTriggerText: "Klicke hier", // NEU
    explanation: "Druckaufbau und Drohung. Die Domain '.tk' (Tokelau) wird oft für Gratis-Domains und Spam genutzt."
  },
  {
    id: 105,
    senderName: "Windows Defender Alert",
    senderAddress: "warning@microsoft-security-center-v2.info",
    subject: "KRITISCHER FEHLER: Virus gefunden (Trojaner)",
    date: "Heute, 12:00",
    body: "ACHTUNG!\n\nAuf Ihrem Computer wurden 5 Viren gefunden. Ihre Daten sind in Gefahr.\n\nRufen Sie SOFORT den Microsoft Support an unter: 0800-123-FAKE-99\n\nSchalten Sie den Computer nicht aus!",
    type: "spam",
    // Kein Link, die Telefonnummer ist die Falle
    explanation: "Der 'Tech Support Scam'. Microsoft schickt keine E-Mails über Virenfunde."
  },
  {
    id: 106,
    senderName: "Netflix Billing",
    senderAddress: "payment@netfl1x-subscription-update.com",
    subject: "Zahlung abgelehnt",
    date: "Heute, 04:30",
    body: "Hallo,\n\nleider konnten wir den Mitgliedsbeitrag nicht abbuchen. Dein Abo ist pausiert.\n\nBitte gib hier deine Kreditkartendaten erneut ein.\n\nDein Streaming Team",
    type: "spam",
    linkTriggerText: "gib hier deine Kreditkartendaten erneut ein", // NEU
    explanation: "Typosquatting: Schau genau hin! Da steht 'netfl1x' (mit Eins statt I)."
  },
  {
    id: 107,
    senderName: "Elon Musk Crypto Giveaway",
    senderAddress: "giveaway@tesla-bitcoin-double.xyz",
    subject: "Ich verdopple deine Bitcoins!",
    date: "Gestern",
    body: "Um Krypto zu feiern, verschenke ich 5000 BTC. \n\nSende mir 0.1 BTC an folgende Wallet und ich schicke dir 0.2 BTC sofort zurück!\n\nNur für kurze Zeit!",
    type: "spam",
    linkTriggerText: "an folgende Wallet", // NEU
    explanation: "Niemand verschenkt Geld. Die Domain .xyz ist typisch für Spam."
  },
  {
    id: 108,
    senderName: "Lisa22",
    senderAddress: "lisa.cute@dating-local-singles-near-you.biz",
    subject: "Bist du auch einsam?",
    date: "Heute, 02:15",
    body: "Hi Süßer,\n\nich habe dein Profil gesehen und finde dich toll. Hast du Lust auf ein Treffen heute Abend?\n\nSchreib mir hier zurück!\nKuss, Lisa",
    type: "spam",
    linkTriggerText: "Schreib mir hier zurück!", // NEU
    explanation: "Bot-Spam. Unbekannte Absender mit Domains wie .biz wollen dich auf kostenpflichtige Portale locken."
  },
  {
    id: 117,
    senderName: "Lotto Zentrale",
    senderAddress: "gewinn@super-6-garantiert.info",
    subject: "Sie haben 500.000€ gewonnen!",
    date: "Gestern, 18:00",
    body: "Herzlichen Glückwunsch!\n\nIhre E-Mail-Adresse wurde für den Hauptgewinn gezogen.\n\nUm den Gewinn zu erhalten, überweisen Sie bitte 100€ Bearbeitungsgebühr an das angegebene Konto.\n\nIhr Lotto-Team",
    type: "spam",
    linkTriggerText: "an das angegebene Konto", // NEU
    explanation: "Betrug! Man muss nie für einen echten Gewinn 'Gebühren' im Voraus zahlen. Domain .info ist verdächtig."
  },
  {
    id: 118,
    senderName: "Dropbox",
    senderAddress: "storage-limit@dropbox-mail.com.co",
    subject: "Ihr Dropbox-Konto ist voll",
    date: "Heute, 03:20",
    body: "Hallo,\n\nIhr Speicherplatz ist fast aufgebraucht. Holen Sie sich 2TB gratis, indem Sie sich jetzt einloggen und Ihr Konto verifizieren.\n\n[Konto verifizieren]",
    type: "spam",
    linkTriggerText: "[Konto verifizieren]", // NEU
    explanation: "Phishing. Die Domain endet auf '.com.co' (Kolumbien), nicht nur '.com'. Sie wollen dein Dropbox-Passwort stehlen."
  }
];

// --- NEUE KOMPONENTE: LoginScreen ---
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [klasse, setKlasse] = useState('');

  const handleSubmit = () => {
    if (name.trim() && klasse.trim()) {
      onLogin(name.trim(), klasse.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
            <ShieldAlert size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">E-Mail Detektiv Training</h2>
        <p className="text-slate-500 mb-8">Bitte gib deinen Namen und deine Klasse ein, um zu starten.</p>
        
        <div className="space-y-4 mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dein Vor- und Nachname"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={klasse}
            onChange={(e) => setKlasse(e.target.value)}
            placeholder="Deine Klasse (z.B. 9A)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!name.trim() || !klasse.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogIn size={20} />
          Training starten
        </button>
      </div>
    </div>
  );
}

// --- NEUE KOMPONENTE: GameOverScreen ---
function GameOverScreen({ userName, userClass, score, correctCount, totalMails, onDownloadPDF, onReset, failureReason }) { // NEU: failureReason
  
  const getFeedbackMessage = () => {
    // Verhindere Division durch Null, falls totalMails 0 ist
    if (totalMails === 0) return "Noch keine E-Mails bearbeitet.";
    const percentage = (correctCount / totalMails) * 100;
    if (percentage === 100) return "Perfekt! Du bist ein Cyber-Security Experte! 🛡️";
    if (percentage >= 80) return "Sehr gut! Du erkennst fast jeden Betrug. 👀";
    if (percentage >= 60) return "Guter Anfang, aber pass bei verdächtigen Links auf. ⚠️";
    return "Da musst du leider noch etwas üben. Sprich mit deinem Lehrer. 😥";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300">
        <div className="mb-6 flex justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner ${
            failureReason ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {failureReason ? <XCircle size={48} /> : <Award size={48} fill="currentColor" />}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {failureReason ? "Training fehlgeschlagen!" : "Posteingang bereinigt!"}
        </h2>
        
        {/* Angepasste Nachrichten */}
        {!failureReason ? (
          <p className="text-slate-500 mb-6">Gute Arbeit, {userName}. Hier ist dein Ergebnis:</p>
        ) : (
          <p className="text-slate-500 mb-6">Schade, {userName}. Das Training wurde vorzeitig beendet.</p>
        )}

        {/* NEU: Anzeige des Fehlergrunds */}
        {failureReason && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-bold text-lg">Test nicht bestanden!</h3>
            <p className="mt-2 text-sm">{failureReason}</p>
          </div>
        )}
        
        <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
          <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Ergebnis</div>
          <div className="text-5xl font-bold text-blue-600">
            {correctCount} <span className="text-3xl text-slate-400">/ {totalMails}</span>
          </div>
          <div className="text-lg text-slate-600 mt-2">Korrekt erkannt</div>
          
          {!failureReason && (
            <div className="text-sm text-slate-500 mt-4 font-medium px-4">
                "{getFeedbackMessage()}"
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={onDownloadPDF}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <Download size={20} />
            Zertifikat herunterladen
          </button>
          <button 
            onClick={onReset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <RefreshCcw size={20} />
            Neue Runde starten
          </button>
        </div>
      </div>
    </div>
  );
}

// --- NEUE KOMPONENTE: InboxScreen ---
// (Dies ist der gesamte Code aus deinem vorherigen `return`-Block, als Komponente)
function InboxScreen({
  emails,
  selectedEmailId,
  score,
  feedback,
  showHint,
  setSelectedEmailId,
  handleDecision,
  nextEmail,
  setShowHint,
  handleLinkClick // NEU: Funktion für Link-Klick
}) {
  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-3 md:p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Cyber-Guard Mail</h1>
            <div className="text-xs text-blue-100 opacity-80">Trainings-Modus v2.0</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
          <div className="text-sm font-medium text-blue-100 hidden sm:block">Punkte:</div>
          <div className="font-mono font-bold text-xl text-yellow-400">{score}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="p-4">
            <button 
              className="w-full bg-blue-50 text-blue-700 font-bold py-3 px-4 rounded-lg flex items-center gap-3 mb-6 border border-blue-100 shadow-sm"
            >
              <Inbox size={18} /> Posteingang <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{emails.length}</span>
            </button>
            
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase px-4 mb-2 tracking-wider">Ordner</div>
              {['Posteingang', 'Gesendet', 'Entwürfe', 'Junk-E-Mail', 'Papierkorb'].map((folder, idx) => (
                <div key={folder} className={`px-4 py-2 rounded-md flex items-center gap-3 text-sm font-medium ${idx === 0 ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50 cursor-not-allowed opacity-70'}`}>
                  {idx === 0 ? <Inbox size={16}/> : idx === 3 ? <AlertTriangle size={16}/> : idx === 4 ? <Trash2 size={16}/> : <Mail size={16}/>}
                  {folder}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-4 border-t border-slate-100">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-800">
              <div className="font-bold flex items-center gap-1 mb-1"><Lock size={12}/> Tipp des Tages:</div>
              Prüfe immer die Absender-Adresse, nicht nur den Namen!
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">&copy; Jonathan Mangold</p>
          </div>
        </aside>

        {/* Email List */}
        <div className={`
          ${selectedEmailId ? 'hidden' : 'flex'} 
          md:flex w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex-col z-0
        `}>
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <input 
              type="text" 
              placeholder="Suchen..." 
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {emails.map(email => (
              <div 
                key={email.id}
                onClick={() => !feedback && setSelectedEmailId(email.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-all relative group ${
                  selectedEmailId === email.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-600 shadow-sm z-10' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`font-bold text-sm truncate pr-2 ${selectedEmailId === email.id ? 'text-blue-900' : 'text-slate-800'}`}>
                    {email.senderName}
                  </span>
                  <span className={`text-xs whitespace-nowrap ${selectedEmailId === email.id ? 'text-blue-400' : 'text-slate-400'}`}>{email.date}</span>
                </div>
                <div className={`text-sm mb-1 truncate ${selectedEmailId === email.id ? 'text-blue-800 font-medium' : 'text-slate-600 font-medium'}`}>{email.subject}</div>
                <div className="text-xs text-slate-400 truncate font-serif">{email.body.split('\n')[0]}</div>
              </div>
            ))}
            {emails.length === 0 && !selectedEmailId && (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <CheckCircle size={48} className="mb-4 text-slate-200" />
                <p>Alles erledigt!</p>
              </div>
            )}
          </div>
        </div>

        {/* Reading Pane */}
        <main className={`
          ${selectedEmailId ? 'flex' : 'hidden'} 
          md:flex flex-1 bg-slate-50 flex-col relative overflow-hidden min-w-0
        `}>
          {selectedEmail ? (
            <>
              {/* Email Header - Interactive */}
              <div className="bg-white p-6 shadow-sm z-10 border-b border-slate-200">
                
                {/* NEU: "Zurück"-Knopf nur für Mobile */}
                <button 
                  onClick={() => setSelectedEmailId(null)} 
                  className="md:hidden flex items-center gap-1 text-sm text-blue-600 font-medium mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  Zurück zum Posteingang
                </button>

                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 leading-tight">{selectedEmail.subject}</h2>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${selectedEmail.type === 'legit' ? 'bg-blue-400' : 'bg-red-500'}`}>
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="font-bold text-slate-900 text-lg">{selectedEmail.senderName}</span>
                        <span className="text-xs text-slate-400">An: mich</span>
                    </div>
                    <div 
                        className="relative inline-block mt-1 group cursor-help"
                        onMouseEnter={() => setShowHint(true)}
                        onMouseLeave={() => setShowHint(false)}
                    >
                        <div className="flex items-center gap-2 bg-slate-100 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-300 px-2 py-1 rounded transition-colors duration-200">
                            <span className="text-sm font-mono text-slate-600 group-hover:text-slate-900 break-all">
                                &lt;{selectedEmail.senderAddress}&gt;
                            </span>
                            <AlertTriangle size={12} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className={`absolute top-full left-0 mt-2 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl w-72 z-50 transition-all duration-200 ${showHint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                            <div className="font-bold mb-1 text-yellow-400">Detektiv-Tipp:</div>
                            Schaue dir die Domain (das nach dem @) genau an. Passt sie zum Absender? Achte auf Rechtschreibfehler oder komische Endungen.
                        </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 whitespace-nowrap hidden sm:block">{selectedEmail.date}</div>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white m-0 md:m-6 md:rounded-lg md:shadow-sm md:border border-slate-200 font-serif text-lg leading-relaxed text-slate-800">
                {/* NEUE LOGIK ZUM ERKENNEN VON "FALLEN-LINKS" */}
                {selectedEmail.body.split('\n').map((line, i) => {
                  const triggerText = selectedEmail.linkTriggerText;
                  
                  if (triggerText && line.includes(triggerText)) {
                    const parts = line.split(triggerText);
                    return (
                      <p key={i} className="mb-4 min-h-[1em]">
                        {parts[0]}
                        <a
                          onClick={handleLinkClick}
                          className="text-blue-600 underline hover:text-red-600 font-bold cursor-pointer transition-colors"
                        >
                          {triggerText}
                        </a>
                        {parts[1]}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="mb-4 min-h-[1em]">{line}</p>
                  );
                })}
                
                {/* NEUE Logik für den *seriösen* Link (Newsletter) */}
                {selectedEmail.id === 104 && (
                    <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded text-center">
                        <span className="text-blue-600 underline font-sans text-sm font-medium cursor-pointer">
                            [Hier klicken zum Shop]
                        </span>
                    </div>
                )}
              </div>

              {/* Action Bar (Bottom) */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {!feedback ? (
                  <div className="max-w-3xl mx-auto w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleDecision('spam')}
                          className="group flex flex-col md:flex-row items-center justify-center gap-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold py-4 px-4 rounded-xl border-2 border-slate-200 hover:border-red-300 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="bg-red-100 p-2 rounded-full text-red-600 group-hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                          </div>
                          <div className="text-center md:text-left">
                            <div className="text-sm md:text-base">Löschen</div>
                            <div className="text-xs font-normal opacity-70 hidden md:block">Das ist Spam / Betrug</div>
                          </div>
                        </button>

                        <button 
                          onClick={() => handleDecision('keep')}
                          className="group flex flex-col md:flex-row items-center justify-center gap-2 bg-white hover:bg-green-50 text-slate-600 hover:text-green-600 font-bold py-4 px-4 rounded-xl border-2 border-slate-200 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                            <Inbox size={24} />
                          </div>
                          <div className="text-center md:text-left">
                            <div className="text-sm md:text-base">Behalten</div>
                            <div className="text-xs font-normal opacity-70 hidden md:block">Das ist seriös</div>
                          </div>
                        </button>
                    </div>
                  </div>
                ) : (
                  /* Feedback State */
                  <div className={`rounded-xl p-5 border-2 flex flex-col md:flex-row items-center md:items-start gap-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-3xl mx-auto ${
                    feedback.type === 'success' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className={`p-3 rounded-full shrink-0 ${feedback.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                      {feedback.type === 'success' ? <CheckCircle size={32} /> : <XCircle size={32} />}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className={`font-bold text-lg mb-1 ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{feedback.title}</h3>
                      <p className="text-slate-700 leading-relaxed">{feedback.message}</p>
                    </div>
                    <button 
                      onClick={nextEmail}
                      className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                        feedback.type === 'success' 
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200' 
                          : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
                      }`}
                    >
                      Nächste Mail <Send size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <Mail size={64} strokeWidth={1} className="text-slate-200" />
              </div>
              <p className="text-xl font-medium text-slate-400">Wähle eine E-Mail aus</p>
              <p className="text-sm text-slate-400 mt-2">Links in der Liste anklicken</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


// --- HAUPTKOMPONENTE (Steuert die Ansichten) ---
export default function EmailDetectivePro() {
  // === NEUE STATUS-VERWALTUNG ===
  const [view, setView] = useState('login'); // 'login', 'inbox', 'gameover'
  const [userName, setUserName] = useState('');
  const [userClass, setUserClass] = useState('');
  
  // === SPIEL-STATUS ===
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0); // NEU: Zählt die korrekten Antworten
  const [processedCount, setProcessedCount] = useState(0); // NEU: Zählt alle bearbeiteten Mails
  const [feedback, setFeedback] = useState(null); 
  const [showHint, setShowHint] = useState(false);
  const [failureReason, setFailureReason] = useState(null); // NEU: Grund für sofortiges Scheitern

  useEffect(() => {
    // Startet das Spiel nicht mehr automatisch, wartet auf Login
  }, []);

  const resetGame = () => {
    // Shuffle und nimm 15 Mails pro Runde
    const shuffled = [...emailData].sort(() => 0.5 - Math.random());
    const selectedSet = shuffled.slice(0, 15); // NEU: Wählt 15 Mails aus
    
    setEmails(selectedSet);
    setSelectedEmailId(null); // NEU: Auf Mobile nicht sofort die erste Mail auswählen
    setScore(0);
    setCorrectCount(0); // NEU
    setProcessedCount(0); // NEU
    setFeedback(null);
    setShowHint(false);
    setFailureReason(null); // NEU
    
    // Geht zurück zum Login-Bildschirm
    setView('login');
    setUserName('');
    setUserClass('');
  };

  const handleLogin = (name, klasse) => {
    setUserName(name);
    setUserClass(klasse);
    
    // Spiel zurücksetzen und vorbereiten
    const shuffled = [...emailData].sort(() => 0.5 - Math.random());
    const selectedSet = shuffled.slice(0, 15);
    
    setEmails(selectedSet);
    setSelectedEmailId(null); // NEU: Auf Mobile nicht sofort die erste Mail auswählen
    setScore(0);
    setCorrectCount(0);
    setProcessedCount(0);
    setFeedback(null);
    setShowHint(false);
    setFailureReason(null); // NEU
    
    // Zum Posteingang wechseln
    setView('inbox');
  };

  const handleDecision = (decision) => {
    const currentEmail = emails.find(e => e.id === selectedEmailId);
    if (!currentEmail) return;

    let isCorrect = false;
    if (decision === 'keep' && currentEmail.type === 'legit') isCorrect = true;
    if (decision === 'spam' && currentEmail.type === 'spam') isCorrect = true;

    if (isCorrect) {
      setScore(score + 100);
      setCorrectCount(correctCount + 1); // NEU
      setFeedback({
        type: 'success',
        title: 'Hervorragend!',
        message: "Richtig erkannt. " + currentEmail.explanation
      });
    } else {
      setScore(Math.max(0, score - 50));
      setFeedback({
        type: 'error',
        title: 'Vorsicht!',
        message: "Falsch entschieden. " + currentEmail.explanation
      });
    }
    setProcessedCount(processedCount + 1); // NEU
  };

  const nextEmail = () => {
    setFeedback(null);
    setShowHint(false);
    const remainingEmails = emails.filter(e => e.id !== selectedEmailId);
    
    if (remainingEmails.length === 0) {
      setView('gameover'); // NEU: Wechsle zur Gameover-Ansicht
      setEmails([]);
      setSelectedEmailId(null);
    } else {
      setEmails(remainingEmails);
      setSelectedEmailId(null); // NENormal 0 false false false DE X-NONE X-NONE /* Style Definitions */ table.MsoNormalTable {mso-style-name:"Table Normal"; mso-tstyle-rowband-size:0; mso-tstyle-colband-size:0; mso-style-noshow:yes; mso-style-priority:99; mso-style-parent:""; mso-padding-alt:0cm 5.4pt 0cm 5.4pt; mso-para-margin-top:0cm; mso-para-margin-right:0cm; mso-para-margin-bottom:8.0pt; mso-para-margin-left:0cm; line-height:107%; mso-pagination:widow-orphan; font-size:11.0pt; font-family:"Calibri",sans-serif; mso-ascii-font-family:Calibri; mso-ascii-theme-font:minor-latin; mso-hansi-font-family:Calibri; mso-hansi-theme-font:minor-latin; mso-bidi-font-family:"Times New Roman"; mso-bidi-theme-font:minor-bidi; mso-fareast-language:EN-US;}U: Nach dem Klick auf "Nächste Mail" zur Liste zurückkehren
    }
  };

  // NEUE FUNKTION: Wird aufgerufen, wenn ein "Fallen"-Link geklickt wird
  const handleLinkClick = () => {
    const currentEmail = emails.find(e => e.id === selectedEmailId);
    if (!currentEmail) return;

    setScore(0); // Punkte sind weg
    setCorrectCount(0); // Zählung zurücksetzen
    setProcessedCount(processedCount + 1); // Diese Mail zählt als (falsch) bearbeitet
    
    // Setzt den Grund für das Scheitern
    setFailureReason(
      'Du hast auf einen Phishing-Link geklickt! In der echten Welt könnten deine Daten jetzt gestohlen sein. ' + currentEmail.explanation
    );
    
    // Sofort zum Game Over Bildschirm
    setView('gameover');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Setzt die Schriftart (Hilft bei Kompatibilität)
    doc.setFont("Helvetica");

    // Titel
    doc.setFontSize(22);
    doc.text("Zertifikat: E-Mail Detektiv", 20, 20);

    // Schülerdaten
    doc.setFontSize(14);
    doc.text(`Name: ${userName}`, 20, 40);
    doc.text(`Klasse: ${userClass}`, 20, 50);

    // Ergebnis
    doc.setFontSize(16);
    doc.text("Dein Ergebnis:", 20, 70);
    
    doc.setFontSize(12);
    doc.text(`- Korrekt erkannt: ${correctCount} von ${processedCount} E-Mails`, 20, 80);
    doc.text(`- Endpunktzahl: ${score}`, 20, 90);

    // NEU: Fügt den Fehlergrund hinzu, falls vorhanden
    if (failureReason) {
      doc.setFontSize(12);
      doc.setTextColor(255, 0, 0); // Rot
      doc.text("Status: Nicht bestanden (Link geklickt)", 20, 100);
      doc.setTextColor(0, 0, 0); // Schwarz
    } else {
      doc.setFontSize(12);
      doc.setTextColor(0, 128, 0); // Grün
      doc.text("Status: Bestanden", 20, 100);
      doc.setTextColor(0, 0, 0); // Schwarz
    }

    // Datum
    const date = new Date();
    const dateStr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    doc.setFontSize(10);
    doc.text(`Ausgestellt am: ${dateStr}`, 20, 120); // Y-Position angepasst
    doc.text(`(c) Jonathan Mangold`, 20, 125); // Y-Position angepasst


    doc.save(`Zertifikat_${userName.replace(/ /g, '_')}_Email-Detektiv.pdf`);
  };


  // === Der "Router" ===
  // Entscheidet, welche Ansicht (Login, Inbox, GameOver) gezeigt wird

  if (view === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (view === 'gameover') {
    return (
      <GameOverScreen 
        userName={userName}
        userClass={userClass}
        score={score}
        correctCount={correctCount}
        totalMails={processedCount}
        onDownloadPDF={handleDownloadPDF}
        onReset={resetGame}
        failureReason={failureReason} // NEU
      />
    );
  }

  if (view === 'inbox') {
    return (
      <InboxScreen 
        emails={emails}
        selectedEmailId={selectedEmailId}
        score={score}
        feedback={feedback}
        showHint={showHint}
        setSelectedEmailId={setSelectedEmailId}
        handleDecision={handleDecision}
        nextEmail={nextEmail}
        setShowHint={setShowHint}
        handleLinkClick={handleLinkClick} // NEU
      />
    );
  }
  
  // Fallback (sollte nie eintreten)
  return <LoginScreen onLogin={handleLogin} />;
}
