---
title: Googles regnbågskant som följer markören
description: Hur "AI Mode"-knappen på google.com målar en regnbåge längs sin kant som följer din markör — och varför färgerna ändras beroende på åt vilket håll du rör dig.
date: 2026-08-12
tags: ["css", "conic-gradient", "mask", "reverse-engineering"]
translationKey: google-ai-mode-rainbow-rim
machineTranslated: true
---

"AI Mode"-knappen på google.com gör något riktigt fint vid hover: en skiva
regnbåge tänds längs kanten och glider med din markör. Svep från vänster till
höger och den går grön → turkos → blå. Svep tillbaka och den går röd → orange →
gul → grön. Samma knapp, samma gradient, olika färger.

Jag plockade isär CSS:en för att ta reda på hur. Det visade sig vara fem idéer
staplade på varandra, och bara en av dem är ett riktigt trick.

::lab-demo{title="AI Mode-knappen" caption="Hovra och svep över den — byt sedan riktning."}
:ai-mode-button
::

## 1. Det är ingen kant

Den första överraskningen: ingenting här ritar en kant. Glödlagret fyller
**hela** pillret, och sedan målas ett ogenomskinligt inre piller — indraget
exakt en pixel — ovanpå.

```css
.glow    { position: absolute; inset: 0; }      /* rainbow fills the pill */
.surface { position: absolute; inset: 1px;      /* covers all but the rim */
           background: #303134;
           border-radius: 100px; }
```

Bara den pixel som det inre pillret inte täcker överlever, och den läses som en
glödande kant. Vid hover lägger Google till `filter: blur(2px)` på den inre
ytan, vilket mjukar upp dess kant och låter ramen blöda inåt en aning.

Ingen ringmatematik med `mask-composite`, ingen `border-image`, inget
SVG-streck. Bara ocklusion.

## 2. En regnbåge, målad en gång, bara roterad

Färgerna kommer från ett enda cirkulärt element med en `conic-gradient`. Det
färgas aldrig om vid körning — det enda som någonsin ändras är dess `rotate`:

```css
.wheel {
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  rotate: var(--wheel);
  background: conic-gradient(
    #3186ff 34%, #9378ff 37%, #f96bd6 39%, #fc413d 41%, #fc413d 48%,
    #ff6b2b 50%, #fec700 52%, #ffdb0f 56%, #88de42 58%, #0ebc5f 61%,
    #0ebc5f 65%, #2eaab2 70%, #00a9bb 72%, #3186ff 73%, #3186ff 100%);
}
```

Lägg märke till att den intressanta delen bara upptar 34–73 % av varvet — 140°
av 360°. Allt utanför det är platt `#3186ff`: en enda 220° blå båge som spänner
över skarven vid 0°/360°. Den utfyllnaden spelar roll längre fram.

## 3. En konisk gradient som mask skär ut kometen

Hjulets förälder maskar ner det till en enda båge, med hjälp av ytterligare två
koniska gradienter kombinerade med `mask-composite: intersect`:

```css
.window {
  mask-image:
    conic-gradient(from var(--window), transparent 0, transparent 50%,
                   black 68%, black 75%, transparent 89%),
    conic-gradient(from var(--window), black 30%, transparent 50%, black 70%);
  mask-composite: intersect;
}
```

Räkna om stoppen till grader och snittet är inte den snäva båge det ser ut som.
`intersect` komponerar lagren med Porter-Duff `source-in`, så där båda
gradienterna rampar **multipliceras** deras alfavärden. Det lämnar en lång,
kvadratiskt mjuk svans: alfa lämnar noll vid **180°**, stiger långsamt till en
början — produkten av två stigande ramper — når fullt vid **252°**, håller en
platå till **270°** och faller sedan bort vid **320°**. Det är en komet som är
**140° bred** — 39 % av ett varv — till största delen mycket svag svans.
Det skarpa kärnlagret använder en snävare första mask (`transparent 62%, black
82%`), så den börjar vid **223°** och toppar vid **295°**, långt förbi glödens
platå.

Jag fick det här fel i första försöket — jag läste bara platån, kallade
fönstret 68° brett och kunde sedan inte förklara varför ena riktningen visar
sex färger. Rampen är hela förklaringen.

Så hela effekten kokar ner till två vinklar:

- `--window` — var kometen är
- `--wheel` — vilka färger som ligger under den

## 4. Det riktiga tricket: `scale: 7 1.5`

Här kommer delen jag inte väntade mig. Ett koniskt svep är cirkulärt. En knapp
är ett brett, platt piller. Att rotera en konisk gradient inuti ett piller skulle
normalt skicka highlighten runt en snäv ellips, inte glidande längs den långa
överkanten.

Google löser det genom att skala det maskade elementet olikformigt:

```css
.window { scale: 7 1.5; }
```

Att sträcka x med 7 trycker ihop vinkelrummet. Räkna på ett 220 × 44-piller:
pillrets övre högra hörn ligger vid de oskalade koordinaterna
`(110 / 7, −22 / 1.5)` ≈ `(15.7, −14.7)`, vilket bara är **47° från
vertikalen**. Pillrets hela överkant spänner över ungefär ±47° — så en rotation
på klart under ett kvarts varv för highlighten från ena änden till den andra,
och bågen följer kanten i stället för att se ut som en tårtbit.

Det gör också markörmappningen enkel: ta bort skalningen och ta vinkeln.

```js
const angle = Math.atan2(px / scaleX, -py / scaleY) * 180 / Math.PI;
const window = angle - 286;   // 286° sits between the bloom plateau (252–270°)
                              // and the core peak (295°)
```

## 5. Två kopior för glöden

