'use client';
import { ImageDisplayProps } from '@/types/interfaces';
import styles from './ImageDisplay.module.scss';

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