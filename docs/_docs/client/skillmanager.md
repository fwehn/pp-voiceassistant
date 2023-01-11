---
title: Skillmanager
permalink: /docs/client/skillmanager/
---

Der Skillmanager ist das Herzstück meines Skillsystems.  
Er stellt einige nützliche Funktionen bereit, unter anderem kümmert er sich um die Verbindung zum Skillserver und die Verwaltung der lokalen Skill Dateien.  

## Skills installieren

Um neue Skills zu installieren, gibt es zwei verschiedene Wege:  
[Online](#online) und [Offline](#offline)  

Für die Online-Variante benötigt man eine Instanz des [Skillservers](./../server/skillserver.md).  
Unter welcher Adresse dieser erreichbar ist, kann man als Umgebungsvariable in der [Client-Anwendung](./../installation.md#client) speichern.  

### Online

Der Skillmanager sendet zunächst eine Anfrage an den Server und erhält als Antwort ein JSON-Objekt mit einigen Informationen zu den jeweiligen Skills, wie zum Beispiel die verfügbaren Versionen oder eine kleine Beschreibung des jeweiligen Skills.  
Die Funktion ``getRemoteSkills`` sortiert diese Daten dann ein wenig und überprüft, ob der jeweilige Skill bereits installiert wurde.  
Diese Daten werden dann vom Webinterface und dem CLI verwendet, um dem Nutzer zu zeigen, welche Skills es gibt und wozu diese benutzt werden können.  
  
Mit der Funktion ``downloadSkill`` kann man dann einen bestimmten Skill in einer bestimmten Version herunterladen.  
Dabei wird vom Server eine Zip-Datei heruntergeladen, die dann mit dem Package "[adm-zip](https://www.npmjs.com/package/adm-zip)" entpackt und im entsprechenden Verzeichnis gespeichert werden.  
  
Beim Herunterladen der Skills, werden in der Datei ``skillConfigs.json`` die beiden Variablen ``active`` (auf ``false``) und ``version`` (auf die jeweilige Version) gesetzt.

### Offline

Hat man keine Möglichkeit eine Instanz des Skillservers zu betreiben oder zu erreichen, kann man Skills auch lokal installieren.  
Dazu hat man zwei verschiedene Möglichkeiten.  

#### Manuell

Zunächst muss man die Dateien des Skills im Verzeichnis ``skills/<Name des Skills>/<Version des Skills>`` ablegen.  
Wie das auszusehen hat, habe ich [hier](./../create-skill/instruction.md#ordner-anlegen) beschrieben.  
Danach muss man in der Datei ``skillConfigs.json`` unter dem Schlüssel mit dem Namen des Skills ein neues Objekt anlegen.  
In diesem Objekt muss man noch das Feld ``version`` mit dem Namen des Unterordners definieren.  
````json
{
  "<Name des Skills>": {
    "version": "<Version des Skills>"
  }
}
````
*Ausschnitt aus der Datei ``skillConfigs.json``*  
  
#### Webinterface
Über das Webinterface kann man obigen Prozess sehr stark vereinfachen.  
Ich habe ein kleines [Upload-Tool](./webinterface.md#upload) erstellt, mit dem man sich die Dateien an der richtigen Position ablegen lassen kann und welches sich um die korrekte Konfiguration kümmert.  
Wichtig dabei ist nur, dass man die Zip-Datei, welche vom Upload-Tool verlangt wird, von den 2 Ordnern (``src`` und ``locales``) und der ``manifest.json`` erstellt wird und nicht vom Eltern-Pfad (diesen Prozess habe ich [hier](./../create-skill/instruction.md#zip-erstellen) etwas ausführlicher beschrieben).  

## Skills aktivieren

Wenn man, wie oben beschrieben einen neuen Skill installiert hat, kann man diesen jedoch nicht sofort nutzen.  
Man muss ihn erst aktivieren.  
Das kann man entweder über das [CLI](./cli.md#befehle) oder über das [Webinterface](./webinterface.md#details) machen.  

Dabei werden einige, für den Skillmanager wichtige Konfigurationen in der ``skillConfigs.json`` getroffen und die verschiedenen Sätze als [Intents](./rhasspy.md#neue-intents-hinzufügen) bei Rhasspy [registriert](./rhasspy.md#rhasspy-trainieren).  
Für die kommunikation mit Rhasspy habe ich eine eigene [JavaScript-Datei](https://github.com/fwehn/pp-voiceassistant/blob/main/src/client/rhasspy.js) erstellt, in der sich einige Funktionen befinden.  

````json
{
  "<Name des Skills>": {
    "version": "<Version des Skills>",
    "active": true
  }
}
````
*Ausschnitt aus der Datei ``skillConfigs.json``. Der Skill wurde erfolgreich aktiviert.*

## Skills löschen

Der Skillmanager kümmert sich natürlich nicht nur darum, neue Skills zu installieren, sondern auch darum lokale Dateien auf Wunsch zu löschen.  
Dazu wird Rhasspy zunächst angewiesen die jeweiligen Intents zu löschen und sich neu zu trainieren, dann werden die Konfigurationen in der ``skillConfigs.json`` gelöscht.  
Zu guter Letzt wird das gesamte Verzeichnis des Skills gelöscht, mit allen Versionen.  
Derzeit ist es nicht möglich einzelne Versionen zu löschen.  


## Details auslesen

Damit man zum Beispiel auf dem Webinterface einige Angaben zum lokalen Skill erhält, bietet der Skillmanager einige Funktionen an, um lokale Dateien auszulesen und deren Informationen wiederzugeben.  
Darunter fallen die Dateien ``manifest.json`` und die jeweilige ``<locale>.json``.  
Aber auch einige Informationen aus der ``skillConfigs.json`` werden zurückgegeben, zum Beispiel, ob ein Skill aktiviert ist oder nicht und in welcher Version.  