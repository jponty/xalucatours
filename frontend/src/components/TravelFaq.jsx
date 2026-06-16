/* ============================================================
   TravelFaq — Frequently Asked Questions for travellers planning
   a tailor-made trip to Morocco. Trilingual (es/en/fr), accordion
   layout, designed for the dark /asistente page. Resolves the most
   common doubts before contacting an advisor.
============================================================ */
import React from "react";
import { HelpCircle, Headset, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { openChatbaseAssistant } from "@/lib/chatbase";

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Preguntas frecuentes", "Frequently asked questions", "Questions fréquentes"),
  title: T(
    "Todo lo que necesitas saber para tu viaje a medida",
    "Everything you need to know about your tailor-made trip",
    "Tout ce qu'il faut savoir sur votre voyage sur mesure",
  ),
  subtitle: T(
    "Resolvemos las dudas más habituales antes de hablar con un asesor. ¿No encuentras tu respuesta? Nuestro asistente está aquí para ayudarte.",
    "We answer the most common questions before you talk to an advisor. Can't find your answer? Our assistant is here to help.",
    "Nous répondons aux questions les plus fréquentes avant de parler à un conseiller. Vous ne trouvez pas votre réponse ? Notre assistant est là pour vous aider.",
  ),
  ctaAssistant: T("Preguntar al asistente", "Ask the assistant", "Demander à l'assistant"),
  ctaPlan: T("Planificar mi viaje", "Plan my trip", "Planifier mon voyage"),
  stillQuestions: T("¿Te queda alguna duda?", "Still have questions?", "D'autres questions ?"),
};

