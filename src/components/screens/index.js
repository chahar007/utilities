import { lazy } from 'react';

// Regular exports (for non-lazy usage if needed)
export { default as Home } from './Home/Home';
export { default as Main } from './Main/Main';
export { default as Splash } from './Splash/Splash';
export { default as Login } from './Login/Login';
export { default as Fallback } from './Login/Fallback';
export { default as DetailedScreen } from './DetailScreen/DetailScreen';
export { default as AboutUs } from './About/About';
export { default as AllGamesListing } from './Games/GameListing';
export { default as ComingSoonGame } from './Games/ComingSoonGame';
export { default as Blogs } from './Blogs/Blogs';
export { default as BlogDetails } from './Blogs/BlogDetails';

// Lazy-loaded versions
export const LazyHome = lazy(() => import('./Home/Home'));
export const LazyMain = lazy(() => import('./Main/Main'));
export const LazySplash = lazy(() => import('./Splash/Splash'));
export const LazyLogin = lazy(() => import('./Login/Login'));
export const LazyFallback = lazy(() => import('./Login/Fallback'));
export const LazyDetailedScreen = lazy(() => import('./DetailScreen/DetailScreen'));
export const LazyAboutUs = lazy(() => import('./About/About'));
export const LazyAllGamesListing = lazy(() => import('./Games/GameListing'));
export const LazyComingSoonGame = lazy(() => import('./Games/ComingSoonGame'));
export const LazyBlogs = lazy(() => import('./Blogs/Blogs'));
export const LazyBlogDetails = lazy(() => import('./Blogs/BlogDetails'));