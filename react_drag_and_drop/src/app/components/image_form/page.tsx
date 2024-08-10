import styles from "./ImageForm.module.scss";
import { useState, useEffect, createContext } from 'react';
import FileInput from '../file_input/page';
import { FormContextInterface, FormValues, ImageFormProps, UrlFile } from "@/types/interfaces";
import { formDataFromObject } from "@/utilities/utils";

export const FormContext = createContext<FormContextInterface | null>(null);

export default function ImageForm({ numberOfImages }: ImageFormProps ) {
  const [formValues, setFormValues] = useState<FormValues>({images: []});

  useEffect(() => {
    // Prevent the browser default "+" sign from showing next to the mouse when dragging a file across the page
    const dragoverListener = (e: Event) => e.preventDefault();
    const dropListener = (e: Event) => e.preventDefault();
    document.addEventListener('dragover', dragoverListener);
    document.addEventListener('drop', dropListener);
    return () => {
      document.removeEventListener('dragover', dragoverListener);
      document.removeEventListener('drop', dropListener);
    }
  }, []);

  function processAddImages(imageArray: File[], slotsNumber: number[]) {
    const availableSlots = calcAvailableSlots(formValues, slotsNumber);
    const imageArrayUrls = imageArray.map((file: File, index: number) => {
      Object.defineProperty(file, 'browserUrl', {
        value: URL.createObjectURL(file), // Used in <img> tag to render the image
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(file, 'dropZone', {
        value: availableSlots[index],
        enumerable: true
      })
      return file;
    });
    setFormValues((formValues: FormValues) => (
      {...formValues, images: [...formValues.images, ...imageArrayUrls]}
    ))
  }

  function removeImage(deleteFile: UrlFile) {
    const filteredImages = formValues.images.filter((file: UrlFile) => file.name !== deleteFile.name);
    setFormValues((formValues: FormValues) => (
      {...formValues, images: filteredImages}
      ));
  }

  function handleFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    formValues.images.forEach((file: UrlFile) => {
      // File objects will not be garbage collected if the object URL still exists
      if (file.browserUrl) URL.revokeObjectURL(file.browserUrl)
    })
    const formData = formDataFromObject(formValues);
    console.log([...formData]) // I changed the Typescript target to ES6 just to make displaying this easier by using the spread operator on FormData
    // Fetch to API endpoint
  }

  const contextValues = {
    addImage: processAddImages,
    removeImage: removeImage,
    numberOfImages: numberOfImages,
    imageArray: formValues.images,
    slotsArray: calcSlotsArray(numberOfImages)
  }

  return (
    <FormContext.Provider value={contextValues}>
      <div className={styles.mainContainer}>
        <form className={styles.imageForm} onSubmit={handleFormSubmit}>
          <FileInput />
          <input className={['button', styles.submitButton].join(' ')} type='submit' value='Submit' />
        </form>
      </div>
    </FormContext.Provider>
  );
}

// Helper functions
function calcSlotsArray(slots: number) {
    const array = [];
    for (let i = 0; i < slots; i++) {
        array.push(i + 1);
    }
    return array;
    //return Array.from({length: slots}, (_, i) => i + 1);
}

function calcAvailableSlots(formValues: FormValues, slotsNumber: number[]): number[] {
    const takenSlots = formValues.images.map((file: UrlFile) => file.dropZone);
    const availableSlots: number[] = [];
    for (let slot of slotsNumber) {
      if (!takenSlots.includes(slot as number)) {
        availableSlots.push(slot);
      }
    }
    return availableSlots;
  }