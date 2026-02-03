'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Default context to 'all' accounts to handle cases where context is accessed before provider mounts
const UserContext = createContext({ userAccount: 'all', setUserAccount: () => { } });

export function UserProvider({ children }) {
    const [userAccount, setUserAccount] = useState('all');
    // We can persist to localStorage if needed, but for now simple state is enough for a session

    return (
        <UserContext.Provider value={{ userAccount, setUserAccount }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
