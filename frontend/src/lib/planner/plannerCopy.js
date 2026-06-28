/* ============================================================
   plannerCopy.js — all trilingual UI strings for /planner.
============================================================ */
const T = (es, en, fr) => ({ es, en, fr });

export const PLANNER_COPY = {
  // Hero
  eyebrow: T("Planificador inteligente", "Smart trip planner", "Planificateur intelligent"),
  title: T(
    "Diseñemos juntos tu viaje por Marruecos.",
    "Let's design your Morocco trip together.",
    "Concevons ensemble votre voyage au Maroc.",
  ),
  subtitle: T(
    "Responde unas preguntas y nuestro motor —basado en distancias reales y en los circuitos que realmente operamos— te recomienda la ruta perfecta. Sin rutas imposibles.",
    "Answer a few questions and our engine —built on real driving distances and the circuits we actually operate— recommends your perfect route. No impossible itineraries.",
    "Répondez à quelques questions : notre moteur —fondé sur des distances réelles et les circuits que nous opérons— vous recommande l'itinéraire parfait. Aucun itinéraire impossible.",
  ),
  start: T("Empezar a planificar", "Start planning", "Commencer"),

  // Wizard chrome
  step: T("Paso", "Step", "Étape"),
  of: T("de", "of", "sur"),
  back: T("Atrás", "Back", "Retour"),
  next: T("Siguiente", "Next", "Suivant"),
  build: T("Crear mi viaje", "Build my trip", "Créer mon voyage"),
  restart: T("Empezar de nuevo", "Start over", "Recommencer"),

  step_labels: [
    T("Llegada", "Arrival", "Arrivée"),
    T("Salida", "Departure", "Départ"),
    T("Días", "Days", "Jours"),
    T("Destinos", "Destinations", "Destinations"),
    T("Estilo", "Style", "Style"),
    T("Ritmo", "Pace", "Rythme"),
  ],

  // Step 1
  s1_title: T("¿Por dónde llegas a Marruecos?", "Where do you arrive in Morocco?", "Où arrivez-vous au Maroc ?"),
  s1_help: T("Tu ciudad o aeropuerto de entrada.", "Your entry city or airport.", "Votre ville ou aéroport d'entrée."),
  // Step 2
  s2_title: T("¿Por dónde sales?", "Where do you leave from?", "D'où repartez-vous ?"),
  s2_help: T("Puedes terminar por la misma ciudad o hacer una ruta lineal.", "End in the same city or take a one-way route.", "Terminez par la même ville ou faites un trajet linéaire."),
  same_city: T("Por la misma ciudad", "Same city", "Même ville"),
  other_city: T("Por otra ciudad", "A different city", "Une autre ville"),
  // Step 3
  s3_title: T("¿Cuántos días tienes?", "How many days do you have?", "Combien de jours avez-vous ?"),
  s3_help: T("Cuenta los días en destino, vuelos incluidos.", "Count days on the ground, flights included.", "Comptez les jours sur place, vols inclus."),
  days_unit: T("días", "days", "jours"),
  custom: T("Personalizado", "Custom", "Personnalisé"),
  // Step 4
  s4_title: T("¿Qué quieres descubrir?", "What do you want to discover?", "Que voulez-vous découvrir ?"),
  s4_help: T("Elige todos los lugares que te atraen. Nosotros nos encargamos de la ruta.", "Pick every place that calls you. We'll handle the route.", "Choisissez tous les lieux qui vous attirent. On s'occupe de l'itinéraire."),
  selected: T("seleccionados", "selected", "sélectionnés"),
  // Step 5
  s5_title: T("¿Qué tipo de viaje buscas?", "What kind of trip are you after?", "Quel type de voyage cherchez-vous ?"),
  s5_help: T("Marca tantos estilos como quieras.", "Tick as many styles as you like.", "Cochez autant de styles que vous voulez."),
  // Step 6
  s6_title: T("¿A qué ritmo te gusta viajar?", "What's your travel pace?", "À quel rythme aimez-vous voyager ?"),
  s6_help: T("Esto ajusta cuántos kilómetros haremos cada día.", "This tunes how many kilometres we cover each day.", "Cela ajuste les kilomètres parcourus chaque jour."),
  pace: {
    "muy-relajado": { label: T("Muy relajado", "Very relaxed", "Très tranquille"), desc: T("Pocos traslados, mucho tiempo en cada lugar.", "Few transfers, lots of time per place.", "Peu de trajets, beaucoup de temps sur place.") },
    "relajado":     { label: T("Relajado", "Relaxed", "Tranquille"), desc: T("Días tranquilos con alguna ruta corta.", "Easy days with short drives.", "Journées calmes, courts trajets.") },
    "equilibrado":  { label: T("Equilibrado", "Balanced", "Équilibré"), desc: T("El punto medio: ves mucho sin agobios.", "The sweet spot: see a lot, stress-free.", "Le juste milieu : voir beaucoup, sans stress.") },
    "intenso":      { label: T("Intenso", "Intense", "Intense"), desc: T("Aprovechar al máximo cada día disponible.", "Make the most of every single day.", "Profiter au maximum de chaque journée.") },
  },

  // Validation
  pick_one: T("Selecciona una opción para continuar.", "Pick an option to continue.", "Choisissez une option pour continuer."),
  pick_dest: T("Selecciona al menos un destino.", "Select at least one destination.", "Sélectionnez au moins une destination."),

  // Result
  r_eyebrow: T("Tu viaje recomendado", "Your recommended trip", "Votre voyage recommandé"),
  r_viability: T("Viabilidad de tu selección", "Your selection's viability", "Viabilité de votre sélection"),
  r_match: T("compatible", "match", "compatible"),
  r_days: T("Días", "Days", "Jours"),
  r_nights: T("Noches", "Nights", "Nuits"),
  r_km: T("Kilómetros", "Kilometres", "Kilomètres"),
  r_drive: T("Conducción", "Driving", "Conduite"),
  r_intensity: T("Intensidad", "Intensity", "Intensité"),
  r_hours: T("h totales", "total h", "h au total"),
  r_timeline: T("Itinerario día a día", "Day-by-day route", "Itinéraire jour par jour"),
  r_included: T("Destinos incluidos", "Destinations included", "Destinations incluses"),
  r_excluded: T("Quedan fuera de esta ruta", "Left out of this route", "Hors de cet itinéraire"),
  r_excluded_hint: T("Los reservaríamos como extensión.", "We'd add these as an extension.", "Nous les ajouterions en extension."),
  r_advisor: T("Avisos del asesor", "Advisor notices", "Conseils de l'expert"),
  r_compatible: T("Otros viajes de Xaluca compatibles", "Other compatible Xaluca trips", "Autres voyages Xaluca compatibles"),
  r_matched_labels: {
    entry: T("llegada", "arrival", "arrivée"),
    exit: T("salida", "departure", "départ"),
    days: T("días", "days", "jours"),
    pace: T("ritmo", "pace", "rythme"),
  },
  cta_request: T("Solicitar este viaje", "Request this trip", "Demander ce voyage"),
  cta_view: T("Ver el viaje completo", "View the full trip", "Voir le voyage complet"),
  arrive_in: T("Llegada por", "Arrive via", "Arrivée par"),
  depart_from: T("Salida por", "Depart via", "Départ par"),
  loop_trip: T("Circular", "Round trip", "Boucle"),

  // Viability explanations (templated; {min},{days},{h},{km} replaced)
  exp_green: T(
    "Excelente. Con {days} días recorres esta ruta con holgura: tiempo de sobra en cada parada y trayectos cómodos (~{h} h de conducción en total).",
    "Excellent. With {days} days you cover this route comfortably: plenty of time per stop and easy drives (~{h} h total).",
    "Excellent. Avec {days} jours, vous parcourez cette route à l'aise : du temps à chaque étape et des trajets confortables (~{h} h au total).",
  ),
  exp_yellow: T(
    "Posible. Con {days} días encaja, aunque algún día tendrá más carretera (~{h} h en total, {km} km). Recomendado: {min} días para ir sin prisas.",
    "Possible. {days} days works, though some days carry more driving (~{h} h total, {km} km). Recommended: {min} days for an unhurried pace.",
    "Possible. {days} jours conviennent, mais certaines journées seront plus longues (~{h} h, {km} km). Recommandé : {min} jours sans hâte.",
  ),
  exp_orange: T(
    "Muy intenso. Has elegido bastante para {days} días: pasarías muchas horas en carretera (~{h} h, {km} km). Lo ideal serían {min} días.",
    "Very intense. That's a lot for {days} days: you'd spend many hours driving (~{h} h, {km} km). Ideally {min} days.",
    "Très intense. C'est beaucoup pour {days} jours : de nombreuses heures de route (~{h} h, {km} km). L'idéal serait {min} jours.",
  ),
  exp_red: T(
    "No recomendado tal cual. Con {days} días, tu selección obliga a ~{h} h de conducción ({km} km): el viaje se convertiría en una sucesión de traslados. Necesitarías unos {min} días — o quedarte con la ruta recomendada abajo.",
    "Not recommended as is. In {days} days your selection forces ~{h} h of driving ({km} km): the trip would become one long transfer. You'd need about {min} days — or take the recommended route below.",
    "Non recommandé tel quel. En {days} jours, votre sélection impose ~{h} h de route ({km} km) : le voyage deviendrait une suite de trajets. Il faudrait ~{min} jours — ou choisir l'itinéraire recommandé ci-dessous.",
  ),
  exp_none: T(
    "Cuéntanos qué lugares te gustaría visitar y calcularemos al instante la viabilidad de tu ruta.",
    "Tell us which places you'd like to visit and we'll instantly assess your route's viability.",
    "Dites-nous quels lieux vous aimeriez visiter et nous évaluerons aussitôt la faisabilité.",
  ),
};

export default PLANNER_COPY;
