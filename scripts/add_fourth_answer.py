import json
import random
import os

BASE_PATH = '/home/user/quiz-editor/public/questions'


def process_file(filename, new_answers, base_seed):
    path = os.path.join(BASE_PATH, filename)
    with open(path, encoding='utf-8') as f:
        questions = json.load(f)

    assert len(questions) == len(new_answers), (
        f"{filename}: {len(questions)} domande ma {len(new_answers)} risposte nuove"
    )

    result = []
    for i, (q, new_ans) in enumerate(zip(questions, new_answers)):
        rng = random.Random(base_seed + i * 7)

        answers = list(q['risposte']) + [new_ans]
        correct_answer = answers[q['corretta']]

        indices = list(range(4))
        rng.shuffle(indices)

        new_answers_list = [answers[idx] for idx in indices]
        new_correct = new_answers_list.index(correct_answer)

        new_q = dict(q)
        new_q['risposte'] = new_answers_list
        new_q['corretta'] = new_correct
        result.append(new_q)

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f'✓ {filename}: {len(result)} domande aggiornate')


# ---------------------------------------------------------------------------
# Nuove quarte risposte per ogni file
# ---------------------------------------------------------------------------

# css.json — nessuna risposta umoristica → 4ª risposta UMORISTICA
css_new = [
    # 0 Cos'è il CSS?
    "Un linguaggio di programmazione lato server che genera le query SQL direttamente dal markup HTML",
    # 1 Dove si inserisce il collegamento al file CSS
    "Nel tag `<link>` alla fine del `<body>` — così non blocca il caricamento del testo e Google PageSpeed è finalmente soddisfatto",
    # 2 class vs id
    "Non c'è alcuna differenza tecnica: è una convenzione stilistica nata negli anni '90 che nessuno ha mai avuto il coraggio di eliminare",
    # 3 Selettore CSS per classe
    "!.introduzione — il punto esclamativo seleziona la classe con priorità massima, come `!important` ma per i selettori",
    # 4 margin
    "Comprime l'elemento e lo nasconde fuori dallo schermo — come `display: none` ma con più stile",
    # 5 block vs inline
    "Gli elementi block vengono caricati in modo sincrono, quelli inline in modo asincrono per non bloccare il rendering",
    # 6 color del testo
    "font-color — la proprietà più cercata su Google da ogni sviluppatore il primo giorno di lavoro",
    # 7 background-color
    "fill — la proprietà SVG che in HTML5 si può usare anche sugli elementi standard per sostituire background-color",
    # 8 padding
    "Lo spazio emotivo che un elemento richiede per sentirsi al sicuro dal proprio bordo",
    # 9 em
    "rem — è relativa alla dimensione del font dell'elemento corrente, identica a em ma con un nome più moderno e raffinato",
]

# flex.json — nessuna risposta umoristica → 4ª risposta UMORISTICA
flex_new = [
    # 0 display: flex
    "Attiva una modalità responsiva che ridimensiona automaticamente gli elementi in base alla risoluzione dello schermo",
    # 1 valore default flex-direction
    "column-reverse — gli elementi si dispongono dal basso verso l'alto, come una pila di pancakes capovolta",
    # 2 justify-content per asse principale
    "center-content — la shorthand CSS4 che sostituisce justify-content e align-items con un'unica dichiarazione",
    # 3 flex-wrap
    "flex-flow: wrap — è la forma contratta che specifica sia la direzione che il comportamento di avvolgimento",
    # 4 flex: 1
    "flex-grow: 0; flex-shrink: 1; flex-basis: auto — l'elemento mantiene la sua dimensione naturale e non cresce mai",
    # 5 align-content vs align-items
    "align-content funziona su tutti i browser moderni, align-items solo su Chrome e Firefox dalla versione 80 in poi",
    # 6 order
    "flex-rank — la proprietà rinominata in Flexbox Level 2; `order` è il vecchio nome deprecato nel 2020",
    # 7 centrare in flex
    "place-content: center — la shorthand moderna che fa il lavoro di entrambe con un singolo valore",
    # 8 flex-basis: 200px
    "La dimensione massima che l'elemento può raggiungere dopo che flex-grow ha distribuito lo spazio disponibile",
    # 9 space-evenly
    "space-equal — il valore che sostituisce space-evenly in CSS4 con una distribuzione ancora più uniforme e approvata dal W3C",
]

