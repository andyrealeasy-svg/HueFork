const fs = require('fs');
let code = fs.readFileSync('data.js', 'utf8');

const replacement = `    title: "CUM MANIA: SEX BOMB Deluxe",
    cover: "https://i.postimg.cc/hPdrZDX8/IMG-20260714-233931-495.jpg",
    releaseDate: "2026-07-17",
    label: "DirtyDollyRecords",
    isUpcoming: true,
    text: "Неизвестно",
    tracks: [
      { number: 1, title: "DAKOTA" },
      { number: 2, title: "BODY MAMA" },
      { number: 3, title: "UFF.. GIRL.." },
      { number: 4, title: "GLAMOURISTA (feat. SiCka)" },
      { number: 5, title: "ARBUZIKI" },
      { number: 6, title: "BADDIE☆" },
      { number: 7, title: "CUM BACK" }
    ],
    criteria: [
      { title: "Original Album", score: "9.2", link: "cum-mania" },
      { title: "Биты" },
      { title: "Флоу" },
      { title: "Потенциал хита" },
      { title: "Визуал" },
    ],`;

code = code.replace(/title: "CUM MANIA: SEX BOMB Deluxe",\n\s*criteria: \[\n\s*\{ title: "Биты" \},\n\s*\{ title: "Флоу" \},\n\s*\{ title: "Потенциал хита" \},\n\s*\{ title: "Визуал" \},\n\s*\],/m, replacement);

fs.writeFileSync('data.js', code);
