'use client';
import styles from "./page.module.scss";
import { useState } from 'react';
import ImageDisplay from './components/file_input/page';
// import FileInput

export default function ImageForm() {
  const [formValues, setFormValues] = useState({});
  return (
    <form>
      <ImageDisplay/>
    </form>
  );
}
