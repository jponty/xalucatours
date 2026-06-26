// Route registry + helpers for language-aware URLs.
// - Spanish is the primary market → no prefix at root: /viajes, /citaprevia, /contacto …
// - English & French keep a language prefix: /en/tours, /fr/voyages …

export const SUPPORTED_LANGS = ["es", "en", "fr"];
export const PREFIXED_LANGS  = ["en", "fr"];     // only these add a /<lang> URL prefix
export const DEFAULT_LANG    = "es";

export const ROUTES = {
  home:               { es: "",                          en: "",                         fr: "" },
  appointment:        { es: "citaprevia",                en: "book-appointment",         fr: "prendre-rendez-vous" },
  planTrip:           { es: "planifica-tu-viaje",        en: "plan-your-trip",           fr: "planifiez-votre-voyage" },
  precios:            { es: "precios",                    en: "pricing",                  fr: "tarifs" },
  opiniones:          { es: "opiniones",                  en: "reviews",                  fr: "avis" },
  vuelos:             { es: "vuelos",                     en: "flights",                  fr: "vols" },
  asistente:          { es: "asistente",                  en: "assistant",                fr: "assistant" },

  // Catalogue cluster
  toursLanding:       { es: "viajes",                    en: "tours",                    fr: "voyages" },
  catalog:            { es: "catalogo",                  en: "catalogue",                fr: "catalogue" },
  tourSouth:          { es: "viajes/surdemarruecos",     en: "tours/southern-morocco",   fr: "voyages/sud-du-maroc" },
  tourDesiertoAtlas67:{ es: "viajes/desierto_atlas/programa_6n_7d", en: "tours/desert-atlas/program-6n-7d", fr: "voyages/desert-atlas/programme-6n-7j" },
  tourDesiertoAtlas56:{ es: "viajes/desierto_atlas/programa_5n_6d", en: "tours/desert-atlas/program-5n-6d", fr: "voyages/desert-atlas/programme-5n-6j" },
  tourDesiertoAtlas45:{ es: "viajes/desierto_atlas/programa_4n_5d", en: "tours/desert-atlas/program-4n-5d", fr: "voyages/desert-atlas/programme-4n-5j" },
  tourAtlasDesierto45:{ es: "viajes/atlas_desierto/programa_4n_5d", en: "tours/atlas-desert/program-4n-5d", fr: "voyages/atlas-desert/programme-4n-5j" },
  tourAtlasDesierto56:{ es: "viajes/atlas_desierto/programa_5n_6d", en: "tours/atlas-desert/program-5n-6d", fr: "voyages/atlas-desert/programme-5n-6j" },
  tourAtlasDesierto67:{ es: "viajes/atlas_desierto/programa_6n_7d", en: "tours/atlas-desert/program-6n-7d", fr: "voyages/atlas-desert/programme-6n-7j" },
  tourAtlasDesiertoHub:{ es: "viajes/sur/atlas_desierto", en: "tours/south/atlas-desert", fr: "voyages/sud/atlas-desert" },
  tourDesiertoAtlasHub:{ es: "viajes/sur/desierto_atlas", en: "tours/south/desert-atlas", fr: "voyages/sud/desert-atlas" },
  tourMarrakechErgHub: { es: "viajes/sur/marrakech_ergchebbi", en: "tours/south/marrakech-ergchebbi", fr: "voyages/sud/marrakech-ergchebbi" },
  tourErgChebbiMarrakechHub: { es: "viajes/ergchebbi_marrakech", en: "tours/ergchebbi-marrakech", fr: "voyages/ergchebbi-marrakech" },
  tourErgMarrakech45:  { es: "viajes/ergchebbi_marrakech/programa_4n_5d", en: "tours/ergchebbi-marrakech/program-4n-5d", fr: "voyages/ergchebbi-marrakech/programme-4n-5j" },
  tourErgMarrakech56:  { es: "viajes/ergchebbi_marrakech/programa_5n_6d", en: "tours/ergchebbi-marrakech/program-5n-6d", fr: "voyages/ergchebbi-marrakech/programme-5n-6j" },
  tourErgMarrakech67:  { es: "viajes/ergchebbi_marrakech/programa_6n_7d", en: "tours/ergchebbi-marrakech/program-6n-7d", fr: "voyages/ergchebbi-marrakech/programme-6n-7j" },
  tourErgMarrakech78:  { es: "viajes/ergchebbi_marrakech/programa_7n_8d", en: "tours/ergchebbi-marrakech/program-7n-8d", fr: "voyages/ergchebbi-marrakech/programme-7n-8j" },
  tourMarrakechErg45:  { es: "viajes/marrakech_ergchebbi/programa_4n_5d", en: "tours/marrakech-ergchebbi/program-4n-5d", fr: "voyages/marrakech-ergchebbi/programme-4n-5j" },
  tourMarrakechErg56:  { es: "viajes/marrakech_ergchebbi/programa_5n_6d", en: "tours/marrakech-ergchebbi/program-5n-6d", fr: "voyages/marrakech-ergchebbi/programme-5n-6j" },
  tourMarrakechErg67:  { es: "viajes/marrakech_ergchebbi/programa_6n_7d", en: "tours/marrakech-ergchebbi/program-6n-7d", fr: "voyages/marrakech-ergchebbi/programme-6n-7j" },
  tourMarrakechErg78:  { es: "viajes/marrakech_ergchebbi/programa_7n_8d", en: "tours/marrakech-ergchebbi/program-7n-8d", fr: "voyages/marrakech-ergchebbi/programme-7n-8j" },
  tourMarrakechLoopHub:{ es: "viajes/marrakech_ergchebbi_marrakech", en: "tours/marrakech-ergchebbi-marrakech", fr: "voyages/marrakech-ergchebbi-marrakech" },
  tourMarrakechLoop23: { es: "viajes/marrakech_ergchebbi_marrakech/programa_2n_3d", en: "tours/marrakech-ergchebbi-marrakech/program-2n-3d", fr: "voyages/marrakech-ergchebbi-marrakech/programme-2n-3j" },
  tourMarrakechLoop34: { es: "viajes/marrakech_ergchebbi_marrakech/programa_3n_4d", en: "tours/marrakech-ergchebbi-marrakech/program-3n-4d", fr: "voyages/marrakech-ergchebbi-marrakech/programme-3n-4j" },
  tourMarrakechLoop45: { es: "viajes/marrakech_ergchebbi_marrakech/programa_4n_5d", en: "tours/marrakech-ergchebbi-marrakech/program-4n-5d", fr: "voyages/marrakech-ergchebbi-marrakech/programme-4n-5j" },
  tourMarrakechLoop56: { es: "viajes/marrakech_ergchebbi_marrakech/programa_5n_6d", en: "tours/marrakech-ergchebbi-marrakech/program-5n-6d", fr: "voyages/marrakech-ergchebbi-marrakech/programme-5n-6j" },
  tourMarrakechLoop67: { es: "viajes/marrakech_ergchebbi_marrakech/programa_6n_7d", en: "tours/marrakech-ergchebbi-marrakech/program-6n-7d", fr: "voyages/marrakech-ergchebbi-marrakech/programme-6n-7j" },
  tourMarrakechLoop78: { es: "viajes/marrakech_ergchebbi_marrakech/programa_7n_8d", en: "tours/marrakech-ergchebbi-marrakech/program-7n-8d", fr: "voyages/marrakech-ergchebbi-marrakech/programme-7n-8j" },
  tourMarrakechEssHub: { es: "viajes/sur/marrakech_essaouira", en: "tours/south/marrakech-essaouira", fr: "voyages/sud/marrakech-essaouira" },
  tourMarrakechEss45: { es: "viajes/marrakech_essaouira/programa_4n_5d", en: "tours/marrakech-essaouira/program-4n-5d", fr: "voyages/marrakech-essaouira/programme-4n-5j" },
  tourMarrakechEss67: { es: "viajes/marrakech_essaouira/programa_6n_7d", en: "tours/marrakech-essaouira/program-6n-7d", fr: "voyages/marrakech-essaouira/programme-6n-7j" },
  tourErrAtlasFezHub: { es: "viajes/sur/errachidia-atlas-fez", en: "tours/south/errachidia-atlas-fez", fr: "voyages/sud/errachidia-atlas-fes" },
  tourErrAtlasFez56: { es: "viajes/errachidia-atlas-fez/programa_5n_6d", en: "tours/errachidia-atlas-fez/program-5n-6d", fr: "voyages/errachidia-atlas-fes/programme-5n-6j" },
  tourFezAtlasErr56: { es: "viajes/fez-atlas-errachidia/programa_5n_6d", en: "tours/fez-atlas-errachidia/program-5n-6d", fr: "voyages/fes-atlas-errachidia/programme-5n-6j" },
  tourUpcoming:       { es: "proximas_salidas", en: "upcoming-departures", fr: "prochains-departs" },
  tourFinDeAno2025:   { es: "findeano2025",     en: "newyear2025",          fr: "nouvelan2025" },
  tourFull:           { es: "viajes/marruecos",          en: "tours/full-morocco",       fr: "voyages/maroc-integral" },
  tourGransurFezRak:      { es: "viajes/gransur/fez-rak",            en: "tours/grand-south/fez-marrakech",            fr: "voyages/grand-sud/fes-marrakech" },
  tourFezRak910:          { es: "viajes/gransur/fez_marrakech/programa_9n_10d", en: "tours/grand-south/fez-marrakech/program-9n-10d", fr: "voyages/grand-sud/fes-marrakech/programme-9n-10j" },
  tourFezRak89:           { es: "viajes/gransur/fez_marrakech/programa_8n_9d",  en: "tours/grand-south/fez-marrakech/program-8n-9d",  fr: "voyages/grand-sud/fes-marrakech/programme-8n-9j" },
  tourFezRak78:           { es: "viajes/gransur/fez_marrakech/programa_7n_8d",  en: "tours/grand-south/fez-marrakech/program-7n-8d",  fr: "voyages/grand-sud/fes-marrakech/programme-7n-8j" },
  tourFezSidialiRak78:    { es: "viajes/gransur/fez_sidiali_marrakech/programa_7n_8d", en: "tours/grand-south/fez-sidiali-marrakech/program-7n-8d", fr: "voyages/grand-sud/fes-sidiali-marrakech/programme-7n-8j" },
  tourFezSidialiRak89:    { es: "viajes/gransur/fez_sidiali_marrakech/programa_8n_9d", en: "tours/grand-south/fez-sidiali-marrakech/program-8n-9d", fr: "voyages/grand-sud/fes-sidiali-marrakech/programme-8n-9j" },
  tourFezSidialiRak910:   { es: "viajes/gransur/fez_sidiali_marrakech/programa_9n_10d", en: "tours/grand-south/fez-sidiali-marrakech/program-9n-10d", fr: "voyages/grand-sud/fes-sidiali-marrakech/programme-9n-10j" },
  tourAtlasDesiertoFezHub:{ es: "viajes/atlas-desierto-fez", en: "tours/atlas-desert-fez", fr: "voyages/atlas-desert-fes" },
  tourGransurRakFezHub:   { es: "viajes/gransur/rak-fez", en: "tours/grand-south/rak-fez", fr: "voyages/grand-sud/rak-fes" },
  tourTangerRak89:        { es: "viajes/gransur/tanger-rak/programa_8n_9d",  en: "tours/grand-south/tangier-marrakech/program-8n-9d",  fr: "voyages/grand-sud/tanger-marrakech/programme-8n-9j" },
  tourTangerRak910:       { es: "viajes/gransur/tanger-rak/programa_9n_10d", en: "tours/grand-south/tangier-marrakech/program-9n-10d", fr: "voyages/grand-sud/tanger-marrakech/programme-9n-10j" },
  tourFezSidialiOzz56:    { es: "viajes/gransur/fez_sidiali_ozz/programa_5n_6d", en: "tours/grand-south/fez-sidiali-ouarzazate/program-5n-6d", fr: "voyages/grand-sud/fes-sidiali-ouarzazate/programme-5n-6j" },
  tourFezSidialiOzz67:    { es: "viajes/gransur/fez_sidiali_ozz/programa_6n_7d", en: "tours/grand-south/fez-sidiali-ouarzazate/program-6n-7d", fr: "voyages/grand-sud/fes-sidiali-ouarzazate/programme-6n-7j" },
  tourFezSidialiOzz78:    { es: "viajes/gransur/fez_sidiali_ouarzazate/programa_7n_8d", en: "tours/grand-south/fez-sidiali-ouarzazate/program-7n-8d", fr: "voyages/grand-sud/fes-sidiali-ouarzazate/programme-7n-8j" },
  tourOzzSidialiFez56:    { es: "viajes/gransur/ozz_sidiali_fez/programa_5n_6d", en: "tours/grand-south/ouarzazate-sidiali-fez/program-5n-6d", fr: "voyages/grand-sud/ouarzazate-sidiali-fes/programme-5n-6j" },
  tourOzzSidialiFez67:    { es: "viajes/gransur/ozz_sidiali_fez/programa_6n_7d", en: "tours/grand-south/ouarzazate-sidiali-fez/program-6n-7d", fr: "voyages/grand-sud/ouarzazate-sidiali-fes/programme-6n-7j" },
  tourOzzSidialiFez78:    { es: "viajes/gransur/ozz_sidiali_fez/programa_7n_8d", en: "tours/grand-south/ouarzazate-sidiali-fez/program-7n-8d", fr: "voyages/grand-sud/ouarzazate-sidiali-fes/programme-7n-8j" },
  tourFezRak67:           { es: "viajes/gransur/fez_marrakech/programa_6n_7d",  en: "tours/grand-south/fez-marrakech/program-6n-7d",  fr: "voyages/grand-sud/fes-marrakech/programme-6n-7j" },
  tourMarrakechFez67:     { es: "viajes/gransur/marrakech_fez/programa_6n_7d",  en: "tours/grand-south/marrakech-fez/program-6n-7d",  fr: "voyages/grand-sud/marrakech-fes/programme-6n-7j" },
  tourMarrakechFez78:     { es: "viajes/gransur/marrakech_fez/programa_7n_8d",  en: "tours/grand-south/marrakech-fez/program-7n-8d",  fr: "voyages/grand-sud/marrakech-fes/programme-7n-8j" },
  tourMarrakechFez89:     { es: "viajes/gransur/marrakech_fez/programa_8n_9d",  en: "tours/grand-south/marrakech-fez/program-8n-9d",  fr: "voyages/grand-sud/marrakech-fes/programme-8n-9j" },
  tourMarrakechFez910:    { es: "viajes/gransur/marrakech_fez/programa_9n_10d", en: "tours/grand-south/marrakech-fez/program-9n-10d", fr: "voyages/grand-sud/marrakech-fes/programme-9n-10j" },
  tourMarrakechSidialiFez78:  { es: "viajes/gransur/marrakech_sidiali_fez/programa_7n_8d",  en: "tours/grand-south/marrakech-sidiali-fez/program-7n-8d",  fr: "voyages/grand-sud/marrakech-sidiali-fes/programme-7n-8j" },
  tourMarrakechSidialiFez89:  { es: "viajes/gransur/marrakech_sidiali_fez/programa_8n_9d",  en: "tours/grand-south/marrakech-sidiali-fez/program-8n-9d",  fr: "voyages/grand-sud/marrakech-sidiali-fes/programme-8n-9j" },
  tourMarrakechSidialiFez910: { es: "viajes/gransur/marrakech_sidiali_fez/programa_9n_10d", en: "tours/grand-south/marrakech-sidiali-fez/program-9n-10d", fr: "voyages/grand-sud/marrakech-sidiali-fes/programme-9n-10j" },
  tourGransurFezSidiali:  { es: "viajes/gransur/fez-sidiali-rak",     en: "tours/grand-south/fez-sidi-ali-marrakech",   fr: "voyages/grand-sud/fes-sidi-ali-marrakech" },
  tourGransurOuarzaFez:   { es: "viajes/gransur/ouarzazate-sidiali-fez", en: "tours/grand-south/ouarzazate-sidi-ali-fez", fr: "voyages/grand-sud/ouarzazate-sidi-ali-fes" },
  tourGransurTangerRak:   { es: "viajes/gransur/tanger-rak",          en: "tours/grand-south/tangier-marrakech",        fr: "voyages/grand-sud/tanger-marrakech" },
  tourShort:          { es: "viajes/escapadas",          en: "tours/short-escapes",      fr: "voyages/escapades-courtes" },
  tourEscapadaDesierto34: { es: "viajes/escapadas/desierto/programa_3n_4d", en: "tours/short-escapes/desert/program-3n-4d",    fr: "voyages/escapades-courtes/desert/programme-3n-4j" },
  tourEscapadaAtlas34:    { es: "viajes/escapadas/atlas/programa_3n_4d",    en: "tours/short-escapes/high-atlas/program-3n-4d", fr: "voyages/escapades-courtes/haut-atlas/programme-3n-4j" },
  tourEscapadaFez:        { es: "viajes/escapadas/fez",                     en: "tours/short-escapes/fez",                      fr: "voyages/escapades-courtes/fes" },
  tourEscapadaFez23:      { es: "viajes/escapadas/fez/programa_2n_3d",       en: "tours/short-escapes/fez/program-2n-3d",        fr: "voyages/escapades-courtes/fes/programme-2n-3j" },
  tourEscapadaFez34:      { es: "viajes/escapadas/fez/programa_3n_4d",       en: "tours/short-escapes/fez/program-3n-4d",        fr: "voyages/escapades-courtes/fes/programme-3n-4j" },
  tourEscapadaFezSidiali34: { es: "viajes/escapadas/fez_sidiali/programa_3n_4d", en: "tours/short-escapes/fez-sidiali/program-3n-4d", fr: "voyages/escapades-courtes/fes-sidiali/programme-3n-4j" },
  tourEscapadaFezSidiali45: { es: "viajes/escapadas/fez_sidiali/programa_4n_5d", en: "tours/short-escapes/fez-sidiali/program-4n-5d", fr: "voyages/escapades-courtes/fes-sidiali/programme-4n-5j" },
  tourEscapadaMarrakech:  { es: "viajes/escapadas/marrakech",               en: "tours/short-escapes/marrakech",                fr: "voyages/escapades-courtes/marrakech" },
  tourEscapadaMarrakech23:{ es: "viajes/escapadas/marrakech/programa_2n_3d", en: "tours/short-escapes/marrakech/program-2n-3d", fr: "voyages/escapades-courtes/marrakech/programme-2n-3j" },
  tourEscapadaRakAgafay34:{ es: "viajes/escapadas/marrakech_agafay/programa_3n_4d", en: "tours/short-escapes/marrakech-agafay/program-3n-4d", fr: "voyages/escapades-courtes/marrakech-agafay/programme-3n-4j" },
  tourEscapadaRakErgRakHub: { es: "viajes/escapadas/rak_erg_rak",            en: "tours/short-escapes/marrakech-erg-marrakech",  fr: "voyages/escapades-courtes/marrakech-erg-marrakech" },
  tourEscapadaRakErgRak23:  { es: "viajes/escapadas/rak_erg_rak/programa_2n_3d", en: "tours/short-escapes/marrakech-erg-marrakech/program-2n-3d", fr: "voyages/escapades-courtes/marrakech-erg-marrakech/programme-2n-3j" },
  tourEscapadaRakErgRak34:  { es: "viajes/escapadas/rak_erg_rak/programa_3n_4d", en: "tours/short-escapes/marrakech-erg-marrakech/program-3n-4d", fr: "voyages/escapades-courtes/marrakech-erg-marrakech/programme-3n-4j" },
  tourEscapadaRakErgRak45:  { es: "viajes/escapadas/rak_erg_rak/programa_4n_5d", en: "tours/short-escapes/marrakech-erg-marrakech/program-4n-5d", fr: "voyages/escapades-courtes/marrakech-erg-marrakech/programme-4n-5j" },
  tourEscapadaTanger:     { es: "viajes/escapadas/tanger",                  en: "tours/short-escapes/tangier",                  fr: "voyages/escapades-courtes/tanger" },
  tourNorth:          { es: "viajes/nortedemarruecos",   en: "tours/northern-morocco",   fr: "voyages/nord-du-maroc" },
  tourNorteCiudadesImperiales: { es: "viajes/norte/ciudades_imperiales", en: "tours/northern/imperial-cities", fr: "voyages/nord/cites-imperiales" },
  tourCiudadesImperiales45:    { es: "viajes/norte/ciudades_imperiales/programa_4n_5d",     en: "tours/northern/imperial-cities/program-4n-5d",     fr: "voyages/nord/cites-imperiales/programme-4n-5j" },
  tourCiudadesImperiales67:    { es: "viajes/norte/ciudades_imperiales/programa_6n_7d",     en: "tours/northern/imperial-cities/program-6n-7d",     fr: "voyages/nord/cites-imperiales/programme-6n-7j" },
  tourCiudadesImperialesRif67: { es: "viajes/norte/ciudadesimperiales_rif/programa_6n_7d", en: "tours/northern/imperial-cities-rif/program-6n-7d", fr: "voyages/nord/cites-imperiales-rif/programme-6n-7j" },
  tourCiudadesImperialesRif78: { es: "viajes/norte/ciudadesimperiales_rif/programa_7n_8d", en: "tours/northern/imperial-cities-rif/program-7n-8d", fr: "voyages/nord/cites-imperiales-rif/programme-7n-8j" },
  tourNorteTangerFez:          { es: "viajes/norte/tanger_fez",          en: "tours/northern/tangier-fez",     fr: "voyages/nord/tanger-fes" },
  tourTangerFez45:             { es: "viajes/norte/tanger_fez/programa_4n_5d", en: "tours/northern/tangier-fez/program-4n-5d", fr: "voyages/nord/tanger-fes/programme-4n-5j" },
  tourTangerFez56:             { es: "viajes/norte/tanger_fez/programa_5n_6d", en: "tours/northern/tangier-fez/program-5n-6d", fr: "voyages/nord/tanger-fes/programme-5n-6j" },
  tourFezTanger56:             { es: "viajes/norte/fez_tanger/programa_5n_6d", en: "tours/northern/fez-tangier/program-5n-6d", fr: "voyages/nord/fes-tanger/programme-5n-6j" },
  tourFezTanger67:             { es: "viajes/norte/fez_tanger/programa_6n_7d", en: "tours/northern/fez-tangier/program-6n-7d", fr: "voyages/nord/fes-tanger/programme-6n-7j" },
  tourAdventure:      { es: "viajes/aventura",           en: "tours/adventure",          fr: "voyages/aventure" },
  tourAventuraEnduroHub:  { es: "viajes/aventura/enduro",                en: "tours/adventure/enduro",                fr: "voyages/aventure/enduro" },
  tourEnduroAventura45:   { es: "viajes/aventura/enduro/programa_4n_5d", en: "tours/adventure/enduro/program-4n-5d",  fr: "voyages/aventure/enduro/programme-4n-5j" },
  tourEnduroAventura67:   { es: "viajes/aventura/enduro/programa_6n_7d", en: "tours/adventure/enduro/program-6n-7d",  fr: "voyages/aventure/enduro/programme-6n-7j" },
  upcomingDepartures: { es: "proximas_salidas",          en: "upcoming-departures",      fr: "prochains-departs" },
  tourBespoke:        { es: "viajesamedida",             en: "tailor-made-tours",        fr: "voyages-sur-mesure" },

  // About cluster
  about:              { es: "equipo",                    en: "team",                     fr: "equipe" },
  whatWeDo:           { es: "quehacemos",                en: "what-we-do",               fr: "ce-que-nous-faisons" },
  whatToSee:          { es: "que-ver-en-Marruecos",      en: "what-to-see-in-morocco",   fr: "que-voir-au-maroc" },
  events:             { es: "incentivos",                en: "incentives",               fr: "incentives" },

  morocco:            { es: "marruecos",                 en: "morocco",                  fr: "maroc" },
  contact:            { es: "contacto",                  en: "contact",                  fr: "contact" },

  // Interactive
  juego:              { es: "juego",                     en: "game",                     fr: "jeu" },
  // Editorial guides
  whenToTravel:       { es: "cuando-viajar",             en: "when-to-travel",           fr: "quand-partir" },
  blog:               { es: "blog",                      en: "blog",                     fr: "blog" },
  galeria:            { es: "galeria",                   en: "gallery",                  fr: "galerie" },
  favorites:          { es: "favoritos",                 en: "favorites",                fr: "favoris" },
};

