---
title: Willkommen
permalink: /docs/home/
redirect_from: /docs/index.html
---

In diesem Praxisprojekt geht es darum, für die Opensource-Lösung Rhasspy ein modulares System für die einfache Erstellung neuer Funktionen zu entwickeln.  
Das System soll einer vereinfachten Version von [Amazons Skills-System](https://www.amazon.de/b?ie=UTF8&node=10068460031) ähneln.  
Dazu soll eine Anwendung lokal auf dem Rhasspy-Host laufen, welche dann wiederum mittels eines Skillservers oder durch lokale Installation, neue Funktionen für den Sprachassistenten zur Verfügung stellt.  
Für etwaige Entwicklerinnen und Entwickler soll es möglichst leicht sein, neue Skills zu entwickeln und zu testen.  
Dazu stelle ich ein SDK (Software Development Kit) zur Verfügung, welches einige nützliche Funktionen enthält, welche die Entwicklerinnen und Entwickler nutzen können (wie z.B. eine Funktion für die Sprachausgabe).  
Das System stellt neben dem [CLI](./client/cli.md) (Command Line Interface) auch ein [Webinterface](./client/webinterface.md) zur Verfügung, um möglichst leicht neue Skills zu finden, zu installieren und zu verwalten.  


## Aufbau

Ich habe meine Dokumentation in fünf verschiedene Abschnitte aufgeteilt.  
Das Verzeichnis links gibt die bevorzugte Reihenfolge der einzelnen Themen vor, beginnend mit den "Evaluationen".  
In diesem Abschnitt habe ich mich mit einigen verschiedenen Systemen auseinandergesetzt, die ein modulares System für Funktionen bereitstellen.  
Ich habe mir dabei die beiden Sprachassistenten Amazon Alexa und Google Assistant angeschaut und die Smarthome Anwendung Home Assistant.  

Im Abschnitt "Client" beschreibe ich mein eigenes System.  
Dabei handelt es sich um die Anwendung für die Endnutzerinnen und Endnutzer, also die Anwendung, welche die einzelnen Skills installiert und verwaltet.  
Wie werden die Skills installiert?  
Wie funktioniert das Webinterface?  

Im Gegensatz dazu steht der Abschnitt "Server".  
Hier beschreibe ich meine Serveranwendung, von der die Skills heruntergeladen werden können.  

Der Abschnitt "Skills" wird wahrscheinlich für Entwicklerinnen und Entwickler am interessantesten sein.  
Hier erkläre ich, wie ein Skill aufgebaut ist und welche Dateien benötigt werden, damit der Skill reibungslos funktioniert.  
Außerdem sind hier einige Erklärungen zur Funktionsweise meines SDK.  

Zu guter Letzt habe ich im Abschnitt "Fazit" noch einmal zusammengefasst, worum es in meinem Projekt ging, was am Ende dabei herausgekommen ist und welche Vor- und Nachteile mein System hat.  
Des Weiteren gebe ich einen kleinen Ausblick darüber, was in Zukunft aus dem Projekt werden könnte und was die nächsten Schritte wären.  

## Begriffe

Ich werde in dieser Dokumentation einige Begriffe Verwenden, die so auch bei den Systemen von Amazon und Google verwendet werden.  
Daher habe ich hier eine Art Mini-Glossar, in dem ich einmal diese Begriffe erkläre.

### Skills

Mit einem Skill bezeichne ich eine Funktion oder ein Feature, welches eigenständig installiert werden kann.  
Bei meinem Projekt handelt es sich um ein Skillsystem, also einer Anwendung, mit der man jene Skills/Funktionen herunterladen kann.  
Ein solcher Skill kann alles Mögliche sein, beispielsweise ein Wetterdienst oder ein Wecker.  
Der Name stammt von Amazon Alexa und ich habe mich dazu entschlossen diesen zu übernehmen, da ich ihn sehr passend finde.  
Bei Google nennen sich diese Funktionen "Actions".  

### Intents

Mit einem Intent ist eine Unterfunktion gemeint.  
Nahezu jeder Skill bietet mehr als nur eine Funktion.  
Wenn ich beispielsweise einen Wetter-Skill installiere, möchte ich nicht nur nach dem aktuellen Wetter, sondern vielleicht auch nach dem Wetter in einer Woche oder nur nach der aktuellen Temperatur fragen können.  
Dafür braucht man Intents.  
Sie Beschreiben eben diese unterschiedlichen Befehle.  

### Slots

Ein Slot bezeichnet eine Variable im Befehl.  
Wenn ich also wissen möchte, wie das Wetter am nächsten Donnerstag ist, könnte ich mit "..., wie ist das Wetter am ``Donnerstag``?" danach fragen.  
Dabei wäre ``Donnerstag`` der Slot.  
Diesen Slot könnte man auch durch andere Wochentage ersetzten.  
Es geht darum, dass man nicht für jeden Wochentag einen neuen Befehl erstellen muss, sondern eine Liste mit den Wochentagen hat, die an dieser Stelle eingesetzt werden können.  