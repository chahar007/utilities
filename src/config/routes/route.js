import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import pages from '../../components/screens';
import React, { Children } from 'react';
import './route.scss';
import AuthProvider, { useAuth } from '../utils/AuthProvider';
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
const AUTH_ROUTES = [
    { path: '/', component: pages.Home },
    { path: '/main', component: pages.Main },
    { path: '/about-us', component: pages.AboutUs},
    { path: '/contact-us', component: pages.ContactUs},
    {
        path: '/all-tools', component: pages.AllTools
    },
    {
        path: '/image-tools', component: pages.Home
    },
    {
        path: '/pdf-tools', component: pages.Home
    },
    {
        path: '/image/conversion', component: pages.Conversion
    },
    {
        path: '/image/compression', component: pages.Compression
    },
    {
        path: '/image/resizing', component: pages.Resizing
    },
    {
        path: '/image/crop-image', component: pages.CropImage,
    },
    {
        path: '/image/rotate-image', component: pages.RotateImage,
    },
    {
        path: '/image/base64-converter', component: pages.Base64
    },
    {
        path: '/image/filters', component: pages.ImageFilters
    },
    {
        path: '/image/watermark', component: pages.Watermark
    },
    {
        path: '/image/merger', component: pages.ImageMerger
    },
    {
        path: '/image/background-tools', component: pages.BackgroundTools
    },
    {
        path: '/image/color-palette', component: pages.ColorPalette
    },
    {   path: '/main', component: pages.Main },
    {
        path: '/privacy-policy', component: pages.PrivacyPolicy
    },
    {
        path: '/terms-of-service', component: pages.TermsOfUse
    },
    {
        path: '/pdf/rotate-pdf', component: pages.RotatePDF,
    },
    {
        path: '/pdf/reorder-pdf', component: pages.ReorderPDF,
    },
    {
        path: '/pdf/image-to-pdf', component: pages.ImagesToPDF,
    },
    {
        path: '/pdf/split-pdf', component: pages.SplitPDF,
    },
    {
        path: '/pdf/watermark-pdf', component: pages.WatermarkPDF,
    },
    {
        path: '/pdf/edit-meta-data-pdf', component: pages.EditMetadata,
    },
    {
        path: '/pdf/merge-pdf', component: pages.MergePDF,
    },
    {
        path: '/blog', component: pages.Blog,
    },
    {
        path: '/blog/:slug', component: pages.BlogPost,
    },
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
                    <Route path="*" element={<Navigate to={'/'} />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoute;
