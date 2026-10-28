import {
  ScrollText, BadgeIndianRupee, BriefcaseBusiness, IdCard, HandCoins, Receipt, ClipboardPen, Users,
  GraduationCap, School, UserCheck, Stamp, Contact, BookOpen, FileBadge, LandPlot, BookUser, Library,
  BookMarked, FileQuestionMark, Scale, Baby, Briefcase, Vote, House, FilePlus, Landmark, PlugZap,
  NotebookPen, Backpack, FileSpreadsheet, Award, Microscope, FileClock, Medal, Wrench, Camera, Cake,
  Signature, FilePenLine, ReceiptIndianRupee, MailOpen
} from "lucide-react";

// Supporting documents from the official certificate prerequisite tables.
// Which certificate accepts which document lives in certificates.js; the tag names the document type.

export const DOCUMENTS = [
  // Affidavit (शपथ पत्र) — mandatory for all four certificates
  {
    id: "doc_affidavit",
    title_en: "Affidavit",
    title_hi: "शपथ पत्र",
    icon: ScrollText,
    tag_en: "All certificates",
    tag_hi: "सभी प्रमाण पत्र"
  },

  // Income proof (आय प्रमाण) — Caste and Income certificates
  {
    id: "doc_patwari_income_certificate",
    title_en: "Certificate from Patwari / Sarpanch / Parshad",
    title_hi: "पटवारी / सरपंच / पार्षद से प्रमाण पत्र",
    icon: BadgeIndianRupee,
    tag_en: "Income proof",
    tag_hi: "आय प्रमाण"
  },
  {
    id: "doc_employer_income_form16",
    title_en: "Employer's Income Certificate / Form 16",
    title_hi: "नियोक्ता का आय प्रमाण पत्र / फार्म १६",
    icon: BriefcaseBusiness,
    tag_en: "Income proof",
    tag_hi: "आय प्रमाण"
  },
  {
    id: "doc_ration_card",
    title_en: "Ration Card",
    title_hi: "राशन कार्ड",
    icon: IdCard,
    tag_en: "Income · Residence proof",
    tag_hi: "आय · निवास प्रमाण"
  },
  {
    id: "doc_land_house_income",
    title_en: "Income from Land / House",
    title_hi: "भूमि / घर से आय",
    icon: HandCoins,
    tag_en: "Income proof",
    tag_hi: "आय प्रमाण"
  },
  {
    id: "doc_other_income_proof",
    title_en: "Other Income Proof",
    title_hi: "अन्य आय प्रमाण",
    icon: Receipt,
    tag_en: "Income proof",
    tag_hi: "आय प्रमाण"
  },
  {
    id: "doc_application_form",
    title_en: "Application Form",
    title_hi: "आवेदन प्रपत्र",
    icon: ClipboardPen,
    tag_en: "Income proof",
    tag_hi: "आय प्रमाण"
  },
  {
    id: "doc_family_members_income",
    title_en: "Income of Other Family Members",
    title_hi: "परिवार के अन्य सदस्यों की आय",
    icon: Users,
    tag_en: "Income proof",
    tag_hi: "आय प्रमाण"
  },

  // Proof of Other Backward Class (अन्य पिछड़ा वर्ग का प्रमाण) — Caste certificate
  {
    id: "doc_educational_certificate",
    title_en: "Educational Certificate",
    title_hi: "शैक्षणिक प्रमाण पत्र",
    icon: GraduationCap,
    tag_en: "OBC · Education proof",
    tag_hi: "ओबीसी · शैक्षणिक प्रमाण"
  },
  {
    id: "doc_primary_school_transfer",
    title_en: "Primary School Transfer Certificate",
    title_hi: "प्राथमिक स्कूल शिक्षा का स्थानांतरण प्रमाण पत्र",
    icon: School,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_father_obc_certificate",
    title_en: "Father's OBC Certificate",
    title_hi: "पिता का अ.पि.व. प्रमाण पत्र",
    icon: UserCheck,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_sarpanch_obc_certificate",
    title_en: "OBC Certificate from Sarpanch / Parshad",
    title_hi: "सरपंच / पार्षद से ओबीसी प्रमाण पत्र",
    icon: Stamp,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    // Listed for Caste (father/guardian service certificate or ID) and Domicile (father/guardian service certificate)
    id: "doc_guardian_service_certificate",
    title_en: "Father / Guardian's Service Certificate or ID Card",
    title_hi: "पिता / अभिभावक का सेवा प्रमाण पत्र / पहचान पत्र",
    icon: Contact,
    tag_en: "OBC · Residence proof",
    tag_hi: "ओबीसी · निवास प्रमाण"
  },
  {
    id: "doc_misal",
    title_en: "Misal",
    title_hi: "मिसल",
    icon: BookOpen,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_adhikar_abhilekh",
    title_en: "Adhikar Abhilekh (Record of Rights)",
    title_hi: "अधिकार अभिलेख",
    icon: FileBadge,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_jamabandi",
    title_en: "Jamabandi",
    title_hi: "जमाबंदी",
    icon: LandPlot,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_census_register_1931",
    title_en: "1931 Census Register",
    title_hi: "१९३१ का जनगणना पंजी",
    icon: BookUser,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_citizen_register_1949",
    title_en: "1949 Citizen Register",
    title_hi: "१९४९ का नागरिक पंजी",
    icon: Library,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_dakhil_kharij_register",
    title_en: "Dakhil / Kharij Register",
    title_hi: "दाखिल / ख़ारिज पंजी",
    icon: BookMarked,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },
  {
    id: "doc_inability_proof",
    title_en: "Proof of Inability / Unavailability",
    title_hi: "असमर्थता / अनुपलब्धता का प्रमाण",
    icon: FileQuestionMark,
    tag_en: "OBC proof",
    tag_hi: "ओबीसी प्रमाण"
  },

  // State cadre allocation (Caste certificate, not mandatory)
  {
    id: "doc_cadre_allocation_proof",
    title_en: "CG State Cadre Allocation Proof (MP Reorganisation Act 2000, Sec. 67)",
    title_hi: "मध्यप्रदेश पुनर्गठन अधिनियम २००० (धारा ६७) के अधीन छ.ग. राज्य संवर्ग आबंटन का प्रमाण",
    icon: Scale,
    tag_en: "Cadre allocation",
    tag_hi: "संवर्ग आबंटन"
  },

  // Proof of residence up to 15 years (१५ वर्ष तक निवास का प्रमाण) — Domicile certificate
  {
    id: "doc_birth_certificate",
    title_en: "Birth Certificate",
    title_hi: "जन्म प्रमाण पत्र",
    icon: Baby,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },
  {
    id: "doc_employment_id",
    title_en: "Job Certificate / ID Card (Govt. or Semi-Govt. Employee)",
    title_hi: "नौकरी प्रमाण पत्र / पहचान पत्र (शासकीय / अर्ध शासकीय कर्मचारी)",
    icon: Briefcase,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },
  {
    id: "doc_voter_id",
    title_en: "Voter ID Card",
    title_hi: "वोटिंग कार्ड",
    icon: Vote,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },
  {
    id: "doc_house_land_document",
    title_en: "House or Land Document",
    title_hi: "घर या भूमि का दस्तावेज़",
    icon: House,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },
  {
    id: "doc_birth_intimation_form",
    title_en: "Birth Intimation Form",
    title_hi: "जन्म सूचना प्रपत्र",
    icon: FilePlus,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },
  {
    id: "doc_ward_mla_mp_certificate",
    title_en: "Certificate from Ward Member / Local MLA / MP",
    title_hi: "वार्ड सदस्य, स्थानीय विधायक / सांसद से प्रमाण पत्र",
    icon: Landmark,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },
  {
    id: "doc_electricity_bill",
    title_en: "Electricity Bill",
    title_hi: "बिजली का बिल",
    icon: PlugZap,
    tag_en: "Residence proof",
    tag_hi: "निवास प्रमाण"
  },

  // Educational certificate (शैक्षणिक प्रमाण पत्र) — Domicile certificate
  {
    id: "doc_class8_certificate",
    title_en: "Middle School Certificate (Class 8)",
    title_hi: "माध्यमिक विद्यालय का प्रमाण पत्र (८वीं कक्षा)",
    icon: NotebookPen,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_class5_certificate",
    title_en: "Primary School Certificate (Class 5)",
    title_hi: "प्राथमिक विद्यालय का प्रमाण पत्र (५वीं कक्षा)",
    icon: Backpack,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_class10_marksheet",
    title_en: "High School Marksheet (Class 10)",
    title_hi: "हाई स्कूल (१०वीं कक्षा) अंकसूची",
    icon: FileSpreadsheet,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_class12_certificate",
    title_en: "Higher Secondary Certificate (Class 12)",
    title_hi: "उच्चतर माध्यमिक विद्यालय प्रमाण पत्र (१२वीं कक्षा)",
    icon: Award,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_mphil_certificate",
    title_en: "M.Phil Certificate",
    title_hi: "एम-फिल प्रमाण पत्र",
    icon: Microscope,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_school_continuous_study",
    title_en: "School Certificate (3 Years of Continuous Study)",
    title_hi: "स्कूल प्रमाण पत्र (३ वर्ष निरंतर अध्ययन का प्रमाण)",
    icon: FileClock,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_postgraduate_certificate",
    title_en: "Postgraduate Certificate",
    title_hi: "स्नातकोत्तर प्रमाण पत्र",
    icon: Medal,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },
  {
    id: "doc_technical_certificate",
    title_en: "Certificate in Technical Subjects",
    title_hi: "तकनीकी विषयों में प्रमाण पत्र",
    icon: Wrench,
    tag_en: "Education proof",
    tag_hi: "शैक्षणिक प्रमाण"
  },

  // Marriage certificate — every row is mandatory
  {
    id: "doc_marriage_joint_photo",
    title_en: "Joint Photo of Groom & Bride (2A Size)",
    title_hi: "वर एवं वधू का संयुक्त फोटो (2A साइज)",
    icon: Camera,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  },
  {
    id: "doc_groom_birth_certificate",
    title_en: "Groom's Birth Certificate",
    title_hi: "वर का जन्म प्रमाण पत्र",
    icon: Cake,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  },
  {
    id: "doc_bride_birth_certificate",
    title_en: "Bride's Birth Certificate",
    title_hi: "वधू का जन्म प्रमाण पत्र",
    icon: Cake,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  },
  {
    id: "doc_signed_document_page1",
    title_en: "Document Signed by Groom & Bride (Page 1)",
    title_hi: "वर एवं वधू द्वारा हस्ताक्षरित दस्तावेज (प्रथम पेज)",
    icon: Signature,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  },
  {
    id: "doc_signed_document_page2",
    title_en: "Document Signed by Groom & Bride (Page 2)",
    title_hi: "वर एवं वधू द्वारा हस्ताक्षरित दस्तावेज (द्वितीय पेज)",
    icon: FilePenLine,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  },
  {
    id: "doc_challan_copy",
    title_en: "Copy of Challan",
    title_hi: "चालान की प्रति",
    icon: ReceiptIndianRupee,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  },
  {
    id: "doc_marriage_invitation_card",
    title_en: "Marriage Invitation Card",
    title_hi: "विवाह आमंत्रण पत्र",
    icon: MailOpen,
    tag_en: "Marriage record",
    tag_hi: "विवाह अभिलेख"
  }
];
