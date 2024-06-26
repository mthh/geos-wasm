// Import tape for testing
// Import the GEOS module
import initGeosJs from '../../build/package/geos.esm.js'

import test from 'tape'
const geos = await initGeosJs()

// Define a helper function to convert a WKT string to a GEOS geometry pointer
const wktToGeom = (reader, wkt) => {
  const size = wkt.length + 1
  const wktPtr = geos.Module._malloc(size)
  geos.Module.stringToUTF8(wkt, wktPtr, size)
  const geomPtr = geos.GEOSWKTReader_read(reader, wktPtr)
  geos.Module._free(wktPtr)
  return geomPtr
}

// Define some WKT strings to test
const ringWkt = 'LINEARRING (0 0, 1 0, 1 1, 0 1, 0 0)' // A valid ring
const nonRingWkt = 'LINESTRING (0 0, 1 0, 1 1, 0 1)' // Not a valid ring
const emptyWkt = 'LINESTRING EMPTY' // An empty geometry

// Create a reader and a writer for WKT
const reader = geos.GEOSWKTReader_create()
const writer = geos.GEOSWKTWriter_create()

// Test the GEOSisRing function
test('GEOSisRing', function (t) {
  // Convert the WKT strings to GEOS geometries
  const ringGeom = wktToGeom(reader, ringWkt)
  const nonRingGeom = wktToGeom(reader, nonRingWkt)
  const emptyGeom = wktToGeom(reader, emptyWkt)

  // Check if the geometries are rings
  const ringResult = geos.GEOSisRing(ringGeom)
  const nonRingResult = geos.GEOSisRing(nonRingGeom)
  const emptyResult = geos.GEOSisRing(emptyGeom)

  // Assert that the results are correct
  t.equal(ringResult, 1, 'ringWkt is a ring')
  t.equal(nonRingResult, 0, 'nonRingWkt is not a ring')
  t.equal(emptyResult, 0, 'emptyWkt is not a ring')

  // Free the memory allocated for the geometries
  geos.GEOSGeom_destroy(ringGeom)
  geos.GEOSGeom_destroy(nonRingGeom)
  geos.GEOSGeom_destroy(emptyGeom)

  // Destroy the reader and writer
  geos.GEOSWKTReader_destroy(reader)
  geos.GEOSWKTWriter_destroy(writer)

  // End the test
  t.end()
})
