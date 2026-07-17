import { useSyncExternalStore } from 'react';

// ---------------------------------------------------------------------------
// Lightweight i18n keyed by the English source string: t('Home') returns the
// translation for the active language, falling back to the key itself. The
// choice persists per-browser and is written through to the backend profile
// (PUT /api/profile/me preferredLanguage) by the settings page; the GET
// profile DTO doesn't echo it back yet, so localStorage is the read side.
// ---------------------------------------------------------------------------

/** Mirrors Core's Language enum: 0 English, 1 Twi, 2 Ga, 3 French. */
export type Language = 'en' | 'tw' | 'ga' | 'fr';

export const LANGUAGES: { code: Language; label: string; backendValue: number }[] = [
  { code: 'en', label: 'English', backendValue: 0 },
  { code: 'tw', label: 'Twi', backendValue: 1 },
  { code: 'ga', label: 'Ga', backendValue: 2 },
  { code: 'fr', label: 'French', backendValue: 3 },
];

export const languageFromBackend = (value: number | null | undefined): Language =>
  LANGUAGES.find((l) => l.backendValue === value)?.code ?? 'en';

export const languageToBackend = (code: Language): number =>
  LANGUAGES.find((l) => l.code === code)?.backendValue ?? 0;

const KEY = 'tripnest.lang';
const listeners = new Set<() => void>();

function readInitial(): Language {
  const raw = localStorage.getItem(KEY);
  return LANGUAGES.some((l) => l.code === raw) ? (raw as Language) : 'en';
}

let current: Language = typeof window !== 'undefined' ? readInitial() : 'en';

export function setLanguage(code: Language): void {
  current = code;
  try { localStorage.setItem(KEY, code); } catch { /* private mode */ }
  listeners.forEach((l) => l());
}

export function getLanguage(): Language {
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Subscribe a component to the active language. */
export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, getLanguage, () => 'en');
}

// --- dictionaries -----------------------------------------------------------
// Keyed by the English string; missing entries fall back to English. Twi and
// Ga are best-effort translations of common UI terms.

type Entry = Partial<Record<Exclude<Language, 'en'>, string>>;

