import React from "react";
import { Link } from "react-router-dom";
import { pathFor } from "@/lib/routes";

const PEXELS = {
  ergChebbi: "https://vcznwmkvphvkpkucciyw.supabase.co/storage/v1/object/public/xaluca/xaluca/library/pexels_37441710_9c6b3110.jpg",
  agafay: "https://vcznwmkvphvkpkucciyw.supabase.co/storage/v1/object/public/xaluca/xaluca/library/pexels_28076410_074efc20.jpg",
  atlas: "https://vcznwmkvphvkpkucciyw.supabase.co/storage/v1/object/public/xaluca/xaluca/library/pexels_37700545_6baae84d.jpg",
  aitBenHaddou: "https://vcznwmkvphvkpkucciyw.supabase.co/storage/v1/object/public/xaluca/xaluca/library/pexels_29976840_62f4b546.jpg",
};

const H2 = ({ children }) => <h2 className="font-serif-x text-3xl md:text-[36px] leading-[1.12] text-[#2C2621] mt-12 md:mt-16">{children}</h2>;
const H3 = ({ children }) => <h3 className="font-serif-x text-2xl md:text-[28px] leading-tight text-[#2C2621] mt-9">{children}</h3>;
const P = ({ children }) => <p className="mt-5 text-base md:text-lg text-[#3F352E] leading-[1.75]">{children}</p>;
const Figure = ({ src, alt, caption }) => (
  <figure className="mt-8 overflow-hidden bg-[#F2EBE1]">
    <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full aspect-[3/2] object-cover" />
    {caption && <figcaption className="px-4 py-3 text-xs text-[#5C5248]">{caption}</figcaption>}
  </figure>
);
const Table = ({ headers, rows }) => (
  <div className="mt-7 overflow-x-auto border border-[#2C2621]/10" role="region" aria-label={headers.join(", ")} tabIndex="0">
    <table className="w-full min-w-[580px] text-left text-sm md:text-base leading-relaxed">
      <thead className="bg-[#2C2621] text-[#FDFBF7]"><tr>{headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-semibold">{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} className="border-t border-[#2C2621]/10 even:bg-[#F2EBE1]/50">{row.map((cell, j) => <td key={j} className="px-4 py-3 align-top text-[#3F352E]">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

export default function SaharaMarrakechArticle({ lang }) {
  return (
    <>
      <P>Si planeas un <strong>viaje al desierto del Sahara desde Marrakech</strong>, deja dos días para Zagora o tres para Merzouga como mínimo. Con una sola jornada, Agafay te ofrece un paisaje árido cerca de la ciudad. Para pisar grandes dunas tendrás que contar con bastantes horas de carretera.</P>
      <P>El camino pasa por puertos de montaña, pueblos de adobe y palmerales. Vale la pena reservar tiempo para detenerse en ellos y salir del vehículo.</P>
      <div className="mt-8 aspect-video overflow-hidden bg-[#1A1513]">
        <iframe title="Ruta desde Marrakech al desierto" src="https://www.youtube-nocookie.com/embed/HGx1E_-3shM" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
      </div>

      <H2>¿Qué desierto elegir desde Marrakech?</H2>
      <P>El nombre «desierto de Marrakech» puede referirse a lugares muy distintos. Agafay queda cerca y tiene suelo pedregoso. Una escapada a Zagora te lleva al sur marroquí; Merzouga, a las dunas de Erg Chebbi. Para llegar a las dunas más apartadas de Erg Chigaga hay que continuar desde M’Hamid en 4×4.</P>
      <Figure src={PEXELS.ergChebbi} alt="Dunas de Erg Chebbi junto a Merzouga" caption="Erg Chebbi, cerca de Merzouga · fotografía de Pexels" />
      <Table headers={["Destino", "Tiempo mínimo desde Marrakech", "Paisaje y experiencia", "Mejor para"]} rows={[
        ["Agafay", "Un día o una noche", "Colinas áridas y campamentos; no son las dunas del Sáhara", "Quien tiene poco tiempo y quiere una cena o noche fuera de la ciudad"],
        ["Zagora", "Dos días", "Palmerales del valle del Draa y campamento en un entorno desértico; dunas menores que Erg Chebbi", "Quien quiere una primera escapada al sur sin sumar más jornadas"],
        ["Merzouga, Erg Chebbi", "Tres días como mínimo; cuatro o cinco con más calma", "Dunas amplias, amanecer y noche en campamento", "Quien prioriza el paisaje de arena"],
        ["Erg Chigaga", "Varios días y traslado final en 4×4 desde M’Hamid", "Dunas más apartadas y ruta menos directa", "Quien dispone de tiempo y busca una experiencia más remota"],
      ]} />
      <P>Para caminar entre dunas, Merzouga merece cuatro días de viaje. Agafay encaja en una jornada; con dos días puedes atravesar el valle del Draa y dormir cerca de Zagora.</P>

      <H3>¿Cuánto se tarda en llegar?</H3>
      <P>De Marrakech a Zagora se tarda unas <strong>7 horas por carretera</strong>. Para llegar a Merzouga, calcula <strong>más de 9 horas de conducción</strong> por sentido si haces el trayecto seguido. La ruta suele repartir ese recorrido con una noche intermedia. Las paradas y el estado de la carretera pueden alargarlo.</P>
      <Table headers={["Tramo habitual", "Tiempo de carretera orientativo"]} rows={[
        ["Marrakech a Ait Ben Haddou", "3,5 a 4 horas"],
        ["Ait Ben Haddou al valle del Dades", "2,5 a 3 horas"],
        ["Gargantas del Todra a Merzouga", "3 a 3,5 horas"],
        ["Marrakech a Zagora", "Unas 7 horas"],
        ["Merzouga a Fez", "7 a 8 horas"],
      ]} />
      <P>Toma estos tiempos como una referencia para elegir ruta. Si te detienes a comer o visitar una kasbah, llegarás más tarde al campamento.</P>

      <H2>Rutas desde Marrakech según los días que tengas</H2>
      <H3>Un día: Agafay, sin prometer una excursión al Sáhara</H3>
      <Figure src={PEXELS.agafay} alt="Paisaje pedregoso del desierto de Agafay cerca de Marrakech" caption="Agafay, cerca de Marrakech · fotografía de Pexels" />
      <P>En Agafay puedes cambiar el ruido de la medina por una tarde en un campamento, entre lomas de tierra y piedra. Hay planes para comer, cenar o pasar la noche. Para quien solo dispone de un día, es una salida posible; Merzouga requiere varios días.</P>
      <H3>Dos días: Marrakech, Ait Ben Haddou y Zagora</H3>
      <P>La primera jornada cruza el Alto Atlas y deja tiempo para visitar el <strong>ksar de Ait Ben Haddou</strong>. Después, la ruta pasa por Ouarzazate y el valle del Draa hasta Zagora. Al día siguiente regresas a Marrakech, así que pasarás muchas horas en carretera.</P>
      <P>Si viajas con niños pequeños o te cuesta pasar tantas horas entre curvas, añade otra noche. Tendrás más tiempo para pasear por las kasbahs y los palmerales antes de llegar al campamento.</P>
      <H3>Tres días: Merzouga y Erg Chebbi</H3>
      <P>Después de cruzar el Atlas, Ait Ben Haddou y Ouarzazate, puedes dormir la primera noche en el valle del Dades. La segunda jornada pasa por las gargantas del Todra y llega a Merzouga. Allí verás cómo el sol bajo vuelve cobrizas las dunas de Erg Chebbi. El tercer día empieza en el campamento y acaba tras un largo regreso a Marrakech.</P>
      <P>Es una excursión al desierto desde Marrakech para quien dispone de pocos días y acepta un regreso largo. De las tres jornadas, normalmente solo una noche se pasa en el campamento.</P>
      <H3>Cuatro o cinco días: más desierto y menos prisa</H3>
      <P>Un cuarto día permite repartir la vuelta o pasar más tiempo a pie en las dunas. Con cinco días puedes añadir otra noche cerca de Merzouga y alternar campamento y alojamiento, según tu ritmo. La <Link to={pathFor(lang, "tourMarrakechErgHub")} className="text-[#A8533A] underline underline-offset-2">ruta de Marrakech a Erg Chebbi de Xaluca Tours</Link> ofrece opciones de cinco a ocho días que terminan en Erg Chebbi, sin regreso incluido a Marrakech. Si tu viaje sigue hacia Fez, puedes salir desde Merzouga sin desandar el Atlas. Aun así, el trayecto hasta Fez es largo.</P>
      <P>Ese día extra viene bien si viajas en familia, quieres sentarte a contemplar el atardecer en el campamento o te gusta fotografiar las dunas. Antes de salir, conviene tener claro dónde dormirás cada noche.</P>

      <H2>Lo que encontrarás entre Marrakech y las dunas</H2>
      <Figure src={PEXELS.atlas} alt="Carretera entre las montañas del Alto Atlas" caption="Camino por el Atlas · fotografía de Pexels" />
      <P>Desde Marrakech la carretera sube al Alto Atlas. Luego aparecen construcciones de tierra, valles y oasis. <a href="https://whc.unesco.org/en/list/444/" target="_blank" rel="noopener noreferrer" className="text-[#A8533A] underline underline-offset-2"><strong>Ait Ben Haddou</strong></a>, reconocido como Patrimonio Mundial, merece una parada para recorrer su arquitectura de tierra. Ouarzazate suele quedar de paso; si vas a Merzouga, puedes caminar por el valle del Dades y las gargantas del Todra entre tramos de carretera.</P>
      <blockquote className="mt-8 border-l-2 border-[#C16542] pl-5 text-xl italic text-[#2C2621] leading-relaxed">
        «El ksar de Ait Ben Haddou es una síntesis perfecta de la arquitectura de tierra de las regiones presaharianas de Marruecos».
        <cite className="mt-3 block text-xs not-italic text-[#5C5248]">— <a href="https://whc.unesco.org/en/list/444/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Centro del Patrimonio Mundial de la UNESCO</a></cite>
      </blockquote>
      <Figure src={PEXELS.aitBenHaddou} alt="Arquitectura de tierra del ksar de Ait Ben Haddou" caption="Ait Ben Haddou · fotografía de Pexels" />
      <P>En Zagora recorrerás los palmerales del valle del Draa. Al llegar a Merzouga, podrás esperar el cambio de luz sobre Erg Chebbi. Dedica tiempo a pasear por los pueblos: una parada de pocos minutos apenas deja verlos desde la ventanilla.</P>
      <H3>Campamento, dromedarios y actividades</H3>
      <P>Si duermes en jaima, podrás salir a las dunas antes de que el sol caliente la arena. Puedes llegar al campamento en dromedario o en vehículo, según el programa. Algunas rutas también ofrecen caminatas, sandboard o salidas en 4×4; son actividades que pueden contratarse por separado. Para viajar con menores o llegar caminando, pide una opción adaptada a tu grupo.</P>
      <P>Dormir junto a las dunas se siente distinto a pasar la noche en un hotel del pueblo, aunque ambas opciones se anuncien como estancia en Merzouga. Al elegir, pregunta por el baño, las comidas y el traslado del equipaje al campamento.</P>

      <H2>Cómo elegir un tour por el desierto de Marruecos</H2>
      <P>Pide la <strong>ruta día por día</strong> antes de reservar. En una salida de tres días a Merzouga, la hora de partida del último día te dirá cuánto tiempo tendrás para disfrutar de las dunas.</P>
      <ul className="mt-6 list-disc pl-6 space-y-3 text-base md:text-lg text-[#3F352E] leading-[1.7]">
        <li><strong>Transporte y ritmo:</strong> un vehículo privado permite ajustar pausas y visitas; en uno compartido, el horario depende del grupo. Ninguno elimina las horas de carretera.</li>
        <li><strong>Alojamiento:</strong> pregunta el nombre y tipo de cada parada nocturna, la situación del campamento y los servicios de la jaima.</li>
        <li><strong>Servicios incluidos:</strong> distingue conductor de guía local, y separa comidas, entradas, paseos y actividades opcionales. Solicita el detalle por escrito.</li>
        <li><strong>Final del circuito:</strong> volver a Marrakech sirve si tu vuelo sale de allí; acabar en Fez tiene sentido si seguirás hacia el norte.</li>
      </ul>
      <P>El número de viajeros, el tipo de vehículo y las noches de alojamiento influyen en el presupuesto. Las actividades también. Dos precios por persona pueden corresponder a viajes muy diferentes si uno es compartido y el otro se hace a medida.</P>
      <H3>Cuándo ir y qué llevar</H3>
      <P>En <strong>primavera y otoño</strong> resulta más agradable caminar al aire libre. Durante el invierno las noches pueden ser frías. En verano, organiza las actividades fuera de las horas de más calor. Lleva una capa de abrigo para el campamento aunque hayas pasado calor en Marrakech; consulta también la sección de <Link to={pathFor(lang, "climate")} className="text-[#A8533A] underline underline-offset-2">clima en Marruecos</Link> al preparar el equipaje.</P>
      <P>Lleva al campamento una mochila pequeña con agua, protección solar, gafas de sol, un pañuelo para el polvo, calzado cómodo y lo necesario para dormir. Deja a mano lo que usarás durante las horas de carretera.</P>

      <H2>Un viaje al desierto con espacio para disfrutarlo</H2>
      <P>Xaluca Tours adapta las rutas por Marruecos a tus fechas, intereses, presupuesto y ritmo. Lleva más de 30 años trabajando en el país y combina conductores y guías locales con riads, kasbahs y campamentos seleccionados. Además, ofrece asistencia durante el viaje las 24 horas. Puedes plantear una escapada breve o una ruta a Merzouga con los traslados repartidos en varios días.</P>
      <P>Si te atrae la arena fría del amanecer, <strong>dedica cuatro días a Merzouga cuando puedas</strong>. Si solo tienes dos, ve a Zagora por el camino entre kasbahs y palmerales. <Link to={pathFor(lang, "planTrip")} className="text-[#A8533A] underline underline-offset-2">Cuéntale a Xaluca Tours cómo imaginas tu viaje</Link>: te ayudará a elegir una ruta acorde con tus días y a disfrutar del desierto sin correr.</P>

      <H2>Preguntas frecuentes</H2>
      <H3>¿Dónde queda el desierto del Sáhara?</H3>
      <P>El Sáhara se extiende por el norte de África. Desde Marrakech, una de las formas de conocer sus dunas en Marruecos es viajar a Merzouga, junto a Erg Chebbi. Agafay está más cerca, pero no pertenece a las grandes zonas de dunas saharianas.</P>
      <H3>¿Hay un desierto cerca de Marrakech?</H3>
      <P>Sí, Agafay ofrece un paisaje árido para una salida corta desde Marrakech, pero es pedregoso y no tiene las grandes dunas del Sáhara. Para una noche en la ruta del sur puedes ir a Zagora; para caminar por dunas amplias, elige Merzouga y reserva varios días.</P>
      <H3>¿Cuál es la mejor excursión al desierto desde Marrakech?</H3>
      <P>Si buscas dunas de arena y puedes dedicar cuatro días, elige Merzouga con una ruta que reparta las horas de carretera. Con dos días, Zagora permite dormir en el sur; con uno, Agafay es una escapada cercana, pero no una excursión al Sáhara.</P>
      <H3>¿Cuál es el desierto más bonito cerca de Marrakech?</H3>
      <P>Depende del paisaje que quieras ver: Agafay ofrece colinas áridas cerca de Marrakech, mientras que Erg Chebbi, junto a Merzouga, destaca por sus dunas de arena. Merzouga requiere al menos tres días desde Marrakech, por lo que no es una excursión cercana de ida y vuelta en el día.</P>
    </>
  );
}
