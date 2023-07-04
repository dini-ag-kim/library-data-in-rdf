# Integration von Bibliotheksdaten in RDF

Dieses Repository enthält Experimente zur Integration von Bibliotheksdaten (bislang nur bibliographische Titeldaten) aus verschiedenen Bibliotheksverbünden in RDF.

## Hintergrund

Anfang bis Mitte der 2010er Jahre wurde in Bibliotheken das Thema Linked Open Data diskutiert und umgesetzt. Zeugnis davon sind unter Anderem die seit 2009 stattfindende Konferenz [*Semantic Web in Bibliotheken*](https://swib.org/) und der Sammelband *(Open) Linked Data in Bibliotheken* (2013). Bis auf den GBV hatten bis 2013 alle deutschen Bibliotheksverbünde ihren Katalog in RDF publiziert und im selben Jahr gab die DINI AG KIM *[Empfehlung für die RDF-Repräsentation bibliografischer Daten](https://wiki.dnb.de/x/cYMOB)* heraus, die 2018 überarbeitet wurden.

Inzwischen werden einige der Daten allerdings nicht mehr aktualisiert (B3kat, K10plus, HeBIS).

## Installation

Repository klonen:

~~~sh
git clone https://github.com/dini-ag-kim/library-data-in-rdf.git
cd library-data-in-rdf
~~~

Dependencies installieren:

~~~sh
npm install
~~~

## Benutzung

Dem Skript `extract` können eine oder mehrere URIs übergeben werden. Unterstützt werden bislang folgende Quellen:

- B3Kat (BVB und KOBV)
- Deutsche Nationalbibliothek (DNB)
- lobid (hbz)
- K10plus (GBV und SWB) *EXPERIMENTELL, verschiedene Varianten*

Noch ausstehend sind HeBIS (derzeit offline), die ZDB (eigener RDF-Export) und Culturegraph (Timeout).

Daten aus anderen Ländern (z.B. <https://datos.bne.es/>) werden ebenfalls noch nicht unterstützt.

Hier Beispielaufrufe für den gleichen Titel bei verschiedenen Quellen:

~~~sh
npm run -s extract http://lobid.org/resources/990186583900206441 https://d-nb.info/982315627
npm run -s extract http://lod.b3kat.de/title/BV022302814
npm run -s extract http://uri.gbv.de/document/opac-de-627:ppn:522231330
npm run -s extract http://swb.bsz-bw.de/DB=2.1/PRS=rdf/PPNSET?PPN=522231330
~~~

Das Skript `compare.pl` ruft den gleichen Titel bei mehreren Verbünden auf und stellt einen groben Vergleich an. Zusätzlich werden die RDF-Daten mittels [rules.n3](rules.n3) umgeschrieben und in `graph.ttl` zusammengeführt.

## Ergebnisse und persönliche Empfehlungen

Die [Auswertung an einem einzelnen Beispiel](https://github.com/dini-ag-kim/library-data-in-rdf/issues/2) ist sicher nicht ganz aussagekräftig, es lässt sich aber bereits einiges feststellen:

- Die Empfehlungen der DINI-AG KIM werden weitgehen befolgt, sie sind aber an einigen Stellen unvollständig oder zu allgemein um einheitliche Daten zu gewährleisten
- Die Datengrundlage ist unterschiedlich vollständig, auch daher unterschiedliche Ergebnisse
- Nur lobid und DNB bieten aktuelle Daten. Bei B3Kat, Hebis und K10plus derzeit keine Updates (K10plus zumindest mit einem Hack)
- Es gibt zahlreiche Identifier für die gleiche Resource:

  - lobid: <http://lobid.org/resources/990186583900206441#!>
  - dnb: <https://d-nb.info/982315627>
  - b3kat: <http://lod.b3kat.de/title/BV022302814> und <http://lod.b3kat.de/title/BV022522402#vol-4>
  - k10plus: <http://swb.bsz-bw.de/DB=2.1/PRS=rdf/PPNSET?PPN=522231330> und <http://uri.gbv.de/document/opac-de-627:ppn:522231330>
  - culturegraph: <http://hub.culturegraph.org/resource/BVB-BV022302814> und <http://hub.culturegraph.org/resource/DNB-982315627>

  Dabei wird mal `owl:sameAs`, mal `schema:sameAs` verwendet. Das wird von KIM auch so empfohlen, hilft aber nicht beim Zusammenführen der Daten.

- b3kat und k10plus benutzen an verschiedenen Stellen fälschlicherweise strings statt URIs:
  `owl:sameAs "http://d-nb.info/982315627"`
- Die Verwendung von <http://purl.org/dc/elements/1.1/> vs <http://purl.org/dc/terms/> ist uneinheitlich: bei `title`, `identifier`, `publisher` und `subject`. Dies sollte vereinheitlicht werden (nur noch DC Terms verwenden auch wenn die KIM-Empfehlungen anderes sagen).
- lobid modelliert die Beziehung zum übergeordneten Werk (Buchreihe) anders als die anderen Quellen. Beides entspricht den KIM-Empfehlungen, erschwert aber die Zusammenführung der Daten
- b3kat verwendet nicht die offiziellen RVK-URIs (die allerdings erst einigen Jahren existieren)
- Zur Beziehung von Bibliographischer Entität und Katalogisat wird `wdrs:describedby` verwendet, ist das noch zeitgemäß oder gibt es eine andere, etablierte Property?
- Es werden teilweise veraltete Vokabulare genutzt (<http://rdvocab.info/Elements/>, <http://bibframe.org/vocab/>...).
- Soll `frbr:exemplar` oder `bf:hasItem` zum Verweis auf Exemplare verwendet werden (GBV nutzte außerdem `daia:exemplar`)?
- Lobid verwendet RDF-Listen und blank nodes für Beitragende mit `bf:contribution`, was die Weiterverarbeitung erschwert. Für Anfragen wo Reihenfolge und Art von Beitragenden egal sind, sollte eine ein einfaches Triple ohne Blank Node genügen.

