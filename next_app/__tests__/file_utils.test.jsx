import { checkIfImage, checkFileSize } from '../src/utilities/file_utils';
import generateTestFile from './gen_test_files';
import { it, expect } from '@jest/globals';

const fileArray = [generateTestFile('iAmAJpeg', 'image/jpeg', 3000000), generateTestFile('iAmAPng', 'image/png', 3999999)];

it('should return a boolean', () => {
    const returnValue = checkIfImage(fileArray);
    expect(typeof returnValue).toBe('boolean');
})
it('should return true', () => {
    // For valid File objects
    const isImage = checkIfImage(fileArray);
    expect(isImage).toBe(true);
})
it ('should return false', () => {
    // Including an invalid File object (File is not an image/* type)
    const fileArrayUpdated = fileArray.concat(generateTestFile('notAnImage', 'text/javascript'));
    const isImage = checkIfImage(fileArrayUpdated);
    expect(isImage).toBe(false);
})
it('should return true', () => {
    // For a valid file size
    const sizeOk = checkFileSize(fileArray);
    expect(sizeOk).toBe(true);
})
it ('should return false', () => {
    // Includes a File that is too big
    const fileArrayUpdated = fileArray.concat(generateTestFile('iAmTooBig', 'image/jpeg', 4000001));
    const sizeOk = checkFileSize(fileArrayUpdated);
    expect(sizeOk).toBe(false);
})
