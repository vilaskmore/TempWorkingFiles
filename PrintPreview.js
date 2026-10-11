
function ShowPrintPreview() {
    const content = document.querySelector(".mainSubdiv1");

    if (!content) {
        alert("Print content not found.");
        return;
    }

    // Clone the content so the original page remains unchanged.
    const printContent = content.cloneNode(true);

    // Remove action buttons from the print preview.
    printContent.querySelectorAll(".btn").forEach(button => {
        button.closest(".row")?.remove();
    });

    // Replace input fields with their current values for printing.
    printContent.querySelectorAll("input").forEach(input => {
        if (input.type === "button" || input.type === "file") {
            input.remove();
            return;
        }

        const span = document.createElement("span");
        span.textContent = input.value || "";
        span.className = "print-value";

        if (input.type === "date" && input.value) {
            span.textContent = input.value;
        }

        input.replaceWith(span);
    });

    const printWindow = window.open("", "_blank", "width=1100,height=800");

    if (!printWindow) {
        alert("Please allow pop-ups for this website to print.");
        return;
    }

    printWindow.document.open();
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Passport Print Preview</title>
            <meta charset="UTF-8">
            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 15px;
                    color: #111;
                }

                .mainSubdiv1 {
                    border: 1px solid #8AD6D1;
                    padding: 10px;
                }

                .row {
                    display: flex;
                    align-items: stretch;
                    width: 100%;
                }

                .col-md-3 {
                    width: 25%;
                }

                .col-md-6 {
                    width: 50%;
                }

                .col-md-12 {
                    width: 100%;
                }

                .divInputImageCenter {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .divHolderDetailsBorder {
                    border-left: 1px solid #8AD6D1;
                    border-right: 1px solid #8AD6D1;
                }

                .cardImage {
                    text-align: center;
                }

                .image-preview {
                    width: 120px;
                    height: 120px;
                    object-fit: contain;
                    display: block;
                    margin: 5px auto;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 5px;
                    margin-bottom: 12px;
                    padding-bottom: 6px;
                    border-bottom: 1px dotted #ccc;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    min-width: 0;
                    margin-right: 5px;
                }

                .label {
                    font-size: 10px;
                    color: #555;
                    text-transform: uppercase;
                }

                .value, .print-value {
                    font-size: 11px;
                    font-weight: bold;
                    margin-top: 3px;
                    overflow-wrap: anywhere;
                }

                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }

                @media print {
                    body {
                        margin: 0;
                    }

                    .mainSubdiv1 {
                        border: 1px solid #8AD6D1;
                    }
                }
            </style>
        </head>
        <body>
            ${printContent.outerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();

    // Wait for images and styles to load before opening print preview.
    const images = Array.from(printWindow.document.images);

    Promise.all(images.map(img => {
        if (img.complete) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    })).then(() => {
        printWindow.focus();
        printWindow.print();
    });
}
