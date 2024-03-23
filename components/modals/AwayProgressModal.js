import AwayProgressEntry from "./AwayProgressEntry.js";
import ModalWrapper from "./ModalWrapper.js";

export default {
  name: "AwayProgressModal",
  components: {
    AwayProgressEntry,
    ModalWrapper,
  },
  props: {
    playerBefore: {
      type: Object,
      required: true,
    },
    playerAfter: {
      type: Object,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      somethingHappened: false,
    };
  },
  computed: {
  nothingHappened() {
return Theme.current().name === "S9";
},
    offlineStats() {
      return AwayProgressTypes.appearsInAwayModal;
    },
    headerText() {
      const timeDisplay = TimeSpan.fromSeconds(this.seconds).toString();
      if (this.nothingHappened || !this.somethingHappened) {
        return `在你离开的${timeDisplay}里，什么都没发生……`;
      }
      return `在你离开的${timeDisplay}里: `;
    }
  },
  template: `<ModalWrapper class="c-modal-away-progress">
<div class="c-modal-away-progress__header">
{{ headerText }}
</div>
<div
v-if="!nothingHappened"
class="c-modal-away-progress__resources c-modal--short"
>
<AwayProgressEntry
v-for="name of offlineStats"
:key="name"
:name="name"
:player-before="playerBefore"
:player-after="playerAfter"
@something-happened="somethingHappened = true"
/>
</div>
<span v-if="!nothingHappened && somethingHappened">小贴士: 点击某个条目可以在以后不显示。</span>
</ModalWrapper>`
}