// Hämta element för modal, färgväljare, textfärgväljare och fontväljare
var modal = document.getElementById("settingsModal");
var settingsApp = document.getElementById("settingsApp");
var closeBtn = document.querySelector(".close");
var saveButton = document.querySelector(".save-button");
var backgroundColorPreview = document.getElementById("colorPreview"); // Färgcirkeln för bakgrundsfärg
var textColorPreview = document.getElementById("textColorPreview"); // Färgcirkeln för textfärg

// Temporära variabler för att hålla inställningar innan de sparas
var tempBackgroundColor = localStorage.getItem('backgroundColor') || '#ffffff';
var tempTextColor = localStorage.getItem('textColor') || '#000000';
var tempFontFamily = localStorage.getItem('fontFamily') || 'Open Sans';
var tempIconSize = localStorage.getItem('iconSize') || 'medium';

// Variabler för språkhantering
var translations = {};
var defaultLanguage = 'sv'; // Temporär standard, uppdateras när config.json laddas


//Startup Hemsida
document.addEventListener('DOMContentLoaded', function() {
    const startupScreen = document.getElementById('startup-screen');
    const startupLogo = document.getElementById('startup-logo');

    // Tonar in logotypen efter sidan har laddats
    setTimeout(() => {
        startupLogo.style.opacity = 1;
    }, 500); // Vänta 0,5 sekunder innan logotypen tonas in

    // Tar bort startup-skärmen efter några sekunder
    setTimeout(() => {
        startupScreen.classList.add('fade-out');
    }, 3000); // Vänta 3 sekunder innan skärmen försvinner

    // Ta bort startup-skärmen från DOM efter animationen
    setTimeout(() => {
        startupScreen.style.display = 'none';
    }, 4000); // Ta bort helt efter 4 sekunder
});

// Kontrollera om sidan redan har laddats tidigare i den här sessionen
window.addEventListener('DOMContentLoaded', function () {
    const hasVisited = localStorage.getItem('hasVisited');
    
    // Om användaren inte har besökt sidan tidigare, visa "startup"-skärmen
    if (!hasVisited) {
        document.getElementById('startup-screen').style.display = 'flex';
        
        // Spara en flagga i localStorage att användaren har besökt sidan
        localStorage.setItem('hasVisited', 'true');
        
        // Efter några sekunder, döljer vi "startup"-skärmen
        setTimeout(() => {
            document.getElementById('startup-screen').style.display = 'none';
        }, 3000); // Visar skärmen i 3 sekunder
    } else {
        // Om användaren redan har besökt sidan, döljer vi "startup"-skärmen direkt
        document.getElementById('startup-screen').style.display = 'none';
    }
});

window.addEventListener('DOMContentLoaded', function () {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = new Date().getTime();
    const oneHour = 10 * 1000; // 60 * 60 * 1000; En timme i millisekunder           10 * 1000; för test

    // Om det har gått mer än en timme sedan sista besöket, eller användaren aldrig har besökt sidan
    if (!lastVisit || (currentTime - lastVisit) > oneHour) {
        document.getElementById('startup-screen').style.display = 'flex';

        // Spara aktuell tid som senaste besök
        localStorage.setItem('lastVisit', currentTime);
        
        // Visa "startup"-skärmen i några sekunder
        setTimeout(() => {
            document.getElementById('startup-screen').style.display = 'none';
        }, 3000); // Visar skärmen i 3 sekunder
    } else {
        // Om det har gått mindre än en timme, döljer vi "startup"-skärmen direkt
        document.getElementById('startup-screen').style.display = 'none';
    }
});




// Hämta språkinställningar från config.json
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        translations = data.translations; // Ladda översättningar från config.json
        defaultLanguage = data.defaultLanguage || 'sv'; // Ladda förvalt språk från config.json, standard till 'sv' om inte definierat
        
        // Ladda valt språk från localStorage eller använd förvalt språk från config.json
        var savedLanguage = localStorage.getItem('language') || defaultLanguage;
        tempLanguage = savedLanguage; // Uppdatera tempLanguage med antingen sparat eller förvalt språk
        
        // Använd språket direkt när sidan laddas
        document.querySelector(`.language-box[data-language="${tempLanguage}"]`).classList.add('active');
        applyLanguage(tempLanguage);
    })
    .catch(error => console.error('Error loading config:', error));

