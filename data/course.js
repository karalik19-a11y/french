// Структура курса — Французский для Дани
// 8 уровней: A1 старт → C1. Каждый юнит: грамматика, темы слов, глаголы, чтение, диалоги.
window.DB = window.DB || {};
DB.course = [
{
lv:1, cefr:"A1", title:"Старт: звук, слово, фраза",
desc:"Правила чтения, первые глаголы, артикли, отрицание, вопросы. Цель: читать вслух любой простой текст, представиться, спросить и понять ответ.",
pass:80,
units:[
{title:"Как читается французский", goals:["Читать вслух по правилам","Знать носовые звуки и liaison","Понимать, зачем артикль"], grammar:["fr-overview","reading-rules"], themes:["Основы","Вежливость"], verbs:[], phon:["ph-final","ph-liaison","ph-elision"]},
{title:"Быть, иметь, говорить", goals:["Спрягать être и avoir","Спрягать глаголы -er","Сказать, кто ты и что делаешь"], grammar:["etre","avoir","verbes-er"], themes:["Основы","Люди","Семья","Глаголы"], verbs:["être","avoir","parler","aimer","habiter","travailler","regarder","écouter"], phon:["ph-ent","ph-accent"]},
{title:"Отрицание, вопрос, счёт", goals:["Отрицать и спрашивать 3 способами","Считать до 100, сказать время и дату"], grammar:["negation","questions","numbers-time"], themes:["Числа","Время","Вопросы"], verbs:["demander","répondre","compter"], phon:[]},
{title:"Существительное и его свита", goals:["Определять род и число","Правильно выбирать артикль"], grammar:["articles","nouns-gender"], themes:["Еда","Напитки","Цвета","Дом"], verbs:["manger","boire","vouloir","acheter"], phon:["ph-e_final","ph-h"]}
]},
{
lv:2, cefr:"A1+", title:"Мой мир и мои планы",
desc:"Описываем себя, город, страну; строим планы (futur proche), приказываем (impératif). Цель: базовый разговор о повседневности.",
pass:80,
units:[
{title:"Моё, твоё, это, там", goals:["Говорить о принадлежности и месте","Называть страны и города с правильным предлогом"], grammar:["possessifs","demonstratifs","prepositions-lieu","pays-villes"], themes:["Дом","Город","Предлоги","Транспорт"], verbs:["aller","venir","être"], phon:[]},
{title:"Описание и вежливость", goals:["Согласовывать прилагательные","Общаться вежливо: tu или vous"], grammar:["adjectifs","tu-vous"], themes:["Прилагательные","Одежда","Люди","Вежливость"], verbs:["trouver","sembler","porter"], phon:[]},
{title:"Время вокруг настоящего", goals:["Говорить о ближайшем будущем и недавнем прошлом","Приказывать и просить"], grammar:["futur-proche","passe-recent","impératif-a1"], themes:["Время","Природа","Работа","Профессии"], verbs:["aller","venir","faire","finir"], phon:["ph-accent"]}
]},
{
lv:3, cefr:"A2", title:"Машина времени: прошедшее и будущее",
desc:"Главный уровень разговорной свободы: passé composé, imparfait, их противопоставление, futur simple. Цель: рассказывать истории о прошлом и строить планы.",
pass:80,
units:[
{title:"Passé composé", goals:["Образовывать причастия (в т.ч. неправильные)","Знать 16 глаголов с être","Согласовывать причастие"], grammar:["pc-avoir","pc-etre"], themes:["Чувства","Характер"], verbs:["faire","prendre","voir","dire","écrire","mettre","lire","boire","venir","aller","naître","mourir","partir","rester","tomber"], phon:[]},
{title:"Imparfait и фон прошлого", goals:["Образовывать imparfait","Различать passé composé и imparfait в рассказе"], grammar:["imparfait","pc-vs-imp"], themes:["Внешность","Хобби"], verbs:["être","avoir","vouloir","pouvoir","savoir","devoir"], phon:[]},
{title:"Будущее и вежливая мечта", goals:["Образовывать futur simple (включая неправильные основы)","Вежливо просить и советовать (conditionnel)"], grammar:["futur-simple","conditionnel-present"], themes:["Путешествия","Покупки"], verbs:["être","avoir","aller","faire","venir","voir","vouloir","pouvoir","devoir","savoir","envoyer","recevoir"], phon:[]}
]},
{
lv:4, cefr:"A2+", title:"Местоимения и точность",
desc:"Речь становится плотной: COD/COI, y, en, возвратные глаголы, сравнения, первые относительные. Цель: говорить компактно, как француз.",
pass:80,
units:[
{title:"Маленькие заменители", goals:["Заменять дополнения местоимениями","Ставить их в правильном порядке"], grammar:["cod","coi","y-en"], themes:["Связь","Покупки"], verbs:["donner","dire","demander","répondre","téléphoner","penser","aller"], phon:[]},
{title:"Возвратность и сравнение", goals:["Спрягать и согласовывать возвратные глаголы","Сравнивать и выделять лучшее"], grammar:["reflexive","comparatif","adverbes-ment"], themes:["Характер","Здоровье"], verbs:["se lever","se laver","se souvenir","s'appeler","se promener"], phon:[]},
{title:"Глагольные связи и первые «которые»", goals:["Знать à/de-глаголы наизусть","Строить фразы с qui/que"], grammar:["a-de-infinitif","relatifs-qui-que"], themes:["Хобби","Путешествия","Наречия A2"], verbs:["commencer","finir","essayer","oublier","décider","douter"], phon:[]}
]},
{
lv:5, cefr:"B1", title:"Subjonctif и мир субъективности",
desc:"Ключевой порог: субжонктив, dont, условные конструкции, gérondif, сожаления. Цель: выражать не только факты, но и отношение — желание, сомнение, чувство.",
pass:80,
units:[
{title:"Subjonctif: форма", goals:["Образовывать subjonctif présent (включая 9 неправильных)","Знать субжонктив-маркеры наизусть"], grammar:["subjonctif-present","subjonctif-usage"], themes:["Мнение","Работа B1"], verbs:["être","avoir","aller","faire","pouvoir","savoir","vouloir","venir","prendre","voir"], phon:[]},
{title:"Который, о котором", goals:["Различать qui/que/dont/où/lequel","Говорить о причине и количестве через dont"], grammar:["dont","ou-lequel"], themes:["Образование","Медиа"], verbs:["parler","se souvenir","rêver","manquer"], phon:[]},
{title:"Если бы да кабы", goals:["Три типа si-конструкций","Conditionnel passé: сожаление и упрёк","Gérondif и participe présent"], grammar:["conditionnel-passe","si-clauses","gerondif"], themes:["Абстракции","Общество"], verbs:["devoir","pouvoir","vouloir","savoir","faire"], phon:[]}
]},
{
lv:6, cefr:"B1+", title:"Сложный синтаксис",
desc:"Пассив, косвенная речь со сдвигом времён, логические связки, полный порядок местоимений, все тонкости согласования причастий. Цель: строить аргументированный связный текст.",
pass:85,
units:[
{title:"Перестройка фразы", goals:["Пассив в любом времени","Косвенная речь и сдвиг времён","Приказы в косвенной речи"], grammar:["passif","discours-indirect"], themes:["Общество","Технологии"], verbs:["être","avoir","dire","demander","répondre"], phon:[]},
{title:"Логика и оценка", goals:["Связки причины, следствия, уступки","Безличные обороты с subjonctif/indicatif"], grammar:["connecteurs","impersonnels"], themes:["Связки","Экология","Наука"], verbs:["falloir","sembler","paraître","valoir"], phon:[]},
{title:"Местоимения: высший порядок", goals:["Двойные местоимения в любой позиции","Все правила согласования participe passé"], grammar:["pronoms-ordre","participe-passe-acords"], themes:["Искусство","Мнение"], verbs:["donner","envoyer","montrer","prêter","dire"], phon:[]}
]},
{
lv:7, cefr:"B2", title:"Литературный язык",
desc:"Время читать Мопассана в оригинале: passé simple, литературные субжонктивы, ne explétif, эмфаза, три регистра, идиоматические конструкции. Цель: понимать книги, фильмы без субтитров, прессу.",
pass:85,
units:[
{title:"Времена литературы", goals:["Читать и узнавать passé simple","Subjonctif passé/imparfait/plus-que-parfait — узнавание в тексте"], grammar:["passe-simple","subjonctif-passe-imparfait"], themes:["Книжный","Экономика"], verbs:["être","avoir","venir","faire","voir","pouvoir","savoir","vouloir","naître","mourir"], phon:[]},
{title:"Тонкости отрицания и выделения", goals:["Понимать ne explétif и craindre que","Выделять смысл: c'est...qui, дислокация"], grammar:["ne-expletif","mise-relief"], themes:["Формальный","Глаголы B2"], verbs:["craindre","douter","nier","avouer"], phon:[]},
{title:"Регистры и идиомы", goals:["Переключать разговорный/нейтральный/книжный","Использовать avoir beau, finir par, ne faire que"], grammar:["style-registres","constructions-avancees"], themes:["Формальный","Книжный"], verbs:["finir","laisser","faire","bouleverser"], phon:["ph-liaison"]}
]},
{
lv:8, cefr:"C1", title:"Свободное чтение и нюансы",
desc:"Финальная прямая: ложные друзья, tout во всех ролях, журналистский conditionnel, стратегия чтения классики. Цель: читать Гюго и Камю, чувствовать нюансы, говорить без кальки с русского.",
pass:85,
units:[
{title:"Ловушки для иностранца", goals:["Не попадаться на faux amis","Говорить idiomatiquement: actuellement, si!, tu me manques"], grammar:["faux-amis"], themes:["Книжный","Формальный"], verbs:[], phon:[]},
{title:"Tout и эмфаза C1", goals:["Tout: прилагательное/наречие/местоимение","Книжная инверсия и дислокация в своей речи"], grammar:["tout-accent"], themes:["Книжный"], verbs:[], phon:[]},
{title:"Читаем классику", goals:["Стратегия чтения: 95%, интенсивно/экстенсивно","Разбирать Камю, Вольтера, Гюго со словарём и без"], grammar:["lecture-classiques"], themes:["Книжный"], verbs:[], phon:["ph-liaison","ph-elision"]}
]}
];
