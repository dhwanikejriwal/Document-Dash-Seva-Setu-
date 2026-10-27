// Master Prerequisite Documents for Seva Setu Document Dash
// 100% Extracted from Official Government of Chhattisgarh e-District / CHiPS Tables:
// 1. Domicile Certificate (निवास प्रमाण पत्र)
// 2. Caste Certificate (जाति प्रमाण पत्र)
// 3. Income Certificate (आय प्रमाण पत्र)
// 4. Marriage Certificate (विवाह प्रमाण पत्र)

export const DOCUMENTS = [
  // 1. UNIVERSAL AFFIDAVIT (Mandatory across all 4 services: Table 1-4 Row 1/2)
  {
    id: "doc_affidavit",
    title_en: "Statutory Affidavit (शपथ पत्र)",
    title_hi: "वैधानिक शपथ पत्र (अधिवक्ता / नोटरी)",
    icon: "📜",
    tag: "All 4 Services",
    tag_hi: "सभी ४ सेवाएं",
    applicableCertificates: ["domicile", "caste", "income", "marriage"],
    description_en: "Statutory Affidavit affirming factual eligibility as required in all 4 government services.",
    description_hi: "सभी ४ सरकारी सेवाओं हेतु अनिवार्य नोटरी / कार्यपालक मजिस्ट्रेट शपथ पत्र।"
  },

  // 2. DOMICILE: 15-YEAR STAY PROOF (Table 2 Row 3 - Mandatory: Yes)
  {
    id: "doc_stay_15_proof",
    title_en: "Proof of 15-Yr Stay (15 वर्ष निवास)",
    title_hi: "१५ वर्ष निरंतर निवास प्रमाण (वोटर/रजिस्ट्री)",
    icon: "🏠",
    tag: "Domicile Proof",
    tag_hi: "निवास प्रमाण",
    applicableCertificates: ["domicile"],
    description_en: "Voters Identity Card, Land & House Document, 15-Yr Electricity Bill, or Birth Certificate in CG.",
    description_hi: "मतदाता परिचय पत्र, रजिस्ट्री, बिजली बिल, अथवा छत्तीसगढ़ में जन्म प्रमाण पत्र।"
  },

  // 3. DOMICILE: EDUCATIONAL CERTIFICATE (Table 2 Row 4 - Mandatory: Yes)
  {
    id: "doc_educational_certificate",
    title_en: "Educational Certificate (शैक्षणिक प्रमाण)",
    title_hi: "शैक्षणिक अंकसूची (१०वीं / १२वीं / ८वीं)",
    icon: "🎓",
    tag: "Education",
    tag_hi: "शिक्षा प्रमाण",
    applicableCertificates: ["domicile"],
    description_en: "High School (10th), Higher Secondary (12th), Middle (8th), or continuous study school marksheet.",
    description_hi: "१०वीं/१२वीं/८वीं कक्षा की अंकसूची अथवा निरंतर अध्ययन प्रमाण पत्र।"
  },

  // 4. DOMICILE: 5-YEAR STAY PROOF (Table 2 Row 5 - Supporting: No)
  {
    id: "doc_stay_5_proof",
    title_en: "Proof of 5-Yr Stay (5 वर्ष निवास)",
    title_hi: "५ वर्ष निवास प्रमाण (सेवा पुस्तिका/भूमि)",
    icon: "🏡",
    tag: "Domicile (5 Yr)",
    tag_hi: "५ वर्ष निवास",
    applicableCertificates: ["domicile"],
    description_en: "Land & House Document or Person's Service Book for 5-year residency.",
    description_hi: "भूमि व आवास दस्तावेज अथवा सेवा पुस्तिका (५ वर्ष निवास साक्ष्य)।"
  },

  // 5. INCOME & CASTE: INCOME PROOF (Table 1 Row 2 & Table 4 Row 3 - Mandatory: Yes)
  {
    id: "doc_income_proof",
    title_en: "Income Proof (पटवारी/सरपंच/पार्षद आय)",
    title_hi: "पटवारी / सरपंच / पार्षद आय प्रमाण प्रतिवेदन",
    icon: "💰",
    tag: "Income Verification",
    tag_hi: "आय प्रमाण",
    applicableCertificates: ["income", "caste"],
    description_en: "Report from Patwari/Sarpanch/Parshad, Employer Form 16, or Land/House income proof.",
    description_hi: "पटवारी, सरपंच अथवा पार्षद द्वारा जारी आय प्रमाण पत्र या फॉर्म १६।"
  },

  // 6. CASTE: MISAL / ADHIKAR ABHILEKH / CASTE PROOF (Table 4 Row 4 - Mandatory: Yes)
  {
    id: "doc_caste_obc_misal",
    title_en: "Caste Misal / Adhikar Abhilekh Record",
    title_hi: "मिसल बंदोबस्त / अधिकार अभिलेख / जाति साक्ष्य",
    icon: "🛡️",
    tag: "Caste Record",
    tag_hi: "जाति साक्ष्य",
    applicableCertificates: ["caste"],
    description_en: "Pre-1950/1984 Misal record, Jamabandi, Dakhil/Kharij Panji, or Father's Caste Certificate.",
    description_hi: "मिसल बंदोबस्त, अधिकार अभिलेख, जमाबंदी अथवा पिता का जाति प्रमाण पत्र।"
  },

  // 7. CASTE: VANSHAVALI (Table 4 Row 5 - Supporting: No)
  {
    id: "doc_vanshavali",
    title_en: "Vanshavali (पारिवारिक वंशावली)",
    title_hi: "पारिवारिक वंशावली तालिका (१/२/३/४)",
    icon: "🌳",
    tag: "Genealogy Tree",
    tag_hi: "वंशावली",
    applicableCertificates: ["caste"],
    description_en: "Family lineage / genealogy table (Vanshavali 1 to 4 supporting proof).",
    description_hi: "पारिवारिक वंशावली तालिका (जाति सत्यापन हेतु सहायक दस्तावेज)।"
  },

  // 8. CASTE: GRAM SABHA PROPOSAL (Table 4 Row 6 - Supporting: No)
  {
    id: "doc_gram_sabha_proposal",
    title_en: "Gram Sabha Proposal (ग्राम सभा प्रस्ताव)",
    title_hi: "ग्राम सभा प्रस्ताव (ग्रामीण निवासी)",
    icon: "🏛️",
    tag: "Rural Resolution",
    tag_hi: "ग्राम सभा",
    applicableCertificates: ["caste"],
    description_en: "Gram Sabha resolution / proposal for rural residents applying for caste certificate.",
    description_hi: "ग्रामीण क्षेत्र के निवासियों हेतु ग्राम सभा द्वारा पारित प्रस्ताव।"
  },

  // 9. MARRIAGE: COMBINED PHOTO 2A (Table 3 Row 2 - Mandatory: Yes)
  {
    id: "doc_marriage_photo_combined",
    title_en: "Combined Photo of Groom & Bride (2a)",
    title_hi: "वर-वधू का संयुक्त विवाह फोटो (२-ए आकार)",
    icon: "📸",
    tag: "Marriage Photo",
    tag_hi: "संयुक्त फोटो",
    applicableCertificates: ["marriage"],
    description_en: "Combined photograph of groom and bride taken at the time of marriage (2a size).",
    description_hi: "विवाह के समय लिया गया वर एवं वधू का २-ए आकार का संयुक्त फोटो।"
  },

  // 10. MARRIAGE: INVITATION CARD (Table 3 Row 11 - Mandatory: Yes)
  {
    id: "doc_marriage_invitation_card",
    title_en: "Marriage Invitation Card (विवाह पत्रिका)",
    title_hi: "मूल विवाह निमंत्रण पत्रिका (कार्ड)",
    icon: "💌",
    tag: "Wedding Card",
    tag_hi: "विवाह पत्रिका",
    applicableCertificates: ["marriage"],
    description_en: "Original printed marriage invitation card with date, venue, and parent details.",
    description_hi: "विवाह की तिथि, स्थान एवं माता-पिता के नाम युक्त मूल विवाह पत्रिका।"
  },

  // 11. MARRIAGE: BIRTH CERTIFICATES OF GROOM & BRIDE (Table 3 Rows 6 & 7 - Mandatory: Yes)
  {
    id: "doc_birth_age_proofs",
    title_en: "Birth Certificates of Groom & Bride",
    title_hi: "वर एवं वधू का जन्म / आयु प्रमाण पत्र",
    icon: "🎂",
    tag: "Age Eligibility",
    tag_hi: "आयु प्रमाण",
    applicableCertificates: ["marriage"],
    description_en: "Birth certificates of Groom (21+) and Bride (18+) proving statutory age eligibility.",
    description_hi: "वर (२१ वर्ष) एवं वधू (१८ वर्ष) का अधिकृत जन्म प्रमाण पत्र।"
  },

  // 12. MARRIAGE: COPY OF CHALLAN (Table 3 Row 10 - Mandatory: Yes)
  {
    id: "doc_copy_of_challan",
    title_en: "Copy of Government Challan (ट्रेजरी चालान)",
    title_hi: "शासकीय चालान प्रति (ट्रेजरी शुल्क)",
    icon: "🧾",
    tag: "Treasury Fee",
    tag_hi: "चालान प्रति",
    applicableCertificates: ["marriage"],
    description_en: "Official Treasury Challan receipt verifying government registration fee deposit.",
    description_hi: "शासकीय विवाह पंजीकरण शुल्क भुगतान की अधिकृत ट्रेजरी चालान प्रति।"
  }
];
