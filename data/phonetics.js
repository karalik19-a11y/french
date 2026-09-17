// Фонетика — Французский для Дани
window.DB = window.DB || {};
DB.phonetics = {
sounds: [
{sym:"y", ru:"«ю» без «й»: губы трубочкой как для «у», скажи «и»", tip:"Скажи «и», не меняя положения губ, вытяни их как для «у» — получится y.", ex:[["tu","ty","ты"],["rue","ʁy","улица"],["vu","vy","видел"],["sûr","syʁ","уверенный"]]},
{sym:"ø / œ", ru:"«ё» без «й»: нечто среднее между «о» и «э»", tip:"Скажи «э», округлив губы как для «о».", ex:[["deux","dø","два"],["peu","pø","мало"],["cœur","kœʁ","сердце"],["sœur","sœʁ","сестра"],["jeune","ʒœn","молодой"]]},
{sym:"ə", ru:"безударное «ё» (шва), часто выпадает", tip:"В быстрой речи проглатывается: «je» = «j'», «le» = «l'».", ex:[["je","ʒə","я"],["le","lə","опред. артикль"],["petit","pəti","маленький"]]},
{sym:"ɑ̃", ru:"носовое «а»: воздух идёт через нос", tip:"Скажи «а» и не закрывай носовой проход — звук гудит в носу.", ex:[["dans","dɑ̃","в"],["vent","vɑ̃","ветер"],["sans","sɑ̃","без"],["enchanté","ɑ̃ʃɑ̃te","очень приятно"]]},
{sym:"ɔ̃", ru:"носовое «о»", tip:"Как в слове «bon» — круглое и гудящее.", ex:[["bon","bɔ̃","хороший"],["nom","nɔ̃","имя"],["non","nɔ̃","нет"],["maison","mɛzɔ̃","дом"]]},
{sym:"ɛ̃", ru:"носовое «э», ближе к «я»", tip:"Скажи «эн» с носовым резонансом.", ex:[["vin","vɛ̃","вино"],["pain","pɛ̃","хлеб"],["matin","matɛ̃","утро"],["cinq","sɛ̃k","пять"]]},
{sym:"ʁ", ru:"французское «r»: мягкое, картавое, в горле", tip:"Не русское «р» на кончике языка! Звук у маленького язычка (увулы), как лёгкое полоскание горла. Тренируйся: «гррр» шёпотом.", ex:[["rouge","ʁuʒ","красный"],["Paris","paʁi","Париж"],["frère","fʁɛʁ","брат"],["regarder","ʁəɡaʁde","смотреть"]]},
{sym:"ʃ", ru:"«ш», но мягче — кончик языка ниже", tip:"Французское «ш» мягче русского: губы чуть вытянуты.", ex:[["chat","ʃa","кот"],["cher","ʃɛʁ","дорогой"],["chanson","ʃɑ̃sɔ̃","песня"]]},
{sym:"ʒ", ru:"«ж», тоже мягче русского", tip:"Пара к «ш»: voix/voix.", ex:[["je","ʒə","я"],["jour","ʒuʁ","день"],["rouge","ʁuʒ","красный"]]},
{sym:"ɥ", ru:"полугласное «юй»: как «ю» в «юбка», но мгновенно", tip:"Быстрый переход y→u: huit = «ɥит».", ex:[["huit","ɥit","восемь"],["nuit","nɥi","ночь"],["aujourd'hui","oʒuʁdɥi","сегодня"],["puis","pɥi","затем"]]},
{sym:"w", ru:"«у» полугласное (как в «уа»)", tip:"В сочетаниях oi, ou+гласная: moi = «муа».", ex:[["moi","mwa","я (ударн.)"],["oui","wi","да"],["weekend","wikɛnd","выходные"]]},
{sym:"j", ru:"«й» полугласное", tip:"В сочетаниях i+гласная, -ille, -ier: travail = «травай».", ex:[["yeux","jø","глаза"],["travail","tʁavaj","работа"],["fille","fij","девочка"],["famille","famij","семья"]]},
{sym:"e / ɛ", ru:"«э» закрытое (e) и открытое (ɛ)", tip:"é = закрытое «э» (улыбнись); è/ê = открытое (шире).", ex:[["été","ete","лето"],["très","tʁɛ","очень"],["mère","mɛʁ","мать"],["clé","kle","ключ"]]},
{sym:"a / ɑ", ru:"«а» переднее и заднее", tip:"В современном языке почти слились; â — чуть глубже.", ex:[["chat","ʃa","кот"],["pâte","pɑt","тесто"],["là","la","там"]]},
{sym:"o / ɔ", ru:"o закрытое (ô, au) и открытое (o)", tip:"ô — округлое глубокое «о»; o в открытом слоге — короткое.", ex:[["mot","mo","слово"],["hôtel","otɛl","отель"],["eau","o","вода"],["beau","bo","красивый"]]}
],
rules: [
{id:"ph-final", title:"Немые конечные согласные", text:"На конце слова НЕ читаются: d, g, p, s, t, x, z (запомни «CaReFuL» читаются: c, r, f, l — и то не всегда: blanc [блɑ̃], porc [пɔʁ]).", ex:["Paris [paʁi]","petit [pəti]","grand [ɡʁɑ̃]","mais [mɛ] — s немая","six [sis] — x = s"]}
,{id:"ph-ent", title:"-ent глаголов не читается", text:"Окончание мн.ч. глаголов -ent полностью немое: ils parlent = [il paʁl] — звучит как il parle!", ex:["ils parlent [il paʁl]","ils mangent [il mɑ̃ʒ]","elles viennent [ɛl vjɛn]"]}
,{id:"ph-liaison", title:"Связывание (liaison)", text:"Немая конечная согласная оживает перед словом на гласную: s/x→[z], t→[t], d→[t], n→[n]+носовая, p→[p] (редко). Обязательные: артикль+сущ. (les_amis), местоимение+глагол (vous_avez), прилаг.+сущ. (petit_enfant). Запрещены: после et, после паузы, перед «h aspiré» (les_haricots — без связки!).", ex:["les amis [lezami]","vous avez [vuzave]","ils ont [ilzɔ̃]","mon ami [mɔnami]","et alors [ealɔʁ] — НЕТ связки"]}
,{id:"ph-elision", title:"Усечение (élision)", text:"le, la, je, me, te, se, de, ce, ne, que, si (только перед il/ils), jusque теряют гласную перед гласным звуком: j'habite, l'homme, c'est, s'il.", ex:["j'aime","l'école","qu'il","s'il vous plaît","jusqu'ici"]}
,{id:"ph-accent", title:"Ударение и ритм", text:"Ударение всегда на ПОСЛЕДНЕМ произносимом слоге слова или группы: c'est formidABLE. Французский — слоговой язык: все слоги примерно равной длины, речь течёт как река. Смысловое выделение — интонацией и замедлением.", ex:["Pa-ri [paʁi]","la mai-son [lamɛzɔ̃]","Je suis très content [ʒəsɥitʁɛkɔ̃tɑ̃] — ударение на -tɑ̃"]}
,{id:"ph-enchainement", title:"Сцепление (enchaînement)", text:"Слышимая конечная согласная сливается со следующим гласным в новый слог: elle a = [ɛ.la], elle ouvre = [ɛ.luvʁ].", ex:["elle a [ɛla]","elle ouvre [ɛluvʁ]","prenez-en [pʁəne.zɑ̃]"]}
,{id:"ph-h", title:"h muet и h aspiré", text:"Обе «h» немые, но h muet допускает élision и liaison: l'homme, les_hommes. h aspiré запрещает: le héros, la haine (не l'héros!). Словарь помечает h aspiré значком (').", ex:["l'homme (h muet)","le héros (h aspiré)","l'habitude","la haie"]}
,{id:"ph-e-final", title:"e конечное", text:"-e на конце слова немое, но даёт «открытость» предыдущему слогу и сигнализирует ж.р.: petite [pətit] — t звучит!", ex:["petite [pətit]","rouge [ʁuʒ]","table [tabl]"]}
,{id:"ph-doubles", title:"Двойные согласные", text:"Обычно читаются как одна: donner [dɔne]. Но: ll после i часто = [j]: famille [famij]; однако mille [mil], ville [vil], tranquille [tʁɑ̃kil]. nn в -onner = [n]: donner. rr усиливается в courir, mourir, pouvoir: [kuʁiʁ]...", ex:["fille [fij]","million [miljɔ̃]","ville [vil]","gentil [ʒɑ̃ti]"]}
],
pairs: [
["dessus","dessous","сверху [dəsy]","снизу [dəsu]"],["jeune","jeûne","молодой [ʒœn]","пост [ʒøn]"],["dessert","désert","десерт [desɛʁ]","пустыня [dezɛʁ] — одна s = [z]!"],["poisson","poison","рыба [pwasɔ̃]","яд [pwazɔ̃] — ss vs s"],["coussin","cousin","подушка [kusɛ̃]","кузен [kuzɛ̃]"],["mettre","maître","класть [mɛtʁ]","хозяин [mɛtʁ] — омонимы!"],["vert","verre","зелёный [vɛʁ]","стакан [vɛʁ]"],["son","sont","его [sɔ̃]","они есть [sɔ̃]"],["ça","sa","это [sa]","её [sa]"],["ce","se","этот [sə]","себя [sə]"],["sang","sans","кровь [sɑ̃]","без [sɑ̃]"],["chant","champ","пение [ʃɑ̃]","поле [ʃɑ̃]"],["tant","temps","столько [tɑ̃]","время [tɑ̃]"],["mais","met","но [mɛ]","кладёт [mɛ]"],["tante","tente","тётя [tɑ̃t]","палатка [tɑ̃t]"],["voix","voie","голос [vwa]","путь [vwa]"],["sot","seau","глупый [so]","ведро [so]"],["mère","maire","мать [mɛʁ]","мэр [mɛʁ]"],["foi","fois","вера [fwa]","раз [fwa]"],["pain","pin","хлеб [pɛ̃]","сосна [pɛ̃]"]],
twisters: [
{fr:"Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches ?",ru:"Сухие ли носки у эрцгерцогини, архисухие?",lv:"A2",focus:"[ʃ] / [s]"},
{fr:"Un chasseur sachant chasser doit savoir chasser sans son chien.",ru:"Охотник, умеющий охотиться, должен уметь охотиться без собаки.",lv:"B1",focus:"[ʃ] / [s]"},
{fr:"Poisson sans boisson est poison.",ru:"Рыба без напитка — яд.",lv:"A1",focus:"ss/s — [s]/[z]"},
{fr:"Ta tante t'a tenté, ta tante t'a tenté.",ru:"Твоя тётя тебя соблазнила...",lv:"A1",focus:"[t] / [ɑ̃]"},
{fr:"Si six scies scient six cyprès, six cent six scies scient six cent six cyprès.",ru:"Если шесть пил пилят шесть кипарисов...",lv:"B1",focus:"[si]/[sɛ̃]"},
{fr:"Je suis ce que je suis, et si je suis ce que je suis, qu'est-ce que je suis ?",ru:"Я есть то, что я есть...",lv:"B1",focus:"[sɥi]/[sɥi]"},
{fr:"Trois tortues trottaient sur trois toits très étroits.",ru:"Три черепахи трусили по трём очень узким крышам.",lv:"B1",focus:"[tʁ]/[tʁw]"},
{fr:"Un rat gris rôdait autour d'un tas de riz.",ru:"Серая крыса рыскала вокруг кучи риса.",lv:"B2",focus:"[ʁ]"},
{fr:"Combien sont ces six saucissons-ci ? Ces six saucissons-ci sont six sous.",ru:"Сколько стоят эти шесть сосисок? Шесть су.",lv:"B1",focus:"[sɔ̃]/[su]"},
{fr:"Fuyez les foules folles et les fous qui fouillent les foules.",ru:"Избегай безумных толп и безумцев, роющихся в толпах.",lv:"C1",focus:"[f]/[uj]"}]
};
