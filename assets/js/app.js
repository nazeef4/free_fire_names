/* =========================================================================
   FFNames.pro — Application logic (generator, tabs, favorites, copy, nav)
   Depends on data.js + symbols-data.js being loaded first.
   ========================================================================= */
"use strict";

/* ---------------------------- tiny helpers ---------------------------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

/* ---------------------------- local storage --------------------------- */
var FFStore = {
  get: function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  },
  set: function (key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ }
  },
  favs: {
    all: function () { return FFStore.get("ff_favs", []); },
    has: function (n) { return FFStore.favs().length >= 0 && FFStore.favs().indexOf(n) > -1; },
    list: function () { return FFStore.get("ff_favs", []); },
    toggle: function (n) {
      var v = FFStore.get("ff_favs", []);
      var i = v.indexOf(n);
      if (i > -1) { v.splice(i, 1); } else { v.push(n); }
      FFStore.set("ff_favs", v);
      return i === -1; /* true if added */
    },
    clear: function () { FFStore.set("ff_favs", []); }
  }
};

/* -------------------------------- toast ------------------------------- */
var _toastTimer = null;
function showToast(msg) {
  var el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2000);
}

/* ------------------------------ clipboard ----------------------------- */
function copyText(text) {
  var done = function (ok) {
    if (ok) {
      var preview = text.length > 22 ? text.slice(0, 22) + "..." : text;
      showToast("Copied: " + preview);
    } else {
      showToast("Copy blocked by browser - long-press the name to copy it");
    }
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      function () { done(true); },
      function () { done(legacyCopy(text)); }
    );
  } else {
    done(legacyCopy(text));
  }
}
function legacyCopy(text) {
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) { return false; }
}

/* ----------------------------- name cards ----------------------------- */
function buildNameCard(name) {
  var card = document.createElement("div");
  card.className = "name-card anim-in notranslate";
  card.setAttribute("translate", "no");

  var txt = document.createElement("div");
  txt.className = "name-text notranslate";
  txt.setAttribute("translate", "no");
  txt.textContent = name;

  var len = ffCharCount(name);

  var row = document.createElement("div");
  row.className = "row";

  var copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "chip";
  copyBtn.innerHTML = "&#128203; Copy";
  copyBtn.setAttribute("aria-label", "Copy name " + name + " to clipboard");
  copyBtn.addEventListener("click", function () { copyText(name); });

  var favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "chip fav" + (FFStore.favs.list().indexOf(name) > -1 ? " active" : "");
  favBtn.innerHTML = "&#9829;";
  favBtn.title = "Save to favorites";
  favBtn.setAttribute("aria-label", "Save name " + name + " to favorites");
  favBtn.addEventListener("click", function () {
    var added = FFStore.favs.toggle(name);
    favBtn.classList.toggle("active", added);
    showToast(added ? "Added to favorites" : "Removed from favorites");
    if ($("#favModal").classList.contains("open")) renderFavorites();
  });

  var lenChip = document.createElement("span");
  lenChip.className = "chip len" + (len > 12 ? " over" : "");
  lenChip.title = len > 12 ? "Longer than the 12-character Free Fire limit" : "Fits the 12-character limit";
  lenChip.textContent = len + (len > 12 ? " chars (!)" : " chars");

  row.appendChild(copyBtn);
  row.appendChild(favBtn);
  row.appendChild(lenChip);
  card.appendChild(txt);
  card.appendChild(row);
  return card;
}

/* ----------------------------- generator ------------------------------ */
var genState = { pool: [], offset: 0, lastInput: null, lastDecor: null };
var activeNameDecor = "none";
var lastActiveClanInput = null;

var NAME_DECOR_FRAMES = [
  { id: "none", label: "Default (All)", prefix: "", suffix: "" },
  { id: "crown", label: "亗 亗", prefix: "亗 ", suffix: " 亗" },
  { id: "angel", label: "꧁ ꧂", prefix: "꧁", suffix: "꧂" },
  { id: "wings", label: "ঔৣ ৣঔ", prefix: "ঔৣ", suffix: "ৣঔ" },
  { id: "firewall", label: "꧁༒ ༒꧂", prefix: "꧁༒•", suffix: "•༒꧂" },
  { id: "stars", label: "★ ★", prefix: "★ ", suffix: " ★" },
  { id: "lightning", label: "⚡ ⚡", prefix: "⚡", suffix: "⚡" },
  { id: "corners", label: "『 』", prefix: "『", suffix: "』" },
  { id: "smirk", label: "×͜×", prefix: "×͜×", suffix: "" },
  { id: "diamonds", label: "◆ ◆", prefix: "◆", suffix: "◆" },
  { id: "skull", label: "☠ ☠", prefix: "☠", suffix: "☠" },
  { id: "flourish", label: "࿐", prefix: "", suffix: " ࿐" },
  { id: "pillar", label: "丨", prefix: "丨", suffix: "丨" },
  { id: "dots", label: "・ ・", prefix: "・", suffix: "・" },
  { id: "aesthetic", label: "༺ ༻", prefix: "༺", suffix: "༻" },
  { id: "sniper", label: "▄︻デ══━一", prefix: "▄︻デ", suffix: "══━一" }
];

function shuffled(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function renderGenerator(input) {
  var grid = $("#genGrid");
  if (!grid) return;
  var name = (input !== undefined && input !== null ? input : ($("#nameInput") ? $("#nameInput").value : "")).trim();

  if (!name) {
    grid.innerHTML = "";
    var note = document.createElement("div");
    note.className = "empty-note";
    note.style.gridColumn = "1 / -1";
    var curL = "en";
    try { curL = (localStorage.getItem("ff_lang") || "en").split("-")[0]; } catch (e) {}
    var curT = (typeof FF_I18N !== "undefined" && FF_I18N[curL]) ? FF_I18N[curL] : null;
    note.innerHTML = (curT && curT.emptyNote) ? curT.emptyNote : "Type your name above to see all stylish variations appear instantly - or hit <b>Random Name</b> to get ideas.";
    grid.appendChild(note);
    updateCharCount("");
    genState.lastInput = "";
    return;
  }

  var resetBtn = $("#decorResetBtn");
  if (resetBtn) {
    resetBtn.style.display = activeNameDecor !== "none" ? "inline-block" : "none";
  }

  var styleName = $("#styleSelect") ? $("#styleSelect").value : "";
  grid.innerHTML = "";

  if (activeNameDecor === "none") {
    var styles = FF_STYLES.filter(function (s) {
      if (!styleName || styleName === "all") return true;
      return s.n === styleName;
    });

    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      var out = ffRenderStyle(style, name);
      grid.appendChild(genCard(style, out));
    }
  } else {
    var frame = NAME_DECOR_FRAMES.find(function (f) { return f.id === activeNameDecor; }) || NAME_DECOR_FRAMES[1];
    var pfx = frame.prefix || "";
    var sfx = frame.suffix || "";

    var decoratedList = [];

    FF_FONT_MAPS.forEach(function (f) {
      if (!styleName || styleName === "all" || f.n === styleName) {
        var base = ffApplyFont(f.m, name);
        decoratedList.push({ n: f.n + " " + frame.label, out: pfx + base + sfx });
      }
    });

    if (!styleName || styleName === "all") {
      var sc = toClanSmallCaps(name);
      var cur = toClanFont("Cursive", name);
      var gothic = toClanFont("Old English", name);
      var ds = toClanFont("Double Struck", name);

      decoratedList.push({ n: "Dot Separator", out: pfx + "・" + sc + "・" + sfx });
      decoratedList.push({ n: "Slash Pillar", out: pfx + "丨" + cur + "丨" + sfx });
      decoratedList.push({ n: "Star Guard", out: "★ " + pfx + gothic + sfx + " ★" });
      decoratedList.push({ n: "Flourish Trail", out: pfx + ds + sfx + " ࿐" });
      decoratedList.push({ n: "Spaced Aesthetic", out: pfx + name.split("").join(" ") + sfx });
      decoratedList.push({ n: "Tiny Sub", out: pfx + toClanSuperscript(name) + sfx });
    }

    decoratedList.forEach(function (item) {
      grid.appendChild(genCard({ n: item.n }, item.out));
    });
  }

  var scrollWrap = $("#genScrollWrap");
  if (scrollWrap && (genState.lastInput !== name || genState.lastDecor !== activeNameDecor)) {
    scrollWrap.scrollTop = 0;
  }
  genState.lastInput = name;
  genState.lastDecor = activeNameDecor;

  updateCharCount(name);
}

