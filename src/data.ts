import { parse, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface Track {
  title: string;
  score: number;
  duration: string;
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
    id: 'kanye-east',
    name: 'Kanye East',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      { title: 'Girlss', score: 9, duration: '2:45' },
      { title: 'Priority', score: 6, duration: '3:12' },
      { title: 'Ugly Doll', score: 10, duration: '2:58' },
      { title: 'Booty Drop', score: 9, duration: '2:30' },
      { title: 'Fat Classic', score: 8, duration: '3:05' },
      { title: 'Shopping', score: 8, duration: '2:22' },
      { title: 'Fat Guest 2', score: 8, duration: '3:40' },
      { title: 'BuBuBu', score: 9, duration: '2:50' },
    ]
  },
  {
    id: 'yandhi-2',
    artistId: 'kanye-east',
    title: 'Yandhi 2',
    cover: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    releaseDate: '2025-10-15',
    reviewDate: '2025-11-01',
    label: 'GOOD Music',
    text: 'Неожиданное возвращение, которое не принесло ничего нового, кроме разочарования и парочки интересных битов. Ожидания были высоки, но реальность оказалась суровой.',
    tracks: [
      { title: 'Intro', score: 5, duration: '1:20' },
      { title: 'City of Lights', score: 7, duration: '4:10' },
      { title: 'Lost in the Sauce', score: 6, duration: '3:33' },
    ]
  }
];

export const getArtist = (id: string) => artists.find(a => a.id === id);
export const getReview = (id: string) => reviews.find(r => r.id === id);
export const getReviewsForArtist = (artistId: string) => reviews.filter(r => r.artistId === artistId);
export const getScore = (review: Review) => {
  if (review.tracks.length === 0) return 0;
  const sum = review.tracks.reduce((acc, t) => acc + t.score, 0);
  return Number((sum / review.tracks.length).toFixed(1));
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
