//App principal
let beforeInstallEvent = null; //Evento diferido para mostrar el boton de instalacion

//Accesos rapidos al DOM
const $ = (sel) => document.querySelector(sel);
const btnInstall = $("#btnInstall"); //Boton para instalar la PWA

//Instalacion de la PWA (A2HS)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  beforeInstallEvent = e;
  btnInstall.hidden = false;
});

btnInstall.addEventListener("click", async () => {
  if (!beforeInstallEvent) return;
  beforeInstallEvent.prompt();
  await beforeInstallEvent.userChoice;
  btnInstall.hidden = true;
  beforeInstallEvent = null;
});

//aqui registro el Service Worker cuando la página termine de cargar
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.error('Error al registrar el Service Worker:', err));
    });
}

//Solicitar permiso de notificación al cargar
function requestPermissionOnLoad() {
    if (!('Notification' in window)) {
        console.warn('Notificaciones no soportadas en este navegador.');
        return;
    }

    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso de notificación concedido.');
            } else {
                console.log('Permiso de notificación denegado o bloqueado.');
            }
        });
    }
}

// Función para enviar notificación
function sendNotification() {
    if (Notification.permission !== 'granted') {
        alert('Necesitas permitir notificaciones. Recarga la página para intentarlo de nuevo.');
        return;
    }

    if ('serviceWorker' in navigator) {
        // aqui uso el navigator.serviceWorker.ready  espera hasta que el SW esté listo
        navigator.serviceWorker.ready.then(registration => {
            registration.active.postMessage({
                type: 'SHOW_NOTIFICATION',
                title: 'La Guitarra Eléctrica',
                options: {
                    body: 'Esta es una noti push ekisde ekisde ekisde.',
                    icon: 'logo.png',
                    badge: 'logo.png',
                    requireInteraction: false
                }
            });
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Solicitar permiso automáticamente
    requestPermissionOnLoad();

    // Asociar el botón (tu ID es "btnNotificacion")
    const btn = document.getElementById('btnNotificacion');
    if (btn) {
        btn.addEventListener('click', sendNotification);
    }
});