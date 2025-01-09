import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import pages from '../../components/screens';
import React, { Children } from 'react';
import './route.scss';
import AuthProvider, { useAuth } from '../utils/AuthProvider';
import Header  from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
const AUTH_ROUTES = [
    { path: '/', component: pages.Home },
    { path: '/main', component: pages.Main }
];

const WITHOUT_AUTH_ROUTES = [
    { path: '/fallback', component: pages.Home },
    { path: '/index.html', component: pages.Home }
];

const AppRoute = () => {
    const Layout = () => (
        <div className='router-outlet'>
            <div className='outlet'>
                <div className='header-layout'>
                    <Header />
                </div>
                <div className='body-outlet'>
                    <Outlet />
                </div>
                <div className='footer-outlet'>
                    <Footer />
                </div>
            </div>
        </div>
    );

    const PrivateRoute = () => {
        return <Layout />;
        // const { isAuthenticated } = useAuth();
        // return isAuthenticated ? <Layout /> : <Navigate to="/fallback" />;
    };

    return (
        <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
            <AuthProvider>
                <Routes>
                    {/* Without Authentication Routes */}
                    {WITHOUT_AUTH_ROUTES.map((page) => (
                        <Route
                            key={page.path}
                            path={page.path}
                            element={React.createElement(page.component)}
                        />
                    ))}

                    {/* Private Routes */}
                    <Route path="/" element={<PrivateRoute />}>
                        {AUTH_ROUTES.map((page) => (
                            <Route
                                key={page.path}
                                path={page.path}
                                element={React.createElement(page.component)}
                            />
                        ))}
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<pages.Home />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoute;
