/* =========================================================================
   FFNames.pro — Symbols Library + FAQs
   All non-ASCII symbols are built from numeric codepoints (C / R helpers)
   so the data stays copy-safe and garbage-free. Pure data, no DOM access.
   ========================================================================= */
"use strict";

/* Build a string from unicode codepoints, or a range of single chars */
const C = function () { return String.fromCodePoint.apply(String, arguments); };
const R = function (a, b) {
  const r = [];
  for (let i = a; i <= b; i++) r.push(String.fromCodePoint(i));
  return r;
};

const FF_SYMBOL_GROUPS = [

  /* Literal unicode escapes - the exact glyphs proven to render in Free Fire */
  { id:"popular", label:"Most Popular in FF", emoji:"\U0001F525",
    syms:[ "\uA9C1", "\u0F12", "\uA9C2", "\u0F3A", "\u0F3B", "\u1B44", "\u0FD0",
           "\uFE3B\u30C7\u2550\u2501\u4E00", "\u00D7\u035C\u00D7", "\u30C4",
           "\u4E97", "\u5F61", "\u3024", "\u1770", "\u3005", "\u32DB", "\u00A4",
           "\u269A", "\u2726", "\u2727", "\u2726\u0301", "\u2605\u0301", "\u203F",
           "\u3061", "\u3063", "\u3066", "\u273F", "\u2602", "\u271A", "\u26A1",
           "\uA9C1\u0F12", "\u0F12\uA9C2", "\u1B44\u0FD0", "\u0F3A\u203F\u0F3B" ] },

  { id:"stars", label:"Stars & Sparkles", emoji:"\u2728",
    syms:[].concat( R(9733,9734), R(10022,10026), R(10032,10038), R(10042,10045),
           R(10050,10055), [ C(8857), C(8270), C(8258), C(8259), C(8260), C(8273),
           C(176), C(8226), C(176,733) ] ) },

  { id:"crowns", label:"Crowns & Royalty", emoji:"\U0001F451",
    syms:[].concat( R(9812,9823), [ C(9819,10003), C(9818,8255), C(43457,3858),
           C(10016), C(9769), C(10087,6980), C(8482) ] ) },

  { id:"brackets", label:"Brackets & Frames", emoji:"\U0001F532",
    syms:[].concat( [ C(43457), C(43458), C(3898), C(3899) ], R(10098,10099),
           R(10216,10217), R(10218,10219), R(10627,10631),
           [ C(12300), C(12301), C(12302), C(12303), C(12304), C(12305),
             C(12308), C(12309), C(12310), C(12311), C(12298), C(12299),
             C(12296), C(12297), C(4072), C(4073), C(4096), C(4097) ], R(8968,8971) ) },

  { id:"arrows", label:"Arrows & Directions", emoji:"\u27A1",
    syms:[].concat( [ C(10148), C(10149), C(10150), C(10151), C(8594), C(8592),
           C(8593), C(8595), C(8596), C(8597), C(8644), C(8674), C(10175),
           C(10177), C(10524), C(10525), C(10179), C(10187), C(10579), C(10580),
           C(10230), C(10228), C(8690), C(8691), C(8652), C(8653), C(10501),
           C(10502), C(11013), C(11014), C(11015) ] ) },

  { id:"smileys", label:"Smileys & Faces", emoji:"\U0001F61C",
    syms:[ "\u30C4", "\u30C5", "\u30C3", "\u32DB", "\u30FE", "\u4E42", "\u30EC",
           "(T_T)","(x_x)","(+_+)","(-_-)","($_$)","(0_0)","(*_*)","(>_<)","(^_^)",
           "(o_-)","[o_0]","(._.)","(^_-)","(o.o)","(n_n)","(Q_Q)","(x.x)","(u.u)",
           "(o_O)","(O_o)","($.$)" ] },

  { id:"hearts", label:"Hearts & Love", emoji:"\u2764",
    syms:[].concat( [ C(9829), C(9825), C(10085), C(10067), C(10084), C(10086),
           C(10087), C(8734), C(10068), C(10069), C(10070), C(10071), C(10061),
           C(9829,6980), C(9825,6980), C(43457,9829), C(9829,43458) ] ) },

  { id:"crosses", label:"Crosses & Faith", emoji:"\u271D",
    syms:[].concat( R(10013,10016), [ C(10026), C(10027), C(10028), C(10018),
           C(8224), C(8225), C(9769), C(9768), C(9770), C(9764) ] ) },

  { id:"music", label:"Music & Notes", emoji:"\U0001F3B5",
    syms:[].concat( R(9833,9839), [ C(9835,9834), C(9834,9835), C(119070), C(119074) ] ) },

  { id:"lines", label:"Lines & Blocks", emoji:"\u25AE",
    syms:[].concat( R(9600,9607), R(9612,9619), R(9620,9623), R(9642,9643),
           [ C(9670), C(9671), C(9672), C(9673), C(9675), C(9679), C(9688),
             C(9689), C(8226) ], R(9684,9687), [ C(11035), C(11036) ] ) },

  { id:"greek", label:"Greek Letters", emoji:"\U0001F524",
    syms:[].concat( R(945,961), R(963,969), R(913,929), R(931,937) ) },

  { id:"latin", label:"Accented Letters", emoji:"\u00C3",
    syms:[].concat( R(224,229), R(230,231), R(232,235), R(236,239), [ C(241) ],
           R(242,246), [ C(248) ], R(249,252), [ C(253), C(255), C(339), C(223),
           C(240), C(254), C(208), C(198), C(338), C(197), C(216), C(196),
           C(214), C(220), C(7838) ] ) },

  { id:"currencies", label:"Currency Symbols", emoji:"\U0001F4B0",
    syms:[ C(36), C(162), C(163), C(164), C(165), C(8364), C(8377), C(8361),
           C(8381), C(8378), C(8363), C(8369), C(8372), C(8362), C(3633),
           C(8365), C(8370), C(8353), C(8373), C(8360), C(8354), C(8356),
           C(8369,6980), C(36,6980), C(43457,36), C(36,43458), C(8482) ] },

  { id:"weather", label:"Nature & Space", emoji:"\U0001F319",
    syms:[ C(9788), C(9789), C(9730), C(9731), C(9732), C(9790),
           C(9791), C(9793), C(9796), C(9797), C(9798), C(9799), C(9880),
           C(9818), C(10041), C(9885), C(9855), C(9742), C(9743), C(10048),
           C(10055), C(10069), C(9728), C(9729), C(9889), C(9900), C(9901) ] },

  { id:"chess", label:"Chess & Suits", emoji:"\u2660",
    syms:[].concat( R(9824,9831), [ C(9824,6980), C(9829,6980),
           C(9830,6980), C(9827,6980) ] ) },

  { id:"kaomoji", label:"Kaomoji Emoticons", emoji:"(\u25D5\u203F\u25D5)",
    syms:[
      C(40,12389,65507,32,179,32,179,65507,41,12389),
      C(175,92,95,40,12484,95,41,47,175),
      C(661,8226,7461,8226,660),
      C(3232,95,3232),
      C(40,32,865,176,32,860,662,32,865,176,41),
      C(40,8805,9697,8804,41),
      C(40,172,8255,172,41),
      C(40,7508,7461,7508,41),
      C(12542,40,8976,9632,95,9632,41,12494),
      C(40,10047,9696,8255,9696,41),
      C(40,8805,8711,8804,41),
      C(12387,728,969,728,962),
      C(40,9685,8255,9685,41),
      C(40,12399,8255,12399,41)
    ] },

  { id:"tiny", label:"Tiny & Sub Letters", emoji:"\u1D43\u1D47\u1D9C",
    syms:[].concat( R(8336,8348), [ C(7522), C(11388), C(7523), C(7524), C(7525) ] ) },

  { id:"numbers", label:"Stylish Numbers", emoji:"\u2463",
    syms:[].concat( R(9312,9331), R(10102,10111), [ C(8304), C(185), C(178), C(179) ],
           R(8308,8313), R(8320,8329), [ C(8320,8321), C(8321,8322) ] ) },

  { id:"weapons", label:"Weapons & Combat", emoji:"\u2694",
    syms:[ C(9876), C(9876,6980), C(43457,9876), C(9876,43458),
           C(65083,12487,9552,9473,19968), C(9552,9473,19968), C(19968,9473,9552),
           C(9600,65083,12487), C(9874), C(9881), C(9880), C(9878), C(9882),
           C(9935,6980), C(9874,6980), C(9876,9733) ] },

  { id:"blank", label:"Blank & Invisible", emoji:"\u2400",
    syms:[ C(12644), C(10240), C(8192), C(8193), C(8195), C(8199), C(8201),
           C(8202), C(8203), C(8239), C(8287), C(160), C(1161), C(6158) ],
    labels:{ } },

  { id:"weird", label:"Rare & Decorative", emoji:"\U0001F48E",
    syms:[].concat( [ C(486), C(294), C(407), C(308), C(310), C(321), C(327),
           C(490), C(420), C(346), C(354), C(437), C(8472), C(8476), C(8465),
           C(8501), C(8467), C(8487), C(8450), C(8461) ], R(9398,9407),
           [ C(12377), C(12378), C(12379), C(12380), C(12381), C(12382), C(12383) ] ) }
];

