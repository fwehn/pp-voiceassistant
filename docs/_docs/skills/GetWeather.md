---
title: GetWeather
permalink: /docs/skills/GetWeather/
---

Mit diesem Skill lassen sich Wetterdaten von [OpenWeather](https://openweathermap.org/) erfragen.  
Dazu habe ich die [Optionen](./../create-skill/manifest.md#optionen) implementiert, um Skills zu personalisieren.  
Außerdem benutzt dieser Skill als einziger eine Dependency (``axios``).  
Daher habe ich für mein System ein simples Dependency-Management-System erstellt, dass alle dependencies, die in der jeweiligen [Manifest-Datei](./../create-skill/manifest.md#abhängigkeiten) definiert wurden, installiert und auch wieder löscht, sollte der Skill deinstalliert werden.  

## Intents

Der Skill umfasst drei verschiedene Intents:

``... <launch> [den] [Wetterdienst] wie ist das Wetter aktuell``  
Gibt aktuelle Wetterdaten zurück.  

``... <launch> [den] [Wetterdienst] wie wird das Wetter in 3 Tagen``  
Gibt Wetterdaten in ``X Tagen`` zurück.  

``... <launch> [den] [Wetterdienst] wie wird das Wetter am Donnerstag``  
Gibt Wetterdaten an einem bestimmten Wochentag zurück.  

## Slots

Dieser Skill verwendet lediglich Standard-Slots, die in der [``defaults.json``](https://github.com/fwehn/pp-voiceassistant/blob/main/src/client/defaults.json) definiert sind.

