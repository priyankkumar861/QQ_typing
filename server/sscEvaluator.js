/**
 * Official SSC / Railway Evaluation Engine
 * Implements Full Mistakes (1.0) & Half Mistakes (0.5) according to SSC CGL/CHSL & RRB NTPC norms.
 */

// Helper: Levenshtein distance between two strings
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  return dp[m][n];
}

/**
 * Word alignment using dynamic programming (Longest Common Subsequence variation)
 */
function alignWords(originalWords, typedWords) {
  const m = originalWords.length;
  const n = typedWords.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const orig = originalWords[i - 1];
      const typed = typedWords[j - 1];
      const origClean = cleanPunctuation(orig).toLowerCase();
      const typedClean = cleanPunctuation(typed).toLowerCase();

      if (orig === typed) {
        dp[i][j] = dp[i - 1][j - 1] + 2; // exact match
      } else if (origClean === typedClean) {
        dp[i][j] = dp[i - 1][j - 1] + 1.8; // root word match with case/punctuation discrepancy
      } else {
        const dist = levenshteinDistance(origClean, typedClean);
        const maxLen = Math.max(origClean.length, typedClean.length);
        const allowedDist = Math.max(2, Math.min(4, Math.floor(maxLen * 0.38)));
        if (dist <= allowedDist) {
          dp[i][j] = dp[i - 1][j - 1] + 1; // minor typo on root word
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
  }

  // Backtrack to find alignment
  let i = m;
  let j = n;
  const alignment = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const orig = originalWords[i - 1];
      const typed = typedWords[j - 1];
      const origClean = cleanPunctuation(orig).toLowerCase();
      const typedClean = cleanPunctuation(typed).toLowerCase();
      const isExact = orig === typed;
      const isRootMatch = origClean === typedClean;
      const dist = levenshteinDistance(origClean, typedClean);
      const maxLen = Math.max(origClean.length, typedClean.length);
      const allowedDist = Math.max(2, Math.min(4, Math.floor(maxLen * 0.38)));
      const isClose = dist <= allowedDist;

      if (isExact || isRootMatch || isClose) {
        alignment.unshift({
          type: 'match',
          original: orig,
          typed: typed,
          origIndex: i - 1,
          typedIndex: j - 1
        });
        i--;
        j--;
        continue;
      }
    }

    if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Extra typed word (Addition)
      alignment.unshift({
        type: 'addition',
        original: null,
        typed: typedWords[j - 1],
        origIndex: null,
        typedIndex: j - 1
      });
      j--;
    } else if (i > 0) {
      // Omitted original word (Omission)
      alignment.unshift({
        type: 'omission',
        original: originalWords[i - 1],
        typed: null,
        origIndex: i - 1,
        typedIndex: null
      });
      i--;
    }
  }

  return alignment;
}

/**
 * Clean punctuation for clean comparison
 */
function cleanPunctuation(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
}

/**
 * Main Evaluation Function
 */
