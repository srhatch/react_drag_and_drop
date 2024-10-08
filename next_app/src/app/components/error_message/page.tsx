import { ErrorMessageProps } from "@/types/interfaces";

export default function ErrorMessage({errorObject, className}: ErrorMessageProps) {
    const errorFor = Object.values(errorObject).findLast(value => !!value); // Using findLast will get the most recent error message
    const errorMsg = calcErrorMsg(errorFor || '');
    return (
        <div className={className}>{ errorMsg }</div>
    )
}

// Helper functions
function calcErrorMsg(errorFor: string) {
    switch(errorFor) {
        case 'formatError':
            return 'File must be an image';
        case 'sizeError':
            return 'File must be less than 4MB';
        case 'numberExceededError':
            return 'Only 3 images can be uploaded';
        default:
            return '';
    }
}