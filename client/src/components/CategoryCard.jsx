import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

function CategoryCard({
  title,
  description,
  image,
  link = "/shop",
}) {
  return (
    <Link to={link} className="category-card">

      <div className="category-image-wrapper">
        <img
          src={image}
          alt={title}
          className="category-image"
        />
      </div>

      <div className="category-overlay"></div>

      <div className="category-content">
        <div>
          <h3>{title}</h3>

          {description && (
            <p>{description}</p>
          )}
        </div>

        <span className="category-arrow">
          <FiArrowUpRight />
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;