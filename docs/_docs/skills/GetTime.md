---
title: GetTime
permalink: /docs/skills/GetTime/
---

Dieser Skill diente der Implementierung der [Antwortsätze](./../create-skill/locales.md#answers) und deren [Nutzung](./../create-skill/sdk.md#antwort-generieren).  
So lassen sich Antworten vordefinieren und durch code mit Variablen ergänzen.  

## Intents

Bei diesem Skill gibt es lediglich einen Intent, der zum Beispiel mittels ``... <launch> [GetTime] wie Spät ist es`` oder ``... <launch> [GetTime] wie viel Uhr haben wir`` aufgerufen werden kann.  
Als Antwort kommt dann der Satz "Es ist # Uhr #", bei dem der das erste ``#`` durch die Stunden und das zweite ``#`` durch die Minuten ersetzt werden.  

## Slots

Bei diesem Skill gibt es keine Slots.  