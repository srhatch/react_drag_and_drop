export interface ErrorObject {
    formatError?: boolean;
    numberExceededError?: boolean;
    sizeError?: boolean;
}

export interface UrlFile extends File {
    // The objectUrl can be stored directly on the image File object
    browserUrl?: string;
}

export interface ImageInputProps {
    // For ImageInput component
    imageArray: UrlFile[] | undefined;
    processAddImages: (imageArray: File[]) => void;
    removeImage: (imageFile: UrlFile) => void;
}

export interface ImageDisplayProps {
    // For ImageDisplay component
    imageArray: UrlFile[];
}

export interface FormValues {
    // State object for main Form component
    images: UrlFile[];
}