const FAQS = [
  {
    q: T("¿Cómo organizáis un viaje a medida?", "How do you organise a tailor-made trip?", "Comment organisez-vous un voyage sur mesure ?"),
    a: T(
      "Partimos de tus intereses, fechas, ritmo y presupuesto. Un especialista en Marruecos diseña una propuesta personalizada con itinerario, alojamientos, transporte privado y actividades, y la ajustamos contigo hasta que sea perfecta antes de reservar.",
      "We start from your interests, dates, pace and budget. A Morocco specialist designs a personalised proposal with itinerary, accommodation, private transport and activities, and we refine it with you until it's perfect before booking.",
      "Nous partons de vos centres d'intérêt, dates, rythme et budget. Un spécialiste du Maroc conçoit une proposition personnalisée (itinéraire, hébergements, transport privé, activités) que nous ajustons avec vous avant la réservation.",
    ),
  },
  {
    q: T("¿Puedo personalizar el itinerario?", "Can I customise the itinerary?", "Puis-je personnaliser l'itinéraire ?"),
    a: T(
      "Totalmente. Cada itinerario es 100% flexible: puedes añadir o quitar destinos, alargar la estancia en un lugar, combinar ciudades imperiales con desierto y costa, o centrarte en una región concreta. Nada está cerrado hasta que tú lo confirmas.",
      "Absolutely. Every itinerary is 100% flexible: add or remove destinations, extend a stay, combine imperial cities with desert and coast, or focus on one region. Nothing is fixed until you confirm it.",
      "Totalement. Chaque itinéraire est 100% flexible : ajoutez ou retirez des destinations, prolongez une étape, combinez villes impériales, désert et côte, ou concentrez-vous sur une région. Rien n'est figé avant votre confirmation.",
    ),
  },
  {
    q: T("¿Cuántos días recomendáis para visitar Marruecos?", "How many days do you recommend for Morocco?", "Combien de jours recommandez-vous pour le Maroc ?"),
    a: T(
      "Una escapada de 4-5 días permite conocer una zona (Marrakech y desierto, o el norte). Para una visión completa que combine ciudades imperiales, Atlas y desierto recomendamos 7-10 días. A partir de 12 días se puede incluir también la costa atlántica.",
      "A 4-5 day escape covers one area (Marrakech and desert, or the north). For a complete view combining imperial cities, the Atlas and the desert we recommend 7-10 days. From 12 days you can also add the Atlantic coast.",
      "Une escapade de 4-5 jours couvre une zone (Marrakech et désert, ou le nord). Pour une vision complète (villes impériales, Atlas, désert), nous conseillons 7-10 jours. À partir de 12 jours, ajoutez aussi la côte atlantique.",
    ),
  },
  {
    q: T("¿Cuál es la mejor época para viajar a Marruecos?", "What is the best time to travel to Morocco?", "Quelle est la meilleure période pour voyager au Maroc ?"),
    a: T(
      "Primavera (marzo-mayo) y otoño (septiembre-noviembre) son ideales, con temperaturas suaves. El invierno es perfecto para el sur y el desierto (días templados, noches frías). En verano hace mucho calor en el interior, pero la costa y las montañas del Atlas siguen siendo agradables.",
      "Spring (March-May) and autumn (September-November) are ideal, with mild temperatures. Winter is perfect for the south and desert (mild days, cold nights). Summer is very hot inland, but the coast and the Atlas mountains stay pleasant.",
      "Le printemps (mars-mai) et l'automne (septembre-novembre) sont idéaux, avec des températures douces. L'hiver est parfait pour le sud et le désert (journées douces, nuits froides). L'été est très chaud à l'intérieur, mais la côte et l'Atlas restent agréables.",
    ),
  },
  {
    q: T("¿Cómo son los transportes y desplazamientos?", "What about transport and getting around?", "Comment se passent les transports et déplacements ?"),
    a: T(
      "La mayoría de nuestros viajes se realizan con vehículo privado y conductor de habla hispana o con chófer-guía, para que viajes con total comodidad y sin preocuparte por las distancias. También organizamos traslados desde el aeropuerto y, si lo prefieres, vuelos internos o trayectos en tren.",
      "Most of our trips use a private vehicle with a Spanish-speaking driver or driver-guide, so you travel in full comfort without worrying about distances. We also arrange airport transfers and, if you prefer, internal flights or train journeys.",
      "La plupart de nos voyages se font en véhicule privé avec chauffeur hispanophone ou chauffeur-guide, pour voyager en toute sérénité. Nous organisons aussi les transferts aéroport et, si vous le souhaitez, vols intérieurs ou trajets en train.",
    ),
  },
  {
    q: T("¿Qué tipo de alojamientos ofrecéis?", "What kind of accommodation do you offer?", "Quels types d'hébergements proposez-vous ?"),
    a: T(
      "Trabajamos con riads tradicionales, hoteles boutique, kasbahs con encanto y campamentos de lujo en el desierto. Seleccionamos cada alojamiento según tu categoría preferida (estándar, superior o premium) y la experiencia que buscas: auténtica, romántica o de máximo confort.",
      "We work with traditional riads, boutique hotels, charming kasbahs and luxury desert camps. We select each stay according to your preferred category (standard, superior or premium) and the experience you want: authentic, romantic or maximum comfort.",
      "Nous travaillons avec des riads traditionnels, hôtels boutique, kasbahs de charme et campements de luxe dans le désert. Nous choisissons chaque hébergement selon votre catégorie (standard, supérieure ou premium) et l'expérience souhaitée.",
    ),
  },
  {
    q: T("¿Cómo es la experiencia en el desierto?", "What is the desert experience like?", "Comment se passe l'expérience dans le désert ?"),
    a: T(
      "Llegamos a las dunas de Erg Chebbi o Erg Chigaga, donde puedes hacer un paseo en dromedario al atardecer, dormir en un campamento bajo las estrellas y disfrutar de música y cena bereber. Ofrecemos campamentos desde tradicionales hasta de lujo con baño privado.",
      "We reach the dunes of Erg Chebbi or Erg Chigaga, where you can take a camel ride at sunset, sleep in a camp under the stars and enjoy Berber music and dinner. We offer camps from traditional to luxury with private bathroom.",
      "Nous rejoignons les dunes d'Erg Chebbi ou Erg Chigaga : balade à dos de dromadaire au coucher du soleil, nuit en campement sous les étoiles, musique et dîner berbère. Campements du traditionnel au luxe avec salle de bain privée.",
    ),
  },
  {
    q: T("¿Qué actividades y excursiones puedo incluir?", "What activities and excursions can I include?", "Quelles activités et excursions puis-je inclure ?"),
    a: T(
      "Visitas guiadas por medinas, talleres de cocina, hammam y spa, senderismo en el Atlas, quads y buggies, vuelo en globo en Marrakech, surf en la costa, rutas gastronómicas o experiencias con familias locales. Diseñamos las actividades a tu medida.",
      "Guided medina tours, cooking workshops, hammam and spa, Atlas trekking, quads and buggies, hot-air balloon in Marrakech, coast surfing, food tours or experiences with local families. We tailor activities to you.",
      "Visites guidées des médinas, ateliers de cuisine, hammam et spa, randonnée dans l'Atlas, quads et buggies, montgolfière à Marrakech, surf sur la côte, tours gastronomiques ou rencontres avec des familles locales. Activités sur mesure.",
    ),
  },
  {
    q: T("¿Qué presupuesto necesito? ¿Precios orientativos?", "What budget do I need? Approximate prices?", "Quel budget prévoir ? Prix indicatifs ?"),
    a: T(
      "El precio depende de la duración, la categoría de alojamiento, el número de viajeros y las actividades. Como orientación, un viaje a medida con vehículo privado, alojamiento superior y media pensión suele partir de unos 90-120 € por persona y día. Te preparamos un presupuesto detallado y sin compromiso.",
      "The price depends on duration, accommodation category, number of travellers and activities. As a guide, a tailor-made trip with private vehicle, superior accommodation and half board usually starts from around €90-120 per person per day. We prepare a detailed, no-obligation quote.",
      "Le prix dépend de la durée, de la catégorie d'hébergement, du nombre de voyageurs et des activités. À titre indicatif, un voyage sur mesure avec véhicule privé, hébergement supérieur et demi-pension démarre autour de 90-120 € par personne et par jour. Devis détaillé sans engagement.",
    ),
  },
  {
    q: T("¿Organizáis viajes en pareja, familia o grupos?", "Do you organise trips for couples, families or groups?", "Organisez-vous des voyages en couple, famille ou groupe ?"),
    a: T(
      "Sí. Diseñamos escapadas románticas en pareja, viajes familiares con actividades para niños y ritmo adaptado, y viajes para grupos de amigos o empresas. Ajustamos vehículos, alojamientos y experiencias al tamaño y las necesidades de cada grupo.",
      "Yes. We design romantic getaways for couples, family trips with kid-friendly activities and adapted pace, and trips for groups of friends or companies. We adjust vehicles, accommodation and experiences to each group's size and needs.",
      "Oui. Escapades romantiques en couple, voyages en famille avec activités pour enfants et rythme adapté, voyages entre amis ou pour entreprises. Nous adaptons véhicules, hébergements et expériences à chaque groupe.",
    ),
  },
  {
    q: T("¿Es seguro viajar a Marruecos?", "Is it safe to travel to Morocco?", "Le Maroc est-il sûr pour voyager ?"),
    a: T(
      "Marruecos es un destino seguro y muy acostumbrado al turismo. Viajarás acompañado por nuestro equipo local, con conductores y guías de confianza y asistencia permanente durante todo el viaje. Te damos además recomendaciones prácticas para que disfrutes con total tranquilidad.",
      "Morocco is a safe destination, well used to tourism. You'll be accompanied by our local team, with trusted drivers and guides and permanent assistance throughout the trip. We also give you practical tips so you can enjoy with complete peace of mind.",
      "Le Maroc est une destination sûre, habituée au tourisme. Vous serez accompagné par notre équipe locale, avec chauffeurs et guides de confiance et une assistance permanente. Nous vous donnons aussi des conseils pratiques pour profiter en toute sérénité.",
    ),
  },
  {
    q: T("¿Qué documentación necesito para entrar?", "What documents do I need to enter?", "Quels documents pour entrer au Maroc ?"),
    a: T(
      "Para estancias turísticas de hasta 90 días, los ciudadanos de la UE, Reino Unido, EE. UU. y muchos otros países solo necesitan el pasaporte en vigor (con validez mínima de 6 meses) y no requieren visado. Te recomendamos verificar siempre los requisitos según tu nacionalidad antes de viajar.",
      "For tourist stays of up to 90 days, citizens of the EU, UK, USA and many other countries only need a valid passport (minimum 6 months' validity) and no visa. We always recommend checking the requirements for your nationality before travelling.",
      "Pour les séjours touristiques jusqu'à 90 jours, les citoyens de l'UE, du Royaume-Uni, des États-Unis et de nombreux pays n'ont besoin que d'un passeport valide (au moins 6 mois) sans visa. Vérifiez toujours les conditions selon votre nationalité.",
    ),
  },
  {
    q: T("¿Qué clima hay y qué equipaje llevar?", "What's the climate and what should I pack?", "Quel climat et quels bagages prévoir ?"),
    a: T(
      "El clima varía mucho según la zona y la estación. Recomendamos ropa cómoda y transpirable, una chaqueta o jersey para las noches del desierto y la montaña, calzado cerrado para caminar, gorra, gafas de sol y protección solar. En invierno, añade prendas de abrigo; en verano, ropa ligera.",
      "The climate varies a lot by region and season. We recommend comfortable, breathable clothing, a jacket or jumper for desert and mountain nights, closed walking shoes, a cap, sunglasses and sunscreen. In winter, add warm layers; in summer, light clothing.",
      "Le climat varie selon la région et la saison. Prévoyez des vêtements confortables et respirants, une veste pour les nuits dans le désert et en montagne, des chaussures fermées, casquette, lunettes de soleil et crème solaire. L'hiver, ajoutez des vêtements chauds ; l'été, des tenues légères.",
    ),
  },
  {
    q: T("¿Qué formas de pago hay y cómo reservo?", "What payment methods are there and how do I book?", "Quels moyens de paiement et comment réserver ?"),
    a: T(
      "Reservas tu viaje con un anticipo y abonas el resto antes de la salida. Aceptamos transferencia bancaria y tarjeta, con pagos seguros. Una vez confirmado el itinerario y el presupuesto, te enviamos la confirmación y todos los detalles. Sin sorpresas ni costes ocultos.",
      "You book your trip with a deposit and pay the rest before departure. We accept bank transfer and card, with secure payments. Once the itinerary and quote are confirmed, we send you the confirmation and all the details. No surprises or hidden costs.",
      "Vous réservez avec un acompte et réglez le solde avant le départ. Nous acceptons le virement bancaire et la carte, paiements sécurisés. Une fois l'itinéraire et le devis confirmés, nous vous envoyons la confirmation et tous les détails. Sans surprise ni frais cachés.",
    ),
  },
];

