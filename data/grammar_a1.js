// Грамматика A1 — Французский для Дани
window.DB = window.DB || {};
DB.grammar = DB.grammar || [];
DB.grammar.push(
{
id:"fr-overview", lv:"A1", u:1, n:1, title:"Французский язык: с чего всё начинается",
content:`## Добро пожаловать!
Французский — язык с **предсказуемым чтением**: в отличие от английского, написанное читается по правилам. Выучи правила чтения один раз — и сможешь прочитать любое слово.
## Ключевые факты
- Ударение **всегда на последнем слоге** слова (не на последнем звуке!): pa**ri**s → «пари́», mais**on** → «мэзо́н».
- Много **немых букв**: конечные -s, -x, -t, -d, -p, -z обычно не читаются: **Paris** = «пари», **vous parlez** = «ву парле».
- Носовые гласные: **an/en** = «ɑ̃», **on** = «ɔ̃», **in/un** = «ɛ̃». Это звуки «в нос».
- **Артикли** обязательны перед существительными: le, la, un, une.
- Существительные имеют **род** (мужской/женский) — учи слово сразу с артиклем: **le** livre (книга, м.), **la** table (стол... нет — стол мужского? нет: la table — ж.).
## Как учить эффективно
1. Каждое новое слово — **с артиклем** (le/un для м.р., la/une для ж.р.).
2. Каждый глагол — **с примером фразы**, а не отдельно.
3. Проходи карточки тренажёра **каждый день** — интервальное повторение решает.
4. **Проговаривай вслух** всё, что читаешь.`,
ex:[["Bonjour ! Je m'appelle Dani.","Здравствуйте! Меня зовут Даня."],
["Le français est une belle langue.","Французский — красивый язык."],
["J'apprends le français tous les jours.","Я учу французский каждый день."]],
points:["Ударение всегда на последний слог","Конечные согласные часто немые","Слово учи вместе с артиклем","3 носовых гласных: ɑ̃, ɔ̃, ɛ̃"],
quiz:[
{t:"c",q:"Где во французском слове ударение?",o:["На первом слоге","На последнем слоге","Подвижное, как в русском","На корне"],a:1,e:"Ударение всегда на последнем произносимом слоге: maison → мэ-ЗО́Н."},
{t:"c",q:"Как читается слово «Paris»?",o:["Пари́с","Па́рис","Пари́","Парис́"],a:2,e:"Конечная -s немая, ударение на последний слог: [paʁi] «пари»."},
{t:"i",q:"Переведи: «Я учу французский»",a:["j'apprends le français","j apprends le français","j'apprends le francais"],e:"J'apprends le français. Apprendre = учить, le français = французский (язык)."}
]},
{
id:"reading-rules", lv:"A1", u:1, n:2, title:"Правила чтения: читай как француз",
content:`## Буквы и звуки
- **c** перед e, i, y = «с» (ceci = «сеси»); перед a, o, u = «к» (café = «кафе»). С «хвостиком» **ç** = всегда «с»: garçon.
- **g** перед e, i, y = «ж» (rouge = «руж»); перед a, o, u = «г» (gare = «гар»).
- **h** — всегда немая: hotel = «отель» (l'hôtel).
- **j** = «ж»: je = «жё», jour = «жур».
- **s** между гласными = «з»: maison = «мэзо́н». Одна **s** на конце слова не читается.
- **x** = «кс» (six) или «гз» (examen), на конце обычно немая.
- **ch** = «ш»: chat = «ша». **gn** = «нь»: montagne = «монтань».
- **ou** = «у»: tout = «ту». **u** = «ю» (губы как для «и», звук «ю»): tu = «тю».
- **oi** = «уа»: moi = «муа». **ai** = «э». **au/eau** = «о». **eu/œu** = «ё» (нечто среднее): bleu = «блё».
## Носовые гласные
- **an, en, am, em** → «ɑ̃»: dans = «дɑ̃», vent = «вɑ̃».
- **on, om** → «ɔ̃»: bon = «бɔ̃», nom = «нɔ̃».
- **in, un, ain, ein, im** → «ɛ̃»: vin = «вɛ̃», pain = «пɛ̃».
- Если после носовой идёт гласная или ещё одна n/m — носового нет: **bon** = «бɔ̃», но **bonne** = «бон».
## Связывание (liaison)
Перед гласной немая согласная оживает: **les amis** = «лез‿ами», **vous avez** = «вуз‿аве», **il est ici** = «ил‿э‿ти́си».
## Усечение (élision)
**le, la, je, me, te, se, de, ce, que, ne** теряют гласную перед гласным звуком: **j'ai** (не je ai), **l'homme**, **c'est**.`,
ex:[["Le chat est sur la chaise.","Кот на стуле. (ша, шез — читай по правилам)"],
["Les enfants sont à l'école.","Дети в школе. (лез‿ɑ̃фɑ̃ — связывание!)"],
["J'ai un garçon et une fille.","У меня сын и дочь. (ж'э — усечение)"]],
points:["ç = всегда «с», g перед e/i/y = «ж»","ou = «у», u = «ю», oi = «уа»","Носовые: an→ɑ̃, on→ɔ̃, in→ɛ̃","Liaison: les_amis = лез-ами","j', l', c' — усечение перед гласной"],
quiz:[
{t:"c",q:"Как читается «maison»?",o:["маисон","мэзо́н","мэсон","мазо́н"],a:1,e:"ai = «э», s между гласными = «з», on = носовое ɔ̃."},
{t:"c",q:"Как читается «garçon»?",o:["гарсон","гарсо́н","жарсо́н","гарçон"],a:1,e:"ç = «с», on = носовое «ɔ̃»: [gaʁsɔ̃] «гарсо́н»."},
{t:"c",q:"«les amis» читается как...",o:["ле ами","лез‿ами","лезс ами","лэзами"],a:1,e:"Liaison: -s перед гласной = «з»."},
{t:"c",q:"Как читается «tu»?",o:["ту","тю","тё","ты"],a:1,e:"u = особый звук «ю»: губы как для «и», язык как для «у»."},
{t:"i",q:"Напиши по-французски: «У меня есть кот»",a:["j'ai un chat","j ai un chat"],e:"J'ai un chat. [ж'э œ̃ ша]"}
]},
{
id:"articles", lv:"A1", u:1, n:3, title:"Артикли: le, un, du — зачем они нужны",
content:`## Артикль — это «ярлык» существительного
В русском артиклей нет, поэтому их надо **привыкнуть ставить всегда**. Артикль показывает род и число и говорит, известен ли предмет.
## Определённый (le, la, l', les)
Предмет **известен**, конкретен, или речь о целом классе:
> Le soleil brille. — Солнце светит. (единственное в своём роде)
> Ferme la porte ! — Закрой дверь! (конкретную)
> J'aime le café. — Я люблю кофе. (вообще, как явление)
## Неопределённый (un, une, des)
Предмет **впервые упоминается**, один из многих:
> J'ai vu un chien. — Я видел собаку (какую-то).
> Il y a des livres sur la table. — На столе (какие-то) книги.
## Частичный (du, de la, de l', des)
Для **неисчисляемого** — «немного, какое-то количество»:
> Je mange **du** pain. — Я ем хлеб (какое-то количество).
> Elle boit **de la** soupe. — Она ест суп.
> Je veux **de l'**eau. — Я хочу воды.
## Важное правило
В отрицании неопределённый и частичный артикль → **de**:
> J'ai **un** chien → Je n'ai pas **de** chien.
> Je mange **du** pain → Je ne mange pas **de** pain.
(Определённый сохраняется: Je n'aime pas **le** café.)`,
ex:[["Le livre est sur la table.","Книга на столе."],
["Je veux un café.","Я хочу кофе (чашку)."],
["Je mange du fromage.","Я ем сыр."],
["Il n'y a pas de lait.","Молока нет."]],
points:["le/la/les — известное или вообще","un/une/des — новое, одно из","du/de la — неисчисляемое количество","В отрицании un/du → de"],
quiz:[
{t:"c",q:"J'aime ___ musique.",o:["une","du","la","de la"],a:2,e:"Глаголы aimer/préférer/détester требуют определённого артикля: j'aime LA musique."},
{t:"c",q:"Je mange ___ pain.",o:["un","le","de","du"],a:3,e:"Неисчисляемое количество → частичный du."},
{t:"c",q:"Je n'ai pas ___ voiture.",o:["une","de","la","de la"],a:1,e:"В отрицании неопределённый артикль → de."},
{t:"f",q:"Вставь: Il boit ___ eau. (он пьёт воду)",a:["de l'","de l"],e:"Eau начинается с гласной → частичный de l'."},
{t:"f",q:"Вставь: Ferme ___ porte ! (закрой дверь!)",a:["la"],e:"Конкретная известная дверь → la."}
]},
{
id:"nouns-gender", lv:"A1", u:1, n:4, title:"Род и число существительных",
content:`## Род
Каждое существительное — мужского (**le/un**) или женского (**la/une**) рода. Полной логики нет, но есть подсказки.
### Обычно мужские
- Дни, месяцы, сезоны: **le lundi, le janvier, l'été**
- Языки: **le français**
- Деревья: **le chêne** (дуб)
- Окончания: **-age** (le fromage), **-ment** (le monument), **-eau** (le bateau), **-isme** (le tourisme)
### Обычно женские
- Окончания: **-tion/-sion** (la nation, la télévision), **-té** (la liberté), **-ette** (la baguette... la fillette), **-ance/-ence** (la chance), **-ure** (la voiture), **-ie** (la vie)
## Число
- Обычно + **-s** (немая): livre → livres.
- **-al → -aux**: journal → journa**ux**.
- **-au/-eu → +x**: bateau → bateau**x**, jeu → jeu**x**.
- **-s, -x, -z** — не меняются: la voix → les voix.
- Особые: **œil → yeux** (глаз → глаза), **ciel → cieux**, **monsieur → messieurs**.`,
ex:[["la maison → les maisons","дом → дома"],
["le journal → les journaux","газета → газеты"],
["le bateau → les bateaux","лодка → лодки"]],
points:["Учи слово сразу с артиклем","-tion, -té, -ance, -ure — обычно ж.р.","-age, -ment, -eau — обычно м.р.","Мн.ч.: +s; -al → -aux; -eau → -eaux"],
quiz:[
{t:"c",q:"Множественное число от «le journal»:",o:["les journals","les journaux","les journales","les journeaux"],a:1,e:"-al → -aux: les journaux."},
{t:"c",q:"Какого рода «la liberté»?",o:["мужского","женского","общего","не имеет рода"],a:1,e:"Окончание -té → женский род: LA liberté."},
{t:"c",q:"Множественное от «le bateau»:",o:["les bateaus","les bateaux","les bateaues","les bateaus"],a:1,e:"-eau → -eaux: les bateaux."}
]},
{
id:"etre", lv:"A1", u:1, n:5, title:"Глагол être — быть. Личные местоимения",
content:`## Местоимения
| Кто | По-французски |
| я | je (j' перед гласной) |
| ты | tu |
| он / она / оно | il / elle / on |
| мы | nous |
| вы / Вы | vous |
| они (м.) / они (ж.) | ils / elles |
**on** — разговорное «мы» (но глагол как с il): On y va ? = Пойдём?
## être в настоящем времени (présent)
| | |
| je **suis** | [жё сюи] — я есть |
| tu **es** | [тю э] |
| il/elle **est** | [ил э] |
| nous **sommes** | [ну сом] |
| vous **êtes** | [ву зэт] |
| ils/elles **sont** | [ил сɔ̃] |
## Где используется
- Кто/что есть кто: **Je suis étudiant.** — Я студент. (профессии — БЕЗ артикля после être!)
- Состояние, качество: **Elle est fatiguée.** — Она устала.
- Местоположение: **Nous sommes à Paris.** — Мы в Париже.
- **C'est** = «это»: C'est vrai ! C'est la vie. (для мн.ч.: **ce sont**)`,
ex:[["Je suis russe.","Я русский."],
["Tu es mon ami.","Ты мой друг."],
["Elle est médecin.","Она врач."],
["Nous sommes contents.","Мы довольны."],
["C'est magnifique !","Это великолепно!"]],
points:["je suis, tu es, il est, nous sommes, vous êtes, ils sont","Профессия после être — без артикля","on = разговорное «мы»","c'est = это (ce sont = это мн.ч.)"],
quiz:[
{t:"f",q:"___ étudiant. (я студент)",a:["je suis","Je suis"],e:"Je suis étudiant."},
{t:"f",q:"Vous ___ fatigués ? (вы устали?)",a:["êtes"],e:"Vous êtes fatigués ?"},
{t:"c",q:"«Nous sommes» означает:",o:["мы есть","вы есть","они есть","он есть"],a:0,e:"Nous sommes = мы (есть)."},
{t:"f",q:"___ vrai ! (это правда)",a:["c'est","C'est"],e:"C'est vrai !"},
{t:"c",q:"Elle ___ médecin.",o:["es","suis","est","sont"],a:2,e:"Elle est (она есть)."}
]},
{
id:"avoir", lv:"A1", u:1, n:6, title:"Глагол avoir — иметь. Возраст и ощущения",
content:`## avoir в настоящем времени
| | |
| j'**ai** | [ж'э] — у меня есть |
| tu **as** | [тю а] |
| il/elle **a** | [ил а] |
| nous **avons** | [нуз‿авɔ̃] — связывание! |
| vous **avez** | [вуз‿аве] |
| ils/elles **ont** | [илз‿ɔ̃] |
⚠️ Не путай на слух: **il a** [иля] — «у него есть» и **il y a** [илья] — «имеется, есть».
## Что «имеет» француз
Возраст, голод, страх — всё через avoir (русский «мне 20 лет» = «я ИМЕЮ 20 лет»):
> J'**ai** 25 ans. — Мне 25 лет.
> Il **a** faim / soif. — Он голоден / хочет пить.
> Nous **avons** froid / chaud. — Нам холодно / жарко.
> Tu **as** peur ? — Ты боишься?
> Elle **a** raison. — Она права. (avoir raison = быть правым!)
> J'**ai** besoin de toi. — Ты мне нужен. (avoir besoin de = нуждаться)
> Qu'est-ce que tu **as** ? — Что с тобой?`,
ex:[["J'ai une voiture.","У меня есть машина."],
["Tu as quel âge ?","Сколько тебе лет?"],
["Nous avons faim.","Мы хотим есть."],
["Ils ont raison.","Они правы."]],
points:["j'ai, tu as, il a, nous avons, vous avez, ils ont","Возраст через avoir: j'ai 20 ans","avoir faim/soif/froid/peur/raison/besoin","il a ≠ il y a"],
quiz:[
{t:"f",q:"___ 30 ans. (мне 30 лет)",a:["j'ai","J'ai"],e:"J'ai 30 ans."},
{t:"c",q:"«Nous avons soif» = ",o:["Мы пьяны","Мы хотим пить","Мы спим","Мы устали"],a:1,e:"Avoir soif = хотеть пить."},
{t:"f",q:"Tu ___ raison. (ты прав)",a:["as"],e:"Avoir raison = быть правым."},
{t:"c",q:"ils ont [илз‿ɔ̃] — почему «з»?",o:["Так пишется","Связывание -t- и -n-","Это liaison между ils и ont","Ошибка"],a:2,e:"Liaison: конечная -s перед гласной даёт «з»: ils‿ont."}
]},
{
id:"verbes-er", lv:"A1", u:1, n:7, title:"Глаголы I группы (-er): parler, aimer",
content:`## Самая большая группа: ~90% глаголов
Отбрось **-er** — получишь основу, и добавляй окончания:
| parl + ... | aimer |
| je | parle [парль] |
| tu | parles [парль] |
| il/elle | parle [парль] |
| nous | parlons [парлɔ̃] |
| vous | parlez [парле] |
| ils/elles | parlent [парль] |
⚠️ Формы je/tu/il/ils звучат **одинаково** — -e, -es, -e, -ent не читаются! Различай по письму и контексту.
## Частые глаголы на -er
parler (говорить), aimer (любить), habiter (жить), travailler (работать), manger (есть), regarder (смотреть), écouter (слушать), chercher (искать), demander (спрашивать), donner (давать), penser (думать), jouer (играть), acheter (покупать), arriver (прибывать), passer (проходить), rester (оставаться), voyager (путешествовать).
## Особенность правописания
- manger: nous mange**ons** (иначе читалось бы «манжɔ̃» неправильно)
- commencer: nous commen**ç**ons
- acheter: j'ach**è**te, nous achetons
- appeler: j'appe**ll**e, nous appelons`,
ex:[["Je parle français.","Я говорю по-французски."],
["Tu habites où ?","Где ты живёшь?"],
["Nous travaillons ensemble.","Мы работаем вместе."],
["Ils regardent la télé.","Они смотрят телевизор."]],
points:["Основа = инфинитив минус -er","Окончания: -e, -es, -e, -ons, -ez, -ent","je/tu/il/ils звучат одинаково!","manger → nous mangeons; acheter → j'achète"],
quiz:[
{t:"f",q:"Elle ___ (parler) russe.",a:["parle"],e:"Elle parle russe."},
{t:"f",q:"Nous ___ (habiter) à Moscou.",a:["habitons"],e:"Nous habitons à Moscou."},
{t:"f",q:"Vous ___ (aimer) le café ?",a:["aimez"],e:"Vous aimez le café ?"},
{t:"c",q:"Как звучит «ils parlent»?",o:["иль парлент","иль парль","иль парле","иль парльон"],a:1,e:"-ent в глаголах не читается: [il paʁl]."},
{t:"f",q:"Je ___ (acheter) du pain. — j'___",a:["achète","achete"],e:"j'achète — чередование e→è."}
]},
{
id:"negation", lv:"A1", u:1, n:8, title:"Отрицание: ne ... pas и компания",
content:`## Основное отрицание: ne + глагол + pas
«Сэндвич»: глагол между **ne** и **pas**:
> Je **ne** sais **pas**. — Я не знаю.
> Il **n'**aime **pas** le café. — Он не любит кофе. (n' перед гласной)
В разговорной речи **ne выпадает**: Je sais pas. = [жё сэ па].
## Другие отрицания
- **ne ... plus** — больше не: Je **ne** fume **plus**. — Я больше не курю.
- **ne ... jamais** — никогда: Il **ne** ment **jamais**. — Он никогда не лжёт.
- **ne ... rien** — ничего: Je **ne** vois **rien**. — Я ничего не вижу.
- **ne ... personne** — никто: Il **n'**y a **personne**. — Никого нет.
- **ne ... aucun(e)** — никакой: **Aucun** problème ! (часто без ne в ответе)
- **ni ... ni** — ни...ни: Il **n'**aime **ni** le thé **ni** le café.
⚠️ С rien/jamais/personne не нужен pas: Je ne sais **rien** (не *je ne sais rien pas).
⚠️ После отрицания un/une/du → **de**: Je n'ai pas **de** temps.`,
ex:[["Je ne comprends pas.","Я не понимаю."],
["Il ne travaille plus ici.","Он здесь больше не работает."],
["Nous ne mangeons jamais de viande.","Мы никогда не едим мясо."],
["Je n'ai rien dit.","Я ничего не сказал."]],
points:["ne + глагол + pas","n' перед гласной","plus/rien/jamais/personne заменяют pas","В разговоре ne часто выпадает"],
quiz:[
{t:"f",q:"Я не знаю = Je ___ sais ___",a:["ne","pas"],e:"Je ne sais pas."},
{t:"c",q:"«Je ne fume plus» означает:",o:["Я не курю вообще","Я больше не курю","Я никогда не курил","Я курю мало"],a:1,e:"ne...plus = больше не."},
{t:"f",q:"Я ничего не вижу = Je ne vois ___.",a:["rien"],e:"Je ne vois rien."},
{t:"c",q:"«Je n'ai pas ___ argent»:",o:["d'","du","de l'","l'"],a:0,e:"После отрицания частичный → de: pas d'argent."}
]},
{
id:"questions", lv:"A1", u:1, n:9, title:"Вопрос: три способа спросить",
content:`## Способ 1: Интонация (разговорный)
Повысь голос в конце — порядок слов как в утверждении:
> Tu parles français ? — Ты говоришь по-французски?
## Способ 2: Est-ce que (нейтральный)
Добавь **est-ce que** [эс кə] в начало — порядок слов не меняется:
> **Est-ce que** tu parles français ?
## Способ 3: Инверсия (формальный)
Глагол перед подлежащим через дефис:
> **Parles-tu** français ?
> Если глагол на гласную + il/elle → вставка **-t-**: **A-t-il** raison ? (Он прав?)
## Вопросительные слова
| Кто/что | Французский |
| кто | **qui** (Qui est là ?) |
| что | **que/qu'** (Que fais-tu ?) / **qu'est-ce que** |
| где | **où** (Où vas-tu ?) |
| когда | **quand** |
| почему | **pourquoi** (ответ: **parce que**) |
| как | **comment** (Comment vas-tu ?) |
| сколько | **combien** (Combien ça coûte ?) |
| какой | **quel/quelle** (Quel âge as-tu ?) |
## Вопросы с предлогом — предлог в начале!
> **À qui** est ce livre ? — Чья это книга?
> **De quoi** parles-tu ? — О чём ты говоришь?
> **Avec qui** tu viens ? — С кем ты придёшь?`,
ex:[["Est-ce que tu viens ?","Ты придёшь?"],
["Parles-tu russe ?","Ты говоришь по-русски?"],
["Où habites-tu ?","Где ты живёшь?"],
["Comment ça va ?","Как дела?"],
["Pourquoi pas ?","Почему бы и нет?"]],
points:["3 способа: интонация / est-ce que / инверсия","Инверсия — формальный стиль","A-t-il...? — вставка -t-","Предлог всегда впереди: De quoi...? À qui...?"],
quiz:[
{t:"c",q:"Самый формальный способ задать вопрос:",o:["интонация","est-ce que","инверсия","все равны"],a:2,e:"Инверсия (Parlez-vous...?) — формальный регистр."},
{t:"f",q:"___ ça coûte ? (сколько это стоит?)",a:["combien","Combien"],e:"Combien ça coûte ?"},
{t:"c",q:"«A-t-il raison ?» — зачем здесь -t-?",o:["Это часть глагола","Для благозвучия между гласными","Это предлог","Опечатка"],a:1,e:"Между il и гласной формой вставляется -t- для благозвучия."},
{t:"f",q:"___ tu viens ? — Avec Marie. (с кем ты придёшь?)",a:["avec qui","Avec qui"],e:"Avec qui tu viens ?"}
]},
{
id:"numbers-time", lv:"A1", u:1, n:10, title:"Числа, время, даты",
content:`## Числа — французская «арифметика»
0 zéro, 1 un, 2 deux, 3 trois, 4 quatre, 5 cinq [сɛ̃к], 6 six [сис], 7 sept [сет], 8 huit [ɥит], 9 neuf, 10 dix [дис].
11 onze, 12 douze, 13 treize, 14 quatorze, 15 quinze, 16 seize, 17 dix-sept, 18 dix-huit, 19 dix-neuf, 20 vingt.
21 = vingt-**et**-un (21 «и один»), 22 = vingt-deux... 30 trente, 40 quarante, 50 cinquante, 60 soixante.
**70 = soixante-dix** (60+10!), 71 = soixante-et-onze, 79 = soixante-dix-neuf.
**80 = quatre-vingts** (4×20!), 81 = quatre-vingt-un (без et!), 90 = quatre-vingt-dix, 99 = quatre-vingt-dix-neuf.
100 cent, 200 deux cents (с -s!), 201 deux cent un. 1000 mille (неизменяемо!).
## Время
> Quelle heure est-il ? — Который час?
> Il est **trois heures**. — Три часа. (heure всегда во мн.ч. после 1... нет: il est **une** heure — один час)
> Il est **midi** (12:00) / **minuit** (00:00) — не «douze heures»!
> Il est trois heures **et demie** — половина четвёртого (букв. «три часа и половина»)
> Il est trois heures **moins le quart** — без четверти три
> Il est midi **dix** — 12:10
> **du matin** (утра) / **de l'après-midi** (дня) / **du soir** (вечера)
## Даты
> Quel jour sommes-nous ? — Какой сегодня день?
> Nous sommes **lundi**. / On est lundi.
> Quelle est la date ? — Какое число?
> Nous sommes **le 5 mai**. (первое число — **le premier**: le 1er mai)
Дни недели и месяцы — с **маленькой буквы**!`,
ex:[["Il est huit heures du matin.","Восемь часов утра."],
["J'ai vingt-sept ans.","Мне 27 лет."],
["Nous sommes le premier mars.","Сегодня первое марта."],
["Ça fait cinquante euros.","Это будет пятьдесят евро."]],
points:["70 = 60+10, 80 = 4×20, 90 = 80+10","21 = vingt-ET-un, но 81 = quatre-vingt-un","Il est ... heures — который час","midi/minuit — особые слова","Дни недели — с маленькой буквы"],
quiz:[
{t:"c",q:"Как будет 75?",o:["septante-cinq","soixante-quinze","soixante-cinq-vingt","sept-cinq"],a:1,e:"75 = 60+15 = soixante-quinze."},
{t:"c",q:"91 = ",o:["nonante-un","quatre-vingt-onze","quatre-vingt-et-onze","nonante-et-un"],a:1,e:"91 = 80+11 = quatre-vingt-onze (без et!)."},
{t:"c",q:"«12:00» — это:",o:["douze heures","midi","minuit","midi douze"],a:1,e:"Полдень = midi, полночь = minuit."},
{t:"f",q:"Il est trois heures ___ (половина четвёртого)",a:["et demie"],e:"trois heures et demie = 3:30."}
]},
{
id:"possessifs", lv:"A1", u:1, n:11, title:"Притяжательные прилагательные: mon, ton, son...",
content:`## Таблица
| Мой | Твой | Его/её | Наш | Ваш | Их |
| **mon/ma/mes** | **ton/ta/tes** | **son/sa/ses** | **notre** | **votre** | **leur** |
| мн.ч. | **mes** | **tes** | **ses** | **nos** | **vos** | **leurs** |
⚠️ **son/sa** зависит от рода ВЛАДЕЛЬЦА или предмета? — От рода **предмета**, а не владельца:
> Marie aime **son** père et **sa** mère. — Мари любит своего папу (son, т.к. père м.р.) и свою маму (sa).
⚠️ Перед словом ж.р. на гласную — **mon/ton/son**: **mon** amie (не *ma amie), **ton** école.
## Чей? — C'est à qui ?
> C'est **à moi** / **à toi** / **à lui** / **à elle** / **à nous** / **à vous** / **à eux**.
> Ce livre est **à moi**. — Эта книга моя.
## Moi, toi... — ударные местоимения
moi (я), toi (ты), lui (он), elle (она), nous, vous, eux (они м.), elles (они ж.).
> Et **toi** ? — А ты?
> **Moi**, je suis d'accord. — Я (что касается меня) согласен.`,
ex:[["C'est mon livre.","Это моя книга."],
["Voici ma sœur.","Вот моя сестра."],
["Ils aiment leur chien.","Они любят свою собаку."],
["Mon amie est russe.","Моя подруга русская."]],
points:["mon/ma/mes — по роду и числу ПРЕДМЕТА","mon amie — перед ж.р. на гласную","C'est à moi = это моё","ударные: moi, toi, lui, elle, nous, vous, eux"],
quiz:[
{t:"f",q:"___ amie est française. (моя подруга француженка)",a:["mon","Mon"],e:"Перед ж.р. на гласную — mon: mon amie."},
{t:"c",q:"Marie parle avec ___ père. (со своим отцом)",o:["sa","son","ses","leur"],a:1,e:"père — м.р. → son, независимо от того, что владелец — Мари."},
{t:"c",q:"«Ce sac est à ___» — это МОЯ сумка:",o:["moi","me","je","mon"],a:0,e:"C'est à moi = это моё."},
{t:"f",q:"___ parents sont gentils. (мои родители добрые)",a:["mes","Mes"],e:"Мн.ч. → mes."}
]},
{
id:"demonstratifs", lv:"A1", u:1, n:12, title:"Указательные: ce, cette, ces + вот/вон то",
content:`## ce / cet / cette / ces
| ce + м.р. согласный | ce livre — эта книга |
| **cet** + м.р. гласная/h | **cet** homme, **cet** ami |
| **cette** + ж.р. | **cette** femme |
| **ces** + мн.ч. | **ces** livres |
## «Вот этот» vs «вон тот»: -ci и -là
Приставляются **через дефис к существительному**:
> Ce livre-**ci** est intéressant. — ЭТА (вот эта) книга интересная.
> Cette voiture-**là** est chère. — ВОН ТА машина дорогая.
## Ça / cela / ceci
- **Ça** (разг.) = это: **Ça va ?** — Как дела? **J'aime ça.** — Мне это нравится.
- **Cela** — формальное «это»; **ceci** — «вот это».
- **C'est** + сущ./прил.: C'est **un** livre. C'est **beau**. (единственное)
- **Ce sont** + мн.: Ce sont **mes** amis.`,
ex:[["Regarde cette photo !","Посмотри на это фото!"],
["Cet hôtel est magnifique.","Этот отель великолепен."],
["Je préfère ces chaussures-ci.","Я предпочитаю вот эти туфли."],
["C'est mon frère.","Это мой брат."]],
points:["ce/cet/cette/ces","cet перед м.р. на гласную","-ci = вот этот, -là = вон тот","Ça va ? — как дела"],
quiz:[
{t:"f",q:"___ homme est grand. (этот мужчина высокий)",a:["cet","Cet"],e:"Homme — м.р. на гласную (h немая) → cet."},
{t:"c",q:"«Вон та сумка»:",o:["Ce sac-ci","Ce sac-là","Cette sac-là","Ces sac-là"],a:1,e:"Sac — м.р., «вон та» = -là: ce sac-là."},
{t:"c",q:"Ce sont ...",o:["mon ami","mes amis","ma amie","moi ami"],a:1,e:"Ce sont + множественное: mes amis."}
]},
{
id:"prepositions-lieu", lv:"A1", u:1, n:13, title:"Предлоги места: где, куда, откуда",
content:`## Основные
- **à** — у, в, на (точка/город): à Paris, à la gare, à côté de
- **dans** — внутри (с артиклем): **dans** la boîte — в коробке
- **sur** — на (поверхности): sur la table
- **sous** — под: sous le lit
- **devant** — перед: devant la maison
- **derrière** — позади: derrière l'arbre
- **entre** — между: entre toi et moi
- **chez** — у (кого-то): chez moi — у меня дома, chez le médecin — у врача
- **près de** — рядом с; **loin de** — далеко от
- **en face de** — напротив
- **à côté de** — рядом с
## Куда? / Откуда? / Где?
> **Où** vas-tu ? — Куда? → Je vais **à** la piscine.
> **D'où** viens-tu ? — Откуда? → Je viens **de** Russie.
> **Où** es-tu ? — Где? → Je suis **dans** le jardin.
## Глаголы движения
- **aller à** — идти/ехать в: Je vais au cinéma. (à+le = **au**, à+les = **aux**)
- **venir de** — приходить из: Il vient du bureau. (de+le = **du**)
- **être à / dans** — находиться`,
ex:[["Le chat est sous la table.","Кот под столом."],
["Je vais à Paris.","Я еду в Париж."],
["Elle vient de Moscou.","Она из Москвы."],
["Nous sommes chez Paul.","Мы у Поля."]],
points:["dans = внутри, sur = на поверхности","chez = у кого-то дома","à+le=au, de+le=du, à+les=aux","aller à / venir de"],
quiz:[
{t:"f",q:"Je vais ___ cinéma. (я иду в кино)",a:["au"],e:"à + le = au cinéma."},
{t:"f",q:"Il vient ___ bureau. (он из офиса)",a:["du"],e:"de + le = du bureau."},
{t:"c",q:"«У меня дома» = ",o:["à ma maison","chez moi","dans moi","chez je"],a:1,e:"Chez moi."},
{t:"c",q:"Книга «на столе»:",o:["sous la table","dans la table","sur la table","devant la table"],a:2,e:"Sur = на поверхности."}
]},
{
id:"pays-villes", lv:"A1", u:1, n:14, title:"Страны и города: en France, au Japon, à Paris",
content:`## Города — всегда «à»
> Je vais **à** Paris / **à** Moscou / **à** New York.
> J'habite **à** Lyon.
## Страны женского рода (на -e) → en
**en** France, **en** Russie, **en** Espagne, **en** Chine, **en** Italie, **en** Allemagne.
> Je vais **en** France. Je viens **de** France. (из)
## Страны мужского рода → au
**au** Portugal, **au** Japon, **au** Canada, **au** Brésil, **au** Maroc.
> Je vais **au** Japon. Je viens **du** Japon.
## Мн.ч. → aux
**aux** États-Unis, **aux** Pays-Bas.
> Je vais **aux** États-Unis. Je viens **des** États-Unis.
## Особые
**en** Ukraine (ж.), **au** Yémen (м.), **à** Chypre / **à** Malte / **à** Cuba (острова-города... на деле: à Cuba, à Chypre).
⚠️ В отрицании и с venir: **de** + страна = je ne viens pas **de** France.`,
ex:[["J'habite en Russie.","Я живу в России."],
["Il va au Canada.","Он едет в Канаду."],
["Nous venons des États-Unis.","Мы из США."],
["Elle est à Paris.","Она в Париже."]],
points:["Города: à Paris","Страны на -e (ж.): en France","Страны м.: au Japon","Мн.ч.: aux États-Unis","venir de: je viens de Russie / du Japon"],
quiz:[
{t:"f",q:"Je vais ___ France. (я еду во Францию)",a:["en"],e:"France — ж.р. на -e → en."},
{t:"f",q:"Il habite ___ Japon. (он живёт в Японии)",a:["au"],e:"Japon — м.р. → au."},
{t:"f",q:"Nous venons ___ États-Unis. (мы из США)",a:["des"],e:"Мн.ч. → des États-Unis."},
{t:"f",q:"Je vais ___ Moscou. (я еду в Москву)",a:["à"],e:"Города всегда с à."}
]},
{
id:"adjectifs", lv:"A1", u:1, n:15, title:"Прилагательные: род, число, место",
content:`## Согласование
Прилагательное подстраивается под существительное:
- ж.р.: обычно + **-e**: petit → petit**e**; если уже на -e — без изменений: riche (м. и ж.)
- мн.ч.: + **-s**: petit → petits
- Особые: **-f → -ve** (actif/active), **-x → -se** (heureux/heureuse), **-er → -ère** (cher/chère), **-c → -che** (blanc/blanche)
- beau → bel (перед м.р. на гласную: **bel** homme), nouveau → nouvel, vieux → vieil
## Место: ДО или ПОСЛЕ?
### Перед существительным (короткие, частые, оценочные)
Запомни **BAGS**: **B**eauty (beau, joli), **A**ge (jeune, vieux, nouveau), **G**oodness (bon, mauvais, gentil), **S**ize (grand, petit, gros).
> un **grand** homme — великий человек (но: un homme **grand** — высокого роста!)
### После (всё остальное)
Цвета, формы, национальности, материал, причастия:
> une voiture **rouge**, un film **intéressant**, une femme **russe**.
⚠️ **Смена места меняет смысл**: mon **ancien** prof = мой бывший учитель; un immeuble **ancien** = старинное здание.`,
ex:[["La maison est grande.","Дом большой."],
["C'est une belle femme.","Это красивая женщина."],
["Il est heureux.","Он счастлив. (heureux → ж.р. heureuse)"],
["J'ai un nouvel appartement.","У меня новая квартира."]],
points:["ж.р. +e, мн.ч. +s","BAGS перед сущ.: красота, возраст, качество, размер","Цвета/формы — после","bel/nouvel/vieil перед гласной"],
quiz:[
{t:"f",q:"Elle est ___ (heureux).",a:["heureuse"],e:"heureux → ж.р. heureuse."},
{t:"c",q:"«Красивый мужчина» (перед гласной):",o:["un beau homme","un bel homme","un belle homme","un bon homme"],a:1,e:"beau → bel перед м.р. на гласную."},
{t:"c",q:"Которое стоит ПОСЛЕ существительного?",o:["grand","petit","rouge","bon"],a:2,e:"Цвета — после: une voiture rouge."},
{t:"f",q:"Ce sont des fleurs ___ (blanc, ж.р. мн.ч.)",a:["blanches"],e:"blanc → blanche → blanches."}
]},
{
id:"futur-proche", lv:"A1", u:1, n:16, title:"Ближайшее будущее: aller + инфинитив",
content:`## Futur proche — «собираться сделать»
Формула: **aller (в настоящем) + инфинитив**:
> Je **vais manger**. — Я (сейчас) буду есть / собираюсь поесть.
> Nous **allons partir**. — Мы скоро уедем.
> Qu'est-ce que tu **vas faire** ce soir ? — Что ты будешь делать сегодня вечером?
## Когда использовать
Для планов и действий **в ближайшем будущем**, особенно в разговорной речи. Часто заменяет futur simple:
> Demain, je **vais** au musée. (завтра я иду в музей — уже решено)
## Сравнение
- **Futur proche** (vais faire): ближайшее, решённое → «сейчас сделаю»
- **Futur simple** (ferai — урок A2): вообще будущее → «когда-нибудь сделаю»
## Отрицание — вокруг aller!
> Je **ne** vais **pas** manger. — Я не буду есть. (не *je vais ne pas manger)`,
ex:[["Je vais regarder un film.","Я собираюсь посмотреть фильм."],
["On va être en retard !","Мы опоздаем!"],
["Tu vas voir !","Увидишь!"]],
points:["aller + инфинитив","Ближайшее решённое будущее","Отрицание вокруг aller: je ne vais pas + inf"],
quiz:[
{t:"f",q:"Je ___ ___ (aller + partir). — Я скоро уезжаю.",a:["vais partir"],e:"Je vais partir."},
{t:"f",q:"Отрицание: Мы не будем смотреть ТВ = Nous ___ ___ ___ regarder la télé.",a:["n'allons pas"],e:"Nous n'allons pas regarder la télé."},
{t:"c",q:"«Je vais manger» — что это значит?",o:["Я ем","Я собираюсь есть","Я ел","Я ел бы"],a:1,e:"Futur proche = ближайшее будущее/намерение."}
]},
{
id:"passe-recent", lv:"A1", u:1, n:17, title:"Ближайшее прошлое: venir de + инфинитив",
content:`## Passé récent — «только что сделал»
Формула: **venir de + инфинитив**:
> Je **viens de manger**. — Я только что поел.
> Elle **vient de sortir**. — Она только что вышла.
> Nous **venons d'**arriver. — Мы только что приехали. (de → d' перед гласной)
## venir в настоящем (напоминание)
je viens, tu viens, il vient, nous venons, vous venez, ils viennent.
⚠️ viens/vient звучат [вьɛ̃], viennent = [вьен] (двойное n!).
## Сочетание с futur proche
> Je **vais venir de** ... — редко. Зато:
> Il **vient de** téléphoner et il **va** rappeler. — Он только что звонил и перезвонит.`,
ex:[["Je viens de finir.","Я только что закончил."],
["Ils viennent d'acheter une maison.","Они только что купили дом."],
["Tu viens de rater le bus !","Ты только что опоздал на автобус!"]],
points:["venir de + inf = только что сделал","de → d' перед гласной","viennent = [вьен]"],
quiz:[
{t:"f",q:"Она только что вышла = Elle ___ ___ sortir.",a:["vient de"],e:"Elle vient de sortir."},
{t:"f",q:"Мы только что приехали = Nous ___ ___ arriver.",a:["venons d'"],e:"Venons d'arriver — усечение перед гласной."},
{t:"c",q:"«Je viens de manger» = ",o:["Я приду поесть","Я только что поел","Я приезжаю есть","Я ем регулярно"],a:1,e:"Passé récent."}
]},
{
id:"impératif-a1", lv:"A1", u:1, n:18, title:"Повелительное наклонение: делай!",
content:`## Три формы: tu, nous, vous — БЕЗ местоимения
| tu | parle ! (говори!) | finis ! (закончи!) | attends ! (жди!) |
| **nous** | parlons ! (давайте говорить!) | finissons ! | attendons ! |
| **vous** | parlez ! (говорите!) | finissez ! | attendez ! |
⚠️ В форме **tu** глаголов на **-er** (и ouvrir/offrir) конечное **-s отпадает**: parle! (но: **Vas-y!** — исключение, s возвращается перед y).
## Особые
- être: **sois, soyons, soyez**
- avoir: **aie, ayons, ayez**
- savoir: **sache...**; vouloir: **veuillez** (вежливое «соблаговолите»)
## Отрицание
> **Ne** parle **pas** ! — Не говори!
> **Ne** vous inquiétez **pas** ! — Не беспокойтесь!
## Местоимения в приказе
- Отрицание — перед глаголом: **Ne me regarde pas.**
- Утверждение — после, через дефис, me→moi, te→toi: **Regarde-moi !** **Donne-le-moi !** **Allons-y !**`,
ex:[["Écoute-moi !","Послушай меня!"],
["Allons au cinéma !","Пойдём в кино!"],
["Ne touchez pas !","Не трогать!"],
["Fais tes devoirs !","Делай уроки!"]],
points:["3 формы: tu/nous/vous без местоимения","-s отпадает у -er: Parle!","être: sois/soyons/soyez","Утвердительно: Regarde-moi! (toi!)"],
quiz:[
{t:"f",q:"Говори! (parler, tu) = ___ !",a:["parle"],e:"Parle ! — без -s у глаголов I группы."},
{t:"f",q:"Будьте добры (вежл. от vouloir) = ___ !",a:["veuillez"],e:"Veuillez vous asseoir = будьте добры, садитесь."},
{t:"c",q:"«Не волнуйся!» (ты):",o:["Ne t'inquiète pas","Ne vous inquiétez pas","N'inquiète pas","Ne t'inquiètes pas"],a:0,e:"Ne t'inquiète pas !"},
{t:"c",q:"«Идём туда!» (Aller + y):",o:["Allons-là","Allons-y","Va-y","Allons à là"],a:1,e:"Allons-y ! [алɔ̃-зи]"}
]},
{
id:"tu-vous", lv:"A1", u:1, n:19, title:"Tu или vous? Этикет общения",
content:`## Tu — «ты»
Друзья, семья, дети, ровесники в неформальной обстановке, студенты между собой.
## Vous — «вы»
Несколько человек (всегда), один незнакомый/старший/официальный человек.
## Как перейти на «ты»?
> **On peut se tutoyer ?** — Можно на «ты»?
> **Tutoie-moi !** — Говори мне «ты»!
## Базовые формулы вежливости
> **Bonjour** (днём) / **Bonsoir** (вечером) — обязательное приветствие при входе в магазин, лифт, к врачу!
> **Comment allez-vous ?** (форм.) / **Ça va ?** (неформ.) — Как вы? / Как дела?
> **Très bien, merci. Et vous ?** — Очень хорошо, спасибо. А вы?
> **S'il vous plaît / s'il te plaît** — пожалуйста
> **Merci (beaucoup)** — спасибо
> **De rien / Je vous en prie** (форм.) — не за что
> **Pardon / Excusez-moi / Désolé(e)** — извините
> **Au revoir** — до свидания
⚠️ Французы придают Bonjour огромное значение: войти в магазин без bonjour — грубость.`,
ex:[["Bonjour madame, comment allez-vous ?","Здравствуйте, мадам, как вы?"],
["Salut ! Ça va ?","Привет! Как дела?"],
["Merci beaucoup ! — Je vous en prie.","Большое спасибо! — Не за что."]],
points:["vous — мн.ч. или вежливость","On peut se tutoyer ? — предложение перейти на ты","Bonjour обязательно при входе","Je vous en prie — формальное «не за что»"],
quiz:[
{t:"c",q:"К продавцу в магазине обратишься:",o:["tu","vous","on","как хочу"],a:1,e:"К незнакомым людям — vous."},
{t:"c",q:"«Comment ça va ?» — это:",o:["формальный вопрос о здоровье","неформальное «как дела?»","прощание","благодарность"],a:1,e:"Ça va ? — неформальное «как дела?»."},
{t:"c",q:"Вежливый ответ на «Merci» (формально):",o:["De rien","Je vous en prie","Salut","Pardon"],a:1,e:"Je vous en prie — формально; de rien — нейтрально/разговорно."}
]}
);
