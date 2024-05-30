'use client';
import styles from './ImageDisplay.module.scss';
import { ImageDisplayProps } from '../../../types/interfaces';

export default function ImageDisplay({ imageArray }: ImageDisplayProps) {
    // Displays the actual image below the form
    return (
        <div data-testid='imageDisplay' className={styles.imageContainer}>
            {
                imageArray?.map(file => (
                    <div className={styles.listingPicContainer} key={file.name}>
                        <img
                            className={styles.listingPics}
                            src={file.browserUrl}
                            alt=''
                        />
                    </div>
                ))
            }
        </div>
    )
}