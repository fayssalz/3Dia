// Add this file and include it after your main.min.js (or paste its content
// into an existing script block at the end of index.html).
//
// Responsibilities:
// - Read crown height and crown table inputs
// - Compute crown angle in degrees and update the readout
// - Update on user changes and on initial load

(function () {
  function qs(id) { return document.getElementById(id); }

  var crownHeightEl = qs('custom-cut-crown-height-range-id');
  var crownTableEl = qs('custom-cut-crown-table-range-id');
  var crownAngleValueEl = qs('custom-cut-crown-angle-value-id');

  if (!crownHeightEl || !crownTableEl || !crownAngleValueEl) {
    // Elements not present (older versions or different layout) — no-op.
    return;
  }

  // Computes crown angle (degrees).
  // Formula:
  //   angle = atan( crownHeight / ((1 - table) / 2) )
  // Assumes crownHeight and crownTable are expressed as fractions of the same
  // overall diameter (consistent with the existing input ranges).
  function computeCrownAngleDegrees(crownHeight, crownTable) {
    var halfSide = (1 - crownTable) / 2;
    // Guard against zero division
    if (halfSide <= 0) {
      return 0;
    }
    var radians = Math.atan(crownHeight / halfSide);
    return radians * (180 / Math.PI);
  }

  function formatAngle(angle) {
    // e.g. "34.5°" with one decimal place
    return angle.toFixed(1) + '\u00B0';
  }

  function update() {
    var h = parseFloat(crownHeightEl.value);
    var t = parseFloat(crownTableEl.value);
    if (isNaN(h) || isNaN(t)) {
      crownAngleValueEl.textContent = '—';
      return;
    }
    var angle = computeCrownAngleDegrees(h, t);
    crownAngleValueEl.textContent = formatAngle(angle);
  }

  // Update when either input changes
  crownHeightEl.addEventListener('input', update, { passive: true });
  crownTableEl.addEventListener('input', update, { passive: true });

  // Also update once on load
  window.addEventListener('load', update);
  // If UI initializes values later, call update again shortly after load
  setTimeout(update, 100);
})();
// script/custom-controls.js
(function () {
  function $(id) { return document.getElementById(id); }
  function num(v) { return v == null || v === '' ? 0 : parseFloat(v); }

  var crownHeightEl      = $('custom-cut-crown-height-range-id');     // existing
  var pavilionHeightEl   = $('custom-cut-pavillion-height-range-id'); // existing
  var pavilionRatioEl    = $('custom-cut-pavillion-ratio-range-id');  // existing
  var girdleThicknessEl  = $('custom-cut-girdle-thickness-range-id'); // existing

  var pavilionAngleOut   = $('custom-cut-pavillion-angle-output-id'); // new span id
  var totalDepthOut      = $('custom-cut-total-depth-output-id');     // new span id

  function computePavilionAngle() {
    // Default formula: angle = atan(pavilionHeight / halfDiameter) in degrees.
    // Adjust this formula to your exact geometric definition if needed.
    var h = num(pavilionHeightEl && pavilionHeightEl.value);
    var r = num(0.5);
    if (r === 0) return null;
    var angleRad = Math.atan(h / r);
    return angleRad * 180 / Math.PI;
  }

  function computeTotalDepthPercent() {
    // total depth (%) = (crownHeight + pavilionHeight + girdleThickness) * 100
    var crown = num(crownHeightEl && crownHeightEl.value);
    var pav   = num(pavilionHeightEl && pavilionHeightEl.value);
    var girdle= num(girdleThicknessEl && girdleThicknessEl.value);
    return (crown + pav + girdle) * 100;
  }

  function formatAngle(a) {
    return a == null || isNaN(a) ? '—' : (a.toFixed(1) + '°');
  }
  function formatPercent(p) {
    return p == null || isNaN(p) ? '—' : (p.toFixed(1) + '%');
  }

  function updateOutputs() {
    if (pavilionAngleOut) pavilionAngleOut.textContent = formatAngle(computePavilionAngle());
    if (totalDepthOut) totalDepthOut.textContent = formatPercent(computeTotalDepthPercent());
  }

  // Attach listeners to existing sliders (if present)
  [crownHeightEl, pavilionHeightEl, pavilionRatioEl, girdleThicknessEl].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', updateOutputs);
    el.addEventListener('change', updateOutputs);
  });

  // Initialize once DOM is ready (if script loaded in head)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateOutputs);
  } else {
    updateOutputs();
  }

  // Also expose a manual updater if other parts of app change values programmatically:
  window.__customControlsUpdateOutputs = updateOutputs;
})();
// === Range definitions (yours unchanged) ===
const depthRanges = { ideal:[[58.5,62.5]], excellent:[[58,58.49],[62.51,63.5]], veryGood:[[55,57.99],[63.51,65.5]], good:[[53,54.99],[65.51,69]] };
const tableRanges = { ideal:[[53.5,59.5]], excellent:[[53,53.49],[59.51,63]], veryGood:[[52,52.99],[63.01,66]], good:[[50,51.99],[66.01,70]] };
const crownPctRanges = { ideal:[[13,16]], excellent:[[12,12.99],[16.01,16.5]], veryGood:[[10,11.99],[16.51,17.5]], good:[[8.5,9.99],[17.51,19]] };
const crownAngRanges = { ideal:[[33,36]], excellent:[[31.5,32.99],[36.01,36.5]], veryGood:[[28.5,31.49],[36.51,38]], good:[[26,28.49],[38.01,40]] };
const pavPctRanges = { ideal:[[42.5,44]], excellent:[[42,42.49],[44.01,44.5]], veryGood:[[41.5,41.99],[44.51,45]], good:[[41,41.4],[45.01,46.5]] };
const pavAngRanges = { ideal:[[40.5,41.3]], excellent:[[40,40.49],[41.31,41.7]], veryGood:[[39.7,39.99],[41.71,42.3]], good:[[39.4,39.69],[42.31,42.9]] };
const girdleRanges = { ideal:[[2.0,4.2]], excellent:[[1.6,1.99],[4.21,4.7]], veryGood:[[0.3,1.59],[4.71,6.0]], good:[[0.2,0.29],[6.01,8.0]] };
const starRanges = { ideal:[[51,59.99]], excellent:[[45,50.99],[60,65.99]], veryGood:[[40,44.99],[66,70.99]], good:[[35,39.99],[71,75]] };
const pavRatRanges = { ideal:[[75,79.99]], excellent:[[70,74.99],[80,85.99]], veryGood:[[65,69.99],[86,90.99]], good:[[60,64.99],[91,95]] };
const gradeOrder = ["Idx","Ex","VG","Gd","F"];

