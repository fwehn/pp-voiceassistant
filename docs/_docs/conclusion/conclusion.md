---
title: Fazit
permalink: /docs/conclusion/conclusion/
---

Abschließend stellen sich natürlich einige Fragen, zum Ablauf und zum Ergebnis des Projekts.  
Aber auch zu Vor- und Nachteilen meiner Lösung.

## Was war das Ziel des Projekts?

In meinem Projekt sollte ich ein "Skillsystem" für den OpenSource-Sprachassistenten [Rhasspy](https://rhasspy.readthedocs.io/en/latest/) entwickeln.  
Also ein System, mit dem Nutzerinnen und Nutzer einfach neue Funktionen installieren können und Entwicklerinnen und Entwickler anhand eines standardisierten Systems neue Features entwickeln können.  
Dazu musste ich zum einen eine Anwendung entwickeln, welche sich um das Management der einzelnen Skills kümmert, aber auch die Struktur der Jeweiligen Skills festlegen.  
Dazu habe ich mir einige kommerzielle Lösungen, wie Amazons Alexa und den Google Assistant, angeschaut.  

Darüber hinaus sollte das System auch für "Nichtinformatiker" nutzbar sein.  

## Was ist das Ergebnis des Projekts?

Das Ergebnis meiner Arbeit ist ein wie oben beschriebenes System und bisher vier einfache Skills.  
Bei den Skills handelt es sich um einen sehr simplen "HelloWorld"-Skill, einen Zeit-Skill, einen Wetter-Skill und einen SmartHome-Skill.  
Mit jedem Skill habe ich versucht ein neues Feature zu implementieren.  
So ging es beim "HelloWorld"-Skill lediglich darum, einen ersten Programmablauf festzulegen und mit dem Skill auf die Slots zuzugreifen.  
Für den "GetTime"-Skill habe ich das [Antworten-System](./../skill/sdk.md#antwort-generieren) entworfen.  
Im "GetWeather"-Skill habe ich die [Optionen](./../client/webinterface.md#details) des Webinterfaces genutzt.  
Und beim "Zigbee2MQTT"-Skill habe ich auf die Geräte zugegriffen, die ich bei [Zigbee2MQTT](https://zigbee2mqtt.io/) registriert habe.  
  
Dabei bildet das System in erster Linie eine solide Basis, auf der weiter aufgebaut werden kann.  
Ich habe mich bemüht, das System so modular wie möglich zu entwickeln, sodass schnell und einfach neue Funktionen eingebaut oder bestehende Funktionen, wie zum Beispiel das Downloadsystem für neue Skills, verbessert werden können.  
Mein System habe ich in JavaScript mit NodeJS entwickelt, da mir die Sprache liegt und ohne Probleme auf nahezu jeder Plattform läuft.  

## Welche Vorteile bietet meine Lösung?

Dank NodeJS ist es relativ leicht auf jeglicher Plattform installierbar, auch wenn man sich dafür ein wenig mit NodeJS auskennen muss.  

Meine Lösung ist sehr modular aufgebaut und kann daher sehr einfach erweitert und verbessert werden.  
Dadurch werden neue Features wie das Webinterface deutlich erleichtert.  
Das Webinterface ermöglicht es Nutzerinnen und Nutzern, leicht neue Skills zu installieren und Entwicklerinnen und Entwicklern neue Skills zu testen.   
Außerdem gibt es über die [Detail-Seite](./../client/webinterface.md#details) einige nützliche Informationen zu den jeweiligen Skills und die Möglichkeit jeden Skill über die Optionen zu individualisieren.  
  
Das System ist sehr viel simpler als die großen kommerziellen Lösungen und erzeugt dadurch keinen Overhead.  
Der Punkt ist aber nur bedingt ein Vorteil, da dadurch einige Einschränkungen entstehen.

## Welche Nachteile gibt es?

Da ich alleine an diesem Projekt gearbeitet habe, gibt es natürlich Einschränkungen in Umfang und Funktion der Skills.  
So gibt es beispielsweise keine Möglichkeit, einen Dialog zu starten.  
Eine Nutzerin oder ein Nutzer spricht einen Befehl aus und Rhasspy handelt dementsprechend, ohne Rückfragen zu stellen.  

Auch wenn mein System dank NodeJS leicht installierbar ist, braucht man einige Kenntnisse über NodeJS.  
Wie kann ich zum Beispiel die Umgebungsvariablen setzten oder das Start-Script verändern?  
  
Und es gibt keinen Installer für Leute, die sich mit IT nicht auskennen.  

[//]: # (TODO wie verlief das projekt?)
[//]: # (TODO gab es Probleme?)
[//]: # (TODO bachelorarbeit?)

## Was wären die nächsten Schritte?

Da das System recht eingeschränkt ist, gibt es einige Features, die nachgereicht werden könnten.  
So zum Beispiel ein Dialog-System, wie man es von Alexa kennt.  
Dabei kann Alexa nach Informationen Fragen, sollten diese nicht im ersten Befehlsaufruf enthalten sein.  
Sagt man also: "Alexa, erstelle mir eine Erinnerung für den Tag XY."  
Kann Alexa beispielsweise fragen: "Ok, woran soll ich dich erinnern?"  
  
Man könnte ein System implementieren, mit dem man Audiodateien abspielen kann.    
So könnten man Töne nutzen, um zum Beispiel einen Wecker-Skill zu erstellen.  
   
Außerdem gibt es das [Webinterface](./../client/webinterface.md) bisher ausschließlich auf Deutsch.  
Hier könnte das Lokalisierungssystem erweitert werden, sodass auch die einzelnen Seiten des Webinterfaces in der jeweiligen Sprache angezeigt werden, welche als Umgebungsvariable beim Start angegeben wird.  
  
Ein weiterer Schritt könnte es sein, einige Skills als "Standardkit" zu implementieren.  
Dazu gibt es ein Anschlussprojekt von Sophia Johannsen, welches [hier](https://github.com/sjohannsen1/pp-voiceassistant) zu finden ist.  
