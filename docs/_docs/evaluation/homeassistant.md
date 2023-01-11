---
title: Home Assistant
permalink: /docs/evaluation/home-assistant/
---

Bei Home Assistant handelt es sich zwar nicht um einen Sprachassistenten, allerdings gibt es auch hier ein modulares System, um neue Funktionen hinzuzufügen.  


## Ordnerstruktur

Bei Home Assistant befinden sich alle Dateien, die zu einer Integration gehören in einem Verzeichnis, welches mit der Domain der Integration benannt ist.  
Die Domain ist in dem Fall ein einzigartiger Name, über den die Integration eindeutig identifizierbar ist.  

````
<Integration-Domain>   
├── manifest.json
└── __init__.py
````

In diesem Verzeichnis müssen lediglich zwei Dateien vorhanden sein:  

- ``manifest.json``: Beschreibt die Integration und gibt einige Abhängigkeiten an.
- ``__init__.py``: Pythoncode, der ausgeführt wird.  

Grundsätzlich wird eine Integration in der Sprache [Python](https://www.python.org/) (.py) geschrieben.


Für jedes Gerät und jeden Service, die man integrieren möchte, muss man eine Platform erstellen, die mit einer sog. "Entity Integration" interagiert.  
Damit wird auf des Home Assistant [Entity-System](#entity-system) zugegriffen.  
Möchte man einen oder mehrere [Services](#service) erstellen, so muss man eine ``services.yaml``-Datei erstellen, die diese Services beschreibt.  
Daher könnte eine Integration wie folgt erweitert werden:  

````
<Integration-Domain>   
├── manifest.json
├── <Dateien für Geräteintegration (.py)>
├── services.yaml
└── __init__.py
````

## Manifest

Wie in der Ordnerstruktur beschrieben, benötigt jede Integration eine Datei mit dem Namen ``manifest.json``.   

````json
{
  "domain": "your_domain_name",
  "name": "Your Integration",
  "documentation": "https://www.example.com",
  "dependencies": [],
  "codeowners": [],
  "requirements": [],
  "iot_class": "cloud_polling"
}
````
*Beispieldatei aus der offiziellen [Dokumentation](https://developers.home-assistant.io/docs/creating_integration_manifest/)*


In dieser Datei befinden sich einige Informationen über die Integration: 
- ``domain``: Eindeutig identifizierbarer Name der Integration und Name des Verzeichnisses.
- ``name``: Anzeigename in HomeAssistant.
- ``documentation``: Link zur Dokumentation der Integration.
- ``dependencies``: Abhängigkeiten von anderen 
- ``codeowners``: GitHub-Usernames oder Teamnamen, der Leute, die die Integration erstellt haben.
- ``requirements``: Python libraries, die von der Integration genutzt werden.
- ``iot_class``: Beschreibt die Art, mit der sich die Integration mit Geräten und Diensten verbindet.

Es gibt noch mehr mögliche Angaben.  
Eine ausführliche Liste gibt es [hier](https://developers.home-assistant.io/docs/creating_integration_manifest/).  

## Entity-System 

Für jedes Gerät, das man mit der eigenen Integration einbinden möchte, verwendet man eine der Entities, die Home Assistant bereitstellt.  
Dabei kann es sich um ein Licht, einen Schalter, eine Kamera oder vieles mehr handeln.  
Dabei stellt Home Assistant eine große Bibliothek an Entities, welche für verschiedenste Smarthome-Anwendungen gedacht sind.  
Diese beschreiben dann zum Beispiel Attribute, die man definieren muss, damit Home Assistant damit arbeiten kann.  
Um eine solche Entity nutzen zu können, muss man jedoch immer auch eine Platform erstellen.  
Mit der Platform gibt man dann an, wie die einzelnen Attribute gesetzt werden.

## Service

Bei einem Service handelt es sich meist um ein Automatisierungsscript.  
Wenn ich also möchte, dass abends meine Rollladen heruntergefahren werden, so kann man das über einen Service realisieren.  
Dazu wird eine Datei mit dem Namen ``services.yaml`` in der eigenen Integration erstellt, welche diese services beschreibt.  
Darüber wird angegeben, welche Namen und Werte für den Nutzer später sichtbar oder veränderbar sind.  
Im Code der Integration wird dann eine Funktion definiert, die als Service registriert wird, welche dann wiederum von Home Assistant aufgerufen wird.  

## Quellen 

[Home Assistant Docs](https://developers.home-assistant.io/docs/development_index)