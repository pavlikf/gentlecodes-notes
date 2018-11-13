import LocalizedStrings from 'react-localization';

const localizedStrings = new LocalizedStrings({
    en: {
        appHeader: 'Turbo simple note manager',
        linkCreateNote: 'Create note',
        headerInsertNote: 'New note',
        headerUpdateNote: 'Change note nr.{0}',
        headerNoteList: 'Notes list',
        messageItemRemoved: 'Item was removed',
        messageItemInserted: 'Item was created',
        messageLangSelected: 'Language has been changed to english',
        messageItemUpdated: 'Note nr.{0} updated',
        buttonInsert: 'Insert',
        buttonSave: 'Save changes',
    },
    cs: {
        appHeader: 'Ultimátní poznámkovník',
        linkCreateNote: 'Vytvořit poznámku',
        headerInsertNote: 'Nová poznámka',
        headerUpdateNote: 'Změna poznámky č.{0}',
        headerNoteList: 'Seznam poznámek',
        messageItemRemoved: 'Položka byla odstraněna',
        messageItemInserted: 'Juchůůůů! Položka byla vytvořena',
        messageLangSelected: 'Změnil jsem jazyk na češtinu',
        messageItemUpdated: 'Poznámka č.{0} byla změněna',
        buttonInsert: 'Vložit',
        buttonSave: 'Uložit změny',
    }
});

localizedStrings.setLanguage('en');

export default localizedStrings