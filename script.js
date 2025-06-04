const barsContainer = document.getElementById("bars");
const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const newArrayBtn = document.getElementById("newArray");
const startBtn = document.getElementById("start");
const algorithmSelect = document.getElementById("algorithm");
const userArrayInput = document.getElementById("userArrayInput");
const setUserArrayBtn = document.getElementById("setUserArray");

let array = [];
let delay = 50;
let isSorting = false;

// Utility to sleep for ms
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateArray(size) {
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 330) + 20);
  }
  renderArray();
}

function renderArray(
  highlightIndices = [],
  compareIndices = [],
  sortedIndices = []
) {
  barsContainer.innerHTML = "";
  const size = array.length;
  array.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = value + "px";
    bar.style.width = 100 / size + "%";
    if (compareIndices.includes(idx)) {
      bar.classList.add("comparing");
    }
    if (highlightIndices.includes(idx)) {
      bar.classList.add("swapping");
    }
    if (sortedIndices.includes(idx)) {
      bar.classList.add("sorted");
    }
    barsContainer.appendChild(bar);
  });
}

sizeSlider.addEventListener("input", () => {
  sizeValue.textContent = sizeSlider.value;
  generateArray(sizeSlider.value);
});
speedSlider.addEventListener("input", () => {
  speedValue.textContent = speedSlider.value;
  delay = speedSlider.value;
});

newArrayBtn.addEventListener("click", () => {
  generateArray(sizeSlider.value);
  userArrayInput.value = "";
});

setUserArrayBtn.addEventListener("click", () => {
  const userInput = userArrayInput.value.trim();
  if (userInput) {
    const userArr = userInput
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num) && num >= 1);
    if (userArr.length > 0) {
      array = userArr;
      sizeSlider.value = array.length;
      sizeValue.textContent = array.length;
      renderArray();
    } else {
      alert("Please enter a valid, comma-separated list of numbers.");
    }
  }
});

startBtn.addEventListener("click", async () => {
  if (isSorting) return;
  isSorting = true;
  startBtn.disabled = true;
  newArrayBtn.disabled = true;
  sizeSlider.disabled = true;
  algorithmSelect.disabled = true;
  setUserArrayBtn.disabled = true;
  userArrayInput.disabled = true;
  switch (algorithmSelect.value) {
    case "bubble":
      await bubbleSort();
      break;
    case "selection":
      await selectionSort();
      break;
    case "quick":
      await quickSort(0, array.length - 1);
      renderArray(
        [],
        [],
        Array.from({ length: array.length }, (_, i) => i)
      );
      break;
    case "merge":
      await mergeSort(0, array.length - 1);
      renderArray(
        [],
        [],
        Array.from({ length: array.length }, (_, i) => i)
      );
      break;
  }
  isSorting = false;
  startBtn.disabled = false;
  newArrayBtn.disabled = false;
  sizeSlider.disabled = false;
  algorithmSelect.disabled = false;
  setUserArrayBtn.disabled = false;
  userArrayInput.disabled = false;
});

function swap(i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

// Bubble Sort
async function bubbleSort() {
  let n = array.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      renderArray(
        [],
        [j, j + 1],
        Array.from({ length: i }, (_, k) => n - k - 1)
      );
      await sleep(delay);
      if (array[j] > array[j + 1]) {
        swap(j, j + 1);
        renderArray(
          [j, j + 1],
          [],
          Array.from({ length: i }, (_, k) => n - k - 1)
        );
        await sleep(delay);
      }
    }
  }
  renderArray(
    [],
    [],
    Array.from({ length: n }, (_, i) => i)
  );
}

// Selection Sort
async function selectionSort() {
  let n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      renderArray(
        [],
        [minIdx, j],
        Array.from({ length: i }, (_, k) => k)
      );
      await sleep(delay);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    swap(i, minIdx);
    renderArray(
      [i, minIdx],
      [],
      Array.from({ length: i + 1 }, (_, k) => k)
    );
    await sleep(delay);
  }
  renderArray(
    [],
    [],
    Array.from({ length: n }, (_, i) => i)
  );
}

// Quick Sort
async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    renderArray([], [j, high], []);
    await sleep(delay);
    if (array[j] < pivot) {
      i++;
      swap(i, j);
      renderArray([i, j], [], []);
      await sleep(delay);
    }
  }
  swap(i + 1, high);
  renderArray([i + 1, high], [], []);
  await sleep(delay);
  return i + 1;
}

// Merge Sort
async function mergeSort(l, r) {
  if (l < r) {
    let m = Math.floor((l + r) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
  }
}
async function merge(l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = [],
    R = [];
  for (let i = 0; i < n1; i++) L.push(array[l + i]);
  for (let j = 0; j < n2; j++) R.push(array[m + 1 + j]);

  let i = 0,
    j = 0,
    k = l;
  while (i < n1 && j < n2) {
    renderArray([k], [l + i, m + 1 + j], []);
    await sleep(delay);
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    k++;
  }
  while (i < n1) {
    renderArray([k], [l + i], []);
    await sleep(delay);
    array[k] = L[i];
    i++;
    k++;
  }
  while (j < n2) {
    renderArray([k], [m + 1 + j], []);
    await sleep(delay);
    array[k] = R[j];
    j++;
    k++;
  }
}

// Initial array
window.onload = () => {
  sizeValue.textContent = sizeSlider.value;
  speedValue.textContent = speedSlider.value;
  delay = speedSlider.value;
  generateArray(sizeSlider.value);
};
