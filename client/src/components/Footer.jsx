import { Link } from "react-router-dom";

import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            TRE<span>STEP</span>
          </Link>

          <p>
            Step into confidence with Trestep.
            Discover footwear designed for
            performance, comfort and everyday style.
          </p>

          <div className="footer-socials">

            <a
              href="#"
              aria-label="Instagram"
            >
              <FiInstagram />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              >
              <FiFacebook />
            </a>

            <a
              href="#"
              aria-label="Twitter"
            >
              <FiTwitter />
            </a>

            <a
              href="mailto:info@trestep.com"
              aria-label="Email"
            >
              <FiMail />
            </a>

          </div>
        </div>

        {/* Shop */}
        <div className="footer-column">

          <h3>
            Shop
          </h3>

          <Link to="/men">
            Men
          </Link>

          <Link to="/women">
            Women
          </Link>

          <Link to="/new-arrivals">
            New Arrivals
          </Link>

        </div>

        {/* About */}
        <div className="footer-column">

          <h3>
            About
          </h3>

          <Link to="/about">
            About Trestep
          </Link>

          <Link to="/our-journey">
            Our Journey
          </Link>

          <Link to="/blogs">
            Blogs
          </Link>

          <Link to="/contact">
            Contact Us
          </Link>

        </div>

        {/* Quick Links */}
        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/refund-policy">
            Refund Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/store-location">
            Store Location
          </Link>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Trestep.
          All Rights Reserved.
        </p>

        <p>
          Designed for every step.
        </p>

      </div>

    </footer>
  );
}

export default Footer;