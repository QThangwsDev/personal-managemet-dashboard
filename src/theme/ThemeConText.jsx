import { createContext, useContext, useState} from "react";



const ThemeContext = createContext(null);

const lightTheme = {
    background:'#ffffff',
    text: '#1a1a1a',
    primary: '#007bff',
    buttonBg: '#222222',
    buttonText: '#ffffff'
}

const darkTheme = {
    background: '#121212',
    text: '#ececec',
    primary: '#375a7f',
    buttonBg: '#ffffff',
    buttonText: '#222222'
}



export function ThemeProvider ({children}) {
    const [mode,setMode] = useState('light');

    //ham doi mode
    const toggleTheme = () => {
        setMode((prev) => prev ==='light'?'dark':'light');
    };

    const colors = mode  === 'light' ? lightTheme : darkTheme ;

    return (
        <ThemeContext.Provider value={{mode, toggleTheme, colors}}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;

export function useTheme(){
    return useContext(ThemeContext);
}