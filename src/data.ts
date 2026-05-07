import { parse, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface Track {
  title: string;
  score?: number;
}

export interface Review {
  id: string;
  artistId: string;
  title: string;
  cover: string;
  releaseDate: string; // YYYY-MM-DD
  reviewDate: string;  // YYYY-MM-DD
  label: string;
  text: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  photo: string;
}

export const artists: Artist[] = [
  {
    id: 'dollova',
    name: 'Dollova',
    photo: 'https://i.postimg.cc/x1CQp2xf/IMG-20260507-201146-613.jpg',
  },
  {
    id: 'sicka',
    name: 'SiCka',
    photo: 'https://i.postimg.cc/dVLjJJJj/IMG-20260507-221846-478.jpg',
  },
  {
    id: 'various-artists',
    name: 'Various Artists',
    photo: 'https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg',
  },
  {
    id: 'avya-asti',
    name: 'АВЯ ASTI',
    photo: 'https://i.postimg.cc/1X0snxPn/IMG-20260507-222633-360.jpg',
  },
  {
    id: 'pavlova-cookie',
    name: 'Pavlova Cookie',
    photo: 'https://i.postimg.cc/Y2JwkCNB/IMG-20260507-224606-965.jpg',
  },
  {
    id: 'niksa',
    name: 'NIK$A',
    photo: 'https://i.postimg.cc/1zcjx9mQ/IMG-20260507-231349-872.jpg',
  }
];

export const reviews: Review[] = [
  {
    id: 'ugly-doll',
    artistId: 'dollova',
    title: 'Ugly Doll EP',
    cover: 'https://i.postimg.cc/x1CQp2xf/IMG-20260507-201146-613.jpg',
    releaseDate: '2026-01-30',
    reviewDate: '2026-02-21',
    label: 'Independent / Dollova',
    text: 'Артистка доказывает, что умеет звучать хорошо во всех звуках и жанрах, но даже так может продолжить работать в одном и том же. Не смотря на это, качество мини-альбома все равно перебивает этот недостаток.',
    tracks: [
      { title: 'Girlss', score: 9 },
      { title: 'Priority', score: 6 },
      { title: 'Ugly Doll', score: 10 },
      { title: 'Booty Drop', score: 9 },
      { title: 'Fat Classic', score: 8 },
      { title: 'Shopping', score: 8 },
      { title: 'Fat Guest 2', score: 8 },
      { title: 'BuBuBu', score: 9 },
    ]
  },
  {
    id: 'ahh',
    artistId: 'sicka',
    title: 'ahh... EP',
    cover: 'https://i.postimg.cc/dVLjJJJj/IMG-20260507-221846-478.jpg',
    releaseDate: '2025-05-17',
    reviewDate: '2025-07-08',
    label: 'Independent / SiCka',
    text: 'Пердеть в туалете и на члене одновременно, при этом играя в кукиран — это только ее стихия.',
    tracks: [
      { title: 'Не пернешь', score: 7 },
      { title: 'CkSu', score: 8 },
      { title: 'LGBTшки', score: 7 },
      { title: 'No Cookies', score: 7 },
      { title: 'Okurr', score: 6 },
      { title: 'Gay&Mono', score: 4 },
      { title: 'Touch It', score: 7 }
    ]
  },
  {
    id: 'huevision-2025',
    artistId: 'various-artists',
    title: 'Huevision 2025 — Album EP',
    cover: 'https://i.postimg.cc/brkbcBDW/IMG-20260428-110522-876.jpg',
    releaseDate: '2025-06-08',
    reviewDate: '2025-07-08',
    label: 'HUEVKI',
    text: 'Самое разностороннее шоу из когда-либо бывавших в узком телеграме с замечательными композициями',
    tracks: [
      { title: 'SiCka — Let Me', score: 8 },
      { title: 'NIK$A — Business', score: 10 },
      { title: 'Ksivat — 5 Minutes', score: 8 },
      { title: 'Dollova — Tore You Too', score: 7 }
    ]
  },
  {
    id: 'escort',
    artistId: 'avya-asti',
    title: 'ESCORT',
    cover: 'https://i.postimg.cc/1X0snxPn/IMG-20260507-222633-360.jpg',
    releaseDate: '2025-06-20',
    reviewDate: '2025-07-08',
    label: 'Independent / АВЯ ASTI',
    text: 'Баллада про секс и эскорт, смешанная в очень шлюховатой попсе и невероятно проститутном рэпе',
    tracks: [
      { title: 'ЭСКОРТ', score: 8 },
      { title: 'ЛОМАЕТ', score: 8 },
      { title: 'Я ТВОЯ ДЫРКА', score: 8 },
      { title: 'МИЛФА', score: 6 },
      { title: 'КОШКА', score: 8 },
      { title: 'SEXSTYLE', score: 7 },
      { title: 'BDSM', score: 9 }
    ]
  },
  {
    id: 'penis-pussy',
    artistId: 'sicka',
    title: 'penis pussy',
    cover: 'https://i.postimg.cc/KzMgWYrZ/IMG-20260507-223723-016.jpg',
    releaseDate: '2025-06-26',
    reviewDate: '2025-07-08',
    label: 'Independent / SiCka',
    text: 'История про пизду в туалете, при этом используется семпл из Майнкрафта, а затем ahh-ные и трогательные моменты',
    tracks: [
      { title: 'Oh', score: 6 },
      { title: 'Sex Vision', score: 7 },
      { title: 'And My Pussy-ah', score: 9 },
      { title: 'FSP', score: 8 },
      { title: 'Shake This Coochie', score: 9 },
      { title: 'Toilet', score: 7 },
      { title: 'Cunt', score: 6 },
      { title: 'Lick and Fap', score: 10 },
      { title: 'Burning Classics', score: 5 },
      { title: 'Let Me', score: 8 },
      { title: 'Initials', score: 10 },
      { title: 'A Little Closer', score: 7 },
      { title: 'Should I?', score: 5 },
      { title: 'Miss Poopie', score: 6 }
    ]
  },
  {
    id: 'penis-pussy-deluxe',
    artistId: 'sicka',
    title: 'penis pussy: farty poopy (Deluxe)',
    cover: 'https://i.postimg.cc/k4sdqQyY/IMG-20260507-224212-538.jpg',
    releaseDate: '2025-07-13',
    reviewDate: '2025-07-12',
    label: 'Independent / SiCka',
    text: 'Интрига в начале и самый неожиданный поворот в истории фитов в конце делюкса.',
    tracks: [
      { title: 'It Sounds Like', score: 7 },
      { title: 'Rim', score: 8 },
      { title: 'Queer Explosion Bomb', score: 7 },
      { title: 'FSPR (with Slayyyter)', score: 10 }
    ]
  },
  {
    id: 'ma-life',
    artistId: 'pavlova-cookie',
    title: 'Ma Life EP',
    cover: 'https://i.postimg.cc/Y2JwkCNB/IMG-20260507-224606-965.jpg',
    releaseDate: '2025-06-28',
    reviewDate: '2025-07-21',
    label: 'Yandex Market Records',
    text: 'Отличная посиделка в каком бы то ни было месте, даже в стриптизе, но было ли хорошим решением выбрать это в середину?',
    tracks: [
      { title: 'YMRIML', score: 7 },
      { title: 'ДИНАМИТ', score: 8 },
      { title: 'СПЕРМА В МОЕЙ ЖОПЕ', score: 5 },
      { title: 'ВНЕ ОЧЕРЕДИ', score: 9 },
      { title: 'RARARA 2 (Freestyle)', score: 6 }
    ]
  },
  {
    id: 'tits-in-heaven',
    artistId: 'sicka',
    title: 'TITS IN HEAVEN (Микстейп)',
    cover: 'https://i.postimg.cc/gk8ytgkc/IMG-20260507-230349-727.jpg',
    releaseDate: '2025-07-22',
    reviewDate: '2025-07-22',
    label: 'Independent / SiCka',
    text: 'На этом микстейпе вы не найдете ниодного ужасного трека, что делает релиз одним из самых крепких в хуендустрии. Определенно, имеет шанс стать самым лучшим релизом SiCka даже после следующих альбомов, если она все таки не уйдет из музыки.',
    tracks: [
      { title: 'BUBBLE POOP', score: 8 },
      { title: 'I KISSED YOUR BIDET', score: 9 },
      { title: 'SEX WITH POOPS', score: 8 },
      { title: 'I\'M READY', score: 10 },
      { title: 'TRACK 5', score: 7 },
      { title: 'I\'M NOT OKAY', score: 8 },
      { title: 'DEEP LIKE PUSSY', score: 8 },
      { title: 'HE RULES MY JUICE', score: 7 },
      { title: 'VINTAGE PORN', score: 8 },
      { title: 'FINAL FART', score: 7 }
    ]
  },
  {
    id: 'dollodelica',
    artistId: 'dollova',
    title: 'dollodelica',
    cover: 'https://i.postimg.cc/C5Nhzysz/IMG-20260507-230858-435.jpg',
    releaseDate: '2025-07-25',
    reviewDate: '2025-07-26',
    label: 'Independent / Dollova',
    text: 'Очень разнообразный, хоть и дебютный, альбом, который содержит в себе сразу две десятки и одну девятку. Эти оценки — показатель большого качества.',
    tracks: [
      { title: 'intro', score: 8 },
      { title: '2x2', score: 7 },
      { title: 'зпшка', score: 7 },
      { title: 'queen (bonus track)', score: 8 },
      { title: 'пахала (interlude)', score: 7 },
      { title: 'ливай', score: 9 },
      { title: 'лям-два (diss)', score: 8 },
      { title: 'оплата', score: 10 },
      { title: 'jada (feat. Ariana Grande)', score: 10 },
      { title: 'уволен', score: 7 },
      { title: 'outro', score: 7 }
    ]
  },
  {
    id: 'kult-podzalupkinoj',
    artistId: 'niksa',
    title: 'КУЛЬТ ПОДЗАЛУПКИНОЙ',
    cover: 'https://i.postimg.cc/1zcjx9mQ/IMG-20260507-231349-872.jpg',
    releaseDate: '2025-07-26',
    reviewDate: '2025-07-26',
    label: 'Independent / NIK$A',
    text: 'Может треклист и может показаться маленьким, но он содержит то, что может сделать альбом концептуальным. Почти в каждом треке текст на разные темы — так артистка делится своими разными переживаниями.',
    tracks: [
      { title: 'Let\'s', score: 8 },
      { title: 'На пути', score: 7 },
      { title: 'В очереди', score: 10 },
      { title: 'Overpriced Wig\'s (interlude)', score: 8 },
      { title: 'PuffMeedy', score: 8 },
      { title: 'Я плохая', score: 8 },
      { title: 'Вне очереди', score: 7 },
      { title: 'Без названия (outro)', score: 7 }
    ]
  },
  {
    id: 'glitter-and-violence',
    artistId: 'avya-asti',
    title: 'GLITTER AND VIOLENCE',
    cover: 'https://i.postimg.cc/V67189ft/IMG-20260507-232548-949.jpg',
    releaseDate: '2025-08-15',
    reviewDate: '2025-09-09',
    label: 'Independent / АВЯ ASTI',
    text: 'По идее, интересный альбом, который должен был проявить большое впечатление, в итоге с небольшим крахом провалил свою идею.',
    tracks: [
      { title: 'Listen to fucking drop', score: 7 },
      { title: 'Shawty Pass', score: 7 },
      { title: 'Ddddr*gs', score: 6 },
      { title: 'Eu yeep', score: 6 },
      { title: 'Tokyo Ho', score: 8 },
      { title: 'Tutti Titti', score: 9 },
      { title: 'One,two,three...', score: 6 },
      { title: 'The most lesbian track (feat. SiCka)', score: 6 },
      { title: 'Touch me there', score: 7 },
      { title: 'Rehab', score: 9 },
      { title: 'Sexy Video', score: 8 },
      { title: 'Secrets', score: 7 },
      { title: 'R.T.H.Y.', score: 8 }
    ]
  },
  {
    id: 'i-am-the-winner',
    artistId: 'pavlova-cookie',
    title: 'I AM THE WINNER',
    cover: 'https://i.postimg.cc/nhHJCwXF/IMG-20260507-232554-471.jpg',
    releaseDate: '2025-08-22',
    reviewDate: '2025-09-09',
    label: 'Yandex Market Records',
    text: 'Объявление себя королевой в рэпе — субъективное мнение, на которое рэперка имеет полное право, хоть и всё-таки остаются конкуренты.',
    tracks: [
      { title: 'ОВЕРСАЙЗ', score: 6 },
      { title: 'МУСОРНЫЕ БАЧКИ', score: 7 },
      { title: 'ТВОЕЙ КАРЬЕРЕ - П*ЗДА!', score: 8 },
      { title: 'TRENDSETTER', score: 6 },
      { title: 'BOSS', score: 6 },
      { title: 'INTERLUDE' },
      { title: 'ГОВНО НА ВЕНТИЛЯТОР', score: 8 },
      { title: 'SH1PU4KA!', score: 9 },
      { title: 'АНГЕЛЬСКИЙ ГОЛОСОК', score: 8 },
      { title: 'ТЫ НЕ ПОБЕДИТЕЛЬ' }
    ]
  }
];

export const getArtist = (id: string) => artists.find(a => a.id === id);
export const getReview = (id: string) => reviews.find(r => r.id === id);
export const getReviewsForArtist = (artistId: string) => reviews.filter(r => r.artistId === artistId);
export const getScore = (review: Review) => {
  const scoredTracks = review.tracks.filter(t => typeof t.score === 'number');
  if (scoredTracks.length === 0) return 0;
  const sum = scoredTracks.reduce((acc, t) => acc + (t.score as number), 0);
  return Number((sum / scoredTracks.length).toFixed(1));
};

export const getGlobalRank = (reviewId: string) => {
  const sorted = [...reviews].sort((a, b) => getScore(b) - getScore(a));
  return sorted.findIndex(r => r.id === reviewId) + 1;
};

export const getArtistRank = (reviewId: string, artistId: string) => {
  const artistReviews = getReviewsForArtist(artistId);
  const sorted = [...artistReviews].sort((a, b) => getScore(b) - getScore(a));
  return sorted.findIndex(r => r.id === reviewId) + 1;
};

export const formatDate = (dateStr: string) => {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'dd.MM.yyyy');
};

export const formatYear = (dateStr: string) => {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'yyyy');
};
