export default function generateTestFile(fileName, fileType, byteSize) {
    try {
        if (typeof fileName !== 'string') {
            throw new Error('TypeError: fileName must be a string');
        }
        if (typeof fileType !== 'string') {
            throw new Error('TypeError: fileType must be a string');
        }
        const testFile = new File(['This is why server-size validation is important'], fileName, {type: fileType});
        if (byteSize) {
            if (typeof byteSize === 'number') {
                Object.defineProperty(testFile, 'size', {value: byteSize});
            } else {
                throw new Error('TypeError: size must be a number');
            }
        }
        return testFile;
    } catch (err) {
        console.error(err);
    }
}
