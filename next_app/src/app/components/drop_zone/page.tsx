'use client';
import { useContext, useState, useRef } from 'react';
import styles from './DropZone.module.scss';
import { checkFileSize, checkIfImage } from '@/utilities/file_utils';
import { DropZoneProps, ErrorObject, UrlFile } from '@/types/interfaces';
import { FormContext } from '../image_form/page';

export default function DropZone({ setErrorObj }: DropZoneProps) {
    const [hoverClass, setHoverClass] = useState(false);
    const context = useContext(FormContext);
    const dragZoneRef = useRef(null);

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const imageArrayLength = context?.imageArray.length || 0;
        const numberImagesAllowed = context?.numberOfImages || 0; // Total number allowed
        const transferFiles: File[] = Array.from(e.dataTransfer.files);
        if (transferFiles.length + imageArrayLength > numberImagesAllowed) {
            // If uploaded exceeds total number allowed
            setErrorObj(v => ({...v, numberExceededError: 'numberExceededError'}));
        } else {
            const formatValid = checkIfImage(transferFiles); // input's accept attribute won't work for drop zone
            const sizeValid = checkFileSize(transferFiles);
            if (!sizeValid) {
                setErrorObj(v => {return {...v, sizeError: 'sizeError'}});
            } else if (!formatValid) {
                setErrorObj(v => {return {...v, formatError: 'formatError'}});
            } else {
                context?.addImage(transferFiles, context.slotsArray);
                setErrorObj({});
            }
        }
        setHoverClass(false);
    }

    function handleDeleteClick(
        removeImage: (deleteFile: UrlFile) => void,
        image: UrlFile,
        setErrorObj: React.Dispatch<React.SetStateAction<ErrorObject>>
    ): void {
        removeImage(image);
        setErrorObj(v => {
            v.numberExceededError = '';
            return {...v};
        })
    }

    function handleOnDragLeave(e: React.DragEvent) {
        // Removes hover border style
        if ((e.relatedTarget && dragZoneRef.current) && (dragZoneRef.current as HTMLDivElement).contains((e.relatedTarget as HTMLDivElement))) {
            // Prevents hoverClass from changing if item is dragged over child elements of dropZone
            return;
        } else {
            setHoverClass(false)
        }
    }

    return (
        <div
            data-testid='dropZone'
            ref={dragZoneRef}
            className={hoverClass ? [ styles.imageDropZone, styles.imageDropZone_hover].join(' ') : styles.imageDropZone}
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => {setHoverClass(true)}}
            onDragLeave={handleOnDragLeave}
        >
            {
                context?.slotsArray.map(slot => {
                    const imageArray = context.imageArray;
                    const objectUrl = calcSrc(imageArray, slot);
                    const imageIndex = findImageIndex(imageArray, slot);
                    return (
                        <div className={styles.imageContainer} key={slot}>
                            {
                                objectUrl
                                ?
                                <>
                                    <img
                                        className={styles.listingPic}
                                        src={objectUrl}
                                        onLoad={(e) => URL.revokeObjectURL(objectUrl || '')}
                                        alt='User submitted image'
                                    />
                                    <button
                                        type='button'
                                        className={styles.removeFileButton}
                                        onClick={() => handleDeleteClick(context.removeImage, imageArray[imageIndex], setErrorObj)}
                                    >Remove image</button>
                                </>
                                :
                                <div className={styles.emptySlot}></div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

// Helper functions
function findImageIndex(imageArray: UrlFile[], slot: number) {
    // Retrieves an image from uploaded images based on slot
    const index = imageArray?.findIndex(file => file.slot === slot);
    return index;
}

function calcSrc(imageArray: UrlFile[], dropZone: number) {
    // Used to keep images in the slot they were uploaded into
    const index = findImageIndex(imageArray, dropZone);
    if (index !== -1) {
        return imageArray[index].browserUrl;
    }
    return '';
}