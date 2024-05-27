export function checkIfImage(files: File[]) {
    // Superficial client-side validation
    const areImages = files.every(file => file.type.split('/')[0] === 'image');
    return areImages;
}

export function checkFileSize(files: File[]) {
    // Superficial client-side validation
    const sizeOk = files.every(file => file.size < 4000000);
    return sizeOk;
}