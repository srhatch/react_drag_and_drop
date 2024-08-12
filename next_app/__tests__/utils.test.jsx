import { formDataFromObject } from '../src/utilities/utils';
import { it, expect } from '@jest/globals';
import generateTestFile from './gen_test_files';

const testInputObject = {
    images: [generateTestFile('iAmAJpeg', 'image/jpeg', 3000000), generateTestFile('iAmAPng', 'image/png', 3999999)]
}

it('should return a FormData object', () => {
    expect(formDataFromObject(testInputObject)).toBeInstanceOf(FormData);
});
test('multiple images are separate FormData entries', () => {
    // Image uploads need to be separate FormData entries, so make sure each array element is an entry
    const formData = formDataFromObject(testInputObject);
    const imagesEntries = formData.getAll('images');
    expect(imagesEntries).toHaveLength(2);
})