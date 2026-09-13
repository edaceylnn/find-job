const PageContainer = ({ children, as: Tag = "div", className = "" }) => {
  return (
    <Tag className={`mx-auto w-full max-w-container px-5 py-8 sm:px-6 md:py-10 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
};

export default PageContainer;