function genCard(style, out) {
  var card = document.createElement("div");
  card.className = "gen-item anim-in notranslate";
  card.setAttribute("translate", "no");

  var label = document.createElement("div");
  label.className = "style-name notranslate";
  label.setAttribute("translate", "no");
  label.textContent = style.n;

  var txt = document.createElement("div");
  txt.className = "name-text notranslate";
  txt.setAttribute("translate", "no");
  txt.textContent = out;

  var len = ffCharCount(out);
  var row = document.createElement("div");
  row.className = "row";

  var copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "chip";
  copyBtn.innerHTML = "&#128203; Copy";
  copyBtn.setAttribute("aria-label", "Copy " + out);
  copyBtn.addEventListener("click", function () { copyText(out); });

  var favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "chip fav" + (FFStore.favs.list().indexOf(out) > -1 ? " active" : "");
  favBtn.innerHTML = "&#9829;";
  favBtn.title = "Save to favorites";
  favBtn.addEventListener("click", function () {
    var added = FFStore.favs.toggle(out);
    favBtn.classList.toggle("active", added);
    showToast(added ? "Added to favorites" : "Removed from favorites");
  });

  var lenChip = document.createElement("span");
  lenChip.className = "chip len" + (len > 12 ? " over" : "");
  lenChip.textContent = len + (len > 12 ? " (!)" : "");

  row.appendChild(copyBtn);
  row.appendChild(favBtn);
  row.appendChild(lenChip);

  card.appendChild(label);
  card.appendChild(txt);
  card.appendChild(row);
  return card;
}

function updateCharCount(name) {
  var el = $("#charCount");
  if (!el) return;
  var len = ffCharCount(name);
  if (!name) { el.innerHTML = "Free Fire limit: <b>12 characters</b> - symbols included"; return; }
  el.innerHTML = "Your name: <b" + (len > 12 ? " class='over'" : "") + ">" + len + " / 12 characters</b>";
}

var _genTimer = null;
function onGenInput() {
  var input = $("#nameInput");
  if (!input) return;
  clearTimeout(_genTimer);
  _genTimer = setTimeout(function () { renderGenerator(input.value); }, 140);
}

function fillStyleSelect() {
  var sel = $("#styleSelect");
  if (!sel) return;
  var optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "All styles (54)";
  sel.appendChild(optAll);
  FF_STYLES.forEach(function (s) {
    var o = document.createElement("option");
    o.value = s.n;
    o.textContent = s.n;
    sel.appendChild(o);
  });
  sel.addEventListener("change", function () {
    genState.lastInput = null;
    renderGenerator($("#nameInput").value);
  });
}

function insertSymbol(inputEl, sym) {
  if (!inputEl) return;
  inputEl.focus();

  var start = inputEl.selectionStart !== undefined ? inputEl.selectionStart : inputEl.value.length;
  var end = inputEl.selectionEnd !== undefined ? inputEl.selectionEnd : inputEl.value.length;
  var val = inputEl.value;

  if (start !== end) {
    var sel = val.substring(start, end);
    inputEl.value = val.substring(0, start) + sym + sel + (sym.length === 1 ? sym : "") + val.substring(end);
    var cursorAfter = start + sym.length + sel.length + (sym.length === 1 ? sym.length : 0);
    inputEl.setSelectionRange(cursorAfter, cursorAfter);
  } else {
    inputEl.value = val.substring(0, start) + sym + val.substring(end);
    var newPos = start + sym.length;
    inputEl.setSelectionRange(newPos, newPos);
  }

  inputEl.dispatchEvent(new Event("input", { bubbles: true }));
}

function initDecorAndSymbols() {
  var qList = $("#quickSymsList");
  var nameInput = $("#nameInput");
  if (qList && nameInput) {
    qList.addEventListener("click", function (e) {
      var btn = e.target.closest(".quick-sym-btn");
      if (!btn) return;
      var sym = btn.getAttribute("data-sym");
      if (sym) {
        insertSymbol(nameInput, sym);
      }
    });
  }

  var decorList = $("#genDecorList");
  if (decorList) {
    decorList.addEventListener("click", function (e) {
      var btn = e.target.closest(".gen-decor-btn");
      if (!btn) return;
      var decorId = btn.getAttribute("data-decor");
      if (!decorId) return;

      $$(".gen-decor-btn", decorList).forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");

      activeNameDecor = decorId;
      renderGenerator(nameInput ? nameInput.value : "");
    });
  }

  var resetBtn = $("#decorResetBtn");
  if (resetBtn && decorList) {
    resetBtn.addEventListener("click", function () {
      activeNameDecor = "none";
      $$(".gen-decor-btn", decorList).forEach(function (b) {
        var isNone = b.getAttribute("data-decor") === "none";
        b.classList.toggle("active", isNone);
        b.setAttribute("aria-checked", isNone ? "true" : "false");
      });
      renderGenerator(nameInput ? nameInput.value : "");
    });
  }

  var clanQList = $("#clanQuickSyms");
  var clanTagInput = $("#clanTagInput");
  var clanPlayerInput = $("#clanPlayerInput");
  if (clanTagInput) {
    clanTagInput.addEventListener("focus", function () { lastActiveClanInput = clanTagInput; });
  }
  if (clanPlayerInput) {
    clanPlayerInput.addEventListener("focus", function () { lastActiveClanInput = clanPlayerInput; });
  }
  if (clanQList) {
    clanQList.addEventListener("click", function (e) {
      var btn = e.target.closest(".quick-sym-btn");
      if (!btn) return;
      var sym = btn.getAttribute("data-sym");
      if (!sym) return;
      var targetInput = lastActiveClanInput || clanTagInput;
      if (targetInput) {
        insertSymbol(targetInput, sym);
      }
    });
  }
}

/* --------------------------- clan generator --------------------------- */
var CLAN_TAG_STYLES = [
  { id: "brackets-corner", label: "『 』", prefix: "『", suffix: "』" },
  { id: "brackets-square", label: "[ ]", prefix: "[", suffix: "]" },
  { id: "crown", label: "亗 亗", prefix: "亗 ", suffix: " 亗" },
  { id: "wings", label: "ঔৣ ৣঔ", prefix: "ঔৣ", suffix: "ৣঔ" },
  { id: "stars", label: "★ ★", prefix: "★ ", suffix: " ★" },
  { id: "super", label: "ˢᵘᵖᵉʳ", isSuper: true, prefix: "", suffix: "" },
  { id: "arrows", label: "» «", prefix: "»", suffix: "«" },
  { id: "diamonds", label: "◆ ◆", prefix: "◆", suffix: "◆" },
  { id: "lightning", label: "⚡ ⚡", prefix: "⚡", suffix: "⚡" },
  { id: "flourish", label: "࿐", prefix: "", suffix: "࿐" },
  { id: "slash", label: "丨", prefix: "", suffix: "丨" },
  { id: "cross", label: "× ×", prefix: "×", suffix: "×" },
  { id: "angel", label: "꧁ ꧂", prefix: "꧁", suffix: "꧂" },
  { id: "skull", label: "☠ ☠", prefix: "☠", suffix: "☠" }
];

var activeClanStyle = "brackets-corner";
var clanLastQuery = null;

var BOLD_SCRIPT_MAP = {
  A:"𝓐",B:"𝓑",C:"𝓒",D:"𝓓",E:"𝓔",F:"𝓕",G:"𝓖",H:"𝓗",I:"𝓘",J:"𝓙",K:"𝓚",L:"𝓛",M:"𝓜",N:"𝓝",O:"𝓞",P:"𝓟",Q:"𝓠",R:"𝓡",S:"𝓢",T:"𝓣",U:"𝓤",V:"𝓥",W:"𝓦",X:"𝓧",Y:"𝓨",Z:"𝓩",
  a:"𝒂",b:"𝒃",c:"𝒄",d:"𝒅",e:"𝒆",f:"𝒇",g:"𝒈",h:"𝒉",i:"𝒊",j:"𝒋",k:"𝒌",l:"𝒍",m:"𝒎",n:"𝒏",o:"𝒐",p:"𝒑",q:"𝒒",r:"𝒓",s:"𝒔",t:"𝒕",u:"𝒖",v:"𝒗",w:"𝒘",x:"𝒙",y:"𝒚",z:"𝒛"
};

var SCRIPT_MAP = {
  A:"𝒜",B:"ℬ",C:"𝒞",D:"𝒟",E:"ℰ",F:"ℱ",G:"𝒢",H:"ℋ",I:"ℐ",J:"𝒥",K:"𝒦",L:"ℒ",M:"ℳ",N:"𝒩",O:"𝒪",P:"𝒫",Q:"𝒬",R:"ℛ",S:"𝒮",T:"𝒯",U:"𝒰",V:"𝒱",W:"𝒲",X:"𝒳",Y:"𝒴",Z:"𝒵",
  a:"𝒶",b:"𝒷",c:"𝒸",d:"𝒹",e:"ℯ",f:"𝒻",g:"ℊ",h:"𝒽",i:"𝒾",j:"𝒿",k:"𝓀",l:"𝓁",m:"𝓂",n:"𝓃",o:"ℴ",p:"𝓅",q:"𝓆",r:"𝓇",s:"𝓈",t:"𝓉",u:"𝓊",v:"𝓋",w:"𝓌",x:"𝓍",y:"𝓎",z:"𝓏"
};

