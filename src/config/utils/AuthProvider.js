import { useContext, createContext, useState, useMemo } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);

    const validateToken = async () => {
    };

    const contextValue = useMemo(() => ({ isAuth, validateToken }), [isAuth, setIsAuth, validateToken]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
