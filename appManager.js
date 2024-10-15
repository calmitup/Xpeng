let draggedElement = null;
let ghostElement = null;
let isEditMode = false; // Håller koll på om redigeringsläget är aktivt
let longPressTimeout; // För att hålla reda på långtryckstimern

const apps = document.querySelectorAll('.app');
const container = document.getElementById('appContainer');
const stopEditButton = document.getElementById('stopEditMode');

// Ladda layouten från LocalStorage när sidan laddas
window.addEventListener('DOMContentLoaded', () => {
    loadAppOrder();
    loadSavedTheme(); // Ladda det sparade temat från LocalStorage
});

// Lägg till långtryck och drag-and-drop-händelser på alla appar
apps.forEach(app => {
    app.addEventListener('mousedown', startLongPress); // Starta långtryck
    app.addEventListener('mouseup', clearLongPress); // Rensa långtryck
    app.addEventListener('mouseleave', clearLongPress); // Rensa långtryck om musen lämnar
    app.addEventListener('click', handleAppClick); // Lägg till en klickhändelse för apparna
    app.addEventListener('dragstart', dragStart); // Starta dragning
    app.addEventListener('dragover', dragOver); // Hantera när appen dras över en annan
    app.addEventListener('dragenter', dragEnter); // Tillåt droppning och dynamisk flyttning
    app.addEventListener('dragend', dragEnd); // Återställ efter dragning
});

// Funktion för att hantera klick på appar
function handleAppClick(event) {
    if (isEditMode) {
        event.preventDefault(); // Förhindra att appen öppnas om vi är i redigeringsläge
        return; // Avsluta funktionen om redigeringsläget är aktivt
    }

    // Kontrollera vilken app som klickas och agera därefter
    const clickedApp = event.target.closest('.app');
    if (clickedApp && clickedApp.id === 'settingsApp') {
        openSettingsModal(); // Öppna inställningsmodulen (i settings.js)
    } else {
        console.log("Appen har öppnats!"); // Lägg till funktionalitet för att öppna andra appar
    }
}

// Funktion för långtryck (aktiverar redigeringsläget)
function startLongPress(event) {
    longPressTimeout = setTimeout(() => {
        activateEditMode(); // Aktivera redigeringsläget efter 3 sekunder
    }, 3000);
}

// Avbryt långtryck om användaren slutar hålla ned
function clearLongPress() {
    clearTimeout(longPressTimeout);
}

// Aktivera redigeringsläge och visa knappen "Klar"
function activateEditMode() {
    isEditMode = true;
    apps.forEach(app => {
        app.classList.add('shake'); // Aktivera skakningsanimation
        app.setAttribute('draggable', 'true'); // Gör apparna dragbara
    });
    stopEditButton.classList.remove('hidden'); // Visa knappen "Klar"
}

// Avsluta redigeringsläge och göm knappen "Klar"
function deactivateEditMode() {
    isEditMode = false;
    apps.forEach(app => {
        app.classList.remove('shake'); // Ta bort skakningsanimationen
        app.setAttribute('draggable', 'false'); // Inaktivera dragbarhet
    });
    stopEditButton.classList.add('hidden'); // Dölj knappen "Klar"
}

// Koppla knappen "Klar" till funktionen för att avsluta redigeringsläget
stopEditButton.addEventListener('click', deactivateEditMode);

// När en app börjar dras
function dragStart(event) {
    if (!isEditMode) return;

    // Ta bort klassen "held" från alla appar
    clearAllHeldClasses();

    draggedElement = event.target.closest('.app'); // Hämta hela app-elementet

    // Lägg till klassen "held" bara på den app du drar
    draggedElement.classList.add('held');

    // Skapa en custom drag image (hela appen med logga och text)
    ghostElement = draggedElement.cloneNode(true); // Klona hela appen (inklusive text och ikon)
    ghostElement.classList.add('held'); // Lägg till samma stil som när du håller ned appen

    // Anpassa storlek och position för ghost-elementet
    ghostElement.style.position = 'absolute';
    ghostElement.style.width = `${draggedElement.offsetWidth}px`;
    ghostElement.style.height = `${draggedElement.offsetHeight}px`;

    // Lägg till ghost-elementet i DOM men gör det osynligt
    ghostElement.style.top = '-9999px';
    document.body.appendChild(ghostElement);

    // Använd ghostElement som drag image och centrera kring muspekaren
    const offsetX = draggedElement.offsetWidth / 2;
    const offsetY = draggedElement.offsetHeight / 2;
    event.dataTransfer.setDragImage(ghostElement, offsetX, offsetY);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedElement.id);

    // Gör den ursprungliga appen osynlig under dragningen
    setTimeout(() => {
        draggedElement.style.visibility = 'hidden';
    }, 0);
}

// Hantera när appen dras över en annan
function dragOver(event) {
    if (!isEditMode) return;
    event.preventDefault();

    const targetApp = event.target.closest('.app'); // Hämta målappen
    if (targetApp && targetApp !== draggedElement) {
        const draggedElementIndex = Array.from(container.children).indexOf(draggedElement);
        const targetElementIndex = Array.from(container.children).indexOf(targetApp);

        // Dynamiskt flytta elementet medan det dras
        if (draggedElementIndex > targetElementIndex) {
            container.insertBefore(draggedElement, targetApp); // Flytta före målappen
        } else {
            container.insertBefore(draggedElement, targetApp.nextSibling); // Flytta efter målappen
        }
    }
}

// Hantera dragenter (nödvändigt för att tillåta droppning)
function dragEnter(event) {
    if (!isEditMode) return;
    event.preventDefault(); // Nödvändigt för att dropp ska tillåtas
}

// När dragningen slutar
function dragEnd(event) {
    if (!isEditMode) return;

    // Återställ appens synlighet
    draggedElement.style.visibility = 'visible';

    // Ta bort alla "held"-klasser från alla appar efter dragningen
    clearAllHeldClasses();

    // Ta bort ghost-elementet efter dragningen är klar
    if (ghostElement) {
        document.body.removeChild(ghostElement);
        ghostElement = null;
    }

    saveAppOrder(); // Spara den nya ordningen
}

// Funktion för att ta bort klassen "held" från alla appar
function clearAllHeldClasses() {
    const allApps = document.querySelectorAll('.app');
    allApps.forEach(app => app.classList.remove('held'));
}

// Sparar ordningen i LocalStorage
function saveAppOrder() {
    const appIds = Array.from(container.children).map(app => app.id);
    localStorage.setItem('appOrder', JSON.stringify(appIds));
}

// Ladda ordningen från LocalStorage och tillämpa den
function loadAppOrder() {
    const savedOrder = localStorage.getItem('appOrder');
    if (savedOrder) {
        const appIds = JSON.parse(savedOrder);
        appIds.forEach(appId => {
            const app = document.getElementById(appId);
            if (app) {
                container.appendChild(app);
            }
        });
    }
}

// Ladda det sparade temat från LocalStorage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme); // Om ett tema finns, tillämpa det
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = savedTheme; // Uppdatera "Theme"-väljaren i inställningar
        }
    }
}

// Funktion för att tillämpa temat på sidan
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#fff';
    } else {
        document.body.style.backgroundColor = '#f0f0f0';
        document.body.style.color = '#333';
    }
}
