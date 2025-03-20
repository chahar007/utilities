
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} IPL Stats Symphony. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/about"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/contact"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
