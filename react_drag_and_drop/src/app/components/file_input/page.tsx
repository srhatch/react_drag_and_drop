'use client';
import styles from './FileInput.module.scss';
import { useState, useRef } from 'react';
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
                const sizeError = checkSize(inputFileArray);
                if (!sizeError) {
                    processAddImages(inputFileArray);
                    setErrorObj({});
                } else if (sizeError) {
                    setErrorObj((v) => {return {...v, sizeError}});
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
            const formatError = checkFileExt(transferFile); // accept attribute won't work for drop zone
            const sizeError = checkSize(transferFile);
            if (!formatError && !sizeError) {
                processAddImages(transferFile);
                setErrorObj({});
            } else if (sizeError) {
                setErrorObj((v) => {return {...v, sizeError}});
            } else if (formatError) {
                setErrorObj((v) => {return {...v, formatError}});                
            }
        }
        setHoverClass(false);
    }

    function checkFileExt(files: File[]) {
        // Superficial client-side validation
        for (let file of files) {
            if (file.type.split('/')[0] == 'image') {
                return false;
            } else {
                return true;
            }
        }
    }

    function checkSize(files: File[]) {
        // Superficial client-side validation
        for (let file of files) {
            if (file.size > 2000000) {
                return true;
            } else {
                return false;
            }
        }
    }

    return (
        <div className={styles.imageInputContainer}>
            <div
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
                                        removeImage(file.name);
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
