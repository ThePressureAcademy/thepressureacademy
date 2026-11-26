// The visible size tables are the only source of dimensions, including for cropped cuts.
function readCharts() {
  const charts = new Map();
  for (const guide of document.querySelectorAll("[data-fit-piece]")) {
    const table = guide.querySelector("table");
    const widthColumn = table.querySelector('[data-measure="width"]').cellIndex;
    const lengthColumn = table.querySelector('[data-measure="length"]').cellIndex;
    const sizes = Array.from(table.tBodies[0].rows, row => ({
      size: row.cells[0].textContent.trim(),
      width: Number(row.cells[widthColumn].textContent),
      length: Number(row.cells[lengthColumn].textContent),
    }));
    charts.set(guide.dataset.fitPiece, sizes);
  }
  return charts;
}

// Prefer the requested chart size. Otherwise match chest width first, then body length.
export function compareGarmentFit(sizes, requestedSize, width, length) {
  if (!sizes.length) return null;
  const requested = requestedSize.trim().toUpperCase().replace(/^XXL$/, "2XL").replace(/^XXXL$/, "3XL");
  const chosen = sizes.find(row => row.size === requested);
  if (chosen) return { row: chosen, basis: "your preferred size" };
  if (!width && !length) return null;
  const ranked = [...sizes].sort((a, b) => {
    const byWidth = width && (Math.abs(a.width - width) - Math.abs(b.width - width));
    const byLength = length && (Math.abs(a.length - length) - Math.abs(b.length - length));
    return byWidth || byLength || 0;
  });
  return { row: ranked[0], basis: width ? "nearest listed chest width" : "nearest listed body length" };
}

function difference(chartValue, reference, larger, smaller, dimension) {
  const delta = Math.round((chartValue - reference) * 10) / 10;
  return delta ? Math.abs(delta) + " cm " + (delta > 0 ? larger : smaller) : "the same " + dimension;
}

export function initApparelFit(form) {
  const charts = readCharts();
  const { product, size, reference_chest_width_cm: chest, reference_body_length_cm: body } = form.elements;
  const result = form.querySelector("[data-fit-result]");
  const description = result.querySelector("[data-fit-description]");
  const use = result.querySelector("[data-use-fit-size]");
  const list = form.querySelector("#apparel-chart-sizes");
  const guidance = form.querySelector("[data-fit-guidance]");
  let previousProduct;
  function update() {
    const sizes = charts.get(product.value);
    if (product.value !== previousProduct) {
      list.replaceChildren(...(sizes || []).map(row => new Option(row.size)));
      guidance.textContent = sizes
        ? "See how the chart compares before sending your request."
        : "We’ll include your measurements in this request.";
      previousProduct = product.value;
    }
    const width = chest.validity.valid && chest.valueAsNumber > 0 ? chest.valueAsNumber : null;
    const length = body.validity.valid && body.valueAsNumber > 0 ? body.valueAsNumber : null;
    const match = sizes && compareGarmentFit(sizes, size.value, width, length);
    use.hidden = true;
    result.hidden = !match && product.value !== "pt-crop-tee";
    if (!match) {
      description.textContent = result.hidden ? "" : "The crop tee’s production size chart is pending. You can request its measurements below.";
      return;
    }
    const { row, basis } = match;
    let text = row.size + " (" + basis + ") measures " + row.width + " cm across the chest and " + row.length + " cm shoulder to hem.";
    const differences = [];
    if (width) differences.push(difference(row.width, width, "wider", "narrower", "width"));
    if (length) differences.push(difference(row.length, length, "longer", "shorter", "length"));
    if (differences.length) text += " Compared with your garment, that’s " + differences.join(" and ") + ".";
    description.textContent = text;
    if (basis !== "your preferred size") {
      use.value = row.size;
      use.textContent = "Use " + row.size + " as my preferred size";
      use.hidden = false;
    }
  }
  for (const field of [product, size, chest, body]) {
    field.addEventListener("input", update);
    field.addEventListener("change", update);
  }
  use.addEventListener("click", () => {
    size.value = use.value;
    size.dispatchEvent(new Event("change", { bubbles: true }));
    size.focus();
  });
  form.addEventListener("reset", () => queueMicrotask(update));
  update();
}
