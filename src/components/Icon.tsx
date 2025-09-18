import React from 'react';

// This is a generic type that accepts any component, like our icons.
// It also allows us to pass standard HTML attributes for SVG elements.
interface IconProps extends React.SVGProps<SVGSVGElement> {
  as: React.ElementType;
}

/**
 * A simple wrapper component to render icons and fix TypeScript issues.
 * It takes an 'as' prop for the icon component (e.g., as={FiX})
 * and passes any other props (like className) to it.
 */
const Icon: React.FC<IconProps> = ({ as: Component, ...props }) => {
  return <Component {...props} />;
};

export default Icon;