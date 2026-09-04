/* =========================================================================
   FFNames.pro — Data Engine
   Unicode fonts, decoration templates, curated name collections, word banks.
   Pure data + pure functions only. No DOM access in this file.
   ========================================================================= */
"use strict";

/* ------------------------------------------------------------------ */
/* 1. UNICODE FONT MAPS — each maps A-Z, a-z (and 0-9 where possible)  */
/* ------------------------------------------------------------------ */
const FF_FONT_MAPS = [
  { n: "Old English",
    m: { A:"𝔄",B:"𝔅",C:"ℭ",D:"𝔇",E:"𝔈",F:"𝔉",G:"𝔊",H:"ℌ",I:"ℑ",J:"𝔍",K:"𝔎",L:"𝔏",M:"𝔐",N:"𝔑",O:"𝔒",P:"𝔓",Q:"𝔔",R:"ℜ",S:"𝔖",T:"𝔗",U:"𝔘",V:"𝔙",W:"𝔚",X:"𝔛",Y:"𝔜",Z:"ℨ",
         a:"𝔞",b:"𝔟",c:"𝔠",d:"𝔡",e:"𝔢",f:"𝔣",g:"𝔤",h:"𝔥",i:"𝔦",j:"𝔧",k:"𝔨",l:"𝔩",m:"𝔪",n:"𝔫",o:"𝔬",p:"𝔭",q:"𝔮",r:"𝔯",s:"𝔰",t:"𝔱",u:"𝔲",v:"𝔳",w:"𝔴",x:"𝔵",y:"𝔶",z:"𝔷" } },
  { n: "Cursive",
    m: { A:"𝓐",B:"𝓑",C:"𝓒",D:"𝓓",E:"𝓔",F:"𝓕",G:"𝓖",H:"𝓗",I:"𝓘",J:"𝓙",K:"𝓚",L:"𝓛",M:"𝓜",N:"𝓝",O:"𝓞",P:"𝓟",Q:"𝓠",R:"𝓡",S:"𝓢",T:"𝓣",U:"𝓤",V:"𝓥",W:"𝓦",X:"𝓧",Y:"𝓨",Z:"𝓩",
         a:"𝓪",b:"𝓫",c:"𝓬",d:"𝓭",e:"𝓮",f:"𝓯",g:"𝓰",h:"𝓱",i:"𝓲",j:"𝓳",k:"𝓴",l:"𝓵",m:"𝓶",n:"𝓷",o:"𝓸",p:"𝓹",q:"𝓺",r:"𝓻",s:"𝓼",t:"𝓽",u:"𝓾",v:"𝓿",w:"𝔀",x:"𝔁",y:"𝔂",z:"𝔃" } },
  { n: "Script",
    m: { A:"𝒜",B:"ℬ",C:"𝒞",D:"𝒟",E:"ℰ",F:"ℱ",G:"𝒢",H:"ℋ",I:"ℐ",J:"𝒥",K:"𝒦",L:"ℒ",M:"ℳ",N:"𝒩",O:"𝒪",P:"𝒫",Q:"𝒬",R:"ℛ",S:"𝒮",T:"𝒯",U:"𝒰",V:"𝒱",W:"𝒲",X:"𝒳",Y:"𝒴",Z:"𝒵",
         a:"𝒶",b:"𝒷",c:"𝒸",d:"𝒹",e:"ℯ",f:"𝒻",g:"ℊ",h:"𝒽",i:"𝒾",j:"𝒿",k:"𝓀",l:"𝓁",m:"𝓂",n:"𝓃",o:"ℴ",p:"𝓅",q:"𝓆",r:"𝓇",s:"𝓈",t:"𝓉",u:"𝓊",v:"𝓋",w:"𝓌",x:"𝓍",y:"𝓎",z:"𝓏" } },
  { n: "Double Struck",
    m: { A:"𝔸",B:"𝔹",C:"ℂ",D:"𝔻",E:"𝔼",F:"𝔽",G:"𝔾",H:"ℍ",I:"𝕀",J:"𝕁",K:"𝕂",L:"𝕃",M:"𝕄",N:"ℕ",O:"𝕆",P:"ℙ",Q:"ℚ",R:"ℝ",S:"𝕊",T:"𝕋",U:"𝕌",V:"𝕍",W:"𝕎",X:"𝕏",Y:"𝕐",Z:"ℤ",
         a:"𝕒",b:"𝕓",c:"𝕔",d:"𝕕",e:"𝕖",f:"𝕗",g:"𝕘",h:"𝕙",i:"𝕚",j:"𝕛",k:"𝕜",l:"𝕝",m:"𝕞",n:"𝕟",o:"𝕠",p:"𝕡",q:"𝕢",r:"𝕣",s:"𝕤",t:"𝕥",u:"𝕦",v:"𝕧",w:"𝕨",x:"𝕩",y:"𝕪",z:"𝕫",
         "0":"𝟘","1":"𝟙","2":"𝟚","3":"𝟛","4":"𝟜","5":"𝟝","6":"𝟞","7":"𝟟","8":"𝟠","9":"𝟡" } },
  { n: "Monospace",
    m: { A:"𝙰",B:"𝙱",C:"𝙲",D:"𝙳",E:"𝙴",F:"𝙵",G:"𝙶",H:"𝙷",I:"𝙸",J:"𝙹",K:"𝙺",L:"𝙻",M:"𝙼",N:"𝙽",O:"𝙾",P:"𝙿",Q:"𝚀",R:"𝚁",S:"𝚂",T:"𝚃",U:"𝚄",V:"𝚅",W:"𝚆",X:"𝚇",Y:"𝚈",Z:"𝚉",
         a:"𝚊",b:"𝚋",c:"𝚌",d:"𝚍",e:"𝚎",f:"𝚏",g:"𝚐",h:"𝚑",i:"𝚒",j:"𝚓",k:"𝚔",l:"𝚕",m:"𝚖",n:"𝚗",o:"𝚘",p:"𝚙",q:"𝚚",r:"𝚛",s:"𝚜",t:"𝚝",u:"𝚞",v:"𝚟",w:"𝚠",x:"𝚡",y:"𝚢",z:"𝚣",
         "0":"𝟶","1":"𝟷","2":"𝟸","3":"𝟹","4":"𝟺","5":"𝟻","6":"𝟼","7":"𝟽","8":"𝟾","9":"𝟿" } },
  { n: "Bold Sans",
    m: { A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",
         a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇",
         "0":"𝟬","1":"𝟭","2":"𝟮","3":"𝟯","4":"𝟰","5":"𝟱","6":"𝟲","7":"𝟳","8":"𝟴","9":"𝟵" } },
  { n: "Italic Sans",
    m: { A:"𝘈",B:"𝘉",C:"𝘊",D:"𝘋",E:"𝘌",F:"𝘍",G:"𝘎",H:"𝘏",I:"𝘐",J:"𝘑",K:"𝘒",L:"𝘓",M:"𝘔",N:"𝘕",O:"𝘖",P:"𝘗",Q:"𝘘",R:"𝘙",S:"𝘚",T:"𝘛",U:"𝘜",V:"𝘝",W:"𝘞",X:"𝘟",Y:"𝘠",Z:"𝘡",
         a:"𝘢",b:"𝘣",c:"𝘤",d:"𝘥",e:"𝘦",f:"𝘧",g:"𝘨",h:"𝘩",i:"𝘪",j:"𝘫",k:"𝘬",l:"𝘭",m:"𝘮",n:"𝘯",o:"𝘰",p:"𝘱",q:"𝘲",r:"𝘳",s:"𝘴",t:"𝘵",u:"𝘶",v:"𝘷",w:"𝘸",x:"𝘹",y:"𝘺",z:"𝘻" } },
  { n: "Serif Bold",
    m: { A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
         a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
         "0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗" } },
  { n: "Serif Italic",
    m: { A:"𝐴",B:"𝐵",C:"𝐶",D:"𝐷",E:"𝐸",F:"𝐹",G:"𝐺",H:"𝐻",I:"𝐼",J:"𝐽",K:"𝐾",L:"𝐿",M:"𝑀",N:"𝑁",O:"𝑂",P:"𝑃",Q:"𝑄",R:"𝑅",S:"𝑆",T:"𝑇",U:"𝑈",V:"𝑉",W:"𝑊",X:"𝑋",Y:"𝑌",Z:"𝑍",
         a:"𝑎",b:"𝑏",c:"𝑐",d:"𝑑",e:"𝑒",f:"𝑓",g:"𝑔",h:"ℎ",i:"𝑖",j:"𝑗",k:"𝑘",l:"𝑙",m:"𝑚",n:"𝑛",o:"𝑜",p:"𝑝",q:"𝑞",r:"𝑟",s:"𝑠",t:"𝑡",u:"𝑢",v:"𝑣",w:"𝑤",x:"𝑥",y:"𝑦",z:"𝑧" } },
  { n: "Bold Italic",
    m: { A:"𝑨",B:"𝑩",C:"𝑪",D:"𝑫",E:"𝑬",F:"𝑭",G:"𝑮",H:"𝑯",I:"𝑰",J:"𝑱",K:"𝑲",L:"𝑳",M:"𝑴",N:"𝑵",O:"𝑶",P:"𝑷",Q:"𝑸",R:"𝑹",S:"𝑺",T:"𝑻",U:"𝑼",V:"𝑽",W:"𝑾",X:"𝑿",Y:"𝒀",Z:"𝒁",
         a:"𝒂",b:"𝒃",c:"𝒄",d:"𝒅",e:"𝒆",f:"𝒇",g:"𝒈",h:"𝒉",i:"𝒊",j:"𝒋",k:"𝒌",l:"𝒍",m:"𝒎",n:"𝒏",o:"𝒐",p:"𝒑",q:"𝒒",r:"𝒓",s:"𝒔",t:"𝒕",u:"𝒖",v:"𝒗",w:"𝒘",x:"𝒙",y:"𝒚",z:"𝒛" } },
  { n: "Bubble",
    m: { A:"Ⓐ",B:"Ⓑ",C:"Ⓒ",D:"Ⓓ",E:"Ⓔ",F:"Ⓕ",G:"Ⓖ",H:"Ⓗ",I:"Ⓘ",J:"Ⓙ",K:"Ⓚ",L:"Ⓛ",M:"Ⓜ",N:"Ⓝ",O:"Ⓞ",P:"Ⓟ",Q:"Ⓠ",R:"Ⓡ",S:"Ⓢ",T:"Ⓣ",U:"Ⓤ",V:"Ⓥ",W:"Ⓦ",X:"Ⓧ",Y:"Ⓨ",Z:"Ⓩ",
         a:"ⓐ",b:"ⓑ",c:"ⓒ",d:"ⓓ",e:"ⓔ",f:"ⓕ",g:"ⓖ",h:"ⓗ",i:"ⓘ",j:"ⓙ",k:"ⓚ",l:"ⓛ",m:"ⓜ",n:"ⓝ",o:"ⓞ",p:"ⓟ",q:"ⓠ",r:"ⓡ",s:"ⓢ",t:"ⓣ",u:"ⓤ",v:"ⓥ",w:"ⓦ",x:"ⓧ",y:"ⓨ",z:"ⓩ",
         "0":"⓿","1":"①","2":"②","3":"③","4":"④","5":"⑤","6":"⑥","7":"⑦","8":"⑧","9":"⑨" } },
  { n: "Squared",
    m: { A:"🄰",B:"🄱",C:"🄲",D:"🄳",E:"🄴",F:"🄵",G:"🄶",H:"🄷",I:"🄸",J:"🄹",K:"🄺",L:"🄻",M:"🄼",N:"🄽",O:"🄾",P:"🄿",Q:"🅀",R:"🅁",S:"🅂",T:"🅃",U:"🅄",V:"🅅",W:"🅆",X:"🅇",Y:"🅈",Z:"🅉",
         a:"🄰",b:"🄱",c:"🄲",d:"🄳",e:"🄴",f:"🄵",g:"🄶",h:"🄷",i:"🄸",j:"🄹",k:"🄺",l:"🄻",m:"🄼",n:"🄽",o:"🄾",p:"🄿",q:"🅀",r:"🅁",s:"🅂",t:"🅃",u:"🅄",v:"🅅",w:"🅆",x:"🅇",y:"🅈",z:"🅉" } },
  { n: "Small Caps",
    m: { A:"ᴀ",B:"ʙ",C:"ᴄ",D:"ᴅ",E:"ᴇ",F:"ꜰ",G:"ɢ",H:"ʜ",I:"ɪ",J:"ᴊ",K:"ᴋ",L:"ʟ",M:"ᴍ",N:"ɴ",O:"ᴏ",P:"ᴘ",Q:"ǫ",R:"ʀ",S:"s",T:"ᴛ",U:"ᴜ",V:"ᴠ",W:"ᴡ",X:"x",Y:"ʏ",Z:"ᴢ",
         a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ꜰ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ" } },
  { n: "Tiny",
    m: { A:"ᵃ",B:"ᵇ",C:"ᶜ",D:"ᵈ",E:"ᵉ",F:"ᶠ",G:"ᵍ",H:"ʰ",I:"ⁱ",J:"ʲ",K:"ᵏ",L:"ˡ",M:"ᵐ",N:"ⁿ",O:"ᵒ",P:"ᵖ",Q:"ᑫ",R:"ʳ",S:"ˢ",T:"ᵗ",U:"ᵘ",V:"ᵛ",W:"ʷ",X:"ˣ",Y:"ʸ",Z:"ᶻ",
         a:"ᵃ",b:"ᵇ",c:"ᶜ",d:"ᵈ",e:"ᵉ",f:"ᶠ",g:"ᵍ",h:"ʰ",i:"ⁱ",j:"ʲ",k:"ᵏ",l:"ˡ",m:"ᵐ",n:"ⁿ",o:"ᵒ",p:"ᵖ",q:"ᑫ",r:"ʳ",s:"ˢ",t:"ᵗ",u:"ᵘ",v:"ᵛ",w:"ʷ",x:"ˣ",y:"ʸ",z:"ᶻ" } }
];

/* ------------------------------------------------------------------ */
/* 2. DECORATION TEMPLATES — {t} is replaced by the converted name     */
/* ------------------------------------------------------------------ */
const FF_DECOR = [
  { n:"Royal Firewall", s:"꧁༒•{t}•༒꧂" },
  { n:"Classic Royale", s:"꧁༺{t}༻꧂" },
  { n:"Angelic Frame",  s:"꧁✞{t}✞꧂" },
  { n:"Skull Lord",     s:"꧁☠{t}☠꧂" },
  { n:"Flame Guard",    s:"꧁࿇{t}࿇꧂" },
  { n:"Guild Crest",    s:"꧁᭄{t}᭄꧂" },
  { n:"Aesthetic",      s:"༺{t}༻" },
  { n:"Sparkle Wrap",   s:"✿.｡.:*{t}*:.｡.✿" },
  { n:"Star Shower",    s:"☆*:.｡.o( {t} )o.｡.:*☆" },
  { n:"Neon Glow",      s:"✧･ﾟ: *{t}* :･ﾟ✧" },
  { n:"Sniper Rifle",   s:"▄︻デ{t}══━一" },
  { n:"Katakana Edge",  s:"ツ{t}ツ" },
  { n:"Smirk Tag",      s:"×͜×{t}" },
  { n:"Mark of Honor",  s:"亗{t}亗" },
  { n:"Ronin Dash",     s:"彡{t}彡" },
  { n:"Manga Title",    s:"『{t}』" },
  { n:"Zen Quote",      s:"「{t}」" },
  { n:"Legend Book",    s:"《{t}》" },
  { n:"Steel Case",     s:"【{t}】" },
  { n:"Soul Chain",     s:"丂{t}丂" },
  { n:"Godly Prefix",   s:"ᴳᵒᵈ༄{t}࿐" },
  { n:"Ind Boss",       s:"ᶦᶰᵈ᭄{t}᭄" },
  { n:"Cursive Bloom",  s:"✿᭄{t}࿐" },
  { n:"Twin Seals",     s:"༆{t}༆" },
  { n:"Warlord",        s:"☬{t}☬" },
  { n:"Demon Bond",     s:"༒᭄{t}᭄࿐" },
  { n:"Balinese Mark",  s:"᭄{t}᭄" },
  { n:"Meteor Trail",   s:"ミ★{t}★彡" },
  { n:"Star Lord",      s:"★彡{t}彡★" },
  { n:"Ghost Cross",    s:"〤{t}〤" },
  { n:"Night Wing",     s:"ᝰ{t}ᝰ" },
  { n:"Cute Kaomoji",   s:"(◍•ᴗ•◍){t}" },
  { n:"Old Ribbon",     s:"(¯`·.¸¸.·´¯`·.¸{t}¸.·´¯`·.¸¸.·´¯)" },
  { n:"Full Wave",      s:",.-~*´¨¯¨`*·~-.¸-({t}),.-~*´¨¯¨`*·~-.¸" },
  { n:"Deep Bar",       s:"°¯°·.¸.·´¯`·.¸{t}¸.·´¯`·.¸.·°¯°" },
  { n:"Tournament",     s:"༼{t}༽" },
  { n:"Heartbeat",      s:"ღ{t}ღ" },
  { n:"Crimson Heart",  s:"♥{t}♥" },
  { n:"Kingdom",        s:"♛{t}♛" },
  { n:"Toxic Vibe",     s:"☠꧁{t}꧂☠" }
];

/* Every style the generator can produce: 14 fonts + 40 decorations = 54 */
const FF_STYLES = [].concat(
  FF_FONT_MAPS.map(function (f) { return { n: f.n, s: "{t}", f: f.m }; }),
  FF_DECOR
);

const FF_STYLE_BY_NAME = {};
FF_STYLES.forEach(function (s) { FF_STYLE_BY_NAME[s.n] = s; });

/* Apply a unicode font map to arbitrary text (unknown chars pass through) */
function ffApplyFont(map, text) {
  let out = "";
  for (const ch of String(text)) {
    out += (map && Object.prototype.hasOwnProperty.call(map, ch)) ? map[ch] : ch;
  }
  return out;
}

/* Build one styled nickname from a style object + raw name */
function ffRenderStyle(style, name) {
  const base = style.f ? ffApplyFont(style.f, name) : name;
  return style.s.split("{t}").join(base);
}

/* Character count (Free Fire allows a maximum of 12 characters) */
function ffCharCount(str) { return Array.from(String(str)).length; }

/*
 * Collection builder: decorate a list of clean base names with a cycling
 * set of style templates. Guarantees every published name is well-formed.
 */
function ffBuildNames(bases, plans, repeat) {
  const reps = repeat || 1;
  const out = [];
  for (let r = 0; r < reps; r++) {
    bases.forEach(function (b, i) {
      const st = FF_STYLE_BY_NAME[plans[(i + r) % plans.length]];
      out.push(st ? ffRenderStyle(st, b) : b);
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 3. WORD BANKS for random name generation                            */
/* ------------------------------------------------------------------ */
const FF_RANDOM_WORDS = [
  "Shadow","Legend","Sniper","Phantom","Rebel","Venom","Blaze","Viper","Storm","Titan",
  "Hunter","Toxic","Rogue","Falcon","Demon","Slayer","Bandit","Savage","Frost","Nova",
  "Ghost","Rex","Beast","Warden","Rampage","Bullet","Cyber","Dark","Alpha","Hades"
];
const FF_RANDOM_TAGS = ["OP","FF","YT","007","69","99","47","X","1v4","AIM","PRO","GOD","ZERO","26"];

function ffRandomName() {
  const w = FF_RANDOM_WORDS[Math.floor(Math.random() * FF_RANDOM_WORDS.length)];
  if (Math.random() < 0.35) return w;
  const t = FF_RANDOM_TAGS[Math.floor(Math.random() * FF_RANDOM_TAGS.length)];
  return Math.random() < 0.5 ? w + t : t + w;
}

/* ------------------------------------------------------------------ */
/* 4. CURATED NAME COLLECTIONS (800+)                                  */
/* ------------------------------------------------------------------ */
const FF_NAME_COLLECTIONS = [

  { id:"stylish", label:"Stylish", emoji:"👑",
    blurb:"The most-wanted stylish Free Fire names — fancy unicode fonts, royal frames and premium symbols.",
    extra:[
      "꧁༒☬Ꮪhα∂σw☬༒꧂","꧁༺𝕯𝖆𝖗𝖐 𝕶𝖎𝖓𝖌༻꧂","༺ᴅᴇᴀᴅsʜᴏᴏᴛᴇʀ࿐","꧁☆𝕻𝖍𝖆𝖓𝖙𝖔𝖒☆꧂","꧁༒ⓋⒺⓃⓄⓂ༒꧂",
      "彡[ᴏᴘ]ʜᴜɴᴛᴇʀ彡","『sᴛᴀʀʟᴏʀᴅ』","꧁✞ᴠᴇɴᴏᴍ✞꧂","꧁☠sᴜʟᴛᴀɴ☠꧂","ツᴍᴏɴsᴛᴇʀツ",
      "×͜× ᴍʀ.ʟᴇɢᴇɴᴅ","꧁༺ֆɦǟʍɛֆֆ༻꧂"
    ],
    bases:["Shadow","Dark King","Dead Shooter","Phantom","Star Boy","Venom","Sultan","Lucifer","Prodigy","Monster","Joker","Mr Legend","Bloodthirsty","Deathwish","Zombie","Supreme","Psycho","Fatal","Hacker","Sniper King"],
    plans:["Royal Firewall","Classic Royale","Aesthetic","Skull Lord","Flame Guard","Katakana Edge","Smirk Tag","Manga Title","Star Lord","Steel Case"],
    repeat:2 },

  { id:"boys", label:"Boys", emoji:"🎮",
    blurb:"Stylish Free Fire names for boys — Indian and global names decorated with the coolest symbols.",
    bases:["Vikram","Aryan","Rohit","Karan","Soham","Dev Joshi","Akash","Kabir","Ayan","Vivek","Max","David","Jack","Omar","Daniel","Kai","Lucas","Lionel","Leo","Arman","Jaydeep","Krish","Ayush","Mohit","Rahul","Samuel","Ethan","Noah"],
    plans:["Ind Boss","Balinese Mark","Zen Quote","Ronin Dash","Katakana Edge","Mark of Honor","Steel Case","Meteor Trail"],
    repeat:1 },

  { id:"girls", label:"Girls", emoji:"🌸",
    blurb:"Cute and stylish Free Fire names for girls — princess frames, hearts and soft aesthetics.",
    bases:["Queen","Angel","Kajal","Priya","Snow Queen","Kiran","Anny","Riya","Mahi","Divya","Sunayna","Cute Girl","Dimple Queen","Baby Doll","Princess","Maya","Sofia","Angel Eyes","Mia","Zoe","Maria","Valeria","Emily","Olivia"],
    plans:["Sparkle Wrap","Heartbeat","Classic Royale","Star Shower","Cursive Bloom","Aesthetic","Neon Glow","Tournament"],
    repeat:2 },

  { id:"cool", label:"Cool", emoji:"😎",
    blurb:"Cool Free Fire names that make your profile stand out in every lobby.",
    bases:["Cool Boy","Dark Knight","Reaper","OP Killer","Black Panther","Icy Ghost","War Machine","Silver Wolf","Mr Cool","Zero Degree","Predator","Laser Beam","Falcon","Destroyer","White Mamba","Overlord","Vortex"],
    plans:["Star Lord","Katakana Edge","Aesthetic","Royal Firewall","Meteor Trail","Ronin Dash","Smirk Tag","Old English"],
    repeat:2 },

  { id:"pro", label:"Pro Players", emoji:"🎯",
    blurb:"Pro-level Free Fire names for esports lovers — aim masters, clutch kings and MVPs.",
    bases:["Pro Player","Top Gun","Aim Master","Headshot King","MVP","Clutch King","Moveset","Hyper Sense","Skywalker","Glock Master","Head Hunter","Toxic Aim","Perfect Shot","Goat","One Tap","Drag Head","Quick Scope","Kill Log","Mr Clutch","Razor","Magic Shot","Squad Leader","One Man Army","Point Blank","World Final"],
    plans:["Royal Firewall","Steel Case","Star Lord","Manga Title","Katakana Edge","Smirk Tag"],
    repeat:1 },

  { id:"attitude", label:"Attitude", emoji:"😈",
    blurb:"High-attitude Free Fire names for players who let their gameplay do the talking.",
    bases:["Attitude","King Of War","Dark Humour","Mr Rude","Madness","Killer Vibe","Arrogant","Broken Boss","Confident","King Mind","Mr Poison","Just Win","Self Made","Dominator","Ruthless","Kaiser","Mr Ignore","Notorious","Vengeance","Psycho Mind","Bad Boy","Mobster","Win Or Die","Don","Rebel Heart"],
    plans:["Skull Lord","Classic Royale","Smirk Tag","Tournament","Demon Bond","Ghost Cross","Night Wing","Kingdom"],
    repeat:1 },

  { id:"cute", label:"Cute", emoji:"🧸",
    blurb:"Soft, sweet and cute Free Fire names with hearts, sparkles and kaomoji.",
    bases:["Cute Boy","Sweety","Cuddly Bear","Little Muffin","Sugar Ball","Panda Boy","Honey Bunny","Cute Killer","Kitty","Candy","Minnie","Bubbles","Cutie Pie","Choco Boy","Jelly Bean","Strawberry","Lil Dove","Teddy Girl","Sugar Plum","Buttercup","Cupcake","Sunshine","Lil Moon","Honey Pie","Cherry Bomb","Baby Bear"],
    plans:["Sparkle Wrap","Heartbeat","Cute Kaomoji","Cursive Bloom","Star Shower","Bubble","Cursive","Tournament"],
    repeat:2 },

  { id:"funny", label:"Funny", emoji:"😂",
    blurb:"Hilarious Free Fire names that make the whole squad laugh before the match even starts.",
    bases:["Mr Noob","Mamas Boy","Potato Aim","Camper King","Glock Farmer","Lag Lord","Ping Master","DC Raja","WiFi Killer","Laggy","Zero Health","Joker No 1","Meme Lord","Chai Wala","Funny Bones","Comedy King","Haha Boy","Tomato Boy","Chotu Dada","Pancake Man","Lol King","Broken Screen","Sleepy Slayer","Free Loot","Clutch Or Kick","Oops I Win","Happy Meal","Silly Goose","Lucky Noob"],
    plans:["Katakana Edge","Smirk Tag","Zen Quote","Steel Case","Royal Firewall","Squared"],
    repeat:1 },

  { id:"silent", label:"Silent", emoji:"🤫",
    blurb:"Silent-killer Free Fire names — quiet, calm and deadly.",
    bases:["Silent","Silent But Deadly","Silent Wolf","Silent Boy","Mute Killer","Quiet Storm","Whisper","Silent Sniper","Zero Words","Secret Squad","No Reply","Silent Raja","Sleep Mode","Hush Boy","Voiceless","Silent Death","Silent Moon","Zip It","Quiet Boy","Zen Kill","Ghost Mode","Invisible"],
    plans:["Aesthetic","Night Wing","Zen Quote","Ghost Cross","Meteor Trail"],
    repeat:1 },

  { id:"devil", label:"Devil", emoji:"👹",
    blurb:"Dark and devilish Free Fire names for fearsome players.",
    bases:["Devil","Devil Eyes","Demon Lord","Devil Inside","Hell Boy","Demonic","Darkest","Devil Boy","Dark Devil","Demon Soul","Mephisto","Evil Grin","Evil Dead","Devilish","Devil King","Hell Raiser","Ash Devil","Dark Lord","Evil Twin","Sinister","Hell Born"],
    plans:["Skull Lord","Toxic Vibe","Royal Firewall","Demon Bond","Warlord","Ghost Cross"],
    repeat:1 },

  { id:"angel", label:"Angel", emoji:"😇",
    blurb:"Angel-themed Free Fire names — pure, divine and elegant.",
    bases:["Angel","Dark Angel","Guardian","Angel Eyes","Sweet Angel","Angel Boy","Seraph","Fallen Angel","Divine","Cherub","Halo","Star Angel","Wings","Archangel","Silver Wings","Cloud 9","Angel Vibe","Moon Angel","Sky Guard","Sinless","Angel Heart"],
    plans:["Angelic Frame","Classic Royale","Sparkle Wrap","Aesthetic","Cursive","Tournament"],
    repeat:1 },

  { id:"royal", label:"Royal", emoji:"🤴",
    blurb:"Royal Free Fire names — kings, queens, emperors and sultans with majestic frames.",
    bases:["King","Queen","Prince","Princess","Emperor","Maharaja","Sultan","Raajkumar","Badshah","Shahzada","Malik","King Zone","Royalty","Crown King","Dynasty","Golden Crown","Throne King","Monarch","Caesar","Royal Guard"],
    plans:["Royal Firewall","Kingdom","Classic Royale","Star Lord","Warlord","Flame Guard"],
    repeat:1 },

  { id:"mythical", label:"Mythical", emoji:"🐉",
    blurb:"Legendary creatures and mythological Free Fire names — dragons, gods and monsters.",
    bases:["Dragon","Griffin","Phoenix","Kraken","Hydra","Minotaur","Zeus","Thor","Loki","Hades","Poseidon","Atlas","Titan","Cerberus","Medusa","Werewolf","Mermaid","Unicorn","Wizard","Sorcerer","Golem","Leviathan","Odin","Anubis","Chimera"],
    plans:["Royal Firewall","Star Lord","Katakana Edge","Flame Guard","Old English","Bold Italic"],
    repeat:2 },

  { id:"oneword", label:"One Word", emoji:"⚡",
    blurb:"Short and punchy one-word Free Fire names — easy to remember, hard to forget.",
    bases:["Bullet","Venom","Toxic","Savage","Rage","Fury","Storm","Blaze","Frost","Vortex","Pulse","Reaper","Havoc","Mayhem","Kaos","Karma","Nebula","Comet","Eclipse","Ember","Smoke","Scorpio","Fang","Claw","Stinger","Zen","Drako","Vega","Rift"],
    plans:["Smirk Tag","Katakana Edge","Star Lord","Zen Quote","Mark of Honor","Small Caps","Ronin Dash","Meteor Trail"],
    repeat:2 },

  { id:"twoletter", label:"Two Letters", emoji:"🔤",
    blurb:"Two-letter tag Free Fire names — minimal, clean and pro looking.",
    bases:["OP","XP","GX","RX","VX","XO","XD","DK","CJ","JC","AJ","RJ","KD","MK","DM","HG","SK","VK","ZK","TK","BK","AK","HK","JP","PK"],
    plans:["Smirk Tag","Balinese Mark","Zen Quote","Steel Case"],
    repeat:1 },

  { id:"guild", label:"Guild & Clan", emoji:"🛡️",
    blurb:"Powerful Free Fire guild and clan names — lead your squad with a real identity.",
    bases:["Titans","Deadz","Goats","Killerz","Sniperz","Wolves","Phantomz","Royalz","Legends","Rebels","Viperz","Toxics","Demons","Monsterz","Flames","Beasts","Shadows","Undeads","Angels","Warriorz","Kingdoms","Empirez","Dragonz","Phoenixz","Opz","Thunder Brigade","Steel Legion"],
    plans:["Guild Crest","Manga Title","Steel Case","Tournament"],
    repeat:1 },

  { id:"trendy", label:"Trending", emoji:"📈",
    blurb:"Trending Free Fire names right now — what the community is using this season.",
    bases:["Sigma","Mr Rizzler","Hype King","Viral","OP Vibes","Skibidi","Megamind","Mr Meme","Optic Killer","Vortex OP","Slay Boy","Iconic","Main Character","Prime King","Zen Mode","Cryo God","Draco","Shinobi","Kaizen","Sparta","Grim OP","Moon Knight","Duck King"],
    plans:["Balinese Mark","Smirk Tag","Star Lord","Royal Firewall","Katakana Edge","Neon Glow"],
    repeat:1 },

  { id:"newyear", label:"New Year 2026", emoji:"🎉",
    blurb:"Fresh New Year 2026 Free Fire names — start the season with a brand-new identity.",
    bases:["2K26 King","2026 King","NY 2026","2026 Legend","Newera 2026","Fresh 2026","2026 Killer","Year Of Op","2K26 Queen","Day One 2026","2K26 Rush","Happy 2026","2K26 Dream","2026 Goat","26 Op","2K26 Fire","2K26 Vibe","2026 Crown"],
    plans:["Star Shower","Royal Firewall","Smirk Tag","Star Lord","Katakana Edge","Neon Glow"],
    repeat:1 },

  { id:"legend", label:"Legends", emoji:"🏆",
    blurb:"Legend-status Free Fire names for players who carry every match.",
    bases:["Legend","Living Legend","Legend 2026","Undefeated","Legendary","OP Legend","Legend Hero","Mythical","Immortal","Eternal","Hall Of Fame","The Goat","Legend King","Iconic Legend","Unstoppable","Dominant","Final Boss","History Maker"],
    plans:["Royal Firewall","Star Lord","Kingdom","Classic Royale","Bold Italic","Steel Case"],
    repeat:1 },

  { id:"badass", label:"Badass", emoji:"🔥",
    blurb:"Badass Free Fire names with serious intimidation factor.",
    bases:["Killer Instinct","Bounty Hunter","Death Chase","Merciless","Bone Crusher","Iron Wall","Flesh Ripper","Grim King","Rage Venge","Head Basher","Mad Wolf","Venom Strike","Killer King","Soul Reaper","Tormentor","Dark Venge","War Beast","Pain Bringer"],
    plans:["Skull Lord","Toxic Vibe","Warlord","Demon Bond","Ghost Cross","Deep Bar"],
    repeat:1 },

  { id:"aesthetic", label:"Aesthetic", emoji:"🌙",
    blurb:"Soft aesthetic Free Fire names — moons, skies and dreamy vibes.",
    bases:["Moonlight","Stardust","Cherry Rain","Midnight","Lavender","Ocean Vibe","Pink Skies","Moon Gate","Sunset","Soft Rain","Cloudy Day","Pastel","Rose Queen","Vintage","Serendipity","Starry Night","Dreamcatcher","Golden Hour","Moonchild","Silk Sky","Peach Moon","Quiet Sky","Vapor Wave","Snow Flower","Milky Way"],
    plans:["Sparkle Wrap","Aesthetic","Neon Glow","Star Shower","Zen Quote","Cursive","Heartbeat"],
    repeat:2 },

  { id:"lover", label:"Lovers", emoji:"💞",
    blurb:"Romantic Free Fire names for couples and hopeless romantics.",
    bases:["Lover Boy","Romeo","Juliet","Lovebird","Heart Thief","Lovesick","Cupid","My Queen","My King","Heart Winner","Love Monster","Soulmate","Sweetheart","First Love","Flirt King","Romantic","Hearts Fire","Mad Love","True Love","Goal Couple","Spark Love"],
    plans:["Heartbeat","Crimson Heart","Cursive Bloom","Tournament","Classic Royale","Sparkle Wrap"],
    repeat:1 },

  { id:"noob", label:"Noob & Fun", emoji:"🐣",
    blurb:"Self-aware funny noob Free Fire names — because confidence is everything.",
    bases:["Noob","Mr Noob","Noob Queen","Pro Noob","Noob Slayer","Noob King","Noob Boss","Noob Master","Brave Noob","Noob Luck","King Noob","OP Noob","Smart Noob","Noob God","Noob Hero","Noob Power","Noob Squad","Gun Noob","Noob Style"],
    plans:["Star Shower","Smirk Tag","Katakana Edge","Steel Case","Squared","Bubble"],
    repeat:1 },

  { id:"alone", label:"Alone & Sad", emoji:"💔",
    blurb:"Alone, broken-hearted and sad aesthetic Free Fire names for moody profiles.",
    bases:["Alone Boy","Lonely","Broken Dream","Distant","Sad Boy","Alone Fighter","Hurt","Teardrops","Quiet Pain","Loner","No Bestie","Void","Silent Tears","Faded","Alone Killer","Lost Boy","Empty Heart","Sad Soul","Moonless Night","Hollow"],
    plans:["Aesthetic","Night Wing","Ghost Cross","Zen Quote","Smirk Tag","Deep Bar"],
    repeat:1 },

  { id:"yourname", label:"Your Name Style", emoji:"✍️",
    blurb:"See how YOUR name looks in Free Fire styles — swap in your own name and copy.",
    bases:["Akash","Jatin","Rohit","Kavita","Aryan","Sara","Daniyal","Maria","Aman","Nadia","Zeeshan","Ayesha","Harry","Simran","Farhan","Priyanka","Sam","Riya","Bilal","Alina","Adnan","Tabassum","Imran","Kiran","Wahed","Shiza","Azhar","Armaan"],
    plans:["Balinese Mark","Katakana Edge","Star Lord","Heartbeat","Smirk Tag","Mark of Honor"],
    repeat:2 },

  { id:"couple", label:"Cute Couples", emoji:"👫",
    blurb:"Matching Free Fire names for couples who drop into Bermuda together.",
    bases:["King Queen","Raja Rani","He She","Lion Lioness","Ghost Shadow","Soldier Princess","Killer Healer","Venom Antidote","Mafia Doll","Sniper Scout","Dark Light","Angel Devil","Moon Star","Coffee Smile","Winter Summer","Cloud Sky","Tea Cookie","Boss Banter","Rain Sky","Sun Moon"],
    plans:["Heartbeat","Crimson Heart","Tournament","Aesthetic"],
    repeat:1 },

  { id:"rare", label:"Rare Symbols", emoji:"💎",
    blurb:"Rare-symbol Free Fire names using exotic unicode letters most players have never seen.",
    extra:[
      "Ǥᴀᴍᴇʀ","Ħᴜɴᴛᴇʀ","Ɨᴄʏ","Ĵᴏᴋᴇʀ","Ķɪʟʟᴇʀ","Łᴏᴠᴇʀ","Ňɪɴᴊᴀ","Ƥᴀɴᴅᴀ","Śʜᴀᴅᴏᴡ","Ƶᴏᴍʙɪᴇ",
      "Ᏸᴏss","Ꮭᴏʀᴅ","Ꭾʀᴏ","Ꮥɴɪᴘᴇʀ","Ꮭᴜᴄᴋʏ","Ᏸᴜʟʟᴇᴛ","Ᏸᴇᴀsᴛ","Ꭰᴇᴍᴏɴ","Ᏸʀᴏᴋᴇɴ","Ꭾʜᴀɴᴛᴏᴍ",
      "Ꮥᴀᴠᴀɢᴇ","Ᏸᴀᴅ ɢᴜʏ","꧁Ǥᴀᴍᴇʀ꧂","×͜× Ħᴜɴᴛᴇʀ","『Ňɪɴᴊᴀ』","★Ķɪʟʟᴇʀ★","彡Ꭰᴇᴍᴏɴ彡","☬Ƥᴀɴᴅᴀ☬"
    ],
    bases:[],
    plans:[],
    repeat:0 },

  { id:"viral", label:"Viral Mix", emoji:"🦠",
    blurb:"Viral and community-favourite Free Fire names making rounds on social media.",
    bases:["Flex","Drip King","Swag","Baller","Moody Boss","Glowking","Dripz","Vibe King","Style God","Fashion King","Trendsetter","Limelight","Fame Gaming","Classy","Golden Boy","Sugar Gang","Vip Only","Vip Vibe","Firstclass","Main Gamer"],
    plans:["Smirk Tag","Star Lord","Royal Firewall","Neon Glow","Katakana Edge","Meteor Trail"],
    repeat:2 }
];

/* Expand every collection into its final list of ready-to-copy names */
FF_NAME_COLLECTIONS.forEach(function (c) {
  c.names = (c.extra || []).concat(c.bases && c.bases.length ? ffBuildNames(c.bases, c.plans, c.repeat) : []);
});

/* Total published names (for the stats strip) */
const FF_TOTAL_NAMES = FF_NAME_COLLECTIONS.reduce(function (a, c) { return a + c.names.length; }, 0);
