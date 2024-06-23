import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";

const pdfPath = "./test.pdf";

let   pdfElement = document.body.querySelector("#PDF-VIEW")

// 非同期でPDFファイルを読み込み
const loadingTask = pdfjsLib.getDocument(pdfPath);
(async () => {
    const pdf = await loadingTask.promise;

    // 全てのページを取得
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 1.0;
        const viewport = page.getViewport({ scale });

        // 高DPIをサポート
        const outputScale = window.devicePixelRatio || 1;

        // PDFのページ寸法を使用してキャンバスを準備
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        // 縦並びにするためにblock要素を追加
        canvas.style.display = "block";

        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        // PDFのページをキャンバスにレンダリング
        const renderContext = {
            canvasContext: context,
            transform,
            viewport,
        };
        page.render(renderContext);

        // キャンバスをDOMに追加
        pdfElement.appendChild(canvas);
    }
})();