# flexbox-basics.json — nessuna risposta umoristica → 4ª risposta UMORISTICA
flexbox_basics_new = [
    # 0 display: flex si applica al
    "A ogni elemento della pagina tramite `* { display: flex }` — la tecnica segreta dei professionisti per layout globali",
    # 1 flex-item
    "Tutti i discendenti del flex container, compresi nipoti e pronipoti — la grande famiglia allargata di Flexbox",
    # 2 Main Axis
    "L'asse che il browser usa internamente per calcolare la larghezza della scrollbar",
    # 3 flex-direction: column e Main Axis
    "Il Main Axis rimane invariato — è il Cross Axis a cambiare orientamento quando si imposta flex-direction: column",
    # 4 align-items per Cross Axis
    "flex-align — la proprietà rinominata in Flexbox Level 2; align-items è la versione legacy ancora supportata",
    # 5 default flex-wrap
    "wrap — gli elementi vanno a capo per default perché Flexbox nasce come sistema di layout adattivo",
    # 6 space-between
    "Distribuisce lo spazio solo attorno al primo e all'ultimo elemento, lasciando quelli centrali senza spazio aggiuntivo",
    # 7 stretch
    "fill — il valore che estende gli elementi su entrambi gli assi contemporaneamente, main e cross",
    # 8 anno Flexbox
    "2009 — l'anno in cui il W3C ha pubblicato la prima bozza stabile, usata in produzione fin da subito senza modifiche",
    # 9 flex-direction: column + justify-content: flex-end
    "Allinea gli elementi in cima al contenitore — flex-end indica la fine del Cross Axis, non del Main Axis",
    # 10 align-items: baseline
    "Centra gli elementi verticalmente rispetto al loro punto di ancoraggio CSS, indipendentemente dal font",
    # 11 % supporto browser Flexbox
    "42% — il 58% dei browser ancora in uso non supporta Flexbox perché Internet Explorer 8 è ancora predominante nelle aziende",
]

# git.json — nessuna risposta umoristica → 4ª risposta UMORISTICA
git_new = [
    # 0 Cos'è Git
    "Un servizio cloud sviluppato da Linus Torvalds che salva automaticamente il codice ogni 5 minuti, come iCloud ma per i programmatori",
    # 1 staging area
    "La sezione di GitHub dove vengono pubblicati i branch prima di essere uniti al main tramite pull request",
    # 2 commit
    "Un'email automatica inviata agli altri sviluppatori con la lista delle modifiche apportate al codice",
    # 3 Git vs GitHub
    "GitHub è la versione con interfaccia grafica di Git — il codice sorgente è lo stesso, cambia solo il modo di interagirci",
    # 4 git init
    "Collega la cartella locale al repository remoto su GitHub e scarica l'intera cronologia del progetto",
    # 5 git add
    "git track — il comando moderno introdotto in Git 2.35 che sostituisce git add con una sintassi più intuitiva",
    # 6 git commit
    "Invia le modifiche direttamente al repository remoto senza dover eseguire git push come secondo passaggio",
    # 7 git push
    "Scarica le modifiche dal repository remoto e le unisce automaticamente al branch corrente",
    # 8 git pull
    "Crea un nuovo branch locale che traccia il branch remoto e scarica le ultime modifiche in una sola operazione",
    # 9 git revert vs git reset
    "Reset crea un nuovo commit di annullamento lasciando intatta la cronologia; Revert rimuove definitivamente i commit dalla storia locale",
]

