/**
 * TypingClub / EdClub-Inspired 10-Finger Interactive Curriculum
 * Structured in Gamified Stages (Home Row -> Top Row -> Bottom Row -> Shift -> Numbers -> Speed)
 */

export const TOUCH_TYPING_STAGES = [
  {
    id: 'stage_home',
    title: 'Stage 1: Home Row Foundations',
    icon: '🏠',
    description: 'Learn the primary rest position and anchor fingers on ASDF and JKL;'
  },
  {
    id: 'stage_top',
    title: 'Stage 2: Top Row Reach',
    icon: '⬆️',
    description: 'Upward finger extensions for QWERT and YUIOP without wrist lifting'
  },
  {
    id: 'stage_bottom',
    title: 'Stage 3: Bottom Row Curl',
    icon: '⬇️',
    description: 'Inward finger curls for ZXCVB and NM,./'
  },
  {
    id: 'stage_shift',
    title: 'Stage 4: Capital Letters & Shift Key',
    icon: '🔠',
    description: 'Opposite Pinky Shift rule for capitalization required in DEST'
  },
  {
    id: 'stage_numbers',
    title: 'Stage 5: Number Row & Punctuation',
    icon: '🔢',
    description: 'Top numerical keys and exam standard punctuation marks'
  },
  {
    id: 'stage_speed',
    title: 'Stage 6: SSC & Railway Speed Drills',
    icon: '🚀',
    description: 'High-frequency exam vocabulary and qualifying speed benchmarks'
  }
];

