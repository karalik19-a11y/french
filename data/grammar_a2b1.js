// Грамматика A2 и B1 — Французский для Дани
window.DB = window.DB || {};
DB.grammar = DB.grammar || [];
DB.grammar.push(
{
id:"pc-avoir", lv:"A2", u:2, n:1, title:"Passé composé с avoir — главное прошедшее",
content:`## Формула: avoir (в présent) + причастие прошедшего времени
> J'**ai mangé**. — Я поел.
> Tu **as fini**. — Ты закончил.
> Il **a pris** le bus. — Он сел на автобус.
## Причастия (participe passé)
- **-er → -é**: parler → parl**é**, manger → mangé
- **-ir (II гр.) → -i**: finir → fin**i**
- **-re → -u**: vendre → vend**u**, attendre → attend**u**
- Неправильные (учить!): **eu** (avoir), **été** (être), **fait** (faire), **pris** (prendre), **vu** (voir), **dit** (dire), **écrit** (écrire), **lu** (lire), **bu** (boire), **mis** (mettre), **venu** (venir), **voulu** (vouloir), **pu** (pouvoir), **su** (savoir), **dû** (devoir), **ouvert** (ouvrir), **offert** (offrir), **conduit** (conduire), **produit** (produire)
## Когда используется
**Завершённые** действия в прошлом, единичные события, цепочка событий:
> Hier, j'**ai travaillé**, puis j'**ai dîné** avec Paul.
## Отрицание — вокруг avoir
> Je **n'**ai **pas** mangé.
## Вопрос
> **Est-ce que** tu as fini ? **As-tu** fini ? Tu as fini ?
## Маркеры времени
hier (вчера), avant-hier, la semaine dernière, il y a deux jours (два дня назад), déjà (уже), une fois (однажды)`,
ex:[["J'ai acheté une voiture.","Я купил машину."],
["Nous avons visité Paris.","Мы посетили Париж."],
["Elle n'a pas téléphoné.","Она не позвонила."],
["As-tu vu ce film ?","Ты видел этот фильм?"]],
points:["avoir + participe passé","-er→-é, -ir→-i, -re→-u","Неправильные: eu, été, fait, pris, vu, dit, écrit...","Отрицание вокруг вспомогательного"],
quiz:[
{t:"f",q:"J'___ (finir) hier. — Я закончил вчера.",a:["ai fini"],e:"J'ai fini hier."},
{t:"f",q:"Nous ___ (prendre) le train. — Nous avons ___",a:["avons pris"],e:"Prendre → pris."},
{t:"f",q:"Elle ___ (voir) ce film.",a:["a vu"],e:"Voir → vu."},
{t:"c",q:"«Je n'ai pas compris» = ",o:["Я не понял","Я не понимаю","Я не понимал никогда","Я понял"],a:0,e:"Passé composé в отрицании."},
{t:"f",q:"Отрицание: Он не сказал = Il ___ ___ ___",a:["n'a pas dit"],e:"Dire → dit."}
]},
{
id:"pc-etre", lv:"A2", u:2, n:2, title:"Passé composé с être + согласование причастия",
content:`## 16 глаголов движения и состояния — с être
Запомни «домик» (часто рисуют лестницу):
**aller** (идти), **venir** (приходить), **arriver**, **partir** (уезжать), **entrer** (входить), **sortir** (выходить), **monter**, **descendre**, **rester** (оставаться), **tomber** (падать), **naître** (рождаться), **mourir** (умирать), **retourner** (возвращаться), **passer** (заходить), **rentrer** (возвращаться домой), **devenir**.
> Je **suis allé(e)** au cinéma. — Я сходил в кино.
> Elle **est venue** hier. — Она пришла вчера.
> Ils **sont partis**. — Они уехали.
## Согласование причастия!
С être причастие согласуется **с подлежащим** в роде и числе:
> il est allé / elle est allé**e** / ils sont allé**s** / elles sont allé**es**
## + все возвратные глаголы (с se)
> Elle **s'est lavée**. — Она помылась.
> Je **me suis levé(e)** tôt. — Я встал рано.
## Важно: тот же глагол с avoir = другое значение!
- Je **suis monté** dans ma chambre (поднялся к себе) — движение
- J'**ai monté** la valise (занёс чемодан) — есть дополнение!
- Elle **est sortie** (вышла) / Elle **a sorti** son téléphone (достала телефон)`,
ex:[["Je suis né en 1998.","Я родился в 1998."],
["Elle est rentrée tard.","Она вернулась поздно."],
["Nous sommes restés à la maison.","Мы остались дома."],
["Ils sont descendus.","Они спустились."]],
points:["16 глаголов движения/состояния + все возвратные → être","Причастие согласуется с подлежащим: allée, allés","monter/sortir с avoir = с дополнением"],
quiz:[
{t:"f",q:"Она ушла = Elle ___ partie.",a:["est"],e:"Partir — глагол движения → être; elle est partie."},
{t:"c",q:"«Elles sont venues» — почему venues с -s и -es?",o:["Так правильно звучит","Согласование с ж.р. мн.ч.","Ошибка","Особая форма"],a:1,e:"С être причастие согласуется: elles → -es."},
{t:"c",q:"Je ___ monté la valise. (я занёс чемодан)",a:["suis","ai","étais","serai"],a:1,e:"Есть прямое дополнение (la valise) → avoir: j'ai monté."},
{t:"f",q:"Мы остались = Nous ___ restés.",a:["sommes"],e:"Rester → être."}
]},
{
id:"imparfait", lv:"A2", u:2, n:3, title:"Imparfait — несовершенное прошедшее",
content:`## Формула: основа «nous» в présent + окончания
parler → nous parl**ons** → je parl + **ais, ais, ait, ions, iez, aient**
| | parler | finir | aller |
| je | parlais | finissais | allais |
| tu | parlais | finissais | allais |
| il | parlait | finissait | allait |
| nous | parlions | finissions | allions |
| vous | parliez | finissiez | alliez |
| ils | parlaient | finissaient | allaient |
⚠️ Единственный неправильный: **être → j'étais**.
⚠️ manger → nous mang**ions**; commencer → nous commen**cions**; voir → je voy**ais**; croire → je croy**ais**.
## Когда используется
1. **Описания, фон** в прошлом: Il **faisait** beau, les oiseaux **chantaient**. — Была хорошая погода, птицы пели.
2. **Привычки, повторение**: Quand j'étais petit, je **jouais** au foot tous les jours. — В детстве я каждый день играл в футбол.
3. **Незавершённое состояние**: Je **voulais** te dire... — Я хотел тебе сказать...
4. Описание внешности, чувств, обстоятельств: Elle **avait** les yeux bleus.
## Маркеры
avant (раньше), tous les jours/chaque été (каждый день/лето), quand j'étais jeune, à cette époque (в то время), d'habitude (обычно)`,
ex:[["Quand j'étais enfant, je rêvais beaucoup.","В детстве я много мечтал."],
["Il faisait froid et il pleuvait.","Было холодно и шёл дождь."],
["Nous habitions à Lyon.","Мы жили в Лионе."],
["Elle portait une robe rouge.","На ней было красное платье."]],
points:["Основа nous-présent + ais/ais/ait/ions/iez/aient","être → étais (единственное исключение)","Фон, привычки, состояния","«Раньше каждый день...» = imparfait"],
quiz:[
{t:"f",q:"Раньше я много читал = Avant, je ___ beaucoup.",a:["lisais"],e:"Lire → je lisais (imparfait)."},
{t:"f",q:"Мы были молоды = Nous ___ jeunes.",a:["étions"],e:"Être → nous étions."},
{t:"c",q:"«Il faisait beau» — это:",o:["однократное событие","описание фона/погоды","будущее","приказ"],a:1,e:"Описание обстоятельств в прошлом → imparfait."},
{t:"f",q:"Она хотела = Elle ___ (vouloir).",a:["voulait"],e:"Vouloir → elle voulait."}
]},
{
id:"pc-vs-imp", lv:"A2", u:2, n:4, title:"Passé composé vs Imparfait — два прошедших",
content:`## Главное различие
- **Imparfait** = фон, процесс, привычка («что происходило, каково было») — русское НЕСОВЕРШЕННОЕ: читал, шёл, было
- **Passé composé** = событие, результат, однократность («что случилось») — русское СОВЕРШЕННОЕ: прочитал, пришёл, случилось
## Классическая схема: фон + событие
> Je **regardais** la télé quand il **est arrivé**.
> Я СМОТРЕЛ (процесс, imparfait) телевизор, когда он ПРИШЁЛ (событие, passé composé).
> Il **faisait** nuit, soudain le téléphone **a sonné**.
## Привычка vs однократность
> Chaque dimanche, nous **allions** chez ma grand-mère. (каждое воскресенье — привычка)
> Dimanche dernier, nous **sommes allés** au cinéma. (в прошлое воскресенье — один раз)
## Проверка словом «вдруг» (soudain)
После «вдруг» почти всегда passé composé:
> Soudain, j'**ai compris**. — Вдруг я понял.
## Оба = «прошлое», но разные роли
Imparfait — «декорации», passé composé — «действие в декорациях».`,
ex:[["Il pleuvait quand je suis sorti.","Шёл дождь, когда я вышел."],
["Je dormais quand tu as appelé.","Я спал, когда ты позвонил."],
["Avant, je fumais, mais hier j'ai arrêté.","Раньше я курил, но вчера бросил."]],
points:["Imparfait = фон/привычка (несовершенное)","Passé composé = событие/результат (совершенное)","Схема: «делал (imp), когда случилось (pc)»","После «soudain» — passé composé"],
quiz:[
{t:"c",q:"Je (marcher) dans la rue quand j'ai vu Marie.",o:["marchais","ai marché","marche","marcherai"],a:0,e:"Фон/процесс, прерванный событием → imparfait: je marchais."},
{t:"c",q:"Quand j'étais petit, je (aller) souvent à la mer.",o:["suis allé","allais","vais","irai"],a:1,e:"Привычка в прошлом → imparfait: j'allais."},
{t:"c",q:"Soudain, la lumière (s'éteindre).",o:["s'éteignait","s'est éteinte","s'éteint","s'éteindra"],a:1,e:"Внезапное событие → passé composé; возвратный глагол → être: s'est éteinte."},
{t:"f",q:"Он читал, когда зазвонил телефон = Il ___ quand le téléphone a sonné.",a:["lisait"],e:"Il lisait (фон) quand..."}
]},
{
id:"futur-simple", lv:"A2", u:2, n:5, title:"Futur simple — будущее время",
content:`## Формула: инфинитив + окончания avoir
Окончания: **-ai, -as, -a, -ons, -ez, -ont** (это формы глагола avoir!)
| parler | je parler**ai**, tu parler**as**, il parler**a**, nous parler**ons**, vous parler**ez**, ils parler**ont** |
- **-re**: отбрось -e: vendre → je vendr**ai**
- **-ir**: finis → je finir**ai**
## Неправильные основы (учить!)
être → **ser**-; avoir → **aur**-; aller → **ir**-; faire → **fer**-; venir → **viendr**-; voir → **verr**-; vouloir → **voudr**-; pouvoir → **pourr**-; devoir → **devr**-; savoir → **saur**-; falloir → **faudr**-; envoyer → **enverr**-; recevoir → **recevr**-; courir → **courr**-; mourir → **mourr-**; tenir → **tiendr**-; pleuvoir → **pleuvr-**
## Когда используется
- Чистое будущее, особенно отдалённое и формальное: Demain, il **pleuvra**.
- Обещания, предсказания: Je t'**aimerai** toujours.
- После **quand/lorsque/dès que** (когда...) — в отличие от русского, где «будущее после когда» = настоящее!
> **Quand** tu **seras** grand... — Когда ты БУДЕШЬ большим... (futur, не présent!)
- Вежливая просьба мягче в conditionnel: Je voudrai → voudrais.`,
ex:[["Demain, je partirai tôt.","Завтра я уеду рано."],
["Nous serons en retard.","Мы опоздаем."],
["Quand il fera beau, nous irons à la plage.","Когда будет хорошая погода, мы поедем на пляж."],
["Je t'appellerai ce soir.","Я позвоню тебе сегодня вечером."]],
points:["Инфинитив + ai/as/a/ons/ez/ont","-re → основа без e: vendrai","Неправильные: ser-, aur-, ir-, fer-, viendr-, verr-, voudr-, pourr-","После quand/lorsque/dès que — futur, не présent!"],
quiz:[
{t:"f",q:"Я буду = Je ___ (être, futur)",a:["serai"],e:"Je serai."},
{t:"f",q:"Они придут = Ils ___ (venir)",a:["viendront"],e:"Venir → ils viendront."},
{t:"c",q:"«Когда я приеду, я позвоню» — Quand j'___, je t'appellerai.",o:["arrive","arriverai","arrivais","suis arrivé"],a:1,e:"После quand — futur simple: quand j'arriverai."},
{t:"f",q:"Мы увидим = Nous ___ (voir)",a:["verrons"],e:"Voir → nous verrons."},
{t:"f",q:"Ты сможешь = Tu ___ (pouvoir)",a:["pourras"],e:"Pouvoir → tu pourras."}
]},
{
id:"conditionnel-present", lv:"A2", u:2, n:6, title:"Conditionnel présent — вежливость и совет",
content:`## Формула: основа будущего + окончания imparfait
-ai**s, -ais, -ait, -ions, -iez, -aient**
> je parler**ais** (я бы говорил), je **serais**, j'**aurais**, je **voudrais**, je **pourrais**, je **ferais**, j'**irais**, je **viendrais**, je **devrais**, je **saurais**
## Использование №1: вежливость
> Je **voudrais** un café. — Я бы хотел кофе. (вместо резкого «je veux»)
> **Pourriez**-vous m'aider ? — Не могли бы вы мне помочь?
> **Auriez**-vous l'heure ? — Не подскажете время?
## Использование №2: совет
> Tu **devrais** te reposer. — Тебе следовало бы отдохнуть.
> À ta place, je **partirais**. — На твоём месте я бы уехал. (à ta place = на твоём месте)
## Использование №3: неподтверждённая информация
> Il **serait** malade. — Говорят, он болен. (журналистское conditionnel — см. C1)
## Si + условие — НЕ после si!
> Si j'**avais** de l'argent, je **voyagerais**. — Если бы у меня были деньги, я бы путешествовал.
⚠️ После **si** — imparfait, НЕ conditionnel: *si je voyagerais — ГРУБАЯ ошибка!* (запомни: «les si n'aiment pas les ré»)`,
ex:[["Je voudrais réserver une table.","Я бы хотел заказать столик."],
["Tu devrais dormir plus.","Тебе надо больше спать."],
["Si j'étais riche, j'achèterais un château.","Если бы я был богат, я бы купил замок."]],
points:["Основа будущего + ais/ais/ait/ions/iez/aient","Je voudrais = вежливое «я хочу»","Tu devrais = совет","После si — imparfait, conditionnel в главной части"],
quiz:[
{t:"f",q:"Я бы хотел кофе = Je ___ un café.",a:["voudrais"],e:"Vouloir → je voudrais."},
{t:"c",q:"«Si j'étais toi, je ___» — совет другу:",o:["pars","partirais","partais","partirai"],a:1,e:"Si + imparfait → conditionnel в следствии: je partirais."},
{t:"f",q:"Не могли бы вы помочь? = ___ -vous m'aider ?",a:["pourriez","Pourriez"],e:"Pouvoir → pourriez (инверсия вежливого вопроса)."},
{t:"c",q:"Какая фраза ОШИБОЧНА?",o:["Si j'avais du temps, je lirais","Si j'aurais du temps, je lirais","Je voudrais partir","Tu devrais venir"],a:1,e:"После si никогда conditionnel! Правильно: si j'avais."}
]},
{
id:"cod", lv:"A2", u:2, n:7, title:"Местоимения COD: le, la, les — прямое дополнение",
content:`## Что такое COD
COD (complément d'objet direct) — дополнение **без предлога**: «вижу (кого? что?)».
## Замена местоимениями
| le [лё] | его (м.р.) / l' перед гласной |
| la | её (ж.р.) / l' перед гласной |
| les | их (мн.ч.) |
> Je vois **Paul** → Je **le** vois. — Я его вижу.
> Je regarde **la télé** → Je **la** regarde.
> J'aime **ces livres** → Je **les** aime.
## Место — ПЕРЕД глаголом! (кроме impératif)
> Tu me vois ? Oui, je **te** vois. (тебя — te)
> Elle l'aime. — Она его/её любит.
## В passé composé — перед вспомогательным + согласование!
> J'ai acheté la voiture → Je **l'**ai achet**ée**. (-ée согласуется с la voiture!)
> Il a vu ses amis → Il **les** a vus.
## В impératif
> Regarde-**moi** ! Écoute-**la** ! Donne-**les**-moi !
> Не смотри на меня: **Ne** me regarde **pas**.
## Полная таблица местоимений-дополнений
me/te (меня/тебя), le/la/l' (его/её), nous (нас), vous (вас), les (их)`,
ex:[["Tu connais Marie ? — Oui, je la connais.","Ты знаешь Мари? — Да, я её знаю."],
["J'ai lu le livre. — Je l'ai lu.","Я прочитал книгу. — Я её прочитал."],
["Il les a vus hier.","Он видел их вчера."]],
points:["COD = дополнение без предлога","Местоимение ПЕРЕД глаголом: je le vois","В passé composé: l'ai achetée — согласование!","Impératif: regarde-moi !"],
quiz:[
{t:"c",q:"Tu aimes le chocolat ? — Oui, je ___ aime.",o:["le","la","lui","les"],a:0,e:"Le chocolat — м.р. → je le aime → je l'aime... в тесте «je ___ aime» = le/l'."},
{t:"c",q:"Elle a acheté les fleurs → Elle ___ a achetées.",o:["les","leur","la","le"],a:0,e:"Les (их) — перед auxiliaire; achetées согласуется."},
{t:"f",q:"Ты меня видишь? = Tu ___ vois ?",a:["me"],e:"Me (меня) перед глаголом."},
{t:"c",q:"«Regarde-___ !» (посмотри на меня!) — в приказе:",o:["me","moi","je","ma"],a:1,e:"После impératif me → moi: Regarde-moi !"}
]},
{
id:"coi", lv:"A2", u:2, n:8, title:"Местоимения COI: lui, leur — кому?",
content:`## COI — дополнение с предлогом à
«Говорить (КОМУ?)», «давать (кому?)», «звонить (кому?)».
## Замена
| **lui** | ему/ей (ед.ч., оба рода!) |
| **leur** | им (мн.ч.) |
| me/te/nous/vous | мне/тебе/нам/вам |
> Je parle **à Paul** → Je **lui** parle.
> Je téléphone **à mes parents** → Je **leur** téléphone.
> Il donne un cadeau **à moi** → Il **me** donne un cadeau.
## Глаголы с à (COI)
parler à, téléphoner à, donner à, écrire à, demander à, répondre à, obéir à, ressembler à, dire à, envoyer à, prêter à, montrer à, offrir à
## Глаголы с de (НЕ заменяются lui/leur!)
penser à qqn → je pense **à lui** (не lui pense!), parler de qqch → j'**en** parle
⚠️ Различай: je **lui** parle (я с ним говорю) / je parle **de lui** (я о нём говорю).
## Порядок при двух местоимениях (A2+): me/te/se/nous/vous → lui/leur → le/la/les → y → en
> Il **me le** donne. — Он мне его даёт.
> Je **le lui** donne. — Я его ему даю. (le/la/les ПЕРЕД lui/leur в 3-м лице!)`,
ex:[["Tu parles à ta sœur ? — Oui, je lui parle.","Ты говоришь с сестрой? — Да, я с ней говорю."],
["Je leur ai écrit une lettre.","Я написал им письмо."],
["Elle me donne un conseil.","Она даёт мне совет."]],
points:["lui = ему/ей (оба рода!), leur = им","Глаголы с à: parler, téléphoner, donner, écrire, répondre","penser à qqn → je pense à lui","Il me le donne / je le lui donne"],
quiz:[
{t:"c",q:"Tu écris à ta mère ? — Oui, je ___ écris.",o:["la","lui","leur","les"],a:1,e:"Écrire à qqn → lui (и для «ему», и для «ей»)."},
{t:"c",q:"Je parle ___ mes voisins. (с соседями, мн.ч.)",o:["lui","leur","les","le"],a:1,e:"Мн.ч. с à → leur."},
{t:"c",q:"«Он мне его даёт»:",o:["Il me donne le","Il me le donne","Il donne le moi","Il le me donne"],a:1,e:"Порядок: me (1-е лицо) → le (3-е лицо): il me le donne."},
{t:"c",q:"«Я думаю о нём»:",o:["Je lui pense","Je pense à lui","Je le pense","J'en pense"],a:1,e:"Penser à qqn — местоимением-COI не заменяется: je pense à lui."}
]},
{
id:"y-en", lv:"A2", u:2, n:9, title:"Местоимения y и en — маленькие, но важные",
content:`## y [и] = «там», «туда», «об этом» (à + место/вещь)
- Заменяет **à + неодушевлённое** и места:
> Tu vas **à Paris** ? — Oui, j'**y** vais. — Ты едешь в Париж? — Да, я туда еду.
> Tu penses **à ton examen** ? — Oui, j'**y** pense.
- **Il y a** → **il y en a** (есть такие)
## en [ɑ̃] = «этого», «оттуда», «о нём» (de + ...)
- Заменяет **de + неодушевлённое**, часть целого, количество:
> Tu veux **du café** ? — Oui, j'**en** veux. — Хочешь кофе? — Да, хочу (этого).
> Tu viens **de la piscine** ? — Oui, j'**en** viens. — Оттуда.
> Tu parles **de ce film** ? — Oui, j'**en** parle.
- С количеством en ОБЯЗАТЕЛЬНО сохраняет число:
> J'ai **deux** frères → J'**en** ai **deux**. (их у меня два)
> Je veux **trois** kilos → J'**en** veux **trois**.
## Место: перед глаголом, y/en — всегда последние
> Je **m'y** intéresse. Tu **en** as ? Il **y** va. Nous **en** avons parlé.
## Глаголы-триггеры
- **y**: aller à, penser à, s'intéresser à, répondre à (qqch), réfléchir à, jouer à, participer à
- **en**: avoir besoin de, avoir envie de, parler de, rêver de, venir de, manquer de, s'occuper de
⚠️ С людьми НЕ используются (кроме устойчивых): je pense **à lui**, je parle **de toi**.`
,
ex:[["Tu vas à la piscine ? — Oui, j'y vais.","Ты идёшь в бассейн? — Да, иду туда."],
["Tu as des frères ? — J'en ai deux.","У тебя есть братья? — Их двое."],
["Tu veux de la soupe ? — Non merci, je n'en veux pas.","Хочешь суп? — Нет, не хочу."],
["J'y pense souvent.","Я часто об этом думаю."]],
points:["y = туда/там/об этом (à + вещь)","en = этого/оттуда (de + ...)","С количеством число сохраняется: j'en ai deux","Перед глаголом; y и en — последние в цепочке"],
quiz:[
{t:"c",q:"Tu vas au travail ? — Oui, j'___ vais.",o:["en","y","le","lui"],a:1,e:"Au travail = à + место → y."},
{t:"c",q:"Tu veux du thé ? — Oui, j'___ veux.",o:["y","en","le","de"],a:1,e:"Частичный артикль (du thé) → en."},
{t:"c",q:"Tu as combien de sœurs ? — J'___ ai trois.",o:["y","les","en","leur"],a:2,e:"Количество: en + сохранённое число (trois)."},
{t:"c",q:"«Il pense à ses vacances» → Il ___ pense.",o:["en","leur","y","les"],a:2,e:"Penser à + вещь → y."}
]},
{
id:"reflexive", lv:"A2", u:2, n:10, title:"Возвратные глаголы: se laver, se lever",
content:`## Что это
Глаголы с частицей **se**: действие направлено на себя. В русском — часто «-ся»: мыться, одеваться.
## Спрягаем с возвратным местоимением
| | |
| je **me** lave | я моюсь |
| tu **te** laves | |
| il **se** lave | |
| nous **nous** lavons | |
| vous **vous** lavez | |
| ils **se** lavent | |
⚠️ Перед гласной: je **m'**habille, tu **t'**ennuies.
## В passé composé — ВСЕГДА с être + согласование
> Elle **s'est levée** tôt. — Она встала рано.
> Ils **se sont rencontrés** en 2020.
⚠️ Согласование есть, если действие «на себя» (она умыла СЕБЯ = se); если есть дополнение — нет: elle s'est lavé **les mains** (она вымыла себе руки — руки ≠ она).
## Отрицание и вопрос
> Je **ne** me souviens **pas**. — Я не помню.
> **Te** lèves-tu tôt ? Tu te lèves tôt ?
## Частые возвратные
se lever (вставать), se laver (мыться), s'habiller (одеваться), se coucher (ложиться), se réveiller (просыпаться), se dépêcher (торопиться), se reposer (отдыхать), se souvenir (de) (помнить), s'intéresser (à), s'appeler (зваться), se promener (гулять), se disputer (ссориться), se marier (жениться), s'ennuyer (скучать), se sentir (чувствовать себя), se taire (молчать), se tromper (ошибаться), s'amuser (развлекаться), se passer (происходить)
## Значения «взаимности»
> Ils **se** téléphonent. — Они звонят ДРУГ ДРУГУ.
> Nous **nous** voyons demain. — Мы увидимся завтра (друг с другом).`,
ex:[["Je me lève à sept heures.","Я встаю в семь."],
["Elle s'est mariée l'année dernière.","Она вышла замуж в прошлом году."],
["Nous nous reposons.","Мы отдыхаем."],
["Ils se sont disputés.","Они поссорились."]],
points:["se + возвратное местоимение по лицам","В passé composé — être + согласование: elle s'est levée","Исключение: se laver les mains — без согласования","Взаимность: ils se téléphonent"],
quiz:[
{t:"f",q:"Я просыпаюсь = Je ___ réveille.",a:["me"],e:"Se réveiller → je me réveille."},
{t:"c",q:"«Она оделась» (passé composé):",o:["Elle a habillée","Elle s'est habillée","Elle s'a habillée","Elle est habillée"],a:1,e:"Возвратный → être + согласование: elle s'est habillée."},
{t:"f",q:"Я не помню = Je ___ souviens pas. (полностью: je ne ___ souviens pas)",a:["me"],e:"Je ne me souviens pas."},
{t:"c",q:"Elle s'est lavé les mains — почему нет -es у lavé?",o:["Ошибка","Дополнение (les mains) отменяет согласование","Так звучит лучше","Особое правило для mains"],a:1,e:"Согласование только когда COD перед глаголом; здесь COD = les mains (после)."}
]},
{
id:"comparatif", lv:"A2", u:2, n:11, title:"Сравнение и превосходная степень",
content:`## Сравнительная степень
**plus / moins / aussi + прилагательное + que** — чем
> Paul est **plus** grand **que** Marie. — Поль выше Мари.
> Ce livre est **moins** intéressant **que** l'autre. — менее интересный
> Elle est **aussi** intelligente **que** toi. — такая же умная, как
## Особые формы
- bon → **meilleur(e)(s)**: Ce gâteau est **meilleur** que l'autre. (лучше)
- bien → **mieux**: Il chante **mieux** que moi. (лучше — о действии)
- mauvais → **pire** или plus mauvais: C'est **pire** ! (хуже)
⚠️ Не путай: meilleur — про предмет (лучший), mieux — про действие (лучше делает).
## Превосходная степень: le/la/les plus...
> C'est **le plus** grand immeuble **de** la ville. — самое большое здание ГОРОДА (de!)
> Marie est **la meilleure** élève **de** la classe.
## Сравнение глаголов и количеств
> Il travaille **plus que** moi. — Он работает больше меня.
> J'ai **autant de** livres **que** toi. — столько же книг, сколько (de перед сущ.!)
> Il gagne **plus de** 5000 euros. — больше, чем (с числами: de)`,
ex:[["Paris est plus grand que Lyon.","Париж больше Лиона."],
["C'est le meilleur restaurant de la ville.","Это лучший ресторан города."],
["Elle parle aussi vite que toi.","Она говорит так же быстро, как ты."]],
points:["plus/moins/aussi + adj + que","bon→meilleur, bien→mieux, mauvais→pire","Превосходная: le plus... de","autant de ... que"],
quiz:[
{t:"f",q:"Этот фильм лучше того = Ce film est ___ que l'autre.",a:["meilleur"],a2:"",e:"Bon → meilleur (о предмете)."},
{t:"c",q:"Он поёт лучше меня:",o:["Il chante meilleur que moi","Il chante mieux que moi","Il chante plus bon que moi","Il chante le meilleur"],a:1,e:"О действии → mieux."},
{t:"c",q:"«Самая красивая женщина Парижа»:",o:["la plus belle femme à Paris","la plus belle femme de Paris","la femme la belle de Paris","la meilleure femme de Paris"],a:1,e:"Превосходная степень + de: la plus belle femme de Paris."},
{t:"f",q:"У меня столько же книг, как у тебя = J'ai ___ de livres que toi.",a:["autant"],e:"Autant de ... que."}
]},
{
id:"adverbes-ment", lv:"A2", u:2, n:12, title:"Наречия на -ment и не только",
content:`## Образование: ж.р. прилагательного + -ment
- lent (м.) → lente (ж.) → lente**ment** [лɑ̃тмɑ̃] — медленно
- heureux → heureuse → heureuse**ment** — к счастью
- Если м.р. оканчивается на гласную — сразу + -ment: vrai → vrai**ment**, poli → poli**ment**, absolu → absolu**ment**
- **-ant → -amment** [амɑ̃]: constant → const**amment**; **-ent → -emment** [амɑ̃]: récent → réc**emment**, fréquent → fréquemment, évident → évidemment
- Особые: gentil → gentiment; précis → précisément [амɑ̃-подобно нет: precisémɑ̃]... точнее: précisément [пресиземɑ̃].
## Частые наречия (не от прилагательных)
bien (хорошо), mal (плохо), vite (быстро), beaucoup (много), peu (мало), trop (слишком), très (очень), assez (достаточно), déjà (уже), encore (ещё), toujours (всегда), souvent (часто), parfois/quelquefois (иногда), rarement (редко), jamais (никогда), hier, aujourd'hui, demain, maintenant (сейчас), bientôt (скоро), tard (поздно), tôt (рано), ici (здесь), là (там), partout (везде), ailleurs (где-то ещё), ensemble (вместе), soudain (вдруг), enfin (наконец)
## Место в предложении
- Простые наречия — после глагола: Il court **vite**.
- С составным временем — часто между avoir/être и причастием: J'ai **bien** mangé. Elle a **déjà** fini.
- Наречия времени/места — обычно в конце: Je l'ai vu **hier**.`
,
ex:[["Elle parle lentement.","Она говорит медленно."],
["J'ai bien dormi.","Я хорошо поспал."],
["Il est évidemment d'accord.","Он, очевидно, согласен."],
["Nous y allons souvent.","Мы часто туда ходим."]],
points:["Ж.р. прилагательного + -ment","-ant→-amment, -ent→-emment [амɑ̃]","bien/mal/vite — не производные","Между aux и причастием: j'ai bien mangé"],
quiz:[
{t:"f",q:"медленно (от lent) = ___",a:["lentement"],e:"lente + ment = lentement."},
{t:"f",q:"недавно (от récent) = ___",a:["récemment"],e:"-ent → -emment: récemment."},
{t:"c",q:"«Я хорошо поел»:",o:["J'ai mangé bien","J'ai bien mangé","Je mange bien eu","Bien j'ai mangé"],a:1,e:"Наречие между aux и причастием."},
{t:"f",q:"очевидно = ___ (от évident)",a:["évidemment"],e:"évidemment [эвидамɑ̃]."}
]},
{
id:"a-de-infinitif", lv:"A2", u:2, n:13, title:"Глагол + à / de + инфинитив",
content:`## Запомни списки — это надо знать наизусть
### Глаголы с à (направление, начало, обучение)
- commencer **à** (начинать), apprendre **à** (учиться), enseigner **à**
- réussir **à** (преуспеть в), arriver **à** (смочь, справиться)
- aider **à** (помогать), inviter **à**, pousser **à**
- penser **à** (думать о), s'intéresser **à**, participer **à**
- jouer **à** (играть в ИГРУ: jouer au foot), chercher **à** (пытаться), hésiter **à**
- donner **à** boire, mettre **à** (положить в...)
### Глаголы с de (начало/конец/чувство/приказ)
- finir **de** (закончить), arrêter **de** (перестать), décider **de** (решить)
- essayer **de** (пытаться), oublier **d**e (забыть), refuser **de** (отказаться)
- choisir **de**, promettre **de** (обещать), conseiller **de**, permettre **de**
- avoir envie **de** (хотеть), avoir besoin **de** (нуждаться), avoir peur **de** (бояться)
- rêver **de**, s'excuser **de**, remercier **de/pour**, venir **de** (только что)
- défendre **de** (запрещать), dire **de** (велеть), demander **de**
### Без предлога (самые частые!)
vouloir, pouvoir, devoir, savoir, aller (futur proche), venir (passé récent... с de!), faire, falloir, préférer, aimer, détester, compter (намереваться), espérer, sembler, paraître:
> Je **veux partir**. Je **peux venir**. Je **dois travailler**. Il **faut manger**.
⚠️ «Перед гласной de → d': oublier **d'**appeler.`,
ex:[["J'apprends à nager.","Я учусь плавать."],
["J'ai fini de manger.","Я закончил есть."],
["Il a oublié d'acheter du pain.","Он забыл купить хлеб."],
["Je veux partir maintenant.","Я хочу уйти сейчас."]],
points:["à: commencer, apprendre, réussir, arriver, penser, jouer","de: finir, décider, essayer, oublier, avoir envie/besoin/peur","Без предлога: vouloir, pouvoir, devoir, savoir, faire, aimer","d' перед гласной"],
quiz:[
{t:"c",q:"J'ai oublié ___ fermer la porte.",o:["à","de","—","par"],a:1,e:"Oublier DE + inf."},
{t:"c",q:"Il commence ___ pleuvoir.",o:["de","à","—","par"],a:1,e:"Commencer À."},
{t:"c",q:"Je veux ___ partir.",o:["à","de","—","que"],a:2,e:"Vouloir — без предлога: je veux partir."},
{t:"c",q:"Nous avons fini ___ dîner.",o:["à","de","—","par"],a:1,e:"Finir DE."},
{t:"c",q:"J'ai envie ___ dormir.",o:["de","à","—","d'"],a:0,e:"Avoir envie DE."}
]},
{
id:"relatifs-qui-que", lv:"A2", u:2, n:14, title:"Относительные qui и que — сложные предложения",
content:`## qui = который (ПОДЛЕЖАЩЕЕ в своей части)
> L'homme **qui** parle est mon père. — Мужчина, **который** говорит, — мой отец.
> La lettre **qui** est sur la table. — Письмо, которое (лежит) на столе.
После qui глагол сразу! qui заменяет подлежащее.
## que = которого/которую/которое (ДОПОЛНЕНИЕ)
> Le livre **que** je lis. — Книга, которую я читаю. (я читаю ЧТО? книгу)
> La femme **que** tu regardes.
После que идёт подлежащее + глагол.
⚠️ **qu'** перед гласной: l'homme **qu'**elle aime.
## Как выбрать?
Смотри, что стоит ПОСЛЕ пропуска:
- дальше **глагол** → **qui**: C'est moi **qui** ai raison. (это я прав)
- дальше **местоимение/сущ. (подлежащее)** → **que**: C'est le film **que** j'ai vu.
## où = где/когда (о месте и времени!)
> La ville **où** je suis né. — Город, где я родился.
> Le jour **où** nous nous sommes rencontrés. — День, КОГДА мы встретились.
## C'est... qui/que — выделение
> **C'est** moi **qui** l'ai fait ! — Это Я сделал!
> **C'est** ce livre **que** je veux. — Именно эту книгу я хочу.`
,
ex:[["La femme qui chante est ma sœur.","Женщина, которая поёт, — моя сестра."],
["Le gâteau que j'ai mangé était bon.","Торт, который я съел, был вкусным."],
["Voici la maison où j'habite.","Вот дом, где я живу."]],
points:["qui + глагол (подлежащее)","que + подлежащее (дополнение)","où = где И когда","C'est moi qui... — выделение"],
quiz:[
{t:"f",q:"Мужчина, который звонит = L'homme ___ téléphone.",a:["qui"],e:"Дальше глагол → qui."},
{t:"f",q:"Фильм, который я видел = Le film ___ j'ai vu.",a:["que"],a2:"",e:"Дальше подлежащее j' → que."},
{t:"f",q:"Город, где я родился = La ville ___ je suis né.",a:["où"],e:"Место → où."},
{t:"c",q:"«Девушка, которую он любит»:",o:["La fille qui il aime","La fille qu'il aime","La fille où il aime","La fille elle aime"],a:1,e:"que + élision: qu'il aime."}
]},
{
id:"subjonctif-present", lv:"B1", u:3, n:1, title:"Subjonctif présent — наклонение субъективности",
content:`## Что это
Особое наклонение после выражений **желания, необходимости, чувства, сомнения**: «чтобы...».
> Je veux **que tu viennes**. — Я хочу, чтобы ты пришёл. (не *veux que tu viens!)
## Образование: основа 3-го лица мн.ч. présent (ils) + -e, -es, -e, -ions, -iez, -ent
- parler: ils parl**ent** → que je parl**e**, que tu parl**es**, qu'il parl**e**, que nous parl**ions**, que vous parl**iez**, qu'ils parl**ent**
- finir: ils finiss**ent** → que je finiss**e**...
- vendre: ils vend**ent** → que je vend**e**...
## Неправильные (обязательно!)
| être | que je **sois**, sois, soit, **soyons**, **soyez**, soient |
| avoir | que j'**aie**, aies, ait, **ayons**, **ayez**, aient |
| aller | que j'**aille**, ailles, aille, **allions**, alliez, **aillent** |
| faire | que je **fasse**, fasses, fasse, fassions, fassiez, **fassent** |
| pouvoir | que je **puisse** (все: puisse, puisses, puisse, puissions, puissiez, puissent) |
| savoir | que je **sache** |
| vouloir | que je **veuille**... qu'ils **veuillent** |
| venir | que je **vienne**... qu'ils **viennent** |
| prendre | que je **prenne**... qu'ils **prennent** |
| voir | que je **voie**... que nous **voyions** |
⚠️ «Двухосновные»: parler — je parle / nous parlions; но boire: que je **boive**, que nous **buvions**; croire: que je **croie**, que nous **croyions**.
## Всегда после QUE. Первая часть — другой глагол.
**Que** — обязательный сигнал субжонктива (кроме единичного impératif: Vive le roi !).`,
ex:[["Il faut que tu fasses tes devoirs.","Нужно, чтобы ты сделал уроки."],
["Je suis content que tu sois là.","Я рад, что ты здесь."],
["Bien qu'il soit tard, je travaille.","Хоть и поздно, я работаю."],
["Je veux qu'elle vienne.","Я хочу, чтобы она пришла."]],
points:["Основа ils-présent + e/es/e/ions/iez/ent","Неправильные: sois, aie, aille, fasse, puisse, sache, veuille, vienne, prenne","Две основы: boive/buvions, voie/voyions","Только после que"],
quiz:[
{t:"f",q:"Il faut que tu ___ (être) prêt.",a:["sois"],e:"Être → subjonctif: que tu sois."},
{t:"f",q:"Je veux qu'il ___ (venir).",a:["vienne"],e:"Venir → qu'il vienne."},
{t:"f",q:"Bien que nous ___ (avoir) peu de temps...",a:["ayons"],e:"Avoir → que nous ayons."},
{t:"c",q:"«que je fasse» — от какого глагола?",o:["falloir","faire","fâcher","fuir"],a:1,e:"Faire → que je fasse (нерегулярная основа fass-)."},
{t:"f",q:"Je doute qu'il ___ (pouvoir) venir.",a:["puisse"],e:"Pouvoir → qu'il puisse."}
]},
{
id:"subjonctif-usage", lv:"B1", u:3, n:2, title:"Когда нужен subjonctif: триггеры и смысл",
content:`## Логика: два разных «я»
Субжонктив нужен, когда **субъекты разные** и первый выражает отношение ко второму действию:
> Je veux **que tu partes**. (я хочу — ты уходишь: разные субъекты → subjonctif)
> Je veux **partir**. (один субъект → инфинитив, НЕ subjonctif!)
## 1. Желание, воля, необходимость
vouloir que, désirer que, souhaiter que, **il faut que** (нужно), devoir (que)...
> Il faut que nous **partions**.
## 2. Чувства, эмоции
être content/triste/fâché/surpris que, avoir peur que, regretter que, craindre que, être heureux que:
> Je suis désolé que tu **sois** malade. — Мне жаль, что ты болен.
## 3. Сомнение, неуверенность, отрицание
douter que, il est possible/probable que, il se peut que:
> Je doute qu'il **vienne**. — Сомневаюсь, что он придёт.
⚠️ Но: **Je ne crois pas que** + subjonctif (отрицание → сомнение), а **Je crois que** + indicatif!
> Je crois qu'il **est** là. / Je ne crois pas qu'il **soit** là.
⚠️ **Penser que** (утвердительно) + indicatif; **Je ne pense pas que** + subjonctif.
⚠️ **Espérer que** (надеяться) + INDICATIF (будущее!): J'espère qu'il **viendra**. — уникальное исключение!
## 4. Союзы (учить наизусть!)
**bien que** (хотя), **quoique** (хоть), **pour que** (чтобы), **afin que** (дабы), **avant que** (+ ne: avant qu'il **ne** parte — до того как), **jusqu'à ce que** (пока не), **à condition que** (при условии), **pourvu que** (лишь бы), **sans que** (без того чтобы), **de peur que** (из страха что), **en attendant que** (в ожидании)
> Je travaille dur **pour que** mes enfants **aient** une bonne vie.
## 5. Безличные оценочные (НЕ факт, а оценка)
il est important/nécessaire/étonnant/dommage/juste/possible que...
⚠️ Но il est **certain/sur/vrai/évident/probable** que + **indicatif** (факт!):
> Il est sûr qu'il **viendra**.
## НЕ нужен subjonctif
après que (+ indicatif! «после того как» — факт), espérer que, penser/croire (утвердительно), il est probable que, dire que, affirmer que.
⚠️ «Après que» строго с indicatif (хотя французы часто ошибаются): après qu'il **est parti**.`
,
ex:[["Il faut que tu saches la vérité.","Тебе нужно знать правду."],
["Bien qu'il pleuve, nous sortons.","Хоть и идёт дождь, мы выходим."],
["J'espère que tu viendras.","Надеюсь, ты придёшь."],
["Je ne pense pas qu'il soit coupable.","Не думаю, что он виновен."]],
points:["Разные субъекты + отношение → subjonctif","bien que/pour que/bien/avant que/à condition que — всегда subjonctif","espérer que + indicatif (!), penser que (утв.) + indicatif","il est certain/sûr que + indicatif"],
quiz:[
{t:"c",q:"J'espère qu'il ___ demain.",o:["vienne","viendra","viendrait","vient"],a:1,e:"Espérer que + indicatif (обычно futur): j'espère qu'il viendra."},
{t:"c",q:"Je ne crois pas qu'il ___ raison.",o:["a","ait","avait","aura"],a:1,e:"Отрицательное croire → subjonctif: qu'il ait."},
{t:"c",q:"___ il pleuve, nous sortons. (хотя идёт дождь)",o:["Malgré","Bien que","Cependant","Puisque"],a:1,e:"Bien que + subjonctif."},
{t:"c",q:"Il est certain qu'il ___",o:["vienne","viendra","viendrait","vient"],a:1,e:"Факт → indicatif (futur)."},
{t:"f",q:"Je travaille ___ que tu réussisses. (чтобы ты преуспел)",a:["pour"],e:"Pour que + subjonctif."}
]},
{
id:"dont", lv:"B1", u:3, n:3, title:"Относительное dont — «о котором, которого»",
content:`## dont заменяет «de + что-то»
Любая конструкция с **de** внутри придаточного → dont:
- parler **de** → Le livre **dont** je parle. — Книга, о которой я говорю.
- avoir besoin **de** → L'outil **dont** j'ai besoin. — Инструмент, который мне нужен.
- être content **de** → L'examen **dont** je suis content.
## Частые шаблоны (учить целиком!)
- **c'est la raison dont...** — это причина, по которой...
- **dont je me souviens** — который я помню (se souvenir DE)
- **ce dont** — то, о чём: **Ce dont** j'ai besoin, c'est de temps. — Что мне нужно, так это время.
## dont + количество/часть целого
«из которых»:
> J'ai trois frères, **dont** deux habitent à Paris. — ...двое из которых живут в Париже.
> Il y avait dix personnes, **dont** cinq enfants.
## dont = родительный принадлежности (книжн.)
> Un homme **dont** le fils est médecin. — Человек, чей сын — врач.
## Сравнение всех относительных
| qui | подлежащее | l'homme qui parle |
| que | прямое дополнение | l'homme que je vois |
| dont | de + ... | l'homme dont je parle |
| où | место/время | la ville où je vis |
| lequel/laquelle | с предлогами (sur, avec, pour...) | la table sur laquelle... |`,
ex:[["Voici le film dont je t'ai parlé.","Вот фильм, о котором я тебе говорил."],
["C'est ce dont nous avons besoin.","Это то, что нам нужно."],
["J'ai deux sœurs, dont une est médecin.","У меня две сестры, одна из которых врач."]],
points:["dont = замена «de + ...»","parler de, avoir besoin de, se souvenir de → dont","dont + число = из которых","ce dont = то, о чём"],
quiz:[
{t:"f",q:"Фильм, о котором я говорю = Le film ___ je parle.",a:["dont"],e:"Parler de → dont."},
{t:"c",q:"«Инструмент, который мне нужен» (avoir besoin de):",o:["L'outil que j'ai besoin","L'outil dont j'ai besoin","L'outil qui j'ai besoin","L'outil où j'ai besoin"],a:1,e:"Besoin DE → dont."},
{t:"c",q:"«У меня 5 книг, две из которых новые»:",o:["5 livres, que deux sont nouvelles","5 livres, dont deux sont nouvelles","5 livres, qui deux nouvelles","5 livres, où deux"],a:1,e:"Dont + количество = «из которых»."},
{t:"f",q:"То, о чём я мечтаю = ___ je rêve, c'est voyager.",a:["ce dont","Ce dont"],e:"Rêver de → ce dont."}
]},
{
id:"conditionnel-passe", lv:"B1", u:3, n:4, title:"Conditionnel passé — сожаление и «если бы»",
content:`## Формула: conditionnel présent от avoir/être + participe passé
> J'**aurais** fait — я бы сделал
> Je **serais** allé(e) — я бы сходил
> Nous **aurions dû** — нам следовало бы
## 1. Сожаление, упрёк (про прошлое!)
> J'**aurais dû** te le dire. — Мне надо было (следовало бы) тебе это сказать.
> Tu **aurais pu** m'aider ! — Ты мог бы и помочь!
> J'**aurais voulu** être artiste. — Я хотел бы стать (тогда) артистом.
## 2. Невыполненное условие (si + plus-que-parfait)
> Si j'**avais su**, je **serais venu**. — Если бы я знал, я бы пришёл. (но не знал и не пришёл)
> Si tu m'**avais écouté**, tu n'**aurais pas** eu de problèmes.
⚠️ После **si** — plus-que-parfait (avais su), в главной части — conditionnel passé (serais venu).
## 3. Вежливое прошлое, неподтверждённое
> Il **aurait** dit cela ? — Он якобы это сказал?
> Selon la police, le voleur **serait parti** par la fenêtre. — По данным полиции, вор якобы вышел через окно. (журналистское использование — помни для новостей!)`,
ex:[["J'aurais voulu être pilote.","Я бы хотел стать пилотом (но не стал)."],
["Si j'avais eu de l'argent, j'aurais voyagé.","Если бы у меня были деньги, я бы путешествовал."],
["Tu aurais dû m'écouter !","Тебе следовало меня послушать!"]],
points:["aurais/serais + participe passé","Сожаление: j'aurais dû = надо было","Si + plus-que-parfait → conditionnel passé","В новостях = неподтверждённая информация"],
quiz:[
{t:"f",q:"Я бы сделал = J'___ fait.",a:["aurais"],e:"Conditionnel passé: j'aurais fait."},
{t:"c",q:"«Если бы я знал, я бы пришёл»:",o:["Si je savais, je venais","Si j'avais su, je serais venu","Si je sais, je viens","Si j'aurais su, je serais venu"],a:1,e:"Si + plus-que-parfait → conditionnel passé. Никогда si + conditionnel!"},
{t:"c",q:"«Tu aurais dû m'appeler !» = ",o:["Тебе следовало позвонить (упрёк)","Ты должен позвонить","Ты позвонишь","Ты звонил"],a:0,e:"Conditionnel passé = упрёк за несделанное."},
{t:"f",q:"Мы бы хотели = Nous ___ voulu.",a:["aurions"],e:"Nous aurions voulu."}
]},
{
id:"si-clauses", lv:"B1", u:3, n:5, title:"Условные предложения: три типа si-конструкций",
content:`## Тип 1: реальное условие (вероятное будущее)
**si + présent → futur simple**
> Si j'**ai** le temps, je **viendrai**. — Если будет время, я приду.
> Si tu étudies, tu réussiras.
## Тип 2: нереальное настоящее («если бы... сейчас»)
**si + imparfait → conditionnel présent**
> Si j'**avais** de l'argent, j'**achèterais** une maison. — Если бы у меня были деньги (сейчас нет), я бы купил дом.
> Si j'**étais** toi, je **partirais**. — На твоём месте я бы уехал.
⚠️ Imparfait после si здесь НЕ означает прошлое — это «воображаемое настоящее».
⚠️ Si + je → **si j'**avais; с être всегда **étais** даже с je/tu/il (si j'étais — не *si j'étais... да, именно étais, а в вежливой норме с tu тоже «si tu étais»).
## Тип 3: нереальное прошлое (сожаление)
**si + plus-que-parfait → conditionnel passé**
> Si j'**avais su**, j'**aurais agi** autrement. — Если бы я знал (тогда), я бы поступил иначе.
> Si tu étais venu, tu l'aurais vue.
## Смешанные типы (C1)
> Si j'**avais étudié** la médecine (прошлое), je **serais** médecin aujourd'hui (настоящее).
## Книжная инверсия без si (литературный стиль!)
**Si** можно заменить инверсией с conditionnel/plus-que-parfait:
> **Eût**-il su la vérité, il serait parti. = S'il avait su...
> **Serait**-il coupable ? (журн.)`,
ex:[["Si tu viens, je serai content.","Если придёшь, я буду рад."],
["Si j'étais riche, je voyagerais.","Если бы я был богат, я бы путешествовал."],
["Si nous étions partis plus tôt, nous aurions eu le train.","Если бы мы вышли раньше, мы бы успели на поезд."]],
points:["Тип 1: si + présent → futur","Тип 2: si + imparfait → conditionnel présent","Тип 3: si + plus-que-parfait → conditionnel passé","Никогда conditionnel сразу после si!"],
quiz:[
{t:"c",q:"Si je (savoir), je te le dirais.",o:["sais","savais","saurais","sachais"],a:1,e:"Тип 2: si + imparfait (savais) → conditionnel (dirais)."},
{t:"c",q:"Si tu m'avais aidé, j'___ fini plus vite.",o:["aurais","avais","aurai","ai"],a:0,e:"Тип 3: conditionnel passé — j'aurais fini."},
{t:"c",q:"Si demain il fait beau, nous ___ à la plage.",o:["irions","irons","allions","sommes allés"],a:1,e:"Тип 1: présent → futur simple (irons)."},
{t:"c",q:"Какая фраза правильная?",o:["Si je serais riche...","Si j'étais riche, j'achèterais...","Si j'achèterais...","Si j'étais riche, j'achetais..."],a:1,e:"Si + imparfait → conditionnel présent."}
]},
{
id:"gerondif", lv:"B1", u:3, n:6, title:"Gérondif и participe présent — «делая»",
content:`## Participe présent: основа nous-présent + -ant
- parler → parl + ant = **parlant**
- finir → finiss + ant = **finissant**
- Неправильные: être → **étant**, avoir → **ayant**, savoir → **sachant**
## Gérondif = en + participe présent
> **En mangeant**, il regarde la télé. — Едя (во время еды), он смотрит ТВ.
> Elle est sortie **en courant**. — Она выбежала (бегом, выбегая бегом).
> **En travaillant** dur, tu réussiras. — Усердно работая, ты преуспеешь.
## Отличия (важно для чтения!)
1. **Gérondif (en + -ant)** — ОБСТОЯТЕЛЬСТВО действия того же субъекта: когда? как? каким образом?
> Il chante **en travaillant**. (он поёт, работая — одновременно)
2. **Participe présent без en** — книжное, часто причина или описание:
> **Sachant** qu'il mentait, elle se tut. — Зная, что он лжёт, она промолчала. (причина)
> Un film **passionnant**. — увлекательный фильм (уже прилагательное!)
3. **Participe présent vs прилагательное**: -ant неизменяемо (действие), прилагательное согласуется:
> Une histoire **intéressante** (прил., ж.р.) / Une femme **intéressant** tout le monde (причастие, неизм.)... точнее: une femme intéressant tout le monde (причастие — неизменяемо).
## Tout en + gérondif = «продолжая, всё же»
> **Tout en** travaillant, il écoute de la musique. — Работая, он (в то же время) слушает музыку.
## Значения gérondif
- Одновременность: Il parle **en mangeant**.
- Способ: Elle répond **en souriant**. — Она отвечает улыбаясь.
- Условие: **En partant** maintenant, tu arriveras à l'heure. — Если выйдешь сейчас...
- Уступка (tout en): **Tout en** étant fatigué, il travaille. — Хотя и устал...`,
ex:[["En sortant, ferme la porte.","Выходя, закрой дверь."],
["Elle apprend le français en regardant des films.","Она учит французский, смотря фильмы."],
["Ayant fini son travail, il est rentré.","Закончив работу, он вернулся домой."],
["Il parle en gesticulant.","Он говорит, жестикулируя."]],
points:["Participe présent = nous-основа + -ant (étant, ayant, sachant)","Gérondif = en + participe présent","Одновременность, способ, условие","Tout en + gérondif = уступка"],
quiz:[
{t:"f",q:"Выходя, закрой дверь = ___ sortant, ferme la porte.",a:["en"],e:"Gérondif: en sortant."},
{t:"f",q:"Participe présent от être = ___",a:["étant"],e:"Être → étant (неправильное)."},
{t:"c",q:"«Elle travaille en écoutant de la musique» = ",o:["Она работает, слушая музыку","Она работает после музыки","Она работает, чтобы слушать","Она любит музыку"],a:0,e:"Gérondif = одновременность."},
{t:"f",q:"Participe présent от finir = ___",a:["finissant"],e:"finiss(ons) + ant = finissant."},
{t:"c",q:"«Tout en lisant, il écoute...» — tout en выражает:",o:["причину","уступку/одновременность","цель","следствие"],a:1,e:"Tout en = «хотя и / одновременно»."}
]},
{
id:"passif", lv:"B1", u:3, n:7, title:"Пассивный залог: Le livre est lu",
content:`## Формула: être (в нужном времени) + participe passé + par/de
Актив: Le chat **mange** la souris. — Кот ест мышь.
Пассив: La souris **est mangée** par le chat. — Мышь съедена котом.
⚠️ Причастие согласуется с подлежащим пассива: la souris est mangé**e**, les souris sont mangé**es**.
## В разных временах
| Présent | Le pain est fait ici. |
| Passé composé | Le pain a été fait hier. |
| Imparfait | Le pain était fait à la main. |
| Futur | Le pain sera fait demain. |
| Conditionnel | Le pain serait fait par Paul. |
## par или de?
- Обычно **par** (действие, агент): Il a été frappé **par** son frère.
- **de** — с глаголами чувств и состояния: être aimé **de** tous (любим всеми), être connu **de**, être suivi **de**, être accompagné **de**, être couvert **de** (покрыт), être rempli **de** (наполнен).
## Когда пассив НЕ нужен
Французский часто избегает пассива:
- **on**: On a volé ma voiture. (Машину украли. — вместо «машина была украдена»)
- Возвратный пассив: Ce vin **se boit** frais. — Это вино пьют охлаждённым.
## Пассив без агента — самый частый
> La banque **a été braquée**. — Банк ограбили. (кем — неизвестно/неважно)
> Ces livres **se vendent** bien. — Эти книги хорошо продаются.`
,
ex:[["La maison a été construite en 1900.","Дом построен в 1900 году."],
["Il est connu de tous.","Он всем известен."],
["Le français est parlé dans le monde entier.","На французском говорят во всём мире."]],
points:["être + participe passé + par/de","Согласование причастия с подлежащим","de — с чувствами/состоянием (aimé de, connu de)","Замены: on..., se + глагол"],
quiz:[
{t:"f",q:"Дом был продан = La maison ___ été vendue.",a:["a"],e:"Passé composé пассива: a été vendue."},
{t:"c",q:"«Elle est aimée ___ tous»:",o:["par","de","pour","avec"],a:1,e:"С глаголами чувств — de: aimée de tous."},
{t:"c",q:"«Ce vin se boit frais» означает:",o:["Это вино пьётся охлаждённым","Вино выпито","Нужно пить вино","Вино пить нельзя"],a:0,e:"Возвратный пассив: se + глагол = «это пьют/продаётся»."},
{t:"c",q:"Les lettres ___ écrites hier.",o:["sont","ont été","étaient été","sont été"],a:1,e:"Passé composé пассива: ont été écrites (согласование: écrites)."}
]},
{
id:"discours-indirect", lv:"B1", u:3, n:8, title:"Косвенная речь и согласование времён",
content:`## Прямая → косвенная
> Il dit : « Je **suis** fatigué. » → Il dit qu'il **est** fatigué. (настоящее → настоящее)
> Il a dit : « Je **suis** fatigué. » → Il a dit qu'il **était** fatigué. (прошедший глагол-вводка СДВИГАЕТ времена!)
## Таблица сдвига (concordance des temps)
Если вводный глагол в прошедшем (il a dit, il avait dit...):
| Прямая речь | Косвенная |
| présent | → **imparfait** (Je viens → il a dit qu'il venait) |
| passé composé | → **plus-que-parfait** (J'ai fini → il a dit qu'il avait fini) |
| imparfait | → **plus-que-parfait** (или остаётся) |
| futur simple | → **conditionnel présent** (Je viendrai → il a dit qu'il viendrait) |
| futur antérieur | → **conditionnel passé** (J'aurai fini → il aurait fini) |
| conditionnel | → остаётся |
| subjonctif | → остаётся |
## Местоимения и указатели тоже меняются
- je → il; mon → son; nous → ils
- aujourd'hui → **ce jour-là**; demain → **le lendemain**; hier → **la veille**; ici → **là**; ce → **ce...-là**
## Вопросы в косвенной речи
- общий вопрос → **si**: « Tu viens ? » → Il demande **si** je viens.
- «qu'est-ce que» → **ce que**: Il demande **ce que** je fais.
- «qu'est-ce qui» → **ce qui**: Il demande **ce qui** se passe.
- «où/quand/pourquoi/comment/combien» — сохраняются: Il demande **où** je vais.
## Приказ → de + инфинитив
> « Pars ! » → Il m'a dit **de partir**. — Он сказал мне уйти.`
,
ex:[["Il a dit qu'il viendrait demain.","Он сказал, что придёт завтра."],
["Elle a demandé si j'avais faim.","Она спросила, голоден ли я."],
["Le professeur nous a dit de nous taire.","Учитель велел нам замолчать."]],
points:["Прошедшая вводка сдвигает времена","présent→imparfait, pc→pqpf, futur→conditionnel","demain→le lendemain, ici→là","Вопрос → si / ce que / ce qui; приказ → de + inf"],
quiz:[
{t:"c",q:"Il a dit : « Je viendrai » → Il a dit qu'il ___",o:["viendra","viendrait","venait","viendrait"],a:1,e:"Futur → conditionnel présent: viendrait."},
{t:"c",q:"Elle a demandé : « Où vas-tu ? » → Elle a demandé où ___",o:["je vais","j'allais","je suis allé","j'irai"],a:1,e:"Présent → imparfait: j'allais."},
{t:"c",q:"« Tu viens ? » — косвенно: Il demande ___ je viens.",o:["que","si","quand","ce que"],a:1,e:"Общий вопрос → si."},
{t:"f",q:"Он сказал мне подождать = Il m'a dit ___ attendre.",a:["de"],e:"Приказ → de + инфинитив."}
]},
{
id:"connecteurs", lv:"B1", u:3, n:9, title:"Логические связки: строй аргументацию",
content:`## Причина (почему?)
- **parce que** + indicatif — в ответе на «почему»: Pourquoi ? — **Parce que** je suis malade.
- **car** + indicatif — формальнее, книжнее, не в начале предложения: Je reste **car** il pleut.
- **puisque** + indicatif — «раз уж» (очевидно): **Puisque** tu sais tout, dis-moi...
- **comme** + indicatif — в НАЧАЛЕ фразы: **Comme** il pleuvait, nous sommes restés.
- **grâce à** + сущ. — «благодаря» (позитив); **à cause de** + сущ. — «из-за» (негатив)
- **en raison de** (офиц.), **faute de** (из-за отсутствия: faute de temps)
## Следствие (поэтому)
- **donc** (итак): Je pense, **donc** je suis.
- **alors** (тогда, значит), **par conséquent** / **donc** (формальн.)
- **c'est pourquoi** (поэтому), **du coup** (разг.), **ainsi** (таким образом)
- **tellement/si ... que** (настолько... что): Il est **si** fatigué **qu'**il dort debout.
- **de sorte que / de façon que** + indicatif (результат) или + **subjonctif** (цель!): Parle fort **de sorte que** tous **entendent**.
## Противопоставление (но, однако)
- **mais** (но), **cependant/pourtant/néanmoins** (однако), **en revanche** (зато), **par contre** (разг. зато), **alors que / tandis que** (тогда как + indicatif)
- **bien que / quoique** + **subjonctif** (хотя)
- **malgré** + сущ. (несмотря на): **malgré la pluie**
- **avoir beau** + inf (сколько ни...): Il **a beau** pleuvoir, je sors.
## Цель
- **pour / afin de** + **infinitif** (один субъект): Je travaille **pour gagner** de l'argent.
- **pour que / afin que** + **subjonctif** (два субъекта): Je te le dis **pour que** tu **saches**.
- **de peur de / de crainte de** + inf (из боязни)
## Добавление и порядок
- **d'abord** (сначала), **ensuite/puis** (затем), **enfin** (наконец)
- **de plus / en outre / par ailleurs** (кроме того), **aussi** (тоже)
- **surtout** (особенно), **notamment** (в частности)`,
ex:[["Comme il était tard, nous sommes partis.","Так как было поздно, мы ушли."],
["Il pleut, donc je reste à la maison.","Идёт дождь, значит я остаюсь дома."],
["Bien qu'il soit malade, il travaille.","Хоть он и болен, он работает."],
["Je révise pour réussir l'examen.","Я повторяю, чтобы сдать экзамен."]],
points:["parce que (ответ) / car (форм.) / comme (в начале)","grâce à (+) / à cause de (−)","donc / alors / c'est pourquoi","bien que + subjonctif; pour + inf; pour que + subjonctif"],
quiz:[
{t:"c",q:"___ il pleuvait, nous sommes restés. (так как — в начале)",o:["Parce que","Comme","Car","Puisque"],a:1,e:"Comme — причина в начале фразы."},
{t:"c",q:"Bien qu'il ___ fatigué, il continue.",o:["est","soit","était","sera"],a:1,e:"Bien que + subjonctif."},
{t:"c",q:"Je travaille ___ gagner ma vie. (чтобы — один субъект)",o:["pour que","afin de","de sorte que","pour"],a:1,e:"Один субъект → afin de / pour + инфинитив."},
{t:"c",q:"Он сдал экзамен ___ своим упорством. (благодаря)",o:["à cause de","grâce à","malgré","faute de"],a:1,e:"Позитивная причина → grâce à."},
{t:"c",q:"Il est ___ fatigué ___ il dort debout. (настолько... что)",o:["très / pour","si / qu'","tellement / pour","assez / que"],a:1,e:"si ... que + indicatif."}
]},
{
id:"impersonnels", lv:"B1", u:3, n:10, title:"Безличные обороты: il faut, il y a, il semble",
content:`## Что такое безличное «il»
**il** здесь = «пустышка», не «он». Такие обороты — каркас французской речи.
## Основные
- **il y a** — есть, имеется: **Il y a** un problème. / Il y a deux ans (два года назад)
- **il faut** + inf — нужно (вообще): **Il faut** manger. — Надо есть.
- **il faut que** + subjonctif: Il faut **que tu viennes**.
- **il est + прил. + de** (формальнее): Il est important **de** savoir. — Важно знать.
- **il est nécessaire/essentiel/urgent/temps de...**
- **il semble que** + subjonctif (кажется): Il semble qu'il **soit** parti.
- **il paraît que** + indicatif (говорят, очевидно): Il paraît qu'il **est** riche.
- **il s'agit de** — речь идёт о: **Il s'agit d'**un problème grave.
- **il vaut mieux** + inf (лучше): **Il vaut mieux** partir. / Il vaut mieux que tu partes.
- **il reste à** + inf (остаётся): Il reste à vérifier.
- **il manque** — не хватает: Il manque du sel.
- **il ne faut pas** — нельзя: **Il ne faut pas** mentir.
- **il est dommage que** + subj (жаль, что), **il est possible que** + subj
- Погода: **il pleut** (идёт дождь), **il neige**, **il fait beau/froid/chaud/nuit/jour**, **il y a du vent/du soleil**
## В прошедшем/будущем
> Il **y avait** beaucoup de monde. — Было много людей.
> Il **faudrait** (conditionnel — следовало бы).
> Il **y aura** des conséquences.
## Конструкции с c'est
- **c'est + прил. + de**: C'est difficile **de** comprendre. (разговорный вариант il est)
- **c'est + прил. + que** + subj: C'est dommage que tu **partes**.
- **il est temps que** + subj: Il est temps que tu **dormes**.`
,
ex:[["Il faut que tu fasses attention.","Тебе нужно быть внимательным."],
["Il semble qu'il ait raison.","Похоже, он прав."],
["Il y a trois ans, j'habitais à Lyon.","Три года назад я жил в Лионе."],
["Il s'agit d'une question importante.","Речь идёт о важном вопросе."]],
points:["il faut que + subjonctif","il est important DE + inf (один субъект)","il semble que + subj, il paraît que + indic","c'est dommage que + subj"],
quiz:[
{t:"c",q:"Il semble qu'il ___ parti.",o:["est","soit","était","sera"],a:1,e:"Il semble que + subjonctif (неуверенность)."},
{t:"c",q:"Il est important ___ comprendre.",o:["que","de","à","pour"],a:1,e:"Безличный оборот с одним субъектом → de + inf."},
{t:"f",q:"Речь идёт о проблеме = Il ___ d'un problème.",a:["s'agit"],e:"Il s'agit de."},
{t:"c",q:"Il paraît qu'il ___ riche.",o:["soit","est","serait pas","fût"],a:1,e:"Il paraît que + indicatif (достоверность)."},
{t:"c",q:"«Лучше уйти»:",o:["Il faut mieux partir","Il vaut mieux partir","Il est mieux de partir","Il préfère partir"],a:1,e:"Il vaut mieux + infinitif."}
]},
{
id:"ou-lequel", lv:"B1", u:3, n:11, title:"Относительные с предлогами: lequel, avec qui, sur quoi",
content:`## lequel — «который» после предлога (о предметах)
Согласуется в роде и числе:
| | м.р. | ж.р. |
| ед.ч. | **lequel** | **laquelle** |
| мн.ч. | **lesquels** | **lesquelles** |
> La table **sur laquelle** tu écris. — Стол, на котором ты пишешь.
> Les raisons **pour lesquelles** je pars. — Причины, по которым я уезжаю.
## С слиянием à/de
- à + lequel = **auquel**, à + lesquels = **auxquels**, à + lesquelles = **auxquelles**
- de + lequel = **duquel**, de + lesquels = **desquels**, desquelles
> Le projet **auquel** je pense. — Проект, о котором я думаю. (penser à)
> La chaise **à côté de laquelle**... — Стул, рядом с которым...
## О ЛЮДЯХ — просто qui после предлога!
> L'homme **avec qui** je travaille. (не *avec lequel — хотя формально можно, но qui естественнее)
> La femme **dont** je parle. (de + человек → dont, не *de laquelle в живой речи)
## Устойчивые формулы
- **ce qui** — то, что (подлежащее): **Ce qui** m'étonne, c'est son calme. — Что меня удивляет...
- **ce que** — то, что (дополнение): Dis-moi **ce que** tu penses.
- **ce dont** — то, о чём: **Ce dont** je rêve.
- **ce à quoi** — то, о чём (à): **Ce à quoi** je tiens. — То, чем я дорожу.
- **quoi** после предлога (разг.): Tu fais **quoi** ? / C'est **à quoi** ?
## Qui que / quoi que + subjonctif (кто бы ни / что бы ни)
> **Qui que** tu **sois**, réponds ! — Кто бы ты ни был!
> **Quoi que** tu **fasses**, je t'aime. — Что бы ты ни делал.
> **Où que** tu **ailles**... — Куда бы ты ни шёл.`
,
ex:[["Le stylo avec lequel j'écris.","Ручка, которой я пишу."],
["C'est ce à quoi je pensais.","Это то, о чём я думал."],
["Quoi que tu dises, je ne te crois pas.","Что бы ты ни говорил, я тебе не верю."],
["L'ami avec qui je voyage.","Друг, с которым я путешествую."]],
points:["lequel/laquelle/lesquels/lesquelles после предлогов (предметы)","auquel/duquel — слияния","О людях: предлог + qui (avec qui)","ce qui/ce que/ce dont/ce à quoi; qui que/quoi que + subj"],
quiz:[
{t:"c",q:"La chaise ___ je suis assis. (на которой я сижу — s'asseoir sur)",o:["sur qui","sur laquelle","sur quel","dont"],a:1,e:"Chaise — ж.р. предмет, sur + laquelle."},
{t:"c",q:"L'homme ___ je travaille. (с которым)",o:["avec lequel","avec qui","dont","lequel"],a:1,e:"О людях — предлог + qui: avec qui."},
{t:"c",q:"«То, чего я хочу»:",o:["Ce qui je veux","Ce que je veux","Ce dont je veux","Ce à quoi je veux"],a:1,e:"Vouloir qch (прямое дополнение) → ce que."},
{t:"c",q:"Quoi que tu ___, je pars. (что бы ты ни делал)",o:["fais","fasses","ferais","feras"],a:1,e:"Quoi que + subjonctif."}
]},
{
id:"pronoms-ordre", lv:"B1", u:3, n:12, title:"Порядок местоимений: «il me le donne»",
content:`## Таблица порядка (перед глаголом)
| 1 | 2 | 3 | 4 | 5 |
| me, te, se, nous, vous | le, la, les | lui, leur | y | en |
Примеры:
> Il **me le** donne. — Он мне его даёт. (me → le)
> Je **le lui** donne. — Я его ему даю. (le → lui)
> Tu **m'en** parles ? — Ты мне об этом расскажешь?
> Il **nous y** emmène. — Он нас туда везёт.
> Je **le leur** enverrai. — Я им его отправлю.
⚠️ Главный принцип: **1-е и 2-е лица (me/te/nous/vous) ПЕРЕД 3-м (le/lui)**; le/la/les перед lui/leur; y и en — всегда последние.
## В утвердительном impératif — порядок обратный!
> Donne-**le-moi** ! (le → moi)
> Donne-**lui-en**. Va-**t'en** ! Parle-**m'en**.
## En + причастие/количество
> J'**en** ai acheté **trois**. — Я купил три (из них).
## Двойное отрицание
> Il **ne** me le donne **pas**.
> **Ne** me le donne **pas** ! (в отрицательном impératif — обычный порядок)`,
ex:[["Tu me le prêtes ?","Ты мне это одолжишь?"],
["Je vous en prie.","Прошу вас (не за что / пожалуйста)."],
["Donne-le-moi !","Дай мне его!"],
["Il ne leur dit rien.","Он им ничего не говорит."]],
points:["me/te/nous/vous → le/la/les → lui/leur → y → en","il me le donne / je le lui donne","Impératif утверд.: Donne-le-moi !","y и en — последние"],
quiz:[
{t:"c",q:"«Я тебе его дам»:",o:["Je te le donnerai","Je le te donnerai","Je te donnerai le","Je le toi donnerai"],a:0,e:"te (1-е... 2-е лицо) перед le: je te le donnerai."},
{t:"c",q:"«Дай мне это!» (impératif):",o:["Donne-moi-le","Donne-le-moi","Me le donne","Donne-le-me"],a:1,e:"После утвердительного impératif: le → moi: Donne-le-moi !"},
{t:"c",q:"«Он нас туда отвезёт»:",o:["Il nous y emmènera","Il y nous emmènera","Il nous emmènera y","Il y emmènera nous"],a:0,e:"nous → y: il nous y emmènera."},
{t:"c",q:"«Ты мне об этом говорил?» (parler de qqch à qqn):",o:["Tu m'en as parlé ?","Tu m'as en parlé ?","Tu en m'as parlé ?","Tu me l'as parlé ?"],a:0,e:"me → en: tu m'en as parlé ?"}
]},
{
id:"participe-passe-acords", lv:"B1", u:3, n:13, title:"Все правила согласования причастия",
content:`## Правило 1: С être — согласуется с подлежащим
> Elle est **partie**. Ils sont **venus**. Les fleurs sont **fanées**.
## Правило 2: С avoir — согласуется с COD, ЕСЛИ он СТОИТ ПЕРЕД глаголом
> J'ai mangé **la pomme**. → La pomme que j'ai mangé**e**. (-ée: яблоко стоит перед!)
> J'ai mangé → без изменений (COD нет или после).
> Les livres que j'ai **lus**. — Книги, которые я прочитал.
## Правило 3: Возвратные глаголы (с être, но логика avoir!)
- Согласование с подлежащим, если местоимение = прямое дополнение:
> Elle **s'**est lavée. (она вымыла себя: se = кого? — прямое)
> Ils **se** sont rencontrés.
- БЕЗ согласования, если после глагола есть прямое дополнение или se = косвенное:
> Elle s'est lavé **les mains**. (вымыла ЧТО? руки → lavé)
> Ils **se** sont **parlé**. (parler À qqn — se = косвенное → без согласования!)
> Elle s'est **téléphoné**? → se téléphoner (à) → Elle s'est téléphoné... точнее: elles se sont téléphoné (без -es!).
- Глаголы без прямого дополнения вообще (se parler, se téléphoner, se plaire, se sourire, se succéder, se ressembler, se mentir, se demander (косвенное? «спрашивать себя» — прямое! Elle s'est demandé... но спросить СЕБЕ ЧТО — demandé прямое...) — осторожнее: se demander qch → Elle s'est demand**é** pourquoi (qch после → нет согласования).
## Правило 4: faire + инфинитив — НИКОГДА не согласуется
> La robe que j'ai fait **faire**. — Платье, которое я сшила на заказ. (fait неизменяемо!)
## Правило 5: после предлога (безличные)
> Les efforts que cela a **coûté**... (стоить в переносном — спорно, но: la somme que ça a coûté — без согласования в норме)
## Правило 6: причастие + инфинитив
Согласуется, если COD — деятель инфинитива:
> La chanteuse que j'ai **entendue** chanter. (я слышал, как ПЕЛА певица — она поёт → согласование)
> La chanson que j'ai **entendu** chanter. (песню пели — песня не поёт → без согласования)
## en — не влияет
> Des fleurs, j'**en** ai cueilli. (без согласования с en!)`,
ex:[["Les lettres que j'ai écrites sont là.","Письма, которые я написал, здесь."],
["Elle s'est coupé le doigt.","Она порезала палец."],
["Ils se sont vus hier.","Они виделись вчера."],
["La maison que j'ai fait construire.","Дом, который я построил (заказал построить)."]],
points:["être → с подлежащим","avoir → с COD впереди","se lavée, но se lavé les mains, se sont parlé","faire + inf → никогда; en → никогда"],
quiz:[
{t:"c",q:"Les chansons que j'ai ___ (écouter).",o:["écouté","écoutées","écoutés","écoutée"],a:1,e:"COD (les chansons, ж.р. мн.) перед глаголом → écoutées."},
{t:"c",q:"Elles se sont ___ au téléphone. (parler)",o:["parlées","parlé","parlés","parle"],a:1,e:"se parler = parler À qqn — косвенное → без согласования: elles se sont parlé."},
{t:"c",q:"La robe qu'elle s'est ___ (acheter) hier.",o:["achetée","acheté","achetés","acheter"],a:0,e:"COD (la robe) перед глаголом → achetée."},
{t:"c",q:"Les valises que j'ai fait ___ (faire).",o:["faites","faire","faits","fait"],a:1,e:"faire + инфинитив — причастие faire неизменяемо."},
{t:"c",q:"Elle s'est ___ le bras. (ломать: casser)",o:["cassée","cassé","cassés","casser"],a:1,e:"Прямое дополнение (le bras) ПОСЛЕ → без согласования."}
]}
);
