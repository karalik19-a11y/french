// Тексты для чтения — Французский для Дани
window.DB = window.DB || {};
DB.reading = DB.reading || [];
DB.reading.push(
{
id:"r1", lv:"A1", title:"Ma journée", titleRu:"Мой день", author:null,
text:`Je m'appelle Marc et j'habite à Lyon. Je suis professeur de français.
Le matin, je me lève à six heures et demie. Je prends une douche, puis je bois un café et je mange des tartines. À sept heures quarante, je prends le bus pour aller au lycée.
Mes cours commencent à huit heures. J'aime beaucoup mon travail : les élèves sont sympathiques et curieux. À midi, je déjeune à la cantine avec mes collègues. Nous parlons de littérature, de cinéma et de sport.
L'après-midi, je finis à seize heures. Je rentre chez moi, je fais une promenade dans le parc et je lis un peu.
Le soir, je prépare le dîner. Je regarde rarement la télévision. À vingt-deux heures, je suis fatigué et je vais me coucher.
Le dimanche, c'est différent : je fais la grasse matinée !`,
translation:`Меня зовут Марк, я живу в Лионе. Я учитель французского.
Утром я встаю в половине седьмого. Я принимаю душ, затем пью кофе и ем тосты. В без двадцати восемь я сажусь на автобус, чтобы поехать в лицей.
Мои уроки начинаются в восемь. Я очень люблю свою работу: ученики симпатичные и любознательные. В полдень я обедаю в столовой с коллегами. Мы говорим о литературе, кино и спорте.
Днём я заканчиваю в четыре. Я возвращаюсь домой, гуляю в парке и немного читаю.
Вечером я готовлю ужин. Телевизор я смотрю редко. В десять часов я устаю и иду спать.
В воскресенье всё по-другому: я сплю до обеда!`,
words:[["se lever","вставать"],["tartine","тост, хлеб с маслом"],["le lycée","лицей, старшая школа"],["sympathique","симпатичный, приятный"],["la cantine","столовая"],["un collègue","коллега"],["faire une promenade","гулять"],["se coucher","ложиться спать"],["la grasse matinée","долгий сон до обеда"],["rarement","редко"],["curieux","любознательный"],["différent","другой, иной"]],
questions:[
{q:"Que fait Marc après sa douche ?",o:["Il prend le bus","Il boit un café","Il va au lycée","Il lit"],a:1,e:"Je prends une douche, puis je bois un café."},
{q:"Comment va-t-il au lycée ?",o:["À pied","En voiture","En bus","À vélo"],a:2,e:"Je prends le bus."},
{q:"À quelle heure finit-il l'après-midi ?",o:["À midi","À seize heures","À dix heures","À huit heures"],a:1,e:"L'après-midi, je finis à seize heures."},
{q:"Qu'est-ce qu'il fait le dimanche ?",o:["Il travaille","Il fait la grasse matinée","Il déjeune à la cantine","Il prépare le dîner"],a:1,e:"Le dimanche... je fais la grasse matinée !"}
]},
{
id:"r2", lv:"A2", title:"Un week-end imprévu", titleRu:"Незапланированные выходные", author:null,
text:`Vendredi soir, Léa était très fatiguée. Elle avait travaillé toute la semaine et elle voulait rester tranquillement chez elle. Mais son téléphone a sonné : c'était sa sœur Julie.
— Léa ? Il fait beau demain. Tu veux venir à la mer avec nous ?
Léa a hésité. Elle regardait par la fenêtre : le ciel était gris, mais les prévisions annonçaient du soleil pour samedi.
— D'accord, a-t-elle dit, mais je ne conduis pas : j'ai trop peur sur l'autoroute.
— Pas de problème ! Thomas viendra te chercher à neuf heures.
Le samedi, Léa s'est réveillée de bonne humeur. Elle a préparé un pique-nique, elle a mis son maillot de bain dans un sac et à neuf heures dix, la voiture de Thomas klaxonnait devant chez elle.
Ils ont passé une journée merveilleuse : ils se sont baignés, ils ont mangé des glaces et le soir, en rentrant, Léa s'est dit qu'elle était contente d'avoir changé ses projets.`,
translation:`В пятницу вечером Леа была очень усталой. Она проработала всю неделю и хотела спокойно остаться дома. Но зазвонил её телефон: это была её сестра Жюли.
— Леа? Завтра хорошая погода. Поедешь с нами на море?
Леа заколебалась. Она смотрела в окно: небо было серым, но прогноз обещал солнце на субботу.
— Хорошо, — сказала она, — но я не поведу машину: я слишком боюсь скоростных дорог.
— Без проблем! Томас заедет за тобой в девять.
В субботу Леа проснулась в хорошем настроении. Она приготовила пикник, положила купальник в сумку, и в десять минут десятого машина Томаса сигналила у её дома.
Они провели чудесный день: купались, ели мороженое, и вечером, возвращаясь, Леа подумала, что рада, что изменила свои планы.`,
words:[["imprévu","незапланированный"],["toute la semaine","всю неделю"],["hésiter","колебаться"],["les prévisions","прогноз"],["l'autoroute (f)","скоростная дорога"],["venir chercher qqn","заехать за кем-то"],["de bonne humeur","в хорошем настроении"],["un pique-nique","пикник"],["un maillot de bain","купальник"],["klaxonner","сигналить"],["se baigner","купаться"],["en rentrant","возвращаясь (деепричастие!)"]],
questions:[
{q:"Pourquoi Léa voulait-elle rester chez elle ?",o:["Elle était malade","Elle était fatiguée","Il pleuvait","Elle travaillait samedi"],a:1,e:"Léa était très fatiguée."},
{q:"Qui a téléphoné à Léa ?",o:["Thomas","Sa mère","Sa sœur Julie","Son amie"],a:2,e:"C'était sa sœur Julie."},
{q:"Pourquoi Léa ne conduit-elle pas ?",o:["Elle n'a pas de voiture","Elle a peur sur l'autoroute","Elle ne sait pas conduire","Thomas conduit mieux"],a:1,e:"J'ai trop peur sur l'autoroute."},
{q:"« en rentrant » — это:",o:["возвращаясь (gérondif)","когда вернулась","перед возвращением","не возвращаясь"],a:0,e:"En + participe présent = gérondif, одновременность."},
{q:"Quel temps domine dans la description du vendredi (était, avait travaillé) ?",o:["passé composé","imparfait","présent","futur"],a:1,e:"Фон и состояние → imparfait."}
]},
{
id:"r3", lv:"B1", title:"La ville de demain", titleRu:"Город будущего", author:null,
text:`Comment vivrons-nous dans vingt ans ? Les urbanistes du monde entier se penchent sur la question, et leurs réponses dessinent une ville profondément différente de celle que nous connaissons.
D'abord, la voiture individuelle pourrait disparaître des centres-villes. À la place : des transports publics gratuits, des pistes cyclables et des « villes du quart d'heure », où l'on trouve tout — école, médecin, commerces — à moins de quinze minutes de chez soi.
Ensuite, les immeubles eux-mêmes vont changer. On construit déjà des tours en bois, moins polluantes que le béton. Les toits se couvrent de jardins potagers : c'est ce qu'on appelle l'agriculture urbaine, qui permettrait de nourrir une partie des habitants.
Enfin, la question énergétique reste le principal défi. Si les panneaux solaires se généralisent, chaque immeuble pourra produire sa propre électricité. Encore faudra-t-il la stocker, car le soleil ne brille pas la nuit !
Cette ville du futur sera-t-elle plus agréable à vivre ? Rien n'est moins sûr : tout dépendra des choix politiques que nous ferons aujourd'hui. Une chose est certaine cependant : elle ne ressemblera pas à la ville de nos grands-parents.`,
translation:`Как мы будем жить через двадцать лет? Урбанисты всего мира изучают этот вопрос, и их ответы рисуют город, глубоко отличный от того, который мы знаем.
Во-первых, личный автомобиль может исчезнуть из центров городов. Вместо него: бесплатный общественный транспорт, велодорожки и «города пятнадцатиминутной доступности», где всё — школа, врач, магазины — находится не более чем в пятнадцати минутах от дома.
Затем изменятся и сами здания. Уже строят деревянные башни, менее загрязняющие, чем бетонные. Крыши покрываются огородами: это так называемое городское сельское хозяйство, которое позволило бы кормить часть жителей.
Наконец, энергетический вопрос остаётся главным вызовом. Если солнечные панели распространятся повсеместно, каждое здание сможет производить собственное электричество. Вот только его придётся хранить, ведь солнце не светит ночью!
Будет ли этот город будущего приятнее для жизни? Ничего менее верного: всё будет зависеть от политических решений, которые мы примем сегодня. Однако одно несомненно: он не будет похож на город наших бабушек и дедушек.`,
words:[["un urbaniste","урбанист, градостроитель"],["se pencher sur","изучать, склоняться над"],["dessiner","рисовать, очерчивать"],["une piste cyclable","велодорожка"],["le quart d'heure","четверть часа"],["polluant","загрязняющий"],["le béton","бетон"],["un toit","крыша"],["un jardin potager","огород"],["nourrir","кормить"],["le défi","вызов"],["se généraliser","распространяться повсеместно"],["stocker","хранить, накапливать"],["Rien n'est moins sûr","ничего менее верного (идиома)"],["cependant","однако"],["ressembler à","быть похожим на"]],
questions:[
{q:"Qu'est-ce qu'une « ville du quart d'heure » ?",o:["Une ville qu'on traverse en 15 minutes","Une ville où tout est à moins de 15 minutes","Une ville construite en 15 minutes","Une ville de 15 000 habitants"],a:1,e:"On trouve tout à moins de quinze minutes de chez soi."},
{q:"Pourquoi construit-on des tours en bois ?",o:["C'est moins cher","C'est plus beau","Elles polluent moins que le béton","Le bois est plus solide"],a:2,e:"Moins polluantes que le béton."},
{q:"« Encore faudra-t-il la stocker » — что выражает эта конструкция?",o:["уверенность","ограничительное условие («вот только нужно будет...»)","отрицание","прошлое"],a:1,e:"Encore + инверсия = «вот только ещё нужно будет»."},
{q:"La conclusion du texte est:",o:["optimiste certaine","pessimiste certaine","nuancée : tout dépend des choix","neutre sans opinion"],a:2,e:"Rien n'est moins sûr : tout dépendra des choix politiques."},
{q:"« se penchent sur la question » означает:",o:["наклоняются над вопросом (букв.)","изучают вопрос","игнорируют вопрос","отвечают на вопрос"],a:1,e:"Se pencher sur = изучать, заниматься вопросом."}
]},
{
id:"r4", lv:"B2", title:"Faut-il avoir peur de l'intelligence artificielle ?", titleRu:"Стоит ли бояться искусственного интеллекта?", author:null,
text:`Depuis que les machines savent écrire, traduire et même coder, une inquiétude diffuse traverse la société : et si l'intelligence artificielle nous rendait inutiles ?
Posons d'abord les termes du débat. Certes, l'IA accomplit aujourd'hui des tâches qui semblaient réservées à l'homme : rédiger un contrat, diagnostiquer une maladie, composer une musique. Mais « accomplir une tâche » ne signifie pas « exercer un métier ». Or c'est précisément la nuance que le débat public tends à escamoter : un métier n'est jamais une simple somme de tâches, c'est aussi une responsabilité, un jugement, une relation.
Les économistes rappellent d'ailleurs qu'à chaque révolution technologique, les mêmes prophéties catastrophistes ont été formulées. Les caisses automatiques devaient supprimer les commerçants ; le GPS devait tuer le sens de l'orientation ; l'imprimerie, disait-on, ferait perdre la mémoire aux hommes. Chaque fois, les emplois détruits ont été remplacés par des emplois différents, souvent plus qualifiés — non sans souffrances sociales, il est vrai.
Faut-il pour autant dormir tranquille ? Certainement pas. La vitesse du changement actuel est inédite, et la question n'est plus seulement « combien d'emplois ? », mais « quels emplois, pour qui, et à quelles conditions ? ». L'IA pourrait concentrer la richesse entre quelques mains comme elle pourrait, à l'inverse, libérer du temps pour des activités plus humaines.
Autrement dit, la technologie n'est pas un destin : c'est un choix politique. Avoir peur de l'IA revient à avoir peur d'un marteau ; ce qui compte, c'est de savoir qui tient le manche, et pour enfoncer quel clou.`,
translation:`С тех пор как машины умеют писать, переводить и даже программировать, общество охватывает смутная тревога: а что если искусственный интеллект сделает нас ненужными?
Сначала определим рамки дискуссии. Конечно, ИИ сегодня выполняет задачи, которые казались прерогативой человека: составить контракт, поставить диагноз, написать музыку. Но «выполнить задачу» не значит «осуществлять профессию». А ведь именно этот нюанс публичная дискуссия склонна замалчивать: профессия — это никогда не простая сумма задач, это ещё и ответственность, суждение, отношения.
Экономисты напоминают, впрочем, что при каждой технологической революции формулировались одни и те же катастрофические пророчества. Автоматические кассы должны были уничтожить торговцев; GPS — убить чувство ориентации; книгопечатание, говорили, лишит людей памяти. Каждый раз уничтоженные рабочие места заменялись другими, часто более квалифицированными — не без социальных издержек, правда.
Значит ли это, что можно спать спокойно? Конечно нет. Скорость нынешних изменений беспрецедентна, и вопрос уже не только «сколько рабочих мест?», но «какие рабочие места, для кого и на каких условиях?». ИИ мог бы сосредоточить богатство в немногих руках, а мог бы, наоборот, высвободить время для более человеческих занятий.
Иными словами, технология — не судьба: это политический выбор. Бояться ИИ — всё равно что бояться молотка; важно знать, кто держит рукоятку и в какой гвоздь бьёт.`,
words:[["une inquiétude diffuse","смутная тревога"],["rendre","делать (каким-то)"],["accomplir","выполнять"],["réserver à","предназначать для"],["exercer un métier","осуществлять профессию"],["précisément","именно"],["la nuance","нюанс, тонкость"],["escamoter","замалчивать, ловко обходить"],["une prophétie","пророчество"],["catastrophiste","катастрофический"],["formuler","формулировать"],["supprimer","упразднить"],["qualifié","квалифицированный"],["non sans","не без"],["inédit","беспрецедентный"],["concentrer","сосредоточить"],["libérer","высвобождать"],["à l'inverse","наоборот"],["autrement dit","иными словами"],["le destin","судьба"],["revenir à","сводиться к"],["le manche","рукоятка"],["le clou","гвоздь"]],
questions:[
{q:"Quelle distinction centrale fait l'auteur ?",o:["IA forte / IA faible","tâche / métier","machine / humain","emploi / chômage"],a:1,e:"« accomplir une tâche » ≠ « exercer un métier »."},
{q:"Quel argument historique est utilisé ?",o:["Les guerres mondiales","Les prophéties catastrophistes des révolutions passées","La chute de l'Empire romain","L'invention de l'écriture"],a:1,e:"Каждая технологическая революция вызывала те же страхи."},
{q:"« non sans souffrances sociales » — автор признаёт, что:",o:["переход был безболезненным","переход причинял социальные страдания","страдания преувеличены","экономисты неправы"],a:1,e:"Двойное отрицание non sans = «не без» — уступка."},
{q:"La conclusion de l'auteur :",o:["L'IA est un danger inévitable","Il faut interdire l'IA","L'IA est un choix politique, pas un destin","L'IA créera plus d'emplois"],a:2,e:"« La technologie n'est pas un destin : c'est un choix politique. »"},
{q:"Métaphore finale du marteau : что она означает?",o:["ИИ опасен как молоток","ИИ — нейтральный инструмент, важен тот, кто им пользуется","Нужно запретить инструменты","Молоток умнее человека"],a:1,e:"Инструмент нейтрален — важно, в чьих руках."},
{q:"« Avoir peur de l'IA revient à avoir peur d'un marteau » — revenir à здесь:",o:["возвращаться","сводиться к, означать то же","приходить обратно","зависеть от"],a:1,e:"Revenir à = сводиться к чему-либо."}
]},
{
id:"r5", lv:"C1", title:"De la lenteur", titleRu:"О медлительности (эссе)", author:null,
text:`Il est des vertus que notre époque a cessé de comprendre. La lenteur est de celles-là. Autrefois, on faisait l'éloge du sage qui savait perdre son temps ; aujourd'hui, perdre son temps est devenu le péché capital d'une société qui mesure toute chose à l'aune de la productivité.
Pourtant, qu'est-ce que la lenteur, sinon l'attention portée à la durée ? Le lent n'est pas celui qui fait moins, c'est celui qui fait plus profondément. Il faut avoir marché longtemps dans une ville pour en connaître les visages ; il faut avoir relu pour avoir lu. Les Grecs ne s'y trompaient pas, eux qui distinguaient le chronos, le temps qui s'écoule, du kairos, le temps opportun, le moment mûr — celui qui ne se presse pas, mais qui arrive à point nommé.
On objectera que la lenteur est un luxe de privilégiés. Sans doute. Mais c'est précisément parce qu'elle est rare qu'elle est précieuse, et parce qu'elle est menacée qu'elle doit être défendue. Le droit à la déconnexion, les zones sans notifications, les « vendredis silencieux » de certaines entreprises ne sont pas des gadgets managériaux : ce sont les premières escarmouches d'une guerre culturelle dont l'enjeu n'est rien de moins que notre rapport au temps.
Car enfin, que cherchons-nous en accélérant sans cesse ? À gagner du temps, dit-on. Encore faudrait-il savoir ce que nous ferions du temps gagné. Si c'est pour le remplir aussitôt de nouvelles tâches, alors l'accélération n'est pas une libération, mais une fuite — la fuite en avant d'hommes qui courent pour ne pas se demander où ils vont.
Ralentir, ce n'est donc pas renoncer : c'est reprendre la main. C'est affirmer, contre la tyrannie de l'immédiat, que certaines choses — lire, aimer, penser, contempler — exigent ce que rien ne peut leur donner à leur place : du temps.`,
translation:`Есть добродетели, которые наша эпоха перестала понимать. Медлительность — одна из них. Прежде восхваляли мудреца, который умел терять время; сегодня потерять время стало смертным грехом общества, которое меряет всё меркой продуктивности.
Однако что такое медлительность, как не внимание, уделяемое длительности? Медлительный — не тот, кто делает меньше, а тот, кто делает глубже. Нужно долго ходить по городу, чтобы узнать его лица; нужно перечитать, чтобы прочесть. Греки не ошибались на этот счёт — они отличали хронос, текущее время, от кайроса, времени благоприятного, созревшего момента: того, который не торопится, но приходит точно в срок.
Возразят, что медлительность — роскошь для привилегированных. Возможно. Но именно потому, что она редка, она и драгоценна, и именно потому, что под угрозой, её нужно защищать. Право на отключение, зоны без уведомлений, «тихие пятницы» некоторых компаний — это не управленческие игрушки: это первые стычки культурной войны, на кону в которой не что иное, как наше отношение ко времени.
Ибо, в конце концов, чего мы ищем, беспрестанно ускоряясь? Выиграть время, говорят. Вот только нужно знать, что мы сделаем с выигранным временем. Если чтобы тут же наполнить его новыми задачами, тогда ускорение — не освобождение, а бегство — бегство вперёд людей, которые бегут, чтобы не спрашивать себя, куда они бегут.
Замедлиться — значит не отказаться, а вернуть себе инициативу. Это утвердить, вопреки тирании сиюминутного, что некоторые вещи — читать, любить, мыслить, созерцать — требуют того, что ничто не может им дать вместо них самих: времени.`,
words:[["la vertu","добродетель"],["faire l'éloge de","восхвалять"],["le péché capital","смертный грех"],["à l'aune de","меркой, по мерке (идиома)"],["sinon","как не, иначе"],["porter attention à","уделять внимание"],["s'y tromper","ошибаться в этом"],["à point nommé","точно в срок, кстати"],["objecter","возражать"],["un luxe","роскошь"],["précisément","именно"],["menacer","угрожать"],["la déconnexion","отключение"],["l'escarmouche","стычка"],["l'enjeu (m)","ставка, то, что на кону"],["rien de moins que","не что иное как"],["le rapport à","отношение к"],["car enfin","ибо, в конце концов"],["accélérer","ускоряться"],["la fuite en avant","бегство вперёд"],["reprendre la main","вернуть инициативу"],["la tyrannie","тирания"],["l'immédiat (m)","сиюминутное"],["contempler","созерцать"],["exiger","требовать"]],
questions:[
{q:"Comment la société moderne considère-t-elle le fait de « perdre son temps » ?",o:["comme une sagesse","comme un péché capital","comme un luxe","comme indifférent"],a:1,e:"« perdre son temps est devenu le péché capital d'une société qui mesure tout à l'aune de la productivité »."},
{q:"Что противопоставляют греки: chronos / kairos?",o:["прошлое и будущее","текущее время и благоприятный момент","быстрое и медленное","жизнь и смерть"],a:1,e:"Chronos — время, которое течёт; kairos — подходящий момент."},
{q:"« C'est précisément parce qu'elle est rare qu'elle est précieuse » — конструкция c'est...que:",o:["условие","эмфатическое выделение причины","время","уступка"],a:1,e:"C'est + выделенное + que — рамочная эмфаза (см. урок mise-relief)."},
{q:"Selon l'auteur, l'accélération permanente est:",o:["une libération","une fuite en avant","un progrès technique","une nécessité économique"],a:1,e:"« l'accélération n'est pas une libération, mais une fuite »."},
{q:"« Ralentir, ce n'est donc pas renoncer : c'est reprendre la main » — что значит reprendre la main?",o:["сдаться","вернуть себе контроль/инициативу","пожать руку","поднять руку"],a:1,e:"Reprendre la main — вернуть инициативу, контроль."},
{q:"Quel registre domine dans ce texte ?",o:["familier","neutre journalistique","littéraire soutenu","technique"],a:2,e:"Книжный стиль: « Il est des vertus... », « Car enfin... », « à l'aune de »."}
]},
{
id:"r6", lv:"A2", title:"La Cigale et la Fourmi", titleRu:"Кузнечик и Муравей (басня)", author:"Jean de La Fontaine",
text:`La Cigale, ayant chanté
Tout l'été,
Se trouva fort dépourvue
Quand la bise fut venue.
Pas un seul petit morceau
De mouche ou de vermisseau.
Elle alla crier famine
Chez la Fourmi sa voisine,
La priant de lui prêter
Quelque grain pour subsister
Jusqu'à la saison nouvelle.
« Je vous paierai, lui dit-elle,
Avant l'oût, foi d'animal,
Intérêt et principal. »
La Fourmi n'est pas prêteuse :
C'est là son moindre défaut.
« Que faisiez-vous au temps chaud ?
Dit-elle à cette emprunteuse.
— Nuit et jour à tout venant
Je chantais, ne vous déplaise.
— Vous chantiez ? j'en suis fort aise.
Eh bien ! dansez maintenant. »`,
translation:`Кузнечик, пропев
Всё лето,
Оказался в большой нужде,
Когда пришли холода (биз — северный ветер).
Ни единого кусочка
Мухи или червячка.
Пошёл он к соседке-Муравьихе
Плакааться на голод,
Прося одолжить ей
Хоть зерно, чтобы продержаться
До нового сезона.
«Я вам заплачу, — сказал он, —
До августа, честное животное,
Проценты и основной долг.»
Муравей — не одалживатель:
Это её меньший недостаток.
«А что вы делали в жаркое время?» —
Сказала она этой заёмщице.
— Днём и ночью всем приходящим
Я пел, не обессудьте.
— Вы пели? Я очень рада.
Ну что ж! Теперь танцуйте.`,
words:[["la cigale","цикада (кузнечик)"],["la fourmi","муравей"],["dépourvu","лишённый, нуждающийся"],["la bise","северный холодный ветер"],["un vermisseau","червячок"],["crier famine","плакаться на голод"],["prêter","одалживать"],["subsister","существовать, продержаться"],["l'oût (m)","август (устар. от août)"],["foi d'animal","честное животное (клятва)"],["l'intérêt (m)","процент (долга)"],["le principal","основной долг"],["prêteuse","охотница одалживать"],["le défaut","недостаток"],["l'emprunteuse (f)","заёмщица"],["à tout venant","всякому приходящему"],["ne vous déplaise","не в обиду будь сказано"],["être aise de","быть довольным"]],
questions:[
{q:"Que faisait la Cigale tout l'été ?",o:["Elle travaillait","Elle chantait","Elle dormait","Elle dansait"],a:1,e:"Ayant chanté tout l'été..."},
{q:"« ayant chanté » — какая это форма?",o:["gérondif","participe passé + participe présent (причастный оборот)","passé composé","infinitif"],a:1,e:"Participe présent от avoir (ayant) + participe passé — причастный оборот «пропев»."},
{q:"Que promet la Cigale à la Fourmi ?",o:["de danser","de payer intérêt et principal","de chanter pour elle","de lui donner des mouches"],a:1,e:"Je vous paierai... intérêt et principal."},
{q:"Que répond la Fourmi à la fin ?",o:["Elle prête le grain","Eh bien ! dansez maintenant","Elle chasse la Cigale","Elle rit"],a:1,e:"« Vous chantiez ? ... Eh bien ! dansez maintenant. » — мораль: кто пел, пусть теперь танцует."},
{q:"Мораль басни:",o:["Пой красиво","Готовься летом, не будь беспечным","Одалживай друзьям","Танцуй каждый день"],a:1,e:"Классическая мораль о предусмотрительности."}
]},
{
id:"r7", lv:"B1", title:"La Parure (incipit)", titleRu:"«Ожерелье» (начало)", author:"Guy de Maupassant",
text:`C'était une de ces jolies et charmantes filles nées, comme par une erreur du destin, dans une famille d'employés. Elle n'avait pas de dot, pas d'espérances, aucun moyen d'être connue, comprise, aimée, épousée par un homme riche et distingué ; et elle se laissa marier avec un petit commis du ministère de l'Instruction publique.
Sa toilette était simple, car elle ne pouvait être parée, mais elle était malheureuse comme une déclassée ; car les femmes n'ont point de caste ni de race, leur beauté, leur grâce et leur charme leur servant de naissance et de famille.
Un soir, son mari rentra, l'air triomphant, et tenant à la main une large enveloppe.
« Tiens, dit-il, voici quelque chose pour toi. »
Elle déchira vivement le papier et en tira une carte imprimée qui portait ces mots :
« Le ministre de l'Instruction publique et Mme Georges Ramponneau prient M. et Mme Loisel de leur faire l'honneur de venir passer la soirée à l'hôtel du ministère, le lundi 18 janvier. »
Au lieu d'être ravie, comme l'espérait son mari, elle jeta avec dépit l'invitation sur la table, en murmurant :
« Qu'est-ce que tu veux que je fasse de cela ? »`,
translation:`Это была одна из тех милых и очаровательных девушек, которые рождаются, словно по ошибке судьбы, в семье мелких служащих. У неё не было приданого, никаких надежд, никакой возможности быть замеченной, понятой, любимой, чтобы её взял замуж человек богатый и видный; и она позволила выдать себя замуж за мелкого служащего министерства народного просвещения.
Её наряды были просты, ибо она не могла украшаться, но она была несчастна, как падшая в низший класс; ведь у женщин нет ни касты, ни расы: их красота, грация и обаяние служат им и происхождением, и родом.
Однажды вечером её муж вернулся с торжествующим видом, держа в руке большой конверт.
«Смотри-ка, — сказал он, — вот кое-что для тебя.»
Она живо разорвала бумагу и вынула печатную карточку, на которой значилось:
«Министр народного просвещения и г-жа Жорж Рампоно просят г-на и г-жу Луазель оказать им честь и провести вечер в отеле министерства в понедельник, 18 января.»
Вместо того чтобы восхититься, как надеялся муж, она с досадой швырнула приглашение на стол, пробормотав:
«Что мне, по-твоему, с этим делать?»`,
words:[["la parure","наряд, украшение"],["une erreur du destin","ошибка судьбы"],["la dot","приданое"],["l'espérance (f)","надежда"],["distingué","видный, изысканный"],["se laisser + inf","позволить (сделать с собой)"],["un commis","служащий, клерк"],["la toilette","наряд, одежда"],["parer","украшать"],["une déclassée","опустившаяся (потерявшая класс)"],["la caste","каста"],["le charme","обаяние"],["triomphant","торжествующий"],["une enveloppe","конверт"],["déchirer","разрывать"],["porter ces mots","гласить эти слова"],["faire l'honneur de","оказать честь"],["ravi","восхищённый"],["avec dépit","с досадой"],["murmurer","бормотать"]],
questions:[
{q:"Où est née l'héroïne ?",o:["Dans une famille riche","Dans une famille d'employés","Dans la noblesse","Chez un ministre"],a:1,e:"Née... dans une famille d'employés."},
{q:"« se laissa marier » означает:",o:["она вышла замуж по любви","она позволила выдать себя замуж (пассивно)","она отказалась","она мечтала о свадьбе"],a:1,e:"Se laisser + infinitif = позволить что-то сделать с собой."},
{q:"Pourquoi est-elle malheureuse « comme une déclassée » ?",o:["Elle est pauvre matériellement","Sa beauté la condamne à vouloir une autre vie","Son mari la maltraite","Elle n'a pas d'amis"],a:1,e:"Красота без средств — она чувствует себя созданной для другой жизни."},
{q:"Comment réagit-elle à l'invitation ?",o:["Elle est ravie","Elle la jette avec dépit","Elle pleure de joie","Elle court s'acheter une robe"],a:1,e:"Elle jeta avec dépit l'invitation sur la table."},
{q:"« Qu'est-ce que tu veux que je fasse de cela ? » — после «veux que» стоит:",o:["indicatif","subjonctif","infinitif","conditionnel"],a:1,e:"Vouloir que + subjonctif: que je fasse."}
]},
{
id:"r8", lv:"C1", title:"Candide (incipit)", titleRu:"«Кандид» (начало)", author:"Voltaire",
text:`Il y avait en Westphalie, dans le château de M. le baron de Thunder-ten-tronckh, un jeune garçon à qui la nature avait donné les mœurs les plus douces. Sa physionomie annonçait son âme. Il avait le jugement assez droit, avec l'esprit le plus simple ; c'est, je crois, pour cette raison qu'on le nommait Candide. Les anciens domestiques de la maison soupçonnaient qu'il était fils de la sœur de monsieur le baron et d'un bon et honnête gentilhomme du voisinage, que cette demoiselle ne voulut jamais épouser parce qu'il n'avait pu prouver que soixante et onze quartiers, et que le reste de son arbre généalogique avait été perdu par l'injure du temps.
Monsieur le baron était un des plus puissants seigneurs de la Westphalie, car son château avait une porte et des fenêtres. Sa grande salle même était ornée d'une tapisserie. Tous les chiens de ses basses-cours composaient une meute dans le besoin ; ses palefreniers étaient ses piqueurs ; le vicaire du village était son grand aumônier. Ils l'appelaient tous monseigneur, et ils riaient quand il faisait des contes.
Tout va pour le mieux, répétait Pangloss, car il est impossible que les choses ne soient pas où elles sont : tout étant fait pour une fin, tout est nécessairement pour la meilleure fin.`,
translation:`В Вестфалии, в замке господина барона Тундер-тен-Тронка, жил молодой человек, которому природа дала самый кроткий нрав. Его физиономия выдавала его душу. Суждение у него было довольно прямое при самом простом уме; по этой причине, я полагаю, его и прозвали Кандидом (Простаком). Старые слуги дома подозревали, что он сын сестры господина барона и доброго честного дворянина по соседству, за которого эта девица так и не захотела выйти замуж, потому что тот не смог доказать более семидесяти одного квартала (поколений) дворянства, а остальное его генеалогическое древо было утрачено по вине времени.
Господин барон был одним из самых могущественных сеньоров Вестфалии, ибо в его замке были дверь и окна. Даже его большая зала была украшена гобеленом. Все собаки его птичьих дворов в случае нужды составляли охотничью свору; его конюхи были его егерями; деревенский викарий был его великим капелланом. Все они звали его «мой сеньор» и смеялись, когда он рассказывал байки.
Всё к лучшему, повторял Панглос, ибо невозможно, чтобы вещи не были там, где они суть: всё будучи создано для цели, всё необходимо для наилучшей цели.`,
words:[["les mœurs (f pl)","нравы"],["la physionomie","физиономия, облик"],["annoncer","выдавать, предвещать"],["le jugement","суждение"],["droit","прямой, правильный"],["l'esprit (m)","ум"],["nommer","называть"],["un domestique","слуга"],["soupçonner","подозревать"],["un gentilhomme","дворянин"],["épouser","жениться на/выйти за"],["le quartier","квартал (поколение дворянства)"],["l'arbre généalogique","генеалогическое древо"],["l'injure du temps","ущерб времени"],["puissant","могущественный"],["orné de","украшенный"],["la tapisserie","гобелен"],["la basse-cour","птичий двор"],["la meute","свора"],["le palefrenier","конюх"],["le piqueur","егерь"],["le vicaire","викарий"],["l'aumônier (m)","капеллан"],["monseigneur","мой сеньор"],["le conte","байка, сказка"],["Pangloss","Панглос (философ-оптимист)"],["la fin","цель (здесь)"],["nécessairement","необходимо"]],
questions:[
{q:"Pourquoi le jeune homme s'appelle-t-il Candide ?",o:["C'est son nom de famille","À cause de son esprit simple et de son jugement droit","Par décision du baron","Par ironie de Voltaire uniquement"],a:1,e:"« le jugement assez droit, avec l'esprit le plus simple ; c'est... pour cette raison qu'on le nommait Candide »."},
{q:"Que soupçonnent les domestiques ?",o:["Que Candide est le fils du baron","Que Candide est fils de la sœur du baron","Que le baron est pauvre","Que Candide volera le château"],a:1,e:"Ils soupçonnaient qu'il était fils de la sœur de monsieur le baron."},
{q:"L'ironie de Voltaire sur la puissance du baron repose sur:",o:["des chiffres exacts","des arguments dérisoires (porte, fenêtres, chiens de basse-cour)","une citation historique","le mépris des domestiques"],a:1,e:"« car son château avait une porte et des fenêtres » — смехотворные «доказательства» могущества."},
{q:"« que cette demoiselle ne voulut jamais épouser » — ne здесь:",o:["отрицание","ne explétif после refuser/empêcher-конструкции","усиление","часть subjonctif"],a:1,e:"Ne explétif в придаточном после отрицательно-предохранительного контекста (Voltaire — классика употребления)."},
{q:"La philosophie de Pangloss :",o:["tout est fait pour la meilleure fin","le monde est chaotique","rien n'a de sens","il faut douter de tout"],a:0,e:"« tout étant fait pour une fin, tout est nécessairement pour la meilleure fin » — карикатура на оптимизм Лейбница."},
{q:"« tout étant fait pour une fin » — étant fait это:",o:["gérondif","participe présent + participe passé (обстоятельство причины)","passif","infinitif"],a:1,e:"Причастный оборот с «ayant/étant» = книжная причина («поскольку всё создано для цели»)."}
]},
{
id:"r9", lv:"B2", title:"Préface des Misérables (extrait)", titleRu:"Предисловие к «Отверженным»", author:"Victor Hugo",
text:`Tant qu'il existera, par le fait des lois et des mœurs, une damnation sociale créant artificiellement, en pleine civilisation, des enfers, et compliquant d'une fatalité humaine la destinée qui est divine ; tant que les trois problèmes du siècle, la dégradation de l'homme par le prolétariat, la déchéance de la femme par la faim, l'atrophie de l'enfant par la nuit, ne seront pas résolus ; tant qu'il y aura sur la terre ignorance et misère, des livres de la nature de celui-ci pourront ne pas être inutiles.
Hauteville-House, 1er janvier 1862.`,
translation:`Пока существует, по вине законов и нравов, социальное проклятие, искусственно создающее в разгар цивилизации ады и осложняющее божественное предназначение человеческой судьбой; пока три проблемы века — деградация мужчины пролетариатом, падение женщины голодом, атрофия ребёнка ночью — не будут решены; пока на земле есть невежество и нищета, книги подобного свойства могут оказаться не бесполезными.
Отвиль-Хаус, 1 января 1862.`,
words:[["tant que","пока (не)"],["par le fait de","по вине, вследствие"],["les mœurs (f pl)","нравы"],["la damnation","проклятие"],["artificiellement","искусственно"],["en pleine civilisation","в разгар цивилизации"],["l'enfer (m)","ад"],["compliquer","осложнять"],["la fatalité","фатальность, рок"],["la destinée","предназначение, судьба"],["divin","божественный"],["la dégradation","деградация"],["le prolétariat","пролетариат"],["la déchéance","падение, упадок"],["l'atrophie (f)","атрофия"],["résoudre","решать"],["l'ignorance (f)","невежество"],["la misère","нищета"],["de la nature de","подобного свойства"],["inutile","бесполезный"]],
questions:[
{q:"Какая конструкция организует весь текст?",o:["Si... alors","Tant que... (трижды повторённое условие)","Bien que...","Quand même..."],a:1,e:"Анафора « tant que... tant que... tant que... » — риторический каркас."},
{q:"« des livres ... pourront ne pas être inutiles » — двойная уступка означает:",o:["книги бесполезны","книги могут оказаться полезными (литота)","книги запрещены","книги дороги"],a:1,e:"Литота: «не бесполезны» = полезны. Классический приём скромного утверждения."},
{q:"Les trois problèmes du siècle selon Hugo :",o:["la guerre, la paix, l'amour","l'homme, la femme, l'enfant dégradés par la misère","la loi, la religion, la science","le passé, le présent, l'avenir"],a:1,e:"Пролетариат (мужчина), голод (женщина), ночь (ребёнок)."},
{q:"« créant artificiellement des enfers » — créant это:",o:["passé simple","participe présent (обстоятельство)","subjonctif","gérondif с en"],a:1,e:"Participe présent без en — описание действия существительного (damnation... créant)."}
]}
);