Hela stacken renderas två gånger inuti pillret: en gång med `filter: blur(5px)`
och ett brett maskfönster, en gång med `filter: blur(1px)` och ett snävare. Den
första är glorian, den andra den ljusa kärnan. Tillsammans ger de effekten dess
djup — en skarp glödtråd inuti en mjuk glöd.

## Varför färgerna beror på riktningen

Det här var delen som tog längst tid att reda ut, och mitt första svar var fel.

Min första gissning var att hjulet *släpar efter* fönstret — en fjäder, där
resten byter tecken beroende på rörelseriktning. Det ger en riktningsberoende
ton, men den är hastighetsberoende: färgerna driver medan du rör dig och lägger
sig tillbaka när du saktar ner. På den riktiga knappen gör de inte det. Svep
långsamt eller snabbt, paletten för en given riktning är klippfast.

Vilket betyder att hjulet inte släpar. Det är **låst** till fönstret:

```js
wheel = window + offset;                       // both rotate together
offset = direction > 0 ? 0 : 45;               // the only thing direction changes
```

Eftersom de två roterar som en enhet driver regnbågsskivan under kometen aldrig
medan du sveper.

Sätt nu ihop offseten med den där 140°-kometen. Den är exakt lika bred som
färgbandet — båda spänner över 39 % av ett varv — men det betyder **inte** att
varje riktning ser hela bandet, eftersom de två fönstren sitter på olika
ställen. Kör maskens alfa över Googles stopp och asymmetrin är slående:

| stopp | band° | → (offset 0°) | ← (offset 45°) |
| --- | --- | --- | --- |
| blå | 122° | — | — |
| violett | 133° | — | — |
| rosa | 140° | — | .01 |
| röd | 148° | — | .03 |
| röd | 173° | — | .31 |
| orange | 180° | — | .43 |
| bärnsten | 187° | .01 | .58 |
| gul | 202° | .10 | .93 |
| lime | 209° | .18 | **1.00** |
| grön | 220° | .34 | **1.00** |
| grön | 234° | .63 | .82 |
| turkos | 252° | **1.00** | .46 |
| cyan | 259° | **1.00** | .32 |
| blå | 263° | **1.00** | .25 |

Vid rörelse åt höger täcker fönstret bandgraderna 180°–263° — bara **59 %** av
bandet. Allt före orange — blå, violett, rosa, röd — ligger utanför och är inte
nedtonat utan frånvarande. Vid rörelse åt vänster täcker fönstret 135°–263°,
eller **91 %**, och allt från rosa och framåt fångar åtminstone lite ljus.

Det är därför rörelse åt höger läses som knappt synlig gul in i grön in i en
ljus turkos-och-blå spets, medan rörelse åt vänster läses som en hel regnbåge
som toppar på gulgrön. Det är samma band båda gångerna, belyst olika. Byt
riktning och offseten glider från det ena värdet till det andra, i en
övertoning snarare än ett hopp.

Det finns ett andra skäl till att svepet åt höger slutar så blått. Det skarpa
kärnlagret toppar vid 295°, och med offset 0° landar det på bandgrad 295° —
förbi bandets slut vid 263°, ute i den platta blå utfyllnaden. Så vid rörelse
åt höger är den skarpa glödtråden rent `#3186ff` och bara den mjukare glöden
bakom den bär färg. Vid rörelse åt vänster landar samma topp på 250°, mitt på
turkosen.

En konsekvens värd att notera om du bygger en sådan här: de två fönstren
överlappar med 95° av sina 140° bredd, ungefär två tredjedelar, så riktningarna
**kan inte** ges oberoende paletter. Det finns ett band, och offsetarna väljer
bara var ljuset faller på det.

Men det är inte samma sak som att sakna kontroll per riktning. Låt "ljus"
betyda alfa ≥ 0,9 och de två zonerna är helt åtskilda — rörelse åt höger tänder
bandgraderna 245°–263°, rörelse åt vänster 200°–230°. Så varje riktnings
dominerande färger är dina att välja oberoende; det är bara de svaga svansarna
som delas. I demon ovan visar pilarna under varje färgruta hur starkt glödens
fönster lyser upp det stoppet i varje riktning, vilket gör "vilka färger visar
den här riktningen?" till något du bara kan läsa av.

Det förklarar också en detalj från tidigare: de två custom properties. Om
offseten vore en enda konstant skulle `--wheel` vara överflödig — du skulle bara
behöva `--window`. Den andra egenskapen finns just för att offseten rör sig. Och
den där 219° bågen av platt blått i gradienten är det som hindrar kometen från
att blinka till med en hård skarv när den vandrar förbi bandets slut — med en
140°-komet finns det alltid någonstans säkert för den att ligga.

## Värt att stjäla

De återanvändbara idéerna här, oberoende av regnbågar:

- **Ocklusion slår ringmatematik.** Ett ogenomskinligt inre element indraget
  _n_ pixlar är en enklare och billigare "glödande kant" än någon maskad ring.
- **Olikformig skalning som koordinattransform.** `scale: 7 1.5` förvandlar ett
  cirkulärt vinkelrum till ett som följer en rektangels kant. Ta bort skalningen
  i JS för att mappa markören tillbaka.
- **Animera rotationer, inte färger.** En statisk gradient plus två vinklar är
  mycket billigare än att bygga om gradienter varje bildruta, och båda vinklarna
  kan registreras som `<angle>` via `@property`, så CSS kan övergångsanimera
  dem.

Öppna panelen "Visa hur det fungerar" i demon ovan — glöden förblir tänd medan
den är öppen — och dra `scale X` ner mot 1: du kan se vinkelrummet vecklas ut och highlighten
falla tillbaka till ett cirkulärt svep. Den enda slidern är hela tricket.
