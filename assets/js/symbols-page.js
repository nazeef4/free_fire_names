/* =========================================================================
   FFNames.pro — Symbols page behaviour (quick links + search filter)
   ========================================================================= */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  renderSymbols("#symbolsFull");

  /* anchor quick links above the groups */
  var ql = document.getElementById("symQuickLinks");
  if (ql) {
    FF_SYMBOL_GROUPS.forEach(function (g) {
      var a = document.createElement("a");
      a.className = "tab";
      a.href = "#sym-" + g.id;
      a.textContent = g.label;
      ql.appendChild(a);
    });
  }

  /* search: hide groups that neither match the label nor contain the query */
  var box = document.getElementById("symSearch");
  if (!box) return;
  box.addEventListener("input", function () {
    var q = box.value.trim().toLowerCase();
    FF_SYMBOL_GROUPS.forEach(function (g) {
      var el = document.getElementById("sym-" + g.id);
      if (!el) return;
      if (!q) { el.style.display = ""; return; }
      var inLabel = g.label.toLowerCase().indexOf(q) > -1;
      var inSyms = g.syms.some(function (s) {
        var lab = (g.labels && g.labels[s]) || "";
        return s.toLowerCase().indexOf(q) > -1 || lab.toLowerCase().indexOf(q) > -1;
      });
      el.style.display = (inLabel || inSyms) ? "" : "none";
    });
  });
});
