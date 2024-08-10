'use client';
import ImageForm from "./components/image_form/page";

export default function ParentComponent() {
  return (
    <ImageForm
      numberOfImages={3}
    />
  );
}
