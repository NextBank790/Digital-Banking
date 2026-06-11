import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Read from secureBankUser if it exists
    const user = JSON.parse(localStorage.getItem('secureBankUser'));
    if (user && user.theme) {
      setTheme(user.theme);
    }
  }, []);

  useEffect(() => {
    // Apply class to body
    document.body.className = '';
    document.body.classList.add('theme-' + theme);

    // Save to secureBankUser in localStorage if logged in
    const user = JSON.parse(localStorage.getItem('secureBankUser'));
    if (user && user.theme !== theme) {
      user.theme = theme;
      localStorage.setItem('secureBankUser', JSON.stringify(user));
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