/* De-duplicate every group (safety net) */
FF_SYMBOL_GROUPS.forEach(function (g) {
  const seen = new Set();
  g.syms = g.syms.filter(function (s) { if (seen.has(s)) return false; seen.add(s); return true; });
});

/* Human labels for the blank/invisible group (keyed by the exact character) */
(function () {
  const g = FF_SYMBOL_GROUPS.find(function (x) { return x.id === "blank"; });
  const names = [
    "Hangul Filler U+3164 — the classic FF blank name",
    "Braille Pattern Blank U+2800",
    "En Quad Space U+2000",
    "Em Quad Space U+2001",
    "Em Space U+2003",
    "Figure Space U+2007",
    "Thin Space U+2009",
    "Hair Space U+200A",
    "Zero Width Space U+200B",
    "Narrow No-Break Space U+202F",
    "Medium Mathematical Space U+205F",
    "No-Break Space U+00A0",
    "Combining Cyrillic Thousands Sign — invisible overlay",
    "Mongolian Vowel Separator"
  ];
  g.syms.forEach(function (s, i) { g.labels[s] = names[i] || "Invisible space character"; });
})();

const FF_TOTAL_SYMBOLS = FF_SYMBOL_GROUPS.reduce(function (a, g) { return a + g.syms.length; }, 0);

