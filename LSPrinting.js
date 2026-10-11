
function previewImage(event) {
            const file = event.target.files[0];
            const preview = document.getElementById("preview");

            if (file && file.type.startsWith("image/")) {
                preview.src = URL.createObjectURL(file);
                preview.hidden = false;
            } else {
                preview.removeAttribute("src");
                preview.hidden = true;
            }
        }


