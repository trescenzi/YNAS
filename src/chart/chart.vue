<template>
  <div ref="chart"></div>
</template>

<script>
import drawSankey from './sankey';

export default {
  props: [
    'height',
    'width',
    'links',
    'nodes',
  ],
  mounted() {
    drawSankey({
      height: this.height,
      width: this.width,
      links: this.links,
      nodes: this.nodes,
      ref: this.$refs.chart,
    })
  },
  updated() {
    drawSankey({
      height: this.height,
      width: this.width,
      links: this.links,
      nodes: this.nodes,
      ref: this.$refs.chart,
    })
  }
}
</script>

<style>
  .link:hover {
    opacity: 0.7;
  }
</style>
