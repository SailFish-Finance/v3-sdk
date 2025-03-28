import React from "react";

const Edu = () => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect x="0.5" width="24" height="24" fill="url(#pattern0_147_9287)" />
      <defs>
        <pattern
          id="pattern0_147_9287"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_147_9287" transform="scale(0.0078125)" />
        </pattern>
        <image
          id="image0_147_9287"
          width="128"
          height="128"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default Edu;
