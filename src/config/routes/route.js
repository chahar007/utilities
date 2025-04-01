// import pages from '../../components/screens';
// import React from 'react';
// import './route.scss';
// import AuthProvider from '../utils/AuthProvider';
// import Header from '../../components/shared/Header/Header';
// import Footer from '../../components/shared/Footer/Footer';
// import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// const AUTH_ROUTES = [
//     { path: '/', component: pages.Home },

//     { path: 'game-detail/:slug', component: pages.DetailedScreen },
//     { path: 'about-us', component: pages.AboutUs },
//     {
//         path: 'all-games', component:  pages.AllGamesListing,
//     },
//     {
//         path: 'games/:id', component: pages.ComingSoonGame
//     },
//     {
//         path: '/blogs', component: pages.Blogs
//     },
//     {
//         path: '/blog/:id', component: pages.BlogDetails
//     }
// ];

// const WITHOUT_AUTH_ROUTES = [
//     { path: '/fallback', component: pages.Home },
//     { path: '/index.html', component: pages.Home }
// ];

// const AppRoute = () => {
//     const Layout = () => (
//         <div className='router-outlet'>
//             <div className='outlet'>
//                 <div className='header-layout'>
//                     <Header />
//                 </div>
//                 <div className='body-outlet'>
//                     <Outlet />
//                 </div>
//                 <div className='footer-outlet'>
//                     <Footer />
//                 </div>
//             </div>
//         </div>
//     );

//     const PrivateRoute = () => {
//         return <Layout />;
//         // const { isAuthenticated } = useAuth();
//         // return isAuthenticated ? <Layout /> : <Navigate to="/fallback" />;
//     };

//     return (
//         <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
//             <AuthProvider>
//                 <Routes>
//                     {/* Without Authentication Routes */}
//                     {WITHOUT_AUTH_ROUTES.map((page) => (
//                         <Route
//                             key={page.path}
//                             path={page.path}
//                             element={React.createElement(page.component)}
//                         />
//                     ))}

//                     {/* Private Routes */}
//                     <Route path="/" element={<PrivateRoute />}>
//                         {AUTH_ROUTES.map((page) => (
//                             <Route
//                                 key={page.path}
//                                 path={page.path}
//                                 element={React.createElement(page.component)}
//                             />
//                         ))}
//                     </Route>

//                     {/* Fallback Route */}
//                     <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//             </AuthProvider>
//         </BrowserRouter>
//     );
// };

// export default AppRoute;



import React, { Suspense } from 'react';
import './route.scss';
import AuthProvider from '../utils/AuthProvider';
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
// import LoadingSpinner from '../../components/shared/LoadingSpinner';
import * as screens from '../../components/screens';

const AUTH_ROUTES = [
  { path: '/', component: screens.LazyHome },
  { path: 'game-detail/:slug', component: screens.LazyDetailedScreen },
  { path: 'about-us', component: screens.LazyAboutUs },
  { path: 'all-games', component: screens.LazyAllGamesListing },
  { path: 'games/:id', component: screens.LazyComingSoonGame },
  { path: '/blogs', component: screens.LazyBlogs },
  { path: '/blog/:id', component: screens.LazyBlogDetails }
];

const WITHOUT_AUTH_ROUTES = [
  { path: '/fallback', component: screens.LazyHome },
  { path: '/index.html', component: screens.LazyHome }
];

const AppRoute = () => {
  const Layout = () => (
    <div className='router-outlet'>
      <div className='outlet'>
        <div className='header-layout'>
          <Header />
        </div>
        <div className='body-outlet'>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
        <div className='footer-outlet'>
          <Footer />
        </div>
      </div>
    </div>
  );


  const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    return (
      <div className={`loading-spinner ${size} ${className}`}>
        <div className="spinner">
          <div className="spinner-sector spinner-sector-top"></div>
          <div className="spinner-sector spinner-sector-right"></div>
          <div className="spinner-sector spinner-sector-bottom"></div>
          <div className="spinner-sector spinner-sector-left"></div>
        </div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  };



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
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  {React.createElement(page.component)}
                </Suspense>
              }
            />
          ))}

          {/* Private Routes */}
          <Route path="/" element={<PrivateRoute />}>
            {AUTH_ROUTES.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    {React.createElement(page.component)}
                  </Suspense>
                }
              />
            ))}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoute;