import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Calendar, MapPin, Plane, Clock,
  Check, X, Sparkles, Phone, Mail, ChevronRight, Star,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import ContactForm from "@/components/ContactForm";
import VideoSection from "@/components/VideoSection";

/* ============================================================
   FIN DE AÑO 2026 EN EL DESIERTO DE MARRUECOS
   ----
   One-off special-departure landing page. Self-contained — does
   not reuse ProgramTemplate because of the fixed-date pricing,
   flight info and contracting conditions sections.
============================================================ */

const COPY = {
  hero: {
    eyebrow: { es: "Del 27 de diciembre al 1 de enero · Vuelo especial directo", en: "From 27 Dec to 1 Jan · Special direct flight", fr: "Du 27 déc. au 1ᵉʳ jan. · Vol spécial direct" },
    place: { es: "Sahara · Erg Chebbi · Atlas Central", en: "Sahara · Erg Chebbi · Central Atlas", fr: "Sahara · Erg Chebbi · Atlas Central" },
    title: { es: "Fin de Año 2026 en el desierto de Marruecos.", en: "New Year 2026 in the Moroccan desert.", fr: "Réveillon 2026 dans le désert marocain." },
    subtitle: {
      es: "Seis días para despedir el año bajo las dunas del Erg Chebbi, brindar entre las haimas y empezar enero con el silencio del Sahara.",
      en: "Six days to close the year under the Erg Chebbi dunes, toast among the tents and open January with the silence of the Sahara.",
      fr: "Six jours pour clore l'année sous les dunes de l'Erg Chebbi, trinquer entre les tentes et commencer janvier dans le silence du Sahara.",
    },
  },
  cta: {
    primary: { es: "Reservar plaza", en: "Book your seat", fr: "Réserver" },
    secondary: { es: "Hablar con un asesor", en: "Talk to an advisor", fr: "Parler à un conseiller" },
  },
  overview: {
    overline: { es: "Información del viaje", en: "Trip information", fr: "Informations" },
    duration: { es: "5 noches · 6 días", en: "5 nights · 6 days", fr: "5 nuits · 6 jours" },
    places: {
      es: "Ouarzazate · Boumalne Dades · Boutaghrar · Amskar · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Errachidia",
      en: "Ouarzazate · Boumalne Dades · Boutaghrar · Amskar · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Errachidia",
      fr: "Ouarzazate · Boumalne Dadès · Boutaghrar · Amskar · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Errachidia",
    },
    airports: { es: "Ouarzazate / Errachidia", en: "Ouarzazate / Errachidia", fr: "Ouarzazate / Errachidia" },
    price: { es: "1.980 € por persona", en: "€1,980 per person", fr: "1 980 € par personne" },
    priceNote: { es: "Vuelo privado directo · Tasas no incluidas (120 €)", en: "Private direct flight · Taxes not included (€120)", fr: "Vol privé direct · Taxes non incluses (120 €)" },
  },
  itinerary: {
    overline: { es: "Itinerario · día a día", en: "Itinerary · day by day", fr: "Itinéraire · jour par jour" },
    title: { es: "Seis días entre el Atlas y el gran Erg Chebbi.", en: "Six days between the Atlas and the great Erg Chebbi.", fr: "Six jours entre l'Atlas et le grand Erg Chebbi." },
  },
  inclusions: {
    title: { es: "El precio incluye", en: "Price includes", fr: "Le prix comprend" },
    items: [
      { es: "2 noches en Hotel Xaluca Dades 4*", en: "2 nights at Hotel Xaluca Dades 4*", fr: "2 nuits à l'Hotel Xaluca Dadès 4*" },
      { es: "2 noches en Kasbah Xaluca", en: "2 nights at Kasbah Xaluca", fr: "2 nuits à la Kasbah Xaluca" },
      { es: "1 noche en bivouac de haimas en Erg Chebbi", en: "1 night in a Berber-tent bivouac at Erg Chebbi", fr: "1 nuit en bivouac sous tente à l'Erg Chebbi" },
      { es: "Régimen de media pensión", en: "Half-board basis", fr: "Demi-pension" },
      { es: "Comidas y picnics especificados en el programa", en: "Meals and picnics as detailed in the programme", fr: "Repas et pique-niques selon le programme" },
      { es: "Cena bereber con folklore local", en: "Berber dinner with local folklore", fr: "Dîner berbère avec folklore local" },
      { es: "Cena y fiesta de Fin de Año", en: "New Year's Eve dinner & party", fr: "Dîner et fête du Nouvel An" },
      { es: "Excursión en dromedario", en: "Camel excursion", fr: "Excursion à dos de dromadaire" },
      { es: "Excursiones por el desierto y el Atlas", en: "Desert and Atlas excursions", fr: "Excursions dans le désert et l'Atlas" },
      { es: "Vehículos 4x4 con chófer + combustible", en: "4x4 vehicles with driver + fuel", fr: "Véhicules 4x4 avec chauffeur + carburant" },
      { es: "Guía acompañante-coordinador", en: "Travelling guide-coordinator", fr: "Guide accompagnateur-coordinateur" },
      { es: "Vuelo especial directo", en: "Special direct flight", fr: "Vol spécial direct" },
      { es: "Seguro de asistencia y cancelación (consultar)", en: "Travel & cancellation insurance (conditions apply)", fr: "Assurance assistance et annulation (conditions)" },
    ],
  },
  exclusions: {
    title: { es: "No incluye", en: "Not included", fr: "Non inclus" },
    items: [
      { es: "Bebidas", en: "Drinks", fr: "Boissons" },
      { es: "Quads", en: "Quads", fr: "Quads" },
      { es: "Hammam y masajes", en: "Hammam and massages", fr: "Hammam et massages" },
      { es: "Extras personales", en: "Personal extras", fr: "Extras personnels" },
      { es: "Tasas de aeropuerto (120 € por persona)", en: "Airport taxes (€120 per person)", fr: "Taxes d'aéroport (120 € par personne)" },
    ],
  },
  pricing: {
    overline: { es: "Paquete alojamiento + excursiones", en: "Accommodation + excursions package", fr: "Forfait hébergement + excursions" },
    title: { es: "Precio del viaje.", en: "Trip price.", fr: "Prix du voyage." },
    adults: { es: "Adultos", en: "Adults", fr: "Adultes" },
    adultsPrice: { es: "1.980 €", en: "€1,980", fr: "1 980 €" },
    adultsNote: { es: "por persona*", en: "per person*", fr: "par personne*" },
    children: { es: "Niños", en: "Children", fr: "Enfants" },
    childrenPrice: { es: "1.540 €", en: "€1,540", fr: "1 540 €" },
    childrenNote: { es: "por niño · 3 a 11 años, mín. 2 adultos*", en: "per child · ages 3 to 11, min. 2 adults*", fr: "par enfant · 3 à 11 ans, min. 2 adultes*" },
    single: { es: "Suplemento habitación individual", en: "Single-room supplement", fr: "Supplément chambre individuelle" },
    singlePrice: { es: "335 €", en: "€335", fr: "335 €" },
    singleNote: { es: "por persona", en: "per person", fr: "par personne" },
    asterisk: { es: "* Tasas de aeropuerto no incluidas (120 € por persona).", en: "* Airport taxes not included (€120 per person).", fr: "* Taxes d'aéroport non incluses (120 € par personne)." },
  },
  notes: {
    overline: { es: "Notas importantes", en: "Important notes", fr: "Notes importantes" },
    blocks: [
      {
        title: { es: "Vuelo", en: "Flight", fr: "Vol" },
        body: {
          es: "Las tasas de aeropuerto pueden sufrir variaciones hasta 21 días antes de la salida. Los horarios de vuelo también pueden modificarse ligeramente.",
          en: "Airport taxes may change up to 21 days before departure. Flight times are also subject to slight changes.",
          fr: "Les taxes d'aéroport peuvent varier jusqu'à 21 jours avant le départ. Les horaires de vol peuvent légèrement changer.",
        },
      },
      {
        title: { es: "Documentación", en: "Documentation", fr: "Documents" },
        body: {
          es: "Es obligatorio viajar con pasaporte vigente con validez mínima de 3 meses desde la fecha de regreso.",
          en: "A valid passport with at least 3 months' validity from the return date is mandatory.",
          fr: "Passeport valide pendant au moins 3 mois après la date de retour obligatoire.",
        },
      },
      {
        title: { es: "Condiciones del viaje", en: "Trip conditions", fr: "Conditions du voyage" },
        body: {
          es: "Viaje sujeto a condiciones especiales por fletamento privado. Cancelaciones a partir del 23 de septiembre de 2026 perderán la paga y señal de 800 €. Plazas limitadas.",
          en: "Trip subject to special conditions due to private charter. Cancellations from 23 September 2026 forfeit the €800 deposit. Limited seats.",
          fr: "Voyage soumis à conditions spéciales (affrètement privé). Annulations à partir du 23 septembre 2026 : perte de l'acompte de 800 €. Places limitées.",
        },
      },
      {
        title: { es: "Actividades opcionales", en: "Optional activities", fr: "Activités optionnelles" },
        body: {
          es: "Excursión en quad: 70 € por vehículo (1 hora). Hammam y masajes reservables en hotel.",
          en: "Quad tour: €70 per vehicle (1 hour). Hammam and massages bookable at the hotel.",
          fr: "Excursion en quad : 70 € par véhicule (1 h). Hammam et massages réservables à l'hôtel.",
        },
      },
    ],
  },
  contracting: {
    overline: { es: "Condiciones de contratación", en: "Booking conditions", fr: "Conditions de réservation" },
    title: { es: "Reserva tu plaza.", en: "Book your seat.", fr: "Réservez votre place." },
    booking: {
      title: { es: "Reserva", en: "Booking", fr: "Réservation" },
      body: {
        es: "Para confirmar la reserva será necesario completar la ficha de inscripción y realizar el pago de la paga y señal.",
        en: "To confirm your booking, complete the registration form and pay the deposit.",
        fr: "Pour confirmer la réservation, remplir la fiche d'inscription et payer l'acompte.",
      },
    },
    payment: {
      title: { es: "Forma de pago", en: "Payment", fr: "Paiement" },
      items: [
        { es: "Transferencia bancaria", en: "Bank transfer", fr: "Virement bancaire" },
        { es: "Tarjeta Visa", en: "Visa card", fr: "Carte Visa" },
      ],
      deposit: { label: { es: "Paga y señal", en: "Deposit", fr: "Acompte" }, value: { es: "800 € por persona", en: "€800 per person", fr: "800 € par personne" } },
      final: { label: { es: "Pago final", en: "Final payment", fr: "Solde" }, value: { es: "Antes del 23 de noviembre de 2026", en: "Before 23 November 2026", fr: "Avant le 23 novembre 2026" } },
    },
    cancel: {
      title: { es: "Gastos de cancelación", en: "Cancellation fees", fr: "Frais d'annulation" },
      items: [
        { es: "Desde el 23 de septiembre de 2026: pérdida de la paga y señal de 800 €.", en: "From 23 September 2026: loss of the €800 deposit.", fr: "À partir du 23 septembre 2026 : perte de l'acompte de 800 €." },
        { es: "Desde el 1 de diciembre de 2026: 100 % del importe total del viaje.", en: "From 1 December 2026: 100% of the total trip price.", fr: "À partir du 1ᵉʳ décembre 2026 : 100 % du prix total." },
        { es: "Gastos de gestión: 50 € por persona.", en: "Management fees: €50 per person.", fr: "Frais de dossier : 50 € par personne." },
        { es: "Los seguros contratados no son reembolsables.", en: "Insurance policies are non-refundable.", fr: "Les assurances ne sont pas remboursables." },
      ],
    },
  },
  contact: {
    overline: { es: "¿Te interesa este viaje?", en: "Interested?", fr: "Intéressé(e) ?" },
    title: { es: "Contacta sin compromiso.", en: "Get in touch — no commitment.", fr: "Contactez-nous, sans engagement." },
    body: {
      es: "Te ayudaremos a organizar todos los detalles de tu próxima aventura.",
      en: "We'll help you arrange every detail of your next adventure.",
      fr: "Nous vous aiderons à organiser chaque détail de votre prochaine aventure.",
    },
    hours: { es: "De lunes a viernes · 10h – 20h", en: "Mon to Fri · 10h – 20h", fr: "Du lundi au vendredi · 10h – 20h" },
    hoursLabel: { es: "Horario de oficina", en: "Office hours", fr: "Horaires" },
  },
};