var GOTHIC_MAP = {
  A:"𝔄",B:"𝔅",C:"ℭ",D:"𝔇",E:"𝔈",F:"𝔉",G:"𝔊",H:"ℌ",I:"ℑ",J:"𝔍",K:"𝔎",L:"𝔏",M:"𝔐",N:"𝔑",O:"𝔒",P:"𝔓",Q:"𝔔",R:"ℜ",S:"𝔖",T:"𝔗",U:"𝔘",V:"𝔙",W:"𝔚",X:"𝔛",Y:"𝔜",Z:"ℨ",
  a:"𝔞",b:"𝔟",c:"𝔠",d:"𝔡",e:"𝔢",f:"𝔣",g:"𝔤",h:"𝔥",i:"𝔦",j:"𝔧",k:"𝔨",l:"𝔩",m:"𝔪",n:"𝔫",o:"𝔬",p:"𝔭",q:"𝔮",r:"𝔯",s:"𝔰",t:"𝔱",u:"𝔲",v:"𝔳",w:"𝔴",x:"𝔵",y:"𝔶",z:"𝔷"
};

var BOLD_GOTHIC_MAP = {
  A:"𝕬",B:"𝕭",C:"𝕮",D:"𝕯",E:"𝕰",F:"𝕱",G:"𝕲",H:"𝕳",I:"𝕴",J:"𝕵",K:"𝕶",L:"𝕷",M:"𝕸",N:"𝕹",O:"𝕺",P:"𝕻",Q:"𝕼",R:"𝕽",S:"𝕾",T:"𝕿",U:"𝖀",V:"𝖁",W:"𝖂",X:"𝖃",Y:"𝖄",Z:"𝖅",
  a:"𝖆",b:"𝖇",c:"𝖈",d:"𝖉",e:"𝖊",f:"𝖋",g:"𝖌",h:"𝖍",i:"𝖎",j:"𝖏",k:"𝖐",l:"𝖑",m:"𝖒",n:"𝖓",o:"𝖔",p:"𝖕",q:"𝖖",r:"𝖗",s:"𝖘",t:"𝖙",u:"𝖚",v:"𝖁",w:"𝖜",x:"𝖝",y:"𝖞",z:"𝖟"
};

var DOUBLE_STRUCK_MAP = {
  A:"𝔸",B:"𝔹",C:"ℂ",D:"𝔻",E:"𝔼",F:"𝔽",G:"𝔾",H:"ℍ",I:"𝕀",J:"𝕁",K:"𝕂",L:"𝕃",M:"𝕄",N:"ℕ",O:"𝕆",P:"ℙ",Q:"ℚ",R:"ℝ",S:"𝕊",T:"𝕋",U:"𝕌",V:"𝕍",W:"𝕎",X:"𝕏",Y:"𝕐",Z:"ℤ",
  a:"𝕒",b:"𝕓",c:"𝕔",d:"𝕕",e:"𝕖",f:"𝕗",g:"𝕘",h:"𝕙",i:"𝕚",j:"𝕛",k:"𝕜",l:"𝕝",m:"𝕞",n:"𝕟",o:"𝕠",p:"𝕡",q:"𝕢",r:"𝕣",s:"𝕤",t:"𝕥",u:"𝕦",v:"𝕧",w:"𝕨",x:"𝕩",y:"𝕪",z:"𝕫",
  "0":"𝟘","1":"𝟙","2":"𝟚","3":"𝟛","4":"𝟜","5":"𝟝","6":"𝟞","7":"𝟟","8":"𝟠","9":"𝟡"
};

var MONOSPACE_MAP = {
  A:"𝙰",B:"𝙱",C:"𝙲",D:"𝙳",E:"𝙴",F:"𝙵",G:"𝙶",H:"𝙷",I:"𝙸",J:"𝙹",K:"𝙺",L:"𝙻",M:"𝙼",N:"𝙽",O:"𝙾",P:"𝙿",Q:"𝚀",R:"𝚁",S:"𝚂",T:"𝚃",U:"𝚄",V:"𝚅",W:"𝚆",X:"𝚇",Y:"𝚈",Z:"𝚉",
  a:"𝚊",b:"𝚋",c:"𝚌",d:"𝚍",e:"𝚎",f:"𝚏",g:"𝚐",h:"𝚑",i:"𝚒",j:"𝚓",k:"𝚔",l:"𝚕",m:"𝚖",n:"𝚗",o:"𝚘",p:"𝚙",q:"𝚚",r:"𝚛",s:"𝚜",t:"𝚝",u:"𝚞",v:"𝚟",w:"𝚠",x:"𝚡",y:"𝚢",z:"𝚣",
  "0":"𝟶","1":"𝟷","2":"𝟸","3":"𝟹","4":"𝟺","5":"𝟻","6":"𝟼","7":"𝟽","8":"𝟾","9":"𝟿"
};

var SUPERSCRIPT_MAP = {
  A:"ᴬ", B:"ᴮ", C:"ᶜ", D:"ᴰ", E:"ᴱ", F:"ᶠ", G:"ᴳ", H:"ᴴ", I:"ᴵ", J:"ᴶ", K:"ᴷ", L:"ᴸ", M:"ᴹ",
  N:"ᴺ", O:"ᴼ", P:"ᴾ", Q:"ᑫ", R:"ᴿ", S:"ˢ", T:"ᵀ", U:"ᵁ", V:"ⱽ", W:"ᵂ", X:"ˣ", Y:"ʸ", Z:"ᶻ",
  a:"ᵃ", b:"ᵇ", c:"ᶜ", d:"ᵈ", e:"ᵉ", f:"ᶠ", g:"ᵍ", h:"ʰ", i:"ⁱ", j:"ʲ", k:"ᵏ", l:"ˡ", m:"ᵐ",
  n:"ⁿ", o:"ᵒ", p:"ᵖ", q:"ᑫ", r:"ʳ", s:"ˢ", t:"ᵗ", u:"ᵘ", v:"ᵛ", w:"ʷ", x:"ˣ", y:"ʸ", z:"ᶻ",
  "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹",
  "-":"⁻", "+":"⁺"
};

function applyClanMap(map, text) {
  var str = String(text || "");
  var out = "";
  for (var i = 0; i < str.length; i++) {
    var ch = str[i];
    out += (map && map[ch]) ? map[ch] : ch;
  }
  return out;
}

function toClanSuperscript(str) {
  return applyClanMap(SUPERSCRIPT_MAP, str);
}

function toClanSmallCaps(str) {
  var sc = FF_FONT_MAPS.find(function (f) { return f.n === "Small Caps"; });
  return sc ? ffApplyFont(sc.m, str) : str;
}

function toClanFont(fontName, str) {
  var f = FF_FONT_MAPS.find(function (item) { return item.n === fontName; });
  return f ? ffApplyFont(f.m, str) : str;
}

var CLAN_TAG_PRESETS = [
  "pro", "FF", "OP", "KING", "BOSS", "DARK", "SOUL", "GOD", "MAFIA",
  "DEVIL", "ROYAL", "KILLER", "ELITE", "APEX", "TITAN", "SHADOW", "ALPHA", "OMEGA"
];

var CLAN_PLAYER_PRESETS = [
  "", "king", "shadow", "killer", "badshah", "ninja", "storm", "ghost",
  "phoenix", "beast", "raja", "tiger", "demon"
];

var READY_CLAN_NAMES = [
  "『OP』",
  "『PRO』",
  "『BOSS』",
  "亗ELITE亗",
  "亗SQUAD亗",
  "꧁༒FURY༒꧂",
  "★CLAN★",
  "★GODS★",
  "◆DARK◆",
  "◆FIRE◆",
  "»KING«",
  "»APEX«",
  "ঔৣMAFIAৣঔ",
  "⚡LEGEND⚡",
  "亗TITAN亗",
  "『VIPER』",
  "★SHADOW★",
  "꧁༒DEVIL༒꧂",
  "◆IMMORTAL◆",
  "»PHOENIX«",
  "亗WARRIORS亗",
  "『ROYAL』",
  "ঔৣBEASTৣঔ",
  "⚡FORCE⚡",
  "꧁༒NINJA༒꧂",
  "★ALPHA★",
  "◆OMEGA◆",
  "»SNIPER«",
  "亗EMPIRE亗",
  "『STORM』",
  "ঔৣGHOSTৣঔ",
  "⚡CHAMPION⚡",
  "『GHOST』",
  "亗KILLER亗",
  "ঔৣDRAGONৣঔ",
  "⚡IMMORTAL⚡"
];

