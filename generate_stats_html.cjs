const formatName = {
    'digital': 'Цифровой',
    'cd': 'CD',
    'vinyl': 'Винил'
};

const getArtist = (id) => {
    return reviews.find(r => r.artistId === id) || { name: id };
}
// I will just put this in profile.js
