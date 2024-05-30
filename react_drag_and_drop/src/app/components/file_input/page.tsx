'use client';
import gridStyles from '../../page.module.scss'; // Grid item rulesets are in the main file for better organization
import fileInputStyles from './FileInput.module.scss';
import { useState, useRef } from 'react';
import { checkIfImage, checkFileSize } from '../../../utilities/file_utils';
import { ErrorObject, ImageInputProps } from '../../../types/interfaces';

export default function FileInput({ imageArray, processAddImages, removeImage }: ImageInputProps) {
    const [hoverClass, setHoverClass] = useState(false);
    const [errorObj, setErrorObj] = useState<ErrorObject>({});
    const imageInputRef = useRef<HTMLInputElement>(null);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const imageArrayLength = imageArray ? imageArray.length : 0;
        if (e.target.files) {
            if (e.target.files.length + imageArrayLength > 3) {
                // Maximum of 3 images can be uploaded so check the number of images already loaded plus the number being uploaded
                setErrorObj(v => ({...v, numberExceededError: true}));
            } else {
                const inputFileArray: File[] = Array.from(e.target.files);
                const sizeValid = checkFileSize(inputFileArray);
                // Built in file picker can filter out non-image files by default
                if (sizeValid) {
                    processAddImages(inputFileArray); // Adds to (parent) form component state
                    setErrorObj({});
                } else if (!sizeValid) {
                    setErrorObj((v) => {return {...v, sizeError: true}});
                }
            }
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const imageArrayLength = imageArray ? imageArray.length : 0;
        const transferFile: File[] = Array.from(e.dataTransfer.files);
        if (transferFile.length + imageArrayLength > 3) {
            setErrorObj(v => ({...v, numberExceededError: true}));
        } else {
            const formatValid = checkIfImage(transferFile); // input's accept attribute won't work for drop zone
            const sizeValid = checkFileSize(transferFile);
            if (formatValid && sizeValid) {
                processAddImages(transferFile);
                setErrorObj({});
            } else if (!sizeValid) {
                setErrorObj((v) => {return {...v, sizeError: true}});
            } else if (!formatValid) {
                setErrorObj((v) => {return {...v, formatError: true}});                
            }
            setHoverClass(false);
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
            <div
                data-testid='dropZone'
                className={hoverClass ? [ gridStyles.imageDropZone, fileInputStyles.imageDropZone_hover].join(' ') : gridStyles.imageDropZone}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => {setHoverClass(true)}}
                onDragLeave={() => {setHoverClass(false)}}
            >
                {
                    imageArray?.map(file => {
                        return (
                            <div className={fileInputStyles.filePreviewContainer} key={file.name}>
                                <div className={fileInputStyles.filePreview}>{file.name}</div>
                                <button
                                    className={fileInputStyles.removeFileButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeImage(file);
                                    }}
                                >&#10005;</button>
                            </div>
                        )
                    })
                }
                {
                    (!imageArray || imageArray?.length === 0) &&
                    <div className={fileInputStyles.imageDragPrompt}>Drag up to 3 photos here</div>
                }
            </div>
            {errorObj.formatError && <div className={gridStyles.imageErrorMsg}>File must be an image</div>}
            {errorObj.sizeError && <div className={gridStyles.imageErrorMsg}>File must be less than 4MB</div>}
            {errorObj.numberExceededError && <div className={gridStyles.imageErrorMsg}>Only 3 images can be uploaded</div>}
            <label
                htmlFor='imageInputId'
                className={['button', gridStyles.imageInputLabel].join(' ')}
                tabIndex={0}
                onKeyDown={handleInputKeyDown}
            >Select from files</label>
            <input
                type='file'
                hidden={true}
                ref={imageInputRef}
                id='imageInputId'
                className={fileInputStyles.imageInput}
                name='images'
                accept='image/*, .jpeg, .jpg, .png'
                multiple={true}
                onChange={handleInputChange}
                aria-invalid={errorObj?.formatError || errorObj?.sizeError || errorObj?.numberExceededError}
            />
        </>
    )
}
