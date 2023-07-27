import useLocalStorage from './useLocalStorage';

const useToggle = (key: string, initValue: boolean) => {
    const [value, setValue] = useLocalStorage(key, initValue);

    const toggle = () => {
        setValue((prev: boolean) => !prev);
    }

    return [value, toggle];
}

export default useToggle