// Official Chhattisgarh Seva Setu - Domicile Certificate (निवास प्रमाण पत्र) Document Master Data
// Verified as per Government of Chhattisgarh / CHiPS e-District guidelines

export const CERTIFICATE_META = {
  id: "domicile",
  title_en: "Domicile Certificate",
  title_hi: "छत्तीसगढ़ निवास प्रमाण पत्र",
  authority: "Government of Chhattisgarh / छत्तीसगढ़ शासन",
  portal: "Seva Setu (CG e-District)",
  chip_info: "CHiPS (Chhattisgarh Infotech Promotion Society)",
  summary_en: "Certifies permanent residence in the State of Chhattisgarh. Requires 15+ years proof of stay, educational continuous study record, and legal affidavit.",
  summary_hi: "छत्तीसगढ़ राज्य में स्थायी निवास प्रमाणित करता है। 15+ वर्षों का निवास प्रमाण, शैक्षणिक अध्ययन अभिलेख और वैधानिक शपथ पत्र आवश्यक हैं।"
};

export const BUCKETS = [
  {
    id: "affidavit",
    name_en: "1. Affidavit",
    name_hi: "१. शपथ पत्र",
    subtitle_en: "Legal Declaration of Residence",
    subtitle_hi: "निवास की वैधानिक घोषणा",
    mandatory: true,
    color: "#ff7b00",
    gradient: "linear-gradient(135deg, #ff7b00, #ffae19)",
    bgGlow: "rgba(255, 123, 0, 0.35)",
    icon: "📜",
    categoryKey: "AFFIDAVIT",
    requiredCount: 1,
    description_en: "Mandatory notarized/self-declaration affirming residence in Chhattisgarh.",
    description_hi: "छत्तीसगढ़ में निवास की पुष्टि करने वाला अनिवार्य शपथ पत्र।"
  },
  {
    id: "stay_15",
    name_en: "2. 15-Year Stay Proof",
    name_hi: "२. १५ वर्ष निवास प्रमाण",
    subtitle_en: "Proof of Continuous 15+ Years",
    subtitle_hi: "न्यूनतम १५ वर्ष निरंतर निवास",
    mandatory: true,
    color: "#00c2ff",
    gradient: "linear-gradient(135deg, #0088ff, #00d4ff)",
    bgGlow: "rgba(0, 194, 255, 0.35)",
    icon: "🏠",
    categoryKey: "STAY_15",
    requiredCount: 1,
    description_en: "Any one verified document proving continuous living in CG for at least 15 years.",
    description_hi: "छत्तीसगढ़ में न्यूनतम १५ वर्ष से निवास का कोई एक मान्य आधिकारिक प्रमाण।"
  },
  {
    id: "education",
    name_en: "3. Educational Proof",
    name_hi: "३. शैक्षणिक प्रमाण पत्र",
    subtitle_en: "School / College Qualification",
    subtitle_hi: "विद्यालय/महाविद्यालय अध्ययन रिकॉर्ड",
    mandatory: true,
    color: "#00e676",
    gradient: "linear-gradient(135deg, #00b050, #00e676)",
    bgGlow: "rgba(0, 230, 118, 0.35)",
    icon: "🎓",
    categoryKey: "EDUCATION",
    requiredCount: 1,
    description_en: "School marksheet or study certificate showing education completed in Chhattisgarh.",
    description_hi: "छत्तीसगढ़ में पढ़ाई प्रमाणित करने वाली अंकसूची या अध्ययन प्रमाण पत्र।"
  },
  {
    id: "distractors",
    name_en: "Reject / Distractors",
    name_hi: "अमान्य / अन्य प्रमाण पत्र",
    subtitle_en: "Not Valid for Domicile",
    subtitle_hi: "निवास प्रमाण पत्र के लिए अमान्य",
    mandatory: false,
    isRejectBin: true,
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #e11d48, #f43f5e)",
    bgGlow: "rgba(244, 63, 94, 0.35)",
    icon: "🚫",
    categoryKey: "REJECT",
    requiredCount: 0,
    description_en: "Documents belonging to Caste/Income applications or invalid papers.",
    description_hi: "दस्तावेज़ जो आय/जाति प्रमाण पत्र के हैं या यहाँ मान्य नहीं हैं।"
  }
];

