"""Private identity gate and deterministic, source-only website assistant.

No model, external search, email delivery or conversation persistence is used.
Only the checked-in corpus can supply factual content and citation targets.
"""
import asyncio
import base64
import hashlib
import hmac
import json
import math
import os
import re
import secrets
import time
import unicodedata
import uuid
from collections import deque
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Literal

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field, StrictBool, ValidationError, field_validator

from lead_contact import LeadContactInput
from lead_name import LeadNameInput
from lead_registry import LeadCapture, save_submission

TOKEN_TTL = 2 * 3600
MAX_BODY_BYTES = 16 * 1024
MAX_EXCERPT = 700
PROGRAM_PAGE_SIZE = 8
SOURCE_PAGE_SIZE = 3
LANGUAGES = {"es", "en", "fr"}
CORPUS_PATH = Path(__file__).with_name("assistant_knowledge.json")
COPY = {
    "es": {
        "sources": "Estos son fragmentos de nuestra web relacionados con tu consulta. Puedes abrir cada fuente para consultar el programa completo.",
        "unknown": "No encuentro información suficientemente precisa en nuestra web para responder con seguridad. Puedes consultar al equipo desde Contacto.",
        "sensitive": "No puedo confirmar precios, disponibilidad, reservas o condiciones ni ofrecer asesoramiento médico o legal. Consulta al equipo desde Contacto para revisar tu caso.",
        "ambiguous": "He encontrado información de varios programas. ¿A qué viaje te refieres? Indica el nombre y la duración, o abre una de estas fuentes.",
        "onboarding": "¡Hola! Para orientarte con tu viaje a Marruecos, ¿cuántos días te gustaría viajar y qué zonas o experiencias te interesan?",
        "identity": "Identificación para acceder al asistente de la web. No se ha enviado una consulta al equipo.",
    },
    "en": {
        "sources": "These are excerpts from our website related to your question. Open each source to read the complete programme.",
        "unknown": "I cannot find sufficiently precise information on our website to answer reliably. You can ask our team through Contact.",
        "sensitive": "I cannot confirm prices, availability, bookings or terms, or provide medical or legal advice. Please contact our team to review your case.",
        "ambiguous": "I found information from several programmes. Which trip do you mean? Please give its name and duration, or open one of these sources.",
        "onboarding": "Hello! To help you explore a trip to Morocco, how many days would you like to travel, and which regions or experiences interest you?",
        "identity": "Identification to access the website assistant. No enquiry has been sent to the team.",
    },
    "fr": {
        "sources": "Voici des extraits de notre site en lien avec votre question. Ouvrez chaque source pour consulter le programme complet.",
        "unknown": "Je ne trouve pas d’information suffisamment précise sur notre site pour répondre de manière fiable. Vous pouvez consulter notre équipe via Contact.",
        "sensitive": "Je ne peux confirmer les prix, disponibilités, réservations ou conditions, ni donner de conseils médicaux ou juridiques. Contactez notre équipe pour examiner votre demande.",
        "ambiguous": "J’ai trouvé des informations sur plusieurs programmes. De quel voyage s’agit-il ? Précisez son nom et sa durée, ou ouvrez l’une de ces sources.",
        "onboarding": "Bonjour ! Pour vous orienter dans votre voyage au Maroc, combien de jours souhaitez-vous partir et quelles régions ou expériences vous intéressent ?",
        "identity": "Identification pour accéder à l’assistant du site. Aucune demande n’a été envoyée à l’équipe.",
    },
}

