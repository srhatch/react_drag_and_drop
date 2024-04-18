export interface ErrorObject {
    formatError?: boolean;
    numberExceededError?: boolean;
    sizeError?: boolean;
}

export interface ImageInputProps {
    imageArray: File[] | undefined;
    processAddImages: (imageArray: File[]) => void;
    removeImage: (imageFile: string) => void;
}

export interface ImageDisplayProps {
    imageArray: UrlFile[];
}

export interface FormValues {
    images: File[];
}

export interface UrlFile extends File {
    // The objectUrl can be stored directly on the image File object
    browserUrl?: string;
}