// Funktion för att tillämpa språket på alla delar av sidan
// Funktion för att tillämpa språket på alla delar av sidan
function applyLanguage(language) {
    var textElements = {
        title: document.querySelector('h1'),
        settings: document.querySelector('#settingsApp p'),
        appearanceTab: document.querySelector('button[onclick="openTab(event, \'Appearance\')"]'),
        languageTab: document.querySelector('button[onclick="openTab(event, \'Language\')"]'),
        aboutTab: document.querySelector('button[onclick="openTab(event, \'About\')"]'),
        userTab: document.querySelector('button[onclick="openTab(event, \'User\')"]'),
        backgroundColorLabel: document.querySelector('label[for="colorPicker"]'),
        textColorLabel: document.querySelector('label[for="textColorPicker"]'),
        appSizeLabel: document.querySelector('.appearance-section h4:nth-of-type(1)'),
        fontFamilyLabel: document.querySelector('.appearance-section h4:nth-of-type(2)'),
        appearanceSectionTitle: document.querySelector('#Appearance h3'),
        modalTitle: document.querySelector('.modal-content h2'),
        chooseLanguageLabel: document.querySelector('#Language h3'),
        smallSizeOption: document.querySelector('.size-box[data-size="small"]'),
        mediumSizeOption: document.querySelector('.size-box[data-size="medium"]'),
        largeSizeOption: document.querySelector('.size-box[data-size="large"]'),
        swedishOption: document.querySelector('.language-box[data-language="sv"]'),
        englishOption: document.querySelector('.language-box[data-language="en"]'),
        aboutTitle: document.querySelector('#About h3'),
        versionText: document.querySelector('#About p'),
        resetButton: document.querySelector('#resetButton'),
        confirmResetTitle: document.querySelector('#confirmationModal h2'),
        confirmResetText: document.querySelector('#confirmationModal p'),
        confirmButton: document.querySelector('#confirmReset'),
        cancelButton: document.querySelector('#cancelReset')
    };

    if (textElements.title) textElements.title.textContent = translations[language].title;
    if (textElements.settings) textElements.settings.textContent = translations[language].settings;
    if (textElements.appearanceTab) textElements.appearanceTab.textContent = translations[language].appearance;
    if (textElements.languageTab) textElements.languageTab.textContent = translations[language].language;
    if (textElements.aboutTab) textElements.aboutTab.textContent = translations[language].about;
    if (textElements.userTab) textElements.userTab.textContent = translations[language].userTab; 
    if (textElements.saveButton) textElements.saveButton.textContent = translations[language].save;
    if (textElements.backgroundColorLabel) textElements.backgroundColorLabel.textContent = translations[language].backgroundColor;
    if (textElements.textColorLabel) textElements.textColorLabel.textContent = translations[language].textColor;
    if (textElements.appSizeLabel) textElements.appSizeLabel.textContent = translations[language].appSize;
    if (textElements.fontFamilyLabel) textElements.fontFamilyLabel.textContent = translations[language].fontFamily;
    if (textElements.appearanceSectionTitle) textElements.appearanceSectionTitle.textContent = translations[language].appearanceSectionTitle;
    if (textElements.modalTitle) textElements.modalTitle.textContent = translations[language].modalTitle;
    if (textElements.chooseLanguageLabel) textElements.chooseLanguageLabel.textContent = translations[language].chooseLanguage;
    if (textElements.swedishOption) textElements.swedishOption.textContent = translations[language].swedish;
    if (textElements.englishOption) textElements.englishOption.textContent = translations[language].english;
    if (textElements.smallSizeOption) textElements.smallSizeOption.textContent = translations[language].small;
    if (textElements.mediumSizeOption) textElements.mediumSizeOption.textContent = translations[language].medium;
    if (textElements.largeSizeOption) textElements.largeSizeOption.textContent = translations[language].large;
    if (textElements.aboutTitle) textElements.aboutTitle.textContent = translations[language].aboutAppInfo; 
    if (textElements.versionText) textElements.versionText.textContent = translations[language].version; 
    if (textElements.resetButton) textElements.resetButton.textContent = translations[language].resetButton;
    if (textElements.confirmResetTitle) textElements.confirmResetTitle.textContent = translations[language].confirmationTitle;
    if (textElements.confirmResetText) textElements.confirmResetText.textContent = translations[language].confirmationMessage;
    if (textElements.confirmButton) textElements.confirmButton.textContent = translations[language].confirmReset;
    if (textElements.cancelButton) textElements.cancelButton.textContent = translations[language].cancelReset;
}




