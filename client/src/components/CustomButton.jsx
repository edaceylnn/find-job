const CustomButton = ({
  title,
  containerStyles,
  iconRight,
  type,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      disabled={disabled}
      className={`inline-flex items-center ${containerStyles}`}
    >
      {title}

      {iconRight && <div className='ml-2'>{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
