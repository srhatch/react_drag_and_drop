import { it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import ParentComponent from '../src/app/page';
import generateTestFile from './gen_test_files';

it('adds an image to drop zone and image display onDrop', () => {
    const testJpegFile = generateTestFile('iAmAJpeg', 'image/jpeg', 3000000);
    render(<ParentComponent />);
    const dropZone = screen.getByTestId('dropZone');
    fireEvent.drop(dropZone, {
        dataTransfer: {
            files: [testJpegFile]
        }
    });
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'mockedURL');
    expect(dropZone).toContainElement(imgElement);
});
it('adds an image to drop zone and image display onChange', () => {
    const testJpegFile = generateTestFile('iAmAJpeg', 'image/jpeg', 3000000);
    render(<ParentComponent />);
    const imageInput = screen.getByLabelText('Select from files');
    fireEvent.change(imageInput, {
        target: {
            files: [testJpegFile]
        }
    })
    const dropZone = screen.getByTestId('dropZone');
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'mockedURL');
    expect(dropZone).toContainElement(imgElement);
});
it('displays an error message if file is too big', () => {
    const testJpegTooBig = generateTestFile('iAmAJpeg', 'image/jpeg', 4000001);
    render(<ParentComponent />);
    const imageInput = screen.getByLabelText('Select from files');
    fireEvent.change(imageInput, {
        target: {
            files: [testJpegTooBig]
        }
    })
    const errorMsg = screen.getByText('File must be less than 4MB');
    expect(errorMsg).toBeInTheDocument();
});
it('displays an error message if file is not an image', () => {
    const notImageFile = generateTestFile('notAnImage', 'text/javascript');
    render(<ParentComponent />);
    const dropZone = screen.getByTestId('dropZone');
    fireEvent.drop(dropZone, {
        dataTransfer: {
            files: [notImageFile]
        }
    });
    const errorMsg = screen.getByText('File must be an image');
    expect(errorMsg).toBeInTheDocument();
});
it('displays an error message if more than 3 files are uploaded', () => {
    const jpeg1 = generateTestFile('iAmAJpeg1', 'image/jpeg');
    const jpeg2 = generateTestFile('iAmAJpeg2', 'image/jpeg');
    const jpeg3 = generateTestFile('iAmAJpeg3', 'image/jpeg');
    const png = generateTestFile('iAmAPng', 'image/png');
    render(<ParentComponent />);
    const imageInput = screen.getByLabelText('Select from files');
    fireEvent.change(imageInput, {
        target: {
            files: [jpeg1, jpeg2, jpeg3, png]
        }
    })
    const errorMsg = screen.getByText('Only 3 images can be uploaded');
    expect(errorMsg).toBeInTheDocument();
});
it('removes an image from dropzone and image display', () => {
    const jpegFile = generateTestFile('iAmAJpeg', 'image/jpeg');
    render(<ParentComponent />);
    const imageInput = screen.getByLabelText('Select from files');
    fireEvent.change(imageInput, {
        target: {
            files: [jpegFile]
        }
    })
    const deleteButton = screen.getByRole('button', {
        name: 'Remove image'
    });
    expect(deleteButton).toBeInTheDocument();
    const dropZone = screen.getByTestId('dropZone');
    const imgElement = screen.getByRole('img');
    expect(dropZone).toContainElement(imgElement);
    fireEvent.click(deleteButton);
    expect(dropZone).not.toContainElement(imgElement);
    expect(deleteButton).not.toBeInTheDocument();
});