/* ------------------------------------------------------------------ */
/* FAQS — rendered as accordions + FAQPage JSON-LD (kept in sync)      */
/* ------------------------------------------------------------------ */
const FF_FAQS = [
  { q:"How do I change my Free Fire name?",
    a:"Open Free Fire (or Free Fire MAX) and wait for the lobby to load. Tap your avatar in the top-left corner, then tap the small pencil (edit) icon next to your nickname. Clear the old name, paste the stylish name you copied from this site, and confirm. Your first rename is usually free; after that you need a Name Change Card or 390 diamonds." },
  { q:"How much does a name change cost in Free Fire?",
    a:"The first nickname change on a new account is free. After that, changing your name costs 390 diamonds or one Name Change Card. Cards can be bought in the store, bought cheaper in the Guild Store with guild tokens plus a small diamond amount, or earned free from events." },
  { q:"What is the Free Fire name character limit?",
    a:"Free Fire nicknames can be a maximum of 12 characters, and spaces, symbols and styled letters all count toward that limit. Every name card on this site shows its character count and flags names that go over 12 characters." },
  { q:"Can I use emojis in my Free Fire name?",
    a:"Most standard emoji (like 😀 or 🔥) are rejected or stripped by the Free Fire nickname filter. That is why stylish FF names use unicode symbols instead — ꧁ ༒ ツ ヅ ✿ ♛ — because these are real text characters, not emoji, and they pass the filter." },
  { q:"How do I make an invisible or blank Free Fire name?",
    a:"Open the Blank & Invisible section of our symbols library and copy the Hangul Filler character (U+3164). Paste it into the Free Fire rename box two or three times and confirm. The game accepts it because it is a real (invisible) unicode character. Blank names are popular but make you harder to identify in squads." },
  { q:"Are these names allowed? Will I get banned?",
    a:"Unicode symbols and styled letters are accepted by Free Fire and used by millions of players. What is NOT allowed: offensive words, hate speech, religious mockery, impersonating Garena staff and similar content — those can get your nickname reset or your account banned. Stick to clean names and you are safe." },
  { q:"Can two players have the same Free Fire name?",
    a:"Yes. Free Fire does not enforce unique nicknames across or within servers, so duplicates are allowed. Adding rare symbols to your name is the best way to stand out and make your version feel unique." },
  { q:"Why does my name show as Guest1234?",
    a:"Accounts that skip the initial nickname step get an auto-generated Guest name. You can replace it using the normal rename flow — the first change should be free, so pick a good stylish name and set it once." },
  { q:"How do I copy a name on my phone?",
    a:"Tap the Copy button on any name card — the name is copied to your clipboard instantly and a confirmation toast appears. Then long-press the rename field in Free Fire and choose Paste. On desktop, click Copy or manually select the text." },
  { q:"How do I change my guild name in Free Fire?",
    a:"Only the Guild Leader can rename a guild. Open the guild panel, tap the edit option next to the guild name, type the new name and confirm — it costs 500 gold (not diamonds). Check our Guild & Clan collection for ready-made guild names." },
  { q:"Do these symbols work in Free Fire MAX too?",
    a:"Yes. Free Fire and Free Fire MAX share the same account system and nickname engine, so every name and symbol on this site works identically in both versions of the game." },
  { q:"Is this Free Fire name generator free?",
    a:"100% free, with no login, no limits and no watermark. Generate unlimited stylish names, copy as many as you like, and use the heart button to shortlist your favourites before deciding." },
  { q:"How do I make my name stylish like YouTubers?",
    a:"Type your current gamertag into the generator and browse the 50+ instant styles. YouTubers typically combine a bold unicode font with a frame like ꧁༒•YourName•༒꧂ and a short tag like OP, FF or YT. Keep the total under 12 characters." },
  { q:"Where can I find individual symbols to build my own name?",
    a:"Visit our full symbols library — 500+ symbols in 20+ categories including crowns, stars, kaomoji, blank spaces and rare letters. Click any symbol to copy it and combine pieces to design your own nickname." }
];