function wrapTag(style, text) {
  if (style.isSuper) {
    return toClanSuperscript(text);
  }
  return (style.prefix || "") + text + (style.suffix || "");
}

function generateClanNamesList(rawTag, rawPlayer, style) {
  var tag = (rawTag || "pro").trim();
  var player = (rawPlayer || "").trim();

  var results = [];

  function add(label, text) {
    if (!results.some(function (r) { return r.label === label; })) {
      results.push({ label: label, out: text });
    }
  }

  if (player) {
    // Both tag and player name are present
    var styledTag = wrapTag(style, tag);
    add("PLAIN", styledTag + " " + player);
    add("BOLD SCRIPT", styledTag + " " + applyClanMap(BOLD_SCRIPT_MAP, player));
    add("SCRIPT", styledTag + " " + applyClanMap(SCRIPT_MAP, player));
    add("GOTHIC / FRAKTUR", styledTag + " " + applyClanMap(GOTHIC_MAP, player));
    add("BOLD GOTHIC", styledTag + " " + applyClanMap(BOLD_GOTHIC_MAP, player));
    add("DOUBLE STRUCK", styledTag + " " + applyClanMap(DOUBLE_STRUCK_MAP, player));
    add("MONOSPACE", styledTag + " " + applyClanMap(MONOSPACE_MAP, player));
    add("SMALL CAPS", styledTag + " " + toClanSmallCaps(player));
    add("BOLD SANS", styledTag + " " + toClanFont("Bold Sans", player));
    add("ITALIC SANS", styledTag + " " + toClanFont("Italic Sans", player));
    add("SERIF BOLD", styledTag + " " + toClanFont("Serif Bold", player));
    add("SERIF ITALIC", styledTag + " " + toClanFont("Serif Italic", player));
    add("BUBBLE", styledTag + " " + toClanFont("Bubble", player));
    add("SQUARED", styledTag + " " + toClanFont("Squared", player));
    add("TINY SUPERSCRIPT", styledTag + " " + toClanSuperscript(player));
    add("SPACED AESTHETIC", styledTag + " " + player.split("").join(" "));
    add("DOT SEPARATOR", styledTag + "・" + player);
    add("SLASH PILLAR", styledTag + "丨" + player);
    add("CROWN WARRIOR", "亗 " + styledTag + " 亗 " + toClanSmallCaps(player));
    add("FLOURISH WINGS", styledTag + " " + player + " ࿐");
    add("THUNDER TAG", styledTag + " ⚡" + player + "⚡");
    add("CROSS SQUAD", styledTag + " × " + toClanSmallCaps(player));
    add("ANGEL FRAME", "꧁" + styledTag + "꧂ " + player);
    add("DIAMOND GUARD", "◆ " + styledTag + " ◆ " + player);
    add("TOXIC SKULL", "☠ " + styledTag + " ☠ " + toClanSmallCaps(player));
  } else {
    // Only tag is present - matches Image 1 directly!
    add("PLAIN", wrapTag(style, tag));
    add("BOLD SCRIPT", wrapTag(style, applyClanMap(BOLD_SCRIPT_MAP, tag)));
    add("SCRIPT", wrapTag(style, applyClanMap(SCRIPT_MAP, tag)));
    add("GOTHIC / FRAKTUR", wrapTag(style, applyClanMap(GOTHIC_MAP, tag)));
    add("BOLD GOTHIC", wrapTag(style, applyClanMap(BOLD_GOTHIC_MAP, tag)));
    add("DOUBLE STRUCK", wrapTag(style, applyClanMap(DOUBLE_STRUCK_MAP, tag)));
    add("MONOSPACE", wrapTag(style, applyClanMap(MONOSPACE_MAP, tag)));
    add("SMALL CAPS", wrapTag(style, toClanSmallCaps(tag)));
    add("BOLD SANS", wrapTag(style, toClanFont("Bold Sans", tag)));
    add("ITALIC SANS", wrapTag(style, toClanFont("Italic Sans", tag)));
    add("SERIF BOLD", wrapTag(style, toClanFont("Serif Bold", tag)));
    add("SERIF ITALIC", wrapTag(style, toClanFont("Serif Italic", tag)));
    add("BOLD ITALIC", wrapTag(style, toClanFont("Bold Italic", tag)));
    add("BUBBLE", wrapTag(style, toClanFont("Bubble", tag)));
    add("SQUARED", wrapTag(style, toClanFont("Squared", tag)));
    add("TINY SUPERSCRIPT", wrapTag(style, toClanSuperscript(tag)));
    add("CROWN WARRIOR", "亗" + wrapTag(style, tag) + "亗");
    add("FLOURISH WINGS", wrapTag(style, tag) + " ࿐");
    add("LIGHTNING TAG", "⚡" + wrapTag(style, tag) + "⚡");
    add("ANGEL FRAME", "꧁" + wrapTag(style, tag) + "꧂");
    add("DIAMOND GUARD", "◆" + wrapTag(style, tag) + "◆");
    add("TOXIC SKULL", "☠" + wrapTag(style, tag) + "☠");
    add("STAR GUARD", "★" + wrapTag(style, tag) + "★");
    add("ARROW TRAIL", "»" + wrapTag(style, tag) + "«");
    add("DOT OFFICIAL", wrapTag(style, tag) + "・OFFICIAL");
    add("SLASH SQUAD", wrapTag(style, tag) + "丨SQUAD");
    add("SQUAD ESPORTS", wrapTag(style, tag) + " ESPORTS");
    add("SQUAD GUILD", wrapTag(style, tag) + " GUILD");
    add("SQUAD ARMY", wrapTag(style, tag) + " ARMY");
  }

  return results;
}

function attachClanCopyHandler(btn, text) {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    copyText(text);
    btn.classList.add("copied");
    var orig = btn.innerHTML;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DAF1DE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
    setTimeout(function () {
      btn.classList.remove("copied");
      btn.innerHTML = orig;
    }, 1200);
  });
}

function buildClanRow(item) {
  var row = document.createElement("div");
  row.className = "clan-result-row anim-in";

  var info = document.createElement("div");
  info.className = "clan-result-info";

  var label = document.createElement("div");
  label.className = "clan-result-label";
  label.textContent = item.label;

  var text = document.createElement("div");
  text.className = "clan-result-text notranslate";
  text.setAttribute("translate", "no");
  text.textContent = item.out;

  info.appendChild(label);
  info.appendChild(text);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "clan-copy-btn";
  btn.setAttribute("aria-label", "Copy " + item.out);
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8EB69B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  attachClanCopyHandler(btn, item.out);

  row.appendChild(info);
  row.appendChild(btn);
  return row;
}

function buildReadyClanCard(name) {
  var card = document.createElement("div");
  card.className = "ready-clan-card anim-in notranslate";
  card.setAttribute("translate", "no");

  var info = document.createElement("div");
  info.className = "ready-clan-info";

  var title = document.createElement("div");
  title.className = "ready-clan-name notranslate";
  title.setAttribute("translate", "no");
  title.textContent = name;

  var label = document.createElement("div");
  label.className = "ready-clan-label";
  label.textContent = "CLAN TAG";

  info.appendChild(title);
  info.appendChild(label);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "clan-copy-btn";
  btn.setAttribute("aria-label", "Copy " + name);
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8EB69B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  attachClanCopyHandler(btn, name);

  card.appendChild(info);
  card.appendChild(btn);
  return card;
}

function renderReadyClanNames() {
  var grid = $("#readyClanGrid");
  if (!grid) return;
  grid.innerHTML = "";
  READY_CLAN_NAMES.forEach(function (name) {
    grid.appendChild(buildReadyClanCard(name));
  });
}

function renderClanGenerator() {
  var grid = $("#clanGrid");
  if (!grid) return;

  var tagInput = $("#clanTagInput");
  var playerInput = $("#clanPlayerInput");
  var rawTag = tagInput ? tagInput.value : "pro";
  var rawPlayer = playerInput ? playerInput.value : "";

  var currentStyle = CLAN_TAG_STYLES.find(function (s) { return s.id === activeClanStyle; }) || CLAN_TAG_STYLES[0];
  var queryKey = rawTag + "::" + rawPlayer + "::" + activeClanStyle;

  var items = generateClanNamesList(rawTag, rawPlayer, currentStyle);

  grid.innerHTML = "";
  items.forEach(function (item) {
    grid.appendChild(buildClanRow(item));
  });

  var countEl = $("#clanResultsCount");
  if (countEl) {
    var tagLen = ffCharCount(rawTag);
    countEl.innerHTML = "Showing <b>" + items.length + "</b> styles &middot; Tag: <b>" + tagLen + " chars</b>";
  }

  var scrollWrap = $("#clanScrollWrap");
  if (scrollWrap && clanLastQuery !== queryKey) {
    scrollWrap.scrollTop = 0;
  }
  clanLastQuery = queryKey;
}