// Temporär variabel för språk
var tempLanguage; // Vi sätter denna när config.json laddas

// Hantera språkval och uppdatera temporär variabel
document.querySelectorAll('.language-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('.language-box').forEach(box => box.classList.remove('active'));
        this.classList.add('active');
        tempLanguage = this.getAttribute('data-language'); // Uppdatera temporär variabel för språk
    });
});

// Visa modalen när Inställningar-appen klickas
settingsApp.addEventListener('click', function(event) {
    if (!isEditMode) {  // Kontrollera om vi INTE är i redigeringsläge
        modal.style.display = "block";
    } else {
        event.preventDefault();  // Förhindra klick i redigeringsläge
    }
});

// Stäng modalen när man klickar på "x"
closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
});

// Stäng modalen när man klickar utanför
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});


// Initiera Pickr-färgväljare för bakgrund och textfärger
const pickrBackground = Pickr.create({
    el: '.color-picker-background',
    theme: 'nano',
    default: tempBackgroundColor,
    useAsButton: true,  // Gör att cirkeln fungerar som knapp
    swatches: null,     // Tar bort förinställda färger
    components: {
        preview: false,  // Ta bort den inre förhandsvisningscirkeln (schackrutorna)
        opacity: true,   // Tillåter transparens
        hue: true,       // Tillåter att justera färgens nyans

        interaction: {
            input: true,
            save: true,
            cancel: true
        }
    },
    defaultRepresentation: 'HEX',  // Visa färgen som HEX-format
    container: document.body,      // Se till att färgväljaren visas på hela sidan

    // Ändra knapparnas text till "Klar" och "Avbryt"
    i18n: {
        'btn:save': translations[tempLanguage]?.confirm || '   ✔  ',
        'btn:cancel': translations[tempLanguage]?.cancel || '   ✘   '
    }
});


// När "Klar" eller "Avbryt" trycks, stäng färgväljaren
pickrBackground.on('save', (color) => {
    tempBackgroundColor = color.toHEXA().toString();
    backgroundColorPreview.style.backgroundColor = tempBackgroundColor;
    pickrBackground.hide(); // Stänger färgväljaren
});

pickrBackground.on('cancel', () => {
    pickrBackground.hide(); // Stänger färgväljaren när "Avbryt" trycks
});

// Hantera Pickr för textfärgen
const pickrText = Pickr.create({
    el: '.color-picker-text',
    theme: 'nano',
    default: tempTextColor,
    useAsButton: true,  // Gör att cirkeln fungerar som knapp
    swatches: null,     // Tar bort förinställda färger
    components: {
        preview: false,  // Ta bort den inre förhandsvisningscirkeln (schackrutorna)
        opacity: true,   // Tillåter transparens
        hue: true,       // Tillåter att justera färgens nyans

        interaction: {
            input: true,
            save: true,
            cancel: true
        }
    },
    defaultRepresentation: 'HEX',  // Visa färgen som HEX-format
    container: document.body,      // Se till att färgväljaren visas på hela sidan

    // Ändra knapparnas text till "Klar" och "Avbryt"
    i18n: {
        'btn:save': translations[tempLanguage]?.confirm || '   ✔  ',
        'btn:cancel': translations[tempLanguage]?.cancel || '   ✘   '
    }
});



// När "Klar" eller "Avbryt" trycks, stäng färgväljaren
pickrText.on('save', (color) => {
    tempTextColor = color.toHEXA().toString();
    textColorPreview.style.backgroundColor = tempTextColor;
    pickrText.hide(); // Stänger färgväljaren
});

