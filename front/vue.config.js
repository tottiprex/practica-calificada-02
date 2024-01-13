const { defineConfig } = require('@vue/cli-service')
const UnoCSS = require('@unocss/webpack').default;
const { transformerVariantGroup } = require('unocss');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      UnoCSS({
        transformers: [transformerVariantGroup()],
      }),
    ],
  },
})
