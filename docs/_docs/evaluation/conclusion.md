---
title: Zwischenfazit
permalink: /docs/evaluation/conclusion/
---

Basierend auf meiner Recherche zu den drei verschiedenen Systemen (Amazon Alexa, Google Assistant und Home Assistant), habe ich versucht, die für mich jeweils passenden Herangehensweisen zu übernehmen und zu kombinieren.  
Ich habe mich dazu entschlossen sowohl den Befehlsaufbau, als auch einige Teile der Ordnerstruktur zu übernehmen.  

## Befehlsstruktur

Mein Befehlsaufbau gleicht daher dem von Alexa und dem Google Assistant:  
``<wake word>, <launch> <Invocation name> <utterance>``  
  
Bei obigem Sprachassistenten gibt es einige Variationen in der Reihenfolge, allerdings müssen die einzelnen Teile immer vorhanden sein und ein Befehl muss mit dem Wake Word beginnen.  
In meinem System gibt es keine Variation in der Reihenfolge.  
Das Wake Word wird von Rhasspy vorgegeben und aktiviert die Spracherkennung.  
Beim ``<launch>`` handelt es sich auch bei mir um einige Füllwörter, die in der [``defaults.json``](https://github.com/fwehn/pp-voiceassistant/blob/main/src/client/defaults.json) Datei definiert wurden und beim Start des Systems als Slot bei Rhasspy registriert werden.  

## Orderstruktur

Ein Großteil meines Systems ähnelt dem System von Amazon.  
So teile auch ich die verschiedenen Sprachen in einzelne Dateien mit der jeweiligen ``locale``-Bezeichnung auf (z.B. ``de_DE.json`` für Deutsch).  
Diese Dateien befinden sich in dem Verzeichnis ``<SkillName>/<SkillVersion>/locales``.  
Im verzeichnis ``<SkillName>/<SkillVersion>/src`` befindet sich mein Code, welcher in JavaScript geschrieben ist, da mir diese Sprache liegt und ich in der Vergangenheit auch schon andere Projekte mit NodeJS realisiert habe.  
Wie alle anderen Systeme auch, stelle ich ein SDK zur verfügung, welches sich in erster Linie um die kommunikation mit dem MQTT-Broker kümmert, aber auch einige Funktionen meines eigenen Systems bietet (mehr dazu [hier](./../create-skill/sdk.md)).  
Für einige Metadaten und Abhängigkeiten habe ich mich dazu entschlossen, eine ``manifest.json`` ähnlich der des Home Assistant vorauszusetzen.  
In dieser Datei befinden sich Angaben zum Skill, der Abhängigkeiten zu anderen "npm-packages" und Angaben zu vom Nutzer änderbaren Optionen.  

Generell habe ich mich dazu entschlossen alle "definierenden" Angaben, also wie die Slots und Intents aufgebaut sind, in jeweils eine Datei zu schreiben.  
Beim Google Assistant wird für jeden Slot und Intent eine eigene Datei erstellt.  
Das hat den Vorteil, dass alles sehr sortiert und aufgeräumt ist, allerdings ist der Google Assistant auch für einen viel komplexeren Anwendungsbereich gedacht.  
Für mein sehr simples System wäre dieser Aufbau etwas übertrieben.  

[//]: # (Daher habe ich die [Syntax von Rhasspy]&#40;https://rhasspy.readthedocs.io/en/latest/training/&#41; übernommen.  )