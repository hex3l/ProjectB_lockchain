/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config-tailwind/tailwind.config.js');

module.exports = {
  presets: [config],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      boxShadow: {
        's-top': '0px 0px 18px 5px rgba(0,0,0,0.54)',
      },
    },
    fontFamily: {
      bukhari: ['bukhari-script'],
    },
    screens: {
      sx: 0,
      md: '900px',
      lg: '1100px',
      xl: '1400px',
    },
  },
};
