'use client';
import styles from "./page.module.scss";
import { useState, useEffect } from 'react';
import FileInput from './components/file_input/page';
import ImageDisplay from './components/image_dispay/page';
import { FormValues, UrlFile } from '../types/interfaces';
import { formDataFromObject } from '../utilities/utils';

export default function ImageForm() {
  const [formValues, setFormValues] = useState<FormValues>({images: []});

  useEffect(() => {
    // Prevent the browser default "+" sign from showing next to the mouse when dragging a file across the page
    document.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
  }, [])

  function processAddImages(imageArray: File[]) {
    const imageArrayUrls = imageArray.map((file: File) => {
      Object.defineProperty(file, 'browserUrl', {
        value: URL.createObjectURL(file),
        enumerable: true
      });
      return file;
    })
    setFormValues((formValues: FormValues) => (
      {...formValues, images: [...formValues.images, ...imageArrayUrls]}
    ))
  }

  function removeImage(deleteFile: UrlFile) {
    const filteredImages = formValues.images.filter((file: UrlFile) => file.name !== deleteFile.name);
    if (deleteFile.browserUrl) URL.revokeObjectURL(deleteFile.browserUrl);
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
    console.log([...formData]) // I changed the Typescript target to ES6 just to make displaying this easier
    // Fetch to API endpoint
  }

  return (
    <div className={styles.mainContainer}>
      <form onSubmit={handleFormSubmit}>
        <FileInput imageArray={formValues.images} processAddImages={processAddImages} removeImage={removeImage} />
        <input className={['button', styles.submitButton].join(' ')} type='submit' value='Submit' />
      </form>
      <ImageDisplay imageArray={formValues.images}/>
    </div>
  );
}
