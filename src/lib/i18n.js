import { SCENARIOS } from './stakeholders';

// Participant-facing UI strings, keyed by scenario language.
// Facilitator pages stay English; scenario content brings its own language.
const STRINGS = {
  en: {
    loading: 'Loading...',
    back: 'Back',
    backHome: 'Back to Home',
    sessionNotFound: 'Session not found. Check the code and try again.',
    // Join
    joinTitle: 'Join Session',
    yourName: 'Your Name',
    namePlaceholder: 'Enter your name',
    nameTooShort: 'Please enter a name (at least 2 characters).',
    joinButton: 'Join',
    joiningButton: 'Joining...',
    groupsActive: (n) => `${n} groups active`,
    participantsJoined: (n) => `${n} participant${n !== 1 ? 's' : ''} joined`,
    rejoinHint: 'Lost your session? Just enter session code and the same name again to rejoin your group.',
    closedRejoinNotice: 'This session is closed for new participants. Already joined? Enter your name to get back to your role.',
    closedNoNewJoin: 'This session is closed — only rejoining with an existing name is possible. Check the spelling of your name.',
    allGroupsFull: 'All groups are full. Please contact the facilitator.',
    joinFailed: 'Failed to join session. Please try again.',
    rejoinConfirmQuestion: (name, group) => `"${name}" has already joined${group ? ` (group: ${group})` : ''}. Is that you?`,
    rejoinYes: 'Yes, that’s me — rejoin',
    rejoinNo: 'No, I’m a different person',
    duplicateNameHint: 'Please make your name unique, e.g. add a last-name initial.',
    similarNameQuestion: (name) => `A participant named "${name}" already exists. Did you mean this name?`,
    rejoinAs: (name) => `Rejoin as "${name}"`,
    joinAsNew: 'No, join as a new participant',
    removedNotice: 'Your registration was removed from this session. Please check with the facilitator before rejoining.',
    // Participant view
    yourRole: 'Your Role',
    yourGroup: 'Your group:',
    roleCardSection: '📋 Your Role Card',
    caseSection: '📖 The Case',
    scheduleSection: '📅 Schedule',
    allGroupsSection: '👥 All Groups',
    sessionClosedBanner: 'This session has ended — your materials remain available.',
    contentLoadError: 'Your materials could not be loaded. Please check your connection.',
    retry: 'Try again',
    unknownRole: 'Your assigned role could not be found. Please contact the facilitator.',
    // Shared components
    noMembersYet: 'No members yet',
    youSuffix: '(You)',
    // Nav
    navStart: 'Start',
    navInfoHub: 'Info Hub',
    navMyRole: 'My Role',
  },
  de: {
    loading: 'Lädt...',
    back: 'Zurück',
    backHome: 'Zur Startseite',
    sessionNotFound: 'Session nicht gefunden. Prüfe den Code und versuche es erneut.',
    // Join
    joinTitle: 'Session beitreten',
    yourName: 'Dein Name',
    namePlaceholder: 'Namen eingeben',
    nameTooShort: 'Bitte gib einen Namen ein (mindestens 2 Zeichen).',
    joinButton: 'Beitreten',
    joiningButton: 'Trete bei...',
    groupsActive: (n) => `${n} Gruppen aktiv`,
    participantsJoined: (n) => `${n} Teilnehmer:innen beigetreten`,
    rejoinHint: 'Verbindung verloren? Gib einfach Session-Code und denselben Namen erneut ein, um zu deiner Gruppe zurückzukehren.',
    closedRejoinNotice: 'Diese Session ist für neue Teilnehmer:innen geschlossen. Schon beigetreten? Gib deinen Namen ein, um zu deiner Rolle zurückzukehren.',
    closedNoNewJoin: 'Diese Session ist geschlossen — nur die Rückkehr mit einem bereits registrierten Namen ist möglich. Prüfe die Schreibweise deines Namens.',
    allGroupsFull: 'Alle Gruppen sind voll. Bitte wende dich an die Spielleitung.',
    joinFailed: 'Beitritt fehlgeschlagen. Bitte versuche es erneut.',
    rejoinConfirmQuestion: (name, group) => `„${name}" ist bereits beigetreten${group ? ` (Gruppe: ${group})` : ''}. Bist du das?`,
    rejoinYes: 'Ja, das bin ich — zurückkehren',
    rejoinNo: 'Nein, ich bin jemand anderes',
    duplicateNameHint: 'Bitte mach deinen Namen eindeutig, z. B. mit dem Anfangsbuchstaben deines Nachnamens.',
    similarNameQuestion: (name) => `Es gibt bereits „${name}" in dieser Session. Meintest du diesen Namen?`,
    rejoinAs: (name) => `Als „${name}" zurückkehren`,
    joinAsNew: 'Nein, als neue Person beitreten',
    removedNotice: 'Deine Registrierung wurde aus dieser Session entfernt. Bitte kläre das mit der Spielleitung, bevor du erneut beitrittst.',
    // Participant view
    yourRole: 'Deine Rolle',
    yourGroup: 'Deine Gruppe:',
    roleCardSection: '📋 Deine Rollenkarte',
    caseSection: '📖 Die Fallstudie',
    scheduleSection: '📅 Spielablauf',
    allGroupsSection: '👥 Alle Gruppen',
    sessionClosedBanner: 'Diese Session wurde beendet — deine Materialien bleiben verfügbar.',
    contentLoadError: 'Deine Materialien konnten nicht geladen werden. Prüfe deine Verbindung.',
    retry: 'Erneut versuchen',
    unknownRole: 'Deine zugewiesene Rolle wurde nicht gefunden. Bitte wende dich an die Spielleitung.',
    // Shared components
    noMembersYet: 'Noch niemand hier',
    youSuffix: '(Du)',
    // Nav
    navStart: 'Start',
    navInfoHub: 'Infos',
    navMyRole: 'Meine Rolle',
  },
};

export function getScenarioLanguage(scenarioId) {
  return SCENARIOS[scenarioId]?.language || 'en';
}

export function getUiStrings(scenarioId) {
  return STRINGS[getScenarioLanguage(scenarioId)];
}
