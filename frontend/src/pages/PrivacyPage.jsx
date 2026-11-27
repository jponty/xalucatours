import React from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  title: T("Información de privacidad", "Privacy information", "Informations de confidentialité"),
  intro: T(
    "Esta información explica el uso de los datos que nos facilitas en los formularios de Xaluca Tours.",
    "This notice explains how we use the details you submit through Xaluca Tours forms.",
    "Cette notice explique comment nous utilisons les données envoyées via les formulaires Xaluca Tours."
  ),
  controller: T("Responsable", "Controller", "Responsable"),
  controllerBody: T("Xaluca Tours / Grup Xaluca. Si tienes dudas sobre el tratamiento de tus datos, escríbenos a", "Xaluca Tours / Grup Xaluca. For questions about how we use your data, write to", "Xaluca Tours / Grup Xaluca. Pour toute question sur l'utilisation de vos données, écrivez-nous à"),
  purpose: T("Para qué los usamos", "How we use your data", "Utilisation de vos données"),
  purposeBody: T("Usamos los datos enviados para atender tu solicitud, responderte y, cuando proceda, organizar tu viaje o gestionar el regalo solicitado. Respetamos la preferencia de contacto que selecciones.", "We use submitted details to handle your request, reply and, where applicable, plan your trip or manage the requested gift. We respect your selected contact preference.", "Nous utilisons les données envoyées pour traiter votre demande, vous répondre et, le cas échéant, organiser votre voyage ou gérer le cadeau demandé. Nous respectons votre préférence de contact."),
  newsletter: T("Newsletter", "Newsletter", "Newsletter"),
  newsletterBody: T("Solo te enviaremos novedades y propuestas comerciales por email si te suscribes expresamente. Puedes darte de baja desde el enlace de cada correo o escribiéndonos.", "We only send news and marketing ideas by email if you expressly subscribe. You can unsubscribe via the link in each message or by writing to us.", "Nous n'envoyons des actualités et offres par e-mail que si vous vous inscrivez expressément. Vous pouvez vous désinscrire via chaque message ou nous écrire."),
  rights: T("Tus opciones", "Your choices", "Vos choix"),
  rightsBody: T("Puedes pedirnos acceso, rectificación o supresión de tus datos, o plantear cualquier consulta sobre privacidad, escribiendo a", "You can ask to access, correct or erase your data, or send us any privacy question, by writing to", "Vous pouvez demander l'accès, la rectification ou la suppression de vos données, ou nous poser une question de confidentialité, en écrivant à"),
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  return <main className="bg-[#F7F1E8] text-[#2C2621] min-h-[70vh] px-6 py-20 md:py-28">
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif-x font-semibold text-4xl md:text-6xl">{pick(COPY.title, lang)}</h1>
      <p className="mt-6 text-lg leading-relaxed">{pick(COPY.intro, lang)}</p>
      {[["controller", "controllerBody"], ["purpose", "purposeBody"], ["newsletter", "newsletterBody"], ["rights", "rightsBody"]].map(([heading, body]) =>
        <section key={heading} className="mt-9 border-t border-[#2C2621]/20 pt-7">
          <h2 className="font-serif-x font-semibold text-2xl">{pick(COPY[heading], lang)}</h2>
          <p className="mt-3 leading-relaxed">{pick(COPY[body], lang)}{["controller", "rights"].includes(heading) && <> <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</>}</p>
        </section>
      )}
    </div>
  </main>;
}
