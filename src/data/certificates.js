import { House, ShieldCheck, IndianRupee, HeartHandshake } from "lucide-react";

// Certificate Prerequisite Data Model, aligned with the official prerequisite tables.
// Each requirement is one row of the table (document type, serial = क्रम सं);
// any one of its supporting documents (docIds) satisfies it.

const AFFIDAVIT = { id: "affidavit", name_en: "Affidavit", name_hi: "शपथ पत्र", mandatory: true, docIds: ["doc_affidavit"] };

export const CERTIFICATES = [
  {
    id: "domicile",
    name_en: "Domicile Certificate",
    name_hi: "निवास प्रमाण पत्र",
    subtitle_en: "Affidavit + 15-Yr Residence Proof + Educational Certificate",
    subtitle_hi: "शपथ पत्र + १५ वर्ष निवास प्रमाण + शैक्षणिक प्रमाण पत्र",
    color: "var(--cert-domicile)",
    solid: "var(--cert-domicile-solid)",
    gradient: "linear-gradient(135deg, var(--blue-600), var(--cyan-400))",
    glowColor: "rgba(var(--cert-domicile-rgb), 0.45)",
    icon: House,
    authority_en: "Office of the Sub-Divisional Officer (Revenue)",
    authority_hi: "कार्यालय अनुविभागीय अधिकारी (राजस्व)",
    requirements: [
      { serial: 1, ...AFFIDAVIT },
      {
        serial: 3,
        id: "residence_15yr",
        name_en: "Proof of Residence up to 15 Years",
        name_hi: "१५ वर्ष तक निवास का प्रमाण",
        mandatory: true,
        docIds: [
          "doc_birth_certificate",
          "doc_guardian_service_certificate",
          "doc_employment_id",
          "doc_voter_id",
          "doc_house_land_document",
          "doc_birth_intimation_form",
          "doc_ward_mla_mp_certificate",
          "doc_ration_card",
          "doc_electricity_bill"
        ]
      },
      {
        serial: 4,
        id: "education",
        name_en: "Educational Certificate",
        name_hi: "शैक्षणिक प्रमाण पत्र",
        mandatory: true,
        docIds: [
          "doc_class8_certificate",
          "doc_class5_certificate",
          "doc_class10_marksheet",
          "doc_class12_certificate",
          "doc_mphil_certificate",
          "doc_school_continuous_study",
          "doc_postgraduate_certificate",
          "doc_technical_certificate",
          // The generic card from the Caste table is this row's own document type, so it counts here too.
          "doc_educational_certificate"
        ]
      }
    ],
    sampleCodePrefix: "CG-DOM",
    statutoryClause_en: "Applicant has submitted (1) an Affidavit, (2) Proof of residence in Chhattisgarh up to 15 years, and (3) an Educational Certificate.",
    statutoryClause_hi: "आवेदक ने (१) शपथ पत्र, (२) छत्तीसगढ़ में १५ वर्ष तक निवास का प्रमाण, एवं (३) शैक्षणिक प्रमाण पत्र प्रस्तुत किया है।"
  },
  {
    id: "caste",
    name_en: "Caste Certificate",
    name_hi: "जाति प्रमाण पत्र",
    subtitle_en: "Affidavit + Income Proof + OBC Proof",
    subtitle_hi: "शपथ पत्र + आय प्रमाण + अ.पि.व. प्रमाण",
    color: "var(--cert-caste)",
    solid: "var(--cert-caste-solid)",
    gradient: "linear-gradient(135deg, var(--green-600), var(--green-400))",
    glowColor: "rgba(var(--cert-caste-rgb), 0.45)",
    icon: ShieldCheck,
    authority_en: "Tehsildar & District Caste Scrutiny Committee",
    authority_hi: "कार्यालय तहसीलदार एवं जाति छानबीन समिति",
    requirements: [
      { serial: 2, ...AFFIDAVIT },
      {
        serial: 3,
        id: "income_proof",
        name_en: "Income Proof",
        name_hi: "आय प्रमाण",
        mandatory: true,
        docIds: [
          "doc_patwari_income_certificate",
          "doc_employer_income_form16",
          "doc_ration_card",
          "doc_land_house_income",
          "doc_other_income_proof",
          "doc_application_form"
        ]
      },
      {
        serial: 4,
        id: "obc_proof",
        name_en: "Proof of Other Backward Class (OBC)",
        name_hi: "अन्य पिछड़ा वर्ग का प्रमाण",
        mandatory: true,
        docIds: [
          "doc_educational_certificate",
          "doc_primary_school_transfer",
          "doc_father_obc_certificate",
          "doc_sarpanch_obc_certificate",
          "doc_guardian_service_certificate",
          "doc_misal",
          "doc_adhikar_abhilekh",
          "doc_jamabandi",
          "doc_census_register_1931",
          "doc_citizen_register_1949",
          "doc_dakhil_kharij_register",
          "doc_inability_proof"
        ]
      },
      {
        serial: 7,
        id: "cadre_allocation",
        name_en: "Proof of CG State Cadre Allocation (MP Reorganisation Act 2000, Sec. 67)",
        name_hi: "मध्यप्रदेश पुनर्गठन अधिनियम २००० (क्रमांक २६-सन २००० की धारा ६७ के अधीन छ.ग. राज्य संवर्ग आबंटन) का प्रमाण",
        mandatory: false,
        docIds: ["doc_cadre_allocation_proof"]
      }
    ],
    sampleCodePrefix: "CG-CST",
    statutoryClause_en: "Applicant has satisfied OBC caste verification with (1) an Affidavit, (2) Income Proof, and (3) Proof of Other Backward Class status.",
    statutoryClause_hi: "आवेदक ने अन्य पिछड़ा वर्ग पात्रता सिद्ध की है: (१) शपथ पत्र, (२) आय प्रमाण, एवं (३) अन्य पिछड़ा वर्ग का प्रमाण।"
  },
  {
    id: "income",
    name_en: "Income Certificate",
    name_hi: "आय प्रमाण पत्र",
    subtitle_en: "Affidavit + Income Proof",
    subtitle_hi: "शपथ पत्र + आय प्रमाण",
    color: "var(--cert-income)",
    solid: "var(--cert-income-solid)",
    gradient: "linear-gradient(135deg, var(--saffron-600), var(--gold-500))",
    glowColor: "rgba(var(--cert-income-rgb), 0.45)",
    icon: IndianRupee,
    authority_en: "Office of the Tehsildar (Revenue)",
    authority_hi: "कार्यालय तहसीलदार (राजस्व)",
    requirements: [
      { serial: 1, ...AFFIDAVIT },
      {
        serial: 2,
        id: "income_proof",
        name_en: "Income Proof",
        name_hi: "आय प्रमाण",
        mandatory: true,
        // The table lists "Employer's income certificate / Form 16" and "Form 16" separately; both are doc_employer_income_form16.
        docIds: [
          "doc_patwari_income_certificate",
          "doc_employer_income_form16",
          "doc_land_house_income",
          "doc_other_income_proof",
          "doc_application_form",
          "doc_family_members_income"
        ]
      }
    ],
    sampleCodePrefix: "CG-INC",
    statutoryClause_en: "Annual household income verified on the basis of (1) an Affidavit and (2) Income Proof.",
    statutoryClause_hi: "वार्षिक पारिवारिक आय का सत्यापन (१) शपथ पत्र एवं (२) आय प्रमाण के आधार पर किया गया है।"
  },
  {
    id: "marriage",
    name_en: "Marriage Certificate",
    name_hi: "विवाह प्रमाण पत्र",
    subtitle_en: "Affidavit + Joint Photo + Birth Certificates + Signed Documents + Challan + Invitation Card",
    subtitle_hi: "शपथ पत्र + संयुक्त फोटो + जन्म प्रमाण पत्र + हस्ताक्षरित दस्तावेज + चालान + आमंत्रण पत्र",
    color: "var(--cert-marriage)",
    solid: "var(--cert-marriage-solid)",
    gradient: "linear-gradient(135deg, var(--rose-600), var(--pink-500))",
    glowColor: "rgba(var(--cert-marriage-rgb), 0.45)",
    icon: HeartHandshake,
    authority_en: "Office of the Registrar of Marriages",
    authority_hi: "कार्यालय विवाह पंजीयक",
    requirements: [
      { serial: 1, ...AFFIDAVIT },
      { serial: 2, id: "joint_photo", name_en: "Joint Photo of Groom & Bride (2A Size)", name_hi: "वर एवं वधू का संयुक्त फोटो (2A साइज)", mandatory: true, docIds: ["doc_marriage_joint_photo"] },
      { serial: 6, id: "groom_birth", name_en: "Groom's Birth Certificate", name_hi: "वर का जन्म प्रमाण पत्र", mandatory: true, docIds: ["doc_groom_birth_certificate"] },
      { serial: 7, id: "bride_birth", name_en: "Bride's Birth Certificate", name_hi: "वधू का जन्म प्रमाण पत्र", mandatory: true, docIds: ["doc_bride_birth_certificate"] },
      { serial: 8, id: "signed_page1", name_en: "Document Signed by Groom & Bride (Page 1)", name_hi: "वर एवं वधू द्वारा हस्ताक्षरित दस्तावेज (प्रथम पेज)", mandatory: true, docIds: ["doc_signed_document_page1"] },
      { serial: 9, id: "signed_page2", name_en: "Document Signed by Groom & Bride (Page 2)", name_hi: "वर एवं वधू द्वारा हस्ताक्षरित दस्तावेज (द्वितीय पेज)", mandatory: true, docIds: ["doc_signed_document_page2"] },
      { serial: 10, id: "challan", name_en: "Copy of Challan", name_hi: "चालान की प्रति", mandatory: true, docIds: ["doc_challan_copy"] },
      { serial: 11, id: "invitation", name_en: "Marriage Invitation Card", name_hi: "विवाह आमंत्रण पत्र", mandatory: true, docIds: ["doc_marriage_invitation_card"] }
    ],
    sampleCodePrefix: "CG-MAR",
    statutoryClause_en: "Marriage registered on the basis of (1) an Affidavit, (2) a joint 2A-size photo of the groom and bride, (3–4) birth certificates of the groom and bride, (5–6) both pages of the document signed by the groom and bride, (7) a copy of the challan, and (8) the marriage invitation card.",
    statutoryClause_hi: "विवाह पंजीकरण (१) शपथ पत्र, (२) वर एवं वधू का संयुक्त फोटो (2A साइज), (३–४) वर एवं वधू के जन्म प्रमाण पत्र, (५–६) वर एवं वधू द्वारा हस्ताक्षरित दस्तावेज के दोनों पेज, (७) चालान की प्रति, एवं (८) विवाह आमंत्रण पत्र के आधार पर किया गया है।"
  }
];

// Rule helpers shared by the game loop, baskets and guides.
export const acceptsDocument = (cert, docId) =>
  cert.requirements.some(req => req.docIds.includes(docId));

export const mandatoryRequirements = cert =>
  cert.requirements.filter(req => req.mandatory);

export const isRequirementMet = (req, collectedDocIds) =>
  req.docIds.some(id => collectedDocIds.includes(id));

export const metRequirementCount = (cert, collectedDocIds) =>
  mandatoryRequirements(cert).filter(req => isRequirementMet(req, collectedDocIds)).length;

export const isCertificateComplete = (cert, collectedDocIds) =>
  mandatoryRequirements(cert).every(req => isRequirementMet(req, collectedDocIds));

// A document is still worth placing while it can fill an open requirement: one that has
// no document yet, on a certificate that isn't complete. Once every requirement it
// supports is filled (by it or by another document of the same type), it's done.
export const isDocumentStillNeeded = (docId, collectedByCertificate) =>
  CERTIFICATES.some(cert => {
    const collected = collectedByCertificate[cert.id] || [];
    if (isCertificateComplete(cert, collected)) return false;
    return cert.requirements.some(req => req.docIds.includes(docId) && !isRequirementMet(req, collected));
  });
