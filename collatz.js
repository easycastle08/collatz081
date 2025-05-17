const canvas = document.getElementById("collatzChart");
const ctx = canvas.getContext("2d");

const chartConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: []
  },
  options: {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#0f172a" }
      },
      title: {
        display: true,
        text: "콜라츠 수열 시각화",
        color: "#0f172a",
        font: { size: 18 }
      },
      datalabels: {
        color: "#000",
        font: { weight: "bold", size: 10 },
        align: "top",
        formatter: value => value
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: null, // 👈 마우스 클릭 드래그로 이동 가능
          onPanStart: () => document.body.style.cursor = 'grabbing',
          onPanComplete: () => document.body.style.cursor = 'default'
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x"
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "반복 단계",
          color: "#0f172a"
        },
        ticks: { color: "#0f172a" }
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "값",
          color: "#0f172a"
        },
        ticks: { color: "#0f172a" }
      }
    }
  },
  plugins: [ChartDataLabels]
};

const collatzChart = new Chart(ctx, chartConfig);

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  return (
    "#" +
    Array.from({ length: 6 })
      .map(() => letters[Math.floor(Math.random() * 16)])
      .join("")
  );
}

function generateCollatzSequence(n) {
  const sequence = [n];
  while (n !== 1) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    sequence.push(n);
  }
  return sequence;
}

document.getElementById("collatzForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("numberInput");
  const num = parseInt(input.value);
  if (isNaN(num) || num < 1) return;

  const sequence = generateCollatzSequence(num);
  const color = getRandomColor();

  collatzChart.data.datasets.push({
    label: `${num}의 수열`,
    data: sequence,
    borderColor: color,
    backgroundColor: color + "55",
    fill: false,
    tension: 0,
    pointRadius: 3,
    pointHoverRadius: 6
  });

  const maxLength = Math.max(...collatzChart.data.datasets.map(d => d.data.length));
  const pointSpacing = 50;
  const newCanvasWidth = Math.max(maxLength * pointSpacing, 800);
  canvas.style.width = newCanvasWidth + "px";
  canvas.width = newCanvasWidth;

  collatzChart.data.labels = Array.from({ length: maxLength }, (_, i) => i);
  collatzChart.resize();
  collatzChart.update();

  input.value = "";

  const max = Math.max(...sequence);
  const steps = sequence.length - 1;
  const infoBox = document.getElementById("infoContainer");
  const html = `<p><strong>${num}</strong> → 반복 횟수: <strong>${steps}</strong>회, 최댓값: <strong>${max}</strong></p>`;
  infoBox.insertAdjacentHTML("beforeend", html);
});

document.getElementById("resetButton").addEventListener("click", function () {
  collatzChart.data.datasets = [];
  collatzChart.data.labels = [];
  document.getElementById("infoContainer").innerHTML = "";
  canvas.style.width = "800px";
  canvas.width = 800;
  collatzChart.options.scales.y.type = "linear";
  document.getElementById("logScaleToggle").checked = false;
  collatzChart.resetZoom();
  collatzChart.update();
});

document.getElementById("logScaleToggle").addEventListener("change", function () {
  const isLog = this.checked;
  collatzChart.options.scales.y.type = isLog ? "logarithmic" : "linear";
  collatzChart.update();
});