export default function TravelFaq() {
  const { lang } = useLanguage();

  return (
    <section
      data-testid="asistente-faq"
      className="relative border-t border-[#FDFBF7]/10 bg-[#1A1513] py-20 md:py-28"
    >
      <div className="relative max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.35em] uppercase text-[#D4A373]">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.eyebrow, lang)}
          </span>
          <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mt-5 text-[#FDFBF7]">
            {pick(COPY.title, lang)}
          </h2>
          <p className="mt-5 text-base text-[#FDFBF7]/70 leading-relaxed">
            {pick(COPY.subtitle, lang)}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" data-testid="asistente-faq-list">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              data-testid={`faq-item-${i}`}
              className="border-[#FDFBF7]/12"
            >
              <AccordionTrigger className="text-[#FDFBF7] hover:no-underline text-[15px] md:text-base font-medium py-5 [&>svg]:text-[#D4A373]">
                {pick(f.q, lang)}
              </AccordionTrigger>
              <AccordionContent className="text-[#FDFBF7]/70 text-[14px] leading-relaxed pr-6">
                {pick(f.a, lang)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions → assistant / planner */}
        <div className="mt-14 border border-[#FDFBF7]/12 bg-[#FDFBF7]/[0.04] p-7 md:p-9 text-center">
          <p className="font-serif-x text-xl md:text-2xl text-[#FDFBF7]">{pick(COPY.stillQuestions, lang)}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={openChatbaseAssistant}
              data-testid="faq-cta-assistant"
              className="inline-flex items-center gap-2.5 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-3.5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <Headset className="w-4 h-4" strokeWidth={1.7} />
              {pick(COPY.ctaAssistant, lang)}
            </button>
            <Link
              to={pathFor(lang, "planTrip")}
              data-testid="faq-cta-plan"
              className="inline-flex items-center gap-2.5 border border-[#FDFBF7]/30 hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-3.5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              {pick(COPY.ctaPlan, lang)}
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
