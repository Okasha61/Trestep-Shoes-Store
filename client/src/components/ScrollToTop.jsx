import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // ============================================
    // HASH LINK
    // Example: /#whatshot
    // ============================================

    if (hash) {
      let attempts = 0;
      let timer;

      const scrollToHash = () => {
        const element = document.getElementById(
          hash.substring(1)
        );

        if (element) {
          const headerOffset = 80;

          const elementPosition =
            element.getBoundingClientRect().top;

          const offsetPosition =
            elementPosition +
            window.scrollY -
            headerOffset;

          window.scrollTo({
            top: offsetPosition,
            left: 0,
            behavior: "smooth",
          });

          return;
        }

        // Home ke sections render hone ka wait
        attempts += 1;

        if (attempts < 20) {
          timer = setTimeout(
            scrollToHash,
            100
          );
        }
      };

      // Pehle top par reset karo
      // taake old scroll position interfere na kare
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      timer = setTimeout(
        scrollToHash,
        100
      );

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }

    // ============================================
    // NORMAL PAGE NAVIGATION
    // ============================================

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;