# Interface prompts only: all programme names, durations and factual content
# below are selected from the localized, server-owned corpus.
GUIDE_COPY = {
    "es": {
        "root": "¿Qué te gustaría consultar?", "trips": "Explorar viajes",
        "practical": "Información práctica", "contact": "Datos de contacto",
        "human": "Hablar con el equipo", "duration": "¿Qué duración prefieres?",
        "all": "Ver todos / Sin preferencia", "programs": "Elige un programa",
        "sections": "¿Qué quieres consultar de este programa?",
        "overview": "Resumen", "itinerary": "Itinerario", "includes": "Qué incluye",
        "excludes": "Qué no incluye", "sources": "Fragmentos literales de la web. Abre la fuente para consultar el programa completo.",
        "handoff": "Para consultar fechas, precios o una petición personal, utiliza «Contactar con el equipo». No se ha enviado ninguna consulta al equipo.",
    },
    "en": {
        "root": "What would you like to explore?", "trips": "Explore trips",
        "practical": "Practical information", "contact": "Contact details",
        "human": "Talk to our team", "duration": "Which duration do you prefer?",
        "all": "View all / No preference", "programs": "Choose a programme",
        "sections": "What would you like to see about this programme?",
        "overview": "Overview", "itinerary": "Itinerary", "includes": "What is included",
        "excludes": "What is not included", "sources": "Literal excerpts from the website. Open the source to read the complete programme.",
        "handoff": "For dates, prices or a personal request, use “Contact our team”. No enquiry has been sent to the team.",
    },
    "fr": {
        "root": "Que souhaitez-vous consulter ?", "trips": "Explorer les voyages",
        "practical": "Informations pratiques", "contact": "Coordonnées",
        "human": "Parler à notre équipe", "duration": "Quelle durée préférez-vous ?",
        "all": "Tout voir / Sans préférence", "programs": "Choisissez un programme",
        "sections": "Que souhaitez-vous consulter dans ce programme ?",
        "overview": "Présentation", "itinerary": "Itinéraire", "includes": "Ce qui est inclus",
        "excludes": "Ce qui n’est pas inclus", "sources": "Extraits exacts du site. Ouvrez la source pour consulter le programme complet.",
        "handoff": "Pour les dates, les prix ou une demande personnelle, utilisez « Contacter notre équipe ». Aucune demande n’a été envoyée à l’équipe.",
    },
}


def fail(status, code, retry_after=None):
    headers = {"Cache-Control": "no-store"}
    if retry_after is not None:
        headers["Retry-After"] = str(retry_after)
    raise HTTPException(status, detail={"code": code}, headers=headers)


class SessionInput(LeadCapture, LeadContactInput, LeadNameInput):
    model_config = ConfigDict(extra="forbid")
    privacy_consent: StrictBool
    language: Literal["es", "en", "fr"] = "es"
    submission_id: uuid.UUID

    @field_validator("privacy_consent")
    @classmethod
    def require_consent(cls, value):
        if value is not True:
            raise ValueError("Privacy consent is required")
        return value

    @field_validator("phone", mode="before")
    @classmethod
    def phone_characters(cls, value):
        if not isinstance(value, str) or not re.fullmatch(r"\+[\d\s().-]+", value.strip()):
            raise ValueError("Invalid phone")
        return value


class AssistantLead(SessionInput):
    # Stored CRM state is not part of the public input contract.
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    message: str