pickrText.on('cancel', () => {
    pickrText.hide(); // Stänger färgväljaren när "Avbryt" trycks
});


// Hantera textfärgväljarens förhandsvisning och öppning
document.getElementById('textColorPreview').addEventListener('click', function() {
    pickrText.show(); // Öppna färgväljaren när cirkeln klickas
});



// Uppdatera cirklarna vid laddning av sidan baserat på de sparade färgerna
window.addEventListener('DOMContentLoaded', () => {
    backgroundColorPreview.style.backgroundColor = tempBackgroundColor; // Visa sparad bakgrundsfärg i cirkeln
    textColorPreview.style.backgroundColor = tempTextColor; // Visa sparad textfärg i cirkeln
});


// När färgen väljs från Pickr, uppdatera bara de temporära variablerna och förhandsvisningen
pickrBackground.on('save', (color) => {
    tempBackgroundColor = color.toHEXA().toString();
    backgroundColorPreview.style.backgroundColor = tempBackgroundColor;
});

pickrText.on('save', (color) => {
    tempTextColor = color.toHEXA().toString();
    textColorPreview.style.backgroundColor = tempTextColor;
});

// Klicka på förhandsvisningscirklarna för att öppna färgväljaren
backgroundColorPreview.addEventListener('click', function() {
    pickrBackground.show();
});

textColorPreview.addEventListener('click', function() {
    pickrText.show();
});

// Hantera storleksväljare och uppdatera bara temporära variabler (ingen direkt förändring)
document.querySelectorAll('.size-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('.size-box').forEach(box => box.classList.remove('active'));
        this.classList.add('active');
        tempIconSize = this.getAttribute('data-size'); // Uppdatera temporär variabel
    });
});

// Hantera teckensnittsval och uppdatera bara temporära variabler (ingen direkt förändring)
document.querySelectorAll('.font-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('.font-box').forEach(box => box.classList.remove('active'));
        this.classList.add('active');
        tempFontFamily = this.getAttribute('data-font'); // Uppdatera temporär variabel
    });
});

// Spara inställningar och tillämpa direkt
saveButton.addEventListener('click', function() {
    localStorage.setItem('backgroundColor', tempBackgroundColor); // Spara vald bakgrundsfärg
    localStorage.setItem('textColor', tempTextColor); // Spara vald textfärg
    localStorage.setItem('fontFamily', tempFontFamily); // Spara valt teckensnitt
    localStorage.setItem('iconSize', tempIconSize); // Spara vald appstorlek
    localStorage.setItem('language', tempLanguage); // Spara valt språk

    applyLanguage(tempLanguage); // Tillämpa det valda språket

    applyTheme(); // Tillämpa ändringarna
    modal.style.display = "none"; // Stäng modal
});

// När sidan laddas, återställ färger, storlek och teckensnitt från localStorage
window.addEventListener('DOMContentLoaded', function() {
    backgroundColorPreview.style.backgroundColor = tempBackgroundColor;
    textColorPreview.style.backgroundColor = tempTextColor;
    
    // Återställ font och storlek från localStorage
    document.body.style.fontFamily = tempFontFamily;
    document.querySelectorAll('.app').forEach(app => {
        app.classList.remove('small', 'medium', 'large');
        app.classList.add(tempIconSize);
    });

    // Markera korrekt storlek och teckensnitt
    document.querySelector(`.size-box[data-size="${tempIconSize}"]`).classList.add('active');
    document.querySelector(`.font-box[data-font="${tempFontFamily}"]`).classList.add('active');
});

// Funktion för att tillämpa tema
function applyTheme() {
    document.body.style.backgroundColor = tempBackgroundColor;
    document.body.style.color = tempTextColor;
    document.body.style.fontFamily = tempFontFamily;

    // Uppdatera app-storlek
    document.querySelectorAll('.app').forEach(app => {
        app.classList.remove('small', 'medium', 'large');
        app.classList.add(tempIconSize);
    });
}