export const ALL_DOCUMENTS = [
  // 1. AFFIDAVIT CATEGORY (Mandatory: Yes)
  {
    id: "doc_affidavit",
    title_en: "Notarized Domicile Affidavit",
    title_hi: "शपथ पत्र (अधिवक्ता / नोटरी)",
    category: "AFFIDAVIT",
    bucketId: "affidavit",
    mandatory: true,
    icon: "📜",
    rarity: "mandatory",
    tags: ["Legal", "Mandatory", "Affidavit"],
    info_en: "Mandatory legal affidavit sworn before a notary or executive magistrate affirming applicant's permanent home in Chhattisgarh.",
    info_hi: "कार्यपालक मजिस्ट्रेट या नोटरी के समक्ष निष्पादित अनिवार्य शपथ पत्र।"
  },

  // 2. PROOF OF 15 YEARS STAY (Mandatory: Pick any 1)
  {
    id: "doc_birth_cert",
    title_en: "CG Birth Certificate (15+ Yrs Ago)",
    title_hi: "जन्म प्रमाण पत्र (छत्तीसगढ़ में १५ वर्ष पूर्व)",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "👶",
    rarity: "core",
    tags: ["15 Years", "Birth Proof"],
    info_en: "Official municipal / hospital birth certificate recorded in Chhattisgarh proving birth 15+ years ago.",
    info_hi: "छत्तीसगढ़ के नगर निगम या अस्पताल द्वारा जारी १५+ वर्ष पूर्व का जन्म प्रमाण पत्र।"
  },
  {
    id: "doc_voter_id",
    title_en: "Voter ID Card (15+ Years)",
    title_hi: "मतदाता परिचय पत्र (वोटर आईडी)",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "🗳️",
    rarity: "core",
    tags: ["15 Years", "Election Commission"],
    info_en: "Applicant's or parents' Chhattisgarh electoral photo identity card held for 15+ years.",
    info_hi: "आवेदक अथवा माता-पिता का छत्तीसगढ़ निर्वाचन क्षेत्र का १५ वर्ष पुराना मतदाता पत्र।"
  },
  {
    id: "doc_ration_card",
    title_en: "Old Family Ration Card",
    title_hi: "पारिवारिक राशन कार्ड (15+ वर्ष)",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "🌾",
    rarity: "core",
    tags: ["15 Years", "Food Dept"],
    info_en: "Government Ration Card showing family's long-term residency in Chhattisgarh.",
    info_hi: "खाद्य विभाग द्वारा जारी पुराना पारिवारिक राशन कार्ड।"
  },
  {
    id: "doc_electricity_bill",
    title_en: "Electricity Bill (15 Years Continuous)",
    title_hi: "विद्युत बिल (CSPDCL - 15 वर्ष पुराना)",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "⚡",
    rarity: "core",
    tags: ["15 Years", "Utility Bill"],
    info_en: "CSPDCL electricity connection bills proving residence at the given address for 15+ years.",
    info_hi: "छत्तीसगढ़ राज्य विद्युत वितरण कंपनी का 15 वर्ष पुराना कनेक्शन बिल।"
  },
  {
    id: "doc_land_registry",
    title_en: "Land & House Registry (15+ Yrs)",
    title_hi: "भूमि व मकान रजिस्ट्री / बी-१",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "🏡",
    rarity: "core",
    tags: ["15 Years", "Property Record"],
    info_en: "Registered property deed or B-1 revenue record showing property ownership in CG for 15+ years.",
    info_hi: "छत्तीसगढ़ में 15+ वर्ष पूर्व पंजीकृत अचल संपत्ति या मकान रजिस्ट्री दस्तावेज।"
  },
  {
    id: "doc_guardian_service",
    title_en: "Govt / Semi-Govt Service Certificate",
    title_hi: "पिता/अभिभावक सेवा प्रमाण पत्र",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "🏛️",
    rarity: "core",
    tags: ["15 Years", "Govt Service"],
    info_en: "Service certificate proving continuous government employment in Chhattisgarh for 15+ years.",
    info_hi: "शासकीय/अर्ध-शासकीय सेवा में 15 वर्ष से पदस्थ होने का प्रमाण पत्र।"
  },
  {
    id: "doc_mla_ward_cert",
    title_en: "Certificate from Ward Member / MLA",
    title_hi: "पार्षद / विधायक निवास सत्यापन पत्र",
    category: "STAY_15",
    bucketId: "stay_15",
    mandatory: true,
    icon: "✍️",
    rarity: "core",
    tags: ["15 Years", "Local Representative"],
    info_en: "Verification letter from local elected Ward Parshad or MLA confirming 15+ years residence.",
    info_hi: "स्थानीय वार्ड पार्षद या विधायक द्वारा प्रदत्त 15 वर्ष निवास प्रमाण पत्र।"
  },

  // 3. EDUCATIONAL CERTIFICATE CATEGORY (Mandatory: Pick any 1)
  {
    id: "doc_10th_marksheet",
    title_en: "10th Board Marksheet (CGBSE / CBSE in CG)",
    title_hi: "१०वीं बोर्ड अंकसूची (छत्तीसगढ़)",
    category: "EDUCATION",
    bucketId: "education",
    mandatory: true,
    icon: "📘",
    rarity: "core",
    tags: ["Education", "10th Class"],
    info_en: "High School (10th) certificate issued by Chhattisgarh Board (CGBSE) or recognised school in CG.",
    info_hi: "छत्तीसगढ़ माध्यमिक शिक्षा मण्डल (CGBSE) या राज्य में स्थित स्कूल से 10वीं उत्तीर्ण अंकसूची।"
  },
  {
    id: "doc_12th_marksheet",
    title_en: "12th Higher Secondary Marksheet",
    title_hi: "१२वीं हायर सेकेण्डरी अंकसूची",
    category: "EDUCATION",
    bucketId: "education",
    mandatory: true,
    icon: "📙",
    rarity: "core",
    tags: ["Education", "12th Class"],
    info_en: "Higher Secondary (12th) Certificate from a school located inside Chhattisgarh.",
    info_hi: "छत्तीसगढ़ राज्य में स्थित विद्यालय से 12वीं परीक्षा उत्तीर्ण करने का प्रमाण पत्र।"
  },
  {
    id: "doc_8th_cert",
    title_en: "8th Standard Middle School Certificate",
    title_hi: "८वीं कक्षा उत्तीर्ण प्रमाण पत्र",
    category: "EDUCATION",
    bucketId: "education",
    mandatory: true,
    icon: "📗",
    rarity: "core",
    tags: ["Education", "8th Class"],
    info_en: "Middle school passing certificate showing school education in Chhattisgarh.",
    info_hi: "पूर्व माध्यमिक शाला (8वीं) का छत्तीसगढ़ के विद्यालय से उत्तीर्ण प्रमाण पत्र।"
  },
  {
    id: "doc_3yr_continuous_study",
    title_en: "3-Year Continuous Study Certificate",
    title_hi: "३ वर्ष सतत अध्ययन प्रमाण पत्र",
    category: "EDUCATION",
    bucketId: "education",
    mandatory: true,
    icon: "🏫",
    rarity: "core",
    tags: ["Education", "Study Proof"],
    info_en: "Headmaster/Principal certificate proving 3 consecutive years of continuous schooling in CG.",
    info_hi: "संस्था प्रमुख द्वारा जारी छत्तीसगढ़ में 3 वर्ष लगातार अध्ययन का प्रमाण पत्र।"
  },
  {
    id: "doc_degree_grad",
    title_en: "Graduation Degree (CG University)",
    title_hi: "स्नातक डिग्री (पंडित रविशंकर / दुर्ग वि.वि.)",
    category: "EDUCATION",
    bucketId: "education",
    mandatory: true,
    icon: "🎓",
    rarity: "core",
    tags: ["Education", "Higher Education"],
    info_en: "Degree from a recognized Chhattisgarh State University (PRSU, Bilaspur, Bastar, etc.).",
    info_hi: "छत्तीसगढ़ राज्य के मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री।"
  },

  // 4. DISTRACTORS (Belonging to Income or Caste or Invalid)
  {
    id: "doc_distractor_caste_tree",
    title_en: "Family Genealogic Tree (वंशावली)",
    title_hi: "पारिवारिक वंशावली (मिसल रिकार्ड)",
    category: "REJECT",
    bucketId: "distractors",
    mandatory: false,
    icon: "🌳",
    rarity: "distractor",
    tags: ["Caste Only", "Invalid For Domicile"],
    info_en: "Required exclusively for Caste Certificate (जाति प्रमाण पत्र) to prove lineage, not for Domicile!",
    info_hi: "यह केवल जाति प्रमाण पत्र (Caste Certificate) के लिए आवश्यक है, निवास के लिए नहीं!"
  },
  {
    id: "doc_distractor_salary_slip",
    title_en: "Monthly Salary Slip / Form 16",
    title_hi: "मासिक वेतन पर्ची / फॉर्म १६",
    category: "REJECT",
    bucketId: "distractors",
    mandatory: false,
    icon: "💰",
    rarity: "distractor",
    tags: ["Income Only", "Invalid For Domicile"],
    info_en: "Salary slip is required for Income Certificate (आय प्रमाण पत्र) calculation, not for Domicile!",
    info_hi: "यह आय प्रमाण पत्र (Income Certificate) के लिए चाहिए, निवास प्रमाण पत्र के लिए नहीं!"
  },
  {
    id: "doc_distractor_patwari_income",
    title_en: "Patwari Income Inquiry Report",
    title_hi: "पटवारी आय जांच प्रतिवेदन",
    category: "REJECT",
    bucketId: "distractors",
    mandatory: false,
    icon: "📋",
    rarity: "distractor",
    tags: ["Income Only", "Invalid For Domicile"],
    info_en: "Income assessment panchnama created for Income Certificate only.",
    info_hi: "यह पटवारी आय पंचनामा आय प्रमाण पत्र हेतु होता है।"
  },
  {
    id: "doc_distractor_caste_panchnama",
    title_en: "Gram Panchayat Caste Panchnama",
    title_hi: "ग्राम पंचायत जाति पंचनामा",
    category: "REJECT",
    bucketId: "distractors",
    mandatory: false,
    icon: "👥",
    rarity: "distractor",
    tags: ["Caste Only", "Invalid For Domicile"],
    info_en: "Panchayat caste verification used specifically for SC/ST/OBC certificate applications.",
    info_hi: "यह जाति प्रमाण पत्र के लिए ग्राम पंचायत पंचनामा है।"
  },
  {
    id: "doc_distractor_gym_membership",
    title_en: "Gym / Club Membership Card",
    title_hi: "निजी जिम / क्लब सदस्यता कार्ड",
    category: "REJECT",
    bucketId: "distractors",
    mandatory: false,
    icon: "🏋️",
    rarity: "distractor",
    tags: ["Invalid", "Private"],
    info_en: "Private commercial memberships are NOT acceptable government legal proofs.",
    info_hi: "निजी संस्था के कार्ड सरकारी कार्य में वैध प्रमाण नहीं हैं।"
  }
];