# html.json — HA risposte umoristiche → 4ª risposta PLAUSIBILE MA ERRATA
html_new = [
    # 0 cos'è HTML e perché non è un linguaggio di programmazione
    "HTML è un linguaggio derivato da XML sviluppato dal W3C nel 1995. Non è considerato un linguaggio di programmazione perché manca di un sistema di tipi: senza tipi non si può scrivere codice eseguibile in senso stretto.",
    # 1 ruolo del browser
    "Il browser compila HTML e CSS in bytecode ottimizzato tramite un JIT compiler simile a V8, poi mostra la pagina. JavaScript viene pre-compilato lato server e inviato già in formato binario.",
    # 2 struttura minima HTML
    "Un documento HTML minimo richiede solo `<!DOCTYPE html>` e `<body>`. Il browser aggiunge automaticamente i tag `<html>` e `<head>` mancanti secondo le specifiche di recupero errori HTML5.",
    # 3 block-level vs inline
    "I tag block-level come `<span>` e `<a>` creano un contesto di formattazione indipendente. I tag inline come `<div>` e `<p>` si inseriscono nel flusso del testo senza rompere la riga.",
    # 4 tag self-closing
    "I tag self-closing in HTML5 sono quelli che non richiedono il tag di chiusura: `<div>`, `<p>` e `<section>` si chiudono automaticamente quando il parser incontra un altro tag dello stesso tipo.",
    # 5 commenti HTML
    "I commenti HTML si scrivono con `/* testo */` come in CSS, oppure con `<!-- testo -->` per compatibilità con le versioni precedenti di HTML4.",
    # 6 tag comuni testi e liste
    "Per i titoli si usa `<heading level='1'>` fino a `<heading level='6'>`, per i paragrafi `<p>`. Per le liste: `<ul>` con elementi `<item>` per le non ordinate, `<ol>` con `<item>` per le ordinate.",
    # 7 div e span non semantici
    "`<div>` è un elemento parzialmente semantico che descrive una divisione logica del contenuto. `<span>` è non-semantico. La distinzione è che `<div>` ha valore strutturale nel DOM mentre `<span>` serve solo per applicare stili.",
    # 8 tag semantici HTML5
    "I tag semantici HTML5 come `<header>` e `<nav>` applicano automaticamente stili CSS predefiniti dal browser: `<header>` ha `font-weight: bold`, `<nav>` ha `list-style: none` e `<footer>` ha `font-size: smaller`.",
    # 9 attributi HTML
    "Gli attributi possono essere scritti sia nel tag di apertura che di chiusura: nel tag di chiusura hanno priorità sulle proprietà CSS inline, nel tag di apertura vengono letti per primi dal parser.",
    # 10 attributo class
    "L'attributo `class` in JavaScript si accede tramite `getElementsByClass('nomeclasse')` — il metodo standard per selezionare elementi per classe, più performante di `querySelectorAll`.",
    # 11 link con a e href
    "Un link si crea con `<a href='URL'>testo</a>`. La differenza semantica è che `<a>` serve per link verso risorse esterne, mentre `<button>` è preferibile per la navigazione interna nelle SPA con React Router.",
    # 12 tabella HTML
    "Una tabella HTML si costruisce con `<table>`, `<tr>` per le righe, `<th>` per le intestazioni e `<td>` per i dati. Il tag `<tbody>` è facoltativo in HTML5 e va usato solo per applicare stili CSS separati all'area dati.",
]

