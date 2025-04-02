import React, { Suspense } from 'react';
import './route.scss';
import AuthProvider from '../utils/AuthProvider';
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
// import LoadingSpinner from '../../components/shared/LoadingSpinner';
import * as screens from '../../components/screens';
// import LazyRockPaperScissors from '../../components/screens/AllGames';
// import LazyTicTacToe from '../../components/screens/AllGames';
import gameScreen from '../../components/screens/AllGames';
const AUTH_ROUTES = [
  { path: '/', component: screens.LazyHome },
  { path: 'game-detail/:slug', component: screens.LazyDetailedScreen },
  { path: 'about-us', component: screens.LazyAboutUs },
  { path: 'all-games', component: screens.LazyAllGamesListing },
  { path: 'games/:id', component: screens.LazyComingSoonGame },
  { path: 'blogs', component: screens.LazyBlogs },
  { path: 'blog/:id', component: screens.LazyBlogDetails },
  { path: 'games/rock-paper-scissors', component: gameScreen.LazyRockPaperScissors },
  { path: 'games/tic-tac-toe', component: gameScreen.LazyTicTacToe },
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