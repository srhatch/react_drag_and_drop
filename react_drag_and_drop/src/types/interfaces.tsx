import { SetStateAction } from "react";

export interface ErrorObject {
    formatError?: boolean;
    numberExceededError?: boolean;
    sizeError?: boolean;
}

export interface FileInputProps {
    imageArray: File[] | undefined;
    setImageArray: React.Dispatch<SetStateAction<any>>
}

export interface FormValues {
    images: File[];
}