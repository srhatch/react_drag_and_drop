import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock URL API methods so TypeError isn't thrown
global.URL.createObjectURL = jest.fn(() => 'mockedURL');
global.URL.revokeObjectURL = jest.fn(() => undefined);