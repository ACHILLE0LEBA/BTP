/* ==========================================================
   NEW BTP SARL — editable content data
   Replace the "img" placeholder paths with real photographs
   once available. Everything else can be edited freely.
   ========================================================== */

/* ---- Project detail data (used by the "En savoir plus" modal) ---- */
const PROJECTS = {
  "yaounde-parc": {
    img: "images/projects/bicec-yaounde-parc.jpg",
    location: "Yaoundé  Parc, Cameroun",
    services: {
      fr: ["Second œuvre", "Peinture intérieure", "Peinture extérieure", "Signalétique extérieure", "Embellissement de la cour"],
      en: ["Second-fix works", "Interior painting", "Exterior painting", "Exterior signage", "Courtyard landscaping"]
    }
  },
  "dschang": {
    img: "images/projects/bicec-dschang.jpg",
    location: "Dschang, Cameroun",
    services: {
      fr: ["Gros-œuvre", "Étanchéité", "Second œuvre", "Finitions", "Lots techniques et technologiques"],
      en: ["Structural works", "Waterproofing", "Second-fix works", "Finishing", "Technical & technological packages"]
    }
  },
  "douala-bali": {
    img: "images/projects/bicec-douala-bali.jpg",
    location: "Douala-Bali, Cameroun",
    services: {
      fr: ["Gros-œuvre", "Étanchéité", "Second œuvre", "Finitions", "Lots techniques et technologiques"],
      en: ["Structural works", "Waterproofing", "Second-fix works", "Finishing", "Technical & technological packages"]
    }
  }
};

/* ---- Before / after comparison data ---- */
const BEFORE_AFTER = [
  {
    title: "BICEC Yaoundé – Parc",
    before: "images/before-after/yaounde-parc-before.jpeg",
    after: "images/before-after/yaounde-parc-after.jpeg"
  },
  {
    title: "BICEC Dschang",
    before: "images/before-after/dschang-before.jpg",
    after: "images/before-after/dschang-after.jpg"
  },
  {
    title: "BICEC Douala-Bali",
    before: "images/before-after/douala-bali-before.jpeg",
    after: "images/before-after/douala-bali-after.jpeg"
  }
];

/* ---- Statistics ---- */
const STATISTICS = [
  { key: "stats.s2", value: 10 },
  { key: "stats.s3", value: 20 },
  { key: "stats.s4", value: 200 },
  { key: "stats.s5", value: 25 }
];

/* ---- Partner logos ---- */
const PARTNERS = [
  { name: "BICEC", logo: "images/partners/bicec.png" },
  { name: "DANGOTE CEMENT", logo: "images/partners/dangote-cement.png" },
  { name: "INGELEC", logo: "images/partners/ingelec.png" }
];
