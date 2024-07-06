import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../url';

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await axios.get(`${URL}/api/auth/refetch`, { withCredentials: true });
      setUser(res.data);
    }catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