function colorForGrade(grade) {
  switch(grade) {
    case "Idx": return "darkgreen";
    case "Ex": return "green";
    case "VG": return "goldenrod";
    case "Gd": return "yellow";
    case "F": return "red";
    default: return "black";
  }
}

function gradeValue(val, ranges) {
  const inRange = (v, r) => v >= r[0] && v <= r[1];
  if (ranges.ideal?.some(r => inRange(val, r))) return "Idx";
  if (ranges.excellent?.some(r => inRange(val, r))) return "Ex";
  if (ranges.veryGood?.some(r => inRange(val, r))) return "VG";
  if (ranges.good?.some(r => inRange(val, r))) return "Gd";
  return "F";
}

function animateGrade(el, newGrade) {
  if (!el) return;
  const oldGrade = el.textContent;
  if (oldGrade !== newGrade) {
    el.textContent = newGrade;
    el.style.color = colorForGrade(newGrade);
    el.classList.add("updated");
    setTimeout(() => el.classList.remove("updated"), 200);
  }
}

function setGrade(id, val, ranges) {
  const el = document.getElementById(id);
  if (!el) return;
  const grade = gradeValue(val, ranges);
  el.textContent = grade;
  el.style.color = colorForGrade(grade);
}

// === MAIN UPDATE FUNCTION ===
function updateGrades() {
  const totalDepth = parseFloat(document.getElementById("custom-cut-total-depth-output-id").textContent) || 60;
  const crownHeight = parseFloat(document.getElementById("custom-cut-crown-height-range-id").value) * 100; // to %
  const crownAngle = parseFloat(document.getElementById("custom-cut-crown-angle-value-id").textContent) || 34;
  const table = parseFloat(document.getElementById("custom-cut-crown-table-range-id").value) * 100;
  const star = parseFloat(document.getElementById("custom-cut-crown-ratio-range-id").value) * 100;
  const pavHeight = parseFloat(document.getElementById("custom-cut-pavillion-height-range-id").value) * 100;
  const pavRatio = parseFloat(document.getElementById("custom-cut-pavillion-ratio-range-id").value) * 100;
  const pavAngle = parseFloat(document.getElementById("custom-cut-pavillion-angle-output-id").textContent) || 41;
  const girdle = parseFloat(document.getElementById("custom-cut-girdle-thickness-range-id").value) * 100;

  setGrade("gradeTotalDepth", totalDepth, depthRanges);
  setGrade("gradeCrownHeight", crownHeight, crownPctRanges);
  setGrade("gradeCrownAngle", crownAngle, crownAngRanges);
  setGrade("gradeCrownTable", table, tableRanges);
  setGrade("gradeCrownRatio", star, starRanges);
  setGrade("gradeGirdleThickness", girdle, girdleRanges);
  setGrade("gradePavillionHeight", pavHeight, pavPctRanges);
  setGrade("gradePavillionRatio", pavRatio, pavRatRanges);
  setGrade("gradePavillionAngle", pavAngle, pavAngRanges);

  // Individual grades
  const gTotalDepth = gradeValue(totalDepth, depthRanges);
  const gCrownHeight = gradeValue(crownHeight, crownPctRanges);
  const gCrownAngle = gradeValue(crownAngle, crownAngRanges);
  const gTable = gradeValue(table, tableRanges);
  const gStar = gradeValue(star, starRanges);
  const gPavHeight = gradeValue(pavHeight, pavPctRanges);
  const gpavRatio = gradeValue(pavRatio, pavRatRanges);
  const gPavAngle = gradeValue(pavAngle, pavAngRanges);
  const gGirdle = gradeValue(girdle, girdleRanges);

  // Apply animations
  animateGrade(document.getElementById("gradeTotalDepth"), gTotalDepth);
  animateGrade(document.getElementById("gradeCrownHeight"), gCrownHeight);
  animateGrade(document.getElementById("gradeCrownAngle"), gCrownAngle);
  animateGrade(document.getElementById("gradeCrownTable"), gTable);
  animateGrade(document.getElementById("gradeCrownRatio"), gStar);
  animateGrade(document.getElementById("gradeGirdleThickness"), gGirdle);
  animateGrade(document.getElementById("gradePavillionHeight"), gPavHeight);
  animateGrade(document.getElementById("gradePavillionRatio"), gpavRatio);
  animateGrade(document.getElementById("gradePavillionAngle"), gPavAngle);

  // Determine overall grade (worst = lowest in order)
  const allGrades = [gTotalDepth,gCrownHeight, gCrownAngle, gTable, gStar, gPavHeight, gpavRatio, gPavAngle, gGirdle];
  let worst = "Idx";
  allGrades.forEach(g => {
    if (gradeOrder.indexOf(g) > gradeOrder.indexOf(worst)) worst = g;
  });

  // Animate Final Cut Grade
  const finalEl = document.getElementById("finalGrade");
  if (finalEl) {
    const old = finalEl.textContent;
    const text = "Final Cut Grade: " + worst;
    if (old !== text) {
      finalEl.textContent = text;
      finalEl.style.color = colorForGrade(worst);
      finalEl.classList.add("updated");
      setTimeout(() => finalEl.classList.remove("updated"), 250);
    }
  }
}

// === Bind event listeners ===
document.querySelectorAll("input[type='range']").forEach(slider => {
  slider.addEventListener("input", updateGrades);
});

// Initialize
updateGrades();
