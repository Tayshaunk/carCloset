// metro.config.js
// module.exports = {
//     resolver: {
//       sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
//       assetExts: ['glb', 'gltf', 'mtl', 'obj', 'png', 'jpg'],
//     },
//   };

const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts;

module.exports = {
  resolver: {
    assetExts: [...defaultAssetExts, 'obj', 'glb', 'gltf'], // Add other file extensions if needed.
  },
};
