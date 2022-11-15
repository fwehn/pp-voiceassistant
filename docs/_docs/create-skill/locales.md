---
title: Locales
permalink: /docs/create-skills/locales/
---

Im Folgenden ist der Aufbau einer Locale-Datei, also einer Datei die zur Lokalisierung aber auch zur Definition des Aufbaus eines Befehls dient, beschrieben.  
Es werden die benötigten Angaben und deren Funktion erklärt.  


## Beispiel

Ich erkläre die Funktionen und Begriffe anhand folgenden Beispiels aus dem [HelloWorld](https://github.com/fwehn/pp-voiceassistant/blob/main/src/server/skills/HelloWorld) Skill:  

````json
{
  "invocation": "Hallo Welt",
  "description": "Das ist ein ganz klassisches HelloWorld-Programm.\nBenutzte einen der unteren Sätze um es auszuprobieren.",
  "intents": [
    {
      "sentences": ["sag ($slots/hello){hello} ($slots/world){world}"],
      "function": "helloWorld",
      "args": ["hello", "world"],
      "answers": [""]
    },
    {
      "sentences": ["sag ($slots/hello){hello}"],
      "function": "hello",
      "args": ["hello"],
      "answers": [""]
    }
  ],
  "slots": {
    "hello": ["Hallo", "Guten Tag"],
    "world": ["Welt", "Erde"]
  }
}
````
*Aus [HelloWorld/de_DE.json](https://github.com/fwehn/pp-voiceassistant/blob/main/src/server/skills/HelloWorld/1.0/locales/de_DE.json)*

## Invocation
Dieser Punkt bezeichnet den Namen des Befehls, unter dem man den Skill ansprechen kann.  
Hier ist das "Hallo Welt".  
Man kann auch Invocation Names übersetzten.  
In der [``en_US.json``](https://github.com/fwehn/pp-voiceassistant/blob/main/src/server/skills/HelloWorld/1.0/locales/en_US.json) ist dieser Name zum Beispiel als "Hello World" definiert.  
Üblicherweise wird der Invocation Name dazu genutzt, einen Skill eindeutig zu identifizieren.  
Wenn man also zwei verschiedene Skills für die Wetterinformationen hat, kann man einen beispielsweise mit "OpenWeather" und den anderen mit "Deutscher Wetterdienst" aufrufen.  

## Intents
Unter diesem Punkt sind alle Unterbefehle des Skills aufgeführt.  
Jeder Befehl wird durch die folgenden Unterpunkte definiert:

### Sentences
Dies definiert die Sätze mit denen die einzelnen Unterbefehle genutzt werden können.  
Die Syntax richtet sich dabei ganz nach der von [Rhasspy](https://rhasspy.readthedocs.io/en/latest/training/).  
Hier werden die [Slots](#slots) eingebunden, welche weiter unten definiert, und von der [Funktion](#function) verwendet werden.  

### Function
Hier ist die Funktion angegeben, die bei der Erkennung des Befehls ausgeführt werden soll.  
Diese Funktion muss im ``src`` Verzeichnis des jeweiligen Skills, in der Datei ``index.js`` definiert und mittels ``module.exports`` von außen verfügbar gemacht werden.  

### Args
Durch die ``Slots`` werden Argumente definiert, die in einem Unterbefehl genutzt werden können.  
Die Reihenfolge der Argumente im Satz kann sich von Sprache zu Sprache unterscheiden.  
Damit man nicht für jede Sprache eine eigene Funktion definieren muss, bei der sich lediglich die Parameter-Reihenfolge unterscheidet, gibt man unter ``args`` die gewünschte Reihenfolge an.  
Die Namen müssen mit den Namen der Slots im ``sentences`` Punkt übereinstimmen. 

### Answers
Für einige Funktionen ist es hilfreich Antwortsätze zu definieren.  
Bei diesen Sätzen können, mittels des [sdk](./sdk.md#antwort-generieren), Zeichen durch im Code generierte Variablen ersetzt werden.  
Ein auf diese Weise generierter Satz wird dann vom TTS-System ausgesprochen.

## Slots
Hier werden alle Slots definiert die Rhasspy nicht bereits kennt.  
Dazu gibt man unter dem Slot-Namen alle möglichen Werte des Slots als Array an.  
Möchte man diese Slots verwenden, muss man sie unter ``sentences`` wie folgt angeben:  
``($slots/<Name des Slots>){<Variablen Name>}``  
 
Den Slot ``($slots/zigbee2mqtt){zigbee2mqtt}`` muss man nicht extra definieren.  
Dieser wird beim start des Skillmanagers automatisch erstellt und beinhaltet alle Geräte und Gruppen, die in einer möglichen [Zigbee2MQTT-Instanz](https://zigbee2mqtt.io/) definiert wurden.  
Darüber hinaus gibt es zwei Slots die durch [Rhasspy](https://rhasspy.readthedocs.io/en/latest/training/#built-in-slots) vorgegeben werden:
- ``($rhasspy/days){<Variablen Name>}``: Enthält die Namen der Wochentage
- ``($rhasspy/month){<Variablen Name>}``: Enthält die Namen der Monate
