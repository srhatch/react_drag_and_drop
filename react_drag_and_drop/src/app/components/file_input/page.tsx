'use client';
import styles from './FileInput.module.scss';
import { useState, useRef } from 'react';
import { checkIfImage, checkFileSize } from '../../../utilities/file_utils';
import { ErrorObject, ImageInputProps } from '../../../types/interfaces';

export default function FileInput({ imageArray, processAddImages, removeImage }: ImageInputProps) {
    const [hoverClass, setHoverClass] = useState(false);
    const [errorObj, setErrorObj] = useState<ErrorObject>({});
    const imageInputRef = useRef<HTMLInputElement>(null);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (imageArray && imageArray.length > 2) {
            setErrorObj(v => ({...v, numberExceededError: true}));
        } else {
            if (e.target.files) {
                const inputFileArray: File[] = Array.from(e.target.files);
                const sizeValid = checkFileSize(inputFileArray);
                if (sizeValid) {
                    processAddImages(inputFileArray);
                    setErrorObj({});
                } else if (!sizeValid) {
                    setErrorObj((v) => {return {...v, sizeValid}});
                }
            }
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (imageArray && imageArray.length > 2) {
            setErrorObj(v => ({...v, numberExceededError: true}));
        } else {
            const transferFile: File[] = Array.from(e.dataTransfer.files);
            const formatValid = checkIfImage(transferFile); // accept attribute won't work for drop zone
            const sizeValid = checkFileSize(transferFile);
            if (formatValid && sizeValid) {
                processAddImages(transferFile);
                setErrorObj({});
            } else if (!sizeValid) {
                setErrorObj((v) => {return {...v, sizeValid}});
            } else if (!formatValid) {
                setErrorObj((v) => {return {...v, formatValid}});                
            }
        }
        setHoverClass(false);
    }

    return (
        <div className={styles.imageInputContainer}>
            <div
                data-testid='dropZone'
                className={hoverClass ? [ styles.imageDropZone, styles.imageDropZone_hover].join(' ') : styles.imageDropZone}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => {setHoverClass(true)}}
                onDragLeave={() => {setHoverClass(false)}}
            >
                {
                    imageArray?.map(file => {
                        return (
                            <div className={styles.filePreviewContainer} key={file.name}>
                                <div className={styles.filePreview}>{file.name}</div>
                                <button
                                    className={styles.removeFileButton}
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
                    <div className={styles.imageDragPrompt}>Drag up to 3 photos here</div>
                }
            </div>
            {errorObj.formatError && <div className={styles.imageErrorMsg}>File must be an image</div>}
            {errorObj.sizeError && <div className={styles.imageErrorMsg}>File must be less than 2MB</div>}
            {errorObj.numberExceededError && <div className={styles.imageErrorMsg}>Only 3 images can be uploaded</div>}
            <label htmlFor='imageInputId' className={['button', styles.imageInputLabel].join(' ')}>Select from files</label>
            <input
                type='file'
                hidden={true}
                ref={imageInputRef}
                id='imageInputId'
                className={styles.imageInput}
                name='images'
                accept='image/*, .jpeg, .jpg, .png'
                multiple={true}
                onChange={handleInputChange}
                aria-invalid={errorObj?.formatError || errorObj?.sizeError || errorObj?.numberExceededError}
            />
        </div>
    )
}
