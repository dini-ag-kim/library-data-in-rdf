# Integration von Bibliotheksdaten in RDF

Dieses Repository enthält Experimente zur Integration von Bibliotheksdaten (bislang nur bibliographische Titeldaten) aus verschiedenen Bibliotheksverbünden in RDF.

## Hintergrund

Anfang bis Mitte der 2010er Jahre wurde in Bibliotheken das Thema Linked Open Data diskutiert und umgesetzt. Zeugnis davon sind unter Anderem die seit 2009 stattfindende Konferenz [*Semantic Web in Bibliotheken*](https://swib.org/) und der Sammelband *(Open) Linked Data in Bibliotheken* (2013). Bis auf den GBV hatten bis 2013 alle deutschen Bibliotheksverbünde ihren Katalog in RDF publiziert und im selben Jahr gab die DINI AG KIM *[Empfehlung für die RDF-Repräsentation bibliografischer Daten](https://wiki.dnb.de/x/cYMOB)* heraus, die 2018 überarbeitet wurden.

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

Das Skript `compare.pl` ruft den gleichen Titel bei mehreren Verbünden auf und stellt einen groben Vergleich an.

## Ergebnisse

Die [Auswertung an einem einzelnen Beispiel](https://github.com/dini-ag-kim/library-data-in-rdf/issues/2) ist sicher nicht ganz aussagekräftig, es lässt sich aber bereits einiges feststellen:

- Die Empfehlungen der DINI-AG KIM werden weitgehen befolgt
- Die Datengrundlage ist unterschiedlich vollständig, daher unterschiedliche Ergebnisse
- Es gibt zahlreiche Identifier für die gleiche Resource:

  - lobid: <http://lobid.org/resources/990186583900206441#!>
  - dnb: <https://d-nb.info/982315627>
  - b3kat: <http://lod.b3kat.de/title/BV022302814> und <http://lod.b3kat.de/title/BV022522402#vol-4>
  - k10plus: <http://swb.bsz-bw.de/DB=2.1/PRS=rdf/PPNSET?PPN=522231330>
  - culturegraph: <http://hub.culturegraph.org/resource/BVB-BV022302814> und <http://hub.culturegraph.org/resource/DNB-982315627>

  Dabei wird mal `owl:sameAs`, mal `schema:sameAs` verwendet. Das wird von KIM auch so empfohlen, hilft aber nicht beim Zusammenführen der Daten.

- b3kat und k10plus benutzen an verschiedenen Stellen fälschlicherweise strings statt URIs:
  `owl:sameAs "http://d-nb.info/982315627"`
- Die Verwendung von <http://purl.org/dc/elements/1.1/> vs <http://purl.org/dc/terms/> ist uneinheitlich: bei `title`, `identifier`, `publisher` und `subject`.
- lobid modelliert die Beziehung zum übergeordneten Werk (Buchreihe) anders als die anderen Quellen. Beides entspricht den KIM-Empfehlungen, erschwert aber die Zusammenführung der Daten

