import React from 'react';

import Image from '../Tags/Image';
import Tooltip from '../Tooltip';

export default function Transition({ transition, hideTooltip = false }: any) {
  if (!transition) {
    return null;
  }

  const prevStatus = transition.test_previous_status || 'nil';
  const currStatus = transition.test_current_status || 'nil';

  const content = (
    <Image
      src={`/assets/images/icon/transition/${prevStatus}-to-${currStatus}.svg`}
      className="w-35"
    />
  );

  if (hideTooltip) {
    return content;
  }

  return (
    <Tooltip content={`${prevStatus === 'nil' ? `${currStatus} in first run` : `${prevStatus} to ${currStatus}`}`} placement="right">
      <span>{content}</span>
    </Tooltip>
  );
}