# intro.json — HA risposte umoristiche → 4ª risposta PLAUSIBILE MA ERRATA
intro_new = [
    # 0 Frontend Developer
    "Uno sviluppatore che gestisce l'intera pipeline dati, dal database alle API REST fino al rendering client-side — il cosiddetto full-stack developer",
    # 1 Backend Developer
    "Uno sviluppatore che si occupa dell'ottimizzazione delle performance, monitorando i Core Web Vitals e riducendo i tempi di caricamento delle pagine",
    # 2 server
    "Un dispositivo di rete che smista i pacchetti di dati tra i client connessi, come un router avanzato con più memoria RAM e storage",
    # 3 il tuo PC può essere un server
    "Sì, ma solo se ha installato un sistema operativo server (come Windows Server o Ubuntu Server) invece di uno desktop consumer",
    # 4 cloud
    "Una rete di server distribuiti geograficamente che memorizza copie dei file statici (immagini, CSS, JS) vicino agli utenti per ridurre la latenza — la cosiddetta CDN",
    # 5 indirizzo IP
    "Un codice di identificazione alfanumerico assegnato dal registro ICANN a ogni sito web per certificarne la proprietà e l'autenticità",
    # 6 server DNS
    "Un server che verifica l'autenticità dei certificati SSL di un sito e blocca la navigazione se il certificato è scaduto o non valido",
    # 7 VPN
    "Cifra il traffico con crittografia asimmetrica, rendendo illeggibili i pacchetti anche se intercettati, senza però cambiare il tuo indirizzo IP visibile",
]

# js-map-filter.json — nessuna risposta umoristica → 4ª risposta UMORISTICA
js_map_filter_new = [
    # 0 Array.prototype.map
    "Un metodo che ordina gli elementi dell'array secondo un criterio numerico definito dalla callback — come sort ma con la funzione obbligatoria",
    # 1 .filter() restituisce
    "Il numero di elementi che soddisfano la condizione — perfetto per fare conteggi senza scrivere un ciclo for",
    # 2 [1,2,3].map(x => x*2)
    "`[2, 4, 6]` ma l'array originale viene modificato in modo silenzioso — entrambi i riferimenti puntano allo stesso risultato",
    # 3 map e filter mutano l'originale
    "Sì, entrambi modificano l'array originale — è per questo che React chiede sempre di passare una copia con lo spread operator",
    # 4 [1,2,3,4,5].filter(n => n>3)
    "`[3, 4, 5]` — il filtro include anche il valore limite perché `>` in JavaScript usa confronto inclusivo per i numeri interi",
    # 5 argomenti callback map
    "Solo l'elemento corrente — indice e array originale sono accessibili solo con la sintassi `map(function(el, i, arr){})`",
    # 6 estrarre array di nomi
    "`users.forEach(u => u.name)` — forEach è il metodo specifico di JavaScript per estrarre proprietà e costruire array derivati",
    # 7 raddoppiare solo i pari
    "`[1,2,3,4].map(n => n % 2 === 0 ? n * 2 : n)` — più efficiente perché filtra e trasforma in un solo passaggio senza array intermedi",
    # 8 callback senza return esplicito
    "Il nuovo array avrà la stessa lunghezza dell'originale, con `null` al posto degli elementi la cui callback non ha restituito nulla",
    # 9 .filter(Boolean) vs .filter(x => x !== null)
    "`.filter(Boolean)` è leggermente più lento perché istanzia un oggetto Boolean wrapper per ogni elemento dell'array",
]