// Tillämpa temat baserat på sparade färger
function applyTheme() {
    const savedBackgroundColor = localStorage.getItem('backgroundColor'); // Hämta bakgrundsfärgen
    const savedTextColor = localStorage.getItem('textColor'); // Hämta textfärgen
    
    if (savedBackgroundColor) {
        document.body.style.backgroundColor = savedBackgroundColor;
    }

    if (savedTextColor) {
        document.body.style.color = savedTextColor;
    }
}

// När sidan laddas, tillämpa temat från localStorage
window.addEventListener('DOMContentLoaded', function() {
    const savedBackgroundColor = localStorage.getItem('backgroundColor');
    const savedTextColor = localStorage.getItem('textColor');
    
    if (savedBackgroundColor) {
        backgroundColorPreview.style.backgroundColor = savedBackgroundColor; // Visa sparad bakgrundsfärg i förhandsvisningen
        colorPicker.value = savedBackgroundColor; // Sätt input till sparad färg
    }
    
    if (savedTextColor) {
        textColorPreview.style.backgroundColor = savedTextColor; // Visa sparad textfärg i förhandsvisningen
        textColorPicker.value = savedTextColor; // Sätt input till sparad färg
    }

    applyTheme(); // Tillämpa temat
});



// Hantera storleksväljare (liknande teckensnittsväljaren)
document.querySelectorAll('.size-box').forEach(box => {
    box.addEventListener('click', function() {
        // Ta bort active-klass från alla boxar
        document.querySelectorAll('.size-box').forEach(box => box.classList.remove('active'));

        // Lägg till active-klass på den klickade boxen
        this.classList.add('active');

        // Spara vald storlek i localStorage
        const selectedSize = this.getAttribute('data-size');
        localStorage.setItem('iconSize', selectedSize);
    });
});

// Lägg till event listeners för teckensnittsboxarna (font-boxes)
document.querySelectorAll('.font-box').forEach(box => {
    box.addEventListener('click', function() {
        // Ta bort active-klass från alla boxar
        document.querySelectorAll('.font-box').forEach(box => box.classList.remove('active'));

        // Lägg till active-klass på den klickade boxen
        this.classList.add('active');

        // Spara det valda teckensnittet i localStorage
        const selectedFont = this.getAttribute('data-font');
        localStorage.setItem('fontFamily', selectedFont);

        // Tillämpa det valda teckensnittet direkt
        document.body.style.fontFamily = selectedFont;
    });
});

// Spara inställningar till localStorage och tillämpa direkt
function saveSettings() {
    localStorage.setItem('backgroundColor', colorPicker.value); // Spara vald bakgrundsfärg
    localStorage.setItem('textColor', textColorPicker.value); // Spara vald textfärg

    // Hämta valt teckensnitt från den markerade fontboxen
    const selectedFontBox = document.querySelector('.font-box.active');
    const selectedFont = selectedFontBox ? selectedFontBox.getAttribute('data-font') : "'Open Sans', sans-serif";
    localStorage.setItem('fontFamily', selectedFont); // Spara valt teckensnitt

    // Spara vald appstorlek från den markerade storleksboxen
    const selectedSizeBox = document.querySelector('.size-box.active');
    const selectedSize = selectedSizeBox ? selectedSizeBox.getAttribute('data-size') : 'medium';
    localStorage.setItem('iconSize', selectedSize); // Spara vald appstorlek

    applyTheme(); // Tillämpa temat direkt efter sparning
}

