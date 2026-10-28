import React from 'react';

// Lucide icon sized to the surrounding text (1em), so existing font-size rules keep controlling icon size.
export default function Icon({ as: Glyph, size = '1em', strokeWidth = 2.25, className = '', ...rest }) {
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      className={`ui-icon ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}