var _clanTimer = null;
function onClanInput() {
  clearTimeout(_clanTimer);
  _clanTimer = setTimeout(function () {
    renderClanGenerator();
  }, 120);
}

function initClanGenerator() {
  var list = $("#clanStylesList");
  if (!list) return;

  list.addEventListener("click", function (e) {
    var btn = e.target.closest(".clan-style-btn");
    if (!btn) return;
    var styleId = btn.getAttribute("data-style");
    if (!styleId) return;

    $$(".clan-style-btn", list).forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-checked", "true");
    activeClanStyle = styleId;
    renderClanGenerator();
  });

  var tagInput = $("#clanTagInput");
  if (tagInput) tagInput.addEventListener("input", onClanInput);

  var playerInput = $("#clanPlayerInput");
  if (playerInput) playerInput.addEventListener("input", onClanInput);

  var genBtn = $("#generateClanBtn");
  if (genBtn) {
    genBtn.addEventListener("click", function () {
      renderClanGenerator();
      var scrollWrap = $("#clanScrollWrap");
      if (scrollWrap) {
        scrollWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  var diceBtn = $("#clanDiceBtn");
  if (diceBtn) {
    diceBtn.addEventListener("click", function () {
      var rTag = CLAN_TAG_PRESETS[Math.floor(Math.random() * CLAN_TAG_PRESETS.length)];
      var rPlayer = CLAN_PLAYER_PRESETS[Math.floor(Math.random() * CLAN_PLAYER_PRESETS.length)];
      if (tagInput) tagInput.value = rTag;
      if (playerInput) playerInput.value = rPlayer;
      renderClanGenerator();
    });
  }

  renderClanGenerator();
  renderReadyClanNames();
}

/* ------------------------- names tabs section ------------------------- */
var activeTab = null;

function initTabs() {
  var bar = $("#tabBar");
  var grid = $("#namesGrid");
  if (!bar || !grid) return;

  var curL = "en";
  try { curL = (localStorage.getItem("ff_lang") || "en").split("-")[0]; } catch (e) {}
  var curT = (typeof FF_I18N !== "undefined" && FF_I18N[curL]) ? FF_I18N[curL] : null;

  FF_NAME_COLLECTIONS.forEach(function (c, idx) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "tab" + (idx === 0 ? " active" : "");
    var catLabel = (curT && curT.cats && curT.cats[c.id]) ? curT.cats[c.id] : c.label;
    b.textContent = c.emoji + " " + catLabel;
    b.setAttribute("data-tab", c.id);
    b.addEventListener("click", function () {
      $$(".tab", bar).forEach(function (t) { t.classList.remove("active"); });
      b.classList.add("active");
      activeTab = c.id;
      renderCollection(c);
    });
    bar.appendChild(b);
  });

  activeTab = FF_NAME_COLLECTIONS[0].id;
  renderCollection(FF_NAME_COLLECTIONS[0]);

  var search = $("#namesSearch");
  if (search) {
    search.addEventListener("input", function () {
      var c = FF_NAME_COLLECTIONS.find(function (x) { return x.id === activeTab; });
      if (c) renderCollection(c, search.value.trim().toLowerCase());
    });
  }

  var dice = $("#randomNameBtn");
  if (dice) {
    dice.addEventListener("click", function () {
      var n = ffRandomName();
      var input = $("#nameInput");
      if (input) {
        input.value = n;
        renderGenerator(n);
      }
      copyText(n);
      document.getElementById("generator").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function renderCollection(c, filter) {
  var grid = $("#namesGrid");
  var blurb = $("#tabBlurb");
  var curL = "en";
  try { curL = (localStorage.getItem("ff_lang") || "en").split("-")[0]; } catch (e) {}
  var curT = (typeof FF_I18N !== "undefined" && FF_I18N[curL]) ? FF_I18N[curL] : null;
  if (blurb) {
    blurb.textContent = (curT && curT.blurbs && curT.blurbs[c.id]) ? curT.blurbs[c.id] : c.blurb;
  }
  grid.innerHTML = "";
  var names = c.names;
  if (filter) {
    names = names.filter(function (n) { return n.toLowerCase().indexOf(filter) > -1; });
  }
  if (!names.length) {
    var e = document.createElement("div");
    e.className = "empty-note";
    e.style.gridColumn = "1 / -1";
    e.textContent = "No names match \"" + filter + "\" - try another word or check the other tabs.";
    grid.appendChild(e);
    return;
  }
  names.forEach(function (n) { grid.appendChild(buildNameCard(n)); });
}

/* ----------------------------- favorites ------------------------------ */
function openFavModal() {
  var m = $("#favModal");
  if (!m) return;
  m.classList.add("open");
  renderFavorites();
}
function closeFavModal() {
  var m = $("#favModal");
  if (m) m.classList.remove("open");
}
function renderFavorites() {
  var list = $("#favList");
  var countEl = $("#favCount");
  if (!list) return;
  var favs = FFStore.favs.list();
  if (countEl) countEl.textContent = favs.length ? "(" + favs.length + ")" : "";
  list.innerHTML = "";
  if (!favs.length) {
    var e = document.createElement("div");
    e.className = "fav-empty";
    e.textContent = "No favorites yet - tap the heart on any name to save it here.";
    list.appendChild(e);
    return;
  }
  favs.forEach(function (n) {
    var card = document.createElement("div");
    card.className = "name-card notranslate";
    card.setAttribute("translate", "no");
    var txt = document.createElement("div");
    txt.className = "name-text notranslate";
    txt.setAttribute("translate", "no");
    txt.textContent = n;
    var row = document.createElement("div");
    row.className = "row";
    var cp = document.createElement("button");
    cp.type = "button"; cp.className = "chip"; cp.innerHTML = "&#128203; Copy";
    cp.addEventListener("click", function () { copyText(n); });
    var rm = document.createElement("button");
    rm.type = "button"; rm.className = "chip fav active"; rm.innerHTML = "&#10005;";
    rm.title = "Remove";
    rm.addEventListener("click", function () {
      FFStore.favs.toggle(n);
      renderFavorites();
    });
    row.appendChild(cp); row.appendChild(rm);
    card.appendChild(txt); card.appendChild(row);
    list.appendChild(card);
  });
}

/* ------------------------- symbols (both pages) ----------------------- */
function buildSymGroup(group, limit) {
  var wrap = document.createElement("div");
  wrap.className = "sym-group anim-in";
  wrap.id = "sym-" + group.id;

  var h = document.createElement("h3");
  h.innerHTML = group.label + ' <span class="count">(' + group.syms.length + " to copy)</span>";
  wrap.appendChild(h);

  var grid = document.createElement("div");
  grid.className = "sym-grid notranslate";
  grid.setAttribute("translate", "no");

  var syms = limit ? group.syms.slice(0, limit) : group.syms;
  syms.forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "sym-btn notranslate" + (group.id === "blank" ? " blank" : "");
    b.setAttribute("translate", "no");
    var isBlank = group.id === "blank";
    if (isBlank) {
      b.textContent = "blank";
      b.title = (group.labels && group.labels[s]) || "Invisible character - click to copy";
    } else {
      b.textContent = s;
      b.title = "Click to copy " + s;
    }
    b.setAttribute("aria-label", "Copy symbol " + (isBlank ? ((group.labels && group.labels[s]) || "blank character") : s));
    b.addEventListener("click", function () {
      copyText(s);
      flashPreview(s);
    });
    grid.appendChild(b);
  });

  wrap.appendChild(grid);
  return wrap;
}

function flashPreview(sym) {
  var p = $("#symPreviewText");
  if (p) {
    p.textContent = sym;
    var box = $("#symPreview");
    if (box) { box.style.borderColor = "var(--brand)"; setTimeout(function () { box.style.borderColor = ""; }, 700); }
  }
}

function renderSymbols(containerSel, limit) {
  var c = $(containerSel);
  if (!c) return;
  c.innerHTML = "";
  FF_SYMBOL_GROUPS.forEach(function (g) { c.appendChild(buildSymGroup(g, limit)); });
}

/* ------------------------------ FAQ + SEO ----------------------------- */
function renderFaq(customFaqs) {
  var list = $("#faqList");
  if (!list) return;
  list.innerHTML = "";
  var curL = "en";
  try { curL = (localStorage.getItem("ff_lang") || "en").split("-")[0]; } catch (e) {}
  var curT = (typeof FF_I18N !== "undefined" && FF_I18N[curL]) ? FF_I18N[curL] : null;
  var faqs = (customFaqs && customFaqs.length) ? customFaqs : ((curT && curT.faqs && curT.faqs.length) ? curT.faqs : FF_FAQS);

  faqs.forEach(function (f, i) {
    var d = document.createElement("details");
    d.className = "faq-item";
    if (i === 0) d.setAttribute("open", "");
    var s = document.createElement("summary");
    s.innerHTML = f.q + ' <span class="plus">+</span>';
    var a = document.createElement("div");
    a.className = "faq-a";
    a.textContent = f.a;
    d.appendChild(s); d.appendChild(a);
    list.appendChild(d);
  });

  /* FAQPage structured data (matches visible content) */
  if (!document.getElementById("faqJsonLd")) {
    var sc = document.createElement("script");
    sc.type = "application/ld+json";
    sc.id = "faqJsonLd";
    sc.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FF_FAQS.map(function (f) {
        return {
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        };
      })
    });
    document.head.appendChild(sc);
  }
}

/* ------------------------------ stats fill ---------------------------- */
function fillStats() {
  var map = {
    statNames: FF_TOTAL_NAMES + "+",
    statSymbols: FF_TOTAL_SYMBOLS + "+",
    statStyles: FF_STYLES.length + "",
    statCats: FF_NAME_COLLECTIONS.length + ""
  };
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = map[id];
  });
}

/* -------------------------------- nav --------------------------------- */
function initNav() {
  var header = $(".site-header");
  var toggle = $(".nav-toggle");
  var links = $(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    var t = $(".to-top");
    if (t) t.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });

  var toTop = $(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* highlight active nav link */
  var path = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });
}