// Progressive challenge levels
export const LEVELS = [
  {
    level: 1,
    name_en: "Level 1: The Core 3 Pillars",
    name_hi: "लेवल १: तीन अनिवार्य स्तंभ",
    subtitle_en: "Master the 3 mandatory pillars for Chhattisgarh Domicile",
    subtitle_hi: "छत्तीसगढ़ निवास के ३ अनिवार्य स्तंभ पहचानें",
    requiredToUnlock: 3, // 1 Affidavit, 1 15-Yr Stay, 1 Education
    docsPool: [
      "doc_affidavit",
      "doc_voter_id",
      "doc_10th_marksheet",
      "doc_distractor_salary_slip"
    ],
    targetSlots: {
      affidavit: 1,
      stay_15: 1,
      education: 1
    },
    allowedRejects: 1,
    hint_en: "You need 1 Affidavit, 1 proof of 15+ years stay, and 1 Educational Certificate. Put any invalid doc in the Reject Bin!",
    hint_hi: "आपको १ शपथ पत्र, १ १५ वर्ष निवास प्रमाण और १ शैक्षणिक अंकसूची चाहिए। गलत दस्तावेज़ को 'अमान्य' में डालें!"
  },
  {
    level: 2,
    name_en: "Level 2: Scrutiny Detective",
    name_hi: "लेवल २: दस्तावेज़ जासूस",
    subtitle_en: "Recognize alternative proofs and spot deceptive distractors",
    subtitle_hi: "वैकल्पिक प्रमाण पहचानें और जाति/आय के भ्रामक दस्तावेज़ छांटें",
    requiredToUnlock: 3,
    docsPool: [
      "doc_affidavit",
      "doc_birth_cert",
      "doc_electricity_bill",
      "doc_12th_marksheet",
      "doc_8th_cert",
      "doc_distractor_caste_tree",
      "doc_distractor_patwari_income"
    ],
    targetSlots: {
      affidavit: 1,
      stay_15: 1,
      education: 1
    },
    allowedRejects: 2,
    hint_en: "Watch out for Caste and Income proofs! They look official but do NOT qualify for a Domicile Certificate.",
    hint_hi: "सावधान! जाति और आय के दस्तावेज़ भी सरकारी दिखते हैं, लेकिन निवास के लिए अमान्य हैं।"
  },
  {
    level: 3,
    name_en: "Level 3: Seva Setu Champion",
    name_hi: "लेवल ३: सेवा सेतु चैम्पियन",
    subtitle_en: "Full citizen portfolio review with high accuracy and speed bonus",
    subtitle_hi: "संपूर्ण नागरिक आवेदन पोर्टफोलियो की त्वरित जांच",
    requiredToUnlock: 3,
    docsPool: [
      "doc_affidavit",
      "doc_land_registry",
      "doc_guardian_service",
      "doc_degree_grad",
      "doc_3yr_continuous_study",
      "doc_distractor_caste_panchnama",
      "doc_distractor_gym_membership",
      "doc_distractor_salary_slip"
    ],
    targetSlots: {
      affidavit: 1,
      stay_15: 1,
      education: 1
    },
    allowedRejects: 3,
    hint_en: "Verify all documents with precision. High combos grant massive score multipliers!",
    hint_hi: "सटीकता से जांचें। लगातार सही चुनाव पर बोनस स्कोर मिलेगा!"
  }
];

