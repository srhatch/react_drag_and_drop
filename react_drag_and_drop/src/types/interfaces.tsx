// Component prop interfaces
export interface ImageFormProps {
    numberOfImages: number;
}

export interface DropZoneProps {
    // For ImageDisplay component
    setErrorObj: React.Dispatch<React.SetStateAction<ErrorObject>>;
}

// Context interfaces
export interface FormContextInterface {
    addImage: (imageArray: File[], slotsNumber: number[]) => void;
    removeImage: (deleteFile: UrlFile) => void;
    imageArray: File[];
    slotsArray: number[];
    numberOfImages: number;
}

// State interfaces
export interface FormValues {
    // State object for main Form component
    images: UrlFile[];
}

// Other object interfaces
export interface ErrorObject {
    formatError?: string | undefined;
    numberExceededError?: string | undefined;
    sizeError?: string | undefined;
}

export interface UrlFile extends File {
    // Allows the objectUrl to be stored directly on the image File object
    browserUrl?: string;
    dropZone?: number;
}
