import fs from 'fs';

let data = fs.readFileSync('data.js', 'utf8');

const injected = "  {\n" +
"    id: \"sicka-fu-ke-mi-nei-ga\",\n" +
"    artistId: \"sicka\",\n" +
"    isSingle: true,\n" +
"    isUpcoming: false,\n" +
"    title: \"福克米 内嘎\",\n" +
"    cover: \"https://i.postimg.cc/fTt3XKqh/IMG-20260529-175536-947.jpg\",\n" +
"    releaseDate: \"2025-06-16\",\n" +
"    reviewDate: \"2026-05-29\",\n" +
"    label: \"Independent / SiCka\",\n" +
"    singleCriteria: [\n" +
"      { title: \"Куплеты\", score: 9 },\n" +
"      { title: \"Припев\", score: 8 },\n" +
"      { title: \"Дополнительно\", score: 8 },\n" +
"      { title: \"Бит\", score: 9 },\n" +
"      { title: \"Флоу\", score: 9 },\n" +
"      { title: \"Потенциал хита\", score: 9 },\n" +
"      { title: \"Визуал\", score: 9 }\n" +
"    ],\n" +
"    text: \"Один из самых просящих на секс треков рэперки, а на этот раз она прямо обращается к человеку, который должен ее трахнуть — ниха.\"\n" +
"  },\n";

// Remove wrong injected:
const wrongInjected = "  {\n" +
"    id: \"sicka-fu-ke-mi-nei-ga\",\n" +
"    artistId: \"sicka\",\n" +
"    isSingle: true,\n" +
"    isUpcoming: false,\n" +
"    title: \"福克米 内嘎\",\n" +
"    cover: \"https://i.postimg.cc/fTt3XKqh/IMG-20260529-175536-947.jpg\",\n" +
"    releaseDate: \"2025-06-16\",\n" +
"    reviewDate: \"2026-05-29\",\n" +
"    label: \"Independent / SiCka\",\n" +
"    singleCriteria: [\n" +
"      { title: \"Куплеты\", score: 9 },\n" +
"      { title: \"Припев\", score: 8 },\n" +
"      { title: \"Дополнительно\", score: 8 },\n" +
"      { title: \"Бит\", score: 9 },\n" +
"      { title: \"Флоу\", score: 9 },\n" +
"      { title: \"Потенциал хита\", score: 9 },\n" +
"      { title: \"Визуал\", score: 9 }\n" +
"    ],\n" +
"    text: \"Один из самых просящих на секс треков рэперки, а на этот раз она прямо обращается к человеку, который должен ее трахнуть — ниха.\"\n" +
"  },\n" +
"];";

data = data.replace(wrongInjected, "];");

// Inject correctly into `reviews` array right before export const getArtist
data = data.replace(
  "],\n  },\n];\n\nexport const getArtist",
  "],\n  },\n" + injected + "];\n\nexport const getArtist"
);

fs.writeFileSync('data.js', data);