/* Build a URL for a given language + routeId.
   Spanish lives at the root, EN/FR live under /<lang>/<slug>. */
export const pathFor = (lang, routeId = "home") => {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const slug = ROUTES[routeId]?.[safeLang] ?? "";

  if (safeLang === DEFAULT_LANG) {
    return slug ? `/${slug}` : "/";
  }
  return slug ? `/${safeLang}/${slug}` : `/${safeLang}`;
};

/* Given a pathname, identify { lang, routeId, slug }. */
export const resolvePath = (pathname) => {
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);

  const langCandidate = parts[0];
  const isPrefixed = PREFIXED_LANGS.includes(langCandidate);
  const lang = isPrefixed ? langCandidate : DEFAULT_LANG;
  const rest = isPrefixed ? parts.slice(1).join("/") : parts.join("/");

  if (!rest) return { lang, routeId: "home", slug: "" };

  for (const [routeId, slugs] of Object.entries(ROUTES)) {
    if (slugs[lang] === rest) {
      return { lang, routeId, slug: rest };
    }
  }
  return { lang, routeId: null, slug: rest };
};

/* Re-write the current path into a different language, preserving the page. */
export const rewriteForLang = (pathname, newLang) => {
  if (!SUPPORTED_LANGS.includes(newLang)) return pathname;
  const { routeId } = resolvePath(pathname);
  if (routeId) return pathFor(newLang, routeId);
  return pathFor(newLang, "home");
};
