export const artists = [
  {
    id: "pinkpantheress",
    name: "PinkPantheress",
    isGlobal: true,
    photo: "https://i.postimg.cc/qqcQVQhK/bc3d7803e848507be733894cc62bf33c.jpg",
    banner: "https://i.postimg.cc/XJdkdxgw/IMG-20260603-210153.jpg",
  },
  {
    id: "ksivat",
    name: "Ksivat",
    photo: "https://i.postimg.cc/j2v0Q6bv/IMG-20260514-235230.jpg",
    banner:
      "https://i.postimg.cc/JzjhqSHB/IMG-20260531-030824.png",
  },
  {
    id: "dollova",
    name: "Dollova",
    photo: "https://i.postimg.cc/Dy1Fqykg/IMG-6491.jpg",
    banner: "https://i.postimg.cc/mktPbr3s/IMG-6757.png",
  },
  {
    id: "sicka",
    name: "SiCka",
    photo:
      "https://i.postimg.cc/qvjFRr5h/file-00000000b3847246a591c6d24c9554c1.png",
    banner:
      "https://i.postimg.cc/ZKKYKdVY/file-00000000174471f494946ff02adc6dd1.png",
  },
  {
    id: "various-artists",
    name: "Various Artists",
    photo: "https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg",
  },
  {
    id: "avya-asti",
    name: "АВЯ ASTI",
    photo: "https://i.postimg.cc/4dn98FKs/IMG-20260508-153413-715.jpg",
    banner: "https://i.postimg.cc/FF7GpqCY/IMG-7437.jpg",
  },
  {
    id: "pavlova-cookie",
    name: "Pavlova Cookie",
    photo: "https://i.postimg.cc/pyM5LWqw/IMG-20260508-153358-589.jpg",
    banner: "https://i.postimg.cc/WzChtPS9/IMG-20260524-015124-491.jpg",
  },
  {
    id: "niksa",
    name: "NIK$A",
    photo: "https://i.postimg.cc/pLtK2ZSs/IMG-20260508-153516.jpg",
  },
  {
    id: "ariana-grande",
    name: "Ariana Grande",
    photo: "https://i.postimg.cc/mk2WmBGq/IMG-20260516-160421-081.jpg",
    banner: "https://i.postimg.cc/7hWVzDkB/IMG-20260524-190314-323.jpg",
    isGlobal: true,
  },
  {
    id: "ice-spice",
    name: "Ice Spice",
    photo: "https://i.scdn.co/image/ab6761610000e5ebab47bb63dae13065213602cd",
    banner: "https://ca.billboard.com/media-library/ice-spice-pretty-privilege.webp?id=62084782&width=1200&height=800&quality=50&coordinates=0%2C0%2C0%2C0",
    isGlobal: true,
  },
  {
    id: "miroslava-daydream",
    name: "Мирослава DayDream",
    photo: "https://i.postimg.cc/9QxsNRVj/image.png",
    banner: "",
    isGlobal: true,
  },
  {
    id: "le-sserafim",
    name: "LE SSERAFIM",
    photo: "https://i.pinimg.com/736x/32/9e/b9/329eb93b6dda59fe680b971587a9b90f.jpg",
    banner: "https://i.pinimg.com/1200x/9d/8c/8f/9d8c8f5f33c1bd085c9db2f0269065a8.jpg",
    isGlobal: true,
  },
  {
    id: "illit",
    name: "ILLIT",
    photo: "https://i.pinimg.com/736x/0d/68/70/0d6870f19020b4c9a9055a3f1466d8a0.jpg",
    banner: "https://i.pinimg.com/736x/7c/33/08/7c3308266ab2dfa627d2a3bac4831a09.jpg",
    isGlobal: true,
  },
  {
    id: "katseye",
    name: "KATSEYE",
    photo: "https://i.pinimg.com/736x/8b/d1/83/8bd18330980e6e69f32edf48dbca6a4b.jpg",
    banner: "https://i.pinimg.com/736x/6c/2b/74/6c2b7447bfcb17510b43d38bb4a1ef60.jpg",
    isGlobal: true,
  },
  {
    id: "nicki-minaj",
    name: "Nicki Minaj",
    photo: "https://images.genius.com/f568a5e5bed1359d4e05d7941ca89259.1000x1000x1.png",
    banner: "https://media.vanityfair.com/photos/6980ee31e6c090bec7779d3a/16:9/w_4640,h_2610,c_limit/2258679012",
    isGlobal: true,
  },
];