function evaluateTyping({
  originalText,
  typedText,
  timeTakenSeconds,
  testDurationMinutes = 10,
  backspaceCount = 0,
  examType = "SSC_CGL", // SSC_CGL, SSC_CHSL, RRB_NTPC
  category = "UR"       // UR, OBC, EWS, SC, ST, PwD
}) {
  const cleanOriginal = originalText.trim();
  const cleanTyped = typedText.trim();

  const originalWords = cleanOriginal.length > 0 ? cleanOriginal.split(/\s+/) : [];
  const typedWords = cleanTyped.length > 0 ? cleanTyped.split(/\s+/) : [];

  const totalOriginalWords = originalWords.length;
  const totalTypedWords = typedWords.length;

  const totalTypedChars = typedText.length;
  const totalCorrectChars = 0;

  const alignment = alignWords(originalWords, typedWords);

  let fullMistakes = 0;
  let halfMistakes = 0;
  let correctWordsCount = 0;
  const detailedResults = [];

  // Group adjacent omission & addition as substitution when possible
  let idx = 0;
  while (idx < alignment.length) {
    const curr = alignment[idx];
    const next = alignment[idx + 1];

    if (curr.type === 'omission' && next && next.type === 'addition') {
      // Substitution of wrong word (Full Mistake)
      fullMistakes += 1;
      detailedResults.push({
        status: 'full_mistake',
        reason: 'Word Substitution',
        expected: curr.original,
        actual: next.typed,
        penalty: 1.0
      });
      idx += 2;
      continue;
    }

    if (curr.type === 'omission') {
      // Omission of word (Full Mistake)
      fullMistakes += 1;
      detailedResults.push({
        status: 'full_mistake',
        reason: 'Omission of word',
        expected: curr.original,
        actual: '—',
        penalty: 1.0
      });
      idx++;
      continue;
    }

    if (curr.type === 'addition') {
      // Addition of word not in passage (Full Mistake)
      fullMistakes += 1;
      detailedResults.push({
        status: 'full_mistake',
        reason: 'Unnecessary Addition',
        expected: '—',
        actual: curr.typed,
        penalty: 1.0
      });
      idx++;
      continue;
    }

    if (curr.type === 'match') {
      const orig = curr.original;
      const typed = curr.typed;

      if (orig === typed) {
        // 100% Exact match
        correctWordsCount += 1;
        detailedResults.push({
          status: 'correct',
          expected: orig,
          actual: typed,
          penalty: 0
        });
      } else if (orig.toLowerCase() === typed.toLowerCase()) {
        // Capitalization error (Half Mistake)
        halfMistakes += 1;
        detailedResults.push({
          status: 'half_mistake',
          reason: 'Capitalization Error',
          expected: orig,
          actual: typed,
          penalty: 0.5
        });
      } else {
        const origClean = cleanPunctuation(orig);
        const typedClean = cleanPunctuation(typed);

        if (origClean.toLowerCase() === typedClean.toLowerCase()) {
          // Punctuation error (Half Mistake)
          halfMistakes += 1;
          detailedResults.push({
            status: 'half_mistake',
            reason: 'Punctuation Error',
            expected: orig,
            actual: typed,
            penalty: 0.5
          });
        } else {
          // Spelling mistake (Half Mistake in SSC if <= 2 chars typo, else Full)
          const dist = levenshteinDistance(orig.toLowerCase(), typed.toLowerCase());
          if (dist <= 2) {
            halfMistakes += 1;
            detailedResults.push({
              status: 'half_mistake',
              reason: 'Minor Spelling Typo',
              expected: orig,
              actual: typed,
              penalty: 0.5
            });
          } else {
            fullMistakes += 1;
            detailedResults.push({
              status: 'full_mistake',
              reason: 'Incorrect Word',
              expected: orig,
              actual: typed,
              penalty: 1.0
            });
          }
        }
      }
      idx++;
    }
  }

  // Calculate SSC Scores
  const totalMistakes = fullMistakes + (halfMistakes * 0.5);

  // Time in minutes (guard against 0)
  const timeTakenMinutes = Math.max(timeTakenSeconds / 60, 0.08); // min 5 secs
  
  // Total keystrokes: typed characters
  const grossKeystrokes = totalTypedChars;
  
  // Keystrokes Per Hour (KDPH):
  // Formula: (Keystrokes / timeTakenMinutes) * 60
  const grossKDPH = Math.round((grossKeystrokes / timeTakenMinutes) * 60);

  // Gross Words Per Minute (Standard 5 keystrokes = 1 word or totalTypedWords)
  const grossWPM = Number(((grossKeystrokes / 5) / timeTakenMinutes).toFixed(2));

  let netWPM = 0;
  let penaltyWordsDeducted = 0;
  let ignoredMistakes = 0;
  let excessMistakes = 0;
  let errorPercentage = 0;
  let requiredWPM = 35;
  let maxAllowedError = 5.0;
  let requiredKDPH = 10500;

  if (examType === "RRB_NTPC") {
    // Official Railway RRB NTPC Formula:
    // 1. 5% mistakes of total typed words are ignored
    // 2. Excess mistakes beyond 5% deduct 10 words per mistake
    // 3. Net Words = Total Typed Words - (Excess Mistakes * 10)
    // 4. Net Speed = Net Words / Time in Minutes
    requiredWPM = 30; // 30 WPM English / 25 WPM Hindi
    requiredKDPH = 9000;
    maxAllowedError = 5.0;

    ignoredMistakes = Number((totalTypedWords * 0.05).toFixed(2));
    excessMistakes = Math.max(0, Number((totalMistakes - ignoredMistakes).toFixed(2)));
    penaltyWordsDeducted = Math.round(excessMistakes * 10);
    const netWords = Math.max(0, totalTypedWords - penaltyWordsDeducted);
    netWPM = Number((netWords / timeTakenMinutes).toFixed(2));

    const baseWordsForError = totalTypedWords > 0 ? totalTypedWords : totalOriginalWords;
    errorPercentage = baseWordsForError > 0 
      ? Number(((totalMistakes / baseWordsForError) * 100).toFixed(2)) 
      : 0;
  } else if (examType === "SSC_CGL") {
    // Official SSC CGL Tier-II DEST:
    // 15-minute test, 2,000 keystrokes = 8,000 KDPH (~26.67 to 27 WPM)
    // Error thresholds: 5% UR, 7% OBC/EWS, 10% SC/ST
    requiredWPM = 27;
    requiredKDPH = 8000;
    maxAllowedError = (category === "UR") ? 5.0 : (["OBC", "EWS"].includes(category) ? 7.0 : 10.0);

    const penaltyWPM = Number((totalMistakes / timeTakenMinutes).toFixed(2));
    netWPM = Math.max(0, Number((grossWPM - penaltyWPM).toFixed(2)));

    const baseWordsForError = totalTypedWords > 0 ? totalTypedWords : totalOriginalWords;
    errorPercentage = baseWordsForError > 0 
      ? Number(((totalMistakes / baseWordsForError) * 100).toFixed(2)) 
      : 0;
  } else {
    // SSC CHSL Tier-II Typing:
    // 10-minute test, 1,750 keystrokes = 10,500 KDPH (35 WPM)
    // Error thresholds: 7% UR, 10% OBC/EWS/SC/ST
    requiredWPM = 35;
    requiredKDPH = 10500;
    maxAllowedError = (category === "UR") ? 7.0 : 10.0;

    const penaltyWPM = Number((totalMistakes / timeTakenMinutes).toFixed(2));
    netWPM = Math.max(0, Number((grossWPM - penaltyWPM).toFixed(2)));

    const baseWordsForError = totalTypedWords > 0 ? totalTypedWords : totalOriginalWords;
    errorPercentage = baseWordsForError > 0 
      ? Number(((totalMistakes / baseWordsForError) * 100).toFixed(2)) 
      : 0;
  }

  // Accuracy %
  const accuracy = totalTypedWords > 0 
    ? Math.max(0, Number(((1 - (totalMistakes / totalTypedWords)) * 100).toFixed(2)))
    : 0;

  const isSpeedQualified = netWPM >= requiredWPM;
  const isAccuracyQualified = errorPercentage <= maxAllowedError;

  // 1. OFFICIAL CATEGORY-WISE CUTOFF DEFINITIONS & COMPARISON
  let categoryCutoffs = [];
  if (examType === "SSC_CGL") {
    categoryCutoffs = [
      { category: "UR", maxError: 5.0, minAccuracy: 95.0, description: "Unreserved (UR): Max 5% Errors (Min 95% Accuracy, 8000 KDPH)" },
      { category: "OBC", maxError: 7.0, minAccuracy: 93.0, description: "OBC: Max 7% Errors (Min 93% Accuracy, 8000 KDPH)" },
      { category: "EWS", maxError: 7.0, minAccuracy: 93.0, description: "EWS: Max 7% Errors (Min 93% Accuracy, 8000 KDPH)" },
      { category: "SC", maxError: 10.0, minAccuracy: 90.0, description: "SC: Max 10% Errors (Min 90% Accuracy, 8000 KDPH)" },
      { category: "ST", maxError: 10.0, minAccuracy: 90.0, description: "ST: Max 10% Errors (Min 90% Accuracy, 8000 KDPH)" },
      { category: "PwD", maxError: 10.0, minAccuracy: 90.0, description: "PwD / ESM: Max 10% Errors (Min 90% Accuracy, 8000 KDPH)" }
    ];
  } else if (examType === "SSC_CHSL") {
    categoryCutoffs = [
      { category: "UR", maxError: 7.0, minAccuracy: 93.0, description: "Unreserved (UR): Max 7% Errors (35 WPM / 10,500 KDPH)" },
      { category: "OBC", maxError: 10.0, minAccuracy: 90.0, description: "OBC: Max 10% Errors (35 WPM / 10,500 KDPH)" },
      { category: "EWS", maxError: 10.0, minAccuracy: 90.0, description: "EWS: Max 10% Errors (35 WPM / 10,500 KDPH)" },
      { category: "SC", maxError: 10.0, minAccuracy: 90.0, description: "SC: Max 10% Errors (35 WPM / 10,500 KDPH)" },
      { category: "ST", maxError: 10.0, minAccuracy: 90.0, description: "ST: Max 10% Errors (35 WPM / 10,500 KDPH)" },
      { category: "PwD", maxError: 10.0, minAccuracy: 90.0, description: "PwD / ESM: Max 10% Errors (35 WPM / 10,500 KDPH)" }
    ];
  } else {
    // RRB NTPC: 30 WPM English / 25 WPM Hindi, 5% mistakes ignored, excess * 10 deducted
    categoryCutoffs = [
      { category: "UR", maxError: 5.0, minAccuracy: 95.0, description: "UR: Min 30 WPM (5% Errors Ignored, Excess × 10 Penalty)" },
      { category: "OBC", maxError: 5.0, minAccuracy: 95.0, description: "OBC: Min 30 WPM (5% Errors Ignored, Excess × 10 Penalty)" },
      { category: "EWS", maxError: 5.0, minAccuracy: 95.0, description: "EWS: Min 30 WPM (5% Errors Ignored, Excess × 10 Penalty)" },
      { category: "SC", maxError: 5.0, minAccuracy: 95.0, description: "SC: Min 30 WPM (5% Errors Ignored, Excess × 10 Penalty)" },
      { category: "ST", maxError: 5.0, minAccuracy: 95.0, description: "ST: Min 30 WPM (5% Errors Ignored, Excess × 10 Penalty)" },
      { category: "PwD", maxError: 5.0, minAccuracy: 95.0, description: "PwD: Min 30 WPM (5% Errors Ignored, Excess × 10 Penalty)" }
    ];
  }

  const categoryComparison = categoryCutoffs.map(item => {
    let qualified = false;
    if (examType === "RRB_NTPC") {
      qualified = netWPM >= 30;
    } else {
      qualified = errorPercentage <= item.maxError && isSpeedQualified;
    }
    return {
      category: item.category,
      maxAllowedError: item.maxError,
      minAccuracy: item.minAccuracy,
      description: item.description,
      isQualified: qualified,
      isCandidateCategory: item.category.toUpperCase() === (category || "UR").toUpperCase()
    };
  });

  // Candidate's own category qualification check
  const candidateCategoryObj = categoryComparison.find(c => c.isCandidateCategory) || categoryComparison[0];
  const isQualified = candidateCategoryObj.isQualified;

  // 2. WEAK WORDS EXTRACTION & DIAGNOSTIC ANALYSIS
  const weakWordsMap = new Map();
  detailedResults.forEach(item => {
    if (item.status === 'half_mistake' || item.status === 'full_mistake') {
      const cleanExpected = cleanPunctuation(item.expected || '').trim();
      const cleanActual = cleanPunctuation(item.actual || '').trim();

      if (cleanExpected.length >= 2) {
        const key = cleanExpected.toLowerCase();
        if (!weakWordsMap.has(key)) {
          let advice = `Word typing error. Practice typing "${cleanExpected}".`;
          if (item.reason === 'Omission of word') {
            advice = `You skipped this word completely. Keep your focus on line alignment.`;
          } else if (item.reason === 'Capitalization Error') {
            advice = `Shift key timing mismatch. Notice the capital letter.`;
          } else if (item.reason === 'Punctuation Error') {
            advice = `Punctuation punctuation was misplaced or missed.`;
          } else if (item.reason === 'Minor Spelling Typo') {
            advice = `You typed "${cleanActual}". Watch letter order and adjacent key slips.`;
          } else if (item.reason === 'Word Substitution') {
            advice = `Replaced with "${cleanActual}". Read word carefully before typing.`;
          }

          weakWordsMap.set(key, {
            word: cleanExpected,
            typed: cleanActual || (item.reason === 'Omission of word' ? '[Omitted]' : '—'),
            reason: item.reason || 'Incorrect Word',
            penalty: item.penalty,
            status: item.status,
            occurrences: 1,
            advice
          });
        } else {
          weakWordsMap.get(key).occurrences += 1;
        }
      }
    }
  });

  const weakWords = Array.from(weakWordsMap.values()).slice(0, 15);

  return {
    examType,
    category,
    candidateCategory: candidateCategoryObj.category,
    categoryMaxAllowedError: candidateCategoryObj.maxAllowedError,
    timeTakenSeconds,
    timeTakenMinutes: Number(timeTakenMinutes.toFixed(2)),
    totalOriginalWords,
    totalTypedWords,
    totalKeystrokes: grossKeystrokes,
    backspaceCount,
    correctWordsCount,
    fullMistakes,
    halfMistakes,
    totalMistakes,
    grossWPM,
    netWPM,
    grossKDPH,
    requiredKDPH,
    ignoredMistakes,
    excessMistakes,
    penaltyWordsDeducted,
    errorPercentage,
    accuracy,
    requiredWPM,
    maxAllowedError: candidateCategoryObj.maxAllowedError,
    isSpeedQualified,
    isAccuracyQualified,
    isQualified,
    categoryComparison,
    weakWords,
    detailedResults
  };
}

module.exports = {
  evaluateTyping,
  alignWords,
  levenshteinDistance
};
