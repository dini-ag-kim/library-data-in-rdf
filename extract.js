#!/usr/bin/env node

import jsonld from "jsonld"
import $rdf from "rdflib"
import * as entities from "entities"

// HTTP GET Request
const get = async url => {
  const res = await fetch(url)
  if (!res?.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${res?.status}`)
  }
  return res
}

// Handles RDF/XML and Turtle
const getRDF = async uri => {
  return new Promise((resolve, reject) => {
    const store = $rdf.graph()
    const fetcher = new $rdf.Fetcher(store)
    fetcher.nowOrWhenFetched(uri, (ok, status) => {
      if (ok) {
        const ntriplesData = $rdf.serialize(undefined, store, null, "application/n-triples")
        resolve(ntriplesData)
      } else {
        reject(new Error(`Failed to fetch RDF/XML from ${uri} with status ${status}`))
      }
    })
  })
}

const sources = [
  {
    namespace: "http://lod.b3kat.de/title/",
    fetch: getRDF,
  },
  {
    namespace: "http://lobid.org/resources/",
    fetch: async uri => {
      const json = await get(uri).then(res => res.json())
      return jsonld.toRDF(json, {format: "application/n-quads"})
    }
  },
  {
    namespace: "https://d-nb.info/",
    fetch: uri => getRDF(`${uri}/about/lds`),
  },
  {
    namespace: "http://uri.gbv.de/document/opac-de-627:ppn:",
    fetch: getRDF,
  },
  {
    namespace: "http://uri.gbv.de/document/opac-de-627:ppn:",
    fetch: getRDF,
  },
  {
    namespace: "http://swb.bsz-bw.de/DB=2.1/PRS=rdf/PPNSET?PPN=",
    fetch: async uri => {
      // TODO: there should be a better way!
      const html = await get(uri).then(res => res.text())
      let rdf = html.match(/(&lt;rdf:Description.+rdf:Description&gt;)/)[1]
      rdf = entities.decodeHTML(rdf.replaceAll("</div><div>",""))
      rdf = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:isbd="http://iflastandards.info/ns/isbd/elements/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:owl="http://www.w3.org/2002/07/owl#" xmlns:bibo="http://purl.org/ontology/bibo/" xmlns:rda="http://rdvocab.info/Elements/" xmlns:umbel="http://umbel.org/umbel#" xmlns:wdrs="http://www.w3.org/2007/05/powder-s#">${rdf}</rdf:RDF>`
      const graph = $rdf.graph()
      $rdf.parse(rdf, graph, uri, "application/rdf+xml")
      return $rdf.serialize(undefined, graph, uri, "application/n-triples")
    },
  },
]

const args = process.argv.slice(2)
for (let uri of args) {
  const source = sources.find(src => uri.startsWith(src.namespace))
  if (source) {
    try {
      const nt = await source.fetch(uri)
      console.log(nt)
      // TODO: serialize as turtle $rdf.serialize(undefined, graph, uri, 'text/turtle')
    } catch (e) {
      console.error(e.message)
    }
  } else {
    console.error(`Unknown source of URI ${uri}`)
  }
}