class GuideInput(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    language: Literal["es", "en", "fr"]
    topic: Literal["trips", "practical", "contact", "human"] | None = None
    # 0 is the explicit no-preference choice; None asks for a duration.
    duration: int | None = Field(default=None, ge=0, le=365)
    program_id: str | None = Field(default=None, min_length=1, max_length=160)
    section: Literal["overview", "itinerary", "includes", "excludes", "practical"] | None = None
    page: int = Field(default=1, ge=1, le=10000)

    @field_validator("topic", "section", mode="before")
    @classmethod
    def optional_not_null(cls, value):
        if value is None:
            raise ValueError("Omit an unselected topic or section")
        return value


def signing_secret():
    dedicated = os.environ.get("ASSISTANT_TOKEN_SECRET", "").strip()
    admin = os.environ.get("ADMIN_TOKEN_SECRET", "").strip()
    if dedicated:
        return hmac.new(dedicated.encode(), b"xaluca:assistant:key:v1", hashlib.sha256).digest()
    if admin:
        # Purpose separation: never sign public tokens with the raw admin key.
        return hmac.new(admin.encode(), b"xaluca:assistant:derived:v1", hashlib.sha256).digest()
    return None


def _signature(raw, secret):
    return hmac.new(secret, b"xaluca:assistant:token:v1:" + raw.encode(), hashlib.sha256).hexdigest()


def make_token(lead_id, secret, now=None):
    expires = int(time.time() if now is None else now) + TOKEN_TTL
    raw = base64.urlsafe_b64encode(json.dumps({"lead_id": str(uuid.UUID(lead_id)), "exp": expires}, separators=(",", ":")).encode()).decode().rstrip("=")
    return f"{raw}.{_signature(raw, secret)}", datetime.fromtimestamp(expires, timezone.utc).isoformat()


def verify_token(token, secret, now=None):
    now = time.time() if now is None else now
    if not secret or not isinstance(token, str) or len(token) > 1024:
        fail(401, "session_expired")
    try:
        raw, signature = token.split(".")
        if not hmac.compare_digest(signature, _signature(raw, secret)):
            raise ValueError()
        data = json.loads(base64.b64decode(raw + "=" * (-len(raw) % 4), altchars=b"-_", validate=True))
        if (set(data) != {"lead_id", "exp"} or type(data["exp"]) is not int
                or not now < data["exp"] <= now + TOKEN_TTL + 5):
            raise ValueError()
        return str(uuid.UUID(data["lead_id"]))
    except (ValueError, TypeError, KeyError, AttributeError, UnicodeError):
        fail(401, "session_expired")


class RequestGuard:
    """Bounded per-worker quotas. Proxy trust must be configured by deployment."""
    def __init__(self):
        self.clients = {}
        self.salt = secrets.token_bytes(32)

    def enter(self, namespace, identity, limit, window=3600):
        now = time.monotonic()
        # Expired entries are deleted; an exhausted map rejects new keys instead
        # of evicting active counters and making the quota bypassable.
        self.clients = {key: values for key, values in self.clients.items() if values and now - values[-1] < window}
        key = hmac.new(self.salt, f"{namespace}:{identity}".encode(), hashlib.sha256).digest()
        values = self.clients.get(key, deque())
        while values and now - values[0] >= window:
            values.popleft()
        if len(values) >= limit or key not in self.clients and len(self.clients) >= 4096:
            fail(429, "rate_limit", 60)
        values.append(now)
        self.clients[key] = values


async def parse_input(request, model):
    if request.headers.get("content-type", "").split(";")[0].strip().lower() != "application/json":
        fail(415, "invalid_content_type")
    try:
        if int(request.headers.get("content-length", "0")) > MAX_BODY_BYTES:
            fail(413, "request_too_large")
    except ValueError:
        fail(422, "invalid_request")
    body = bytearray()
    try:
        async for chunk in request.stream():
            if len(body) + len(chunk) > MAX_BODY_BYTES:
                fail(413, "request_too_large")
            body.extend(chunk)
        return model.model_validate_json(body)
    except (ValidationError, ValueError):
        # Pydantic's default response includes rejected inputs, potentially PII.
        fail(422, "invalid_request")


def fold(value):
    return "".join(char for char in unicodedata.normalize("NFKD", value.casefold()) if not unicodedata.combining(char))


# Fixed conversational prompts make no factual claims. Match whole, narrowly
# allowlisted sentences: a greeting must never swallow an unsupported request.
ONBOARDING_GRAMMAR = {
    "es": (
        r"hola|buenos dias|buenas tardes|buenas noches",
        r"(?:quiero|quisiera|me gustaria|queremos|nos gustaria) "
        r"(?:(?:ir|viajar) a marruecos|visitar marruecos|(?:hacer|organizar) un viaje a marruecos)"
        r"|(?:me interesa|nos interesa) (?:viajar a marruecos|un viaje a marruecos)",
        r"por favor|gracias",
    ),
    "en": (
        r"hello|hi|hey|good morning|good afternoon|good evening",
        r"(?:i (?:want|would like)|i'd like|we (?:want|would like)|we'd like) to "
        r"(?:(?:go|travel) to morocco|visit morocco|(?:plan|organize|take) a trip to morocco)"
        r"|(?:i am|i'm|we are|we're) interested in (?:(?:travelling|traveling) to morocco|a trip to morocco)",
        r"please|thanks|thank you",
    ),
    "fr": (
        r"bonjour|salut|bonsoir",
        r"(?:je (?:veux|voudrais|souhaite)|j'aimerais|nous (?:voulons|voudrions|souhaitons|aimerions)) "
        r"(?:(?:aller|voyager) au maroc|visiter le maroc|(?:faire|organiser) un voyage au maroc)",
        r"s'il vous plait|s'il te plait|merci",
    ),
}


def is_onboarding(message, language):
    # Normalize punctuation and apostrophes only; retain every request word.
    normalized = " ".join(re.sub(r"[¿?¡!.,;:]", " ", fold(message).replace("’", "'")).split())
    greeting, intent, courtesy = ONBOARDING_GRAMMAR[language]
    return re.fullmatch(
        rf"(?:{greeting})|(?:(?:{greeting}) )?(?:{intent})(?: (?:{courtesy}))?", normalized
    ) is not None


STOP_WORDS = set("""a al algo algun alguna algunos ante como con cual cuando de del desde donde el ella en es ese esa esta este esto estos estas hay hola la las lo los me mi mis o para pero por porque que quiero se si sin sobre su sus te tu un una unos unas y yo
about an and are as at be can could do does for from hello how i in is it its me my of on or please tell than that the their them there these this those to us was we what when where which who why will with would you your
au aux avec bonjour ce ces cet cette dans de des du elle en est et il je la le les leur ma mais me mes mon ne nos nous ou par pas pour pouvez quel quelle quels quelles qui sa se ses son sont sur un une vos votre vous
informacion information informations saber conocer quisiera gustaria puedes puede favor merci gracias thanks want know information more mas plus details detalle detalles informacion programme program programa voyage viaje trip tour tours xaluca marruecos morocco maroc""".split())
STOP_WORDS.update("ver veremos vemos visitar visitaremos encontraremos encontrar see visit discover find learn decouvrir decouvre decouvrez voir visiter on faire fait conoceremos cuentame dime explique expliquer dire ofrece ofrecen offer offers propose propone tenemos teneis tienen have has llevar bring porter emporter cuanto combien dura dure lasts duration duracion duree".split())
STOP_WORDS.update("tiene tener estan esta sejour qu".split())

# Narrow spelling/inflection normalization; no semantic expansion of features.
TERM_ALIASES = {
    **dict.fromkeys(("noche", "noches", "night", "nights", "nuit", "nuits"), "night"),
    **dict.fromkeys(("dia", "dias", "day", "days", "jour", "jours"), "day"),
    "fes": "fez", "marrakesh": "marrakech",
}
ITINERARY_WORDS = {"etapa", "etapas", "stage", "stages", "etape", "etapes", "itinerario", "itinerary", "itineraire"}
INCLUSION_WORDS = {"incluye", "incluyen", "incluido", "incluidos", "incluida", "incluidas", "include", "includes", "included", "inclus", "incluse", "incluses", "comprend"}
EXCLUSION_WORDS = {"excluye", "excluyen", "excluido", "excluidos", "excluida", "excluidas", "exclude", "excludes", "excluded", "exclu", "exclus", "excluse", "excluses"}
NEGATION_WORDS = {"no", "not", "non", "pas", "isnt", "doesnt"}


def durations_in(value):
    return {(number, TERM_ALIASES[unit]) for number, unit in re.findall(
        r"\b(\d+)[\s-]*(noches?|nights?|nuits?|dias?|days?|jours?)\b", fold(value))}


def terms(value):
    return {TERM_ALIASES.get(word, word) for word in re.findall(r"[a-z0-9]+", fold(value)) if (len(word) > 1 or word.isdigit()) and word not in STOP_WORDS}


# These topics must be confirmed by a person, even if stale published text
# happens to contain them. Instructions/URLs are never executed or fetched.
SENSITIVE = re.compile(
    r"\b(precio\w*|tarifa\w*|cost[eo]\w*|cuesta\w*|presupuesto\w*|price\w*|pricing|cost|costs|costing|budget\w*|prix|tarif\w*|cout\w*|"
    r"disponib\w*|availability|available|plazas?|vacantes?|book\w*|reserv\w*|comprar|purchase|pay|paying|paid|pago\w*|abonar|payment\w*|"
    r"condicion\w*|conditions?|terms?|cancel\w*|reembols\w*|refund\w*|rembours\w*|garant\w*|guarantee\w*|"
    r"medic\w*|medec\w*|salud|health|sante|vacun\w*|vaccin\w*|embaraz\w*|pregnan\w*|grossesse|alerg\w*|allerg\w*|"
    r"diabet\w*|asma|asthma|cardiac\w*|cardiaque\w*|tratamiento\w*|traitement\w*|treatment\w*|diagnos\w*|enfermedad\w*|maladie\w*|"
    r"legal\w*|jurid\w*|visados?|visas?|passport\w*|pasaport\w*|passeport\w*|documentacion|insurance|assurance|seguro\w*|"
    r"aduanas?|customs|douan\w*|permis\w*|licencia\w*|annul\w*|human\w*|humano\w*|persona|agent|agente|asesor\w*|conseiller)\b|\bhow much (?:does|is|will|would|for)\b|[€$£]"
)
INJECTION = re.compile(r"https?://|www\.|\b(ignore|ignora\w*|oublie\w*|system|systeme|sistema|prompt|instrucciones|instructions|developer|secret\w*|api.?key|invent\w*|pretend\w*|simulate\w*|simula\w*)\b")


class KnowledgeBase:
    def __init__(self, documents):
        self.documents = []
        self.by_id = {}
        self.path_frequency = {lang: {} for lang in LANGUAGES}
        paths = {lang: {} for lang in LANGUAGES}
        if not isinstance(documents, list) or len(documents) > 12000:
            raise ValueError("Invalid corpus")
        for source in documents:
            # Only relative site links from the server-owned corpus are allowed.
            if (not isinstance(source, dict) or source.get("lang") not in LANGUAGES
                    or source.get("kind") not in {"trip", "practical", "contact"}
                    or not isinstance(source.get("id"), str) or not 0 < len(source["id"]) <= 160
                    or source["id"] in self.by_id
                    or not isinstance(source.get("path"), str)
                    or not re.fullmatch(r"/[a-zA-Z0-9_/-]*(?:#[a-zA-Z0-9_-]+)?", source["path"])
                    or source["path"].startswith("//") or ".." in source["path"]
                    or not isinstance(source.get("title"), str) or not 0 < len(source["title"]) <= 500
                    or not isinstance(source.get("text"), str) or not 0 < len(source["text"]) <= 12000
                    or not isinstance(source.get("keywords", []), list)
                    or not all(isinstance(word, str) and len(word) <= 300 for word in source.get("keywords", []))):
                raise ValueError("Invalid corpus document")
            doc = {key: source[key] for key in ("id", "lang", "title", "path", "text", "kind")}
            doc["title_terms"] = terms(doc["title"] + " " + " ".join(source.get("keywords", [])))
            doc["terms"] = terms(doc["text"]) | doc["title_terms"]
            self.documents.append(doc)
            self.by_id[doc["id"]] = doc
            paths[doc["lang"]].setdefault(doc["path"], set()).update(doc["terms"])
        self.path_counts = {lang: max(1, len(items)) for lang, items in paths.items()}
        for lang, items in paths.items():
            for words in items.values():
                for word in words:
                    self.path_frequency[lang][word] = self.path_frequency[lang].get(word, 0) + 1
        self.programs = {lang: {} for lang in LANGUAGES}
        for doc in self.documents:
            match = re.fullmatch(r"(es|en|fr):([a-zA-Z0-9_-]+):overview:1", doc["id"])
            if not match or match[1] != doc["lang"] or doc["kind"] != "trip":
                continue
            # Read the published nights/days pair verbatim; do not infer route
            # variants, names, seasons, durations or programme IDs.
            duration = re.search(
                r"(\d+) (?:noches?|nights?|nuits?) / \d+ (?:días?|days?|jours?)$",
                doc["title"], re.IGNORECASE,
            )
            if not duration or not 0 < int(duration[1]) <= 365:
                continue
            prefix = f"{doc['lang']}:{match[2]}:"
            sections = {name: [] for name in ("overview", "itinerary", "includes", "excludes", "practical")}
            for source in self.documents:
                if (source["lang"] != doc["lang"] or source["path"] != doc["path"]
                        or not source["id"].startswith(prefix)):
                    continue
                source_section = source["id"].split(":")[2]
                section = {"day": "itinerary", "notes": "practical", "packing": "practical"}.get(source_section, source_section)
                expected_kind = "practical" if section == "practical" else "trip"
                if section in sections and source["kind"] == expected_kind:
                    sections[section].append(source)
            self.programs[doc["lang"]][doc["id"]] = {
                "overview": doc, "duration": int(duration[1]),
                "duration_label": duration[0], "sections": sections,
            }

    @staticmethod
    def literal_chunks(text):
        """Partition the complete source without changing or dropping a byte.

        Prefer sentence/line boundaries, then whitespace. An overlong word is
        split at the limit. Every chunk remains a literal contiguous excerpt.
        """
        start = 0
        while start < len(text):
            end = min(start + MAX_EXCERPT, len(text))
            if end < len(text):
                candidate = text[start:end]
                boundaries = list(re.finditer(r"(?<=[.!?])\s+|\n+", candidate))
                if not boundaries:
                    boundaries = list(re.finditer(r"\s+", candidate))
                if boundaries:
                    end = start + boundaries[-1].end()
            yield text[start:end]
            start = end

    def guide(self, payload):
        language = payload.language
        ui = GUIDE_COPY[language]
        selection = payload.model_dump(exclude_none=True)
        topic, duration, program_id, section = payload.topic, payload.duration, payload.program_id, payload.section
        result = {
            "title": ui["root"], "options": [], "sources": [],
            "selection": selection, "handoff": False,
        }

        def option(identifier, label, **changes):
            return {"id": identifier, "label": label, "selection": {**selection, **changes, "page": 1}}

        def paginated(items, size):
            pages = max(1, math.ceil(len(items) / size))
            if payload.page > pages:
                fail(422, "invalid_selection")
            result["pagination"] = {
                "page": payload.page, "pages": pages,
                "previous": {**selection, "page": payload.page - 1} if payload.page > 1 else None,
                "next": {**selection, "page": payload.page + 1} if payload.page < pages else None,
            }
            start = (payload.page - 1) * size
            return items[start:start + size]

        def source_page(documents):
            sources = [
                {"id": doc["id"], "title": doc["title"], "path": doc["path"], "excerpt": chunk}
                for doc in documents for chunk in self.literal_chunks(doc["text"])
            ]
            result["description"] = ui["sources"]
            result["sources"] = paginated(sources, SOURCE_PAGE_SIZE)
            return result

        if topic is None:
            if duration is not None or program_id is not None or section is not None or payload.page != 1:
                fail(422, "invalid_selection")
            result["options"] = [option(item, ui[item], topic=item) for item in ("trips", "practical", "contact", "human")]
            return result

        if topic in {"contact", "human"}:
            if duration is not None or program_id is not None or section is not None:
                fail(422, "invalid_selection")
            result["title"] = ui[topic]
            if topic == "human":
                if payload.page != 1:
                    fail(422, "invalid_selection")
                result.update(description=ui["handoff"], handoff=True)
                return result
            return source_page([doc for doc in self.documents if doc["lang"] == language and doc["kind"] == "contact"])

        programs = self.programs[language]
        available = [program for program in programs.values() if topic != "practical" or program["sections"]["practical"]]
        durations = {program["duration"] for program in available}
        if duration is None:
            if program_id is not None or section is not None or payload.page != 1:
                fail(422, "invalid_selection")
            result["title"] = ui["duration"]
            result["options"] = [
                option(f"duration:{value}", " / ".join(dict.fromkeys(
                    program["duration_label"] for program in available if program["duration"] == value
                )), duration=value)
                for value in sorted(durations)
            ]
            if available:
                result["options"].append(option("duration:0", ui["all"], duration=0))
            return result
        if duration != 0 and duration not in durations:
            fail(422, "invalid_selection")
        if program_id is None:
            if section is not None:
                fail(422, "invalid_selection")
            result["title"] = ui["programs"]
            candidates = [program for program in available if duration == 0 or program["duration"] == duration]
            result["options"] = [
                option(program["overview"]["id"], program["overview"]["title"], program_id=program["overview"]["id"])
                for program in paginated(candidates, PROGRAM_PAGE_SIZE)
            ]
            return result

        program = programs.get(program_id)
        if (program is None or duration not in {0, program["duration"]}
                or topic == "practical" and (not program["sections"]["practical"] or section not in {None, "practical"})):
            fail(422, "invalid_selection")
        result["title"] = program["overview"]["title"]
        if topic == "practical":
            return source_page(program["sections"]["practical"])
        if section is None:
            if payload.page != 1:
                fail(422, "invalid_selection")
            result["description"] = ui["sections"]
            result["options"] = [option(name, ui[name], section=name) for name, docs in program["sections"].items() if docs]
            return result
        if not program["sections"][section]:
            fail(422, "invalid_selection")
        return source_page(program["sections"][section])

    def excerpt(self, doc, query):
        text = doc["text"]
        if len(text) <= MAX_EXCERPT:
            return text
        # Choose a sentence/line boundary and return a contiguous literal span.
        starts = [0] + [match.end() for match in re.finditer(r"(?<=[.!?])\s+|\n+", text)]
        start = max(starts, key=lambda position: len(terms(text[position:position + MAX_EXCERPT]) & query))
        end = min(len(text), start + MAX_EXCERPT)
        if end < len(text):
            last_space = text.rfind(" ", start, end)
            if last_space > start:
                end = last_space
        return text[start:end].strip()

    def response(self, message, language, context_source_ids=()):
        normalized = fold(message)
        def result(key, sources=(), handoff=False, context=()):
            return {"answer": COPY[language][key], "sources": list(sources), "handoff": handoff, "context_source_ids": list(context)}
        if SENSITIVE.search(normalized) or INJECTION.search(normalized):
            return result("sensitive" if SENSITIVE.search(normalized) else "unknown", handoff=True)
        if is_onboarding(message, language):
            return result("onboarding")
        query = terms(message)
        words = set(re.findall(r"[a-z0-9]+", normalized.replace("'", "")))
        section = None
        negative_inclusion = re.search(
            r"\b(?:no|not|non|pas|isnt|doesnt)\s+(?:(?:esta|estan|es|is|are|est|sont|se)\s+){0,2}(?:"
            + "|".join(sorted(INCLUSION_WORDS)) + r")\b", normalized.replace("'", ""))
        if words & EXCLUSION_WORDS or negative_inclusion:
            section = "excludes"
        elif words & INCLUSION_WORDS:
            section = "includes"
        elif words & ITINERARY_WORDS:
            section = "itinerary"
        if section:
            # These words ask for a known document section, not a factual
            # feature. Unknown features such as wifi remain mandatory terms.
            query -= ITINERARY_WORDS | INCLUSION_WORDS | EXCLUSION_WORDS | NEGATION_WORDS
        # Client context only selects known, same-language corpus IDs. It never
        # supplies source text, instructions, URLs or new facts.
        context_paths = {self.by_id[item]["path"] for item in context_source_ids if item in self.by_id and self.by_id[item]["lang"] == language}
        context_only = not query and bool(section) and len(context_paths) == 1
        if not query and not context_only:
            return result("unknown", handoff=True)
        weights = {word: 1 + math.log((self.path_counts[language] + 1) / (self.path_frequency[language].get(word, 0) + 1)) for word in query}
        durations = durations_in(message)
        query_phrase = " ".join(TERM_ALIASES.get(word, word) for word in re.findall(r"[a-z0-9]+", normalized) if word not in STOP_WORDS)
        ranked = []
        for doc in self.documents:
            if doc["lang"] != language:
                continue
            if context_only and doc["path"] not in context_paths:
                continue
            # IDs and section labels are supplied by our checked-in generator.
            doc_section = doc["id"].split(":")[2] if doc["id"].count(":") >= 2 else None
            if section and doc_section not in ({"overview", "day"} if section == "itinerary" else {section}):
                continue
            if durations and not durations.issubset(durations_in(doc["title"])):
                continue
            matches = query & doc["terms"]
            # A route name must not drown out an unsupported feature (e.g.
            # "wifi in Atlas Desert Merzouga"). Every substantive query term
            # must be present in the same source; uncertainty means handoff.
            if not context_only and (not matches or matches != query):
                continue
            score = 1 if context_only else sum(weights[word] * (2 if word in doc["title_terms"] else 1) for word in matches)
            # Route order disambiguates Atlas → Desert from Desert → Atlas.
            # This uses only known local route segments, never client URLs.
            route_phrases = [" ".join(TERM_ALIASES.get(word, word) for word in re.findall(r"[a-z]+", segment)) for segment in doc["path"].split("/")]
            if any(len(phrase.split()) >= 2 and phrase in query_phrase for phrase in route_phrases):
                score *= 1.3
            ranked.append((score, doc))
        ranked.sort(key=lambda item: (-item[0], 0 if ":overview:" in item[1]["id"] else 1, item[1]["id"]))
        if not ranked:
            return result("unknown", handoff=True)
        best_by_path = {}
        for score, doc in ranked:
            best_by_path.setdefault(doc["path"], (score, doc))
        candidates = list(best_by_path.values())
        close = [item for item in candidates if item[0] >= candidates[0][0] * 0.85]
        # A prior explicit selection can resolve a close match, not override a
        # strong new subject. Never carry ambiguous multi-route context forward.
        contextual = [item for item in close if item[1]["path"] in context_paths]
        if len(context_paths) == 1 and len(contextual) == 1:
            chosen_path = contextual[0][1]["path"]
        elif len(close) > 1:
            choices = [{"id": doc["id"], "title": doc["title"], "path": doc["path"], "excerpt": self.excerpt(doc, query)} for _, doc in close[:3]]
            return result("ambiguous", choices)
        else:
            chosen_path = candidates[0][1]["path"]
        selected = [doc for _, doc in ranked if doc["path"] == chosen_path][:3]
        sources = [{"id": doc["id"], "title": doc["title"], "path": doc["path"], "excerpt": self.excerpt(doc, query)} for doc in selected]
        return result("sources", sources, context=[doc["id"] for doc in selected])


@lru_cache(maxsize=1)
def load_knowledge():
    if CORPUS_PATH.stat().st_size > 12 * 1024 * 1024:
        raise ValueError("Corpus too large")
    data = json.loads(CORPUS_PATH.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or data.get("version") != 1:
        raise ValueError("Invalid corpus")
    return KnowledgeBase(data.get("documents"))


def register_assistant_routes(router, get_db, knowledge=None):
    guard = RequestGuard()

    def configured():
        secret = signing_secret()
        try:
            corpus = knowledge if knowledge is not None else load_knowledge()
        except (OSError, ValueError, TypeError):
            corpus = None
        if not secret or not corpus or not corpus.documents:
            fail(503, "unavailable")
        return secret, corpus

    @router.get("/assistant/status")
    async def assistant_status():
        try:
            configured()
            available = True
        except HTTPException:
            available = False
        return JSONResponse({"available": available}, headers={"Cache-Control": "no-store"})

    @router.post("/assistant/session")
    async def assistant_session(request: Request):
        secret, _ = configured()
        peer = request.client.host if request.client else "unknown"
        guard.enter("identity-ip", peer, 10)
        guard.enter("identity-global", "all", 300)
        try:
            payload = await asyncio.wait_for(parse_input(request, SessionInput), timeout=15)
        except asyncio.TimeoutError:
            fail(408, "request_timeout")
        data = payload.model_dump()
        # Identity capture is separate from an enquiry. Never call the contact
        # endpoint, email senders, newsletter sync or a model from this gate.
        data.update(capture_type="assistant", message=COPY[payload.language]["identity"])
        record = AssistantLead(**data)
        try:
            record, _ = await asyncio.wait_for(save_submission(get_db().contact_requests, record), timeout=15)
        except Exception:
            # Neither database diagnostics nor submitted contact data are public.
            fail(503, "unavailable")
        token, expires_at = make_token(record.id, secret)
        return JSONResponse({"token": token, "expires_at": expires_at}, headers={"Cache-Control": "no-store"})

    @router.post("/assistant/messages")
    async def assistant_message():
        # Do not read, validate, persist or process legacy free-form bodies.
        fail(410, "guided_only")

    @router.post("/assistant/guide")
    async def assistant_guide(request: Request):
        secret, corpus = configured()
        peer = request.client.host if request.client else "unknown"
        guard.enter("guide-ip", peer, 120)
        guard.enter("guide-global", "all", 6000)
        authorization = request.headers.get("authorization", "")
        if not authorization.startswith("Bearer "):
            fail(401, "session_expired")
        lead_id = verify_token(authorization[7:], secret)
        guard.enter("guide-session", lead_id, 80)
        try:
            payload = await asyncio.wait_for(parse_input(request, GuideInput), timeout=15)
        except asyncio.TimeoutError:
            fail(408, "request_timeout")
        result = corpus.guide(payload)
        return JSONResponse(result, headers={"Cache-Control": "no-store"})
