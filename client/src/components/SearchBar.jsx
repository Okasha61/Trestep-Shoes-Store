import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

function SearchBar({
  initialValue = "",
  placeholder = "Search shoes, categories...",
}) {
  const [search, setSearch] = useState(initialValue);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    const normalizedQuery = query.toLowerCase();

    // Direct gender page navigation
    if (normalizedQuery === "men") {
      navigate("/men");
      return;
    }

    if (normalizedQuery === "women") {
      navigate("/women");
      return;
    }

    // Normal product search
    navigate(
      `/search?query=${encodeURIComponent(query)}`
    );
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
    >
      <FiSearch className="search-icon" />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
      />

      {search && (
        <button
          type="button"
          className="clear-search"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <FiX />
        </button>
      )}

      <button
        type="submit"
        className="search-submit"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;