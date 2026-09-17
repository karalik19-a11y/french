// Грамматика B2/C1 — Французский для Дани
window.DB = window.DB || {};
DB.grammar = DB.grammar || [];
DB.grammar.push(
{
id:"passe-simple", lv:"B2", u:4, n:1, title:"Passé simple — литературное прошедшее",
content:`## Зачем нужно
В разговорной речи НЕ используется — но **вся классическая литература** (Гюго, Мопассан, Бальзак, Дюма, Камю...) написана в passé simple. Без него нельзя читать французские книги. Функция та же, что у passé composé: завершённое событие.
## Образование
### I группа (-er): окончания -ai, -as, -a, -âmes, -âtes, -èrent
> parler: je parl**ai**, tu parl**as**, il parl**a**, nous parl**âmes**, vous parl**âtes**, ils parl**èrent**
### II и III группы: -is, -is, -it, -îmes, -îtes, -irent
> finir: je fin**is**, il fin**it**, ils fin**irent**
> partir: je part**is**; venir: je v**ins**, nous v**înmes**, ils v**inrent**; prendre: je pr**is**; mettre: je m**is**; faire: je f**is**; dire: je d**is**; écrire: j'écriv**is**; lire: je l**us**; voir: je v**is**; pouvoir: je p**us**; savoir: je s**us**; vouloir: je voul**us**; devoir: je d**us**; boire: je b**us**; croire: je cr**us**; connaître: je conn**us**; naître: je naqu**is**; mourir: je mour**us**; courir: je cour**us**
### Особые (от «у»-основы)
- être: je **fus**, tu fus, il fut, nous **fûmes**, vous fûtes, ils **furent**
- avoir: j'**eus**, tu eus, il eut, nous **eûmes**, vous eûtes, ils **eurent**
- aller: j'**allai** (регулярно, как -er!)
## Маркеры
il naquit (родился), il mourut (умер), soudain (вдруг), alors, puis, ce jour-là, en 1789...
## Пример из Мопассана (стиль)
> « Elle **regarda** autour d'elle, puis elle **s'assit** et **se mit** à pleurer. »
> Она огляделась, затем села и заплакала.`,
ex:[["Il naquit à Paris en 1802.","Он родился в Париже в 1802."],
["Elle prit son manteau et sortit.","Она взяла пальто и вышла."],
["Nous fûmes surpris.","Мы были удивлены."],
["Ils allèrent à la chasse.","Они отправились на охоту."]],
points:["Книжное время: читать литературу обязательно","-er: -ai/-as/-a/-âmes/-âtes/-èrent","остальные: -is/-is/-it/-îmes/-îtes/-irent","être: fus; avoir: eus; venir: vins; faire: fis; voir: vis"],
quiz:[
{t:"f",q:"Он родился = Il ___ (naître, p. simple)",a:["naquit"],e:"Naquit — от особой основы naqu-."},
{t:"f",q:"Я увидел = Je ___ (voir, p. simple)",a:["vis"],e:"Voir → je vis (не путать с «je vis» = живу! Контекст решает)."},
{t:"f",q:"Мы были = Nous ___ (être)",a:["fûmes"],e:"Être → nous fûmes."},
{t:"c",q:"Passé simple используется...",o:["в разговорной речи","в литературе и истории","в письмах друзьям","везде"],a:1,e:"Книжно-историческое время."},
{t:"f",q:"Они сделали = Ils ___ (faire)",a:["firent"],e:"Faire → ils firent."}
]},
{
id:"subjonctif-passe-imparfait", lv:"B2", u:4, n:2, title:"Subjonctif passé и imparfait — высший пилотаж",
content:`## Subjonctif passé: subjonctif от avoir/être + participe passé
Выражает **предшествующее** действие в субжонктивной зоне:
> Je suis content que tu **sois venu**. — Я рад, что ты пришёл (раньше).
> Bien qu'il **ait plu**, nous sommes sortis. — Хоть и шёл дождь...
> Je ne crois pas qu'elle **ait menti**.
Согласование как в passé composé: elle soit venu**e**, ils soient partis.
## Subjonctif imparfait — чисто литературное
Встретишь в классике; самому строить почти не нужно, но **узнавать обязательно**:
Форма: основа passé simple + **-sse, -sses, -^t, -ssions, -ssiez, -ssent**
> parler (il parla): qu'il parl**ât**
> finir (il finit): qu'il fin**ît**
> venir (il vint): qu'il v**înt**
> être (il fut): qu'il **fût**
> avoir (il eut): qu'il **eût**
> faire (il fit): qu'il **fît**; pouvoir (il put): qu'il p**û**t; savoir: qu'il **sû**t; voir: qu'il **vî**t... (vît); vouloir: qu'il voul**û**t; aller: qu'il all**â**t
⚠️ 3-е лицо ед.ч. ВСЕГДА с «шапочкой»: parl**â**t, v**î**nt, f**û**t, f**î**t — самый надёжный опознавательный знак!
## Subjonctif plus-que-parfait (сверхкнижное)
> Bien qu'il **eût su** la vérité, il se tut. — Хотя он и знал правду...
(imparfait subj. от avoir/être + participe passé)
## Concordance des temps в субжонктиве (классика)
- Главное в présent → subjonctif **présent/passé**
- Главное в прошедшем → в классике subjonctif **imparfait/plus-que-parfait**:
> Il fallait qu'il **vînt**. (классика) = Il fallait qu'il **vienne**. (современно)`,
ex:[["Je doute qu'il ait compris.","Сомневаюсь, что он понял."],
["Quoiqu'elle fût fatiguée, elle souriait.","Хоть она и устала, она улыбалась."],
["Il fallait que nous partissions.","(книжн.) Надо было, чтобы мы ушли."]],
points:["Subj. passé: aie/sois + pp — предшествование","Subj. imparfait: основа passé simple + sse... -^t с шапочкой","qu'il fût, qu'il vînt, qu'il parlât — маркеры классики","Plus-que-parfait subj.: eût/fût + pp"],
quiz:[
{t:"c",q:"«qu'il vînt» — это:",o:["passé simple","subjonctif imparfait","conditionnel","indicatif imparfait"],a:1,e:"Шапочка + -t = subjonctif imparfait от venir."},
{t:"f",q:"Я рад, что ты пришёл = Je suis content que tu ___ venu.",a:["sois"],e:"Subjonctif passé: sois venu."},
{t:"c",q:"Subjonctif imparfait от être (3 л. ед.ч.):",o:["qu'il était","qu'il fût","qu'il soit","qu'il eût"],a:1,e:"Être → qu'il fût."},
{t:"c",q:"«Bien qu'il eût su» — eût su это:",o:["subj. passé","subj. plus-que-parfait","conditionnel passé","passé antérieur"],a:1,e:"Subjonctif plus-que-parfait (eût + pp)."},
{t:"c",q:"В современном языке «Il fallait qu'il vînt» заменяют на:",o:["qu'il venait","qu'il vienne","qu'il viendra","qu'il vint"],a:1,e:"Современно: subjonctif présent — qu'il vienne."}
]},
{
id:"ne-expletif", lv:"B2", u:4, n:3, title:"«Лишнее» ne и тонкости отрицания",
content:`## Ne explétif — не отрицание!
Формальное **ne**, которое ничего не отрицает. Встречается после:
### 1. avant que / à moins que
> Pars **avant qu'**il **ne** soit trop tard. — Уходи, пока не поздно. (смысл: пока ПОЗДНО НЕ стало)
> Je viendrai, **à moins qu'**il **ne** pleuve. — Я приду, если только не будет дождя.
### 2. После глаголов боязни (craindre, avoir peur) — в утвердительной форме
> Je crains qu'il **ne** vienne. — Боюсь, как бы он не пришёл. (= боюсь, что он ПРИДЁТ!)
> Je crains qu'il **ne** vienne pas. — Боюсь, что он НЕ придёт. (с pas = настоящее отрицание)
⚠️ Ключ к пониманию классики!
### 3. В сравнениях «чем» (формально)
> Il est plus grand que je **ne** pensais. — Он выше, чем я думал.
### 4. После depuis que / il y a longtemps que — нет, это другое. После «cela fait... que» отрицание исчезает: Il y a longtemps que je ne l'ai vu (форм.) = давно его не видел.
## Ne ... que = ТОЛЬКО
> Je **n'**ai **que** dix euros. — У меня (есть) только десять евро.
> Il **ne** mange **que** des légumes. — Он ест только овощи.
## Двойное отрицание (литературное)
- **ne ... ni ... ni**: Il **ne** boit **ni** vin **ni** bière.
- **ne ... aucun**: **Aucun** doute. (никакого сомнения)
- **ne ... nul** (книжн.): Nul **n'**est censé ignorer la loi. — Никто не вправе не знать закон.
- **ne ... guère** (книжн. «едва»): Il **ne** travaille **guère**. — Он почти не работает.
- **ne ... point** (архаичн./лит.): Je **ne** sais **point**.
## Ni... ni без ne в коротких ответах; «non plus» = тоже не
> Je n'aime pas le café. — Moi **non plus**. — Я тоже.`
,
ex:[["Je crains qu'il ne soit malade.","Боюсь, он болен (как бы не заболел)."],
["Je n'ai que cinq minutes.","У меня только пять минут."],
["Il travaille plus que je ne le pensais.","Он работает больше, чем я думал."]],
points:["ne explétif после avant que/à moins que/глаголов боязни — НЕ отрицает","Je crains qu'il ne vienne = боюсь, что он придёт","ne...que = только","guère = едва (книжн.), nul = никакой"],
quiz:[
{t:"c",q:"«Je crains qu'il ne pleuve» означает:",o:["Боюсь, что дождя не будет","Боюсь, как бы не пошёл дождь (= что пойдёт)","Не боюсь дождя","Дождь не идёт"],a:1,e:"Ne explétif после craindre — утвердительный смысл: боюсь, что ПОЙДЁТ."},
{t:"c",q:"«Il n'a que deux amis» = ",o:["У него нет друзей","У него только два друга","У него два друга","У него много друзей"],a:1,e:"ne...que = только."},
{t:"c",q:"«Il ne travaille guère» = ",o:["Он много работает","Он почти не работает","Он не работает вообще","Он хорошо работает"],a:1,e:"Guère = едва ли, почти не (книжн.)."},
{t:"f",q:"Уходи, пока не поздно = Pars avant qu'il ___ soit trop tard. (с ne explétif)",a:["ne"],e:"Avant que + ne explétif (формально): avant qu'il ne soit trop tard."}
]},
{
id:"mise-relief", lv:"B2", u:4, n:4, title:"Выделение и эмфаза: c'est... qui, дислокация",
content:`## C'est ... qui/que — рамочное выделение
> **C'est** Paul **qui** a téléphoné. — Звонил именно ПОЛЬ. (подлежащее)
> **C'est** un livre **que** je veux. — Хочу именно КНИГУ. (дополнение)
> **C'est** demain **que** je pars. — Уезжаю именно ЗАВТРА.
> **C'est** à Paris **que** cela s'est passé. — Это произошло именно в Париже.
⚠️ Согласование: **C'est** moi **qui** **ai** raison (qui → по moi → 1-е лицо!). **C'est** vous **qui** **avez**...
⚠️ Мн.ч.: **Ce sont** eux qui l'ont fait (формально; в речи «c'est eux»).
## Дислокация — душа французской речи!
Тема выносится ВПЕРЕД или ВНАЗАД с повтором местоимением:
> **Moi**, je suis d'accord. — Я-то согласен.
> **Le français**, je l'adore. — Французский — обожаю его.
> C'est formidable, **ce film** ! — Здоровский фильм, этот!
> **Paul**, il est parti. — Поль-то ушёл.
## Autres приёмы эмфазы
- **Voilà/Voici + сущ.**: **Voilà** pourquoi ! — Вот почему!
- **Quant à** (что касается): **Quant à** moi, je reste.
- **Ce qui ... c'est ...**: **Ce qui** m'étonne, **c'est** son silence. — Что удивляет — это его молчание.
- **Ce que je veux, c'est...** — Чего я хочу, так это...
- **Il n'y a que ... pour / Il n'y a pas de ... sans**: Il n'y a pas de fumée sans feu.
- **Est-ce que / c'est que**: Ce n'est pas que je sois paresseux, mais... — Не то чтобы я ленив, но... (subj после «ce n'est pas que»!)`,
ex:[["C'est toi qui as raison.","Прав именно ты."],
["Ce qui compte, c'est la santé.","Главное — здоровье."],
["Moi, je n'en sais rien.","Я-то ничего об этом не знаю."],
["C'est hier que je l'ai vu.","Я видел его именно вчера."]],
points:["C'est + выделенное + qui (подл.) / que (доп.)","C'est moi qui ai... (согласование по выделенному)","Дислокация: Le français, je l'adore","Ce qui... c'est... — рамка темы"],
quiz:[
{t:"c",q:"«Звонил именно Поль»:",o:["C'est Paul qu'a téléphoné","C'est Paul qui a téléphoné","C'est téléphoné par Paul","C'est Paul a téléphoné"],a:1,e:"Выделение подлежащего → qui."},
{t:"c",q:"C'est moi qui ___ raison.",o:["ai","a","ait","as"],a:0,e:"Qui согласуется с moi → 1-е лицо: j'ai → ai."},
{t:"c",q:"«Французский — я его обожаю»:",o:["Le français, je l'adore","J'adore le français, moi le","Le français, j'adore le","C'est le français adore"],a:0,e:"Классическая дислокация."},
{t:"c",q:"«Что меня удивляет — это его молчание»:",o:["Ce qui m'étonne, c'est son silence","Ce que m'étonne, c'est son silence","Qui m'étonne, c'est son silence","Ce qui m'étonne est son silence que"],a:0,e:"Ce qui (подлежащее) ... c'est ..."}
]},
{
id:"style-registres", lv:"B2", u:4, n:5, title:"Три регистра: разговорный, нейтральный, книжный",
content:`## Одно и то же — тремя способами
| Разговорный | Нейтральный | Книжный |
| Tu viens ? | Est-ce que tu viens ? | Viens-tu ? |
| Je sais pas. | Je ne sais pas. | Je l'ignore. |
| Le mec / le gars | L'homme | L'individu, le sieur |
| La bagnole | La voiture | L'automobile, le véhicule |
| Bouffer | Manger | Se restaurer, dîner |
| Bossier... нет: bosser | Travailler | Œuvrer, exercer |
| Fringues | Vêtements | Habits, effets |
| Le boulot / le job | Le travail | L'emploi, la profession |
| Un truc | Une chose | Un objet, un élément |
## Разговорные особенности
- Выпадение **ne**: J'sais pas. [шэ па]
- **on** вместо nous: On y va.
- Усечения: **j'**suis, **p'tit** (petit), **ch'uis**
- «Что?» = **Quoi ?** (в конце): Tu fais quoi ? / Hein ?
- Интонация вместо инверсии.
## Книжные особенности (встретишь в литературе и прессе)
- Инверсия: Vint alors un silence de mort. (Пришла тогда мёртвая тишина — инверсия после наречия!)
- Passé simple, subjonctif imparfait
- **Ne** explétif, **nul** отрицания
- Причастные обороты: Ayant achevé sa lecture, il ferma le livre.
- Инверсия после цитаты: « Viens ! » **cria-t-elle**. (воскликнула она)
- **fût-ce** (пусть даже): Fût-ce au prix de sa vie. — Даже ценой жизни.
## Пресса — свой язык
- Journalistic conditionnel: le suspect **serait** en fuite (якобы скрывается)
- Заголовки без артиклей и глаголов: Tempête sur la Bretagne`,
ex:[["(разг.) Chais pas où il est.","Не знаю, где он."],
["(нейтр.) Je ne sais pas où il est.","Я не знаю, где он."],
["(книжн.) J'ignore où il se trouve.","Мне неизвестно, где он находится."]],
points:["Разговорный: нет ne, on=nous, усечения","Книжный: инверсия, passé simple, причастия","Пресса: conditionnel (неподтверждённое), заголовки-телеграммы","Одна мысль — три регистра"],
quiz:[
{t:"c",q:"Самый формальный вариант «Ты придёшь?»:",o:["Tu viens ?","Viendras-tu ?","Est-ce que tu viens ?","Tu viens, toi ?"],a:1,e:"Инверсия — книжный/формальный регистр."},
{t:"c",q:"«La bagnole» — это:",o:["книжное слово","разговорное «тачка»","официальный термин","диалект"],a:1,e:"Разговорное: bagnole = тачка (voiture)."},
{t:"c",q:"« Le suspect serait en fuite » — serait означает:",o:["он точно в бегах","информация неподтверждённая","он был в бегах","он будет в бегах"],a:1,e:"Journalistic conditionnel = «по сообщениям, якобы»."},
{t:"c",q:"Инверсия после вводного наречия: «Vint ___ un silence.»",o:["alors il","alors","il alors","alors que"],a:1,e:"Vint alors un silence — книжная инверсия."}
]},
{
id:"constructions-avancees", lv:"B2", u:4, n:6, title:"Идиоматические конструкции: avoir beau, ne faire que...",
content:`## Конструкции, которые делают речь «французской»
### avoir beau + inf — «сколько ни, как ни»
> Il **a beau** pleuvoir, je sors. — Как бы ни шёл дождь, я выйду.
> J'**ai beau** chercher, je ne trouve rien. — Сколько ни ищу — ничего не нахожу.
### ne faire que + inf — «только и делает, что»
> Il **ne fait que** mentir. — Он только и делает, что лжёт.
### ne ... pas que — «не только»
> Ce **n'est pas que** de la chance. — Это не только везение.
### venir de / venir à / en venir à
> Il **en est venu à** mentir. — Он дошёл до того, что соврал.
> **Vient** un moment **où**... — Наступает момент, когда...
### finir par / commencer par
> Il **a fini par** accepter. — В конце концов он согласился.
> **Commence par** t'excuser. — Начни с того, что извинись.
### laisser/faire + инфинитив (каузатив)
> Je **fais réparer** ma montre. — Я отдаю часы в ремонт. (мне их ремонтируют)
> **Laisse**-moi partir ! — Дай мне уйти!
> Ça **fait** longtemps que... — Давно уже...
### s'en falloir de peu
> Il **s'en est fallu de peu** que je rate le train. — Я чуть не опоздал на поезд.
### toujours est-il que — «как бы то ни было»
> **Toujours est-il qu'**il n'est pas venu.
### force est de constater que — «приходится констатировать»
> **Force est de constater** l'échec.
### il n'empêche que — «тем не менее»
> **Il n'empêche que** tu as tort.
### pour peu que + subj — «стоит только...»
> **Pour peu qu'**il soit en retard, tout échoue. — Стоит ему опоздать...
### dussé-je (от devoir, sub. imp. 1 л.) — «даже если бы мне пришлось»
> **Dussé**-je y laisser ma vie, j'irai. (книжн.)
## Si ce n'est / voire
> C'est difficile, **si ce n'est** impossible. — Трудно, если не невозможно.
> Il est fâché, **voire** furieux. — Сердит, более того — в ярости.`,
ex:[["Il a beau être jeune, il est très mûr.","Хоть он и молод, он очень зрелый."],
["Elle ne fait que pleurer.","Она только и делает, что плачет."],
["Il a fini par comprendre.","В конце концов он понял."],
["Je fais construire une maison.","Я строю дом (заказал строительство)."]],
points:["avoir beau + inf = сколько ни","ne faire que = только и делает, что","finir par = в конце концов","faire + inf = каузатив (отдать сделать); pour peu que + subj"],
quiz:[
{t:"c",q:"«Сколько ни стараюсь, не выходит»:",o:["Je fais beau essayer...","J'ai beau essayer...","Je viens d'essayer...","Je finis par essayer..."],a:1,e:"Avoir beau + inf."},
{t:"c",q:"«Il ne fait que mentir» = ",o:["Он не лжёт","Он только и делает, что лжёт","Он почти не лжёт","Он перестал лгать"],a:1,e:"Ne faire que = исключительно."},
{t:"c",q:"«В конце концов он согласился»:",o:["Il a commencé par accepter","Il a fini par accepter","Il a fait accepter","Il finit d'accepter"],a:1,e:"Finir par + inf."},
{t:"c",q:"«Je fais réparer ma voiture» = ",o:["Я сам ремонтирую машину","Я отдал машину в ремонт","Я ремонтирую машину","Машина отремонтирована"],a:1,e:"Faire + inf = каузатив: кто-то другой делает для меня."},
{t:"c",q:"Pour peu qu'il ___ en retard... (стоит ему опоздать)",o:["est","soit","sera","serait"],a:1,e:"Pour peu que + subjonctif."}
]},
{
id:"faux-amis", lv:"B2", u:4, n:7, title:"Ложные друзья переводчика и частые ошибки русских",
content:`## Faux amis — слова-обманщики
| Французское | Значит НЕ | А значит |
| **actuellement** | актуально | **в настоящий момент** |
| **éventuellement** | éventuel... нет: «в конечном счёте»? НЕ «eventually» | **возможно** |
| **blessé** | близкий? | **раненый** |
| **librairie** | библиотека | **книжный магазин** (библиотека = bibliothèque) |
| **magasin** | магазин (верно!) | но **la boutique** — бутик |
| **monnaie** | монета | **мелочь, сдача; валюта** |
| **argent** | аргумент | **деньги; серебро** |
| **occasion** | оказия | **случай, возможность** (d'occasion = подержанный) |
| **réserver** | резервировать | **бронировать** |
| **assister à** | ассистировать | **присутствовать на** |
| **attendre** | аттендрить | **ждать** |
| **rester** | рвать? | **оставаться** |
| **gentil** | джентльмен | **добрый, милый** |
| **jour(née)**... **journal** | журнал (глянцевый) | **газета** (журнал = revue) |
| **porc** | порт? | **свинина; свинья** |
| **pain** | пень? | **хлеб** |
| **vin** | винт? | **вино** |
| **figure** | фигура | **лицо** |
| **blessure** | ... | **рана** |
| **envie** | зависть | **хотение** (avoir envie = хотеть); зависть = jalousie |
| **demander** | demanding | **спрашивать, просить** |
| **réussir** | ... | **преуспеть**; réussir un examen = сдать |
| **sensible** | sensible | **чувствительный** (разумный = raisonnable!) |
| **compréhensif** | comprehensive | **отзывчивый, понимающий** |
| **large** | ларёк | **широкий** |
| **coin** | койн? | **угол; местечко** |
| **santé**: santé | ... | **здоровье** (тост: à votre santé!) |
## Типичные ошибки русскоговорящих
1. **Je suis chaud** = «я разогрелся/возбуждён» (не «мне жарко»!). Мне жарко = **J'ai chaud**.
2. **Je suis plein** = «я беременна» (о животных) / вульгарно «нажрался». Я сыт = **Je suis repu** / **J'ai assez mangé**.
3. **Comment ?**(переспрос) звучит грубо — лучше: **Pardon ?**
4. **Je m'appelle Dani** — не «Меня звать» через être: *Je suis Dani — тоже можно, но представление = Je m'appelle.
5. Переводить «да» как **si** после отрицательного вопроса: Tu n'aimes pas ? — **Si** ! (Нет, люблю!)
6. **Bonjour** обязательно при входе в магазин — иначе невежливо.
7. «Скучать ПО кому» = Tu me **manques** (ты мне не хватаешь), а не «je m'ennuie de toi» (архаичн.).
8. Предлоги: **en voiture** (на машине), **à vélo/à pied** (на велосипеде/пешком), **en avion**, **en train**.`,
ex:[["Actuellement, je travaille.","В настоящий момент я работаю. (не «актуально»)"],
["Tu me manques.","Я скучаю по тебе. (букв.: ты мне не хватает)"],
["J'ai chaud.","Мне жарко. (не «я горячий»!)"],
["Je vais à la librairie acheter un livre.","Иду в книжный магазин купить книгу."]],
points:["actuellement = сейчас, librairie = книжный, sensible = чувствительный","Мне жарко = j'ai chaud (avoir!)","Tu me manques = я скучаю","si = «да» после отрицательного вопроса"],
quiz:[
{t:"c",q:"«Actuellement» означает:",o:["актуально","в настоящее время","фактически","активно"],a:1,e:"Actuellement = сейчас, в данный момент."},
{t:"c",q:"Куда идёт француз в «librairie»?",o:["в библиотеку","в книжный магазин","в свободную зону","в лабораторию"],a:1,e:"Librairie = книжный магазин; библиотека = bibliothèque."},
{t:"c",q:"«Мне жарко»:",o:["Je suis chaud","J'ai chaud","Je fais chaud","Il fait chaud pour moi"],a:1,e:"Ощущения — через avoir: j'ai chaud."},
{t:"c",q:"«Я скучаю по тебе»:",o:["Je m'ennuie de toi","Tu me manques","Je suis triste de toi","Je manque toi"],a:1,e:"Manquer: tu ME manques — «ты мне не хватаешь»."},
{t:"c",q:"«Tu n'aimes pas le café ? — (Нет, люблю!)»:",o:["Oui","Si","Non","D'accord"],a:1,e:"После отрицательного вопроса утверждение = si !"}
]},
{
id:"tout-accent", lv:"C1", u:5, n:1, title:"Tout: наречие, прилагательное, местоимение — все роли",
content:`## 1. Tout — прилагательное «весь, каждый»
- **tout le monde** (все) — глагол в ед.ч.! Tout le monde **est** là.
- **tous les jours** (каждый день), **toutes les femmes**
- **toute la journée** (весь день — длительность: journée vs jour!)
- Согласование: tout/toute/tous/toutes; произношение tous [ту] (м.р. мн. — s читается в местоимении!)
## 2. Tout — наречие «совсем, очень» + согласование-ловушка!
Наречие обычно НЕ изменяется, НО **tout согласуется перед ж.р. на согласную или h**:
> Elle est **tout** heureuse. (перед гласной — без изменений)
> Elle est **toute** contente. (перед согласной — ВСЯ!)
> Elles sont **toutes** honteuses. (h «аспирированное» — тоже согласуется!)
> Il est **tout** petit. (м.р. — не изменяется)
## 3. Tout — местоимение «всё»
> **Tout** va bien. — Всё хорошо.
> Je veux **tout**. — Я хочу всё.
> **Tous** sont venus [тус]. — Все пришли.
## 4. Конструкции с tout
- **tout en** + gérondif: **Tout en** mangeant, il lit. (одновременно/уступка)
- **tout à fait** — совершенно верно: — Tu as fini ? — **Tout à fait**.
- **tout de suite** — немедленно, сейчас же
- **tout à l'heure** — (совсем) недавно / скоро (контекст! «à bientôt» и «il y a peu»)
- **pas du tout** — вовсе нет
- **tout ce que/qui**: **Tout ce qui** brille n'est pas or. — Не всё то золото, что блестит. (пословица)
- **en tout cas** — во всяком случае
- **tout d'abord** — прежде всего
- **tout court** — просто, коротко: « Appelons-le génie, **tout court**. »`,
ex:[["Tout le monde est content.","Все довольны."],
["Elle est toute rouge.","Она вся красная."],
["Tout ce qui brille n'est pas or.","Не всё то золото, что блестит."],
["Je reviens tout de suite.","Вернусь сию же секунду."]],
points:["tout le monde + ед.ч.","Наречие tout согласуется перед ж.р. с согласной: toute honteuse","tout à fait / tout de suite / tout à l'heure","tous [тус] местоимение, но [ту] перед сущ."],
quiz:[
{t:"c",q:"Tout le monde ___ là.",o:["sont","est","étaient","seront tous"],a:1,e:"Tout le monde — единственное число: est."},
{t:"c",q:"Elle est ___ surprise. (совершенно удивлена — перед согласной, ж.р.)",o:["tout","toute","toutes","tous"],a:1,e:"Перед ж.р. на согласную tout согласуется: toute surprise."},
{t:"c",q:"Elle est ___ émue. (перед гласной)",o:["toute","tout","tous","toutes"],a:1,e:"Перед гласной наречие не изменяется: tout émue."},
{t:"c",q:"«Tout à l'heure» может означать:",o:["только «сейчас»","недавно ИЛИ скоро (по контексту)","никогда","весь час"],a:1,e:"Двуликое выражение: à tout à l'heure = «до скорого»; il est venu tout à l'heure = «недавно»."}
]},
{
id:"lecture-classiques", lv:"C1", u:5, n:2, title:"Как читать французскую классику: стратегия",
content:`## Что тебя ждёт в оригинале
Классические тексты содержат: passé simple (события), imparfait (фон), subjonctif imparfait (изредка), причастные обороты, инверсии, книжную лексику. Всё это ты уже прошёл — теперь стратегия.
## Правило 95%
Выбирай текст, где понимаешь **95%+** слов на странице. Иначе это не чтение, а дешифровка — мотивация умрёт за неделю.
## Стратегия чтения по уровням
1. **Начни с адаптированного**: Le Petit Nicolas, Le Petit Prince (формально «детское», но философское), басни Лафонтена (короткие!).
2. **Детективы**: Мопассан (рассказы по 10 стр.), Гастру, Сименон — простой язык, цепкий сюжет.
3. **XIX век**: Мопассан «Bel-Ami», Верн, Доде — язык близок к современному.
4. **Тяжёлая артиллерия**: Гюго, Бальзак, Флобер — длинные периоды, лексика эпохи.
5. **XX век**: Камю «L'Étranger» (рубленые фразы — идеален!), Сент-Экзюпери, Гавальди... современные бестселлеры.
## Техника интенсивного чтения (глава в неделю)
1. Прочитай БЕЗ словаря — улови смысл.
2. Второе чтение: выписывай 10–15 ключевых слов (не больше!).
3. Разбери 2–3 сложные конструкции (часто: причастия, инверсии, subjonctif).
4. Прочитай ВСЛУХ один абзац, копируя ритм (можно за аудио).
5. Перескажи главу своими словами — хоть по-русски.
## Техника экстенсивного чтения (книга за месяц)
Читай ради сюжета, не задерживайся на незнакомых словах, если смысл ясен. 20 страниц в день лучше, чем 2 вымученные.
## Лайфхаки
- Аудиокнига + текст одновременно (Livres audio gratuits: litteratureaudio.com) — скорость понимания растёт вдвое.
- Перечитывай любимые абзацы — мозг цементирует конструкции.
- Camus «L'Étranger» — первая «взрослая» книга большинства иностранцев: короткие предложения, passé composé вместо passé simple!`,
ex:[["L'Étranger de Camus — idéal pour commencer.","«Посторонний» Камю — идеален для начала."],
["Il lisait en marchant. (participe présent)","Он читал на ходу."],
["C'était un homme dont personne ne parlait.","Это был человек, о котором никто не говорил."]],
points:["95% понимания — иначе смени текст","Интенсивно: 1 глава/нед + разбор конструкций","Экстенсивно: 20 стр./день ради сюжета","Camus — лучший первый роман; аудиокнига+текст"],
quiz:[
{t:"c",q:"Оптимальный уровень понимания текста для чтения:",o:["50%","70%","95%+","100% обязателен"],a:2,e:"95%+ — правило comprehensible input."},
{t:"c",q:"Какой роман рекомендуют первым «взрослым»?",o:["Les Misérables","L'Étranger de Camus","La Comédie humaine","Les Fleurs du mal"],a:1,e:"Камю: короткие фразы, простое время, ясный сюжет."},
{t:"c",q:"Passé simple в романе выполняет роль:",o:["фона/описаний","однократных событий","будущего","диалогов"],a:1,e:"Passé simple = события (как passé composé), imparfait = фон."}
]}
);
