---
title: Manifest
permalink: /docs/create-skills/manifest/
---

Hier wird der Aufbau der ``manifest.json`` beschrieben.  
Diesen habe ich in stark vereinfachter Form von Home Assistant übernommen.  
Welche Angaben müssen vorhanden sein?  
Wie kann ich Optionen definieren und welche Typen stehen dafür bereit?  

## Beispiel
Ich werde die einzelnen Angaben an folgendem Beispiel aus dem [GetWeather](https://github.com/fwehn/pp-voiceassistant/tree/main/src/server/skills/GetWeather) Skill erklären:   

````json
{
  "version": "1.0",
  "dependencies": {
    "axios": "^0.23.0"
  },
  "options": [
    {
      "name": "APIKey",
      "type": "String",
      "default": "Enter your API-Key here, please."
    },
    {
      "name": "city",
      "type": "Number",
      "default": 51789
    },
    {
      "name": "country",
      "type": "String",
      "default": "DE"
    },
    {
      "name": "language",
      "type": "String",
      "default": "de"
    },
    {
      "name": "units",
      "type": "String",
      "default": "metric",
      "choices": ["standard","metric", "imperial"]
    }
  ]
}
````
*[skills/GetWeather](https://github.com/fwehn/pp-voiceassistant/blob/main/src/server/skills/GetWeather/1.0/manifest.json)*

## Version
Unter dem Punkt ``version`` steht ganz einfach der Tag der jeweiligen Version des Skills.  
Dieser Tag sollte mit dem Verzeichnis der jeweiligen Version übereinstimmen.   

## Abhängigkeiten
Unter ``dependencies`` stehen alle vom Skill benötigten Abhängigkeiten.   
Dabei handelt es sich bei diesen Abhängigkeiten um [npm-Dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies).  
Beim Herunterladen eines Skills, werden dann alle angegebenen Pakete automatisch installiert, sodass der Skill reibungslos funktioniert.  
Einige dieser Pakete werden jedoch vom Skillmanager benötigt und können daher zwar genutzt, jedoch nicht überschrieben werden.  
Welche das sind, kann man in der [``defaults.json``](https://github.com/fwehn/pp-voiceassistant/blob/main/src/client/defaults.json) unter dem Punkt ``dependencies`` nachschauen.

## Optionen
Damit man den eigenen Skill auf die Bedürfnisse der jeweiligen Nutzerinnen und Nutzer anpassen kann, gibt es die Optionen.  
Diese können unter dem Punkt ``options`` definieren.  
Später können diese Optionen dann über das [Webinterface](./../client/webinterface.md#details) angepasst werden.  
In obigem Beispiel kann man dann zum Beispiel einen eigenen API-Key oder den eigenen Wohnort angeben.  
  
Um eine Option zu definieren, muss man drei Felder definieren:  
- ``name``: Der Name, der im Webinterface steht und unter dem man im Code die Option auslesen kann.
- ``type``: Das bestimmt den Typen der Option, z.B. ``String`` oder ``Number``.  
- ``default``: Beschreibt den Standardwert, welcher durch den Entwickler vorgegeben werden kann.
- ``choices``: Damit soll es möglich sein, aus gegebenen Werten auswählen zu können. Das ist allerdings noch nicht implementiert.