export const reviews = [
  {
    id: "le-sserafim-illit-katseye-iconic-by-mistake",
    artistId: "le-sserafim",
    artistIds: ["le-sserafim", "illit", "katseye"],
    title: "ICONIC BY MISTAKE",
    author: "Ksivat",
    label: "Belift Lab, Source Music, Hybe UMG LLC",
    cover: "https://images.genius.com/2490443ab3bb86b158db8f04b5e589da.1000x1000x1.png",
    releaseDate: "2026-06-12",
    reviewDate: "2026-06-25T12:00:00Z",
    text: "Яркий и динамичный трек, который идеально объеденил вокальные стили трёх групп. Песня мгновенно захватывает внимание мощным битом и запоминающимся припевом. Девочки сделали ответку всем хейтерам, сделав хит.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 }
    ],
  },
  {
    id: "nicki-minaj-pink-friday",
    artistId: "nicki-minaj",
    title: "Pink Friday",
    author: "satanclub",
    label: "Young Money",
    cover: "https://i.postimg.cc/QdBBYzWB/IMG-20260624-235956-088.jpg",
    releaseDate: "2010-11-22",
    reviewDate: "2026-06-25T12:00:00Z",
    text: "I’m cumming 🌸",
    tracks: [
      { title: "I’m The Best ", score: 10 },
      { title: "Roman's Revenge (feat. Eminem)", score: 10 },
      { title: "Did It On'em", score: 10 },
      { title: "Right Thru Me", score: 10 },
      { title: "Fly (feat. Rihanna)", score: 10 },
      { title: "Save Me", score: 9 },
      { title: "Moment 4 Life (feat. Drake)", score: 9 },
      { title: "Check It Out (feat. will.i.am)", score: 10 },
      { title: "Blazin' (feat. Kanye West)", score: 10 },
      { title: "Here I Am", score: 8 },
      { title: "Deat Old Nicki", score: 9 },
      { title: "Your Love", score: 10 },
      { title: "Last Chance (feat. Natasha Bedingfield)", score: 8 },
      { title: "Super Bass", score: 10 },
      { title: "Blow Ya Mind", score: 10 },
      { title: "Muny", score: 10 },
      { title: "Wave Ya Hand", score: 9 },
      { title: "Catch Me", score: 9 },
      { title: "Girls Fall Like Dominoes", score: 9 }
    ],
    criteria: [
      { title: "Биты", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 10 }
    ],
  },
  {
    id: "miroslava-daydream-devochka-ferrari",
    artistId: "miroslava-daydream",
    title: "Девочка Феррари",
    author: "Dollova",
    label: "NEWBIES",
    cover: "https://i.postimg.cc/9QxsNRVj/image.png",
    releaseDate: "2025-11-13",
    reviewDate: "2026-06-25T12:00:00Z",
    text: "Королева проката машин выпускает трек о девочке Феррари, тем самым намекая на себя. В её салоне не только большие машинки, но и большие мужчинки, которые продают эти машинки.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 8 }
    ],
  },
  {
    id: "ice-spice-y2k",
    artistId: "ice-spice",
    title: "Y2K!",
    author: "SiCka",
    label: "Capitol Records",
    cover: "https://images.genius.com/7bbbd6fc77967a62e0b07407296c8695.1000x1000x1.png",
    releaseDate: "2024-07-26",
    reviewDate: "2026-06-25T12:00:00Z",
    text: "Рэперка представляет свой дебютный альбом, который приглашает услышать настоящий Бронкский стиль хип-хопа, откуда сама Айсис родом. Каждый трек на этом альбоме по своему хорош, и тут максимум полускипы, проблема может быть в том, понял ли слушатель звук произведения или нет. Это серьезный релиз, который, к сожалению, не смог обрести широкой популярности, хотя очень даже заслуживает её.",
    tracks: [
      { title: "Phat Butt", score: 10 },
      { title: "Oh Shh... (with Travis Scott)", score: 9 },
      { title: "Popa", score: 9 },
      { title: "Bitch I'm Packin' (with Gunna)", score: 7 },
      { title: "Plenty Sun", score: 8 },
      { title: "Did It First (with Central Cee)", score: 10 },
      { title: "BB Belt", score: 10 },
      { title: "Think U The Shit (Fart)", score: 10 },
      { title: "Gimmie A Light", score: 10 },
      { title: "TTYL", score: 8 }
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 }
    ],
  },
  {
    id: "pinkpantheress-fancy-that-mixtape",
    artistId: "pinkpantheress",
    title: "Fancy That Mixtape",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd66Lmuwd0cKtH6uQpCZv2U1tOnaXWR4xTS1P2Y0fNiw&s=10",
    releaseDate: "2025-05-09",
    reviewDate: "2026-06-03T12:00:00Z",
    reviewDateDisplay: "09.05.2025 / 03.06.2026 (новая)",
    label: "Warner Redorda",
    text: "Короткий, но очень цельный микстейп, в котором PinkPantheress мастерски смешивает UK garage, jungle и ностальгический поп начала 2000-х. Проект звучит легко и игриво, но при этом показывает заметный рост артистки как автора и продюсера.",
    tracks: [
      { num: 1, title: "Illegal", score: 10 },
      { num: 2, title: "Girl Like Me", score: 10 },
      { num: 3, title: "Tonight", score: 10 },
      { num: 4, title: "Stars", score: 8 },
      { num: 5, title: "Intermission" },
      { num: 6, title: "Noises", score: 10 },
      { num: 7, title: "Nice to Know You", score: 9 },
      { num: 8, title: "Stateside", score: 10 },
      { num: 9, title: "Romeo", score: 9 }
    ],
    criteria: [
      { title: "Биты", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 10 }
    ],
  },
  {
    id: "dollova-melon18-single",
    artistId: "dollova",
    isSingle: true,
    title: "MELON 18+",
    cover: "https://i.postimg.cc/xjHN6tkM/IMG-6891.jpg",
    releaseDate: "2026-05-22",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "DirtyDollyRecords",
    text: "Достаточно сексуальный несексуальный, по первой задумке, сингл с третьего альбома рэперки. Да, это явный эталон качества не только Долловой, но и всей хуендустрии. Обложка идеально подходит для рекламы OnlyFans / Fansly.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 }
    ]
  },
  {
    id: "dollova-madam-cum-single",
    artistId: "dollova",
    isSingle: true,
    title: "Madam Cum",
    cover: "https://i.postimg.cc/NFLTr2Wv/IMG-7016.png",
    releaseDate: "2025-10-31",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "DirtyDollyRecords",
    text: "Игривооскорбляющая подача даёт одновременно и «какого хуя», и «ммм».",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "dollova-ugly-doll-single",
    artistId: "dollova",
    isSingle: true,
    title: "Ugly Doll",
    cover: "https://i.postimg.cc/wMHsTVmx/IMG-7142.png",
    releaseDate: "2026-01-30",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "DirtyDollyRecords",
    text: "Немного по-хайпер-попски, что для артистки немного в новинку, но она все равно справляется с этим.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 }
    ]
  },
  {
    id: "dollova-bot-hitches-single",
    artistId: "dollova",
    isSingle: true,
    title: "Bot Hitches",
    cover: "https://i.postimg.cc/6pvgc7pG/IMG-7212.png",
    releaseDate: "2025-11-14",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "DirtyDollyRecords",
    text: "Тётка разбушевалась и голос кажется, как из видео «быстро убрала телефон и собрала игрушки».",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 }
    ]
  },
  {
    id: "dollova-livaj-single",
    artistId: "dollova",
    isSingle: true,
    title: "ливай",
    cover: "https://i.postimg.cc/PqjdRC3y/IMG-7216.png",
    releaseDate: "2025-07-25",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "DirtyDollyRecords",
    text: "Мелодичный поп-рэп-трек, который можно было назвать РнБ, но я не буду.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 }
    ]
  },
  {
    id: "sicka-shut-that-hole-up-single",
    artistId: "sicka",
    isSingle: true,
    title: "Shut That Hole Up",
    cover: "https://i.postimg.cc/cHy8XtNZ/file-00000000295871f4a79edf3520349906.png",
    releaseDate: "2026-04-26",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Farting Lesbians",
    text: "Даёт по ебалу и затыкает не рот, а жопу.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "sicka-perdanovna-single",
    artistId: "sicka",
    isSingle: true,
    title: "Пердановна",
    cover: "https://i.postimg.cc/X7rcrQrC/file-000000004ce8720ab5e3de8b15eb3f0f.png",
    releaseDate: "2025-10-29",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / SiCka",
    text: "Заедающее отчество — что-то новое и слава богу.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 }
    ]
  },
  {
    id: "sicka-smack-it-up-single",
    artistId: "sicka",
    isSingle: true,
    title: "Smack It Up",
    cover: "https://i.postimg.cc/G2CHk0kH/file-000000005f4c7246b7efcdefcab34c8b.png",
    releaseDate: "2025-11-16",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Farting Lesbians",
    text: "Танцевальный cunty трек, который предлагает заставить слушателя заставить артистку рыгать.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "sicka-slayyyter-fspr-single",
    artistId: "sicka",
    artistIds: ["sicka"],
    isSingle: true,
    title: "FSPR (feat. Slayyyter)",
    cover: "https://i.postimg.cc/wMFyqWRX/file-000000005fcc71f482a1219bd4bef365.png",
    releaseDate: "2025-07-13",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / SiCka",
    text: "Воссоединение двух артисток, которых различить можно, только если послушать первую версию трека.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "sicka-dermishche-single",
    artistId: "sicka",
    isSingle: true,
    title: "Дерьмище",
    cover: "https://i.postimg.cc/TYCgfPnS/file-00000000114071f4838047bcc69b0f5a.png",
    releaseDate: "2025-09-21",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / SiCka",
    text: "Молитва, канон и все что угодно в одном лице. Вам нужно это услышать и выучить наизусть, иначе я не знаю, зачем вы существуете вообще в хуендустрии.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "sicka-im-ready-single",
    artistId: "sicka",
    isSingle: true,
    title: "I'M READY",
    cover: "https://i.postimg.cc/63bxBn5Z/file-00000000543471f4873127e283c7fb28.png",
    releaseDate: "2025-07-22",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / SiCka",
    text: "Трек из неудавшегося микстейпа. Из синглов было настолько нечего выбрать на этом релизе, что... Что?",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 9 }
    ]
  },
  {
    id: "sicka-suck-tomorrow-single",
    artistId: "sicka",
    isSingle: true,
    title: "SUCK TOMORROW",
    cover: "https://i.postimg.cc/pX6rs5DG/file-0000000025047246a15e7c4673f9447c.png",
    releaseDate: "2025-12-01",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Farting Lesbians",
    text: "Artist promoted this track everywhere, but no one heard it. The extremely narrow genre in the industry makes this track unnoticed. But in vain.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "sicka-and-my-pussy-ah-single",
    artistId: "sicka",
    isSingle: true,
    title: "And My Pussy-ah",
    cover: "https://i.postimg.cc/Pf65qvFp/file-000000007d487243a4e157e11f6c8d77.png",
    releaseDate: "2025-06-26",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / SiCka",
    text: "Данный трек нужно слушать в первую очередь, если хотите ознакомиться с творчеством SiCka.",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 7 }
    ]
  },
  {
    id: "sicka-cksu-single",
    artistId: "sicka",
    isSingle: true,
    title: "CkSu",
    cover: "https://i.postimg.cc/90zV91NL/file-00000000580071f4b1e69d63104d75ce.png",
    releaseDate: "2025-05-17",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / SiCka",
    text: "Мне нечего сказать.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 }
    ]
  },
  {
    id: "avya-asti-baby-single",
    artistId: "avya-asti",
    isSingle: true,
    title: "BABY",
    cover: "https://i.postimg.cc/YC8b4ZYY/IMG-20260508-151118-057.jpg",
    releaseDate: "2026-03-21",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "OOO LABLE MALIK DELGATY AND AVEE ASTI",
    text: "Очень коммерческий трек, который вызывает драйв своим припевом и даёт либидо.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 }
    ]
  },
  {
    id: "avya-asti-strap-on-single",
    artistId: "avya-asti",
    isSingle: true,
    title: "STRAP ON",
    cover: "https://i.postimg.cc/Kz23rvPb/IMG-20260508-144517-057.jpg",
    releaseDate: "2026-01-23",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / АВЯ ASTI",
    text: "Для секса в душе.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 }
    ]
  },
  {
    id: "avya-asti-bdsm-single",
    artistId: "avya-asti",
    isSingle: true,
    title: "BDSM",
    cover: "https://i.postimg.cc/1X0snxPn/IMG-20260507-222633-360.jpg",
    releaseDate: "2025-06-20",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Independent / АВЯ ASTI",
    text: "Ну.",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 }
    ]
  },
  {
    id: "niksa-puffmeedy-single",
    artistId: "niksa",
    isSingle: true,
    title: "PuffMeedy",
    cover: "https://i.postimg.cc/1zcjx9mQ/IMG-20260507-231349-872.jpg",
    releaseDate: "2025-07-26",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Yandex Market Records",
    text: "Дисс-трек, который предназначен в сторону креветятины. Забавно наблюдать за тем, как они сейчас лучшие подруги.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 }
    ]
  },
  {
    id: "pavlova-cookie-govno-na-ventiljator-single",
    artistId: "pavlova-cookie",
    isSingle: true,
    title: "ГОВНО НА ВЕНТИЛЯТОР",
    cover: "https://i.postimg.cc/nhHJCwXF/IMG-20260507-232554-471.jpg",
    releaseDate: "2025-08-22",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Yandex Market Records",
    text: "Немного дисс, немного говно, и я про название, а не про то, что трек плохого качества.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 }
    ]
  },
  {
    id: "pavlova-cookie-skinny-jeanz-single",
    artistId: "pavlova-cookie",
    isSingle: true,
    title: "skinny jeanz",
    cover: "https://i.postimg.cc/FRHjfRpB/IMG-20260508-213011-967.jpg",
    releaseDate: "2026-05-09",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "YMR & Farting Lesbians",
    text: "Ранее входивший во второй альбом артистки сингл вошёл в мою жопу.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 1 }
    ]
  },
  {
    id: "pavlova-cookie-vne-ocheredi-single",
    artistId: "pavlova-cookie",
    isSingle: true,
    title: "ВНЕ ОЧЕРЕДИ",
    cover: "https://i.postimg.cc/Y2JwkCNB/IMG-20260507-224606-965.jpg",
    releaseDate: "2025-06-28",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Yandex Market Records",
    text: "Артистка умоляет, чтобы ей было хорошо.",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 }
    ]
  },
  {
    id: "ariana-grande-we-cant-be-friends-single",
    artistId: "ariana-grande",
    isSingle: true,
    title: "we can't be friends (wait for your love)",
    cover: "https://i.postimg.cc/0NLmTyZj/IMG-20260527-225945-177.jpg",
    releaseDate: "2024-07-19",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Republic Records",
    text: "Очень нежный и холодный одновременно трек — будто танцуешь и грустишь в один момент. Синты и вокал создают ощущение красивого эмоционального отдаления, которое долго не отпускает.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 }
    ]
  },
  {
    id: "ariana-grande-hate-that-i-made-you-love-me-single",
    artistId: "ariana-grande",
    isSingle: true,
    title: "hate that i made you love me",
    cover: "https://images.genius.com/460168ceb0f9e0c6637bd802d65aaf43.1000x1000x1.png",
    releaseDate: "2026-05-29",
    reviewDate: "2026-05-29T00:00:00Z",
    label: "Babydoll Music",
    text: "Новый сингл поп-артистки звучит нежно, холодно и очень лично. Ариана будто шепчет сожаление прямо в ухо, а минималистичный продакшн только усиливает это чувство. Трек открывает эру грядущего восьмого альбома «petal» по-музыкальному и является лид-синглом к нему.",
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 }
    ]
  },
  {
    id: "ariana-grande-twilight-zone-single",
    artistId: "ariana-grande",
    isSingle: true,
    title: "twilight zone",
    cover: "https://i.postimg.cc/k5tRvd9F/IMG-20260527-230032-827.jpg",
    releaseDate: "2025-06-20",
    reviewDate: "2026-05-27T00:00:00Z",
    label: "Republic Records",
    text: "Ариана звучит так, будто она пытается понять, была ли прошлая любовь вообще реальной или это был странный сон. Трек очень воздушный и меланхоличный — у него вайб ночной поездки по пустому городу после эмоционального выгорания.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 10 }
    ]
  },
  {
    id: "various-artists-huevision-2026-ep",
    artistId: "various-artists",
    title: "Huevision 2026 — The Official Album EP",
    cover: "https://i.postimg.cc/htM2dHcr/file-00000000b90c7246b04a6c0cd0d4d2aa.png",
    releaseDate: "2026-06-13",
    reviewDate: "2026-06-15",
    label: "HUEVKI",
    text: "В плане организации, дизайна, масштабности и так далее, этот год пробивает потолок по сравнению с прошлым, но в плане качества все не сильно лучше, хотя мне стоит сделать снова переоценку 2025 года. Все треки конкурса имели шанс забрать топ-3, но вышло как вышло. Подводя итог, никто из артисток не отдал свой лучший материал для конкурса, но это необязательное условие, так что все хорошо.",
    tracks: [
      { title: "Dollova — BIKINI", score: 8, singleId: "dollova-bikini-huevision-2026-single" },
      { title: "Pavlova Cookie — даяизворонежа", score: 8, singleId: "pavlova-cookie-dayaizvoronezha-huevision-2026-single" },
      { title: "SiCka — Revō", score: 9, singleId: "sicka-revo-huevision-2026-single" },
      { title: "Ksivat — Song #1", score: 9, singleId: "ksivat-song-1-huevision-2026-single" },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "dollova-bikini-huevision-2026-single",
    artistId: "dollova",
    title: "BIKINI from Huevision 2026",
    cover: "https://i.postimg.cc/htM2dHcr/file-00000000b90c7246b04a6c0cd0d4d2aa.png",
    releaseDate: "2026-06-13",
    reviewDate: "2026-06-15",
    label: "HUEVKI",
    text: "Попытка повторить свой хит «MELON 18+» для Хуевидения обвенчалась немного и успехом, но немного и неудачей. Но все мы знаем правило, что повторить лучшее невозможно, но Долла, видимо, не слышала о таком. В любом случае, трек получился не самым плохим, просто не того уровня.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
    ],
  },
  {
    id: "pavlova-cookie-dayaizvoronezha-huevision-2026-single",
    artistId: "pavlova-cookie",
    title: "даяизворонежа from Huevision 2026",
    cover: "https://i.postimg.cc/htM2dHcr/file-00000000b90c7246b04a6c0cd0d4d2aa.png",
    releaseDate: "2026-06-13",
    reviewDate: "2026-06-15",
    label: "HUEVKI",
    text: "Очень нишевый трек, после прослушивания которого невозможно забыть, из какого города / страны артистка, потому что обосрать сцену и вызвать заклинание, ну... Так могла только Сичка в 2025 году, но и та хотя бы с хуем и туалетами. Но зато припев выполняет свою единственную функцию — запомнить в голове у слушателей.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно" },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 5 },
    ],
  },
  {
    id: "sicka-revo-huevision-2026-single",
    artistId: "sicka",
    title: "Revō from Huevision 2026",
    cover: "https://i.postimg.cc/htM2dHcr/file-00000000b90c7246b04a6c0cd0d4d2aa.png",
    releaseDate: "2026-06-13",
    reviewDate: "2026-06-15",
    label: "HUEVKI",
    text: "Сика возвращается в свой прайм времен «Lick and Fap», и вы согласны с этим. Этот трек вполне мог бы стать гимном для ее родины — Ревостана, — и мы будем этого добиваться, потому что гимн Чарли ХСХ, который президентка сделала гимном от балды, по сравнению с этим — ничто.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
    ],
  },
  {
    id: "ksivat-song-1-huevision-2026-single",
    artistId: "ksivat",
    title: "Song #1 from Huevision 2026",
    cover: "https://i.postimg.cc/htM2dHcr/file-00000000b90c7246b04a6c0cd0d4d2aa.png",
    releaseDate: "2026-06-13",
    reviewDate: "2026-06-15",
    label: "HUEVKI",
    text: "Победитель Хуевидения 2026, который отрывается от второго места всего в 1 балл, но и тот очень даже заслужен, но на HueFork мы говорим только о треке. И ничего сильно плохого сказать не хочется. Полное непонимание, почему артистка не любит этот трек, но да ладно.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
    ],
  },
  {
    id: "sicka-kfc-freestyle-single",
    artistId: "sicka",
    isSingle: true,
    title: "KFC Freestyle",
    cover: "https://i.postimg.cc/SQMwhNWg/file-00000000be487243b2b54a0512a105cd.png",
    releaseDate: "2026-05-24",
    reviewDate: "2026-05-24T00:00:00Z",
    label: "Farting Lesbians",
    text: "Перед нами классический пример репрезент-трека, который пытается выехать на гиперболизированном эпатаже и грязном юморе, но спотыкается о техническую реализацию. Работа звучит как мем-рэп первой волны, где забавная концепция разбивается о сырое сведение и ленивый перформанс.",
    singleCriteria: [
      { title: "Куплеты", score: 4 },
      { title: "Припев", score: 5 },
      { title: "Дополнительно", score: 3 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 4 },
      { title: "Потенциал хита", score: 3 },
      { title: "Визуал", score: 9 }
    ]
  },
  {
    id: "sicka-united-states-of-sicka",
    artistId: "sicka",
    title: "United States Of SiCka",
    cover:
      "https://i.postimg.cc/yddB6XY8/file-0000000083a47246a1087a141da0ebe2.png",
    releaseDate: "2026-07-24",
    reviewDate: "2026-07-24",
    label: "Farting Lesbians",
    isUpcoming: false,
    text: "Сика давно заработала репутацию артистки, которая почти не умеет останавливаться. Постоянные релизы, альбомы, ежемесячные фристайлы и десятки новых идей сделали её одной из самых продуктивных фигур хуендустрии. Широкую известность ей также принесли хиты «Lick and Fap», «Дерьмище», «Go! SiCka! Go!» и многие другие. Для артистки данный альбом является новым этапом — тут она делает упор на темное R&B звучание, которого раньше у нее не было.\nЭта пластинка одна из самых ожидаемых в этом году, а также она получила одну из самых масштабных промо-кампаний во всей хуендустрии: ивент в HueFork, аватарка в HUEVKI NEWS, постоянный подогрев со стороны артистки, скандалы, но также и примирения, например, с Pavlova Cookie, а совсем недавно она отметилась на фите с Dollova «GLAMOURISTA». Именно такая агрессивная промокампания подняла ожидания до уровня, на котором любой неудачный эксперимент мог бы обернуться разочарованием. На данный момент, артистка является владелицей HUEVKI и одной из самых узнаваемых артисток, в том числе за пределами хуендустрии.\nДо релиза альбома, Сика выпустила 2 лид-сингла: «Diva's Born (Intro)» и «SiCka=gcd(x, ate)», — которые получили смешанные отзывы от слушателей, но от критиков в HueFork они получили 9.1 и 9.0 баллов соответственно. После этих синглов она сразу явно дала знать, что жанр и звучание будут отличаться от того, что было раньше. Главное — не воспринимать лид-синглы отдельно от альбома: они являются его неотъемлемой частью. Как сказала Сика, ей больше не важно, как на нее отреагирует аудитория в музыкальном творчестве. При всем этом, сниппет «7/1» все равно разлетелся по хуендустрии. Как пообещала исполнительница, она собирается уйти в хиатус на 3 месяца, чтобы посмотреть, как вообще проживет хуендустрия без ее президента, и в целом за только один год она выпустила более ста треков, из-за чего часть аудитории, кажется, стала воспринимать новые релизы Сики как что-то самое обычное, для них снизилось ощущение уникальности каждого нового релиза.\nГлавной задачей альбома становится создание цельного повествования, где каждая композиция раскрывает общую идею релиза, не жертвуя единым звучанием.\nАльбом разделен на 2 акта, которые на первый взгляд незаинтересованного слушателя ничего не значат. Однако вся идея спрятана в текстах: первый акт рассказывает больше о вселенной USS и Сике, как президентке в этом государстве; второй акт же переключается на артистку уже как на самого человека. Именно поэтому первый акт носит название «United States», а второй — «Of SiCka». Но, даже несмотря на это, сам стиль написания текстов артистки не особо сильно изменился, но улучшения явно есть, чувство концепта у рэперки присутствует.\nНесмотря на четкое деление на 2 акта, между ними присутствует промежуточный акт из одного трека-интерлюдии под названием «Mrs. President (Interlude)», в котором она призывает слушателя поговорить с артисткой лично, к чему и отсылает второй акт, ведь он говорит о Сике, как о человеке, а не президентке.\nНа протяжении 28 минут Сика играет своим голосом. Она может уйти в рэп, может удивить своих вокалом (например, в «The Choir»), а может петь рвано, как это было в «National Baddie».\nОдну из главных ролей в этом альбоме играет продакшн — голос артистки звучит очень чисто, а биты становятся одним из главных факторов, отличающих этот релиз от предыдущих работ Сики. Помимо темного R&B, рэперка также пошла и в industrial-звук, что отчётливо слышно в «Diva's Born (Intro)». Для современной хуендустрии подобное сочетание мрачного R&B и industrial-звучания остаётся редкостью, благодаря чему альбом заметно выделяется на фоне большинства релизов. Более того, вы этого сейчас не услышите ни у кого в хуендустрии, потому что этот звук непопулярен. Остаётся лишь вопрос, станет ли этот релиз началом новой тенденции или так и останется уникальным экспериментом внутри хуендустрии.\nТем не менее, некоторые идеи повторяются, а часть песен использует схожие приёмы в подаче, из-за чего середина альбома временами теряет динамику. Например, в «7/1» и «SiCka=gcd(x, ate)» бит почти одинаковый. Это не разрушает концепцию, но делает отдельные моменты менее запоминающимися.\nОдним из достоинств альбома становится его целостность. Все треки в данном треклисте ощущаются частью одной истории, а не случайным списком хитов или, наоборот, проходных треков.\nОтдельного внимания заслуживает исполнительская работа Сики. На протяжении всего альбома она меняет свою манеру исполнения, что мы перечисляли несколько пунктов выше, а иногда такие приемы могут быть в одной песне, как это случилось в «Diva's Born (Intro)» и «??????».\nНазвание «??????» довольно удачное, потому что оно прямо олицетворяет 6 вопросов, которые «они» задают Сике. Каждый символ вопроса — отдельный вопрос в припеве.\nПродакшн альбома и сопровождает вокал артистки, и ставит настроение каждой песне самостоятельно, благодаря чему эксперименты с R&B- и industrial-звучанием получаются удачными. Именно музыка делает альбом Сики ее самым амбициозным релизом и показывает, что артистка выходит за рамки своего стиля, а также стиля, который она сама задала в хуендустрию.\nНесмотря на агрессивный образ, альбом редко звучит хаотично. Даже самые тяжёлые композиции сохраняют ощущение контроля, из-за чего образ президентки воспринимается не как карикатура, а как центральная фигура всей концепции.\nНо всё-таки, несмотря на всю эту уверенность в альбоме, недостатки нашлись. Хотя концепция «United States Of SiCka» прослеживается довольно понятно, все ещё строчки могут работать больше на создание образа именно артистки, а не страны, которую она создаёт. Поэтому некоторые темы не были доведены до конца, а может и вовсе не раскрыты.\nЭти недостатки скорее говорят о масштабе амбиций релиза, чем о его слабости. Да, может и не все идеи были реализованы до конца, но эта работа всё ещё остаётся уверенной и одной из самых продуманных в хуендустрии.\nПодводя итог, этот альбом официально открывает новую главу для исполнительницы. Не до конца понятно, может ли он что-то изменить в звучании других артисток, но голос этой артистки явно остаётся одним из самых убедительных голосов хуендустрии. На прошлых альбомах Сика больше баловалась, чем пыталась выпустить что-то серьезное (в рамках хуендустрии, конечно же), но на этом релизе она удивляет очень сильно. Именно благодаря этому стремлению выйти за собственные рамки, альбом ощущается одним из самых значимых в хуендустрии.",
    tracks: [
      { isSection: true, title: "Act I — United States" },
      { number: 1, title: "Diva's Born (Intro)", score: 9 },
      { number: 2, title: "Freaking News", score: 10 },
      { number: 3, title: "White House Hoe", score: 9 },
      { number: 4, title: "The Choir", score: 8 },
      { number: 5, title: "They Bow", score: 10 },
      { isSection: true, title: "Transmission" },
      { number: 6, title: "Mrs. President (Interlude)" },
      { isSection: true, title: "Act II — Of SiCka" },
      { number: 7, title: "7/1", score: 10 },
      { number: 8, title: "SiCka=gcd(x, ate)", score: 9 },
      { number: 9, title: "??????", score: 8 },
      { number: 10, title: "National Baddie", score: 10 },
      { number: 11, title: "WMA", score: 10 }
    ],
    criteria: [
      { title: "Биты", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "ksivat-no-stress",
    artistId: "ksivat",
    isSingle: true,
    title: "No Stress",
    cover: "https://i.postimg.cc/Rh6Y5jFf/IMG-20260524-023529-771.jpg",
    releaseDate: "2026-02-13",
    reviewDate: "2026-05-24T00:00:00Z",
    label: "DPM Records",
    text: "Хорошенький фристайл по мотивам трека Госпожи Эвелин — «Антилопа». Тут артистка хвалится своими «достижениями» и выпендрежом, ну, в целом, как обычно.",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "dollova-uvolen",
    artistId: "dollova",
    title: "УВОЛЕН",
    cover: "https://i.postimg.cc/t4CPkbDL/IMG-20260518-151848-021.jpg",
    releaseDate: "2025-07-13",
    reviewDate: "2026-05-18T12:07:00Z",
    label: "DirtyDollyRecords",
    text: "Артистка, в связи с увольнением со своей работы не по своей воле, представляет новый трек. В этом диссе рэперка показывает не грусть того, что она была уволена, а наоборот, радость, ведь начальник ещё та уродливая сучка, и как он смеет пиздеть на саму Доллову?",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "sicka-go-sicka-go-single",
    artistId: "sicka",
    title: "Go! SiCka! Go!",
    cover: "https://i.postimg.cc/4NYYJ96C/IMG-20260517-002108-458.jpg",
    releaseDate: "2026-01-02",
    reviewDate: "2026-05-17T12:00:00Z",
    label: "Farting Lesbians",
    text: "Выебывающий vogue бит и заедающий ритм делают свое дело. Этот трек есть эталон всех drag шоу в будущем.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "avya-asti-slap-slap-single",
    artistId: "avya-asti",
    title: "SLAP, SLAP",
    cover: "https://i.postimg.cc/8C9y0Wm5/IMG-20260517-001026-346.jpg",
    releaseDate: "2026-05-17",
    reviewDate: "2026-05-17T12:00:00Z",
    label: "OOO LABLE MALIK DELGATY AND AVEE ASTI",
    text: "Агрессивный рэп-трек, который заставляет хлопать своей попенькой. Артистка немного поигралась со сведением, из-за чего она звучит, как в клетке, но это все равно не мешает нам удовлетворить свои потребности под данное произведение.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "sicka-jesos-single",
    artistId: "sicka",
    title: "JeSOS",
    cover: "https://i.postimg.cc/ZqKtLJFn/IMG-20260516-153638-544.jpg",
    releaseDate: "2026-02-17",
    reviewDate: "2026-05-16T13:30:00Z",
    label: "Farting Lesbians",
    text: "Сингл с третьего альбома рэперки, который нацелен на заедание в голове своим многоструктурным припевом, с чем он так-то вот так-то справляется. Тема об Иисусе и том, что она есть Иисус, и то, что она вообще выбрала это синглом, добавляет провокационных красок в карьеру артистки.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "ksivat-mommy-single",
    artistId: "ksivat",
    title: "Mommy",
    cover: "https://i.postimg.cc/sDgsfDSJ/IMG-20260516-153610-878.jpg",
    releaseDate: "2025-12-09",
    reviewDate: "2026-05-16T13:00:00Z",
    label: "DPM Records",
    text: "Очередной трек от артистки под продюсированием нишевой долбоебки. Трек имеет заедающий припев и хороший бит.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "ugly-doll",
    artistId: "dollova",
    title: "Ugly Doll",
    cover: "https://i.postimg.cc/x1CQp2xf/IMG-20260507-201146-613.jpg",
    releaseDate: "2026-01-30",
    reviewDate: "2026-02-21",
    label: "DirtyDollyRecords",
    text: "Артистка доказывает, что умеет звучать хорошо во всех звуках и жанрах, но даже так может продолжить работать в одном и том же. Не смотря на это, качество мини-альбома все равно перебивает этот недостаток.",
    tracks: [
      { title: "Girlss", score: 9 },
      { title: "Priority", score: 6 },
      { title: "Ugly Doll", score: 10 },
      { title: "Booty Drop", score: 9, singleId: "dollova-sicka-booty-drop-single" },
      { title: "Fat Classic", score: 8 },
      { title: "Shopping", score: 8 },
      { title: "Fat Guest 2", score: 8 },
      { title: "BuBuBu", score: 9 },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "ahh",
    artistId: "sicka",
    title: "ahh... EP",
    cover: "https://i.postimg.cc/dVLjJJJj/IMG-20260507-221846-478.jpg",
    releaseDate: "2025-05-17",
    reviewDate: "2025-07-08",
    label: "Independent / SiCka",
    text: "Пердеть в туалете и на члене одновременно, при этом играя в кукиран — это только ее стихия.",
    tracks: [
      { title: "Не пернешь", score: 7 },
      { title: "CkSu", score: 9 },
      { title: "LGBTшки", score: 7 },
      { title: "No Cookies", score: 7 },
      { title: "Okurr", score: 6 },
      { title: "Gay&Mono", score: 4 },
      { title: "Touch It", score: 7 },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "huevision-2025",
    artistId: "various-artists",
    title: "Huevision 2025 — Album EP",
    cover: "https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg",
    releaseDate: "2025-06-08",
    reviewDate: "2026-05-18T12:06:00Z",
    reviewDateDisplay: "08.07.2025 / 18.05.2026 (новая)",
    label: "HUEVKI",
    text: "Самое разностороннее шоу из когда-либо бывавших в узком телеграме с замечательными композициями",
    tracks: [
      { title: "SiCka — Let Me", score: 9, singleId: "sicka-let-me-single" },
      {
        title: "NIK$A — Business",
        score: 9,
        singleId: "niksa-business-single",
      },
      {
        title: "Ksivat — 5 Minutes",
        score: 10,
        singleId: "ksivat-5-minutes-single",
      },
      {
        title: "Dollova — Tore You Too",
        score: 8,
        singleId: "dollova-tore-you-too-single",
      },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "escort",
    artistId: "avya-asti",
    title: "ESCORT EP",
    cover: "https://i.postimg.cc/1X0snxPn/IMG-20260507-222633-360.jpg",
    releaseDate: "2025-06-20",
    reviewDate: "2025-07-08",
    label: "Independent / АВЯ ASTI",
    text: "Баллада про секс и эскорт, смешанная в очень шлюховатой попсе и невероятно проститутном рэпе",
    tracks: [
      { title: "ЭСКОРТ", score: 8 },
      { title: "ЛОМАЕТ", score: 8 },
      { title: "Я ТВОЯ ДЫРКА", score: 8 },
      { title: "МИЛФА", score: 6 },
      { title: "КОШКА", score: 8 },
      { title: "SEXSTYLE", score: 7 },
      { title: "BDSM", score: 8 },
    ],
    criteria: [
      { title: "Биты", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "penis-pussy",
    artistId: "sicka",
    title: "penis pussy",
    cover: "https://i.postimg.cc/KzMgWYrZ/IMG-20260507-223723-016.jpg",
    releaseDate: "2025-06-26",
    reviewDate: "2025-07-08",
    label: "Independent / SiCka",
    text: "История про пизду в туалете, при этом используется семпл из Майнкрафта, а затем ahh-ные и трогательные моменты",
    tracks: [
      { title: "Oh", score: 6 },
      { title: "Sex Vision", score: 7 },
      { title: "And My Pussy-ah", score: 9 },
      { title: "FSP", score: 8 },
      { title: "Shake This Coochie", score: 9 },
      { title: "Toilet", score: 7 },
      { title: "Cunt", score: 6 },
      { title: "Lick and Fap", score: 9 },
      { title: "Burning Classics", score: 5 },
      { title: "Let Me", score: 9, singleId: "sicka-let-me-single" },
      { title: "Initials", score: 10 },
      { title: "A Little Closer", score: 7 },
      { title: "Should I?", score: 5 },
      { title: "Miss Poopie", score: 6 },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "penis-pussy-deluxe",
    originalAlbumId: "penis-pussy",
    artistId: "sicka",
    title: "penis pussy: farty poopy Deluxe",
    cover: "https://i.postimg.cc/k4sdqQyY/IMG-20260507-224212-538.jpg",
    releaseDate: "2025-07-13",
    reviewDate: "2025-07-12",
    label: "Independent / SiCka",
    text: "Интрига в начале и самый неожиданный поворот в истории фитов в конце делюкса.",
    tracks: [
      { title: "It Sounds Like", score: 7, number: 15 },
      { title: "Rim", score: 8, number: 16 },
      { title: "Queer Explosion Bomb", score: 7, number: 17 },
      { title: "FSPR (with Slayyyter)", score: 10, number: 18 },
    ],
    criteria: [
      { title: "Original Album", score: 7.8 },
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "ma-life",
    artistId: "pavlova-cookie",
    title: "Ma Life EP",
    cover: "https://i.postimg.cc/Y2JwkCNB/IMG-20260507-224606-965.jpg",
    releaseDate: "2025-06-28",
    reviewDate: "2025-07-21",
    label: "Yandex Market Records",
    text: "Отличная посиделка в каком бы то ни было месте, даже в стриптизе, но было ли хорошим решением выбрать это в середину?",
    tracks: [
      { title: "YMRIML", score: 7 },
      { title: "ДИНАМИТ", score: 8 },
      { title: "СПЕРМА В МОЕЙ ЖОПЕ", score: 5 },
      { title: "ВНЕ ОЧЕРЕДИ", score: 8 },
      { title: "RARARA 2 (Freestyle)", score: 6 },
    ],
    criteria: [
      { title: "Биты", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "tits-in-heaven",
    artistId: "sicka",
    title: "TITS IN HEAVEN Mixtape",
    cover: "https://i.postimg.cc/gk8ytgkc/IMG-20260507-230349-727.jpg",
    releaseDate: "2025-07-22",
    reviewDate: "2025-07-22",
    label: "Independent / SiCka",
    text: "На этом микстейпе вы не найдете ниодного ужасного трека, что делает релиз одним из самых крепких в хуендустрии. Определенно, имеет шанс стать самым лучшим релизом SiCka даже после следующих альбомов, если она все таки не уйдет из музыки.",
    tracks: [
      { title: "BUBBLE POOP", score: 8 },
      { title: "I KISSED YOUR BIDET", score: 9 },
      { title: "SEX WITH POOPS", score: 8 },
      { title: "I'M READY", score: 9 },
      { title: "TRACK 5", score: 7, isGrey: false },
      { title: "I'M NOT OKAY", score: 8 },
      { title: "DEEP LIKE PUSSY", score: 8 },
      { title: "HE RULES MY JUICE", score: 7 },
      { title: "VINTAGE PORN", score: 8 },
      { title: "FINAL FART", score: 7 },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "dollodelica",
    artistId: "dollova",
    title: "dollodelica",
    cover: "https://i.postimg.cc/C5Nhzysz/IMG-20260507-230858-435.jpg",
    releaseDate: "2025-07-25",
    reviewDate: "2025-07-26",
    label: "DirtyDollyRecords",
    text: "Очень разнообразный, хоть и дебютный, альбом, который содержит в себе сразу две десятки и одну девятку. Эти оценки — показатель большого качества.",
    tracks: [
      { title: "intro" },
      { title: "2x2", score: 7 },
      { title: "зпшка", score: 7 },
      { title: "queen (bonus track)", score: 8 },
      { title: "пахала (interlude)" },
      { title: "ливай", score: 10 },
      { title: "лям-два (diss)", score: 8 },
      { title: "оплата", score: 10 },
      { title: "jada (feat. Ariana Grande)", score: 10 },
      { title: "уволен", score: 9 },
      { title: "outro" },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "kult-podzalupkinoj",
    artistId: "niksa",
    title: "КУЛЬТ ПОДЗАЛУПКИНОЙ",
    cover: "https://i.postimg.cc/1zcjx9mQ/IMG-20260507-231349-872.jpg",
    releaseDate: "2025-07-26",
    reviewDate: "2025-07-26",
    label: "Independent / NIK$A",
    text: "Может треклист и может показаться маленьким, но он содержит то, что может сделать альбом концептуальным. Почти в каждом треке текст на разные темы — так артистка делится своими разными переживаниями.",
    tracks: [
      { title: "Let's", score: 8 },
      { title: "На пути", score: 7 },
      { title: "В очереди", score: 10 },
      { title: "Overpriced Wig's (interlude)", score: 8 },
      { title: "PuffMeedy", score: 9 },
      { title: "Я плохая", score: 8 },
      { title: "Вне очереди", score: 7 },
      { title: "Без названия (outro)", score: 7 },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "i-am-the-winner",
    artistId: "pavlova-cookie",
    title: "I AM THE WINNER",
    cover: "https://i.postimg.cc/nhHJCwXF/IMG-20260507-232554-471.jpg",
    releaseDate: "2025-08-22",
    reviewDate: "2025-09-09",
    label: "Yandex Market Records",
    text: "Объявление себя королевой в рэпе — субъективное мнение, на которое рэперка имеет полное право, хоть и всё-таки остаются конкуренты.",
    tracks: [
      { title: "ОВЕРСАЙЗ", score: 6 },
      { title: "МУСОРНЫЕ БАЧКИ", score: 7 },
      { title: "ТВОЕЙ КАРЬЕРЕ - П*ЗДА!", score: 8 },
      { title: "INTERLUDE" },
      { title: "ГОВНО НА ВЕНТИЛЯТОР", score: 9 },
      { title: "SH1PU4KA!", score: 9 },
      { title: "АНГЕЛЬСКИЙ ГОЛОСОК", score: 8 },
      { title: "ТЫ НЕ ПОБЕДИТЕЛЬ" },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "am-i-the-suchka",
    artistId: "sicka",
    title: "AM I THE SUCHKA?",
    cover: "https://i.postimg.cc/zBDVMH43/IMG-20260508-135900-151.jpg",
    releaseDate: "2025-09-21",
    reviewDate: "2025-11-29",
    label: "Independent / SiCka",
    text: "Уже третий большой релиз от артистки, но она не собирается сдавать в своих позициях и делает ещё один крепкий материал. Назван не коммерцией, но качество немного выше этого звания.",
    tracks: [
      { title: "Baddie Baddie (feat. Ice Spice)", score: 10 },
      { title: "Missis Bitch", score: 8 },
      { title: "BBL", score: 6 },
      { title: "Gowk-Gowk", score: 7 },
      { title: "Please, Can You Fuck Yourself?", score: 7 },
      { title: "Don't Think (feat. Ice Spice)", score: 9 },
      { title: "Дерьмище", score: 10 },
      { title: "Эротический Пупок", score: 8 },
      { title: "Нет, Я Не SiCka", score: 7 },
      { title: "Жральник", score: 9 },
      { title: "Чорная", score: 8 },
      { title: "ЯЛТ, Кирилл", score: 6 },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "am-i-the-suchka-shit-reloaded",
    originalAlbumId: "am-i-the-suchka",
    artistId: "sicka",
    title: "AM I THE SUCHKA?: Shit Reloaded Deluxe",
    cover: "https://i.postimg.cc/dtfNV89z/IMG-20260508-140543-332.jpg",
    releaseDate: "2025-10-29",
    reviewDate: "2025-11-29",
    label: "Independent / SiCka",
    text: "На дополнении своего второго альбома артистка перегоняет саму себя — она ставит рекорд для всего HueFork по баллам. Наши прогнозы относительно «TITS IN HEAVEN» не сбылись, и она выпустила что-то намного лучше.",
    tracks: [
      { number: 13, title: "Она Пердела На Полу" },
      { number: 14, title: "Дерьмище (Extended & Remastered)", score: 9 },
      { number: 15, title: "#ЯЖирнаяТварь (feat. Baby Cute)", score: 9 },
      { number: 16, title: "Сияние Жопы", score: 9 },
      { number: 17, title: "Пердановна", score: 10 },
      { number: 18, title: "Crow-Horse", score: 8 },
      { number: 19, title: "Ass-Some", score: 10 },
      { number: 20, title: "Hey, Boy (Remastered)", score: 8 },
      { number: 21, title: "Klitor", score: 7 },
      { number: 22, title: "I Just Got Fart In My Hand", score: 6 },
      { number: 23, title: "Дерьмище (Extended)", score: 10 },
      { number: 24, title: "BPLA (Remastered)", score: 8 },
      { number: 25, title: "Hey, Boy", score: 8 },
    ],
    criteria: [
      { title: "Original Album", score: 8.0 },
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "trois",
    artistId: "dollova",
    title: "Trois",
    cover: "https://i.postimg.cc/13whF9J1/IMG-20260508-141150-015.jpg",
    releaseDate: "2025-10-31",
    reviewDate: "2025-11-30",
    label: "DirtyDollyRecords",
    text: "Мы предсказывали победу этого альбома в главной номинации на HUEVKI AWARDS 2026 — и это может полностью оправдаться, ведь этот альбом борется за высший балл! Артистка отказывается от экспериментов и выбирает свой лучший стиль для большого проекта.",
    tracks: [
      { title: "Intro" },
      { title: "Trois", score: 9 },
      { title: "Madam Cum", score: 10 },
      { title: "Diva", score: 9 },
      { title: "Porto Party", score: 8 },
      { title: "Sex Vision", score: 9 },
      { title: "Twerk On The Grave", score: 8 },
      { title: "Dolla Mommy", score: 8 },
      { title: "Bad Bitch (feat. NIK$A)", score: 8 },
      { title: "Outro" },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "trois-deluxe",
    originalAlbumId: "trois",
    artistId: "dollova",
    title: "Trois Deluxe: Panther Industry Deluxe",
    cover: "https://i.postimg.cc/3RMZvTSL/IMG-20260508-141204-583.jpg",
    releaseDate: "2025-11-14",
    reviewDate: "2025-11-30",
    label: "DirtyDollyRecords",
    text: "Релиз, названный в честь дисса на оппонентку, в котором каждый трек — крепкий, но кроме этого дисса. Однако сам альбом в качестве теряет не сильно — всего 0.3 балла.",
    tracks: [
      { number: 11, title: "Virus", score: 8 },
      { number: 12, title: "Dolala", score: 7 },
      { number: 13, title: "Dance Shit", score: 10 },
      { number: 14, title: "Bot Hitches", score: 10 },
      { number: 15, title: "Juicy Mobil", score: 8 },
      { number: 16, title: "Are U Ready Skit" },
      { number: 17, title: "Panther Industry Diss", score: 6 },
    ],
    criteria: [
      { title: "Original Album", score: 8.9 },
      { title: "Биты", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "vogue-id",
    artistId: "sicka",
    title: "VOGUE ID EP",
    cover: "https://i.postimg.cc/X7TX3Yp1/IMG-20260508-141934-156.jpg",
    releaseDate: "2025-11-16",
    reviewDate: "2025-11-30",
    label: "Farting Lesbians",
    text: "Самый маленький релиз артистки из нескольких треков (не считая «HIT NIK$A UP»), но все ещё хорошего качества секса. Не для всех.",
    tracks: [
      { title: "AssQueen", score: 8 },
      { title: "Smack It Up", score: 9 },
      { title: "PussyCode", score: 10 },
      { title: "Sexy Toilet", score: 8 },
      { title: "Eat This Pussy", score: 7 },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "tits-in-hell",
    artistId: "sicka",
    title: "TITS IN HELL Mixtape",
    cover: "https://i.postimg.cc/MTVJ7zWn/IMG-20260508-142142-723.jpg",
    releaseDate: "2025-12-01",
    reviewDate: "2025-12-01",
    label: "Farting Lesbians",
    text: "«Плачь сука плачь плачь» — только это микстейп. В целом, хороший сестринский проект прошлого микстейпа «TITS IN HEAVEN», полностью отличается от ее прошлого творчества, и даже от первого микстейпа.",
    tracks: [
      { title: "PRICKLY ANUS", score: 7 },
      { title: "YUMMY MOMMY", score: 7 },
      { title: "LOT OF CUM", score: 6 },
      { title: "PORNING", score: 10 },
      { title: "JUMPIN' LIKE BUNNY", score: 8 },
      { title: "FARTA POOPA", score: 9 },
      { title: "JELLY BUMP", score: 7 },
      { title: "DICK KNOWS ME BEST", score: 8 },
      { title: "SUCK TOMORROW", score: 9 },
      { title: "FINAL ASS" },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "pertty-and-petty",
    artistId: "avya-asti",
    title: "Pertty&Petty EP",
    cover: "https://i.postimg.cc/Kz23rvPb/IMG-20260508-144517-057.jpg",
    releaseDate: "2026-01-23",
    reviewDate: "2026-02-21",
    label: "Independent / АВЯ ASTI",
    text: "Если вы просто хотите потрясти своим телом, а особенно пятой точкой — этот мини-альбом для вас. Не слишком большой хронометраж, но удовольствие доставляет так, что Господи помилуй.",
    tracks: [
      { title: "YUP", score: 8 },
      { title: "I'M", score: 7 },
      { title: "HERMES", score: 7 },
      { title: "BAP! BAP!", score: 8 },
      { title: "STRAP ON", score: 9 },
    ],
    criteria: [
      { title: "Биты", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "y3k",
    artistId: "sicka",
    title: "Y3K!",
    cover: "https://i.postimg.cc/6Qyxjdhq/IMG-20260207-233206-653.jpg",
    releaseDate: "2026-02-15",
    reviewDate: "2026-05-08",
    label: "Farting Lesbians",
    text: "Рэперка переходит в свою эру будущего, где показывает свое настоящее качество музыки. Чего стоят только губы на пол лица на обложке альбома — она их использует как музыкальный инструмент для своих треков. Она не боится делать много треков, потому что это её боятся.",
    tracks: [
      { title: "Twerking Core", score: 10 },
      { title: "福克米 内嘎", score: 8 },
      { title: "Such Hoes", score: 9 },
      { title: "Coming Out", score: 9 },
      { title: "Don't Care", score: 7 },
      { title: "TMBody", score: 9 },
      { title: "American Stick", score: 8 },
      { title: "Mess", score: 9 },
      { title: "JeSOS", score: 9 },
      { title: "Vagina Giant", score: 9 },
      { title: "No Free Promo", score: 9 },
      { title: "Go! SiCka! Go!", score: 10 },
      { title: "Tranny", score: 8 },
      { title: "Pretty Privilege", score: 8 },
      { title: "Everything Fucks Me", score: 7 },
      { title: "EFM" },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "escort-2",
    artistId: "avya-asti",
    title: "ESCORT 2",
    cover: "https://i.postimg.cc/YC8b4ZYY/IMG-20260508-151118-057.jpg",
    releaseDate: "2026-03-21",
    reviewDate: "2026-05-08",
    label: "OOO LABLE MALIK DELGATY AND AVEE ASTI",
    text: "На своем сестринском проекте дебютного альбома артистка показывает новое качество, которого в ее дискографии еще не было. Тут и рэп, и рок, и поп, но даже так все звучит, как цельная композиция — это явный показатель того, что она явно умеет звучать хорошо везде.",
    tracks: [
      { title: "INTRO", score: 8 },
      { title: "ZABIRAYU", score: 7 },
      { title: "BABY", score: 10 },
      { title: "V TVOEY GOLOVE", score: 7 },
      { title: "FUCK, DAMN", score: 7 },
      { title: "PRIG SCOCK", score: 9 },
      { title: "LA FRANCE", score: 10 },
      { title: "XALAVCHIK", score: 8 },
      { title: "SHITBARS2", score: 9 },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "pregnant-with-bitch",
    artistId: "sicka",
    title: "Pregnant With Bitch Mixtape",
    cover:
      "https://i.postimg.cc/9QXsNGBb/file-00000000e770720a97fcb5b159765252.png",
    releaseDate: "2026-04-26",
    reviewDate: "2026-05-08",
    label: "Farting Lesbians",
    text: "Если все прошлые микстейпы были нацелены на узкую аудиторию, которая абсолютно не относится к хуендустрии, поэтому они вышли delulu, то на этом микстейпе все случилось наоборот, более того, это первый микстейп в дискографии артистки, который не относится к арке «TITS IN». Сичка немного пробует себя в новых экспериментальных жанрах, например, «Anus», который невозможно слушать без мефедрона или чего-то типо того. Тем не менее, релиз получает одну из самых высоких оценок в сервисе.",
    tracks: [
      { title: "Pregnant With Bitch", score: 9 },
      { title: "Brainless", score: 9 },
      { title: "Posay Cum", score: 6 },
      { title: "What The Hell", score: 10 },
      { title: "Anus" },
      { title: "TeaTea", score: 10 },
      { title: "Shut That Hole Up", score: 10 },
      { title: "Actually, No", score: 8 },
      { title: "ST Remoaned", score: 7 },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "cum-mania",
    artistId: "dollova",
    title: "CUM MANIA",
    cover: "https://i.postimg.cc/FKxyCBhy/IMG-20260508-160333-769.jpg",
    releaseDate: "2026-05-22",
    reviewDate: "2026-05-22T12:00:00Z",
    label: "DirtyDollyRecords",
    text: "Третий альбом хуендустристской артистки наполнен разнообразными битами и известными семплами на них. Каждый трек звучит как что-то другое и практически не похожее на прошлое, от такого даже мозг начинает кипеть, как сперма от раскаленного шарика. Каждые 2 минуты — это какая-то другая вселенная, которая либо сведёт вас с ума, либо заставит вас захотеть вернуться обратно.",
    tracks: [
      { title: "DOLLY & GABBANA", score: 10 },
      { title: "I WANT A BIG BIG (feat. Ksivat)", score: 10 },
      { title: "MADAM CUM 2", score: 9 },
      { title: "CUM MANIA", score: 10 },
      { title: "ASS+CUM", score: 9 },
      { title: "BOMBITA", score: 8 },
      { title: "D RAP", score: 5 },
      { title: "Э!", score: 9 },
      { title: "BB", score: 9 },
      { title: "AMG ASS", score: 8 },
      { title: "PATRONA (feat. ROMBOLLA)", score: 8 },
      { title: "MELON 18+", score: 10 },
      { title: "DOLLY MOMENT", score: 8 },
    ],
    criteria: [
      { title: "Биты", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 },
    ],
  },
  
  {
    id: "pavlova-cookie-million-dollar-babe",
    artistId: "pavlova-cookie",
    isSingle: true,
    title: "million dollar babe",
    cover: "https://i.postimg.cc/FRHjfRpB/IMG-20260508-213011-967.jpg",
    releaseDate: "2026-05-09",
    reviewDate: "2026-06-23T00:00:00Z",
    label: "YMR & Farting Lesbians",
    text: "Довольно роковой трек для рэперки, в котором она восхваляет свое богатство в рэп-рок звучании. Очередное упоминание Долловой вместе с ней, и уже создаётся ощущение, что Павлова сама по себе не может ничего из себя представить без упоминания своих френдов. Это не самый плохой трек, но мы знаем, что можно и лучше, но, судя по направлению артистки, все будет только хуже, к сожалению.",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 1 }
    ]
  },
  {
    id: "pavlova-cookie-selfie",
    artistId: "pavlova-cookie",
    isSingle: true,
    title: "selfie",
    cover: "https://i.postimg.cc/FRHjfRpB/IMG-20260508-213011-967.jpg",
    releaseDate: "2026-05-09",
    reviewDate: "2026-06-23T00:00:00Z",
    label: "YMR & Farting Lesbians",
    text: "Если бы «BEEZ TAKING OVER» всё-таки вышел, то вы бы этот трек даже не вспоминали. В целом, даже без альбома, память о треке улетучилась также быстро, просто потому что этот трек максимально не запоминающийся, так ещё и не того качества, которое Павлова могла бы выдать. В целом, сложно сказать, собиралась ли она вообще вернуться к пику уровня «ГОВНО НА ВЕНТИЛЯТОР», после релиза этого сингла из 3 треков.",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Дополнительно", score: 6 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 1 }
    ]
  },
  {
    id: "ariana-grande-petal",
    artistId: "ariana-grande",
    title: "petal",
    cover: "https://images.genius.com/2146b311efb5d1f05a87343d95edea03.1000x1000x1.png",
    releaseDate: "2026-07-31",
    label: "Babydoll Music",
    text: "Неизвестно",
    isUpcoming: true,
    tracks: [
      { title: "kiss me" },
      { title: "hate that i made you love me", score: 10 },
      { title: "petal" },
      { title: "stay" },
      { title: "oh well" },
      { title: "big feelings" },
      { title: "freak" },
      { title: "warning signs (interlude)" },
      { title: "like i do" },
      { title: "never get over me" },
      { title: "bad thing (bunny hop)" },
      { title: "nowhere, nobody" }
    ],
    criteria: [
      { title: "Биты" },
      { title: "Флоу" },
      { title: "Потенциал хита" },
      { title: "Визуал" }
    ]
  },
  {
    id: "ariana-grande-eternal-sunshine",
    artistId: "ariana-grande",
    title: "eternal sunshine",
    cover: "https://i.postimg.cc/dtkrfv1p/IMG-20260516-153502-888.jpg",
    releaseDate: "2024-03-08",
    reviewDate: "2026-05-16T11:00:00Z",
    label: "Republic Records",
    text: "Этот альбом — это очень личная и атмосферная поп-запись, где нежный R&B и хаус-звучание сочетаются с темами расставания, памяти и взросления. Проект ощущается более зрелым и цельным, чем многие прошлые релизы Арианы, а треки вроде “we can’t be friends” и “imperfect for you” особенно хорошо раскрывают его эмоциональную сторону.",
    tracks: [
      { title: "intro (end of the world)", score: 9 },
      { title: "bye", score: 9 },
      { title: "don't wanna break up again", score: 10 },
      { title: "Saturn Returns interlude" },
      { title: "eternal sunshine", score: 9 },
      { title: "supernatural", score: 9 },
      { title: "true story", score: 10 },
      { title: "the boy is mine", score: 10 },
      { title: "yes, and?", score: 10 },
      { title: "we can't be friends (wait for your love)", score: 10 },
      { title: "i wish i hated you", score: 8 },
      { title: "imperfect for you", score: 8 },
      { title: "ordinary things (feat. Nonna)", score: 9 },
    ],
    criteria: [
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 },
    ],
    noTop: true,
    noAwards: true,
  },
  {
    id: "ariana-grande-eternal-sunshine-deluxe",
    artistId: "ariana-grande",
    title: "eternal sunshine: brighter days ahead",
    cover: "https://i.postimg.cc/nLRq5LvP/IMG-20260516-153508-090.jpg",
    releaseDate: "2025-03-28",
    reviewDate: "2026-05-16T12:00:00Z",
    label: "Republic Records",
    text: "eternal sunshine deluxe: brighter days ahead — это более кинематографичное и эмоционально завершённое переиздание альбома, где Ariana Grande сильнее уходит в тему воспоминаний, потерь и принятия себя. Новые треки звучат мягче и атмосфернее, а весь проект вместе с короткометражкой ощущается как красивое завершение эры eternal sunshine.",
    tracks: [
      { title: "intro (end of the world) [extended]", score: 10 },
      { title: "twilight zone", score: 9 },
      { title: "warm", score: 8 },
      { title: "dandelion", score: 10 },
      { title: "past life", score: 10 },
      { title: "Hampstead", score: 8 },
    ],
    criteria: [
      { title: "Original Album", score: 9.3 },
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 },
    ],
    noTop: true,
    noAwards: true,
  },
  {
    id: "dollova-msp-single",
    artistId: "dollova",
    title: "msp",
    cover: "https://i.postimg.cc/6QGP6FYj/IMG-20260516-133818-225.jpg",
    releaseDate: "2025-08-31",
    reviewDate: "2026-05-16T11:30:00Z",
    label: "DirtyDollyRecords",
    text: "Артистка продолжает радовать нас новыми треками в конце этого лета, поэтому на последок решила выпустить последний хит, который завершает ее первую эру. Композиция представляет собой танцевальный трек, который так и просит, чтобы ты этим summer поднял свою pussy и потряс ею.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "dollova-dolly-gabbana-single",
    artistId: "dollova",
    title: "DOLLY & GABBANA",
    cover: "https://i.postimg.cc/7h1HN3WZ/IMG-20260515-140758-839.jpg",
    releaseDate: "2026-04-17",
    reviewDate: "2026-05-16",
    label: "DirtyDollyRecords",
    text: "Лид-сингл к грядущему альбому артистки уже показывает качество, к которому стоит готовиться на пластинке. Рэперка уходит только от поп-хитов с прямой бочкой и приходит к чему-то новому, что звучит.... Звучит.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "ksivat-shake-single",
    artistId: "ksivat",
    title: "Shake",
    cover: "https://i.postimg.cc/KvzM9CQJ/IMG-20260515-221131-455.jpg",
    releaseDate: "2026-05-15",
    reviewDate: "2026-05-16",
    label: "DPM Records",
    text: "Динамичный и заедающий трек, который отлично справляется со своей главной задачей — заставить слушателя двигаться. Качественный продакшн и уверенная подача делают этот трек сильным представителем своего жанра.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "ksivat-bez-obid-single",
    artistId: "ksivat",
    title: "Без Обид",
    cover: "https://i.postimg.cc/KvzM9CQJ/IMG-20260515-221131-455.jpg",
    releaseDate: "2026-05-15",
    reviewDate: "2026-05-16",
    label: "DPM Records",
    text: "Крепкая представительница жанра, которая не изобретает велосипед, но очень грамотно работает с проверенными формулами. Трек обладает отличным вайбом для ночных поездок или фонового прослушивания в заведении, выделяясь приятным тембром артистки.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "ksivat-lauma-supremacy-single",
    artistId: "ksivat",
    title: "Lauma Supremacy",
    cover: "https://i.postimg.cc/wBhyyzTY/IMG-20260515-222258-515.jpg",
    releaseDate: "2026-05-01",
    reviewDate: "2026-05-16",
    label: "DPM Records",
    text: "Вновь трек о любимой игре и любимом персонаже из этой игры от артистки. Создаётся ощущение, что кроме этой рутины, у нее нет жизни.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 9 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "avya-asti-pay-me-baby-single",
    artistId: "avya-asti",
    title: "PAY ME, BABY",
    cover: "https://i.postimg.cc/2yrm3p9c/IMG-20260515-225529-525.jpg",
    releaseDate: "2026-04-29",
    reviewDate: "2026-05-16",
    label: "OOO LABLE MALIK DELGATY AND AVEE ASTI",
    text: "Очень стильный и коммерчески выверенный трек, который буквально излучает вайб дорогой жизни. Идеальный баланс между поп-звучанием и рэп-подачей, создающий образ недосягаемой и успешной артистки.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "avya-asti-fuck-damn-single",
    artistId: "avya-asti",
    title: "FUCK, DAMN",
    cover: "https://i.postimg.cc/L6yR4btX/IMG-20260515-225955-036.jpg",
    releaseDate: "2026-03-01",
    reviewDate: "2026-05-16",
    label: "OOO LABLE MALIK DELGATY AND AVEE ASTI",
    text: "Бэнгер для клубов, построенный на резких фразах и мощном ритме. Эффективно справляется со своей главной задачей: создавать дерзкое настроение и заставлять двигаться.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "avya-asti-shitbars-single",
    artistId: "avya-asti",
    title: "SHITBARS",
    cover: "https://i.postimg.cc/HkRgX8PC/IMG-20260515-230610-929.jpg",
    releaseDate: "2025-12-19",
    reviewDate: "2026-05-16",
    label: "АВЯ ASTI",
    text: "Трек оправдывает своё название, делая ставку на поток сознания и свободную форму без строгого припева. Это крепкая демонстрация харизмы и способности артистки удерживать внимание слушателя исключительно за счёт подачи и дерзкого текста.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "pavlova-cookie-cocaine-ecstasy-dope-crack-single",
    artistId: "pavlova-cookie",
    title: "COCAINE, ECSTASY, DOPE, CRACK",
    cover: "https://i.postimg.cc/Bb6w8CDH/IMG-20260515-231256-516.jpg",
    releaseDate: "2026-04-17",
    reviewDate: "2026-05-16",
    label: "YMR & Farting Lesbians",
    text: "Спустя долгий перерыв, выходит коротенький трек о зависимостях артистки. Эксперимент в жанре для неё, который, хоть и имеет одну из низких оценок для HueFork, более менее удался.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 5 },
    ],
  },
  {
    id: "pavlova-cookie-reflex-single",
    artistId: "pavlova-cookie",
    title: "REFLEX",
    cover: "https://i.postimg.cc/ncNwzBLj/IMG-20260515-232942-187.jpg",
    releaseDate: "2025-12-12",
    reviewDate: "2026-05-16",
    label: "YMR & Farting Lesbians",
    text: "Ламповый, хороший трек, который своим припевом может засидеть в голове надолго. Является лид-синглом к альбому артистки, и уже сейчас можем высчитать примерное качество.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "pavlova-cookie-shimmy-shimmy-ya-single",
    artistId: "pavlova-cookie",
    title: "SHIMMY SHIMMY YA! (feat. МЭЙБИ БЭЙБИ)",
    cover: "https://i.postimg.cc/dtZ4z3jg/IMG-20260515-233023-732.jpg",
    releaseDate: "2025-11-07",
    reviewDate: "2026-05-16",
    label: "YMR & Farting Lesbians",
    text: "Коллаборация артисток, которых мы уже ранее слышали вместе. Вместе они не собираются сдавать позиции и продолжают давать качественный материал.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "sicka-alarm-freestyle-single",
    artistId: "sicka",
    title: "Alarm Freestyle",
    cover: "https://i.postimg.cc/R0pgkHyk/IMG-20260515-233343-895.jpg",
    releaseDate: "2026-04-15",
    reviewDate: "2026-05-16",
    label: "Farting Lesbians",
    text: "Рэперка не изменяет своей традиции и выпускает новый фристайл на этот месяц, который отличается выбранным стилем. В семпле бита наблюдается кошмар каждого человека, у которого когда-либо был Samsung, а артистка своим голосом добавляет этому потенциал.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "sicka-twerking-core-extended-single",
    artistId: "sicka",
    title: "Twerking Core (Extended)",
    cover: "https://i.postimg.cc/VkfQ1XZN/IMG-20260515-234124-169.jpg",
    releaseDate: "2026-03-29",
    reviewDate: "2026-05-16",
    label: "Farting Lesbians",
    text: "В продолжение эры «Y3K!», и при этом в её же завершение, артистка продлевает интро своего альбома на одну с половиной минуты. Куплет добавляет больше драйва и игривости к изначальному треку, а также новое аутро. И при этом, звучит ничем ни хуже, чем первая версия.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "sicka-pizda-freestyle-single",
    artistId: "sicka",
    title: "Pizda Freestyle",
    cover: "https://i.postimg.cc/8Ck6hXyX/IMG-20260515-234629-167.jpg",
    releaseDate: "2026-03-06",
    reviewDate: "2026-05-16",
    label: "Farting Lesbians",
    text: "Для данного фристайла артистка выбрала семплом жару от губастой прошмандовки. И кто, если не она, исправит ситуацию на этом бите?",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "dollova-e-single",
    artistId: "dollova",
    title: "Э!",
    cover: "https://i.postimg.cc/fbwMy6Hk/IMG-20260516-000657-568.jpg",
    releaseDate: "2026-02-27",
    reviewDate: "2026-05-16",
    label: "DirtyDollyRecords",
    text: "Взрывной трек, под который можно двигаться одновременно и быстро, и медленно. Ритмичный бит и повторяющийся припев делают его вирусным и запоминающимся.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "dollova-sicka-booty-drop-single",
    artistId: "dollova",
    artistIds: ["dollova", "sicka"],
    title: "Booty Drop (feat. SiCka)",
    cover: "https://i.postimg.cc/PfBpJ51C/IMG-20260516-000632-835.jpg",
    releaseDate: "2026-01-16",
    reviewDate: "2026-05-16",
    label: "DirtyDollyRecords",
    text: "На данный момент, самый сильный фит в хуендустрии, под который реально можно устроить не только booty, но и vogue drop. Трек идеально справляется со своей главной задачей тряски тела, в остальном большого смысла он не несёт.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "niksa-sorry-girls-single",
    artistId: "niksa",
    title: "SORRY, GIRLS",
    cover: "https://i.postimg.cc/rFskB1DY/IMG-20260516-001600-788.jpg",
    releaseDate: "2025-07-21",
    reviewDate: "2026-05-16",
    label: "Yandex Market Records",
    text: "Никса устала. Пов ты Марьяна Ро. Посмотрим, простят ли ее Dollova, SiCka и Pavlova Cookie.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "niksa-ne-sopernitsy-single",
    artistId: "niksa",
    title: "НЕ СОПЕРНИЦЫ",
    cover: "https://i.postimg.cc/Jnxfg0mv/IMG-20260516-001628-582.jpg",
    releaseDate: "2025-07-21",
    reviewDate: "2026-05-16",
    label: "Yandex Market Records",
    text: "Никса не хочет бифиться, потому что ей никто не соперник. Своих оппонентов она представляет в виде дилдо.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 7 },
    ],
  },
  {
    id: "niksa-rap-bullying-single",
    artistId: "niksa",
    title: "РЭП БУЛЛИНГ",
    cover: "https://i.postimg.cc/g0P1280b/IMG-20260516-001652-652.jpg",
    releaseDate: "2025-07-20",
    reviewDate: "2026-05-16",
    label: "Yandex Market Records",
    text: "Никса реагирует на диссы.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "ksivat-lauma-single",
    artistId: "ksivat",
    title: "Lauma",
    cover: "https://i.postimg.cc/BQwpr0J1/IMG-20260517-194443-450.jpg",
    releaseDate: "2025-09-19",
    reviewDate: "2026-05-17T23:00:00Z",
    label: "Independent / Ksivat",
    text: "Снова новый трек, и снова про игру Genshin Impact. Здесь артистка описывает свои отношения с персонажем Нилу, на которую она успела слить большое количество круток, а оказалось что она для Ksivat будет бесполезной.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 10 },
    ],
  },
  {
    id: "dollova-fat-guest-single",
    artistId: "dollova",
    title: "fat guest",
    cover: "https://i.postimg.cc/Gh3kKhTQ/IMG-20260517-203243-983.jpg",
    releaseDate: "2025-08-31",
    reviewDate: "2026-05-17T23:30:00Z",
    label: "DirtyDollyRecords",
    text: "Артистка представляет новый танцевальный поп-трек, который должен был войти в её дебютный альбом «dollodelica». В этом треке она вспоминает времена на работе, когда к ней пришёл настолько жирный посетитель, что он сломал стул и стол, за которые он сел. И полресторана.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 8 },
    ],
  },
  {
    id: "sicka-lick-and-fap-single",
    artistId: "sicka",
    title: "Lick and Fap",
    cover: "https://i.postimg.cc/fb56pbTB/IMG-20260517-211009-340.jpg",
    releaseDate: "2025-06-21",
    reviewDate: "2026-05-17T23:59:58Z",
    label: "Independent / SiCka",
    text: "Артистка готовит свою аудиторию к выходу нового альбома. Трек уже до релиза завоевал сердца фанатов своими сниппетами, и не только фанатов. Это первая композиция исполнительницы в танцевальном стиле. Здесь она восхваляет свою личность и пятку.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 10 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 10 },
      { title: "Визуал", score: 6 },
    ],
  },
  {
    id: "ksivat-matcha-single",
    artistId: "ksivat",
    title: "Matcha",
    cover: "https://i.postimg.cc/Wb4sFjRb/IMG-20260518-120006-829.jpg",
    releaseDate: "2026-02-20",
    reviewDate: "2026-05-18T12:01:00Z",
    label: "DPM Records",
    text: "Кофейно-зеленый вайбик в перемешку с сумасшедшим битом, который сбивает с толку. Не минус, а наоборот добавляет тряски телу.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 },
    ],
  },
  {
    id: "sicka-let-me-single",
    artistId: "sicka",
    title: "Let Me from Huevision 2025",
    cover: "https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg",
    releaseDate: "2025-06-08",
    reviewDate: "2026-05-18T12:05:00Z",
    label: "HUEVKI",
    text: "Заигрывающий трек, в котором представительница Ревостана предлагает кокетливо «пернуть и насрать на лицо». Представляет свою страну во всей красе.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
    ],
  },
  {
    id: "niksa-business-single",
    artistId: "niksa",
    title: "Business from Huevision 2025",
    cover: "https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg",
    releaseDate: "2025-06-08",
    reviewDate: "2026-05-18T12:04:00Z",
    label: "HUEVKI",
    text: "Выигрыш России в 2025 году на Хуевидении благодаря Никсе и этому треку. Дерзко, стервозно, нежночастно.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 10 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
      { title: "Нежная часть" },
    ],
  },
  {
    id: "ksivat-5-minutes-single",
    artistId: "ksivat",
    title: "5 Minutes from Huevision 2025",
    cover: "https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg",
    releaseDate: "2025-06-08",
    reviewDate: "2026-05-18T12:03:00Z",
    label: "HUEVKI",
    text: "Настоящий победитель по нашему скромному мнению, если учитывать только трек. На данном произведении можем запечатлеть момент, когда артистка ещё не была окончательно «огеншинирована» в своих песнях.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 10 },
    ],
  },
  {
    id: "dollova-tore-you-too-single",
    artistId: "dollova",
    title: "Tore You Too from Huevision 2025",
    cover: "https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg",
    releaseDate: "2025-06-08",
    reviewDate: "2026-05-18T12:02:00Z",
    label: "HUEVKI",
    text: "Не попадающий в бит флоу в первом куплете рушит мнение о треке с самого начала. Самый вокальный трек на первом главном песенном конкурсе, но немного под влиянием флопа.",
    isSingle: true,
    singleCriteria: [
      { title: "Куплеты", score: 6 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 9 },
    ],
  },
  {
    id: "sicka-fu-ke-mi-nei-ga",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "福克米 内嘎",
    cover: "https://i.postimg.cc/fTt3XKqh/IMG-20260529-175536-947.jpg",
    releaseDate: "2025-12-20",
    reviewDate: "2026-05-29",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 }
    ],
    text: "Один из самых просящих на секс треков рэперки, а на этот раз она прямо обращается к человеку, который должен ее трахнуть — ниха."
  },
  {
    id: "sicka-divas-born-intro",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    albumId: "sicka-united-states-of-sicka",
    title: "Diva's Born (Intro)",
    cover: "https://i.postimg.cc/yddB6XY8/file-0000000083a47246a1087a141da0ebe2.png",
    releaseDate: "2026-05-31",
    reviewDate: "2026-05-31",
    label: "Farting Lesbians",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 10 }
    ],
    text: "Экспериментальный звук для рэперки, который открывает ее эру Соединённых Штатов уже не постами в канале, а в треках. В этой композиции артистка совмещает вместе быструю рэп-читку в куплетах и магический вокал в припеве. Этот трек заявляет о высоком статусе и амбициях Сики."
  },
  {
    id: "sicka-sicka-gcd-x-ate",
    artistId: "sicka",
    isSingle: true,
    albumId: "sicka-united-states-of-sicka",
    title: "SiCka=gcd(x, ate)",
    cover: "https://i.postimg.cc/KvFmqt5s/IMG-20260626-095537.png",
    releaseDate: "2026-06-26",
    reviewDate: "2026-06-26T12:00:00Z",
    label: "Farting Lesbians",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 9 }
    ],
    text: "Рэперка представляет себя в виде математической функции на новом РнБ-треке, который отсылает к ее будущему альбому «United States Of SiCka». Артистка постепенно устремляется в сторону темного звучания, чтобы связать себя с эстетикой пластинки, что у нее получается уже 2 трека подряд, однако слушатели могут не понять такой мув и звук. После «Diva's Born» казалось непонятным, что вообще делать с таким звуком, поэтому артистка пошла в сторону более близкого звука к слушателям."
  },
  {
    id: "sicka-okurr",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "Okurr",
    cover: "https://i.postimg.cc/NGWfTvBj/file-00000000be50720a81ecd53051bac86e.png",
    releaseDate: "2025-05-17",
    reviewDate: "2026-06-04",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 9 }
    ],
    text: "Первое англоязычное заражение Сички началось уже с этого момента. Трек представляет собой дисс на Jenyu."
  },
  {
    id: "niksa-instasamka-suck",
    artistId: "niksa",
    isSingle: true,
    isUpcoming: false,
    title: "INSTASAMKA SUCK",
    cover: "https://i.postimg.cc/pLtK2ZSs/IMG-20260508-153516.jpg",
    releaseDate: "2025-06-26",
    reviewDate: "2026-06-04",
    label: "Yandex Music Records",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 6 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 0 }
    ],
    text: "Рэперша выпускает ответный дисс на Инстасамку за то, что она унижает Лысюк. Нуууу, как тебе сказать..."
  },
  {
    id: "sicka-queer-explosion-bomb",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "Queer Explosion Bomb",
    cover: "https://i.postimg.cc/SKmB8Dns/file-000000009fdc71f49b52f63678636d1e.png",
    releaseDate: "2025-07-13",
    reviewDate: "2026-06-04",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 6 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 7 }
    ],
    text: "Жёсткий разнос от рэперки на гетеро и квиров, которые пытаются быть гетеро на публику. Адресован в сторону Ksivat и немного meedy."
  },
  {
    id: "sicka-hit-niksa-up",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "HIT NIK$A UP (DISS)",
    cover: "https://i.postimg.cc/pTc5Kbn0/IMG-20260604-161157-396.jpg",
    releaseDate: "2025-07-20",
    reviewDate: "2026-06-04",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 }
    ],
    text: "Заглавный трек сингла диссов на Никсу. В этом произведении она отвечает на неофициальный дисс оппонентки."
  },
  {
    id: "sicka-you-i-ag",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "You/I AG",
    cover: "https://i.postimg.cc/pTc5Kbn0/IMG-20260604-161157-396.jpg",
    releaseDate: "2025-07-20",
    reviewDate: "2026-06-04",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 8 }
    ],
    text: "Второстепенный трек из сингла диссов на Никсу. Сичка примеряет на себя и оппонентку образ agent girl, и показывает, насколько по-разному он может выглядеть на разных людях."
  },
  {
    id: "pavlova-cookie-take-l",
    artistId: "pavlova-cookie",
    isSingle: true,
    isUpcoming: false,
    title: "Take L (NIK$A Diss)",
    cover: "https://i.postimg.cc/dVck29DN/IMG-20260604-161236-100.jpg",
    releaseDate: "2025-07-21",
    reviewDate: "2026-06-04",
    label: "Yandex Market Records",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 6 }
    ],
    text: "Снова. Дисс на Никсу. И трудно представить, что тогда артистка поддерживала свою будущую оппонентку."
  },
  {
    id: "pavlova-cookie-u-wanna-talk",
    artistId: "pavlova-cookie",
    isSingle: true,
    isUpcoming: false,
    title: "U Wanna Talk?",
    cover: "https://i.postimg.cc/zBvVztPV/IMG-20260604-161256-703.jpg",
    releaseDate: "2025-07-21",
    reviewDate: "2026-06-04",
    label: "Yandex Market Records",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 6 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 6 }
    ],
    text: "Кажется, Павлова не особо готова прощать Никсу."
  },
  {
    id: "ksivat-itskovichi-podyem",
    artistId: "ksivat",
    isSingle: true,
    isUpcoming: false,
    title: "Ицковичи подъем",
    cover: "https://i.postimg.cc/Fs3gXzSv/IMG-20260604-161333-094.jpg",
    releaseDate: "2025-07-24",
    reviewDate: "2026-06-04",
    label: "Independent / Ksivat",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 7 }
    ],
    text: "Случился небольшой перерыв в диссах, но Ксиват прервала его своим диссом на Ярэксо. В диссе артистка осуждает оппонента за такие вещи, как ориентация, игры, дружба с JozzyB, секс с путеводителем. Таким образом, рэперка полностью разрушила карьеру рыбьего жира."
  },
  {
    id: "pavlova-cookie-tvoey-karere-pizda",
    artistId: "pavlova-cookie",
    isSingle: true,
    isUpcoming: false,
    title: "ТВОЕЙ КАРЬЕРЕ - П*ЗДА!",
    cover: "https://i.postimg.cc/nLRqGQy1/IMG-20260604-161404-336.jpg",
    releaseDate: "2025-07-24",
    reviewDate: "2026-06-04",
    label: "Yandex Market Records",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 5 }
    ],
    text: "Рэперка представляет дисс в честь ухода латенечки."
  },
  {
    id: "dollova-lyam-dva",
    artistId: "dollova",
    isSingle: true,
    isUpcoming: false,
    title: "лям-два (diss)",
    cover: "https://i.postimg.cc/zf7Y20RD/IMG-7225.jpg",
    releaseDate: "2025-07-25",
    reviewDate: "2026-06-04",
    label: "DirtyDollyRecords",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 10 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 7 }
    ],
    text: "Рэперитта представляет дисс на транс-TRIPSY в составе альбома «dollodelica»."
  },
  {
    id: "niksa-ne-vozvtrashaysya",
    artistId: "niksa",
    isSingle: true,
    isUpcoming: false,
    title: "Не возвращайся",
    cover: "https://i.postimg.cc/pLtK2ZSs/IMG-20260508-153516.jpg",
    releaseDate: "2025-08-01",
    reviewDate: "2026-06-04",
    label: "Yandex Market Records",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 5 },
      { title: "Визуал", score: 0 }
    ],
    text: "Ника не согласилась на просьбу о возвращении Ярика в музыкальном виде."
  },
  {
    id: "sicka-ugly-hot",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "Ugly Hot (DISS)",
    cover: "https://i.postimg.cc/J7JBGgzK/IMG-20260604-161501-656.jpg",
    releaseDate: "2025-11-02",
    reviewDate: "2026-06-04",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 7 },
      { title: "Дополнительно", score: 5 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 7 }
    ],
    text: "Рэперка диссит двух артисток в связи с недавними, на тот момент, событиями."
  },
  {
    id: "ksivat-copying-me",
    artistId: "ksivat",
    isSingle: true,
    isUpcoming: false,
    title: "Copying Me (Diss)",
    cover: "https://i.postimg.cc/9Q42f3c6/IMG-20260604-161550-059.jpg",
    releaseDate: "2025-11-03",
    reviewDate: "2026-06-04",
    label: "Independent / Ksivat",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 8 }
    ],
    text: "Артистка сделала ответку на дисс «Ugly Hot». Она считает, что никто не имеет право обзывать её друзей, поэтому она прожарила SiCka, чтобы та поняла с кем связалась."
  },
  {
    id: "sicka-drei",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "Drei",
    cover: "https://i.postimg.cc/RhsrMdyn/IMG-20260604-161723-566.jpg",
    releaseDate: "2025-11-04",
    reviewDate: "2026-06-04",
    label: "Independent / SiCka",
    singleCriteria: [
      { title: "Куплеты", score: 8 },
      { title: "Дополнительно", score: 9 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 10 },
      { title: "Потенциал хита", score: 8 },
      { title: "Визуал", score: 3 }
    ],
    text: "В этот раз артистка выпускает дисс сразу на трёх оппоненток, о чём говорят название и обложка трека. Этим треком рэперка ставит точку на своем участии в хуендустрии, которую отменила через несколько дней. Долбоебка."
  },
  {
    id: "dollova-panther-industry-diss",
    artistId: "dollova",
    isSingle: true,
    isUpcoming: false,
    title: "Panther Industry Diss",
    cover: "https://i.postimg.cc/sxvzh7xW/IMG-7221.png",
    releaseDate: "2025-11-14",
    reviewDate: "2026-06-04",
    label: "DirtyDollyRecords",
    singleCriteria: [
      { title: "Куплеты", score: 6 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 5 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 8 }
    ],
    text: "Рэперка выпускает один из слабейших треков, хотя возможно он таким и является, и называет его диссом на SiCka. Печально."
  },
  {
    id: "ksivat-diss-raft",
    artistId: "ksivat",
    isSingle: true,
    isUpcoming: false,
    title: "Diss Raft",
    cover: "https://i.postimg.cc/brvMFbJK/IMG-20260604-161802-148.jpg",
    releaseDate: "2026-04-05",
    reviewDate: "2026-06-04",
    label: "DPM Records",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 8 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 9 }
    ],
    text: "В связи с тем, что кое-кто отказывается играть с ней и ебучим уебищеи просто блядь в игру под названием Fart, она пишет на него дисс."
  },
  {
    id: "pavlova-cookie-pizdec-single",
    artistId: "pavlova-cookie",
    isSingle: true,
    isUpcoming: false,
    title: "пиздецц",
    cover: "https://i.postimg.cc/PJH9QDSN/IMG-20260620-171534-634.jpg",
    releaseDate: "2026-06-19",
    reviewDate: "2026-06-20",
    label: "Yandex Market Records",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Припев", score: 6 },
      { title: "Дополнительно", score: 5 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 6 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 6 }
    ],
    text: "Не понятно — зачем, не понятно — что, но оно вышло. Ладно, если артистке просто хотелось выпустить что-то, но лишь бы не уйти снова в затишье, то... Даже так нет. И если Павлова — надежда рэпа, так ещё и учитель на равне с Долловой, то у хуендустрии мало будущего. Понятное дело, что рэперка на целевую аудиторию хуендустрии уже давно не нацеливается, но в таком случае, все будет оборачиваться таким образом. Зато название оправдывает трек."
  },
  {
    id: "sicka-suspicious-weird-freestyle",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "Suspicious Weird Freestyle",
    cover: "https://i.postimg.cc/pXCQTj8h/file-00000000a6cc71f49dda86c2223bf5d4.png",
    releaseDate: "2026-06-20",
    reviewDate: "2026-06-20",
    label: "Farting Lesbians",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Дополнительно", score: 7 },
      { title: "Бит", score: 7 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 7 },
      { title: "Визуал", score: 7 }
    ],
    text: "Вроде эра Y3K закончилась, но видимо выход фристайлов каждый месяц будет продолжаться вечно. В этом свободном произведении Сичка была особо эмоциональна в своем флоу: если во всех прошлых фристайлах она была довольно безэмоциональна (особенно заметно это в «KFC Freestyle»), то тут вообще другой уровень, так ещё и при такой быстрой читке. Хоть по оценке этот фристайл хуже «Pizda Freestyle», на самом деле это не так."
  },
  {
    id: "dollova-cum-mania-sex-bomb-deluxe",
    originalAlbumId: "cum-mania",
    artistId: "dollova",
    title: "CUM MANIA: SEX BOMB Deluxe",
    cover: "https://i.postimg.cc/fyZZMG0g/IMG-7516.jpg",
    releaseDate: "2026-07-17",
    reviewDate: "2026-07-17",
    label: "DirtyDollyRecords",
    isUpcoming: false,
    text: "Подошло время к выпуску делюкс-версии своего четвертого альбома «CUM MANIA». На этих 7 треках артистка немного ностальгирует по звукам с прошлых альбомов, а именно «Ugly Doll» и «Trois». Но при этом дает довольно странный и непонятно зачем нужный материал в олицетворении «BODY MAMA». В целом, сам релиз очень даже хорош, но бывают «но».",
    tracks: [
      { number: 1, title: "DAKOTA", score: 9 },
      { number: 2, title: "BODY MAMA", score: 5 },
      { number: 3, title: "UFF.. GIRL..", score: 8 },
      { number: 4, title: "GLAMOURISTA (feat. SiCka)", score: 10 },
      { number: 5, title: "ARBUZIKI", score: 10 },
      { number: 6, title: "BADDIE☆", score: 8 },
      { number: 7, title: "CUM BACK", score: 9 }
    ],
    criteria: [
      { title: "Original Album", score: 9.2, link: "cum-mania" },
      { title: "Биты", score: 9 },
      { title: "Флоу", score: 9 },
      { title: "Потенциал хита", score: 9 },
      { title: "Визуал", score: 10 }
    ]
  },
  {
    id: "sicka-100-flopie-single",
    artistId: "sicka",
    isSingle: true,
    title: "100% FLOPIE",
    cover: "https://i.postimg.cc/c4ZX5Knm/file-000000009760720a9a7fdd5dea1d691a.png",
    releaseDate: "2026-07-13",
    reviewDate: "2026-07-15",
    label: "Farting Lesbians",
    singleCriteria: [
      { title: "Куплеты", score: 9 },
      { title: "Припев", score: 9 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 10 },
      { title: "Флоу", score: 8 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 10 },
    ],
    text: "Артистка представляет один из самых сильных диссов в хуендустрии. Он адресован артистке, которая даже не состоит в хуендустрии, и ее имя нельзя произносить."
  },
  {
    id: "sicka-fucking-fucking-freestyle",
    artistId: "sicka",
    isSingle: true,
    title: "Fucking Fucking Freestyle",
    cover: "https://i.postimg.cc/44v1tJSy/file-00000000f86c720ab676d8baf5e6fa12.png",
    releaseDate: "2026-07-11",
    reviewDate: "2026-07-15",
    label: "Farting Lesbians",
    singleCriteria: [
      { title: "Куплеты", score: 7 },
      { title: "Дополнительно", score: 8 },
      { title: "Бит", score: 8 },
      { title: "Флоу", score: 7 },
      { title: "Потенциал хита", score: 6 },
      { title: "Визуал", score: 8 },
    ],
    text: "Довольно посредственный июльский фристайл, в котором, по сообщениям Сички, она палит строчки из альбома. Это звучит странно, но, однако, немного захватывает. Своим звуком трек немного отсылает нас в эру фристайлов «Y3K!», но это не значит, что это может быть очень хорошо, как «TOTY» или «M Fart (Freestyle)»."
  },
  {
    id: "katseye-wild-ep",
    artistId: "katseye",
    title: "WILD EP",
    cover: "https://i.postimg.cc/6pHxg9NT/IMG-20260718-023224-834.jpg",
    releaseDate: "2026-08-14",
    label: "Hybe X Geffen Records",
    isUpcoming: true,
    text: "Неизвестно",
    tracks: [
      { number: 1, title: "PINKY UP" },
      { number: 2, title: "Track 2" },
      { number: 3, title: "Track 3" },
      { number: 4, title: "Track 4" },
      { number: 5, title: "Track 5" }
    ],
    criteria: [
      { title: "Биты" },
      { title: "Флоу" },
      { title: "Потенциал хита" },
      { title: "Визуал" }
    ]
  }
];