export const TOUCH_TYPING_LESSONS = [
  // STAGE 1: HOME ROW FOUNDATIONS
  {
    id: 1,
    stageId: 'stage_home',
    level: "Lesson 1",
    badge: "F & J",
    title: "Anchor Keys (F & J)",
    subtitle: "Locate tactile bumps with left and right index fingers",
    fingerFocus: "Index Fingers (Left: F, Right: J)",
    text: "f j f j ff jj fj jf ff jj fj fj f f j j ff jj fj jf ff jf fj jj ff",
    targetAccuracy: 95,
    targetWPM: 14,
    description: "Feel the small tactile bumps on F and J. Rest your left index on F and right index on J."
  },
  {
    id: 2,
    stageId: 'stage_home',
    level: "Lesson 2",
    badge: "D & K",
    title: "Middle Fingers (D & K)",
    subtitle: "Left Middle on D, Right Middle on K",
    fingerFocus: "Middle Fingers (Left: D, Right: K)",
    text: "d k d k dd kk dk kd dd kk dk kd fd jk df kj fdk jkd dkf kjd dd kk",
    targetAccuracy: 95,
    targetWPM: 15,
    description: "Curve your middle fingers. Keep index fingers relaxed on their F and J anchor positions."
  },
  {
    id: 3,
    stageId: 'stage_home',
    level: "Lesson 3",
    badge: "S & L",
    title: "Ring Fingers (S & L)",
    subtitle: "Left Ring on S, Right Ring on L",
    fingerFocus: "Ring Fingers (Left: S, Right: L)",
    text: "s l s l ss ll sl ls ss ll sl ls fs jl sf lj dsk kld sdl lds ss ll",
    targetAccuracy: 95,
    targetWPM: 16,
    description: "Ring fingers need deliberate practice. Keep wrists elevated slightly above the desk."
  },
  {
    id: 4,
    stageId: 'stage_home',
    level: "Lesson 4",
    badge: "A & ;",
    title: "Pinky Keys (A & ;)",
    subtitle: "Left Pinky on A, Right Pinky on Semicolon",
    fingerFocus: "Pinky Fingers (Left: A, Right: ;)",
    text: "a ; a ; aa ;; a; ;a asdf jkl; asdf jkl; aa ;; a; ;a fa ;j da ;k sa ;l",
    targetAccuracy: 95,
    targetWPM: 16,
    description: "Rest pinkies gently on A and Semicolon. You now have all 8 home row rest positions!"
  },
  {
    id: 5,
    stageId: 'stage_home',
    level: "Lesson 5",
    badge: "G & H",
    title: "Center Stretch (G & H)",
    subtitle: "Index finger reach inward to G and H",
    fingerFocus: "Index Fingers (F -> G, J -> H)",
    text: "fg jh fg jh gf hj gf hj fag jah gak had has hag half flag dash flash salad glad",
    targetAccuracy: 95,
    targetWPM: 18,
    description: "Reach left index rightward for G, then snap back to F. Reach right index leftward for H, then return to J."
  },
  {
    id: 6,
    stageId: 'stage_home',
    level: "Lesson 6",
    badge: "Words",
    title: "Home Row Words Mastery",
    subtitle: "Forming complete real words using only the home row",
    fingerFocus: "All Fingers (Home Row Coordination)",
    text: "ask all fall flash glad half dash salad sash falls flask glass slash salsa alfa",
    targetAccuracy: 96,
    targetWPM: 20,
    description: "Smooth, continuous rhythm is better than fast bursts with typos. Keep eyes glued to screen."
  },

  // STAGE 2: TOP ROW REACH
  {
    id: 7,
    stageId: 'stage_top',
    level: "Lesson 7",
    badge: "E & I",
    title: "Top Row Vowels (E & I)",
    subtitle: "Reach upward with middle fingers",
    fingerFocus: "Middle Fingers (D -> E, K -> I)",
    text: "de ki de ki ed ik ed ik did kid die lie side like file lake life desk silk idle",
    targetAccuracy: 95,
    targetWPM: 20,
    description: "Reach your left middle finger up from D to E. Reach your right middle finger up from K to I."
  },
  {
    id: 8,
    stageId: 'stage_top',
    level: "Lesson 8",
    badge: "R & U",
    title: "Index Reach (R & U)",
    subtitle: "Reach upward with index fingers",
    fingerFocus: "Index Fingers (F -> R, J -> U)",
    text: "fr ju fr ju rf uj rf uj fur jug red jud rude rule cure sure true user fire ride",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Left index extends to R; right index extends to U. Always snap back to home position."
  },
  {
    id: 9,
    stageId: 'stage_top',
    level: "Lesson 9",
    badge: "T & Y",
    title: "Top Center Keys (T & Y)",
    subtitle: "Extended upward reach with index fingers",
    fingerFocus: "Index Fingers (F -> T, J -> Y)",
    text: "ft jy ft jy tf yj tf yj try yet they type tray stay easy city tiny story date",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Stretch diagonally upward: left index to T, right index to Y."
  },
  {
    id: 10,
    stageId: 'stage_top',
    level: "Lesson 10",
    badge: "W & O",
    title: "Ring Finger Reach (W & O)",
    subtitle: "Upward reach with ring fingers",
    fingerFocus: "Ring Fingers (S -> W, L -> O)",
    text: "sw lo sw lo ws ol ws ol low row slow flow blow word work look took book wood wool",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Left ring finger reaches to W; right ring finger reaches to O."
  },
  {
    id: 11,
    stageId: 'stage_top',
    level: "Lesson 11",
    badge: "Q & P",
    title: "Pinky Outer Reach (Q & P)",
    subtitle: "Upward reach with outer pinky fingers",
    fingerFocus: "Pinky Fingers (A -> Q, ; -> P)",
    text: "aq ;p aq ;p qa p; qa p; quick quote quiet equip point party power report paper drop",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Left pinky reaches up to Q; right pinky reaches up to P."
  },

  // STAGE 3: BOTTOM ROW CURL
  {
    id: 12,
    stageId: 'stage_bottom',
    level: "Lesson 12",
    badge: "V & M",
    title: "Bottom Index Keys (V & M)",
    subtitle: "Curl downward with index fingers",
    fingerFocus: "Index Fingers (F -> V, J -> M)",
    text: "fv jm fv jm vf mj vf mj van man move view make mail vim form firm calm term farm",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Curl left index inward to V; curl right index inward to M."
  },
  {
    id: 13,
    stageId: 'stage_bottom',
    level: "Lesson 13",
    badge: "C & ,",
    title: "Middle Finger Curl (C & Comma)",
    subtitle: "Curl downward with middle fingers",
    fingerFocus: "Middle Fingers (D -> C, K -> Comma)",
    text: "dc k, dc k, cd ,k cd ,k car, can, act, cut, ace, ice, race, pace, case, fact, lock",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Curl left middle down to C; curl right middle down to comma (,)."
  },
  {
    id: 14,
    stageId: 'stage_bottom',
    level: "Lesson 14",
    badge: "X & .",
    title: "Ring Finger Curl (X & Period)",
    subtitle: "Curl downward with ring fingers",
    fingerFocus: "Ring Fingers (S -> X, L -> Period)",
    text: "sx l. sx l. xs .l xs .l box. fox. tax. mix. fix. max. next. text. exam. exit. axis.",
    targetAccuracy: 95,
    targetWPM: 24,
    description: "Left ring curls to X; right ring curls to period (.). Essential for exam sentence endings."
  },
  {
    id: 15,
    stageId: 'stage_bottom',
    level: "Lesson 15",
    badge: "Z & /",
    title: "Pinky Curl Keys (Z & /)",
    subtitle: "Curl downward with pinkies",
    fingerFocus: "Pinky Fingers (A -> Z, ; -> /)",
    text: "az ;/ az ;/ za /; za /; zero zone zip maze size zoom lazy quiz prize crazy freeze",
    targetAccuracy: 95,
    targetWPM: 22,
    description: "Left pinky curls down to Z; right pinky curls down to slash (/)."
  },
  {
    id: 16,
    stageId: 'stage_bottom',
    level: "Lesson 16",
    badge: "B & N",
    title: "Center Bottom Keys (B & N)",
    subtitle: "Index reach diagonally downward",
    fingerFocus: "Index Fingers (F -> B, J -> N)",
    text: "fb jn fb jn bf nj bf nj ban nab bat ben bun bin barn born born bean bank bone bond",
    targetAccuracy: 95,
    targetWPM: 24,
    description: "Stretch left index down-right to B; stretch right index down-left to N."
  },

  // STAGE 4: CAPITAL LETTERS & SHIFT KEY
  {
    id: 17,
    stageId: 'stage_shift',
    level: "Lesson 17",
    badge: "L-Shift",
    title: "Left Shift (Right Hand Caps)",
    subtitle: "Hold Left Shift with left pinky for right hand capital letters",
    fingerFocus: "Left Pinky on Shift + Right Hand Key",
    text: "India Japan Korea London Mumbai New Delhi Patna Punjab Rajasthan Surat Uttar Pradesh",
    targetAccuracy: 96,
    targetWPM: 25,
    description: "Official SSC Rule: Always hold Left Shift with left pinky while typing right hand keys (I, J, K, L, M, N, O, P, U, Y)!"
  },
  {
    id: 18,
    stageId: 'stage_shift',
    level: "Lesson 18",
    badge: "R-Shift",
    title: "Right Shift (Left Hand Caps)",
    subtitle: "Hold Right Shift with right pinky for left hand capital letters",
    fingerFocus: "Right Pinky on Shift + Left Hand Key",
    text: "Delhi Bharat Chennai Gujarat Assam Bengal Goa Haryana Kerala Tamil Telangana",
    targetAccuracy: 96,
    targetWPM: 25,
    description: "Official SSC Rule: Always hold Right Shift with right pinky while typing left hand keys (A, B, C, D, E, F, G, R, S, T, V, W, X, Z)!"
  },

  // STAGE 5: NUMBER ROW & PUNCTUATION
  {
    id: 19,
    stageId: 'stage_numbers',
    level: "Lesson 19",
    badge: "Numbers",
    title: "Number Row Mastery (1 to 0)",
    subtitle: "Reaching upward to numerical keys",
    fingerFocus: "All Fingers (Number Row)",
    text: "10 20 30 40 50 100 200 500 1000 2024 2026 1947 1857 750 1750 2000 10500 9000",
    targetAccuracy: 95,
    targetWPM: 24,
    description: "Essential for government notifications, fiscal years, codes, and numerical exam data."
  },
  {
    id: 20,
    stageId: 'stage_numbers',
    level: "Lesson 20",
    badge: "Punctuation",
    title: "Official Exam Punctuation",
    subtitle: "Commas, periods, colons, hyphens, and quotes",
    fingerFocus: "Precision Punctuation",
    text: "Commission: SSC & RRB; Year: 2026. Target: 100% precision. Note: 'Excellence requires daily dedication.'",
    targetAccuracy: 96,
    targetWPM: 25,
    description: "SSC penalizes omitted punctuation as half-mistakes. Always add a space after a comma, period, or colon."
  },

  // STAGE 6: SSC & RAILWAY SPEED DRILLS
  {
    id: 21,
    stageId: 'stage_speed',
    level: "Lesson 21",
    badge: "N-Grams",
    title: "Frequent English Syllables",
    subtitle: "N-Grams and prefixes for rapid muscle memory",
    fingerFocus: "Fluid Chords & Syllable Flow",
    text: "tion ment ship able ible inter trans intro under over auto tele micro multi nation action direct condition development employment",
    targetAccuracy: 96,
    targetWPM: 30,
    description: "Typing syllables as single muscle-memory chords is the secret to breaking past 35 WPM!"
  },
  {
    id: 22,
    stageId: 'stage_speed',
    level: "Lesson 22",
    badge: "27 WPM",
    title: "SSC CGL DEST Benchmark (27 WPM)",
    subtitle: "Official Data Entry Skill Test qualifying speed",
    fingerFocus: "Exam Cadence & Calmness",
    text: "Digital governance and modern administrative practices improve efficiency and public service delivery across all sectors of the national economy with transparency and accountability.",
    targetAccuracy: 96,
    targetWPM: 27,
    description: "Maintain 27 WPM without pause. Accuracy above 95% guarantees qualification under UR cutoffs."
  },
  {
    id: 23,
    stageId: 'stage_speed',
    level: "Lesson 23",
    badge: "30 WPM",
    title: "Railway RRB NTPC Benchmark (30 WPM)",
    subtitle: "Official Railway NTPC Level 5 & Level 2 qualification standard",
    fingerFocus: "Railway Speed Sustenance",
    text: "Indian Railways operates one of the largest transportation networks in the world, connecting millions of citizens daily and fueling sustainable economic expansion through dedicated freight and passenger corridors.",
    targetAccuracy: 96,
    targetWPM: 30,
    description: "RRB NTPC requires 30 WPM in English. Maintain smooth flow without looking at your physical keyboard."
  },
  {
    id: 24,
    stageId: 'stage_speed',
    level: "Lesson 24",
    badge: "35 WPM PRO",
    title: "SSC CHSL Pro Benchmark (35 WPM)",
    subtitle: "High speed mastery for top merit list candidates",
    fingerFocus: "Pro Speed & Flawless Accuracy",
    text: "Comprehensive administrative reforms, transparent institutional frameworks, and technological adoption empower nations to achieve sustainable growth, foster innovation, and secure prosperous livelihoods for future generations.",
    targetAccuracy: 98,
    targetWPM: 35,
    description: "Elite level typing. Maintain 35+ Words Per Minute while sustaining above 97% accuracy."
  }
];

