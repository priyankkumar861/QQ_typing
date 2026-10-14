const fs = require('fs');
const path = require('path');

const passagesPath = path.join(__dirname, 'server', 'passages.json');
let passages = JSON.parse(fs.readFileSync(passagesPath, 'utf-8'));

// Topic-specific enriching paragraphs that extend passages smoothly to official commission length
const cglExtensions = [
  "In addition, expanding domestic precision manufacturing clusters ensures steady availability of high-purity chemical gases, silicon wafers, and automated optical inspection systems required for defect-free cleanroom fabrication. Academic partnerships with leading technical institutes will cultivate thousands of specialized process engineers, micro-lithography technicians, and chip validation architects. Strategic policy continuity, backed by predictable capital depreciation allowances and tariff protections, firmly anchors our domestic production capacity within the upper tier of global semiconductor fabrication ecosystems.",
  "Furthermore, developing dedicated industrial export corridors adjacent to maritime deep-water container terminals curtails logistics transit times for containerized electronic components and sub-assemblies. Continuous public investments in renewable solar parks and grid storage installations supply stable, zero-carbon electricity to power-intensive semiconductor foundries without incurring voltage drop interruptions. By fostering an interconnected ecosystem encompassing fabless startups, testing packaging facilities, and high-volume foundries, the national roadmap establishes enduring technological autonomy.",
  "Moreover, parliamentary oversight committees periodically review the deployment of fiscal subsidies to ensure optimal public return on capital investments and strict compliance with statutory environmental safeguards. Encouraging joint venture collaborations between domestic industrial conglomerates and multinational equipment fabricators accelerates hands-on operational technology absorption across regional fabrication zones. Sustained public support and collaborative industrial research guarantee that our domestic electronics sector remains agile, resilient, and technologically sovereign for decades to come."
];

const chslExtensions = [
  "In addition to infrastructure modernization, expanding regular technical capacity building workshops empowers administrative staff to process citizen documentation with heightened accuracy and efficiency. Eliminating redundant administrative formalities and streamlining multi-tier departmental review channels significantly reduces public waiting intervals. Promoting standardized digital records management safeguards official institutional memory while facilitating transparent public oversight and rigorous statutory compliance across all operational public departments.",
  "Furthermore, establishing regional coordination task forces ensures that public welfare policies are implemented uniformly across geographically diverse administrative zones without regional disparities. Regular stakeholder consultations and transparent feedback collection mechanisms allow public policy administrators to identify implementation hurdles promptly and execute necessary structural modifications. Fostering an administrative culture of proactive responsiveness guarantees that public services remain accessible, dependable, and citizen-friendly nationwide."
];

const ntpcGradExtensions = [
  "Moreover, senior commercial supervisors and accounts officers conduct regular revenue reconciliation audits, monitoring siding operations, container demurrage accounts, and electronic train waybill documentation across zonal territories. Structured training programs at zonal railway training institutes familiarize supervisory personnel with computerized crew management consoles, dynamic pricing algorithms, and integrated freight management applications. Diligent supervisory oversight preserves commercial integrity and operational excellence.",
  "Furthermore, coordinated liaison between divisional railway headquarters, state industrial development boards, and regional trade chambers accelerates private investment in automated railway siding facilities. Establishing computerized freight terminal monitoring dashboards provides real-time visibility into rake detention intervals, enabling swift remedial intervention by operating executives during peak seasonal agricultural harvest traffic movements."
];

const ntpcUgExtensions = [
  "Diligent clerical record keeping at divisional administrative branches and passenger booking counters maintains administrative transparency and operational efficiency across all operational railway jurisdictions. Clerks verify travel authorizations, reconcile daily transaction collection sheets with computerized ledger entries, and prepare accurate statistical summaries for superior supervisory review. Dedicated clerical discipline underpins dependable public rail service delivery daily.",
  "In addition, maintaining systematically organized office registers and electronic document filing indices ensures prompt retrieval of historical administrative records and legal case precedents. Punctual clearance of routine correspondence, combined with courteous passenger interaction at commercial ticket booking counters, upholds the highest standards of railway public administration."
];

const hindiExtensions = [
  "इसके साथ ही प्रशासनिक प्रक्रियाओं का निरंतर आधुनिकीकरण और नागरिक सेवाओं का पारदर्शी क्रियान्वयन सुशासन की स्थापना में अत्यंत महत्वपूर्ण भूमिका निभाता है। जनहित से जुड़ी योजनाओं को समयबद्ध रूप से अंतिम व्यक्ति तक पहुंचाना प्रत्येक लोक सेवक का प्राथमिक दायित्व है। जब प्रशासनिक निर्णय संवेदनशीलता, पारदर्शिता और कर्तव्यनिष्ठा के साथ लिए जाते हैं, तब राष्ट्र निर्माण की गति तीव्र और अधिक समावेशी बनती है।",
  "सूचना प्रौद्योगिकी का प्रभावी प्रयोग, नियमित कार्यशालाओं का आयोजन और कर्मचारियों की कार्यकुशलता में सतत संवर्धन प्रशासनिक तंत्र को अधिक गतिशील बनाता है। राष्ट्रीय विकास के इस पावन अभियान में प्रत्येक नागरिक और प्रशासनिक कर्मी की सक्रिय सहभागिता विकसित भारत के लक्ष्य को निश्चित रूप से साकार करेगी।"
];

// Target lengths
// SSC CGL: min 2100 chars
// SSC CHSL: min 1800 chars
// RRB NTPC Grad: min 1550 chars
// RRB NTPC UG: min 1550 chars
// Hindi: min 1550 chars

passages = passages.map((p, idx) => {
  let targetMin = 1550;
  let extensions = ntpcUgExtensions;

  if (p.category === 'SSC CGL') {
    targetMin = 2150;
    extensions = cglExtensions;
  } else if (p.category === 'SSC CHSL') {
    targetMin = 1850;
    extensions = chslExtensions;
  } else if (p.category === 'RRB NTPC Graduate') {
    targetMin = 1600;
    extensions = ntpcGradExtensions;
  } else if (p.category === 'RRB NTPC UG') {
    targetMin = 1600;
    extensions = ntpcUgExtensions;
  }

  if (p.language === 'Hindi') {
    targetMin = p.category === 'SSC CGL' ? 2100 : (p.category === 'SSC CHSL' ? 1850 : 1600);
    extensions = hindiExtensions;
  }

  let text = p.text.trim();
  let extIdx = 0;
  while (text.length < targetMin) {
    const ext = extensions[extIdx % extensions.length];
    text += " " + ext;
    extIdx++;
  }

  return {
    ...p,
    text: text.trim(),
    targetKeystrokes: p.category === 'SSC CGL' ? 2000 : (p.category === 'SSC CHSL' ? 1750 : 1500)
  };
});

fs.writeFileSync(passagesPath, JSON.stringify(passages, null, 2), 'utf-8');
console.log('SUCCESSFULLY RE-BUILT ALL PASSAGES!');

let allOk = true;
passages.forEach(p => {
  const minRequired = p.targetKeystrokes;
  const isOk = p.text.length >= minRequired;
  if (!isOk) allOk = false;
  console.log(`${p.id.padEnd(14)} | ${p.category.padEnd(18)} | Len: ${String(p.text.length).padStart(4)} | Target: ${minRequired} | ${isOk ? '✓ FULL (PASS)' : '✗ SHORT'}`);
});

console.log('FINAL VALIDATION RESULT: EVERY PASSAGE EXCEEDS OFFICIAL TARGET KEYSTROKES =', allOk);
