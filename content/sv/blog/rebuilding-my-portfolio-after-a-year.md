---
title: "Att bygga om min portfolio efter ett års försummelse"
description: "Den specifika och lite pinsamma historien om vad som händer när man låter ett år gå mellan commits i sin egen portfolio."
date: 2026-05-01
translationKey: "rebuilding-my-portfolio-after-a-year"
machineTranslated: true
---

Jag har det här repot öppet just nu, och den sista committen före årets arbete är från maj 2025. Meddelandet lyder "ClientOnly behaving weirdly with icons". Det var slutet på en endagsrusch där jag flyttade sajten till Nuxt, stötte på en ikonbugg, committade och sedan inte öppnade repot igen på elva månader.

Det här är inget produktivitetsinlägg. Jag tänker inte berätta om mitt system för att hålla sidoprojekt vid liv. Jag har inget. Vad jag har är en portfolio som fortsatte säga "Just nu på Kognity" flera månader efter att jag hade gått vidare, en `console.log("app.vue:", colorMode)` som gick ut i produktion och en primär accentfärg som bokstavligen var `#ff0000`.

Inget designval. Rent rött, liggande i appkonfigurationen utan något runt omkring som antydde att jag någonsin tänkt komma tillbaka. Jag antar att dåtidens jag trodde att jag skulle komma ihåg. Det gjorde jag inte.

## Hur det såg ut när jag kom tillbaka

Det första jag märkte när jag äntligen satte mig med det här i april: en kodbas som mestadels var okej men full av små pinsamheter. Det röda. `console.log`-anropet. En `README2.md` (innehåll: Nuxts boilerplate-dokumentation, kopierad från startmallen och uppenbarligen aldrig öppnad igen). En `deploy.bat`-fil på en Mac som deployar till Linux. En footer-komponent som inte importerades någonstans och inte gjorde någonting. Tio öppna Dependabot-PR:er som jag markerat som godkända och sedan aldrig mergat.

Instinkten när man ser sådant här i sin egen kod är att må dåligt över det. Jag har till stor del lärt mig att se det som sedimenterade spår av tidigare prioriteringar. Koden fungerade tillräckligt bra för att hålla sajten uppe; att fixa den var aldrig brådskande nog för att faktiskt bli av.

Vad jag däremot kände: om det här hade varit någon annans repo och jag gjort en kodgranskning hade jag haft många kommentarer.

## Det praktiska arbetet

Jag migrerade från Yarn 1 till pnpm (Yarn 1 har inte underhållits på flera år; jag hade länge tänkt göra det här i mina privata projekt), löste alla Dependabot-PR:er i ett svep och tog bort de döda filerna. Lade till ESLint och Prettier eftersom det av någon anledning inte fanns någon linter alls. Inte spännande. Nödvändigt.

Den mer intressanta delen: att lyfta ut hårdkodat innehåll ur Vue-komponenterna. Min arbetshistorik låg i en `.vue`-fil. Att lägga till ett nytt jobb innebar att redigera komponentmarkup. Att uppdatera den kändes som mer friktion än det var värt, vilket är exakt varför det fortfarande stod Kognity när jag kom tillbaka.

Flyttade allt till typade datafiler: `work-experiences.ts`, `skills.ts`, `projects.ts`. Komponenterna är nu rent presentationella. Att uppdatera innehållet är bara att uppdatera en array; det finns ingen anledning att röra en komponent.

Jag tog också bort procentstaplarna för kompetenser. "TypeScript: 90 %". Jag avskyr dem. Siffrorna är påhittade och bjuder in till två sorters misslyckande: antingen tar man i underkant och ser ut att gardera sig, eller så tar man i överkant och bjuder in någon att förhöra en på exakt den nivå man påstått. Ersatte dem med kategoriserade chips: Språk, Front-end, Back-end och så vidare. Ärligare, svårare att spela på.

## Den i18n jag underskattade

Sajten finns nu på engelska, portugisiska och svenska. Jag bor i Sverige, växte upp i Brasilien och jobbar på engelska. Det kändes rimligt att täcka alla tre.

Att sätta upp `@nuxtjs/i18n` var inte det svåra. Det svåra var att skriva själva översättningarna. Närmare bestämt att skriva min yrkeserfarenhet på svenska på ett sätt som inte uppenbart låter som att den körts genom en översättare.

Min svenska är funktionell: jag klarar de flesta samtal, även jobbsamtal när de dyker upp. Men formellt register är något annat än samtalsregister. Jag lade mer tid på den svenska yrkesbion än på allt annat tillsammans. Den är fortfarande inte perfekt.

Portugisiskan var lättare (såklart) men hade sina egna gränsfall. "Tech Lead" i brasiliansk mjukvaruvärld är oftast bara "Tech Lead" som lånord, men "Senior Front-End Engineer" blir "Engenheiro Front-End Sênior" och det finns verkliga åsikter i communityt om huruvida det översättningslånet är korrekt. Jag har åsikter. Jag gjorde val. Någon brasiliansk utvecklare kommer att läsa detta och ha en synpunkt.

## Vad som inte kom med

Jag övervägde en projektsektion som automatiskt hämtade GitHub-aktivitet. Bestämde mig emot det: automatiskt hämtad data är lättja och de resulterande listorna är brus. Projektsidan har nu ett kurerat urval: [Overseer](https://github.com/arthurvasconcelos/overseer), Go-CLI:n jag använder varje dag för de tråkiga delarna av mitt arbetsflöde (morgonbriefingar, standup-anteckningar, git-identiteter, repostatus), dess Python- och TypeScript-SDK:er, biblioteket sqlalchemy-seedling som jag byggde för ett seedingflöde jag upprepade i projekt efter projekt, och en legacy-sektion för de två Vue-komponentbibliotek jag publicerade 2018 och som fortfarande har några användare.

Jag övervägde också en större visuell omdesign. Lät det vara i stort sett som det var. Den mörka gradientbakgrunden fungerar bra. Allt behöver inte tänkas om.

## Varför jag skriver det här

Jag vill ha en blogg. Inte en tutorial-blogg, det finns bättre tutorials än jag skulle skriva om nästan vilket ämne som helst. Snarare något som detta: specifika redogörelser för vad jag faktiskt bygger, vad som gick fel, vilka beslut jag skulle ompröva.

Ombyggnaden av sajten var den naturliga startpunkten. Den är meta på ett sätt jag kan leva med, eftersom det också genuint är det jag har jobbat med, och att skriva ner besluten tvingar mig att faktiskt ha åsikter om dem i stället för att bara göra saker.

Fler inlägg är på väg. Jag har anteckningar om bygget av Overseer, några tankar om de TypeScript-mönster jag använder på Platform24 som skiljer sig från vad jag ser i de flesta Vue- och React-kodbaser, och förmodligen en del om Stockholm som inte har något med kod att göra.

Bloggen är live. Det är en tillräckligt bra plats att börja på.
