export function checkIfImage(files: File[]) {
    // Superficial client-side validation
    for (let file of files) {
        if (file.type.split('/')[0] == 'image') {
            return false;
        } else {
            return true;
        }
    }
}

export function checkFileSize(files: File[]) {
    // Superficial client-side validation
    for (let file of files) {
        if (file.size > 4000000) {
            return true;
        } else {
            return false;
        }
    }
}