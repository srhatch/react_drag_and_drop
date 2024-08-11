'use client';
import gridStyles from '../image_form/ImageForm.module.scss'; // Grid item rulesets are in the main file for better organization
import { useState, useRef, useContext } from 'react';
import { checkFileSize } from '@/utilities/file_utils';
import { ErrorObject } from '@/types/interfaces';
import DropZone from '../drop_zone/page';
import { FormContext } from '../image_form/page';
import ErrorMessage from '../error_message/page';

export default function FileInput() {
    const [errorObj, setErrorObj] = useState<ErrorObject>({});
    const imageInputRef = useRef<HTMLInputElement>(null);
    const context = useContext(FormContext);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const imageArrayLength = context?.imageArray.length || 0;
        const numberOfImages = context?.numberOfImages || 0;
        const inputFiles = e.target.files;
        if (inputFiles) {
            if (inputFiles.length + imageArrayLength > numberOfImages) {
                // Check the number of images already loaded plus the number being uploaded 
                setErrorObj(v => ({...v, numberExceededError: 'numberExceededError'}));
            } else {
                const inputFileArray: File[] = Array.from(inputFiles);
                const sizeValid = checkFileSize(inputFileArray);
                // Built in file picker can filter out non-image files by default
                if (!sizeValid) {
                    setErrorObj((v) => {return {...v, sizeError: 'sizeError'}});
                    return;
                }
                context?.addImage(inputFileArray, context.slotsArray); // Adds to (parent) form component state
                setErrorObj({});
            }
        }
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLLabelElement>) {
        // Make file picker open with enter key
        e.preventDefault();
        if (e.key === 'Enter') {
            (e.target as HTMLElement).click()
        }
    }

    return (
        <>
            <h3 className={gridStyles.formTitle}>Drag up to {context?.numberOfImages} images</h3>
            <DropZone setErrorObj={setErrorObj} />
            <label
                htmlFor='imageInputId'
                className={['button', gridStyles.imageInputLabel].join(' ')}
                tabIndex={0}
                onKeyDown={handleInputKeyDown}
            >Select from files</label>
            <ErrorMessage
                errorObject={errorObj}
                className={gridStyles.imageErrorMsg}
            />
            <input
                type='file'
                hidden={true}
                ref={imageInputRef}
                id='imageInputId'
                name='images'
                accept='image/*, .jpeg, .jpg, .png'
                multiple={true}
                onChange={handleInputChange}
                aria-invalid={!!errorObj?.formatError || !!errorObj?.sizeError || !!errorObj?.numberExceededError}
            />
        </>
    )
}
