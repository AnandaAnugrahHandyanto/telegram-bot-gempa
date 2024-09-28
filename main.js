const TelegramBot = require("node-telegram-bot-api");

const token = ".";
const options = {
    polling: true,
};

const farhanBot = new TelegramBot(token, options);
const prefix = "/";

// Testing
const sayHi = new RegExp(`^${prefix}halo$`);
const gempa = new RegExp(`^${prefix}gempa$`);

// Handler untuk pesan /halo
farhanBot.onText(sayHi, (msg) => {
    farhanBot.sendMessage(msg.chat.id, "Halo pler");
});

// Handler untuk pesan /gempa
farhanBot.onText(gempa, async (msg) => {
    const BMKG = "https://data.bmkg.go.id/DataMKG/TEWS/";
    const apiUrl = BMKG + "autogempa.json";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Gagal mengakses data gempa dari BMKG.');
        }

        const data = await response.json();
        const {
            Infogempa: {
                gempa: {
                    Tanggal, Jam, DateTime, Coordinates, Lintang, Bujur,
                    Magnitude, Kedalaman, Wilayah, Potensi, Dirasakan, Shakemap
                }
            }
        } = data;

        const imageUrl = BMKG + Shakemap;
        const resultText = `
Bot berita Gempa ini dibuat oleh Farhan, dan difungsikan oleh Ananda Anugrah Handyanto

Waktu: ${Tanggal} | ${Jam} | ${DateTime}
Magnitudo: ${Magnitude} Magnitude
Wilayah: ${Wilayah}
Koordinat: ${Coordinates}
Lintang: ${Lintang}
Bujur: ${Bujur}
Kedalaman: ${Kedalaman}
Potensi: ${Potensi}
Dirasakan: ${Dirasakan}
`;

        // Kirim pesan dengan foto
        await farhanBot.sendPhoto(msg.chat.id, imageUrl, { caption: resultText });
    } catch (error) {
        console.error(error);
        farhanBot.sendMessage(msg.chat.id, "Maaf, terjadi kesalahan saat mengambil data gempa.");
    }
});
