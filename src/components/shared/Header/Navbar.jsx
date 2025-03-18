import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.module.scss";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);

  const handleMouseEnter = (menu) => setDropdown(menu);
  const handleMouseLeave = () => setDropdown(null);

  return (
    <nav className="navbar">
      <ul className="nav-links" type="none">
        <li 
          className="nav-item" 
          onMouseEnter={() => handleMouseEnter("compression")}
          onMouseLeave={handleMouseLeave}
        >
          <span>Image Compression <i className="fas fa-chevron-down"></i></span>
          {dropdown === "compression" && (
            <ul className="dropdown">
              <li><Link to="/compress/jpg">Compress JPG</Link></li>
              <li><Link to="/compress/png">Compress PNG</Link></li>
              <li><Link to="/compress/webp">Compress WebP</Link></li>
            </ul>
          )}
        </li>

        <li 
          className="nav-item" 
          onMouseEnter={() => handleMouseEnter("resize")}
          onMouseLeave={handleMouseLeave}
        >
          <span>Image Resize <i className="fas fa-chevron-down"></i></span>
          {dropdown === "resize" && (
            <ul className="dropdown">
              <li><Link to="/resize/jpg">Resize JPG</Link></li>
              <li><Link to="/resize/png">Resize PNG</Link></li>
              <li><Link to="/resize/webp">Resize WebP</Link></li>
            </ul>
          )}
        </li>

        <li 
          className="nav-item" 
          onMouseEnter={() => handleMouseEnter("convert")}
          onMouseLeave={handleMouseLeave}
        >
          <span>Image Convert <i className="fas fa-chevron-down"></i></span>
          {dropdown === "convert" && (
            <ul className="dropdown">
              <li><Link to="/convert/jpg">Convert to JPG</Link></li>
              <li><Link to="/convert/png">Convert to PNG</Link></li>
              <li><Link to="/convert/webp">Convert to WebP</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
