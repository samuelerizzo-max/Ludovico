# Lista nascita di Ludovico

Sito statico (nessun server da gestire) pronto per GitHub Pages. Usa Firebase
Firestore al posto dello storage di Claude per salvare regali, prenotazioni
e contributi — quella parte è già scritta, ti serve solo creare un progetto
Firebase gratuito e incollare la configurazione in un punto.

Tempo stimato: 15-20 minuti, nessuna riga di codice da scrivere.

## 1. Crea il database (Firebase, gratuito)

1. Vai su [console.firebase.google.com](https://console.firebase.google.com) e accedi con un account Google.
2. **Aggiungi progetto** → dagli un nome (es. "lista-ludovico") → puoi disattivare Google Analytics, non serve → **Crea progetto**.
3. Nel menu a sinistra: **Build → Firestore Database** → **Crea database** → scegli una località vicina (es. `eur3 (europe-west)`) → parti in **modalità test** (aggiorniamo le regole al punto 3).
4. Torna alla home del progetto (icona casa) → clicca l'icona **`</>`** (aggiungi app web) → dagli un nome → **Registra app**. Ti mostra un blocco `firebaseConfig = {...}`: copialo, ti serve al passo successivo.

## 2. Incolla la configurazione

Apri il file **`firebase-config.js`** in questo progetto e sostituisci i valori
segnaposto con quelli copiati da Firebase. È l'unico file che devi modificare.

## 3. Blocca l'accesso al resto del tuo progetto Firebase

Nella console Firebase: **Firestore Database → Regole**, sostituisci tutto con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registry/{docId} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Poi **Pubblica**. Questo apre in lettura/scrittura solo i dati della lista
nascita (esattamente come prima, protetta solo dalla password che imposti
al primo accesso al pannello "Gestisci lista" — non è una vera barriera
tecnica, ma tiene fuori i curiosi) e blocca tutto il resto del progetto.

## 4. Metti i file su GitHub

1. Su [github.com](https://github.com), crea un repository nuovo (può essere pubblico), es. `lista-ludovico`.
2. **Add file → Upload files** → trascina dentro tutti i file di questa cartella (`index.html`, `app.js`, `firebase-config.js`, `storage-shim.js`) → **Commit changes**.
3. Vai su **Settings → Pages** → sotto "Build and deployment", Source: **Deploy from a branch** → Branch: **main**, cartella **/ (root)** → **Save**.
4. Dopo un minuto GitHub ti mostra l'indirizzo pubblico, tipo `https://tuonome.github.io/lista-ludovico/`. Quello è il link da condividere.

## Note

- Il recupero automatico della foto prodotto (quando incolli un link) funziona
  esattamente come prima — non dipende da Claude, quindi non serve toccare nulla.
- I contributi PayPal restano segnati come "inviati" dagli ospiti stessi, non
  verificati: confrontali col tuo saldo PayPal reale ogni tanto.
- Se in futuro vuoi cambiare qualcosa nella lista (testi, colori, categorie),
  torna qui in chat e chiedi: ti preparo un `app.js` aggiornato da ricaricare
  su GitHub — `firebase-config.js` e il resto restano invariati.