export const MASCOT_DIALOGUES = {
  welcome: {
    en: "Namaste! I am Setu Mitra, your guide. Let's learn which documents unlock the official Chhattisgarh Domicile Certificate (निवास प्रमाण पत्र)!",
    hi: "नमस्ते! मैं हूँ सेतु मित्र। चलिए सीखते हैं कि छत्तीसगढ़ निवास प्रमाण पत्र के लिए कौन से दस्तावेज़ आवश्यक हैं!"
  },
  correctAffidavit: {
    en: "Spot on! An Affidavit is strictly mandatory to affirm permanent residence.",
    hi: "बिल्कुल सही! निवास की वैधानिक पुष्टि हेतु शपथ पत्र अनिवार्य है।"
  },
  correctStay15: {
    en: "Excellent! 15+ years of continuous stay in Chhattisgarh is a prime qualification.",
    hi: "शानदार! छत्तीसगढ़ में १५ वर्ष निरंतर निवास का यह वैध प्रमाण है।"
  },
  correctEducation: {
    en: "Perfect! Education completed within Chhattisgarh proves state residency.",
    hi: "उत्कृष्ट! छत्तीसगढ़ में अध्ययन का यह मान्य प्रमाण पत्र है।"
  },
  correctReject: {
    en: "Sharp eye! That document belongs to another service (like Caste or Income) and has been properly filtered out.",
    hi: "बहुत खूब! यह दस्तावेज़ आय या जाति का है, निवास के लिए अमान्य है।"
  },
  wrongBucket: {
    en: "Oops! This document doesn't match this requirement slot. Check its purpose!",
    hi: "अरे! यह दस्तावेज़ इस श्रेणी से मेल नहीं खाता। इसका विवरण देखें!"
  },
  misplacedReject: {
    en: "Wait! This is actually a valid document for Domicile. Don't reject it!",
    hi: "रुकिए! यह तो निवास प्रमाण पत्र के लिए मान्य दस्तावेज़ है, इसे रद्द न करें!"
  },
  slotAlreadyFilled: {
    en: "This requirement is already satisfied! Place other required documents.",
    hi: "यह आवश्यकता पहले ही पूरी हो चुकी है! अन्य आवश्यक दस्तावेज़ जोड़ें।"
  },
  levelComplete: {
    en: "Incredible work! The Domicile Certificate verification is charging up!",
    hi: "अद्भुत कार्य! निवास प्रमाण पत्र सत्यापन पूरा होने जा रहा है!"
  },
  allUnlocked: {
    en: "Badhai Ho! You have mastered the Chhattisgarh Domicile requirements!",
    hi: "बधाई हो! आपने छत्तीसगढ़ निवास प्रमाण पत्र के सभी नियम मास्टर कर लिए हैं!"
  }
};
