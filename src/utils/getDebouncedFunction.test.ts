import { getDebouncedFunction } from './';

beforeEach(() => {
    jest.useFakeTimers();
});

test('function is only called once after timer runs out', () => {
    const mockFn = jest.fn();
    const debouncedMock = getDebouncedFunction(mockFn, 50);

    debouncedMock();
    debouncedMock();
    debouncedMock();
    jest.runAllTimers();

    expect(mockFn).toHaveBeenCalledTimes(1);
});

test('function is called multiple times whens timer runs out between calls', () => {
    const mockFn = jest.fn();
    const debouncedMock = getDebouncedFunction(mockFn, 100);
    debouncedMock();
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(1);
    debouncedMock();
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(2);
    debouncedMock();
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(3);
});
