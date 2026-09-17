#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Генератор таблиц спряжений французских глаголов -> data/verbs.js
Создаёт полные таблицы: indicatif (8 temps), conditionnel (2), subjonctif (4),
impératif, participe présent/passé, gérondif — для ~100 глаголов.
"""
import json, re, os

SUBJ = ["je", "tu", "il/elle/on", "nous", "vous", "ils/elles"]
VOYELLES = "aeiouyhéêèàâôûîï"

def join(subj, form):
    if subj == "je" and form[:1].lower() in VOYELLES:
        return "j'" + form
    return subj + " " + form

def fix_c_g(stem, ending):
    """commencer→commençons, manger→mangeons"""
    if stem.endswith("c") and ending[:1] in "aoû":
        return stem[:-1] + "ç", ending
    if stem.endswith("g") and ending[:1] in "ao":
        return stem + "e", ending
    return stem, ending

def er_present(stem, double=None, grave=False, yer=False):
    silent = [True, True, True, False, False, True]
    res = []
    for i, end in enumerate(["e", "es", "e", "ons", "ez", "ent"]):
        s = stem
        if silent[i]:
            if double == "ll": s = stem + "l"
            elif double == "tt": s = stem + "t"
            elif grave: s = re.sub(r"([eé])([^aeiouyéèêàùûüîïôâœé]*)$", r"è\2", stem)
            if yer: s = re.sub(r"y([^aeiouyéèêàùûüîïôâœ]*)$", r"i\1", s)
        s, end = fix_c_g(s, end)
        res.append(s + end)
    return res

def build_imparfait(nous_stem):
    out = []
    for end in ["ais", "ais", "ait", "ions", "iez", "aient"]:
        s, e = fix_c_g(nous_stem, end)
        out.append(s + e)
    return out

def build_futur(stem):   return [stem + e for e in ["ai", "as", "a", "ons", "ez", "ont"]]
def build_cond(stem):    return [stem + e for e in ["ais", "ais", "ait", "ions", "iez", "aient"]]

def build_ps_er(nous_stem):
    out = []
    for end in ["ai", "as", "a", "âmes", "âtes", "èrent"]:
        s, e = fix_c_g(nous_stem, end)
        out.append(s + e)
    return out

def build_ps_is(stem):
    out = []
    for end in ["is", "is", "it", "îmes", "îtes", "irent"]:
        s, e = fix_c_g(stem, end)
        out.append(s + e)
    return out

def build_sub(stem_s, stem_nous):
    out = []
    for s, end in [(stem_s, "e"), (stem_s, "es"), (stem_s, "e"),
                   (stem_nous, "ions"), (stem_nous, "iez"), (stem_s, "ent")]:
        s2, e = fix_c_g(s, end)
        out.append(s2 + e)
    return out

def build_sub_imp(ps3):
    """Subjonctif imparfait: основа = 3 л. ед.ч. passé simple.
    - если кончается на t: убрать t (vint -> vin- + sse = vinsse); 3 л. = с циркумфлексом (vînt)
    - если кончается на a (I группа): основа = вся форма (parla -> parlasse); 3 л. = parlât"""
    ACC = {"a": "â", "i": "î", "u": "û", "e": "ê", "o": "ô"}
    if ps3.endswith("t"):
        stem = ps3[:-1]
        third = None
        for idx in range(len(stem) - 1, -1, -1):
            if stem[idx] in ACC:
                third = stem[:idx] + ACC[stem[idx]] + stem[idx + 1:] + "t"
                break
        if third is None:
            third = ps3
    else:
        stem = ps3          # parla -> parl-asse
        third = ps3[:-1] + "ât"  # parlât
    out = []
    for i, end in enumerate(["sse", "sses", "@3", "ssions", "ssiez", "ssent"]):
        if end == "@3":
            out.append(third)
            continue
        s, e = fix_c_g(stem, end)
        out.append(s + e)
    return out

def refl_pron(i, form):
    p = ["me", "te", "se", "nous", "vous", "se"][i]
    if i in (3, 4):
        return p + " "
    if form[:1].lower() in VOYELLES:
        return p[0] + "'"
    return p + " "

AUX_FORMS = {
    "avoir": {
        "présent": ["ai", "as", "a", "avons", "avez", "ont"],
        "imparfait": ["avais", "avais", "avait", "avions", "aviez", "avaient"],
        "futur": ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
        "conditionnel": ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
        "subjonctif": ["aie", "aies", "ait", "ayons", "ayez", "aient"],
        "ps": ["eus", "eus", "eut", "eûmes", "eûtes", "eurent"],
        "sub_imp": ["eusse", "eusses", "eût", "eussions", "eussiez", "eussent"],
    },
    "être": {
        "présent": ["suis", "es", "est", "sommes", "êtes", "sont"],
        "imparfait": ["étais", "étais", "était", "étions", "étiez", "étaient"],
        "futur": ["serai", "seras", "sera", "serons", "serez", "seront"],
        "conditionnel": ["serais", "serais", "serait", "serions", "seriez", "seraient"],
        "subjonctif": ["sois", "sois", "soit", "soyons", "soyez", "soient"],
        "ps": ["fus", "fus", "fut", "fûmes", "fûtes", "furent"],
        "sub_imp": ["fusse", "fusses", "fût", "fussions", "fussiez", "fussent"],
    },
}

def compound(aux_forms, pp):
    return [aux_forms[i] + " " + pp for i in range(6)]

def build_verb(v):
    inf = v["inf"]
    refl = v.get("refl", False)
    base_inf = re.sub(r"^(se |s')", "", inf) if refl else inf
    en_aller = (inf == "s'en aller")
    if en_aller:
        base_inf = "aller"
    aux = "être" if (refl or v.get("aux") == "être") else v.get("aux", "avoir")
    pp = v["pp"]
    group = v.get("group", 1)

    # ---- présent
    if "pres" in v:
        pres = v["pres"]
    elif base_inf.endswith("er") and group == 1:
        pres = er_present(base_inf[:-2], double=v.get("double"), grave=v.get("grave", False), yer=v.get("yer", False))
    elif group == 2 and base_inf.endswith("ir"):
        stem = base_inf[:-2]
        pres = [stem + e for e in ["is", "is", "it", "issons", "issez", "issent"]]
    else:
        raise ValueError("no pres for " + inf)

    nous_stem = pres[3][:-3] if pres[3] != "—" else ""
    ils_stem = re.sub(r"ent$", "", pres[5]) if pres[5] != "—" else "—"
    # основа для subjonctif nous/vous: без орфографических вставок (mangeons -> mangions, commençons -> commencions)
    sub_nous_stem = nous_stem
    if sub_nous_stem.endswith("ç"):
        sub_nous_stem = sub_nous_stem[:-1] + "c"
    if pres[3].endswith("eons") and base_inf[:-2].endswith("g"):
        sub_nous_stem = nous_stem[:-1]

    # ---- imparfait
    imp = v.get("imp") or build_imparfait(nous_stem)

    # ---- futur / conditionnel
    if "fut" in v:
        fstem = v["fut"]
    elif group == 1:
        fstem = base_inf
    elif base_inf.endswith("re"):
        fstem = base_inf[:-1]
    else:
        fstem = base_inf
    fut = build_futur(fstem)
    cond = build_cond(fstem)

    # ---- passé simple
    if "ps" in v:
        ps = v["ps"] if isinstance(v["ps"], list) else build_ps_is(v["ps"])
    elif group == 1:
        ps = build_ps_er(nous_stem)
    elif group == 2:
        ps = build_ps_is(base_inf[:-2])
    else:
        ps = build_ps_is(nous_stem)

    # ---- subjonctif présent / imparfait
    if "sub" in v:
        sub = v["sub"] if isinstance(v["sub"], list) else build_sub(v["sub"], v.get("sub_nous") or sub_nous_stem)
    else:
        sub = build_sub(ils_stem, sub_nous_stem)
    if ps[2] not in ("—",):
        sub_imp = build_sub_imp(ps[2])
    else:
        sub_imp = ["—"] * 6

    # ---- impératif
    if v.get("imper", "X") is None:
        imper = None
    elif "imper" in v:
        imper = v["imper"]
    elif group == 1:
        t = pres[1]
        if t.endswith("s"): t = t[:-1]
        imper = [t, pres[3], pres[4]]
    else:
        imper = [pres[1], pres[3], pres[4]]

    # ---- participe présent / gérondif
    ppres = v.get("part_pres") or (fix_c_g(nous_stem, "ant")[0] + fix_c_g(nous_stem, "ant")[1])
    ger = "—" if ppres == "—" else "en " + ppres

    A = AUX_FORMS[aux]
    tenses = {
        "présent": pres,
        "passé composé": compound(A["présent"], pp),
        "imparfait": imp,
        "plus-que-parfait": compound(A["imparfait"], pp),
        "passé simple": ps,
        "passé antérieur": compound(A["ps"], pp),
        "futur simple": fut,
        "futur antérieur": compound(A["futur"], pp),
        "conditionnel présent": cond,
        "conditionnel passé": compound(A["conditionnel"], pp),
        "subjonctif présent": sub,
        "subjonctif passé": compound(A["subjonctif"], pp),
        "subjonctif imparfait": sub_imp,
        "subjonctif plus-que-parfait": compound(A["sub_imp"], pp),
    }

    forms = {}
    COMPOUND_T = {"passé composé", "plus-que-parfait", "passé antérieur", "futur antérieur",
                  "conditionnel passé", "subjonctif passé", "subjonctif plus-que-parfait"}
    NO_ACCORD = {"se demander"}  # se = COI: elle s'est demandé (без согласования)
    if refl:
        for name, arr in tenses.items():
            if en_aller:
                arr = ["en " + a if a != "—" else "—" for a in arr]
            if name in COMPOUND_T and inf not in NO_ACCORD:
                arr = [(a + "s") if (i in (3, 4, 5) and a != "—" and a[-1] not in "sx") else a
                       for i, a in enumerate(arr)]
            forms[name] = [SUBJ[i] + " " + refl_pron(i, arr[i]) + arr[i] if arr[i] != "—" else "—" for i in range(6)]
        if en_aller:
            forms["présent"] = ["je m'en vais", "tu t'en vas", "il s'en va", "nous nous en allons",
                                "vous vous en allez", "ils s'en vont"]
            forms["imparfait"] = ["je m'en allais", "tu t'en allais", "il s'en allait", "nous nous en allions",
                                  "vous vous en alliez", "ils s'en allaient"]
            forms["futur simple"] = ["je m'en irai", "tu t'en iras", "il s'en ira", "nous nous en irons",
                                     "vous vous en irez", "ils s'en iront"]
            forms["conditionnel présent"] = ["je m'en irais", "tu t'en irais", "il s'en irait", "nous nous en irions",
                                             "vous vous en iriez", "ils s'en iraient"]
            forms["passé composé"] = ["je m'en suis allé(e)", "tu t'en es allé(e)", "il s'en est allé",
                                      "nous nous en sommes allé(e)s", "vous vous en êtes allé(e)s", "ils s'en sont allés"]
        # impératif возвратный
        if en_aller:
            imper_out = ["va-t'en", "allons-nous-en", "allez-vous-en"]
        elif imper:
            imper_out = [imper[0] + "-toi", imper[1] + "-nous", imper[2] + "-vous"]
        else:
            imper_out = None
    else:
        for name, arr in tenses.items():
            forms[name] = [join(SUBJ[i], arr[i]) if arr[i] != "—" else "—" for i in range(6)]
        imper_out = imper

    forms["impératif"] = imper_out

    notes = v.get("notes", "")
    if refl:
        extra = "Возвратный глагол: составные времена с être, причастие согласуется с подлежащим (je me suis levé / levée)."
        notes = (notes + " " + extra).strip()

    result = {
        "inf": inf, "ru": v["ru"], "group": group, "aux": aux, "pp": pp,
        "refl": refl, "part_pres": ppres, "gerondif": ger,
        "forms": forms, "imper": imper_out, "notes": notes,
        "example": v.get("example"), "tags": v.get("tags", []),
    }
    return result

# ================================================================ БАЗА ГЛАГОЛОВ
V = []
def add(**kw): V.append(kw)

add(inf="être", ru="быть; являться", group=3, aux="avoir", pp="été",
    pres=["suis", "es", "est", "sommes", "êtes", "sont"], fut="ser",
    ps=["fus", "fus", "fut", "fûmes", "fûtes", "furent"], sub="soi",
    imper=["sois", "soyons", "soyez"], part_pres="étant",
    example=("Je suis étudiant. — Il est tard. — Nous sommes contents.", "Я студент. — Уже поздно. — Мы довольны."),
    notes="Самый важный глагол языка. C'est / ce sont — «это».", tags=["топ-20"])
add(inf="avoir", ru="иметь; вспомогательный глагол", group=3, aux="avoir", pp="eu",
    pres=["ai", "as", "a", "avons", "avez", "ont"], fut="aur",
    ps=["eus", "eus", "eut", "eûmes", "eûtes", "eurent"], sub="ai",
    imper=["aie", "ayons", "ayez"], part_pres="ayant",
    example=("J'ai une voiture. — Il a faim. — Nous avons fini.", "У меня есть машина. — Он голоден. — Мы закончили."),
    notes="j'ai ... лет = мне ... лет; avoir faim/soif/froid/peur — «быть голодным» и т.д.", tags=["топ-20"])
add(inf="aller", ru="идти, ехать", group=3, aux="être", pp="allé",
    pres=["vais", "vas", "va", "allons", "allez", "vont"], fut="ir",
    sub=["aille", "ailles", "aille", "allions", "alliez", "aillent"],
    imper=["va", "allons", "allez"],
    example=("Je vais au travail. — Nous allons à Paris.", "Я иду на работу. — Мы едем в Париж."),
    notes="Futur proche: je vais + инфинитив = «я собираюсь сделать». Comment vas-tu ? — Как дела?", tags=["топ-20"])
add(inf="faire", ru="делать", group=3, aux="avoir", pp="fait",
    pres=["fais", "fais", "fait", "faisons", "faites", "font"], fut="fer",
    ps=["fis", "fis", "fit", "fîmes", "fîtes", "firent"], sub="fass",
    imper=["fais", "faisons", "faites"], part_pres="faisant",
    example=("Je fais du sport. — Qu'est-ce que tu fais ?", "Я занимаюсь спортом. — Что ты делаешь?"),
    notes="faire + инфинитив = каузатив: je fais réparer la voiture (мне ремонтируют машину). Faites — форма vous.", tags=["топ-20"])
add(inf="dire", ru="говорить, сказать", group=3, aux="avoir", pp="dit",
    pres=["dis", "dis", "dit", "disons", "dites", "disent"], fut="dir",
    ps=["dis", "dis", "dit", "dîmes", "dîtes", "dirent"], sub="dis",
    imper=["dis", "disons", "dites"], part_pres="disant",
    example=("Je dis la vérité. — Comment dit-on ... en français ?", "Я говорю правду. — Как сказать ... по-французски?"),
    notes="Форма vous = DITES (не *disez).", tags=["топ-20"])
add(inf="pouvoir", ru="мочь, быть в состоянии", group=3, aux="avoir", pp="pu",
    pres=["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], fut="pourr",
    ps=["pus", "pus", "put", "pûmes", "pûtes", "purent"], sub="puiss", part_pres="pouvant",
    imper=None,
    example=("Je peux t'aider. — Puis-je entrer ?", "Я могу тебе помочь. — Можно войти?"),
    notes="Conditionnel: je pourrais = «я бы мог». Вежливая форма: Puis-je...? / Pourriez-vous...?", tags=["топ-20", "модальный"])
add(inf="vouloir", ru="хотеть", group=3, aux="avoir", pp="voulu",
    pres=["veux", "veux", "veut", "voulons", "voulez", "veulent"], fut="voudr",
    ps=["voulus", "voulus", "voulut", "voulûmes", "voulûtes", "voulurent"],
    sub=["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"],
    imper=["veuille", "veuillons", "veuillez"], part_pres="voulant",
    example=("Je veux un café. — Je voudrais un café (вежливо).", "Я хочу кофе. — Я бы хотел кофе."),
    notes="Je voudrais... — стандартная вежливая просьба. Veuillez... = «соблаговолите».", tags=["топ-20", "модальный"])
add(inf="savoir", ru="знать (факт, уметь)", group=3, aux="avoir", pp="su",
    pres=["sais", "sais", "sait", "savons", "savez", "savent"], fut="saur",
    ps=["sus", "sus", "sut", "sûmes", "sûtes", "surent"], sub="sach",
    imper=["sache", "sachons", "sachez"], part_pres="sachant",
    example=("Je sais nager. — Je ne sais pas.", "Я умею плавать. — Я не знаю."),
    notes="savoir + inf = уметь; savoir que... = знать факт. Ср. connaître = знать кого/что.", tags=["топ-20"])
add(inf="voir", ru="видеть", group=3, aux="avoir", pp="vu",
    pres=["vois", "vois", "voit", "voyons", "voyez", "voient"], fut="verr",
    ps=["vis", "vis", "vit", "vîmes", "vîtes", "virent"], part_pres="voyant",
    example=("Je vois la mer. — On se verra demain. — Voyons !", "Я вижу море. — Увидимся завтра. — Ну конечно!"),
    notes="В будущем времени основа verr- (je verrai — два r).", tags=["топ-20"])
add(inf="venir", ru="приходить, приезжать", group=3, aux="être", pp="venu",
    pres=["viens", "viens", "vient", "venons", "venez", "viennent"], fut="viendr",
    ps=["vins", "vins", "vint", "vînmes", "vîntes", "vinrent"],
    sub=["vienne", "viennes", "vienne", "venions", "veniez", "viennent"], part_pres="venant",
    example=("Je viens de Russie. — Il vient de partir.", "Я из России. — Он только что ушёл."),
    notes="venir de + infinitif = ближайшее прошедшее («только что сделал»). Je viens de manger = я только что поел.", tags=["топ-20"])
add(inf="tenir", ru="держать; tenir à — дорожить", group=3, aux="avoir", pp="tenu",
    pres=["tiens", "tiens", "tient", "tenons", "tenez", "tiennent"], fut="tiendr",
    ps=["tins", "tins", "tint", "tînmes", "tîntes", "tinrent"],
    sub=["tienne", "tiennes", "tienne", "tenions", "teniez", "tiennent"], part_pres="tenant",
    example=("Je tiens ta main. — Tiens ! Prends-le.", "Я держу твою руку. — Держи! Возьми."), tags=[])
add(inf="prendre", ru="брать, принимать, садиться (на транспорт)", group=3, aux="avoir", pp="pris",
    pres=["prends", "prends", "prend", "prenons", "prenez", "prennent"], fut="prendr",
    ps=["pris", "pris", "prit", "prîmes", "prîtes", "prirent"],
    sub=["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"], part_pres="prenant",
    example=("Je prends le métro. — Prenez votre temps.", "Я еду на метро. — Не торопитесь."), tags=["топ-20"])
add(inf="comprendre", ru="понимать", group=3, aux="avoir", pp="compris",
    pres=["comprends", "comprends", "comprend", "comprenons", "comprenez", "comprennent"],
    fut="comprendr", ps=["compris", "compris", "comprit", "comprîmes", "comprîtes", "comprirent"],
    sub=["comprenne", "comprennes", "comprenne", "comprenions", "compreniez", "comprennent"],
    part_pres="comprenant",
    example=("Je comprends tout. — Tu me comprends ?", "Я всё понимаю. — Ты меня понимаешь?"), tags=["топ-20"])
add(inf="apprendre", ru="учить, узнавать", group=3, aux="avoir", pp="appris",
    pres=["apprends", "apprends", "apprend", "apprenons", "apprenez", "apprennent"],
    fut="apprendr", ps=["appris", "appris", "apprit", "apprîmes", "apprîtes", "apprirent"],
    sub=["apprenne", "apprennes", "apprenne", "apprenions", "appreniez", "apprennent"],
    part_pres="apprenant",
    example=("J'apprends le français. — J'ai appris la nouvelle.", "Я учу французский. — Я узнал новость."), tags=["топ-20"])
add(inf="mettre", ru="класть, надевать, включать", group=3, aux="avoir", pp="mis",
    pres=["mets", "mets", "met", "mettons", "mettez", "mettent"], fut="mettr",
    ps=["mis", "mis", "mit", "mîmes", "mîtes", "mirent"], sub="mett", part_pres="mettant",
    example=("Je mets la table. — Mets ton manteau !", "Я накрываю на стол. — Надень пальто!"), tags=["топ-20"])
add(inf="permettre", ru="позволять", group=3, aux="avoir", pp="permis",
    pres=["permets", "permets", "permet", "permettons", "permettez", "permettent"], fut="permettr",
    ps=["permis", "permis", "permit", "permîmes", "permîtes", "permirent"], sub="permett",
    part_pres="permettant",
    example=("Permettez-moi de... — Tu me permets ?", "Позвольте мне... — Разрешишь?"), tags=[])
add(inf="promettre", ru="обещать", group=3, aux="avoir", pp="promis",
    pres=["promets", "promets", "promet", "promettons", "promettez", "promettent"], fut="promettr",
    ps="prom", sub="promett", part_pres="promettant",
    example=("Je te le promets.", "Обещаю тебе."), tags=[])
add(inf="partir", ru="уезжать, уходить", group=3, aux="être", pp="parti",
    pres=["pars", "pars", "part", "partons", "partez", "partent"], fut="partir",
    ps="part", sub="part", part_pres="partant",
    example=("Je pars demain. — Le train part à huit heures.", "Я уезжаю завтра. — Поезд отправляется в восемь."),
    notes="partir pour Paris = уехать в Париж; partir de Moscou = уехать из Москвы.", tags=["топ-20"])
add(inf="sortir", ru="выходить", group=3, aux="être", pp="sorti",
    pres=["sors", "sors", "sort", "sortons", "sortez", "sortent"], fut="sortir",
    ps="sort", sub="sort", part_pres="sortant",
    example=("Je sors ce soir. — Sors d'ici !", "Я выхожу сегодня вечером. — Выйди отсюда!"), tags=[])
add(inf="dormir", ru="спать", group=3, aux="avoir", pp="dormi",
    pres=["dors", "dors", "dort", "dormons", "dormez", "dorment"], fut="dormir",
    ps="dorm", sub="dorm", part_pres="dormant",
    example=("Je dors huit heures par nuit.", "Я сплю восемь часов в сутки."), tags=[])
add(inf="sentir", ru="чувствовать; пахнуть", group=3, aux="avoir", pp="senti",
    pres=["sens", "sens", "sent", "sentons", "sentez", "sentent"], fut="sentir",
    ps="sent", sub="sent", part_pres="sentant",
    example=("Je sens le vent. — Ça sent bon !", "Я чувствую ветер. — Как вкусно пахнет!"), tags=[])
add(inf="servir", ru="подавать, обслуживать; servir à — служить для", group=3, aux="avoir", pp="servi",
    pres=["sers", "sers", "sert", "servons", "servez", "servent"], fut="servir",
    ps="serv", sub="serv", part_pres="servant",
    example=("On sert le dîner. — À quoi ça sert ?", "Подают ужин. — Для чего это нужно?"), tags=[])
add(inf="ouvrir", ru="открывать", group=3, aux="avoir", pp="ouvert",
    pres=["ouvre", "ouvres", "ouvre", "ouvrons", "ouvrez", "ouvrent"], fut="ouvrir",
    ps="ouvr", sub="ouvr", part_pres="ouvrant",
    example=("J'ouvre la fenêtre. — Ouvrez vos livres !", "Я открываю окно. — Откройте книги!"),
    notes="Презент как у I группы (j'ouvre ≈ j'aime), но pp = ouvert.", tags=[])
add(inf="offrir", ru="дарить, предлагать", group=3, aux="avoir", pp="offert",
    pres=["offre", "offres", "offre", "offrons", "offrez", "offrent"], fut="offrir",
    ps="offr", sub="offr", part_pres="offrant",
    example=("Je t'offre des fleurs. — Puis-je vous offrir un verre ?", "Я дарю тебе цветы. — Могу предложить вам выпить?"), tags=[])
add(inf="découvrir", ru="обнаруживать, открывать (новое)", group=3, aux="avoir", pp="découvert",
    pres=["découvre", "découvres", "découvre", "découvrons", "découvrez", "découvrent"],
    fut="découvrir", ps="découvr", sub="découvr", part_pres="découvrant",
    example=("On découvre la vérité.", "Мы узнаём правду."), tags=[])
add(inf="lire", ru="читать", group=3, aux="avoir", pp="lu",
    pres=["lis", "lis", "lit", "lisons", "lisez", "lisent"], fut="lir",
    ps=["lus", "lus", "lut", "lûmes", "lûtes", "lurent"], sub="lis", part_pres="lisant",
    example=("Je lis un livre. — Lisez à voix haute !", "Я читаю книгу. — Читайте вслух!"), tags=["топ-20"])
add(inf="écrire", ru="писать", group=3, aux="avoir", pp="écrit",
    pres=["écris", "écris", "écrit", "écrivons", "écrivez", "écrivent"], fut="écrir",
    ps=["écrivis", "écrivis", "écrivit", "écrivîmes", "écrivîtes", "écrivirent"],
    sub="écriv", part_pres="écrivant",
    example=("J'écris une lettre. — Écris-moi !", "Я пишу письмо. — Напиши мне!"), tags=["топ-20"])
add(inf="décrire", ru="описывать", group=3, aux="avoir", pp="décrit",
    pres=["décris", "décris", "décrit", "décrivons", "décrivez", "décrivent"], fut="décrir",
    ps=["décrivis", "décrivis", "décrivit", "décrivîmes", "décrivîtes", "décrivirent"],
    sub="décriv", part_pres="décrivant", example=("Décris ta journée.", "Опиши свой день."), tags=[])
add(inf="connaître", ru="знать (кого/что), быть знакомым", group=3, aux="avoir", pp="connu",
    pres=["connais", "connais", "connaît", "connaissons", "connaissez", "connaissent"],
    fut="connaîtr", ps=["connus", "connus", "connut", "connûmes", "connûtes", "connurent"],
    sub="connaiss", part_pres="connaissant",
    example=("Je connais cette chanson. — Vous connaissez Marie ?", "Я знаю эту песню. — Вы знакомы с Марией?"),
    notes="connaître + сущ. (знать человека/место); savoir + inf/que (знать факт, уметь).", tags=["топ-20"])
add(inf="paraître", ru="казаться, появляться", group=3, aux="avoir", pp="paru",
    pres=["parais", "parais", "paraît", "paraissons", "paraissez", "paraissent"],
    fut="paraîtr", ps=["parus", "parus", "parut", "parûmes", "parûtes", "parurent"],
    sub="paraiss", part_pres="paraissant",
    example=("Il paraît fatigué. — Il paraît qu'il est riche.", "Он кажется усталым. — Говорят, он богат."),
    notes="il paraît que + indicatif (говорят, очевидно); paraître + прил. (казаться). Ср. sembler + subj/indic.", tags=[])
add(inf="disparaître", ru="исчезать", group=3, aux="avoir", pp="disparu",
    pres=["disparais", "disparais", "disparaît", "disparaissons", "disparaissez", "disparaissent"],
    fut="disparaîtr", ps=["disparus", "disparus", "disparut", "disparûmes", "disparûtes", "disparurent"],
    sub="disparaiss", part_pres="disparaissant",
    example=("Le soleil disparaît derrière les nuages.", "Солнце исчезает за облаками."),
    notes="С исчезновением употребляется и être: il a disparu (чаще) / il est disparu (устар.).", tags=[])
add(inf="apparaître", ru="появляться", group=3, aux="avoir", pp="apparu",
    pres=["apparais", "apparais", "apparaît", "apparaissons", "apparaissez", "apparaissent"],
    fut="apparaîtr", ps=["apparus", "apparus", "apparut", "apparûmes", "apparûtes", "apparurent"],
    sub="apparaiss", part_pres="apparaissant",
    example=("Un sourire apparut sur son visage.", "На его лице появилась улыбка."), tags=[])
add(inf="naître", ru="рождаться", group=3, aux="être", pp="né",
    pres=["nais", "nais", "naît", "naissons", "naissez", "naissent"],
    fut="naîtr", ps=["naquis", "naquis", "naquit", "naquîmes", "naquîtes", "naquirent"],
    sub="naiss", part_pres="naissant",
    example=("Je suis né en 1995 à Moscou.", "Я родился в 1995 году в Москве."), tags=[])
add(inf="croire", ru="верить, полагать", group=3, aux="avoir", pp="cru",
    pres=["crois", "crois", "croit", "croyons", "croyez", "croient"], fut="croir",
    ps=["crus", "crus", "crut", "crûmes", "crûtes", "crurent"], sub="croy", part_pres="croyant",
    example=("Je te crois. — Je crois qu'il a raison.", "Я тебе верю. — Думаю, он прав."), tags=[])
add(inf="boire", ru="пить", group=3, aux="avoir", pp="bu",
    pres=["bois", "bois", "boit", "buvons", "buvez", "boivent"], fut="boir",
    ps=["bus", "bus", "but", "bûmes", "bûtes", "burent"],
    sub=["boive", "boives", "boive", "buvions", "buviez", "boivent"], part_pres="buvant",
    example=("Je bois du thé. — Bois ton café !", "Я пью чай. — Пей кофе!"), tags=["топ-20"])
add(inf="vivre", ru="жить", group=3, aux="avoir", pp="vécu",
    pres=["vis", "vis", "vit", "vivons", "vivez", "vivent"], fut="vivr",
    ps=["vécus", "vécus", "vécut", "vécûmes", "vécûtes", "vécurent"], sub="viv", part_pres="vivant",
    example=("Je vis à Moscou. — Vive les vacances !", "Я живу в Москве. — Да здравствуют каникулы!"), tags=["топ-20"])
add(inf="suivre", ru="следовать, следить; посещать (курс)", group=3, aux="avoir", pp="suivi",
    pres=["suis", "suis", "suit", "suivons", "suivez", "suivent"], fut="suivr",
    ps=["suivis", "suivis", "suivit", "suivîmes", "suivîtes", "suivirent"], sub="suiv", part_pres="suivant",
    example=("Je suis un cours de français. — Suivez-moi !", "Я хожу на курс французского. — Следуйте за мной!"),
    notes="Не путай: je suis (être) / je suis (suivre) — одинаково пишется, разный смысл по контексту.", tags=[])
add(inf="construire", ru="строить", group=3, aux="avoir", pp="construit",
    pres=["construis", "construis", "construit", "construisons", "construisez", "construisent"],
    fut="construir", ps="construis", sub="construise", part_pres="construisant",
    example=("On construit une école.", "Строят школу."), tags=[])
add(inf="conduire", ru="водить (машину)", group=3, aux="avoir", pp="conduit",
    pres=["conduis", "conduis", "conduit", "conduisons", "conduisez", "conduisent"],
    fut="conduir", ps="conduis", sub="conduise", part_pres="conduisant",
    example=("Je conduis prudemment.", "Я вожу осторожно."), tags=[])
add(inf="traduire", ru="переводить (текст)", group=3, aux="avoir", pp="traduit",
    pres=["traduis", "traduis", "traduit", "traduisons", "traduisez", "traduisent"],
    fut="traduir", ps="traduis", sub="traduise", part_pres="traduisant",
    example=("Traduisez cette phrase.", "Переведите это предложение."), tags=[])
add(inf="produire", ru="производить", group=3, aux="avoir", pp="produit",
    pres=["produis", "produis", "produit", "produisons", "produisez", "produisent"],
    fut="produir", ps="produis", sub="produise", part_pres="produisant",
    example=("La France produit du vin.", "Франция производит вино."), tags=[])
add(inf="détruire", ru="разрушать", group=3, aux="avoir", pp="détruit",
    pres=["détruis", "détruis", "détruit", "détruisons", "détruisez", "détruisent"],
    fut="détruir", ps="détruis", sub="détuise", part_pres="détruisant", tags=[])
add(inf="craindre", ru="бояться", group=3, aux="avoir", pp="craint",
    pres=["crains", "crains", "craint", "craignons", "craignez", "craignent"],
    fut="craindr", ps="craign", sub="craign", part_pres="craignant",
    example=("Je crains la pluie. — Je crains qu'il ne soit trop tard.", "Я боюсь дождя. — Боюсь, уже слишком поздно."),
    notes="craindre que + subjonctif (+ ne эксплетивное).", tags=[])
add(inf="peindre", ru="рисовать, красить", group=3, aux="avoir", pp="peint",
    pres=["peins", "peins", "peint", "peignons", "peignez", "peignent"],
    fut="peindr", ps="peign", sub="peign", part_pres="peignant", tags=[])
add(inf="joindre", ru="соединять, прилагать", group=3, aux="avoir", pp="joint",
    pres=["joins", "joins", "joint", "joignons", "joignez", "joignent"],
    fut="joindr", ps="joign", sub="joign", part_pres="joignant",
    example=("Je vous joins le document.", "Прилагаю документ."), tags=[])
add(inf="atteindre", ru="достигать", group=3, aux="avoir", pp="atteint",
    pres=["atteins", "atteins", "atteint", "atteignons", "atteignez", "atteignent"],
    fut="atteindr", ps="atteign", sub="atteign", part_pres="atteignant", tags=[])
add(inf="éteindre", ru="выключать, тушить", group=3, aux="avoir", pp="éteint",
    pres=["éteins", "éteins", "éteint", "éteignons", "éteignez", "éteignent"],
    fut="éteindr", ps="éteign", sub="éteign", part_pres="éteignant", tags=[])
add(inf="résoudre", ru="решать (проблему)", group=3, aux="avoir", pp="résolu",
    pres=["résous", "résous", "résout", "résolvons", "résolvez", "résolvent"], fut="résoudr",
    ps=["résolus", "résolus", "résolut", "résolûmes", "résolûtes", "résolurent"],
    sub="résol", part_pres="résolvant", tags=[])
add(inf="rire", ru="смеяться", group=3, aux="avoir", pp="ri",
    pres=["ris", "ris", "rit", "rions", "riez", "rient"], fut="rir",
    ps=["ris", "ris", "rit", "rîmes", "rîtes", "rirent"], sub="ri", part_pres="riant",
    example=("Je ris souvent. — Rire aux éclats.", "Я часто смеюсь. — Хохотать."), tags=[])
add(inf="sourire", ru="улыбаться", group=3, aux="avoir", pp="souri",
    pres=["souris", "souris", "sourit", "sourions", "souriez", "sourient"], fut="sourir",
    ps=["souris", "souris", "sourit", "sourîmes", "sourîtes", "sourirent"], sub="souri", part_pres="souriant",
    example=("Elle sourit tout le temps.", "Она всё время улыбается."), tags=[])
add(inf="plaire", ru="нравиться", group=3, aux="avoir", pp="plu",
    pres=["plais", "plais", "plaît", "plaisons", "plaisez", "plaisent"], fut="plair",
    ps=["plus", "plus", "plut", "plûmes", "plûtes", "plurent"], sub="plais", part_pres="plaisant",
    example=("Ça me plaît. — S'il vous plaît !", "Мне это нравится. — Пожалуйста!"),
    notes="Ça me plaît = «мне это нравится». S'il te/vous plaît = пожалуйста.", tags=[])
add(inf="taire", ru="умалчивать; se taire — молчать", group=3, aux="avoir", pp="tu",
    pres=["tais", "tais", "tait", "taisons", "taisez", "taisent"], fut="tair",
    ps=["tus", "tus", "tut", "tûmes", "tûtes", "turent"], sub="tais", part_pres="taisant", tags=[])
add(inf="vaincre", ru="побеждать", group=3, aux="avoir", pp="vaincu",
    pres=["vaincs", "vaincs", "vainc", "vainquons", "vainquez", "vainquent"],
    fut="vaincr", ps="vainqu", sub="vainqu", part_pres="vainquant", tags=[])
add(inf="coudre", ru="шить", group=3, aux="avoir", pp="cousu",
    pres=["couds", "couds", "coud", "cousons", "cousez", "cousent"], fut="coudr",
    ps="cous", sub="cous", part_pres="cousant", tags=[])
add(inf="fuir", ru="убегать, избегать", group=3, aux="avoir", pp="fui",
    pres=["fuis", "fuis", "fuit", "fuyons", "fuyez", "fuient"], fut="fuir",
    ps="fu", sub="fui", part_pres="fuyant", tags=[])
add(inf="courir", ru="бежать", group=3, aux="avoir", pp="couru",
    pres=["cours", "cours", "court", "courons", "courez", "courent"], fut="courr",
    ps="cour", sub="cour", part_pres="courant",
    example=("Je cours chaque matin.", "Я бегаю каждое утро."), tags=[])
add(inf="mourir", ru="умирать", group=3, aux="être", pp="mort",
    pres=["meurs", "meurs", "meurt", "mourons", "mourez", "meurent"], fut="mourr",
    ps=["mourus", "mourus", "mourut", "mourûmes", "mourûtes", "moururent"],
    sub=["meure", "meures", "meure", "mourions", "mouriez", "meurent"], part_pres="mourant",
    example=("Je meurs de faim !", "Я умираю от голода!"), tags=[])
add(inf="devoir", ru="быть должным, обязанным", group=3, aux="avoir", pp="dû",
    pres=["dois", "dois", "doit", "devons", "devez", "doivent"], fut="devr",
    ps=["dus", "dus", "dut", "dûmes", "dûtes", "durent"],
    sub=["doive", "doives", "doive", "devions", "deviez", "doivent"], part_pres="devant",
    example=("Je dois partir. — Tu devrais dormir.", "Я должен уйти. — Тебе следовало бы поспать."),
    notes="pp m. = dû (с циркумфлексом), f. = due, мн. = dus/dues. Conditionnel: je devrais = «мне следовало бы».", tags=["топ-20", "модальный"])
add(inf="recevoir", ru="получать", group=3, aux="avoir", pp="reçu",
    pres=["reçois", "reçois", "reçoit", "recevons", "recevez", "reçoivent"], fut="recevr",
    ps=["reçus", "reçus", "reçut", "reçûmes", "reçûtes", "reçurent"],
    sub=["reçoive", "reçoives", "reçoive", "recevions", "receviez", "reçoivent"], part_pres="recevant",
    example=("J'ai reçu ta lettre.", "Я получил твоё письмо."), tags=[])
add(inf="apercevoir", ru="замечать, увидеть", group=3, aux="avoir", pp="aperçu",
    pres=["aperçois", "aperçois", "aperçoit", "apercevons", "apercevez", "aperçoivent"], fut="apercevr",
    ps=["aperçus", "aperçus", "aperçut", "aperçûmes", "aperçûtes", "aperçurent"],
    sub=["aperçoive", "aperçoives", "aperçoive", "apercevions", "aperceviez", "aperçoivent"],
    part_pres="apercevant",
    example=("Je viens de m'apercevoir de mon erreur.", "Я только что понял свою ошибку."), tags=[])
add(inf="falloir", ru="быть нужным (только il faut)", group=3, aux="avoir", pp="fallu",
    pres=["—", "—", "faut", "—", "—", "—"], fut="faudr",
    imp=["—", "—", "fallait", "—", "—", "—"],
    ps=["—", "—", "fallut", "—", "—", "—"],
    sub=["—", "—", "faille", "—", "—", "—"],
    part_pres="—", imper=["—", "—", "—"],
    example=("Il faut travailler. — Il faudra partir tôt.", "Нужно работать. — Придётся уехать рано."),
    notes="Безличный глагол: il faut + inf (нужно сделать) / il faut que + subjonctif (нужно, чтобы...).", tags=["модальный"])
add(inf="pleuvoir", ru="идти (о дожде)", group=3, aux="avoir", pp="plu",
    pres=["—", "—", "pleut", "—", "—", "pleuvent"], fut="pleuvr",
    imp=["—", "—", "pleuvait", "—", "—", "pleuvaient"],
    ps=["—", "—", "plut", "—", "—", "—"],
    sub=["—", "—", "pleuve", "—", "—", "—"],
    part_pres="—", imper=["—", "—", "—"],
    example=("Il pleut des cordes.", "Дождь льёт как из ведра."), notes="Безличный: il pleut.", tags=[])
add(inf="valoir", ru="стоить; valoir mieux — лучше", group=3, aux="avoir", pp="valu",
    pres=["vaux", "vaux", "vaut", "valons", "valez", "valent"], fut="vaudr",
    ps=["valus", "valus", "valut", "valûmes", "valûtes", "valurent"],
    sub=["vaille", "vailles", "vaille", "valions", "valiez", "vaillent"], part_pres="valant",
    example=("Ça vaut combien ? — Il vaut mieux partir.", "Сколько это стоит? — Лучше уйти."), tags=[])
add(inf="envoyer", ru="посылать, отправлять", group=1, aux="avoir", pp="envoyé",
    pres=["envoie", "envoies", "envoie", "envoyons", "envoyez", "envoient"], fut="enverr",
    ps="envoy", sub=["envoie", "envoies", "envoie", "envoyions", "envoyiez", "envoient"],
    part_pres="envoyant",
    example=("J'envoie un colis. — Envoie-moi une photo !", "Я отправляю посылку. — Пришли мне фото!"),
    notes="Футур от другой основы: j'enverrai.", tags=[])
add(inf="acquérir", ru="приобретать", group=3, aux="avoir", pp="acquis",
    pres=["acquiers", "acquiers", "acquiert", "acquérons", "acquérez", "acquièrent"],
    fut="acquerr", ps="acqui",
    sub=["acquière", "acquières", "acquière", "acquérions", "acquériez", "acquièrent"],
    part_pres="acquérant", tags=[])
add(inf="asseoir", ru="сажать; s'asseoir — садиться", group=3, aux="avoir", pp="assis",
    pres=["assieds", "assieds", "assied", "asseyons", "asseyez", "asseyent"], fut="assoir",
    ps="assis", sub="assey", part_pres="asseyant",
    example=("Asseyez-vous, je vous en prie.", "Садитесь, пожалуйста."),
    notes="Две равноправные системы: j'assieds / j'assois. Futur: j'assiérai / j'assoirai.", tags=[])
add(inf="s'asseoir", ru="садиться", group=3, aux="avoir", pp="assis", refl=True,
    pres=["assieds", "assieds", "assied", "asseyons", "asseyez", "asseyent"], fut="assoir",
    ps="assis", sub="assey", part_pres="asseyant",
    example=("Je m'assieds près de la fenêtre.", "Я сажусь у окна."), tags=["возвр."])
add(inf="battre", ru="бить, побеждать", group=3, aux="avoir", pp="battu",
    pres=["bats", "bats", "bat", "battons", "battez", "battent"], fut="battr",
    ps="batt", sub="batt", part_pres="battant", tags=[])
add(inf="rompre", ru="ломать, разрывать", group=3, aux="avoir", pp="rompu",
    pres=["romps", "romps", "rompt", "rompons", "rompez", "rompent"], fut="rompr",
    ps="romp", sub="romp", part_pres="rompant", tags=[])
add(inf="absoudre", ru="прощать, отпускать (грехи)", group=3, aux="avoir", pp="absous",
    pres=["absous", "absous", "absout", "absolvons", "absolvez", "absolvent"], fut="absoudr",
    ps=["—"] * 6, sub="absolv", part_pres="absolvant",
    notes="Passé simple не употребляется. pp: m. absous, f. absoute.", tags=[])

# особые -er с чередованиями
add(inf="acheter", ru="покупать", group=1, aux="avoir", pp="acheté", grave=True,
    example=("J'achète du pain.", "Я покупаю хлеб."), tags=["топ-20"])
add(inf="préférer", ru="предпочитать", group=1, aux="avoir", pp="préféré", grave=True, tags=[])
add(inf="espérer", ru="надеяться", group=1, aux="avoir", pp="espéré", grave=True,
    notes="espérer que + indicatif (не subjonctif!).", tags=[])
add(inf="répéter", ru="повторять", group=1, aux="avoir", pp="répété", grave=True, tags=[])
add(inf="lever", ru="поднимать", group=1, aux="avoir", pp="levé", grave=True, tags=[])
add(inf="se lever", ru="вставать", group=1, aux="être", pp="levé", grave=True, refl=True,
    example=("Je me lève à sept heures.", "Я встаю в семь часов."), tags=["возвр."])
add(inf="mener", ru="вести, приводить", group=1, aux="avoir", pp="mené", grave=True, tags=[])
add(inf="se promener", ru="гулять", group=1, aux="être", pp="promené", grave=True, refl=True, tags=["возвр."])
add(inf="appeler", ru="звать, звонить", group=1, aux="avoir", pp="appelé", double="ll", tags=[])
add(inf="rappeler", ru="напоминать; перезванивать", group=1, aux="avoir", pp="rappelé", double="ll", tags=[])
add(inf="s'appeler", ru="зваться, называться", group=1, aux="être", pp="appelé", double="ll", refl=True,
    example=("Comment tu t'appelles ? — Je m'appelle Dani.", "Как тебя зовут? — Меня зовут Даня."), tags=["топ-20", "возвр."])
add(inf="jeter", ru="бросать, выбрасывать", group=1, aux="avoir", pp="jeté", double="tt", tags=[])
add(inf="payer", ru="платить", group=1, aux="avoir", pp="payé", yer=True,
    notes="Допустимы обе формы: je paie / je paye.", tags=[])
add(inf="essayer", ru="пробовать, пытаться", group=1, aux="avoir", pp="essayé", yer=True, tags=[])
add(inf="employer", ru="использовать, нанимать", group=1, aux="avoir", pp="employé", yer=True, tags=[])
add(inf="nettoyer", ru="чистить, убирать", group=1, aux="avoir", pp="nettoyé", yer=True, tags=[])
add(inf="se souvenir", ru="помнить, вспоминать (se souvenir de qch)", group=3, aux="être", pp="souvenu", refl=True,
    pres=["souviens", "souviens", "souvient", "souvenons", "souvenez", "souviennent"],
    fut="souviendr", ps="souvin",
    sub=["souvienne", "souvienne", "souviennes", "souvenions", "souveniez", "souviennent"],
    part_pres="souvenant",
    example=("Je me souviens de ce jour.", "Я помню этот день."),
    notes="se souvenir DE quelque chose (предлог de!).", tags=["возвр."])
add(inf="se taire", ru="молчать", group=3, aux="être", pp="tu", refl=True,
    pres=["tais", "tais", "tait", "taisons", "taisez", "taisent"], fut="tair",
    ps=["tus", "tus", "tut", "tûmes", "tûtes", "turent"], sub="tais", part_pres="taisant",
    example=("Tais-toi ! — Il s'est tu.", "Молчи! — Он замолчал."), tags=["возвр."])
add(inf="s'en aller", ru="уходить, уезжать", group=3, aux="être", pp="allé(e)", refl=True,
    pres=["vais", "vas", "va", "allons", "allez", "vont"], fut="ir",
    sub=["aille", "ailles", "aille", "allions", "alliez", "aillent"],
    example=("Je m'en vais. — Ils s'en sont allés.", "Я ухожу. — Они ушли."), tags=["возвр."])

# ---- обычные -er
ER = [
 ("aimer", "любить", ("Je t'aime. — J'aime le café.", "Я тебя люблю. — Я люблю кофе."), "топ-20"),
 ("parler", "говорить, разговаривать", ("Je parle français et russe.", "Я говорю по-французски и по-русски."), "топ-20"),
 ("donner", "давать, дарить", ("Donne-moi la main.", "Дай мне руку."), "топ-20"),
 ("trouver", "находить; trouver que — считать", ("Je trouve ça génial.", "Я нахожу это классным."), "топ-20"),
 ("penser", "думать", ("Je pense donc je suis.", "Я мыслю, следовательно, я существую."), "топ-20"),
 ("regarder", "смотреть", ("Regarde-moi ! — Regarder la télé.", "Посмотри на меня! — Смотреть телевизор."), "топ-20"),
 ("écouter", "слушать", ("J'écoute de la musique.", "Я слушаю музыку."), "топ-20"),
 ("demander", "спрашивать, просить", ("Je demande pardon. — Demander de l'aide.", "Я прошу прощения. — Просить помощи."), "топ-20"),
 ("habiter", "жить, проживать", ("J'habite à Paris.", "Я живу в Париже."), ""),
 ("travailler", "работать", ("Je travaille beaucoup.", "Я много работаю."), ""),
 ("chanter", "петь", ("Elle chante bien.", "Она хорошо поёт."), ""),
 ("danser", "танцевать", ("On danse toute la nuit.", "Мы танцуем всю ночь."), ""),
 ("jouer", "играть; jouer de + инструмент", ("Je joue du piano et au foot.", "Я играю на пианино и в футбол."), ""),
 ("manger", "есть, кушать", ("On mange à midi.", "Мы едим в полдень."), "топ-20"),
 ("voyager", "путешествовать", ("J'aime voyager.", "Я люблю путешествовать."), ""),
 ("chercher", "искать", ("Je cherche mes clés.", "Я ищу ключи."), ""),
 ("arriver", "прибывать, случаться", ("J'arrive ! — Il arrive à 8 h.", "Иду! — Он приезжает в 8."), ""),
 ("entrer", "входить", ("Entrez, la porte est ouverte.", "Входите, дверь открыта."), ""),
 ("rester", "оставаться", ("Reste ici ! — Rester à la maison.", "Оставайся здесь! — Оставаться дома."), ""),
 ("tomber", "падать", ("Il est tombé malade.", "Он заболел (упал больным)."), ""),
 ("rentrer", "возвращаться домой", ("Je rentre tard.", "Я возвращаюсь поздно."), ""),
 ("retourner", "возвращаться", ("Je retourne chez moi.", "Я возвращаюсь домой."), ""),
 ("monter", "подниматься", ("Je monte les escaliers.", "Я поднимаюсь по лестнице."), ""),
 ("passer", "проходить; проводить (время)", ("Le temps passe vite. — Passer un examen.", "Время летит быстро. — Сдавать экзамен."), ""),
 ("apporter", "приносить (предметы)", ("Apporte ton livre.", "Принеси книгу."), ""),
 ("emporter", "уносить с собой", ("À emporter, s'il vous plaît.", "С собой, пожалуйста."), ""),
 ("gagner", "выигрывать, зарабатывать", ("Gagner sa vie.", "Зарабатывать на жизнь."), ""),
 ("oublier", "забывать", ("N'oublie pas ! — J'ai oublié son nom.", "Не забудь! — Я забыл его имя."), ""),
 ("changer", "менять", ("Rien n'a changé.", "Ничего не изменилось."), ""),
 ("échanger", "обмениваться", ("Échanger des idées.", "Обмениваться идеями."), ""),
 ("créer", "создавать", ("Créer un projet.", "Создать проект."), ""),
 ("étudier", "изучать, учиться", ("J'étudie le français.", "Я изучаю французский."), ""),
 ("enseigner", "преподавать", ("Elle enseigne l'histoire.", "Она преподаёт историю."), ""),
 ("expliquer", "объяснять", ("Explique-moi ça.", "Объясни мне это."), ""),
 ("montrer", "показывать", ("Montre-moi tes photos.", "Покажи мне свои фото."), ""),
 ("aider", "помогать", ("Aide-moi, s'il te plaît.", "Помоги мне, пожалуйста."), ""),
 ("inviter", "приглашать", ("Je t'invite au cinéma.", "Я приглашаю тебя в кино."), ""),
 ("téléphoner", "звонить по телефону", ("Je te téléphone demain.", "Я позвоню тебе завтра."), ""),
 ("commencer", "начинать", ("Le film commence à huit heures.", "Фильм начинается в восемь."), ""),
 ("avancer", "продвигаться; переводить вперёд (часы)", ("Avance ta montre.", "Переведи часы вперёд."), ""),
 ("lancer", "бросать, запускать", ("Lancer une idée.", "Подкинуть идею."), ""),
 ("annoncer", "объявлять", ("Annoncer une nouvelle.", "Объявить новость."), ""),
 ("placer", "помещать", ("Place les livres sur l'étagère.", "Поставь книги на полку."), ""),
 ("nager", "плавать", ("Je nage dans la mer.", "Я плаваю в море."), ""),
 ("ranger", "убирать, раскладывать", ("Range ta chambre !", "Убери в комнате!"), ""),
 ("mélanger", "смешивать", ("Mélanger la farine et le sucre.", "Смешать муку и сахар."), ""),
 ("amener", "приводить (кого-то)", ("Amène tes amis !", "Приводи друзей!"), ""),
 ("emmener", "брать с собой (кого-то)", ("J'emmène les enfants à l'école.", "Я отвожу детей в школу."), ""),
 ("promener", "выгуливать", ("Promener le chien.", "Гулять с собакой."), ""),
 ("se laver", "умываться, мыться", ("Je me lave les mains.", "Я мою руки."), "возвр."),
 ("se réveiller", "просыпаться", ("Je me réveille tôt.", "Я просыпаюсь рано."), "возвр."),
 ("se coucher", "ложиться спать", ("Je me couche à onze heures.", "Я ложусь в одиннадцать."), "возвр."),
 ("se dépêcher", "торопиться", ("Dépêche-toi !", "Поторопись!"), "возвр."),
 ("s'intéresser", "интересоваться", ("Je m'intéresse à l'art.", "Я интересуюсь искусством."), "возвр."),
 ("se tromper", "ошибаться", ("Je me suis trompé de rue.", "Я ошибся улицей."), "возвр."),
 ("se marier", "жениться, выходить замуж", ("Ils se sont mariés en juin.", "Они поженились в июне."), "возвр."),
 ("se reposer", "отдыхать", ("Repose-toi bien.", "Отдыхай хорошенько."), "возвр."),
 ("s'ennuyer", "скучать", ("Je m'ennuie sans toi.", "Мне скучно без тебя."), "возвр."),
 ("arrêter", "останавливать(ся), прекращать", ("Arrête ! — Arrêter de fumer.", "Прекрати! — Бросить курить."), ""),
 ("continuer", "продолжать", ("Continuer à travailler / continuer de...", "Продолжать работать."), ""),
 ("décider", "решать(ся)", ("J'ai décidé d'apprendre le français.", "Я решил учить французский."), ""),
 ("proposer", "предлагать", ("Je te propose un plan.", "Предлагаю тебе план."), ""),
 ("refuser", "отказываться", ("Refuser une invitation.", "Отклонить приглашение."), ""),
 ("accepter", "принимать, соглашаться", ("J'accepte avec plaisir.", "Принимаю с удовольствием."), ""),
 ("raconter", "рассказывать", ("Raconte-moi une histoire.", "Расскажи мне историю."), ""),
 ("rencontrer", "встречать (кого-то)", ("J'ai rencontré un ami.", "Я встретил друга."), ""),
 ("embrasser", "целовать, обнимать", ("Embrasser ses enfants.", "Целовать детей."), ""),
 ("crier", "кричать", ("Ne crie pas !", "Не кричи!"), ""),
 ("pleurer", "плакать", ("Pleurer de joie.", "Плакать от радости."), ""),
 ("marcher", "ходить, работать (о механизмах)", ("La voiture ne marche pas.", "Машина не работает."), ""),
 ("voler", "летать; красть", ("Les oiseaux volent. — On m'a volé !", "Птицы летают. — Меня обокрали!"), ""),
 ("porter", "нести, носить (одежду)", ("Porter un manteau.", "Носить пальто."), ""),
 ("apporter2", None, None, None),
 ("poser", "класть; задавать (вопрос)", ("Poser une question.", "Задать вопрос."), ""),
 ("compter", "считать; намереваться", ("Compter jusqu'à dix. — Je compte partir.", "Считать до десяти. — Я собираюсь уехать."), ""),
 ("coûter", "стоить", ("Ça coûte cher.", "Это дорого стоит."), ""),
 ("dîner", "ужинать", ("On dîne à quelle heure ?", "Во сколько ужинаем?"), ""),
 ("déjeuner", "обедать", ("Déjeuner au bureau.", "Обедать в офисе."), ""),
 ("cuisiner", "готовить еду", ("J'aime cuisiner.", "Я люблю готовить."), ""),
 ("préparer", "готовить, подготавливать", ("Préparer le dîner.", "Приготовить ужин."), ""),
 ("laver", "мыть", ("Laver la vaisselle.", "Мыть посуду."), ""),
 ("fermer", "закрывать", ("Ferme la porte !", "Закрой дверь!"), ""),
 ("allumer", "включать, зажигать", ("Allumer la lumière.", "Включить свет."), ""),
 ("utiliser", "использовать", ("Utiliser un dictionnaire.", "Пользоваться словарём."), ""),
 ("apprendre2", None, None, None),
 ("étudier2", None, None, None),
 ("habiter2", None, None, None),
 ("améliorer", "улучшать", ("Améliorer son français.", "Улучшить свой французский."), ""),
 ("vérifier", "проверять", ("Vérifier les réponses.", "Проверить ответы."), ""),
 ("copier", "копировать, списывать", ("Copier un texte.", "Скопировать текст."), ""),
 ("étudier3", None, None, None),
 ("organiser", "организовывать", ("Organiser une fête.", "Организовать праздник."), ""),
 ("visiter", "посещать (место)", ("Visiter un musée.", "Посетить музей."), ""),
 ("réserver", "бронировать", ("Réserver une table.", "Забронировать столик."), ""),
 ("commander", "заказывать", ("Commander un café.", "Заказать кофе."), ""),
 ("goûter", "пробовать на вкус", ("Goûte cette soupe !", "Попробуй этот суп!"), ""),
 ("partager", "делить, делиться", ("Partager un gâteau.", "Поделить торт."), ""),
 ("remarquer", "замечать", ("Remarquer un détail.", "Заметить деталь."), ""),
 ("imaginer", "представлять", ("Imagine-toi à ma place !", "Представь себя на моём месте!"), ""),
 ("rêver", "мечтать, видеть сны", ("Rêver de vacances.", "Мечтать об отпуске."), ""),
 ("désirer", "желать", ("Que désirez-vous ?", "Что вы желаете?"), ""),
 ("oser", "осмеливаться", ("Je n'ose pas demander.", "Я не решаюсь спросить."), ""),
 ("sembler", "казаться", ("Il semble fatigué.", "Он выглядит уставшим."), ""),
 ("rester2", None, None, None),
 ("demeurer", "оставаться, проживать", ("Demeurer silencieux.", "Оставаться молчаливым."), ""),
 ("insister", "настаивать", ("N'insiste pas !", "Не настаивай!"), ""),
 ("réussir2", None, None, None),
 ("terminer", "заканчивать", ("Terminer un travail.", "Закончить работу."), ""),
 ("présenter", "представлять, знакомить", ("Je te présente Marie.", "Знакомься, это Мари."), ""),
 ("s'amuser", "развлекаться", ("On s'amuse bien !", "Мы хорошо развлекаемся!"), "возвр."),
 ("se fâcher", "сердиться", ("Ne te fâche pas !", "Не сердись!"), "возвр."),
 ("s'inquiéter", "беспокоиться", ("Je m'inquiète pour toi.", "Я беспокоюсь за тебя."), "возвр."),
 ("se fâcher2", None, None, None),
 ("se préparer", "готовиться", ("Se préparer à l'examen.", "Готовиться к экзамену."), "возвр."),
 ("se rencontrer", "встречаться", ("On se rencontre demain ?", "Встретимся завтра?"), "возвр."),
 ("se retrouver", "встретиться снова, оказаться", ("Se retrouver seul.", "Оказаться одному."), "возвр."),
 ("se dépêcher2", None, None, None),
 ("se passer", "происходить", ("Qu'est-ce qui se passe ?", "Что происходит?"), "возвр."),
 ("se sentir", "чувствовать себя", ("Je me sens bien.", "Я чувствую себя хорошо."), "возвр."),
 ("s'habituer", "привыкать", ("S'habituer au climat.", "Привыкнуть к климату."), "возвр."),
 ("se servir", "пользоваться (se servir de)", ("Se servir d'un dictionnaire.", "Пользоваться словарём."), "возвр."),
 ("se demander", "спрашивать себя", ("Je me demande pourquoi.", "Я спрашиваю себя почему."), "возвр."),
 ("se trouver", "находиться", ("Paris se trouve au nord.", "Париж находится на севере."), "возвр."),
 ("se plaindre", "жаловаться", ("Il se plaint toujours.", "Он вечно жалуется."), "возвр."),
 ("se lever2", None, None, None),
 ("s'endormir", "засыпать", ("Je m'endors vite.", "Я быстро засыпаю."), "возвр."),
 ("s'excuser", "извиняться", ("Excusez-moi ! — Je m'excuse.", "Извините! — Прошу прощения."), "возвр."),
 ("excuser", "извинять, прощать", ("Excuse mon retard.", "Прости за опоздание."), ""),
 ("douter", "сомневаться", ("Je doute qu'il vienne.", "Сомневаюсь, что он придёт."), ""),
 ("laisser", "оставлять, позволять", ("Laisse-moi partir !", "Дай мне уйти! (позволь)"), ""),
 ("prêter", "одалживать (давать взаймы)", ("Il m'a prêté son vélo.", "Он одолжил мне велосипед."), ""),
 ("avouer", "признаваться", ("J'avoue que je ne sais pas.", "Признаюсь, я не знаю."), ""),
 ("nier", "отрицать", ("Il nie tout.", "Он всё отрицает."), ""),
 ("épouser", "жениться на / выходить замуж за", ("Elle a épousé un médecin.", "Она вышла замуж за врача."), ""),
 ("épargner", "беречь, экономить", ("Épargne ton argent.", "Береги деньги."), ""),
 ("étouffer", "душить, задыхаться", ("J'étouffe ici !", "Мне здесь нечем дышать!"), ""),
 ("bouleverser", "потрясать, переворачивать", ("Cette nouvelle l'a bouleversé.", "Эта новость его потрясла."), ""),
 ("manquer", "не хватать; пропустить; manquer à qqn — по кому-то скучать", ("Tu me manques. — J'ai manqué le train.", "Я скучаю по тебе. — Я опоздал на поезд."), ""),
]
for inf, ru, example, tag in ER:
    if ru is None:
        continue
    kw = dict(inf=inf, ru=ru, group=1, aux="avoir", tags=([tag] if tag else []))
    if example:
        kw["example"] = example
    if inf in ("arriver", "entrer", "rester", "tomber", "rentrer", "retourner", "monter", "passer"):
        kw["aux"] = "être"
        kw["notes"] = "В составных временах обычно с être, причастие согласуется: je suis arrivé(e). С avoir при прямом дополнении: j'ai monté la valise."
    kw["refl"] = inf.startswith("s'") or inf.startswith("se ")
    if kw["refl"]:
        kw["aux"] = "être"
        base = re.sub(r"^(se |s')", "", inf)
        kw["pp"] = base[:-2] + "é"
    else:
        kw["pp"] = inf[:-2] + "é"
    add(**kw)

# se plaindre — по типу craindre
for v in V:
    if v["inf"] == "se plaindre":
        v.update(group=3, pres=["plains", "plains", "plaint", "plaignons", "plaignez", "plaignent"],
                 fut="plaindr", ps="plaign", sub="plaign", part_pres="plaignant", pp="plaint")
# s'endormir — по типу dormir
for v in V:
    if v["inf"] == "s'endormir":
        v.update(group=3, pres=["endors", "endors", "endort", "endormons", "endormez", "endorment"],
                 fut="endormir", ps="endorm", sub="endorm", part_pres="endormant", pp="endormi")
# se sentir — по типу sentir
for v in V:
    if v["inf"] == "se sentir":
        v.update(group=3, pres=["sens", "sens", "sent", "sentons", "sentez", "sentent"],
                 fut="sentir", ps="sent", sub="sent", part_pres="sentant", pp="senti")
# se servir — по типу servir
for v in V:
    if v["inf"] == "se servir":
        v.update(group=3, pres=["sers", "sers", "sert", "servons", "servez", "servent"],
                 fut="servir", ps="serv", sub="serv", part_pres="servant", pp="servi")
# s'inquiéter: é -> è
for v in V:
    if v["inf"] == "s'inquiéter":
        v.update(pres=["inquiète", "inquiètes", "inquiète", "inquiétons", "inquiétez", "inquiètent"])
# s'ennuyer: y -> i
for v in V:
    if v["inf"] == "s'ennuyer":
        v.update(pres=["ennuie", "ennuies", "ennuie", "ennuyons", "ennuyez", "ennuient"])

# ---- réguliers -ir (II группа)
IR = {
 "finir": ("заканчивать", ("Finis ton assiette ! — Le cours finit à 18 h.", "Доешь тарелку! — Занятие кончается в 18."), ""),
 "choisir": ("выбирать", ("Choisis ce que tu veux.", "Выбирай, что хочешь."), ""),
 "réussir": ("преуспевать; réussir à — суметь", ("Réussir un examen.", "Сдать экзамен."), ""),
 "grandir": ("расти", ("Les enfants grandissent vite.", "Дети быстро растут."), ""),
 "rougir": ("краснеть", ("Elle rougit de honte.", "Она краснеет от стыда."), ""),
 "réfléchir": ("размышлять", ("Réfléchis bien !", "Подумай хорошенько!"), ""),
 "établir": ("устанавливать", ("Établir des règles.", "Установить правила."), ""),
 "remplir": ("наполнять, заполнять", ("Remplir le formulaire.", "Заполнить форму."), ""),
 "obéir": ("подчиняться (obéir à)", ("Obéir aux ordres.", "Подчиняться приказам."), ""),
 "punir": ("наказывать", ("Punir un enfant.", "Наказать ребёнка."), ""),
 "guérir": ("выздоравливать, излечивать", ("Guérir d'une maladie.", "Вылечиться от болезни."), ""),
 "fleurir": ("цвести", ("Les arbres fleurissent en mai.", "Деревья цветут в мае."), ""),
 "agir": ("действовать; il s'agit de — речь идёт о", ("Il faut agir !", "Нужно действовать!"), ""),
 "ralentir": ("замедлять", ("Ralentir la vitesse.", "Сбавить скорость."), ""),
 "avertir": ("предупреждать", ("Avertis-moi !", "Предупреди меня!"), ""),
 "définir": ("определять", ("Définir un mot.", "Дать определение слова."), ""),
 "réunir": ("собирать, объединять", ("Réunir la famille.", "Собрать семью."), ""),
 "nourrir": ("кормить", ("Nourrir les poissons.", "Кормить рыб."), ""),
 "fournir": ("снабжать, предоставлять", ("Fournir des documents.", "Предоставить документы."), ""),
 "bâtir": ("строить", ("Bâtir une maison.", "Построить дом."), ""),
 "vieillir": ("стареть", ("Vieillir avec grâce.", "Стареть достойно."), ""),
 "maigrir": ("худеть", ("Maigrir de 5 kilos.", "Похудеть на 5 кг."), ""),
 "grossir": ("толстеть; увеличивать", ("Ne grossis pas le problème.", "Не преувеличивай проблему."), ""),
 "franchir": ("пересекать, преодолевать", ("Franchir la frontière.", "Пересечь границу."), ""),
 "saisir": ("хватать; понимать", ("Saisir l'occasion.", "Ухватить возможность."), ""),
}
for inf, (ru, example, tag) in IR.items():
    add(inf=inf, ru=ru, group=2, aux="avoir", pp=inf[:-2] + "i",
        tags=([tag] if tag else []), example=example)

# ---- réguliers -re (III группа, тип vendre)
RE_VERBS = {
 "vendre": ("продавать", "vendu", ("On vend la maison.", "Дом продаётся."), ""),
 "répondre": ("отвечать", "répondu", ("Réponds à la question !", "Ответь на вопрос!"), "топ-20"),
 "attendre": ("ждать", "attendu", ("J'attends le bus.", "Я жду автобус."), "топ-20"),
 "entendre": ("слышать", "entendu", ("J'entends du bruit. — Bien entendu !", "Я слышу шум. — Конечно!"), ""),
 "perdre": ("терять, проигрывать", "perdu", ("J'ai perdu mes clés.", "Я потерял ключи."), ""),
 "rendre": ("возвращать; rendre visite — навещать", "rendu", ("Rends-moi mon livre !", "Верни мне книгу!"), ""),
 "défendre": ("защищать, запрещать", "défendu", ("Défendu de fumer.", "Курить запрещено."), ""),
 "confondre": ("путать", "confondu", ("Ne confonds pas les deux !", "Не путай их!"), ""),
 "descendre": ("спускаться, выходить (из транспорта)", "descendu", ("Descends à la prochaine station !", "Выйди на следующей станции!"), ""),
 "prétendre": ("утверждать", "prétendu", ("Il prétend tout savoir.", "Он утверждает, что всё знает."), ""),
 "étendre": ("распространять; растягивать", "étendu", ("Étendre le linge.", "Развесить бельё."), ""),
 "fondre": ("таять, плавиться", "fondu", ("La neige fond.", "Снег тает."), ""),
 "mordre": ("кусать", "mordu", None, ""),
 "tordre": ("крутить, выжимать", "tordu", None, ""),
}
for inf, (ru, pp, example, tag) in RE_VERBS.items():
    stem = inf[:-2]
    pres = [stem + e for e in ["s", "s", "", "ons", "ez", "ent"]]
    kw = dict(inf=inf, ru=ru, group=3, aux="avoir", pp=pp, pres=pres,
              fut=stem + "r", ps=stem, sub=stem, part_pres=stem + "ant", tags=([tag] if tag else []))
    if example:
        kw["example"] = example
    if inf == "descendre":
        kw["aux"] = "être"
        kw["notes"] = "С être при движении (je suis descendu), с avoir при дополнении (j'ai descendu les valises)."
    add(**kw)

# ---- сборка
verbs = []
seen = set()
for v in V:
    if v["inf"] in seen:
        print("SKIP duplicate:", v["inf"]); continue
    seen.add(v["inf"])
    verbs.append(build_verb(v))

verbs.sort(key=lambda x: x["inf"].replace("s'", "").replace("se ", ""))
js = ("// Сгенерировано scripts/gen_verbs.py — полные таблицы спряжений\n"
      "window.DB = window.DB || {};\nDB.verbs = "
      + json.dumps(verbs, ensure_ascii=False, indent=0) + ";\n")
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "verbs.js")
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    f.write(js)
print(f"OK: {len(verbs)} глаголов -> {os.path.normpath(path)} ({len(js)//1024} KB)")