export const getArtist = (id) => artists.find((a) => a.id === id);
export const getReview = (id) => reviews.find((r) => r.id === id);
export const getReviewsForArtist = (artistId) =>
  reviews.filter(
    (r) =>
      r.artistId === artistId ||
      (r.artistIds && r.artistIds.includes(artistId)),
  );
export const getScore = (review, isOld = false) => {
  if (review.isUpcoming) return 0;
  
  if (isOld && review.oldScore !== undefined) {
    return review.oldScore;
  }

  if (review.isSingle && review.singleCriteria) {
    const scoredCriteria = review.singleCriteria.filter(
      (c) => typeof c.score === "number",
    );
    if (scoredCriteria.length === 0) return 0;
    const sum = scoredCriteria.reduce((acc, c) => acc + c.score, 0);
    return Number((sum / scoredCriteria.length).toFixed(1));
  }

  const scoredTracks =
    review.tracks?.filter((t) => typeof t.score === "number") || [];
  const tracksMean =
    scoredTracks.length > 0
      ? scoredTracks.reduce((acc, t) => acc + t.score, 0) / scoredTracks.length
      : 0;

  const scoredCriteria =
    review.criteria?.filter((c) => typeof c.score === "number") || [];
  const critMean =
    scoredCriteria.length > 0
      ? scoredCriteria.reduce((acc, c) => acc + c.score, 0) /
        scoredCriteria.length
      : 0;

  if (scoredTracks.length > 0 && scoredCriteria.length > 0) {
    return Number(((tracksMean + critMean) / 2).toFixed(1));
  }
  if (scoredTracks.length > 0) return Number(tracksMean.toFixed(1));
  if (scoredCriteria.length > 0) return Number(critMean.toFixed(1));

  if (review.score !== undefined) return review.score;
  return 0;
};

