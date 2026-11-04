/**
 * OUR FOREVER — SONGS UNTIL WE MEET
 * ==========================================
 * A Private Love Story for Devu from Ponnu
 * ==========================================
 */

const CONFIG = {

  // ── PEOPLE ─────────────────────────────────────────────
  her: {
    name:     "Devu",              // Her name — shown on the opening screen
    nickname: "My Love",           // Nickname used in intimate messages
  },
  me: {
    name: "Ponnu",                 // Your name — used in voice section credit
  },

  // ── OUR LOVE STORY ──────────────────────────────────────
  album: {
    title:    "OUR FOREVER",
    subtitle: "Songs Until We Meet",
    tagline:  "Six songs. Countless feelings. One beautiful love story.",
  },

  // ── SIX TRACKS ──────────────────────────────────────────
  tracks: [
    {
      id:       1,
      title:    "Etho Priya Raagam Mooli Njan",
      artist:   "Vidhu Prathap • Aarya",
      language: "Malayalam",
      file:     "assets/songs/track-01.mp3",
      chapter:  "WHERE OUR STORY BEGAN",
      message:  "Some songs are just songs. But some songs become memories. This one will always remind me of where our story began. ❤️",
      theme:    "nostalgic",
    },
    {
      id:       2,
      title:    "Innum Konjam Naeram",
      artist:   "A.R. Rahman • Shweta Mohan • Maryan",
      language: "Tamil",
      file:     "assets/songs/track-02.mp3",
      chapter:  "A LITTLE MORE TIME WITH YOU",
      message:  "If I could ask for one thing, it would be a little more time with you. Even an ordinary moment feels special when it's with you. ❤️",
      theme:    "time",
    },
    {
      id:       3,
      title:    "Hemanthamen",
      artist:   "Vijay Yesudas • Rahul Raj • Kohinoor",
      language: "Malayalam",
      file:     "assets/songs/track-03.mp3",
      chapter:  "FALLING FOR YOU",
      message:  "Somewhere along the way, talking to you became my favourite part of the day. Without even realising it, I started falling for you. ❤️",
      theme:    "winter",
    },
    {
      id:       4,
      title:    "Nee En Vennila",
      artist:   "Haricharan • Cousins",
      language: "Malayalam",
      file:     "assets/songs/track-04.mp3",
      chapter:  "YOU ARE MY MOONLIGHT",
      message:  "Even when you're far away, you make my world feel brighter. If I could choose one light to follow, it would always be yours. 🌙❤️",
      theme:    "moon",
    },
    {
      id:       5,
      title:    "Pesamale",
      artist:   "Pradeep Kumar • Kadhal Varatho",
      language: "Tamil",
      file:     "assets/songs/track-05.mp3",
      chapter:  "WORDS I CANNOT SAY",
      message:  "Sometimes I have so many things to tell you, but I don't know where to begin. Maybe that's why music speaks for me when words aren't enough. ❤️",
      theme:    "letter",
    },
    {
      id:       6,
      title:    "Dheema",
      artist:   "Anirudh Ravichander • LIK",
      language: "Tamil",
      file:     "assets/songs/track-06.mp3",
      chapter:  "MY FAVOURITE FEELING",
      message:  "You have this special way of making me smile without even trying. I don't know how you do it, but you have become my favourite feeling. ❤️",
      theme:    "warm",
    },
  ],

  // ── PHOTOGRAPHS ──────────────────────────────────────────
  // Place photos in: assets/photos/
  photos: {
    her:      "assets/photos/her-photo.jpg",       // Devu portrait in Kerala saree
    group:    "assets/photos/group-photo.jpg",     // Together in traditional white attire
    herEyes:  "assets/photos/her-eyes.jpg",        // Devu eyes close-up
    bothEyes: "assets/photos/both-eyes.jpg",       // Both eyes together
    finalHer: "assets/photos/final-photo.jpg",     // Devu sweet smile with glasses (unrepeated)
    selfie:   "assets/photos/sweet-selfie.jpg",    // Outdoor romantic selfie
    retro:    "assets/photos/retro-memory.jpg",    // 80s photoshoot
  },

  // ── ALBUM ARTWORK ─────────────────────────────────────────
  // Place artwork in: assets/album-art/
  // Falls back to a CSS-generated gradient if not found
  albumArt: "assets/album-art/album-cover.jpg",

  // ── VOICE RECORDING ───────────────────────────────────────
  // Place voice file in: assets/voice/
  voice: {
    file:  "assets/voice/final-message.ogg",       // voice recording
    label: "There are some things I wanted you to hear in my own voice...",
  },

  // ── PHOTO SECTION COPY ────────────────────────────────────
  photoSections: {
    her: {
      heading:  "My Favourite Person ❤️",
      subtitle: "Every picture has something special about you.",
    },
    group: {
      heading:  "A Little Piece of Our World",
      message:  "Among all the moments and people in life, some memories become special for reasons that are difficult to explain. This picture is one of those little pieces of my story.",
    },
    herEyes: {
      heading:  "Your Eyes, My Favourite View",
      message:  "Sometimes, I find myself looking at your eyes and wondering how something so beautiful can make me feel so much, even from this far away.",
    },
    bothEyes: {
      heading:  "Two Eyes, One Beautiful Story",
      message:  "Two different places. Two different lives. Yet somehow, our paths crossed, and we became part of each other's world.",
    },
  },

  // ── "WHEN YOU MISS ME" MESSAGES ───────────────────────────
  missMe: {
    options: [
      {
        label:   "When you miss me",
        icon:    "💭",
        message: "I wish I could be there right now, just to hold your hand and remind you that you are not alone. Until that day comes, remember that someone far away is thinking about you.",
      },
      {
        label:   "When you're feeling sad",
        icon:    "🌧",
        message: "I may not always know the perfect words to make everything better, but I want you to know that you never have to hide your feelings from me. I'm here to listen.",
      },
      {
        label:   "When you cannot sleep",
        icon:    "🌙",
        message: "Close your eyes for a moment. Imagine that distance is only temporary and that one day we will have all the time we keep wishing for.",
      },
      {
        label:   "When you need comfort",
        icon:    "🕊",
        message: "Take a deep breath. Whatever today has been like, I hope tomorrow is kinder to you. You deserve peace, happiness and love.",
      },
    ],
  },

  // ── DREAM SCENES — FIRST MEETING ──────────────────────────
  dreamScenes: [
    { icon: "🤗", title: "Our First Hug",              desc: "The moment when distance finally becomes just a memory." },
    { icon: "🚶", title: "Our First Walk Together",    desc: "Two people, the same path, finally side by side." },
    { icon: "🤝", title: "Holding Hands",              desc: "No more wishing. Just warmth, and you." },
    { icon: "📷", title: "Our First Photograph",       desc: "The picture we have always imagined taking together." },
    { icon: "🌅", title: "Watching the Sunset",        desc: "The same sky, the same moment, finally together." },
  ],

  // ── FINAL VALENTINE'S MESSAGE ─────────────────────────────
  finalMessage: [
    "We haven't taken our first photograph together.",
    "We haven't shared our first hug.",
    "We haven't walked together under the same sky.",
    "But we have shared conversations, smiles, dreams and countless little moments that mean so much to me.",
    "This is our first Valentine's Day.",
    "And I hope it becomes the first of many.",
    "I don't know exactly when our first meeting will happen,",
    "but I know how special that day will be.",
    "Until then, no distance can stop me from choosing you.",
    "Happy First Valentine's Day, my love.",
    "Our story is just beginning. ❤️",
  ],

  // ── OPTIONAL DATES ────────────────────────────────────────
  dates: {
    firstTalked:    "",  // e.g. "October 2024"
    valentinesDay:  "14 February",
  },

};
