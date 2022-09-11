<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import Vertical from "./vertical";
import Horizontal from "./horizontal";
import Detached from "./detached";
import TwoColumn from "./two-column";
// import { store } from "@/store/main.js";

/**
 * Default Layout
 */
export default {
  components: {
    Vertical,
    Horizontal,
    Detached,
    TwoColumn,
  },
  data() {
    return { getInfo: [] };
  },
  middleware: ["check-auth", "auth"],
  fetchOnServer: false,
  fetch() {
    this.$store.dispatch("auth/getInfo").catch(() => {});
  },
  computed: {
    ...mapState(["layout"]),
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      info: "auth/getInfo",
      // provinces: "getProvinces"
    }),
  },
  //   computed: mapState(["layout"]),
  mounted() {
    if (this.$route.query.layout) {
      this.$store.dispatch("layout/changeLayoutType", {
        layoutType: this.$route.query.layout,
      });
    }
  },
};
</script>

<template>
  <div>
    <!-- Begin page -->
    <Vertical
      v-if="layout.layoutType === 'vertical'"
      :layout="layout.layoutType"
    >
      <Nuxt />
    </Vertical>
    <!-- END layout-wrapper -->

    <Horizontal
      v-if="layout.layoutType === 'horizontal'"
      :layout="layout.layoutType"
    >
      <slot />
    </Horizontal>

    <Detached
      v-if="layout.layoutType === 'detached'"
      :layout="layout.layoutType"
    >
      <slot />
    </Detached>

    <TwoColumn
      v-if="layout.layoutType === 'two-column'"
      :layout="layout.layoutType"
    >
      <slot />
    </TwoColumn>
  </div>
</template>
