import PropTypes from "prop-types";

const Titles = ({ titleText, colorText, strongText }) => {
  return (
    <div className="relative flex items-center pl-8 mb-2 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-headerBg before:rounded-full ">
      <h3
        className={`text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl  ${strongText}   ${colorText}`}
      >
        {titleText}
      </h3>
    </div>
  );
};

export default Titles;

Titles.propTypes = {
  titleText: PropTypes.string.isRequired,
  colorText: PropTypes.string.isRequired,
  strongText: PropTypes.string.isRequired,
};
