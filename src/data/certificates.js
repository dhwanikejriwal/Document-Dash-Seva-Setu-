// Official Seva Setu Certificate Prerequisite Data Model
// Aligned with the official Government of Chhattisgarh e-District / CHiPS tables

export const CERTIFICATES = [
  {
    id: "domicile",
    name_en: "Domicile Certificate",
    name_hi: "निवास प्रमाण पत्र",
    subtitle_en: "Affidavit + 15-Yr Stay + Educational Proof",
    subtitle_hi: "शपथ पत्र + १५ वर्ष निवास + शैक्षणिक प्रमाण",
    color: "#0084ff",
    gradient: "linear-gradient(135deg, #0070f3, #00d2ff)",
    glowColor: "rgba(0, 132, 255, 0.45)",
    icon: "🏠",
    authority_en: "Office of the Sub-Divisional Officer (Revenue)",
    authority_hi: "कार्यालय अनुविभागीय अधिकारी (राजस्व)",
    // As per Table 2 (Domicile Required Documents):
    // 1. Affidavit (Mandatory: Yes)
    // 2. Proof of 15 Years Stay (Mandatory: Yes)
    // 3. Educational Certificate (Mandatory: Yes)
    mandatoryDocIds: [
      "doc_affidavit",
      "doc_stay_15_proof",
      "doc_educational_certificate"
    ],
    // 4. Proof of 5 Years Stay (Mandatory: No / Supporting)
    optionalDocIds: [
      "doc_stay_5_proof"
    ],
    sampleCodePrefix: "CG-DOM",
    statutoryClause_en: "Applicant has verified: (1) Statutory Affidavit, (2) 15+ years continuous stay proof (Voter ID/Birth/Land/Bill), and (3) Educational Certificate in Chhattisgarh.",
    statutoryClause_hi: "आवेदक ने पूर्ण किए हैं: (१) शपथ पत्र, (२) १५ वर्ष निरंतर निवास प्रमाण (मतदाता/रजिस्ट्री/बिल), एवं (३) राज्य में शैक्षणिक प्रमाण पत्र।"
  },
  {
    id: "caste",
    name_en: "Caste Certificate",
    name_hi: "जाति प्रमाण पत्र",
    subtitle_en: "Affidavit + Income Proof + Caste/Misal Record",
    subtitle_hi: "शपथ पत्र + आय प्रमाण + जाति/मिसल साक्ष्य",
    color: "#00c853",
    gradient: "linear-gradient(135deg, #00b050, #00e676)",
    glowColor: "rgba(0, 200, 83, 0.45)",
    icon: "🛡️",
    authority_en: "Tehsildar & District Caste Scrutiny Committee",
    authority_hi: "कार्यालय तहसीलदार एवं जाति छानबीन समिति",
    // As per Table 4 (Caste / OBC Required Documents):
    // 1. Affidavit (Mandatory: Yes)
    // 2. Income Proof (Mandatory: Yes)
    // 3. Obc Proof / Misal / Adhikar Abhilekh (Mandatory: Yes)
    mandatoryDocIds: [
      "doc_affidavit",
      "doc_income_proof",
      "doc_caste_obc_misal"
    ],
    // Supporting: Vanshavali (Row 5: No), Gram Sabha Proposal (Row 6: No)
    optionalDocIds: [
      "doc_vanshavali",
      "doc_gram_sabha_proposal"
    ],
    sampleCodePrefix: "CG-CST",
    statutoryClause_en: "Applicant has satisfied caste verification: (1) Statutory Affidavit, (2) Patwari/Sarpanch Income Proof, and (3) Caste Misal / Adhikar Abhilekh Record.",
    statutoryClause_hi: "आवेदक ने जाति पात्रता सिद्ध की है: (१) वैधानिक शपथ पत्र, (२) पटवारी/सरपंच आय प्रमाण, एवं (३) मिसल बंदोबस्त / अधिकार अभिलेख अभिलेख।"
  },
  {
    id: "income",
    name_en: "Income Certificate",
    name_hi: "आय प्रमाण पत्र",
    subtitle_en: "Affidavit + Patwari/Employer Income Proof",
    subtitle_hi: "शपथ पत्र + पटवारी/नियोजक आय प्रमाण",
    color: "#ff6d00",
    gradient: "linear-gradient(135deg, #ff5500, #ffb300)",
    glowColor: "rgba(255, 109, 0, 0.45)",
    icon: "💰",
    authority_en: "Office of the Tehsildar (Revenue)",
    authority_hi: "कार्यालय तहसीलदार (राजस्व)",
    // As per Table 1 (Income Required Documents):
    // 1. शपथ पत्र (Affidavit - Mandatory: Yes)
    // 2. आय प्रमाण (Income Proof - Mandatory: Yes)
    mandatoryDocIds: [
      "doc_affidavit",
      "doc_income_proof"
    ],
    optionalDocIds: [],
    sampleCodePrefix: "CG-INC",
    statutoryClause_en: "Gross annual household income verified pursuant to (1) Statutory Affidavit and (2) Patwari/Sarpanch inquiry report or Employer Form 16.",
    statutoryClause_hi: "कुल वार्षिक पारिवारिक आय का निर्धारण (१) शपथ पत्र एवं (२) हल्का पटवारी/सरपंच जांच प्रतिवेदन / फॉर्म १६ के आधार पर सत्यापित किया गया है।"
  },
  {
    id: "marriage",
    name_en: "Marriage Certificate",
    name_hi: "विवाह प्रमाण पत्र",
    subtitle_en: "Joint Photo + Wedding Card + Age Proofs",
    subtitle_hi: "संयुक्त फोटो + विवाह पत्रिका + आयु प्रमाण",
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #e11d48, #ff4081)",
    glowColor: "rgba(244, 63, 94, 0.45)",
    icon: "💍",
    authority_en: "Office of the Registrar of Marriages",
    authority_hi: "कार्यालय विवाह पंजीयक",
    // As per Table 3 (Marriage Required Documents):
    // 1. Affidavit (Mandatory: Yes)
    // 2. Combined Photograph 2a Size (Mandatory: Yes)
    // 3. Marriage Invitation Card (Mandatory: Yes)
    // 4. Birth Certificate of Groom & Bride (Mandatory: Yes)
    mandatoryDocIds: [
      "doc_affidavit",
      "doc_marriage_photo_combined",
      "doc_marriage_invitation_card",
      "doc_birth_age_proofs"
    ],
    // Supporting: Copy of Challan (Table 3 Row 10)
    optionalDocIds: [
      "doc_copy_of_challan"
    ],
    sampleCodePrefix: "CG-MAR",
    statutoryClause_en: "Solemnization registered pursuant to: (1) Statutory Affidavit, (2) Combined Photograph (2a size), (3) Original Marriage Invitation Card, (4) Groom/Bride Birth Records, and (5) Government Challan.",
    statutoryClause_hi: "विवाह पंजीकरण पूर्ण: (१) शपथ पत्र, (२) वर-वधू का संयुक्त २-ए फोटोग्राफ, (३) मूल विवाह निमंत्रण पत्रिका, (४) वर-वधू जन्म प्रमाण, एवं (५) शासकीय चालान प्रति।"
  }
];