# react-router.json — HA risposte umoristiche → 4ª risposta PLAUSIBILE MA ERRATA
react_router_new = [
    # 0 limiti useState per navigazione
    "Non supporta la navigazione verso URL esterni al dominio e non può gestire parametri di query string come `?page=2`",
    # 1 BrowserRouter
    "Aggiunge automaticamente un service worker per il caching offline delle route già visitate, abilitando la PWA senza configurazione",
    # 2 comportamento Routes
    "Confronta l'URL con tutte le Route figlie e renderizza quelle il cui `path` corrisponde per lunghezza massima, non solo la prima",
    # 3 path='*' e posizione
    "Corrisponde solo alle route annidate non abbinate; va messo come prima Route per garantire che il catch-all non interferisca con le rotte principali",
    # 4 Link vs NavLink
    "`NavLink` aggiorna l'URL senza ricaricare la pagina solo per i link interni; `Link` esegue una navigazione tradizionale con ricarica della pagina",
    # 5 prop end su NavLink
    "Limita la lunghezza massima del path a cui NavLink applica la classe `active`, troncando eventuali segmenti dinamici aggiuntivi",
    # 6 Route con path ma senza element
    "React Router renderizza un `<Fragment>` vuoto e registra il prefisso nell'History API per il deep-linking",
    # 7 path finale Route figlia
    "`/contacts` — in React Router, i path delle Route figlie sono assoluti: non vengono concatenati al path del padre",
    # 8 Outlet
    "Un componente che renderizza in parallelo tutte le Route figlie, in ordine decrescente di specificità del path",
    # 9 Route con element ma senza path
    "È una route privata: corrisponde all'URL corrente solo se l'utente è autenticato, altrimenti redirige automaticamente al login",
    # 10 404 dentro o fuori layout
    "Fuori dalla layout route come Route fratello, così ha priorità assoluta e non rischia di essere oscurata da altre Route più specifiche",
    # 11 prop index
    "`index` indica che la rotta ha priorità massima: sovrascrive qualsiasi altra Route figlia con lo stesso prefisso del padre",
    # 12 segmento dinamico nel path
    "`path=\"users/{userId}\"` — la sintassi con le parentesi graffe è lo standard adottato da React Router dalla versione 6.4+",
    # 13 useParams
    "`useSearchParams()` — l'hook corretto per leggere i parametri dinamici delle Route definite con `:` nel path",
    # 14 element vs Component su Route
    "Sono esattamente identici in ogni scenario: React Router li gestisce internamente nello stesso modo e la scelta è puramente stilistica",
    # 15 useNavigate
    "Restituisce l'oggetto `history` nativo della HTML5 History API, con i metodi `push`, `replace` e `go` disponibili direttamente",
    # 16 useLocation
    "Restituisce solo il `pathname` corrente come stringa — per accedere a hash e query string servono hook dedicati come `useHash`",
    # 17 nome pacchetto React Router v7
    "`react-router-dom` rimane il pacchetto principale nella v7; `react-router` è diventato un pacchetto interno non destinato all'uso diretto",
]

# react-useeffect.json — HA risposte umoristiche → 4ª risposta PLAUSIBILE MA ERRATA
react_useeffect_new = [
    # 0 cos'è useEffect
    "Un hook che aggiorna lo stato del componente in modo asincrono, come `setState` ma con supporto nativo per le Promise",
    # 1 array [] quando esegue
    "La setup function si esegue ad ogni render perché `[]` è un nuovo array ad ogni chiamata — React confronta i riferimenti, non i contenuti",
    # 2 array [roomId] quando riesegue
    "L'effetto si riesegue ad ogni render del componente, ma la cleanup viene saltata se il valore di `roomId` non è effettivamente cambiato",
    # 3 useEffect senza array dipendenze
    "L'effetto si esegue solo al mount, come con `[]` — React rileva automaticamente gli effetti privi di dipendenze esterne",
    # 4 cleanup function quando si esegue
    "Solo prima di ogni nuovo setup quando le dipendenze cambiano — non viene mai eseguita all'unmount del componente",
    # 5 cleanup con valori vecchi o nuovi
    "La cleanup usa i valori nuovi — quelli disponibili nel setup successivo — per garantire coerenza tra le due fasi",
    # 6 ordine cleanup e setup
    "Entrambi si eseguono in modo asincrono e React non garantisce un ordine preciso — dipende dal carico del thread principale",
    # 7 side effect in React
    "Un errore causato da uno stato che viene modificato direttamente durante la fase di render, fuori da un `useEffect`",
    # 8 PageTitle cleanup ripristina document.title
    "Per ottimizzare le performance: il browser accumula i cambiamenti al titolo in un buffer interno che va svuotato periodicamente",
    # 9 memory leak in useEffect
    "Quando due `useEffect` nello stesso componente accedono alla stessa variabile di stato causando aggiornamenti sovrapposti e race condition",
    # 10 useEffect vs useLayoutEffect timing
    "`useLayoutEffect` si esegue prima del mount del componente; `useEffect` si esegue dopo il mount ma prima del primo paint del browser",
    # 11 fetch nel corpo del componente
    "Perché `fetch` è asincrono e React non supporta `async/await` direttamente nelle funzioni dei componenti funzionali",
    # 12 Dialog primo click
    "React esegue la setup function durante la fase di Render, prima ancora che il componente sia aggiunto al DOM",
    # 13 DialogWithDeps roomId cambia console
    "Prima `\"🔌 setup: connect room travel\"`, poi `\"❌ cleanup: disconnect room general\"` — React ottimizza eseguendo il setup prima per ridurre il downtime",
    # 14 tre fasi React e useEffect
    "Durante la fase di **Commit**, contemporaneamente a `useLayoutEffect` ma in un microtask separato con priorità più bassa",
    # 15 React 18 eventi discreti
    "React 18 esegue `useEffect` in modo sincrono per tutti gli eventi utente, non solo per quelli discreti, eliminando la latenza percepita",
]

