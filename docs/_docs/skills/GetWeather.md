---
title: GetWeather
permalink: /docs/skills/GetWeather/
---

Mit diesem Skill lassen sich Wetterdaten von [OpenWeather](https://openweathermap.org/) erfragen.  
Dazu habe ich die [Optionen](./../create-skill/manifest.md#optionen) implementiert, um Skills zu personalisieren.  
Außerdem benutzt dieser Skill als einziger eine Dependency (``axios``).  
Daher habe ich für mein System ein simples Dependency-Management-System erstellt, dass alle dependencies, die in der jeweiligen [Manifest-Datei](./../create-skill/manifest.md#abhngigkeiten) definiert wurden, installiert und auch wieder löscht, sollte der Skill deinstalliert werden.  

## Intents

``... <launch> [den] [Wetterdienst] wie ist das Wetter aktuell``

``... <launch> [den] [Wetterdienst] wie wird das Wetter in 3 Tagen``

``... <launch> [den] [Wetterdienst] wie wird das Wetter am Donnerstag``

## Slots



