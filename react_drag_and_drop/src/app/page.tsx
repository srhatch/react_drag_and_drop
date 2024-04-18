'use client';
import styles from "./page.module.scss";
import { useState, useEffect } from 'react';
import FileInput from './components/file_input/page';
import ImageDisplay from './components/image_dispay/page';
import { FormValues, UrlFile } from '../types/interfaces';

export default function ImageForm() {
  const [formValues, setFormValues] = useState<FormValues>({images: []});
  //console.log(formValues)

  useEffect(() => {
    // Prevent the browser default "+" sign from showing next to the mouse when dragging a file across the page
    document.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
  }, [])

  function processAddImages(imageArray: File[]) {
    const imageArrayUrls = imageArray.map(file => {
      const browserUrl = URL.createObjectURL(file);
      const imageFile: UrlFile = file;
      imageFile.browserUrl = browserUrl;
      return imageFile;
    })
    setFormValues((formValues: FormValues) => (
      {...formValues, images: [...formValues.images, ...imageArrayUrls]}
    ))
  }

  function removeImage(fileName: string) {
    const filteredImages = formValues.images.filter(file => file.name !== fileName);
    setFormValues((formValues: FormValues) => (
      {...formValues, images: filteredImages}
      ));
  }

  return (
    <div className={styles.mainContainer}>
      <form>
        <FileInput imageArray={formValues.images} processAddImages={processAddImages} removeImage={removeImage} />
      </form>
      <ImageDisplay imageArray={formValues.images}/>
    </div>
  );
}