export const KEYBOARD_LAYOUT = [
  // Row 1
  [
    { key: '`', shiftKey: '~', finger: 'left-pinky' },
    { key: '1', shiftKey: '!', finger: 'left-pinky' },
    { key: '2', shiftKey: '@', finger: 'left-ring' },
    { key: '3', shiftKey: '#', finger: 'left-middle' },
    { key: '4', shiftKey: '$', finger: 'left-index' },
    { key: '5', shiftKey: '%', finger: 'left-index' },
    { key: '6', shiftKey: '^', finger: 'right-index' },
    { key: '7', shiftKey: '&', finger: 'right-index' },
    { key: '8', shiftKey: '*', finger: 'right-middle' },
    { key: '9', shiftKey: '(', finger: 'right-ring' },
    { key: '0', shiftKey: ')', finger: 'right-pinky' },
    { key: '-', shiftKey: '_', finger: 'right-pinky' },
    { key: '=', shiftKey: '+', finger: 'right-pinky' },
    { key: 'Backspace', width: 'w-16', finger: 'right-pinky', special: true }
  ],
  // Row 2
  [
    { key: 'Tab', width: 'w-14', finger: 'left-pinky', special: true },
    { key: 'q', shiftKey: 'Q', finger: 'left-pinky' },
    { key: 'w', shiftKey: 'W', finger: 'left-ring' },
    { key: 'e', shiftKey: 'E', finger: 'left-middle' },
    { key: 'r', shiftKey: 'R', finger: 'left-index' },
    { key: 't', shiftKey: 'T', finger: 'left-index' },
    { key: 'y', shiftKey: 'Y', finger: 'right-index' },
    { key: 'u', shiftKey: 'U', finger: 'right-index' },
    { key: 'i', shiftKey: 'I', finger: 'right-middle' },
    { key: 'o', shiftKey: 'O', finger: 'right-ring' },
    { key: 'p', shiftKey: 'P', finger: 'right-pinky' },
    { key: '[', shiftKey: '{', finger: 'right-pinky' },
    { key: ']', shiftKey: '}', finger: 'right-pinky' },
    { key: '\\', shiftKey: '|', finger: 'right-pinky' }
  ],
  // Row 3 (Home Row)
  [
    { key: 'Caps', width: 'w-16', finger: 'left-pinky', special: true },
    { key: 'a', shiftKey: 'A', finger: 'left-pinky', home: true },
    { key: 's', shiftKey: 'S', finger: 'left-ring', home: true },
    { key: 'd', shiftKey: 'D', finger: 'left-middle', home: true },
    { key: 'f', shiftKey: 'F', finger: 'left-index', home: true, bump: true },
    { key: 'g', shiftKey: 'G', finger: 'left-index' },
    { key: 'h', shiftKey: 'H', finger: 'right-index' },
    { key: 'j', shiftKey: 'J', finger: 'right-index', home: true, bump: true },
    { key: 'k', shiftKey: 'K', finger: 'right-middle', home: true },
    { key: 'l', shiftKey: 'L', finger: 'right-ring', home: true },
    { key: ';', shiftKey: ':', finger: 'right-pinky', home: true },
    { key: "'", shiftKey: '"', finger: 'right-pinky' },
    { key: 'Enter', width: 'w-18', finger: 'right-pinky', special: true }
  ],
  // Row 4
  [
    { key: 'Shift', width: 'w-20', finger: 'left-pinky', special: true },
    { key: 'z', shiftKey: 'Z', finger: 'left-pinky' },
    { key: 'x', shiftKey: 'X', finger: 'left-ring' },
    { key: 'c', shiftKey: 'C', finger: 'left-middle' },
    { key: 'v', shiftKey: 'V', finger: 'left-index' },
    { key: 'b', shiftKey: 'B', finger: 'left-index' },
    { key: 'n', shiftKey: 'N', finger: 'right-index' },
    { key: 'm', shiftKey: 'M', finger: 'right-index' },
    { key: ',', shiftKey: '<', finger: 'right-middle' },
    { key: '.', shiftKey: '>', finger: 'right-ring' },
    { key: '/', shiftKey: '?', finger: 'right-pinky' },
    { key: 'Shift', width: 'w-20', finger: 'right-pinky', special: true }
  ],
  // Row 5
  [
    { key: 'Ctrl', width: 'w-12', finger: 'left-pinky', special: true },
    { key: 'Alt', width: 'w-12', finger: 'left-thumb', special: true },
    { key: ' ', width: 'w-64', finger: 'thumb', label: 'Spacebar' },
    { key: 'Alt', width: 'w-12', finger: 'right-thumb', special: true },
    { key: 'Ctrl', width: 'w-12', finger: 'right-pinky', special: true }
  ]
];

