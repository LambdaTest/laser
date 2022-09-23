import React from 'react';
import Tippy from '@tippyjs/react';
import { followCursor } from 'tippy.js';

const pluginFollowCursor = followCursor;

import 'tippy.js/dist/tippy.css';

const defaultPlugins: any[] = [];

enum TooltipThemeVariant {
  LIGHT = 'lt-tooltip-light',
  DARK = 'lt-tooltip-dark',
}

export default function Tooltip({
  children,
  content,
  delay,
  followCursor,
  theme = TooltipThemeVariant.DARK,
  ...restProps
}: any) {
  const plugins = [...defaultPlugins, ...(followCursor ? [pluginFollowCursor] : [])];

  return (
    <Tippy
      animation="fade"
      className="lt-tooltip"
      content={content}
      delay={delay || [100, 0]}
      followCursor={!!followCursor}
      plugins={plugins}
      theme={theme}
      {...restProps}
    >
      {children}
    </Tippy>
  );
}

export { TooltipThemeVariant };