const STRINGS: Record<string, Entry> = {
  // Shared navigation
  'Home': { tw: 'Fie', ga: 'Shĩa', fr: 'Accueil' },
  'Dashboard': { tw: 'Dwumadibea', fr: 'Tableau de bord' },
  'Search Properties': { tw: 'Hwehwɛ afie', fr: 'Rechercher des logements' },
  'Nearby': { tw: 'Ɛbɛn ha', fr: 'À proximité' },
  'Saved Listings': { tw: 'Nea woakora', fr: 'Annonces enregistrées' },
  'Bookings': { tw: 'Adan a woagye', fr: 'Réservations' },
  'Messages': { tw: 'Nkrasɛm', ga: 'Saji', fr: 'Messages' },
  'Agreements': { tw: 'Apam', fr: 'Contrats' },
  'Payments': { tw: 'Sikatua', fr: 'Paiements' },
  'Notifications': { tw: 'Amanneɛbɔ', fr: 'Notifications' },
  'Caretakers': { tw: 'Ahwɛfoɔ', fr: 'Concierges' },
  'House Help': { tw: 'Fie mmoa', fr: 'Aide ménagère' },
  'Maintenance': { tw: 'Nsiesie', fr: 'Entretien' },
  'Agents': { tw: 'Ananmusifoɔ', fr: 'Agents' },
  'Profile': { tw: 'Wo ho nsɛm', fr: 'Profil' },
  'Settings': { tw: 'Nhyehyɛeɛ', fr: 'Paramètres' },
  'Help & Support': { tw: 'Mmoa', fr: 'Aide et assistance' },
  'Main': { tw: 'Nsɛntitiriw', fr: 'Principal' },
  'Services': { tw: 'Nnwuma', fr: 'Services' },
  'Account': { tw: 'Akawnt', fr: 'Compte' },
  'My workspace': { tw: 'Me dwumadibea', fr: 'Mon espace' },
  'Sign in': { tw: 'Kɔ mu', fr: 'Se connecter' },
  'Browse as guest': { tw: 'Hwɛ sɛ ɔhɔho', fr: 'Parcourir en invité' },
  'Become a Host': { tw: 'Bɛyɛ ofiewura', fr: 'Devenir hôte' },
  'Create a landlord account and start earning today!': {
    tw: 'Bue ofiewura akawnt na fi aseɛ nya sika ɛnnɛ!',
    fr: 'Créez un compte propriétaire et commencez à gagner dès aujourd\'hui !',
  },
  'Get Started': { tw: 'Fi aseɛ', fr: 'Commencer' },

  // Landlord / workspace navigation
  'Overview': { tw: 'Nea ɛrekɔ so', fr: 'Vue d\'ensemble' },
  'Reservations': { fr: 'Réservations' },
  'Calendar': { tw: 'Kalenda', fr: 'Calendrier' },
  'Pricing': { tw: 'Boɔ', fr: 'Tarifs' },
  'Statements': { tw: 'Sika ho nsɛm', fr: 'Relevés' },
  'My Listings': { tw: 'M\'afie', fr: 'Mes annonces' },
  'Inquiries': { tw: 'Nsɛmmisa', fr: 'Demandes' },
  'Earnings': { tw: 'Sika a woanya', fr: 'Revenus' },
  'Tenants': { tw: 'Ahɔhoɔ', fr: 'Locataires' },
  'Reviews': { tw: 'Adwene', fr: 'Avis' },
  'Manage': { tw: 'Hwɛ so', fr: 'Gérer' },
  'People': { tw: 'Nnipa', fr: 'Personnes' },
  'Walkthrough review': { fr: 'Vérification des visites' },
  'Viewing requests': { fr: 'Demandes de visite' },
  'My profile': { tw: 'Me ho nsɛm', fr: 'Mon profil' },
  'Service requests': { tw: 'Adwuma abisadeɛ', fr: 'Demandes de service' },
  'Disputes': { tw: 'Akasakasa', fr: 'Litiges' },
  'Support tickets': { fr: 'Tickets d\'assistance' },
  'Audit logs': { fr: 'Journaux d\'audit' },

  // Role labels
  'Tenant': { tw: 'Ɔhɔho', fr: 'Locataire' },
  'Landlord': { tw: 'Ofiewura', fr: 'Propriétaire' },
  'Agent': { fr: 'Agent' },
  'Caretaker': { tw: 'Ɔhwɛfoɔ', fr: 'Concierge' },
  'Admin': { fr: 'Administrateur' },
  'Guest': { tw: 'Ɔhɔho', fr: 'Invité' },

  // Footer headings
  'Explore': { tw: 'Hwehwɛ', fr: 'Explorer' },
  'Hosting': { tw: 'Ofie ho dwuma', fr: 'Hébergement' },
  'Support': { tw: 'Mmoa', fr: 'Assistance' },

  // Settings page
  'Manage your account and preferences': {
    tw: 'Hwɛ w\'akawnt ne nea wopɛ so',
    fr: 'Gérez votre compte et vos préférences',
  },
  'Choose how TripNest keeps you in the loop': {
    tw: 'Paw sɛnea TripNest bɛbɔ wo amanneɛ',
    fr: 'Choisissez comment TripNest vous informe',
  },
  'Email notifications': { tw: 'Email amanneɛbɔ', fr: 'Notifications par e-mail' },
  'Booking and payment updates by email': {
    tw: 'Adan ne sikatua ho nsɛm wɔ email so',
    fr: 'Mises à jour des réservations et paiements par e-mail',
  },
  'SMS safety alerts': { tw: 'SMS ahobammɔ amanneɛbɔ', fr: 'Alertes de sécurité par SMS' },
  'Instant safety alerts by SMS': {
    tw: 'Ahobammɔ amanneɛbɔ ntɛm so wɔ SMS so',
    fr: 'Alertes de sécurité instantanées par SMS',
  },
  'Push notifications': { fr: 'Notifications push' },
  'Alerts on your device': { tw: 'Amanneɛbɔ wɔ wo mfiri so', fr: 'Alertes sur votre appareil' },
  'Preferences': { tw: 'Nea wopɛ', fr: 'Préférences' },
  'Language and currency used across the app': {
    tw: 'Kasa ne sika a wɔde di dwuma wɔ app no mu',
    fr: 'Langue et devise utilisées dans l\'application',
  },
  'Language': { tw: 'Kasa', fr: 'Langue' },
  'Currency': { tw: 'Sika', fr: 'Devise' },
  'Security': { tw: 'Ahobammɔ', fr: 'Sécurité' },
  'Sign out': { tw: 'Fi mu', fr: 'Se déconnecter' },

  // Tenant dashboard
  'Welcome back': { tw: 'Akwaaba bio', ga: 'Oobake', fr: 'Bon retour' },
  "here's what's happening with your home.": {
    tw: 'nea ɛrekɔ so wɔ wo fie ho ni.',
    fr: 'voici ce qui se passe chez vous.',
  },
  'This Month': { tw: 'Bosome yi', fr: 'Ce mois-ci' },
  'Active Bookings': { tw: 'Adan a woagye seesei', fr: 'Réservations actives' },
  'Rent Paid': { tw: 'Ɛdan ka a woatua', fr: 'Loyer payé' },
  'Saved Properties': { tw: 'Afie a woakora', fr: 'Logements enregistrés' },
  'Open Maintenance': { tw: 'Nsiesie a ɛda hɔ', fr: 'Entretiens en cours' },
  'Upcoming Booking': { tw: 'Ɛdan a ɛreba', fr: 'Réservation à venir' },
  'View Booking': { tw: 'Hwɛ ɛdan no', fr: 'Voir la réservation' },
  'Maintenance Tracker': { tw: 'Nsiesie so hwɛ', fr: 'Suivi de l\'entretien' },
  'View all': { tw: 'Hwɛ ne nyinaa', fr: 'Tout voir' },
  'Pending': { tw: 'Ɛretwɛn', fr: 'En attente' },
  'In Progress': { tw: 'Ɛrekɔ so', fr: 'En cours' },
  'Resolved': { tw: 'Wɔasiesie', fr: 'Résolu' },
  'Quick Actions': { tw: 'Nneyɛe ntɛm', fr: 'Actions rapides' },
  'Add Property': { tw: 'Fa ofie ka ho', fr: 'Ajouter un logement' },
  'Make Payment': { tw: 'Tua sika', fr: 'Effectuer un paiement' },
  'Report an Issue': { tw: 'Bɔ ɔhaw ho amanneɛ', fr: 'Signaler un problème' },
  'Recent Messages': { tw: 'Nkrasɛm foforɔ', fr: 'Messages récents' },
  'Invite & Earn': { tw: 'To nsa frɛ na nya sika', fr: 'Invitez et gagnez' },
  'Invite your friends and earn up to GH₵ 100!': {
    tw: 'To nsa frɛ wo nnamfo na nya kosi GH₵ 100!',
    fr: 'Invitez vos amis et gagnez jusqu\'à 100 GH₵ !',
  },
  'Invite Now': { tw: 'To nsa frɛ seesei', fr: 'Inviter maintenant' },
  'Link copied!': { tw: 'Wɔakrɔn link no!', fr: 'Lien copié !' },

  // Safety card
  'Safety First': { tw: 'Ahobammɔ di kan', fr: 'Sécurité d\'abord' },
  'SMS notifications': { tw: 'SMS amanneɛbɔ', fr: 'Notifications SMS' },
  'Trusted contact': { tw: 'Obi a wogye no di', fr: 'Contact de confiance' },
  'Add': { tw: 'Fa ka ho', fr: 'Ajouter' },
  'Edit': { tw: 'Sesa', fr: 'Modifier' },
  'Cancel': { tw: 'Gyae', fr: 'Annuler' },
  'Save contact': { tw: 'Kora contact no', fr: 'Enregistrer le contact' },
  'Share my location with the check-in': {
    tw: 'Fa baabi a mewɔ ka check-in no ho',
    fr: 'Partager ma position avec l\'enregistrement',
  },
  "I've arrived safely": { tw: 'Madu dwoodwoo', fr: 'Je suis bien arrivé(e)' },
  'Emergency alert': { tw: 'Amanehunu amanneɛbɔ', fr: 'Alerte d\'urgence' },
  'Tap again to confirm': { tw: 'Mia bio fa si so dua', fr: 'Appuyez encore pour confirmer' },
};

/** Translate an English source string into the active language. */
export function translate(source: string, lang: Language = current): string {
  if (lang === 'en') return source;
  return STRINGS[source]?.[lang] ?? source;
}

/** Hook: returns a `t` bound to the live language, re-rendering on change. */
export function useT(): (source: string) => string {
  const lang = useLanguage();
  return (source: string) => translate(source, lang);
}
