// Editorial image galleries shown on each day of the program detail page.
// Each key is a `day.route_id`. Each gallery has 5-7 images with optional caption.
// kind: paisaje | hotel | gastronomia | cultura | ruta | actividad

const T = (es, en, fr) => ({ es, en, fr });

export const DAY_GALLERIES = {
  // Day 1 — Ouarzazate → Boumalne Dades
  "ad-ouarzazate-dades": [
    { src: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
      kind: "paisaje", caption: T("Cumbres del Alto Atlas al amanecer", "High Atlas summits at dawn", "Sommets du Haut Atlas à l'aube") },
    { src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
      kind: "ruta", caption: T("Carretera serpenteante de las Gargantas del Dadès", "Winding road of the Dades Gorges", "Route sinueuse des Gorges du Dadès") },
    { src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Valle del Dadès al atardecer", "Dades Valley at sunset", "Vallée du Dadès au coucher du soleil") },
    { src: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=1600&q=85",
      kind: "hotel", caption: T("Hotel Xaluca Dades 4★", "Hotel Xaluca Dades 4★", "Hôtel Xaluca Dadès 4★") },
    { src: "https://images.unsplash.com/photo-1519594445471-0e5f86b3fb09?auto=format&fit=crop&w=1600&q=85",
      kind: "cultura", caption: T("Campos de rosa damascena del Valle de las Rosas", "Damask rose fields in the Rose Valley", "Champs de rose de Damas dans la Vallée des Roses") },
    { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Mercado semanal de Boumalne Dades", "Boumalne Dades weekly market", "Marché hebdomadaire de Boumalne Dadès") },
  ],

  // Day 2 — Boumalne Dades → Erfoud
  "ad-todra-erfoud": [
    { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
      kind: "ruta", caption: T("Pistas del Alto Atlas Central en 4x4", "Off-road tracks of the Central High Atlas", "Pistes 4x4 du Haut Atlas Central") },
    { src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
      kind: "cultura", caption: T("Pueblo bereber de Boutaghrar", "Berber village of Boutaghrar", "Village berbère de Boutaghrar") },
    { src: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Gargantas del Todra · paredes de 160 m", "Todra Gorges · 160 m vertical walls", "Gorges du Todra · falaises de 160 m") },
    { src: "https://images.unsplash.com/photo-1519594445471-0e5f86b3fb09?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Palmeral de Tinerhir", "Tinerhir palm grove", "Palmeraie de Tinerhir") },
    { src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Erfoud · la puerta del desierto", "Erfoud · the gateway to the desert", "Erfoud · la porte du désert") },
    { src: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=1600&q=85",
      kind: "hotel", caption: T("Kasbah Hotel Xaluca · arquitectura única en Marruecos", "Kasbah Hotel Xaluca · unique architecture in Morocco", "Kasbah Hôtel Xaluca · architecture unique au Maroc") },
  ],

  // Day 3 — Erfoud → Erg Chebbi (Total Desert)
  "desert-bivouac": [
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
      kind: "paisaje", caption: T("Dunas del Erg Chebbi al atardecer", "Erg Chebbi dunes at sunset", "Dunes de l'Erg Chebbi au coucher du soleil") },
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
      kind: "actividad", caption: T("Caravana de dromedarios hacia el bivouac", "Camel caravan to the bivouac", "Caravane de dromadaires vers le bivouac") },
    { src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
      kind: "ruta", caption: T("Pistas históricas del Rally Dakar", "Historic Dakar Rally tracks", "Pistes historiques du Rallye Dakar") },
    { src: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85",
      kind: "cultura", caption: T("Fósiles devónicos de 360 millones de años", "360-million-year-old Devonian fossils", "Fossiles dévoniens de 360 millions d'années") },
    { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
      kind: "gastronomia", caption: T("Picnic en un oasis auténtico", "Picnic in an authentic oasis", "Pique-nique dans une oasis authentique") },
    { src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
      kind: "hotel", caption: T("Bivouac de Luxe · cena bajo las estrellas", "Bivouac de Luxe · dinner under the stars", "Bivouac de Luxe · dîner sous les étoiles") },
    { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Cielo absolutamente estrellado del Sahara", "Absolute Saharan starry sky", "Ciel étoilé absolu du Sahara") },
  ],

  // Day 4 — Sunrise + Khamlia + Rissani + Erfoud
  "khamlia-rissani": [
    { src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
      kind: "paisaje", caption: T("Amanecer sobre las dunas del Erg Chebbi", "Sunrise over the Erg Chebbi dunes", "Lever du soleil sur les dunes de l'Erg Chebbi") },
    { src: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
      kind: "cultura", caption: T("Música Gnawa en Khamlia · Patrimonio UNESCO", "Gnawa music in Khamlia · UNESCO heritage", "Musique Gnawa à Khamlia · patrimoine UNESCO") },
    { src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Pueblo abandonado de Merdani", "Abandoned village of Merdani", "Village abandonné de Merdani") },
    { src: "https://images.unsplash.com/photo-1519594445471-0e5f86b3fb09?auto=format&fit=crop&w=1600&q=85",
      kind: "cultura", caption: T("Mercado de Rissani · «parking de burros»", "Rissani market · the «donkey parking»", "Marché de Rissani · le « parking d'ânes »") },
    { src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
      kind: "gastronomia", caption: T("Té a la menta tradicional", "Traditional mint tea", "Thé à la menthe traditionnel") },
    { src: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=1600&q=85",
      kind: "hotel", caption: T("Piscina climatizada de Kasbah Xaluca", "Heated pool at Kasbah Xaluca", "Piscine chauffée de la Kasbah Xaluca") },
  ],

  // Day 5 — Erfoud → Errachidia (return)
  "ad-ziz-return": [
    { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
      kind: "paisaje", caption: T("Mirador del Valle del Ziz", "Ziz Valley viewpoint", "Mirador de la Vallée du Ziz") },
    { src: "https://images.unsplash.com/photo-1519594445471-0e5f86b3fb09?auto=format&fit=crop&w=1600&q=85",
      kind: "paisaje", caption: T("Más de un millón de palmeras datileras del Tafilalet", "Over a million Tafilalet date palms", "Plus d'un million de palmiers dattiers du Tafilalet") },
    { src: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85",
      kind: "cultura", caption: T("Khettaras · canales subterráneos medievales", "Khettaras · medieval underground channels", "Khettaras · canaux souterrains médiévaux") },
    { src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
      kind: "ruta", caption: T("Carretera panorámica al aeropuerto de Errachidia", "Scenic road to Errachidia airport", "Route panoramique vers l'aéroport d'Errachidia") },
    { src: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85",
      kind: "gastronomia", caption: T("Dátiles medjoul del oasis del Ziz", "Medjool dates from the Ziz oasis", "Dattes medjoul de l'oasis du Ziz") },
  ],
};

export const GALLERY_KIND_LABELS = {
  paisaje:     { es: "Paisaje",     en: "Landscape",     fr: "Paysage" },
  hotel:       { es: "Alojamiento", en: "Stay",          fr: "Hébergement" },
  gastronomia: { es: "Gastronomía", en: "Food",          fr: "Gastronomie" },
  cultura:     { es: "Cultura",     en: "Culture",       fr: "Culture" },
  ruta:        { es: "Ruta",        en: "Route",         fr: "Route" },
  actividad:   { es: "Actividad",   en: "Activity",      fr: "Activité" },
};
