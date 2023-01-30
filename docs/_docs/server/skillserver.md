---
title: Skillserver
permalink: /docs/server/skillserver/
---

Damit es leichter ist, neue Skills zu installieren habe ich eine Server-Anwendung entwickelt, auf die der [Skillmanager](./../client/skillmanager.md) zugreifen kann.  
Diese Anwendung ist komplett optional, da man auch lokal neue Skills installieren kann (zum Beispiel über das [Webinterface](./../client/webinterface.md#upload)).

## Fileserver
Beim Skillserver handelt es sich in erster Linie um einen einfachen Fileserver.  
Mit verschiedenen HTTP-Anfragen kann man Informationen zu den Skills und deren Versionen abfragen und dann den gewünschten Skill als ``.zip``-Datei herunterladen.  
Die ``.zip``-Datei wird dann vom [Skillmanager](./../client/skillmanager.md#online) entpackt und die Dateien an der richtigen Stelle abgelegt.  

## Versionen

Damit man verschiedene Skills herunter- bzw. hochladen kann, habe ich ein recht simples Versionierungssystem entwickelt.  
Dieses besteht aus zwei Komponenten.  
Erstens aus der Art wie und wo die Skills gespeichert werden.  
Zweitens aus einer Datei mit dem Namen ``versions.json``, in der alle aktuellen Skill-Namen und deren Versions-Bezeichnungen gespeichert werden.  

````json
{
  "GetTime": ["1.0"],
  "GetWeather": ["1.0"],
  "HelloWorld": ["3.0","2.0","1.0"],
  "Zigbee2MQTT": ["1.0"]
}
````
*[server/versions.json](https://github.com/fwehn/pp-voiceassistant/blob/main/src/server/versions.json)*

Die Daten aus dieser ``.json``-Datei werden bei Abruf dann in die jeweiligen Datei-Pfade aufgelöst.  
So werden zum Beispiel, beim Abruf der Version "[2.0](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/HelloWorld/2.0)" des ``HelloWorld``-Skills, die Dateien im verzeichnis ``skills/HelloWorld/3.0`` bereitgestellt.  
Erhält der Server nun eine Anfrage mit der Version ``latest``, so verwendet er den ersten Eintrag in der jeweiligen Liste, im Beispiel von ``HelloWorld`` wäre das Version "[3.0](https://github.com/fwehn/pp-voiceassistant/blob/main/src/skills/HelloWorld/3.0)".

## Upload

Möchte man nun einen Neuen Skill oder neue Versionen vorhandener Skills hochladen, tut man das auf die gleiche Art wie beim [Webinterface](./../client/webinterface.md#upload).  
Auch hier muss zuvor eine ``.zip``-Datei erstelllt werden.  
Wie das unter Windows funktioniert habe ich [hier](./../create-skill/instruction.md#zip-erstellen) näher beschrieben.  

**Hinweis**: Derzeit gibt es keinerlei Überprüfungssysteme, die den Skill auf Fehler überprüfen. Man sollte also sicher sein, dass der Skill einwandfrei funktioniert.

## Endpoints

Damit der Skillmanager mit dem Server kommunizieren kann, habe ich einige HTTP-Endpoints definiert.  
Über diese Endpoints erfragt der Client informationen über die Skills und deren Beschreibungen.  
Außerdem werden darüber auch die Skills heruntergeladen.   

### GET-Endpoints

Zunächst habe ich einige einfache Endpoints erstellt, die mit einer HTTP-GET-Anfrage abgerufen werden können:  

- ``/skills/<locale-Bezeichnung>``: Gibt eine Liste aller vorhandene Skills zurück.
- ``/skill/<Name des Skills>/<Version>``: Gibt informationen eines bestimmten Skills in einer bestimmten Version zurück.
- ``/update/<locale-Bezeichnung>/<Name des Skills>/<Version>``: Überprüft, ob es zu einer vorhandenen Version ein Update gibt. (Derzeit nur vom [CLI](./../client/cli.md) verwendet)
- ``/download/<Name des Skills>/<Version>``: Läd einen bestimmten Skill in einer bestimmten Version als ``.zip``-Datei herunter. 

## POST-Endpoints

Für HTTP-POST-Anfragen gibt es lediglich einen Endpoint:
- ``/upload``: Dieser Endpoint wird verwendet, um neue Skills auf den Server [hochzuladen](#upload).