// Tillämpa temat
function applyTheme() {
    const savedBackgroundColor = localStorage.getItem('backgroundColor'); // Hämta bakgrundsfärgen
    const savedTextColor = localStorage.getItem('textColor'); // Hämta textfärgen
    const savedFontFamily = localStorage.getItem('fontFamily'); // Hämta valt teckensnitt
    const savedIconSize = localStorage.getItem('iconSize'); // Hämta sparad appstorlek

    // Tillämpa den valda bakgrundsfärgen
    if (savedBackgroundColor) {
        document.body.style.backgroundColor = savedBackgroundColor;
        appContainer.style.backgroundColor = savedBackgroundColor; // Ändra även färgen för app-container
    }

    // Tillämpa den valda textfärgen, men undanta Settings-rutan
    if (savedTextColor) {
        document.body.style.color = savedTextColor; // Ändra färgen för all text på sidan
        document.querySelectorAll('h1, p, a').forEach(element => {
            if (!element.closest('.modal-content')) { // Undanta text i Settings-rutan
                element.style.color = savedTextColor;
            }
        });
    }

    // Tillämpa det valda teckensnittet på hela sidan, men undanta Settings-modalen
    if (savedFontFamily) {
        document.querySelectorAll('body *').forEach(element => {
            if (!element.closest('.modal-content')) { // Undanta text i Settings-rutan
                element.style.fontFamily = savedFontFamily;
            }
        });

        // Se till att Settings-modalen alltid använder "Open Sans"
        document.querySelector('.modal-content').style.fontFamily = "'Open Sans', sans-serif";
    }

    // Tillämpa vald appstorlek och uppdatera varje app-ikon
    if (savedIconSize) {
        document.querySelectorAll('.app').forEach(app => {
            app.classList.remove('small', 'medium', 'large'); // Rensa tidigare storleksklasser
            app.classList.add(savedIconSize); // Lägg till den nya storleksklassen baserat på sparad storlek
        });
    }
}

// När sidan laddas, tillämpa temat från localStorage
window.addEventListener('DOMContentLoaded', function() {
    const savedIconSize = localStorage.getItem('iconSize'); // Hämta storlek från localStorage

    if (savedIconSize) {
        document.querySelectorAll('.size-box').forEach(box => {
            box.classList.remove('active'); // Ta bort 'active' från alla boxar
            if (box.getAttribute('data-size') === savedIconSize) {
                box.classList.add('active'); // Markera rätt storleksbox
            }
        });
        applyAppSize(savedIconSize); // Tillämpa den sparade storleken på apparna
    } else {
        console.log('Ingen sparad storlek hittad, sätter till "medium"');
        document.querySelector('.size-box[data-size="medium"]').classList.add('active');
        applyAppSize('medium'); // Använd medium som standard
    }

    applyTheme(); // Tillämpa temat baserat på inställningarna
});


// Uppdatera storleken på apparna baserat på valt värde
function applyAppSize(size) {
    const apps = document.querySelectorAll('.app');
    apps.forEach(app => {
        app.classList.remove('small', 'medium', 'large'); // Ta bort alla tidigare storleksklasser
        app.classList.add(size); // Lägg till den valda storleksklassen
    });
}

// Lyssna på storleksändringen
document.querySelectorAll('.icon-size-selector input').forEach(input => {
    input.addEventListener('change', function() {
        const selectedSize = this.value;
        localStorage.setItem('appSize', selectedSize); // Spara den valda storleken i localStorage
        applyAppSize(selectedSize); // Tillämpa storleken direkt
    });
});

document.querySelectorAll('.size-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('.size-box').forEach(box => box.classList.remove('active'));
        this.classList.add('active');
        tempIconSize = this.getAttribute('data-size'); // Uppdatera endast temporär variabel
    });
});

document.querySelectorAll('.font-box').forEach(box => {
    box.addEventListener('click', function() {
        document.querySelectorAll('.font-box').forEach(box => box.classList.remove('active'));
        this.classList.add('active');
        tempFontFamily = this.getAttribute('data-font'); // Uppdatera endast temporär variabel
    });
});


// Aktivera knappen när ändringar detekteras
function enableSaveButton() {
    const saveButton = document.querySelector('.save-button');
    saveButton.classList.add('active');
    saveButton.disabled = false; // Aktivera knappen
}

// Inaktivera knappen när inga ändringar finns
function disableSaveButton() {
    const saveButton = document.querySelector('.save-button');
    saveButton.classList.remove('active');
    saveButton.disabled = true; // Inaktivera knappen
}



// Spara ursprungliga värden
const originalValues = {
    backgroundColor: localStorage.getItem('backgroundColor') || '#ffffff',
    textColor: localStorage.getItem('textColor') || '#000000',
    fontFamily: localStorage.getItem('fontFamily') || 'Open Sans',
    iconSize: localStorage.getItem('iconSize') || 'medium',
    language: localStorage.getItem('language') || defaultLanguage
};

