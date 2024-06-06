<script>
import GlyphAutosortButtonGroup from "./GlyphAutosortButtonGroup";
import GlyphCleanButtonGroup from "./GlyphCleanButtonGroup";
import GlyphProtectedRowButtonGroup from "./GlyphProtectedRowButtonGroup";
import GlyphSortButtonGroup from "./GlyphSortButtonGroup";
import GlyphGiveButtonGroup from "./GlyphGiveButtonGroup";
import GlyphAutoGiveButtonGroup from "./GlyphAutoGiveButtonGroup";

export default {
  name: "GlyphInventoryManagementPanel",
  components: {
    GlyphSortButtonGroup,
    GlyphProtectedRowButtonGroup,
    GlyphAutosortButtonGroup,
    GlyphCleanButtonGroup,
    GlyphGiveButtonGroup,
    GlyphAutoGiveButtonGroup
  },
  props: {
    hasMoreOptions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    groupClass() {
      return {
        "l-glyph-sacrifice-options": true,
        "c-glyph-sacrifice-options": true,
        "l-glyph-sidebar-panel-size": true,
        "l-glyph-inventory-management": true,
        "c-glyph-inventory-management-with-border": !this.hasMoreOptions
      };
    }
  },
};
</script>

<template>
  <div :class="groupClass">
    <GlyphSortButtonGroup/>
    <GlyphProtectedRowButtonGroup/>
    <GlyphAutosortButtonGroup/>
    <GlyphCleanButtonGroup/>
    <GlyphGiveButtonGroup/>
    <GlyphAutoGiveButtonGroup/>
  </div>
</template>

<style scoped>

</style>
