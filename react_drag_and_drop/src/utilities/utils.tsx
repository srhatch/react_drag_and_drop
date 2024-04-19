import { FormValues } from '../types/interfaces';

export function formDataFromObject(inputObj: FormValues) {
    const formData = new FormData();
    for (let [name, value] of Object.entries(inputObj)) {
        if (name === 'images') {
            value.forEach((image: File) => formData.append(name, image)) // Multiple images need to be included as separate entries
        } else {
            formData.append(name, value); // Other form values (not included in this demo)
        }
    }
    return formData;
}