// Kontrollera om inställningarna har ändrats
function checkForChanges() {
    const temporaryValues = {
        backgroundColor: tempBackgroundColor,
        textColor: tempTextColor,
        fontFamily: tempFontFamily,
        iconSize: tempIconSize,
        language: tempLanguage
    };

    if (JSON.stringify(originalValues) !== JSON.stringify(temporaryValues)) {
        enableSaveButton(); // Aktivera spara-knappen
    } else {
        disableSaveButton(); // Inaktivera spara-knappen
    }
}

// Uppdatera originalvärden efter sparning
function updateOriginalValues() {
    Object.assign(originalValues, {
        backgroundColor: tempBackgroundColor,
        textColor: tempTextColor,
        fontFamily: tempFontFamily,
        iconSize: tempIconSize,
        language: tempLanguage
    });
}

// Funktion för att aktivera/inaktivera spara-knappen
function enableSaveButton() {
    const saveButton = document.querySelector('.save-button');
    saveButton.classList.add('active');
    saveButton.disabled = false;
}

function disableSaveButton() {
    const saveButton = document.querySelector('.save-button');
    saveButton.classList.remove('active');
    saveButton.disabled = true;
}

// Lägg till lyssnare för alla ändringar som kan påverka inställningarna
document.querySelectorAll('.size-box, .font-box, .language-box, .color-picker-background, .color-picker-text').forEach(element => {
    element.addEventListener('click', () => {
        if (element.classList.contains('size-box')) {
            tempIconSize = element.getAttribute('data-size');
        } else if (element.classList.contains('font-box')) {
            tempFontFamily = element.getAttribute('data-font');
        } else if (element.classList.contains('language-box')) {
            tempLanguage = element.getAttribute('data-language');
        }
        checkForChanges();
    });
});

// Lyssnare för Pickr-komponenterna
pickrBackground.on('save', (color) => {
    tempBackgroundColor = color.toHEXA().toString();
    backgroundColorPreview.style.backgroundColor = tempBackgroundColor;
    checkForChanges();
});

pickrText.on('save', (color) => {
    tempTextColor = color.toHEXA().toString();
    textColorPreview.style.backgroundColor = tempTextColor;
    checkForChanges();
});

// När användaren sparar inställningarna
saveButton.addEventListener('click', function() {
    // Uppdatera localStorage med nya värden
    localStorage.setItem('backgroundColor', tempBackgroundColor);
    localStorage.setItem('textColor', tempTextColor);
    localStorage.setItem('fontFamily', tempFontFamily);
    localStorage.setItem('iconSize', tempIconSize);
    localStorage.setItem('language', tempLanguage);

    // Uppdatera originalvärden efter sparning
    updateOriginalValues();

    // Inaktivera "Spara"-knappen efter sparning
    disableSaveButton();
});

document.querySelector('.save-button').addEventListener('click', function() {
    // Spara bakgrundsfärg och textfärg via Pickr
    const backgroundColor = localStorage.getItem('backgroundColor');
    const textColor = localStorage.getItem('textColor');

    // Spara teckensnitt
    const selectedFontBox = document.querySelector('.font-box.active');
    const selectedFont = selectedFontBox ? selectedFontBox.getAttribute('data-font') : "'Open Sans', sans-serif";
    localStorage.setItem('fontFamily', selectedFont);

    // Spara appstorlek
    const selectedSizeBox = document.querySelector('.size-box.active');
    const selectedSize = selectedSizeBox ? selectedSizeBox.getAttribute('data-size') : 'medium';
    localStorage.setItem('iconSize', selectedSize);

    // Tillämpa temat och storlek direkt efter sparning
    applyTheme();
    applyAppSize(selectedSize);
});

// Funktion för att växla mellan flikar (utseende, språk, om)
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Dölj allt tab-innehåll
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Dölj alla sektioner
    }

    // Ta bort active-klassen från alla flik-knappar
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Visa den valda fliken och gör knappen "active"
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Hantera synlighet för Spara-knappen
    const saveButton = document.querySelector('.save-button');
    if (tabName === 'About') {  // Om användaren är på "Om"-fliken
        saveButton.style.display = 'none'; // Dölj "Spara"-knappen
    } else {
        saveButton.style.display = 'inline-block'; // Visa "Spara"-knappen för andra flikar
    }
}