/* ------------------------------- language ------------------------------ */
function setGoogleTranslateLanguage(langCode) {
  var googleCode = langCode;
  if (langCode === "pt-BR") googleCode = "pt";
  if (langCode === "zh") googleCode = "zh-CN";

  var host = window.location.hostname;
  var domain = (host && host.indexOf(".") > -1 && host !== "localhost") ? "; domain=." + host : "";
  var paths = ["/", window.location.pathname];

  if (langCode === "en") {
    try {
      paths.forEach(function (p) {
        if (domain) document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + p + domain;
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + p;
        if (domain) document.cookie = "googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + p + domain;
        document.cookie = "googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + p;
      });
    } catch (e) {}

    var comboEn = document.querySelector(".goog-te-combo");
    if (comboEn) {
      comboEn.value = "";
      var evtEn;
      try {
        evtEn = new Event("change", { bubbles: true, cancelable: true });
      } catch (e) {
        evtEn = document.createEvent("HTMLEvents");
        evtEn.initEvent("change", true, true);
      }
      comboEn.dispatchEvent(evtEn);
      if (typeof comboEn.onchange === "function") {
        try { comboEn.onchange(); } catch (e) {}
      }
    }
    return;
  }

  try {
    paths.forEach(function (p) {
      if (domain) document.cookie = "googtrans=/en/" + googleCode + "; path=" + p + domain;
      document.cookie = "googtrans=/en/" + googleCode + "; path=" + p;
    });
  } catch (e) {}

  function triggerCombo() {
    var combo = document.querySelector(".goog-te-combo");
    if (combo) {
      var targetVal = googleCode;
      var found = false;
      for (var i = 0; i < combo.options.length; i++) {
        if (combo.options[i].value === targetVal || combo.options[i].value.toLowerCase() === targetVal.toLowerCase()) {
          combo.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) combo.value = targetVal;

      var evt;
      try {
        evt = new Event("change", { bubbles: true, cancelable: true });
      } catch (e) {
        evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);
      }
      combo.dispatchEvent(evt);
      if (typeof combo.onchange === "function") {
        try { combo.onchange(); } catch (e) {}
      }
      return true;
    }
    return false;
  }

  if (!triggerCombo()) {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      if (triggerCombo() || attempts > 30) {
        clearInterval(timer);
      }
    }, 150);
  }
}

