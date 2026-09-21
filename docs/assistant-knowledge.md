# Assistant knowledge corpus

`backend/assistant_knowledge.json` is a generated, extractive snapshot of the committed public programme data. It is not a trained model, a web scrape, a booking system, or a copy of private customer data. It contains only Spanish, English and French documents with a same-language public source path.

## Source of truth

`frontend/scripts/generate-assistant-knowledge.cjs` reads the existing sources:

- `TRIP_PROGRAMS`, the same programme/variant registry used for trip pages.
- Each programme's own `meta`, daily `title`/`body`, `duration` and `details`, falling back to `VARIANT_COPY` and `SHARED_DETAILS` exactly where the public template does.
- `ALL_TRIPS` for existing catalogue titles, not separate invented trip summaries.
- `getTripPackingNotes` for the packing notes displayed on the relevant trip.
- `ROUTES`/`pathFor` for localized citation paths.
- Public `CONTACT` constants and literal `ProgramTemplate` labels for source wording and inclusion/exclusion headings.

The generator executes only the allowlisted repository data modules and local programme factories. It does not load React, fetch content, query a CMS or call external services. It parses literal labels and contact constants without executing their surrounding modules. Missing translated source text is omitted, never silently replaced with Spanish.

Runtime CMS text overrides are **not** included. If text is edited only in the CMS, the assistant snapshot can differ from the live page until that wording is reconciled into the committed programme source and regenerated. The UI should describe answers as excerpts from published programme information, not claim live knowledge or real-time availability.

## Scope and exclusions

Every current programme receives a localized overview and safe daily extracts. Enduro 3 nights / 4 days and 4 nights / 5 days are included; the retired 6 nights / 7 days route is excluded. Placeholder/category cards and dated special departures without an actual `TRIP_PROGRAMS` entry do not become invented itineraries.

Only descriptive itinerary information, inclusion/exclusion items, bounded practical/packing notes and central contact facts are indexed. Price tables, booking/payment/cancellation terms, passport/visa requirements, medical advice, insurance coverage, availability claims, flight schedules, external URLs, cultural sidebar claims and testimonials are not indexed. Unsupported promotional superlatives are removed from source extracts. These content filters are deliberately conservative. The guided API accepts only allowlisted selections derived from this corpus; free-form questions are disabled. Personal requests, prices and availability are directed to the permanent team-contact action.

Day-body filtering omits whole sentences without rewriting the remaining source words. Inclusion/exclusion/note items are atomic: if an item contains an excluded subject or qualifier, the entire item is omitted. Source inclusion and exclusion headings are retained so an excluded service cannot be presented as included. A document is at most 1,799 characters; IDs and ordering are deterministic and contain no timestamps.

## Regeneration and checks

From the repository root, with frontend dependencies installed:

```sh
node frontend/scripts/generate-assistant-knowledge.cjs
node frontend/scripts/generate-assistant-knowledge.cjs --check
node --test frontend/scripts/generate-assistant-knowledge.test.cjs
```

Commit the generated JSON together with changes to its sources. The backend reads the committed JSON without requiring Node or frontend dependencies at runtime. `--check` performs no writes and exits unsuccessfully when the corpus is missing or stale; use it in CI/build validation. Tests cover determinism, stale output, active route and language coverage, exact source wording, local citation paths, excluded content and the current Enduro programmes.

Schema:

```json
{
  "version": 1,
  "documents": [
    {
      "id": "es:tourEnduroAventura34:overview:1",
      "lang": "es",
      "title": "...",
      "path": "/...",
      "text": "...",
      "keywords": ["..."],
      "kind": "trip"
    }
  ]
}
```

The only document kinds are `trip`, `practical` and `contact`. The source path is an application-relative path, never an external or private endpoint. New content sources require deliberate generator changes and corresponding safety/provenance tests; the default is to omit material the assistant cannot substantiate.
