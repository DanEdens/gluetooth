const eventDataHistogramDisplay = document.getElementById('eventDataHistogramDisplay');

let previousUi8a = new Uint8Array(60);
previousUi8a.fill(0);

let histogramValues        = Array.from(previousUi8a);
let histogramElapsedCycles = 0;

const updateHistogram = ui8a => {
    const diffValues = [].slice.call(ui8a).map((v, i) => Math.abs(previousUi8a[i] - v));

    diffValues.forEach((v, i) => histogramValues[i] += v);

    previousUi8a = ui8a;

    drawHistogram();

    histogramElapsedCycles++;
    if (histogramElapsedCycles > 600) {
        const a = new Uint8Array(60);
        a.fill(0);
        histogramValues = Array.from(a);

        histogramElapsedCycles = 0;
    }
};

const ctx       = eventDataHistogramDisplay.getContext('2d');
ctx.strokeStyle = 'red';
ctx.lineWidth   = 1;
ctx.font        = '8px sans-serif';

const CANVAS_WIDTH  = 1200;
const CANVAS_HEIGHT = 200;
const binWidth      = CANVAS_WIDTH / 60;

const drawHistogram = () => {
    const maxValue = Math.max.apply(Math, histogramValues);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.moveTo(0, CANVAS_HEIGHT);

    ctx.beginPath();
    histogramValues.forEach(
        (v, i) => {
            //ctx.lineTo(i * binWidth, CANVAS_HEIGHT - 2 * Math.log2(v));
            ctx.lineTo(i * binWidth, 100 * (v / maxValue) + 100);
            ctx.strokeText(i, i * binWidth - 3, 10);
        }
    );

    ctx.stroke();
};