const ITINERARY = [
  {
    id: "27-dic",
    dateLabel: { es: "Domingo · 27 de diciembre", en: "Sunday · 27 December", fr: "Dimanche 27 décembre" },
    title: { es: "Llegada a Marruecos · Aït Ben Haddou", en: "Arrival in Morocco · Aït Ben Haddou", fr: "Arrivée au Maroc · Aït Ben Haddou" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
    body: {
      es: "Salida a las 09:00h en vuelo directo desde Barcelona hacia Ouarzazate (llegada 11:20h). Trámites de entrada y recogida en vehículos 4x4 con chófer. Almuerzo en Ouarzazate. Por la tarde visitamos Aït Ben Haddou, ksar Patrimonio de la Humanidad UNESCO escenario de «Gladiator» o «Lawrence de Arabia». Continuamos hacia Boumalne Dades, en pleno Valle de los Pájaros a 1.612 m. Cena y alojamiento en Hotel Xaluca Dades 4*.",
      en: "Departure at 09:00 on a direct flight from Barcelona to Ouarzazate (arrival 11:20). Immigration and pickup in 4x4 vehicles with driver. Lunch in Ouarzazate. In the afternoon, visit to Aït Ben Haddou, UNESCO World Heritage ksar — location for «Gladiator» and «Lawrence of Arabia». We continue to Boumalne Dades, in the Valley of Birds at 1,612 m. Dinner and accommodation at Hotel Xaluca Dades 4*.",
      fr: "Départ à 09h00 sur vol direct Barcelone-Ouarzazate (arrivée 11h20). Formalités d'entrée et accueil en 4x4 avec chauffeur. Déjeuner à Ouarzazate. L'après-midi, visite d'Aït Ben Haddou, ksar inscrit à l'UNESCO — décor de « Gladiator » et « Lawrence d'Arabie ». Route vers Boumalne Dadès, dans la Vallée des Oiseaux à 1 612 m. Dîner et hébergement à l'Hôtel Xaluca Dadès 4*.",
    },
    footnote: {
      es: "Los horarios de vuelo pueden sufrir ligeras modificaciones y se reconfirmarán 21 días antes de la salida.",
      en: "Flight times are subject to minor changes and will be re-confirmed 21 days before departure.",
      fr: "Les horaires de vol peuvent légèrement varier et seront reconfirmés 21 jours avant le départ.",
    },
  },
  {
    id: "28-dic",
    dateLabel: { es: "Lunes · 28 de diciembre", en: "Monday · 28 December", fr: "Lundi 28 décembre" },
    title: { es: "Alto Atlas Central · Boutaghrar y Amskar", en: "Central High Atlas · Boutaghrar and Amskar", fr: "Haut Atlas Central · Boutaghrar et Amskar" },
    image: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=2000&q=85",
    body: {
      es: "Nos adentramos por pistas en lo más profundo del Alto Atlas Central. Visitamos poblados bereberes como Boutaghrar y Amskar, donde se conserva intacta la vida tradicional de montaña. Contemplaremos montañas, cañones, valles y grutas donde aún viven familias nómadas. Recorreremos las impresionantes Gargantas del M'Goun. Comida picnic durante la excursión. Cena y alojamiento en Hotel Xaluca Dades 4*.",
      en: "We head deep into the Central High Atlas on mountain tracks. We visit Berber villages like Boutaghrar and Amskar, where traditional mountain life is preserved. Mountains, canyons, valleys and caves where nomadic families still live. The spectacular M'Goun gorges. Picnic lunch on the excursion. Dinner and accommodation at Hotel Xaluca Dades 4*.",
      fr: "Nous entrons par pistes au cœur du Haut Atlas Central. Visite de villages berbères comme Boutaghrar et Amskar, où la vie traditionnelle de montagne est intacte. Montagnes, canyons, vallées et grottes où vivent encore des familles nomades. Spectaculaires gorges du M'Goun. Pique-nique pendant l'excursion. Dîner et hébergement à l'Hôtel Xaluca Dadès 4*.",
    },
    callout: {
      label: { es: "Acción solidaria", en: "Solidarity action", fr: "Action solidaire" },
      body: {
        es: "Siguiendo la tradición del viaje, invitamos a los viajeros a traer voluntariamente alguna prenda de abrigo para familias de los pueblos de montaña del Atlas.",
        en: "Following the trip's tradition, travellers are warmly invited to bring a piece of warm clothing for the Atlas mountain families.",
        fr: "Selon la tradition du voyage, nous invitons les voyageurs à apporter un vêtement chaud pour les familles des villages de montagne de l'Atlas.",
      },
    },
  },
  {
    id: "29-dic",
    dateLabel: { es: "Martes · 29 de diciembre", en: "Tuesday · 29 December", fr: "Mardi 29 décembre" },
    title: { es: "Valle del Dades · Gargantas del Todra · Erfoud", en: "Dades Valley · Todra gorges · Erfoud", fr: "Vallée du Dadès · gorges du Todra · Erfoud" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
    body: {
      es: "Recorremos el Valle del Dades hasta el final de las gargantas, té en un espectacular mirador. De regreso visitamos las famosas formaciones «Patas de Mono». Comida en el hotel. Por la tarde salida hacia Erfoud por algunos de los paisajes más emblemáticos del sur de Marruecos. Pasamos por Tinerhir y visitamos las impresionantes Gargantas del Todra. Llegada a Erfoud, «La Puerta del Desierto». Cena y alojamiento en Kasbah Xaluca.",
      en: "We follow the Dades Valley up to the end of the gorges and have tea at a spectacular viewpoint. On the way back we visit the famous «Monkey Paws» rock formations. Lunch at the hotel. Afternoon transfer to Erfoud through southern Morocco's most iconic landscapes. We pass Tinerhir and visit the impressive Todra gorges. Arrival in Erfoud, «the Gate of the Desert». Dinner and accommodation at Kasbah Xaluca.",
      fr: "Vallée du Dadès jusqu'à la fin des gorges, thé sur un mirador spectaculaire. Retour par les formations rocheuses « Pattes de Singe ». Déjeuner à l'hôtel. L'après-midi, route vers Erfoud à travers les paysages emblématiques du sud marocain. Passage à Tinerhir et visite des gorges du Todra. Arrivée à Erfoud, « la porte du désert ». Dîner et hébergement à la Kasbah Xaluca.",
    },
  },
  {
    id: "30-dic",
    dateLabel: { es: "Miércoles · 30 de diciembre", en: "Wednesday · 30 December", fr: "Mercredi 30 décembre" },
    title: { es: "Pistas del Dakar · noche en bivouac bajo las estrellas", en: "Dakar tracks · night in a desert bivouac under the stars", fr: "Pistes du Dakar · nuit en bivouac sous les étoiles" },
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
    body: {
      es: "Jornada de desierto total. Recorremos pistas del Rally Dakar y visitamos pequeños poblados y familias nómadas. Parada en impresionantes canteras de fósiles marinos de más de 360 millones de años. Comida picnic en un oasis. Continuamos hasta el Gran Erg Chebbi, famoso por sus dunas doradas. Cambiamos los 4x4 por dromedarios para adentrarnos lentamente en las dunas y disfrutar de una inolvidable puesta de sol. Llegada al Bivouac La Belle Étoile, donde dormimos en auténticas haimas bereberes. Cena tradicional con folklore local bajo el cielo estrellado del Sahara.",
      en: "Full day of desert. We ride Rally Dakar tracks and visit small villages and nomadic families. Stop at impressive marine-fossil quarries over 360 million years old. Picnic lunch in an oasis. We continue to the Great Erg Chebbi, famous for its golden dunes. We swap the 4x4 for camels and slowly enter the dunes to enjoy an unforgettable sunset. Arrival at La Belle Étoile bivouac for the night in authentic Berber tents. Traditional dinner with local folklore under the starry Saharan sky.",
      fr: "Journée de désert total. Pistes du Rallye Dakar, petits villages et familles nomades. Arrêt aux impressionnantes carrières de fossiles marins de plus de 360 millions d'années. Pique-nique dans un oasis. Route vers le Grand Erg Chebbi et ses dunes dorées. Nous laissons les 4x4 pour les dromadaires et entrons lentement dans les dunes pour un coucher de soleil inoubliable. Arrivée au bivouac La Belle Étoile, nuit en authentiques tentes berbères. Dîner traditionnel avec folklore local sous le ciel étoilé du Sahara.",
    },
  },
  {
    id: "31-dic",
    dateLabel: { es: "Jueves · 31 de diciembre", en: "Thursday · 31 December", fr: "Jeudi 31 décembre" },
    title: { es: "Cita con el amanecer · Khamlia · Cena y Fiesta de Fin de Año", en: "Sunrise date · Khamlia · New Year's Eve dinner & party", fr: "Rendez-vous avec l'aube · Khamlia · Dîner et fête du Nouvel An" },
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
    body: {
      es: "Auténtica «Cita con el Amanecer» — recomendamos madrugar para contemplar el sol sobre las dunas del Sahara. Salida en 4x4 rodeando el Gran Erg Chebbi hasta el pueblo abandonado de Merdani. Continuación a Khamlia, pueblo de origen maliense con música y danzas africanas tradicionales acompañadas de té a la menta. Visita al mercado tradicional de Rissani. Comida en la auténtica pizzería bereber Des Dunes, en Erfoud. Por la tarde regreso a Kasbah Xaluca: piscina climatizada, jacuzzi y opcionalmente hammam, masajes o excursiones en quad. 13ª edición de la San Silvestre. Por la noche, la gran Cena y Fiesta de Fin de Año en pleno corazón del desierto.",
      en: "An authentic «Date with Dawn» — we recommend rising early to watch the sun over the Saharan dunes. 4x4 ride around the Great Erg Chebbi to the abandoned village of Merdani. We continue to Khamlia, a village of Malian origin with traditional African music and dances accompanied by mint tea. Visit to Rissani's traditional market. Lunch at the genuine Berber pizzeria «Des Dunes» in Erfoud. Afternoon back at Kasbah Xaluca: heated pool, jacuzzi, optional hammam, massages or quad tours. 13th edition of the San Silvestre run. At night, the great New Year's Eve dinner and party in the heart of the desert.",
      fr: "Une véritable « rencontre avec l'aube » — nous conseillons de se lever tôt pour contempler le soleil sur les dunes du Sahara. Sortie en 4x4 autour du Grand Erg Chebbi jusqu'au village abandonné de Merdani. Continuation vers Khamlia, village d'origine malienne avec musiques et danses africaines traditionnelles et thé à la menthe. Visite du marché de Rissani. Déjeuner à l'authentique pizzeria berbère « Des Dunes », à Erfoud. L'après-midi, retour à la Kasbah Xaluca : piscine chauffée, jacuzzi, hammam en option, massages ou excursions en quad. 13ᵉ édition de la San Silvestre. Le soir, grand dîner et fête du Nouvel An au cœur du désert.",
    },
  },
  {
    id: "1-ene",
    dateLabel: { es: "Viernes · 1 de enero", en: "Friday · 1 January", fr: "Vendredi 1ᵉʳ janvier" },
    title: { es: "Mirador del Erg Chebbi · Valle del Ziz · regreso", en: "Erg Chebbi viewpoint · Ziz Valley · return", fr: "Mirador de l'Erg Chebbi · vallée du Ziz · retour" },
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
    body: {
      es: "Subimos a un espectacular mirador natural para despedirnos del desierto con una última panorámica del Erg Chebbi. Regreso a Erfoud para visitar una auténtica kasbah centenaria y un museo de artesanía bereber. Comida en Kasbah Xaluca. Traslado al aeropuerto de Errachidia atravesando el impresionante Valle del Ziz, uno de los oasis más grandes de Marruecos. Salida del vuelo de regreso a las 18:00h. Llegada prevista a Barcelona sobre las 20:35h.",
      en: "We climb to a spectacular natural viewpoint to bid farewell to the desert with a final panorama of the Erg Chebbi. Back in Erfoud we visit a century-old kasbah and a Berber craft museum. Lunch at Kasbah Xaluca. Transfer to Errachidia airport through the impressive Ziz Valley, one of Morocco's largest oases. Return flight at 18:00. Arrival in Barcelona around 20:35.",
      fr: "Montée à un spectaculaire mirador naturel pour dire au revoir au désert sur une dernière vue de l'Erg Chebbi. Retour à Erfoud pour visiter une kasbah centenaire et un musée de l'artisanat berbère. Déjeuner à la Kasbah Xaluca. Transfert à l'aéroport d'Errachidia par la spectaculaire vallée du Ziz, l'une des plus grandes oasis du Maroc. Vol retour à 18h00. Arrivée à Barcelone vers 20h35.",
    },
  },
];

const VIDEO = {
  src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  poster: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
  eyebrow: { es: "Nochevieja en el Sahara", en: "New Year's Eve in the Sahara", fr: "Réveillon au Sahara" },
  title: {
    es: "Brindar bajo las dunas del Erg Chebbi.",
    en: "A toast under the Erg Chebbi dunes.",
    fr: "Un toast sous les dunes de l'Erg Chebbi.",
  },
  caption: {
    es: "Cinco noches entre el Atlas y el gran Erg Chebbi, fiesta bereber y amanecer del 1 de enero entre las haimas.",
    en: "Five nights between the Atlas and the great Erg Chebbi, Berber party and 1-January sunrise from the tents.",
    fr: "Cinq nuits entre l'Atlas et le grand Erg Chebbi, fête berbère et lever de soleil du 1ᵉʳ janvier depuis les tentes.",
  },
};

/* ===========================================================
   Component
=========================================================== */
export default function FinDeAno2026Page() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = `${pick(COPY.hero.title, lang)} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [lang]);

  return (
    <div data-testid="findeano-2026-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <Overview lang={lang} />
      <VideoSection {...VIDEO} testid="findeano-video" />
      <Itinerary lang={lang} />
      <Pricing lang={lang} />
      <Inclusions lang={lang} />
      <Notes lang={lang} />
      <Contracting lang={lang} />
      <ContactBand lang={lang} />
      <div id="form"><ContactForm /></div>
    </div>
  );
}

/* ============================================================
   Hero
============================================================ */
function Hero({ lang }) {
  return (
    <section
      data-testid="findeano-hero"
      className="relative min-h-[92vh] flex items-end overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2800&q=85"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/55 to-[#1A1513]/30" />
      <span className="film-grain pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <span className="overline text-[#D4A373]" data-testid="findeano-hero-eyebrow">
          {pick(COPY.hero.eyebrow, lang)}
        </span>
        <h1
          data-testid="findeano-hero-title"
          className="font-serif-x text-[#FDFBF7] text-4xl sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mt-6 max-w-5xl"
        >
          {pick(COPY.hero.title, lang)}
        </h1>
        <p className="mt-7 text-[#FDFBF7]/85 text-base md:text-lg max-w-2xl leading-relaxed">
          {pick(COPY.hero.subtitle, lang)}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#FDFBF7]/70">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.hero.place, lang)}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="#form"
            data-testid="findeano-hero-cta-primary"
            className="inline-flex items-center justify-center gap-3 bg-[#C16542] hover:bg-[#A0532F] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            {pick(COPY.cta.primary, lang)}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          </a>
          <a
            href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
            data-testid="findeano-hero-cta-secondary"
            className="inline-flex items-center justify-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.cta.secondary, lang)}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Overview
============================================================ */
function Overview({ lang }) {
  const cards = [
    { Icon: Clock, label: { es: "Duración", en: "Duration", fr: "Durée" }, value: COPY.overview.duration },
    { Icon: MapPin, label: { es: "Lugares", en: "Places", fr: "Lieux" }, value: COPY.overview.places },
    { Icon: Plane, label: { es: "Aeropuerto", en: "Airport", fr: "Aéroport" }, value: COPY.overview.airports },
    { Icon: Sparkles, label: { es: "Precio", en: "Price", fr: "Prix" }, value: COPY.overview.price, note: COPY.overview.priceNote },
  ];
  return (
    <section data-testid="findeano-overview" className="bg-[#FDFBF7] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <span className="overline">{pick(COPY.overview.overline, lang)}</span>
        <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl text-[#2C2621] mt-4 leading-[1.05] max-w-3xl">
          {pick(COPY.hero.subtitle, lang)}
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C2621]/10">
          {cards.map(({ Icon, label, value, note }, i) => (
            <div
              key={value}
              data-testid={`findeano-overview-card-${i}`}
              className="bg-[#FDFBF7] p-7 md:p-8 flex flex-col gap-3 min-h-[180px]"
            >
              <Icon className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
                {pick(label, lang)}
              </span>
              <p className="text-[15px] md:text-base text-[#2C2621] leading-snug">
                {pick(value, lang)}
              </p>
              {note && (
                <p className="text-[12px] text-[#5C5248] leading-snug">
                  {pick(note, lang)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Itinerary — day-by-day editorial blocks
============================================================ */
function Itinerary({ lang }) {
  return (
    <section
      id="itinerary"
      data-testid="findeano-itinerary"
      className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <span className="overline">{pick(COPY.itinerary.overline, lang)}</span>
        <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl text-[#2C2621] mt-4 leading-[1.05] max-w-3xl">
          {pick(COPY.itinerary.title, lang)}
        </h2>

        <div className="mt-16 space-y-16 md:space-y-24">
          {ITINERARY.map((d, i) => (
            <article
              key={d.id}
              data-testid={`findeano-day-${d.id}`}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
            >
              <div className="lg:col-span-6 [direction:ltr]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={d.image}
                    alt={pick(d.title, lang)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="film-grain pointer-events-none" />
                </div>
              </div>
              <div className="lg:col-span-6 [direction:ltr]">
                <span
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C16542]"
                  data-testid={`findeano-day-${d.id}-date`}
                >
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.6} />
                  {pick(d.dateLabel, lang)}
                </span>
                <h3 className="font-serif-x text-2xl md:text-3xl lg:text-4xl text-[#2C2621] mt-4 leading-[1.1]">
                  {pick(d.title, lang)}
                </h3>
                <p className="mt-5 text-[#5C5248] text-[15px] md:text-base leading-[1.75]">
                  {pick(d.body, lang)}
                </p>
                {d.callout && (
                  <div className="mt-7 border-l-2 border-[#C16542] pl-5 py-2">
                    <span className="block text-[10px] tracking-[0.25em] uppercase text-[#C16542] mb-1.5">
                      {pick(d.callout.label, lang)}
                    </span>
                    <p className="text-[14px] text-[#2C2621] leading-relaxed">
                      {pick(d.callout.body, lang)}
                    </p>
                  </div>
                )}
                {d.footnote && (
                  <p className="mt-5 text-[12px] text-[#5C5248] italic leading-snug">
                    {pick(d.footnote, lang)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Pricing
============================================================ */
function Pricing({ lang }) {
  return (
    <section data-testid="findeano-pricing" className="bg-[#FDFBF7] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <span className="overline">{pick(COPY.pricing.overline, lang)}</span>
        <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl text-[#2C2621] mt-4 leading-[1.05]">
          {pick(COPY.pricing.title, lang)}
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10">
          {[
            { key: "adults",   label: COPY.pricing.adults,   price: COPY.pricing.adultsPrice,   note: COPY.pricing.adultsNote,   accent: "#C16542" },
            { key: "children", label: COPY.pricing.children, price: COPY.pricing.childrenPrice, note: COPY.pricing.childrenNote, accent: "#5A7F9C" },
            { key: "single",   label: COPY.pricing.single,   price: COPY.pricing.singlePrice,   note: COPY.pricing.singleNote,   accent: "#5A6B4F" },
          ].map((row) => (
            <div
              key={row.key}
              data-testid={`findeano-price-${row.key}`}
              className="bg-[#FDFBF7] p-8 md:p-10 flex flex-col gap-3"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
                {pick(row.label, lang)}
              </span>
              <p
                className="font-serif-x text-3xl md:text-4xl"
                style={{ color: row.accent }}
              >
                {pick(row.price, lang)}
              </p>
              <p className="text-[13px] text-[#5C5248]">{pick(row.note, lang)}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12px] text-[#5C5248] italic">
          {pick(COPY.pricing.asterisk, lang)}
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   Inclusions / Exclusions
============================================================ */
function Inclusions({ lang }) {
  return (
    <section data-testid="findeano-inclusions" className="bg-[#2C2621] py-24 md:py-32 text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <span className="block text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-4">
            {pick(COPY.inclusions.title, lang)}
          </span>
          <ul className="space-y-3.5">
            {COPY.inclusions.items.map((item, i) => (
              <li
                key={pick(item, "es") + i}
                data-testid={`findeano-include-${i}`}
                className="flex items-start gap-3 text-[14px] md:text-[15px] text-[#FDFBF7]/90 leading-relaxed"
              >
                <Check className="w-4 h-4 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={2} />
                <span>{pick(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="block text-[10px] tracking-[0.3em] uppercase text-[#C16542] mb-4">
            {pick(COPY.exclusions.title, lang)}
          </span>
          <ul className="space-y-3.5">
            {COPY.exclusions.items.map((item, i) => (
              <li
                key={pick(item, "es") + i}
                data-testid={`findeano-exclude-${i}`}
                className="flex items-start gap-3 text-[14px] md:text-[15px] text-[#FDFBF7]/75 leading-relaxed"
              >
                <X className="w-4 h-4 text-[#C16542] mt-1 flex-shrink-0" strokeWidth={2} />
                <span>{pick(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Notes
============================================================ */
function Notes({ lang }) {
  return (
    <section data-testid="findeano-notes" className="bg-[#F2EBE1] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <span className="overline">{pick(COPY.notes.overline, lang)}</span>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {COPY.notes.blocks.map((b, i) => (
            <div
              key={pick(b.title, "es") + i}
              data-testid={`findeano-note-${i}`}
              className="bg-[#FDFBF7] p-7 md:p-8 border border-[#2C2621]/10"
            >
              <h4 className="font-serif-x text-xl md:text-2xl text-[#2C2621] mb-3">
                {pick(b.title, lang)}
              </h4>
              <p className="text-[14px] md:text-[15px] text-[#5C5248] leading-relaxed">
                {pick(b.body, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Contracting conditions
============================================================ */
function Contracting({ lang }) {
  const { contracting } = COPY;
  return (
    <section data-testid="findeano-contracting" className="bg-[#FDFBF7] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <span className="overline">{pick(contracting.overline, lang)}</span>
        <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl text-[#2C2621] mt-4 leading-[1.05]">
          {pick(contracting.title, lang)}
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10">
          {/* Reserva */}
          <div className="bg-[#FDFBF7] p-7 md:p-9">
            <Star className="w-5 h-5 text-[#C16542] mb-4" strokeWidth={1.5} />
            <h4 className="font-serif-x text-xl md:text-2xl text-[#2C2621] mb-3">
              {pick(contracting.booking.title, lang)}
            </h4>
            <p className="text-[14px] text-[#5C5248] leading-relaxed">
              {pick(contracting.booking.body, lang)}
            </p>
          </div>

          {/* Pago */}
          <div className="bg-[#FDFBF7] p-7 md:p-9">
            <Sparkles className="w-5 h-5 text-[#5A7F9C] mb-4" strokeWidth={1.5} />
            <h4 className="font-serif-x text-xl md:text-2xl text-[#2C2621] mb-3">
              {pick(contracting.payment.title, lang)}
            </h4>
            <ul className="space-y-1.5 mb-5">
              {contracting.payment.items.map((it, i) => (
                <li key={pick(it, "es") + i} className="text-[14px] text-[#5C5248] flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-[#C16542]" strokeWidth={2} />
                  {pick(it, lang)}
                </li>
              ))}
            </ul>
            <div className="space-y-3 text-[13px]">
              <div className="border-l-2 border-[#C16542] pl-3">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#5C5248]">
                  {pick(contracting.payment.deposit.label, lang)}
                </div>
                <div className="text-[#2C2621] font-semibold">{pick(contracting.payment.deposit.value, lang)}</div>
              </div>
              <div className="border-l-2 border-[#5A6B4F] pl-3">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#5C5248]">
                  {pick(contracting.payment.final.label, lang)}
                </div>
                <div className="text-[#2C2621] font-semibold">{pick(contracting.payment.final.value, lang)}</div>
              </div>
            </div>
          </div>

          {/* Cancelación */}
          <div className="bg-[#FDFBF7] p-7 md:p-9">
            <X className="w-5 h-5 text-[#C16542] mb-4" strokeWidth={1.5} />
            <h4 className="font-serif-x text-xl md:text-2xl text-[#2C2621] mb-3">
              {pick(contracting.cancel.title, lang)}
            </h4>
            <ul className="space-y-2.5">
              {contracting.cancel.items.map((it, i) => (
                <li
                  key={pick(it, "es") + i}
                  data-testid={`findeano-cancel-${i}`}
                  className="text-[13px] text-[#5C5248] leading-relaxed flex items-start gap-2"
                >
                  <ChevronRight className="w-3 h-3 text-[#C16542] mt-1.5 flex-shrink-0" strokeWidth={2} />
                  <span>{pick(it, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Contact band
============================================================ */
function ContactBand({ lang }) {
  return (
    <section
      data-testid="findeano-contact-band"
      className="relative bg-[#1A1513] py-24 md:py-32 text-[#FDFBF7] overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/85 to-[#1A1513]/60" />
      <span className="film-grain pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        <span className="overline text-[#D4A373]">{pick(COPY.contact.overline, lang)}</span>
        <h2 className="font-serif-x text-3xl md:text-5xl lg:text-6xl text-[#FDFBF7] mt-4 leading-[1.05]">
          {pick(COPY.contact.title, lang)}
        </h2>
        <p className="mt-6 text-[#FDFBF7]/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {pick(COPY.contact.body, lang)}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
          <a
            href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
            data-testid="findeano-contact-phone"
            className="group inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] px-7 py-3.5 text-[12px] tracking-[0.25em] uppercase transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={1.6} />
            {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            data-testid="findeano-contact-email"
            className="group inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] px-7 py-3.5 text-[12px] tracking-[0.25em] uppercase transition-colors"
          >
            <Mail className="w-4 h-4" strokeWidth={1.6} />
            {CONTACT.email}
          </a>
        </div>

        <p className="mt-12 text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/55">
          <span className="text-[#D4A373]">{pick(COPY.contact.hoursLabel, lang)} · </span>
          {pick(COPY.contact.hours, lang)}
        </p>
      </div>
    </section>
  );
}
