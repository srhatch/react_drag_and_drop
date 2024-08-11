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
        const numberOfImages = context?.numberOfImages || 0;
        const transferFile: File[] = Array.from(e.dataTransfer.files);
        if (transferFile.length + imageArrayLength > numberOfImages) {
            setErrorObj(v => ({...v, numberExceededError: 'numberExceededError'}));
        } else {
            const formatValid = checkIfImage(transferFile); // input's accept attribute won't work for drop zone
            const sizeValid = checkFileSize(transferFile);
            if (!sizeValid) {
                setErrorObj(v => {return {...v, sizeError: 'sizeError'}});
            } else if (!formatValid) {
                setErrorObj(v => {return {...v, formatError: 'formatError'}});
            } else {
                context?.addImage(transferFile, context.slotsArray);
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
        setErrorObj((previousErrorObj) => {
            previousErrorObj.numberExceededError = '';
            return {...previousErrorObj};
        })
    }

    return (
        <div
            data-testid='dropZone'
            ref={dragZoneRef}
            className={hoverClass ? [ styles.imageDropZone, styles.imageDropZone_hover].join(' ') : styles.imageDropZone}
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => {setHoverClass(true)}}
            onDragLeave={(e) => {
                if ((e.relatedTarget && dragZoneRef.current) && (dragZoneRef.current as HTMLDivElement).contains((e.relatedTarget as HTMLDivElement))) {
                    return;
                } else {
                    setHoverClass(false)
                }
            }}
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
function findImageIndex(imageArray: UrlFile[], dropZone: number) {
    const index = imageArray?.findIndex(file => file.dropZone === dropZone);
    return index;
}

function calcSrc(imageArray: UrlFile[], dropZone: number) {
    const index = findImageIndex(imageArray, dropZone);
    if (index !== -1) {
        return imageArray[index].browserUrl;
    }
    return '';
}