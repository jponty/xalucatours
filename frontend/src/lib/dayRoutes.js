// Coordinates for day-by-day route maps shown in ProgramTemplate.
// Each key is a `day.id` from programData.js. Values are arrays of
// "[name, lat, lng, kind]" tuples in travel order.
// kind: "start" | "stop" | "end" | "overnight"

export const DAY_ROUTES = {
  // Atlas → Desert direction (ad)
  "ad-ouarzazate-dades": [
    ["Ouarzazate", 30.9189, -6.8934, "start"],
    ["Skoura", 31.0612, -6.5544, "stop"],
    ["Boumalne Dades", 31.3580, -5.9870, "overnight"],
  ],
  "ad-todra-erfoud": [
    ["Boumalne Dades", 31.3580, -5.9870, "start"],
    ["Boutaghrar", 31.5230, -6.0440, "stop"],
    ["Tinerhir", 31.5147, -5.5331, "stop"],
    ["Gargantas del Todra", 31.5847, -5.5894, "stop"],
    ["Erfoud", 31.4358, -4.2380, "overnight"],
  ],
  "atlas-mgoun": [
    ["Boumalne Dades", 31.3580, -5.9870, "start"],
    ["Valle del M'Goun", 31.6620, -6.4400, "stop"],
    ["Boutaghrar", 31.5230, -6.0440, "stop"],
    ["Boumalne Dades", 31.3580, -5.9870, "end"],
  ],
  "ad-dades-todra-erfoud": [
    ["Boumalne Dades", 31.3580, -5.9870, "start"],
    ["Gargantas del Dades", 31.4900, -5.9050, "stop"],
    ["Tinerhir", 31.5147, -5.5331, "stop"],
    ["Gargantas del Todra", 31.5847, -5.5894, "stop"],
    ["Erfoud", 31.4358, -4.2380, "overnight"],
  ],
  "desert-bivouac": [
    ["Erfoud", 31.4358, -4.2380, "start"],
    ["Pista Dakar", 31.2200, -4.1100, "stop"],
    ["Canteras de fósiles", 31.3500, -4.1900, "stop"],
    ["Oasis (picnic)", 31.2000, -4.0800, "stop"],
    ["Erg Chebbi · Bivouac", 31.0995, -4.0128, "overnight"],
  ],
  "khamlia-rissani": [
    ["Erg Chebbi", 31.0995, -4.0128, "start"],
    ["Merdani", 31.1900, -3.9300, "stop"],
    ["Khamlia", 31.0470, -3.9750, "stop"],
    ["Rissani", 31.2820, -4.2620, "stop"],
    ["Erfoud", 31.4358, -4.2380, "overnight"],
  ],
  "khamlia-merdani": [
    ["Erg Chebbi", 31.0995, -4.0128, "start"],
    ["Merdani", 31.1900, -3.9300, "stop"],
    ["Khamlia", 31.0470, -3.9750, "stop"],
    ["Erfoud", 31.4358, -4.2380, "overnight"],
  ],
  "rissani-relax": [
    ["Erfoud", 31.4358, -4.2380, "start"],
    ["Rissani", 31.2820, -4.2620, "stop"],
    ["Kasbah Xaluca", 31.4500, -4.2100, "overnight"],
  ],
  "ad-ziz-return": [
    ["Erfoud", 31.4358, -4.2380, "start"],
    ["Valle del Ziz", 31.6500, -4.3500, "stop"],
    ["Errachidia", 31.9314, -4.4244, "end"],
  ],

  // Desert → Atlas direction (da)
  "da-arrival-erfoud": [
    ["Errachidia", 31.9314, -4.4244, "start"],
    ["Valle del Ziz", 31.6500, -4.3500, "stop"],
    ["Erfoud", 31.4358, -4.2380, "overnight"],
  ],
  "da-rissani-erfoud": [
    ["Erg Chebbi", 31.0995, -4.0128, "start"],
    ["Khamlia", 31.0470, -3.9750, "stop"],
    ["Rissani", 31.2820, -4.2620, "stop"],
    ["Erfoud", 31.4358, -4.2380, "overnight"],
  ],
  "da-todra-dades": [
    ["Erfoud", 31.4358, -4.2380, "start"],
    ["Gargantas del Todra", 31.5847, -5.5894, "stop"],
    ["Tinerhir", 31.5147, -5.5331, "stop"],
    ["Gargantas del Dades", 31.4900, -5.9050, "stop"],
    ["Boumalne Dades", 31.3580, -5.9870, "overnight"],
  ],
  "da-mgoun": [
    ["Boumalne Dades", 31.3580, -5.9870, "start"],
    ["Valle del M'Goun", 31.6620, -6.4400, "stop"],
    ["Boutaghrar", 31.5230, -6.0440, "stop"],
    ["Boumalne Dades", 31.3580, -5.9870, "end"],
  ],
  "da-return-ouarzazate": [
    ["Boumalne Dades", 31.3580, -5.9870, "start"],
    ["Skoura", 31.0612, -6.5544, "stop"],
    ["Ouarzazate", 30.9189, -6.8934, "end"],
  ],
};

// Compute bounds for a route — used to fit map view.
export const computeBounds = (route) => {
  if (!route || route.length === 0) return null;
  const lats = route.map((p) => p[1]);
  const lngs = route.map((p) => p[2]);
  return [
    [Math.min(...lats) - 0.15, Math.min(...lngs) - 0.15],
    [Math.max(...lats) + 0.15, Math.max(...lngs) + 0.15],
  ];
};
