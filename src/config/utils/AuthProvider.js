import { useContext, createContext, useEffect, useState, useCallback, useMemo } from "react";
// import axios from 'axios';
import { APP_CONSTANTS } from "./AppContext";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // let token = getParameterByName('jwt');
        // // console.log("")
        // APP_CONSTANTS.token.jwt = token
        // console.log('auth token', token)
    }, []);

    const validateToken = async () => {
    };

    const contextValue = useMemo(() => ({ isAuth, validateToken }), [isAuth, validateToken]);

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