# react-usestate.json — nessuna risposta umoristica → 4ª risposta UMORISTICA
react_usestate_new = [
    # 0 cos'è useState
    "Un modo per condividere lo stato tra più componenti senza dover usare Context API o Redux",
    # 1 quando viene aggiornata la variabile di stato
    "Immediatamente e in modo sincrono, come una normale assegnazione di variabile — React ottimizza il re-render separatamente con il batching",
    # 2 cosa provoca l'aggiornamento di stato
    "Il salvataggio automatico del valore nel localStorage, così viene recuperato al prossimo caricamento della pagina",
    # 3 cos'è un re-render
    "La ricreazione completa del componente da zero, con reinizializzazione di tutti gli hook come se fosse il primo mount",
    # 4 push vs spread operator
    "Non c'è differenza: entrambi producono lo stesso array in memoria — JavaScript gestisce internamente la copia degli elementi",
    # 5 obj.speed = 10 vs spread
    "Entrambi creano un nuovo oggetto — `{ ...obj, speed: 10 }` è più verboso ma non ha nessun vantaggio pratico rispetto alla mutazione diretta",
    # 6 aggiorna correttamente variabile di stato
    "`count++` — l'operatore di incremento è il modo più conciso per aggiornare uno stato numerico in React",
    # 7 aggiungere squirtle
    "`setPokemon(pokemon.concat('squirtle'))` — concat è il metodo standard consigliato da React per aggiungere elementi agli array di stato",
    # 8 aggiornare solo level a 2
    "`setPlayer(Object.assign(player, { level: 2 }))` — Object.assign aggiorna la singola proprietà mantenendo il riferimento all'oggetto originale",
    # 9 setCount tre volte di fila
    "Lo stato viene incrementato di 3 — React ha ottimizzato i setter per rilevare automaticamente le chiamate consecutive nella stessa funzione",
]

# ---------------------------------------------------------------------------
# Esecuzione
# ---------------------------------------------------------------------------
if __name__ == '__main__':
    files = [
        ('css.json',              css_new,                100),
        ('flex.json',             flex_new,               200),
        ('flexbox-basics.json',   flexbox_basics_new,     300),
        ('git.json',              git_new,                400),
        ('html.json',             html_new,               500),
        ('intro.json',            intro_new,              600),
        ('js-map-filter.json',    js_map_filter_new,      700),
        ('react-router.json',     react_router_new,       800),
        ('react-useeffect.json',  react_useeffect_new,    900),
        ('react-usestate.json',   react_usestate_new,     1000),
    ]

    for filename, new_answers, seed in files:
        process_file(filename, new_answers, seed)

    print('\nDone! Tutti i file aggiornati.')
