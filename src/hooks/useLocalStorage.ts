import { useState, useEffect } from 'react';

const getLocalValue = (key: string, initValue: any) => {
    if (typeof window === 'undefined') return initValue;

    const localItem = localStorage.getItem(key);
    if (localItem) {
       return JSON.parse(localItem); 
    }

    if (initValue instanceof Function) return initValue();

    return initValue;
}

const useLocalStorage = (key: string, initValue: any) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value])

    return [value, setValue];
}

export default useLocalStorage 