'use client';
import styles from "./page.module.scss";
import { useState } from 'react';
import ImageDisplay from './components/file_input/page';
import { FormValues } from '../types/interfaces';
// import FileInput

export default function ImageForm() {
  const [formValues, setFormValues] = useState<FormValues>({images: []});
  console.log(formValues)
  return (
    <form>
      <ImageDisplay imageArray={formValues.images} setImageArray={setFormValues} />
    </form>
  );
}