export const getGlobalRank = (reviewId, isSingle) => {
  const sorted = [...reviews]
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (!!r.isSingle !== !!isSingle) return false;
      if (r.noTop) return false;
      const artist = artists.find((a) => a.id === r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));
  const idx = sorted.findIndex((r) => r.id === reviewId);
  return idx >= 0 ? idx + 1 : 0;
};

export const getTier = (reviewId, isSingle) => {
  const sorted = [...reviews]
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (!!r.isSingle !== !!isSingle) return false;
      if (r.noTop) return false;
      const artist = artists.find((a) => a.id === r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));
    
  const total = sorted.length;
  if (total === 0) return null;
  
  const p1 = Math.round(total * 0.05);
  const p2 = Math.round(total * 0.15);
  const p3 = Math.round(total * 0.35);
  const p4 = Math.round(total * 0.65);
  const p5 = Math.round(total * 0.85);

  const getInitialTier = (idx) => {
    if (idx < p1) return "S+";
    if (idx < p2) return "S";
    if (idx < p3) return "A";
    if (idx < p4) return "B";
    if (idx < p5) return "C";
    return "D";
  };

  let previousVal = getScore(sorted[0]);
  let currentTier = getInitialTier(0);

  for (let i = 0; i < total; i++) {
    const val = getScore(sorted[i]);
    const initialTier = getInitialTier(i);
    
    if (val !== previousVal) {
      currentTier = initialTier;
    }
    
    if (sorted[i].id === reviewId) {
      return currentTier;
    }
    
    previousVal = val;
  }
  return null;
};