function applyInstantTranslations(langCode) {
  var key = langCode === "pt-BR" ? "pt" : langCode.split("-")[0];
  var i18n = window.FF_I18N || {};
  var t = i18n[key] || i18n["en"];
  if (!t) return;

  // 1. Navigation Links
  var navLinks = document.querySelectorAll(".nav-links a");
  if (navLinks.length >= 7) {
    if (t.home) navLinks[0].textContent = t.home;
    if (t.clan) navLinks[1].textContent = t.clan;
    if (t.names) navLinks[2].textContent = t.names;
    if (t.symbols) navLinks[3].textContent = t.symbols;
    if (t.guide) navLinks[4].textContent = t.guide;
    if (t.faq) navLinks[5].textContent = t.faq;
    if (t.genCta) navLinks[6].textContent = t.genCta;
  }

  // 2. Hero Section
  var heroKicker = document.querySelector(".hero .kicker");
  if (heroKicker && t.kicker) heroKicker.innerHTML = t.kicker;

  var heroH1 = document.querySelector(".hero h1");
  if (heroH1 && t.heroH1) heroH1.innerHTML = t.heroH1;

  var heroLead = document.querySelector(".hero .lead");
  if (heroLead && t.heroLead) heroLead.innerHTML = t.heroLead;

  var heroBtns = document.querySelectorAll(".hero-actions .btn");
  if (heroBtns.length >= 3) {
    if (t.heroBtn) heroBtns[0].textContent = t.heroBtn;
    if (t.clanBtn) heroBtns[1].textContent = t.clanBtn;
    if (t.browseBtn) heroBtns[2].textContent = t.browseBtn;
  }

  var statSpans = document.querySelectorAll(".stat span");
  if (statSpans.length >= 4) {
    if (t.stat1) statSpans[0].textContent = t.stat1;
    if (t.stat2) statSpans[1].textContent = t.stat2;
    if (t.stat3) statSpans[2].textContent = t.stat3;
    if (t.stat4) statSpans[3].textContent = t.stat4;
  }

  // 3. Generator Section
  var genSec = document.getElementById("generator");
  if (genSec) {
    var genEyebrow = genSec.querySelector(".eyebrow");
    if (genEyebrow && t.genEyebrow) genEyebrow.textContent = t.genEyebrow;

    var genH2 = genSec.querySelector("h2");
    if (genH2 && t.genH2) genH2.textContent = t.genH2;

    var genDesc = genSec.querySelector(".section-head p");
    if (genDesc && t.genDesc) genDesc.textContent = t.genDesc;

    var nameInput = document.getElementById("nameInput");
    if (nameInput && t.placeholder) nameInput.placeholder = t.placeholder;

    var diceBtn = document.getElementById("diceBtn");
    if (diceBtn && t.random) diceBtn.innerHTML = t.random;

    var quickLabel = genSec.querySelector(".gen-quick-label");
    if (quickLabel && t.insertSym) quickLabel.innerHTML = t.insertSym;

    var decorLabel = genSec.querySelector(".gen-decor-label");
    if (decorLabel && t.decorFrame) decorLabel.innerHTML = t.decorFrame;

    var decorReset = document.getElementById("decorResetBtn");
    if (decorReset && t.resetFrame) decorReset.innerHTML = t.resetFrame;

    var btnDefault = genSec.querySelector('.gen-decor-btn[data-decor="none"]');
    if (btnDefault && t.defaultFrame) btnDefault.textContent = t.defaultFrame;
    var btnWings = genSec.querySelector('.gen-decor-btn[data-decor="flourish"]');
    if (btnWings && t.wings) btnWings.textContent = t.wings;
    var btnPillar = genSec.querySelector('.gen-decor-btn[data-decor="pillar"]');
    if (btnPillar && t.pillar) btnPillar.textContent = t.pillar;
    var btnDots = genSec.querySelector('.gen-decor-btn[data-decor="dots"]');
    if (btnDots && t.dots) btnDots.textContent = t.dots;

    var charCount = document.getElementById("charCount");
    if (charCount && t.charCount) charCount.innerHTML = t.charCount;

    var genHint = genSec.querySelector(".gen-hint");
    if (genHint && t.styleFamily) {
      if (genHint.childNodes.length > 0 && genHint.childNodes[0].nodeType === 3) {
        genHint.childNodes[0].textContent = t.styleFamily + " ";
      }
    }

    var feats = genSec.querySelectorAll(".features .feature");
    if (feats.length >= 4) {
      if (t.feat1H && feats[0].querySelector("h3")) feats[0].querySelector("h3").textContent = t.feat1H;
      if (t.feat1P && feats[0].querySelector("p")) feats[0].querySelector("p").textContent = t.feat1P;
      if (t.feat2H && feats[1].querySelector("h3")) feats[1].querySelector("h3").textContent = t.feat2H;
      if (t.feat2P && feats[1].querySelector("p")) feats[1].querySelector("p").textContent = t.feat2P;
      if (t.feat3H && feats[2].querySelector("h3")) feats[2].querySelector("h3").textContent = t.feat3H;
      if (t.feat3P && feats[2].querySelector("p")) feats[2].querySelector("p").textContent = t.feat3P;
      if (t.feat4H && feats[3].querySelector("h3")) feats[3].querySelector("h3").textContent = t.feat4H;
      if (t.feat4P && feats[3].querySelector("p")) feats[3].querySelector("p").textContent = t.feat4P;
    }

    var emptyNote = genSec.querySelector(".empty-note");
    if (emptyNote && t.emptyNote) emptyNote.innerHTML = t.emptyNote;
  }

  // 4. Clan Generator Section
  var clanSec = document.getElementById("clan");
  if (clanSec) {
    var clanEyebrow = clanSec.querySelector(".eyebrow");
    if (clanEyebrow && t.clanEyebrow) clanEyebrow.textContent = t.clanEyebrow;

    var clanH2 = clanSec.querySelector(".clan-heading");
    if (clanH2 && t.clanH2) clanH2.innerHTML = t.clanH2;

    var clanSub = clanSec.querySelector(".clan-sub");
    if (clanSub && t.clanSub) clanSub.innerHTML = t.clanSub;

    var tagLabel = clanSec.querySelector('label[for="clanTagInput"]');
    if (tagLabel && t.clanTagLabel) tagLabel.textContent = t.clanTagLabel;

    var playerLabel = clanSec.querySelector('label[for="clanPlayerInput"]');
    if (playerLabel && t.clanPlayerLabel) {
      playerLabel.innerHTML = t.clanPlayerLabel + ' <span class="clan-optional">' + (t.clanOptional || "(optional)") + '</span>';
    }

    var clanQuick = clanSec.querySelector(".clan-quick-label");
    if (clanQuick && t.insertSym) clanQuick.innerHTML = t.insertSym;

    var clanStyleLabel = clanSec.querySelector(".clan-styles-label");
    if (clanStyleLabel && t.tagStyleLabel) clanStyleLabel.textContent = t.tagStyleLabel;

    var genClanBtn = document.getElementById("generateClanBtn");
    if (genClanBtn && t.genClanBtn) genClanBtn.innerHTML = t.genClanBtn;

    var clanResultsCount = document.getElementById("clanResultsCount");
    if (clanResultsCount && t.clanPreview) clanResultsCount.innerHTML = t.clanPreview;

    var clanDice = document.getElementById("clanDiceBtn");
    if (clanDice && t.clanRandomSquad) clanDice.innerHTML = t.clanRandomSquad;

    var readyTitle = clanSec.querySelector(".ready-clan-title");
    if (readyTitle && t.readyClanTitle) readyTitle.innerHTML = '<span class="ready-clan-icon">⚔️</span> ' + t.readyClanTitle;

    var readySub = clanSec.querySelector(".ready-clan-sub");
    if (readySub && t.readyClanSub) {
      readySub.innerHTML = t.readyClanSub + ' <a href="guide.html" class="ready-clan-link">' + (t.ffGuides || "Free Fire guides") + '</a>';
    }
  }

  // 5. Browse Names Section
  var namesSec = document.getElementById("names");
  if (namesSec) {
    var namesEyebrow = namesSec.querySelector(".eyebrow");
    if (namesEyebrow && t.namesEyebrow) namesEyebrow.textContent = t.namesEyebrow;

    var namesH2 = namesSec.querySelector("h2");
    if (namesH2 && t.namesH2) namesH2.textContent = t.namesH2;

    var namesSub = namesSec.querySelector(".section-head p");
    if (namesSub && t.namesSub) namesSub.textContent = t.namesSub;

    var nSearch = document.getElementById("namesSearch");
    if (nSearch && t.searchCategory) nSearch.placeholder = t.searchCategory;

    var rndNameBtn = document.getElementById("randomNameBtn");
    if (rndNameBtn && t.surpriseMe) rndNameBtn.innerHTML = t.surpriseMe;

    var openFav = document.getElementById("openFavBtn");
    if (openFav && t.favBtn) {
      var favCountSpan = document.getElementById("favCount");
      var favCountText = (favCountSpan && favCountSpan.textContent) ? favCountSpan.textContent : (FFStore.favs.list().length ? "(" + FFStore.favs.list().length + ")" : "");
      openFav.innerHTML = t.favBtn + ' <span id="favCount">' + favCountText + '</span>';
    }

    // Update Category Tab Labels
    if (t.cats) {
      var tabs = namesSec.querySelectorAll(".tabs .tab");
      tabs.forEach(function (tab) {
        var catId = tab.getAttribute("data-tab");
        if (catId && t.cats[catId]) {
          var collection = FF_NAME_COLLECTIONS.find(function (c) { return c.id === catId; });
          var emoji = collection ? collection.emoji : "";
          tab.textContent = (emoji ? emoji + " " : "") + t.cats[catId];
        }
      });
      if (activeTab && t.cats[activeTab]) {
        var blurbEl = document.getElementById("tabBlurb");
        if (blurbEl && t.blurbs && t.blurbs[activeTab]) {
          blurbEl.textContent = t.blurbs[activeTab];
        }
      }
    }
  }

  // 6. Symbols Section
  var symSec = document.getElementById("symbols-preview");
  if (symSec) {
    var symEyebrow = symSec.querySelector(".eyebrow");
    if (symEyebrow && t.symEyebrow) symEyebrow.textContent = t.symEyebrow;

    var symH2 = symSec.querySelector("h2");
    if (symH2 && t.symH2) symH2.textContent = t.symH2;

    var symSub = symSec.querySelector(".section-head p");
    if (symSub && t.symSub) symSub.textContent = t.symSub;

    var symBtn = symSec.querySelector("a.btn");
    if (symBtn && t.openSymbolsBtn) symBtn.innerHTML = t.openSymbolsBtn;
  }

  // 7. How-To Section
  var howtoSec = document.getElementById("howto");
  if (howtoSec) {
    var howEyebrow = howtoSec.querySelector(".eyebrow");
    if (howEyebrow && t.howtoEyebrow) howEyebrow.textContent = t.howtoEyebrow;

    var howH2 = howtoSec.querySelector("h2");
    if (howH2 && t.howtoH2) howH2.textContent = t.howtoH2;

    var howSub = howtoSec.querySelector(".section-head p");
    if (howSub && t.howtoSub) howSub.textContent = t.howtoSub;

    var steps = howtoSec.querySelectorAll(".steps .step");
    if (steps.length >= 6) {
      if (t.step1H && steps[0].querySelector("h3")) steps[0].querySelector("h3").textContent = t.step1H;
      if (t.step1P && steps[0].querySelector("p")) steps[0].querySelector("p").textContent = t.step1P;
      if (t.step2H && steps[1].querySelector("h3")) steps[1].querySelector("h3").textContent = t.step2H;
      if (t.step2P && steps[1].querySelector("p")) steps[1].querySelector("p").textContent = t.step2P;
      if (t.step3H && steps[2].querySelector("h3")) steps[2].querySelector("h3").textContent = t.step3H;
      if (t.step3P && steps[2].querySelector("p")) steps[2].querySelector("p").textContent = t.step3P;
      if (t.step4H && steps[3].querySelector("h3")) steps[3].querySelector("h3").textContent = t.step4H;
      if (t.step4P && steps[3].querySelector("p")) steps[3].querySelector("p").textContent = t.step4P;
      if (t.step5H && steps[4].querySelector("h3")) steps[4].querySelector("h3").textContent = t.step5H;
      if (t.step5P && steps[4].querySelector("p")) steps[4].querySelector("p").textContent = t.step5P;
      if (t.step6H && steps[5].querySelector("h3")) steps[5].querySelector("h3").textContent = t.step6H;
      if (t.step6P && steps[5].querySelector("p")) steps[5].querySelector("p").textContent = t.step6P;
    }

    var costs = howtoSec.querySelectorAll(".cost-grid .cost");
    if (costs.length >= 3) {
      if (t.cost1Amt && costs[0].querySelector(".amt")) costs[0].querySelector(".amt").textContent = t.cost1Amt;
      if (t.cost1H && costs[0].querySelector("h3")) costs[0].querySelector("h3").textContent = t.cost1H;
      if (t.cost1P && costs[0].querySelector("p")) costs[0].querySelector("p").textContent = t.cost1P;

      if (t.cost2Amt && costs[1].querySelector(".amt")) costs[1].querySelector(".amt").textContent = t.cost2Amt;
      if (t.cost2H && costs[1].querySelector("h3")) costs[1].querySelector("h3").textContent = t.cost2H;
      if (t.cost2P && costs[1].querySelector("p")) costs[1].querySelector("p").textContent = t.cost2P;

      if (t.cost3Amt && costs[2].querySelector(".amt")) costs[2].querySelector(".amt").innerHTML = t.cost3Amt;
      if (t.cost3H && costs[2].querySelector("h3")) costs[2].querySelector("h3").textContent = t.cost3H;
      if (t.cost3P && costs[2].querySelector("p")) costs[2].querySelector("p").textContent = t.cost3P;
    }

    var guideBtn = howtoSec.querySelector("a.btn");
    if (guideBtn && t.readGuideBtn) guideBtn.innerHTML = t.readGuideBtn;
  }

  // 8. FAQ Section
  var faqSec = document.getElementById("faq");
  if (faqSec) {
    var faqEyebrow = faqSec.querySelector(".eyebrow");
    if (faqEyebrow && t.faqEyebrow) faqEyebrow.textContent = t.faqEyebrow;

    var faqH2 = faqSec.querySelector("h2");
    if (faqH2 && t.faqH2) faqH2.textContent = t.faqH2;

    var faqSub = faqSec.querySelector(".section-head p");
    if (faqSub && t.faqSub) faqSub.textContent = t.faqSub;

    renderFaq(t.faqs);
  }

  // 9. CTA Band
  var ctaBand = document.querySelector(".cta-band");
  if (ctaBand) {
    var ctaH2 = ctaBand.querySelector("h2");
    if (ctaH2 && t.ctaH2) ctaH2.textContent = t.ctaH2;

    var ctaP = ctaBand.querySelector("p");
    if (ctaP && t.ctaSub) ctaP.textContent = t.ctaSub;

    var ctaBtn = ctaBand.querySelector("a.btn");
    if (ctaBtn && t.ctaBtn) ctaBtn.innerHTML = t.ctaBtn;
  }

  // 10. Footer
  var footerAbout = document.querySelector(".footer-about p");
  if (footerAbout && t.footerAbout) footerAbout.textContent = t.footerAbout;

  var footerH4 = document.querySelectorAll(".site-footer h4");
  if (footerH4.length >= 3) {
    if (t.footerPages) footerH4[0].textContent = t.footerPages;
    if (t.footerCollections) footerH4[1].textContent = t.footerCollections;
    if (t.footerLegal) footerH4[2].textContent = t.footerLegal;
  }

  var footerLinks = document.querySelectorAll(".site-footer ul a");
  if (footerLinks.length >= 12) {
    var fl = [
      t.home || "Home",
      t.symbolsTitle || t.symbols || "Symbols Library",
      t.guide || "Rename Guide",
      t.aboutTitle || "About & Contact",
      t.stat1 || "Stylish Names",
      t.clan || "Clan Names",
      (t.cats && t.cats.boys ? t.cats.boys : "Boys & Girls"),
      (t.cats && t.cats.clan ? t.cats.clan : "Guild Names"),
      (t.cats && t.cats.ny2026 ? t.cats.ny2026 : "New Year 2026"),
      (t.subpages && t.subpages.privacyTitle ? t.subpages.privacyTitle : "Privacy Policy"),
      (t.subpages && t.subpages.termsTitle ? t.subpages.termsTitle : "Terms of Use"),
      t.disclaimerTitle || "Disclaimer"
    ];
    for (var fi = 0; fi < 12; fi++) {
      if (fl[fi]) footerLinks[fi].textContent = fl[fi];
    }
  }

  var footerBottom = document.querySelectorAll(".footer-bottom span");
  if (footerBottom.length >= 2) {
    if (t.copyright) footerBottom[0].textContent = t.copyright;
    if (t.disclaimer) footerBottom[1].textContent = t.disclaimer;
  }

  // 11. Favorites Modal
  var favHead = document.querySelector("#favModal .modal-head h3");
  if (favHead && t.favModalTitle) {
    favHead.innerHTML = t.favModalTitle + ' <span id="favCount"></span>';
  }
  var copyAllBtn = document.getElementById("favCopyAllBtn");
  if (copyAllBtn && t.copyAllBtn) copyAllBtn.innerHTML = t.copyAllBtn;

  var clearAllBtn = document.getElementById("favClearBtn");
  if (clearAllBtn && t.clearAllBtn) clearAllBtn.textContent = t.clearAllBtn;

  // 12. Subpages (Page Hero)
  var pageHeroH1 = document.querySelector(".page-hero h1");
  var pageHeroP = document.querySelector(".page-hero p");
  if (pageHeroH1 && t.subpages) {
    var pathName = window.location.pathname.split("/").pop() || "";
    if (pathName.indexOf("guide") > -1) {
      if (t.subpages.guideTitle) pageHeroH1.textContent = t.subpages.guideTitle;
      if (t.subpages.guideSub && pageHeroP) pageHeroP.textContent = t.subpages.guideSub;
    } else if (pathName.indexOf("about") > -1) {
      if (t.subpages.aboutTitle) pageHeroH1.textContent = t.subpages.aboutTitle;
      if (t.subpages.aboutSub && pageHeroP) pageHeroP.textContent = t.subpages.aboutSub;
    } else if (pathName.indexOf("symbols") > -1) {
      if (t.subpages.symbolsTitle) pageHeroH1.textContent = t.subpages.symbolsTitle;
      if (t.subpages.symbolsSub && pageHeroP) pageHeroP.textContent = t.subpages.symbolsSub;
    } else if (pathName.indexOf("privacy") > -1) {
      if (t.subpages.privacyTitle) pageHeroH1.textContent = t.subpages.privacyTitle;
      if (t.subpages.privacySub && pageHeroP) pageHeroP.textContent = t.subpages.privacySub;
    } else if (pathName.indexOf("terms") > -1) {
      if (t.subpages.termsTitle) pageHeroH1.textContent = t.subpages.termsTitle;
      if (t.subpages.termsSub && pageHeroP) pageHeroP.textContent = t.subpages.termsSub;
    } else if (pathName.indexOf("not-found") > -1) {
      if (t.subpages.notFoundTitle) pageHeroH1.textContent = t.subpages.notFoundTitle;
      if (t.subpages.notFoundSub && pageHeroP) pageHeroP.textContent = t.subpages.notFoundSub;
    }
  }
}