// Funktion för att ladda standardinställningar från config.json
function loadDefaultSettings() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            // Lagra standardvärden i localStorage om de inte redan finns
            if (!localStorage.getItem('backgroundColor')) {
                localStorage.setItem('backgroundColor', data.defaultBackgroundColor || '#ffffff');
            }
            if (!localStorage.getItem('textColor')) {
                localStorage.setItem('textColor', data.defaultTextColor || '#000000');
            }
            if (!localStorage.getItem('fontFamily')) {
                localStorage.setItem('fontFamily', data.defaultFontFamily || 'Open Sans');
            }
            if (!localStorage.getItem('iconSize')) {
                localStorage.setItem('iconSize', data.defaultIconSize || 'medium');
            }
            if (!localStorage.getItem('language')) {
                localStorage.setItem('language', data.defaultLanguage || 'sv');
            }

            // Använd dessa värden för att uppdatera temp-variabler och UI
            tempBackgroundColor = localStorage.getItem('backgroundColor');
            tempTextColor = localStorage.getItem('textColor');
            tempFontFamily = localStorage.getItem('fontFamily');
            tempIconSize = localStorage.getItem('iconSize');
            tempLanguage = localStorage.getItem('language');

            // Uppdatera UI med dessa värden
            applyTheme();
            applyLanguage(tempLanguage);
        })
        .catch(error => console.error('Error loading default settings:', error));
}

// Funktion för att uppdatera UI med de nya värdena från localStorage
function updateUIWithNewValues() {
    // Uppdatera bakgrundsfärg och textfärg
    backgroundColorPreview.style.backgroundColor = localStorage.getItem('backgroundColor') || '#ffffff';
    textColorPreview.style.backgroundColor = localStorage.getItem('textColor') || '#000000';

    // Uppdatera storleksval (markera rätt storleksknapp)
    const currentIconSize = localStorage.getItem('iconSize') || 'medium';
    document.querySelectorAll('.size-box').forEach(box => {
        box.classList.remove('active');
        if (box.getAttribute('data-size') === currentIconSize) {
            box.classList.add('active');
        }
    });

    // Uppdatera teckensnitt (markera rätt font-knapp)
    const currentFontFamily = localStorage.getItem('fontFamily') || "'Open Sans', sans-serif";
    document.querySelectorAll('.font-box').forEach(box => {
        box.classList.remove('active');
        const fontData = box.getAttribute('data-font');
        if (fontData === currentFontFamily) {
            box.classList.add('active');
        }
    });

    // Uppdatera språk (markera rätt språk-knapp)
    const currentLanguage = localStorage.getItem('language') || defaultLanguage;
    document.querySelectorAll('.language-box').forEach(box => {
        box.classList.remove('active');
        if (box.getAttribute('data-language') === currentLanguage) {
            box.classList.add('active');
        }
    });

    // Tillämpa hela temat och appstorlek på sidan
    applyTheme();
}

// Funktion för att visa bekräftelsemodulen
function showConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'flex'; // Visa modalen
}

// Funktion för att dölja bekräftelsemodulen
function hideConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none'; // Dölj modalen
}


// Funktion för att återställa alla inställningar
function resetSettings() {
    // Ta bort alla inställningar från localStorage
    localStorage.removeItem('backgroundColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('fontFamily');
    localStorage.removeItem('iconSize');
    localStorage.removeItem('language');
    
    // Ta bort 'hasVisited' från localStorage så att startup-skärmen visas igen
    localStorage.removeItem('hasVisited');

    // Ladda om sidan för att visa startup-skärmen igen
    window.location.reload();
}

// Lägg till händelsehanterare för återställningsknappen
document.getElementById('resetButton').addEventListener('click', showConfirmationModal);

// Lägg till händelsehanterare för bekräftelseknapparna
document.getElementById('confirmReset').addEventListener('click', resetSettings);
document.getElementById('cancelReset').addEventListener('click', hideConfirmationModal);