export const getArtistValue = (artistId, customReviews = reviews, isOld = false) => {
  const artistReviews = customReviews.filter(
    (r) =>
      (r.artistId === artistId ||
        (r.artistIds && r.artistIds.includes(artistId))) &&
      !r.isUpcoming &&
      !r.noTop &&
      (!r.isDeleted || isOld),
  );
  if (artistReviews.length === 0) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  artistReviews.forEach((r) => {
    let w = 5;
    if (r.isSingle) {
      w = 1;
    } else if (r.title.toLowerCase().includes("deluxe") && r.criteria && r.criteria.some((c) => c.title === "Original Album" || c.title === "Оригинальный альбом")) {
      w = 2.5;
    } else if (r.title.toLowerCase().includes("сборник") || r.title.toLowerCase().includes("compilation")) {
      w = 1;
    } else if (r.title.includes("EP") || (r.tracks && r.tracks.length >= 4 && r.tracks.length <= 7)) {
      w = 3;
    } else if (r.tracks && r.tracks.length >= 8) {
      w = 5;
    }

    totalScore += getScore(r, isOld) * w;
    totalWeight += w;
  });

  const BASELINE_SCORE = 7.5;
  const BASELINE_WEIGHT = 3;

  const bayesianAvg =
    (totalScore + BASELINE_SCORE * BASELINE_WEIGHT) /
    (totalWeight + BASELINE_WEIGHT);

  const rawAvg = totalScore / totalWeight;
  let volumeBonus = 0;
  if (rawAvg > 7.0) {
    const qualityFactor = (Math.min(rawAvg, 10.0) - 7.0) / 3.0;
    const maxBonusForVolume = totalWeight * 0.04;
    volumeBonus = maxBonusForVolume * qualityFactor;
  }

  return Math.min(bayesianAvg + volumeBonus, 10.0);
};

export const getArtistRank = (reviewId, artistId, isSingle) => {
  const artistReviews = getReviewsForArtist(artistId).filter(
    (r) => !r.isUpcoming && !!r.isSingle === !!isSingle,
  );
  const sorted = [...artistReviews].sort((a, b) => getScore(b) - getScore(a));
  const idx = sorted.findIndex((r) => r.id === reviewId);
  return idx >= 0 ? idx + 1 : 0;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.getFullYear().toString();
};