export const FINGER_COLORS = {
  'left-pinky': { bg: 'bg-rose-500/15', border: 'border-rose-500/50', text: 'text-rose-400', label: 'Left Pinky', hex: '#f43f5e' },
  'left-ring': { bg: 'bg-orange-500/15', border: 'border-orange-500/50', text: 'text-orange-400', label: 'Left Ring', hex: '#f97316' },
  'left-middle': { bg: 'bg-amber-500/15', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Left Middle', hex: '#eab308' },
  'left-index': { bg: 'bg-emerald-500/15', border: 'border-emerald-500/50', text: 'text-emerald-400', label: 'Left Index', hex: '#10b981' },
  'right-index': { bg: 'bg-cyan-500/15', border: 'border-cyan-500/50', text: 'text-cyan-400', label: 'Right Index', hex: '#06b6d4' },
  'right-middle': { bg: 'bg-blue-500/15', border: 'border-blue-500/50', text: 'text-blue-400', label: 'Right Middle', hex: '#3b82f6' },
  'right-ring': { bg: 'bg-purple-500/15', border: 'border-purple-500/50', text: 'text-purple-400', label: 'Right Ring', hex: '#a855f7' },
  'right-pinky': { bg: 'bg-pink-500/15', border: 'border-pink-500/50', text: 'text-pink-400', label: 'Right Pinky', hex: '#ec4899' },
  'thumb': { bg: 'bg-indigo-500/15', border: 'border-indigo-500/50', text: 'text-indigo-400', label: 'Thumb (Space)', hex: '#6366f1' },
  'left-thumb': { bg: 'bg-indigo-500/15', border: 'border-indigo-500/50', text: 'text-indigo-400', label: 'Left Thumb', hex: '#6366f1' },
  'right-thumb': { bg: 'bg-indigo-500/15', border: 'border-indigo-500/50', text: 'text-indigo-400', label: 'Right Thumb', hex: '#6366f1' }
};

export function getFingerForKey(char) {
  if (!char) return null;
  if (char === ' ') return { finger: 'thumb', label: 'Thumb (Left/Right)', keyName: 'Spacebar' };

  const lower = char.toLowerCase();
  for (const row of KEYBOARD_LAYOUT) {
    for (const k of row) {
      if (k.key.toLowerCase() === lower || k.shiftKey === char) {
        const fingerInfo = FINGER_COLORS[k.finger] || { label: 'Finger', hex: '#64748b' };
        return {
          finger: k.finger,
          label: fingerInfo.label,
          hex: fingerInfo.hex,
          keyName: char === ' ' ? 'Spacebar' : char,
          requiresShift: k.shiftKey === char
        };
      }
    }
  }
  return { finger: 'thumb', label: 'Finger', hex: '#64748b', keyName: char };
}
