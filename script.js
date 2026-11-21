
var editor = document.getElementById("editor");
var fontSize = document.getElementById("fontSize");
var fontFamily = document.getElementById("fontFamily");
var textColor = document.getElementById("textColor");
var bgColor = document.getElementById("bgColor");
var fillBar = document.getElementById("fillBar");
 
var boldBtn = document.getElementById("boldBtn");
var underlineBtn = document.getElementById("underlineBtn");
var italicBtn = document.getElementById("italicBtn");
var clearBtn = document.getElementById("clearBtn");
 
var savedRange = null;
 
/* ---------- keep the selection when clicking toolbar controls ---------- */
document.addEventListener("selectionchange", function () {
  var sel = window.getSelection();
  if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange();
    updateActiveButtons();
  }
});
 
function restoreSelection() {
  editor.focus();
  if (savedRange) {
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
}
 
function run(command, value) {
  restoreSelection();
  document.execCommand("styleWithCSS", false, true);
  document.execCommand(command, false, value || null);
  updateActiveButtons();
}
 
/* buttons: don't steal focus from the editor */
var buttons = document.querySelectorAll(".toolbar button");
buttons.forEach(function (btn) {
  btn.addEventListener("mousedown", function (e) {
    e.preventDefault();
  });
});
 
/* ---------- Bold / Underline / Italic ---------- */
boldBtn.addEventListener("click", function () { run("bold"); });
underlineBtn.addEventListener("click", function () { run("underline"); });
italicBtn.addEventListener("click", function () { run("italic"); });
 
function updateActiveButtons() {
  boldBtn.classList.toggle("active", document.queryCommandState("bold"));
  underlineBtn.classList.toggle("active", document.queryCommandState("underline"));
  italicBtn.classList.toggle("active", document.queryCommandState("italic"));
}
 
/* ---------- Clear ---------- */
clearBtn.addEventListener("click", function () {
  editor.innerHTML = "";
  savedRange = null;
  editor.focus();
  updateActiveButtons();
});
 
/* ---------- Font size (in px) ---------- */
fontSize.addEventListener("change", function () {
  var px = fontSize.value + "px";
  restoreSelection();
 
  var sel = window.getSelection();
  if (sel.rangeCount === 0 || sel.isCollapsed) {
    // nothing selected: change size for the whole editor
    editor.style.fontSize = px;
    return;
  }
 
  document.execCommand("styleWithCSS", false, false);
  document.execCommand("fontSize", false, "7");
  var fonts = editor.querySelectorAll('font[size="7"]');
  fonts.forEach(function (f) {
    var span = document.createElement("span");
    span.style.fontSize = px;
    span.innerHTML = f.innerHTML;
    f.parentNode.replaceChild(span, f);
  });
});
 
/* ---------- Font family ---------- */
fontFamily.addEventListener("change", function () {
  var sel = window.getSelection();
  restoreSelection();
  if (sel.rangeCount === 0 || sel.isCollapsed) {
    editor.style.fontFamily = fontFamily.value;
    return;
  }
  run("fontName", fontFamily.value);
});
 
/* ---------- Colors ---------- */
textColor.addEventListener("input", function () {
  run("foreColor", textColor.value);
});
 
bgColor.addEventListener("input", function () {
  fillBar.style.background = bgColor.value;
  run("hiliteColor", bgColor.value);
});
 
/* ---------- Alignment ---------- */
var alignButtons = document.querySelectorAll("[data-align]");
alignButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    run(btn.getAttribute("data-align"));
  });
});
 
/* ---------- Keyboard shortcuts ---------- */
editor.addEventListener("keyup", updateActiveButtons);
editor.addEventListener("mouseup", updateActiveButtons);
 