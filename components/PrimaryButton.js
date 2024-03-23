export default {
  name: "PrimaryButton",
  props: {
    enabled: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn--disabled": !this.enabled,
      };
    }
  },
  template: `
    <button
    class="o-primary-btn"
    :class="classObject"
    v-on="$listeners"
    >
    <slot />
    </button>
  `
}