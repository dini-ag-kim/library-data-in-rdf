#!/usr/bin/env perl
use v5.14.1;

my %uris = (
    lobid   => "http://lobid.org/resources/990186583900206441",
    dnb     => "https://d-nb.info/982315627",
    b3kat   => "http://lod.b3kat.de/title/BV022302814",
    k10plus => "http://swb.bsz-bw.de/DB=2.1/PRS=rdf/PPNSET?PPN=522231330"
);

say "Quellen und Anzahl von Triplen mit Abruf-URI";
while ( my ( $src, $uri ) = each %uris ) {
    print "$src.nt ";

`npm run -s extract $uri | grep '<$uri>' | sed 's|$uri|http://example.org/|g' | sort > $src.nt`;

    print `cat $src.nt | wc -l`;

    `awk '{print \$2}' $src.nt | sort | uniq > $src.properties`;

}

say "\nGleiche Properties in mehreren Quellen";
system("cat *.properties | sort | uniq -dc | sort -nrk1");

say "\nGleiche Tripel in mehreren Quellen";
system("cat *.nt | sort | uniq -dc | sort -nrk1");