function initLanguageSelector() {
  var langSelects = document.querySelectorAll(".lang-select");
  if (!langSelects.length) return;

  var savedLang = "en";
  try {
    savedLang = localStorage.getItem("ff_lang") || "en";
  } catch (e) {}

  langSelects.forEach(function (select) {
    select.value = savedLang;
    select.addEventListener("change", function () {
      var val = this.value;
      try {
        localStorage.setItem("ff_lang", val);
      } catch (e) {}

      var shortCode = val.split("-")[0] || val;
      document.documentElement.lang = shortCode;
      if (shortCode === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }

      langSelects.forEach(function (other) {
        if (other !== select) other.value = val;
      });

      // 1. INSTANT (0ms) full UI translation across the entire page
      applyInstantTranslations(val);

      // 2. Trigger Google Translate for deep prose if connected
      setGoogleTranslateLanguage(val);
    });
  });

  var initialCode = savedLang.split("-")[0] || savedLang;
  document.documentElement.lang = initialCode;
  if (initialCode === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
  }

  if (savedLang !== "en") {
    applyInstantTranslations(savedLang);
    setGoogleTranslateLanguage(savedLang);
  }
}

/* -------------------------------- boot -------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initLanguageSelector();
  fillStats();

  var input = $("#nameInput");
  if (input) {
    fillStyleSelect();
    input.addEventListener("input", onGenInput);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); renderGenerator(input.value); }
    });
    var dice2 = $("#diceBtn");
    if (dice2) {
      dice2.addEventListener("click", function () {
        var n = ffRandomName();
        input.value = n;
        renderGenerator(n);
      });
    }
    renderGenerator("");
  }

  initClanGenerator();
  initDecorAndSymbols();
  initTabs();
  renderFaq();

  /* home page: compact preview of the symbols library */
  if (document.getElementById("symbolsHome")) {
    renderSymbols("#symbolsHome", 14);
  }

  var favCopyAll = $("#favCopyAllBtn");
  if (favCopyAll) {
    favCopyAll.addEventListener("click", function () {
      var favs = FFStore.favs.list();
      if (!favs.length) { showToast("No favorites to copy yet"); return; }
      copyText(favs.join("\n"));
    });
  }

  var favOpen = $("#openFavBtn");
  if (favOpen) favOpen.addEventListener("click", openFavModal);
  var favClose = $("#favCloseBtn");
  if (favClose) favClose.addEventListener("click", closeFavModal);
  var favClear = $("#favClearBtn");
  if (favClear) {
    favClear.addEventListener("click", function () {
      FFStore.favs.clear();
      renderFavorites();
      showToast("Favorites cleared");
    });
  }
  var overlay = $("#favModal");
  if (overlay) {
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeFavModal(); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeFavModal();
  });
});
