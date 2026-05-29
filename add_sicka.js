import fs from 'fs';

let data = fs.readFileSync('data.js', 'utf8');

data = data.replace(
  '{ title: "Fuck Me Nigga", score: 8 }',
  '{ title: "福克米 内嘎", score: 8 }'
);

// We need to inject the new single into the reviews array.
// The reviews array ends with:   }, \n];
// Let's replace "];\n\nexport {" with the new review + "];\n\nexport {"
const newReview = `  {
    id: "sicka-fu-ke-mi-nei-ga",
    artistId: "sicka",
    isSingle: true,
    isUpcoming: false,
    title: "福克米 内嘎",
    cover: "https://i.postimg.cc/fTt3XKqh/IMG-20260529-175536-947.jpg",
    releaseDate: "2025-06-16",
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
`;

const regex = /  \},\s*\];/;
const replacement = `  },\n${newReview}];`;

if (regex.test(data)) {
  data = data.replace(regex, replacement);
} else {
    // try finding just closing bracket
    const regex2 = /\n\];\n/;
    data = data.replace(regex2, ',\n' + newReview + '];\n');
}

fs.writeFileSync('data.js', data);
