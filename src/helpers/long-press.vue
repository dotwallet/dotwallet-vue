<template>
  <div
    class="longpress-button"
    :class="status"
    @touchend="cancel()"
    @touchstart.prevent="triggerCount()"
    @mouseup="cancel()"
    @mousedown.prevent="triggerCount()"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'longpress-button',

  props: ['onConfirm', 'duration'],

  created() {
    this.$emit('status', 'default');

    document.addEventListener('mouseup', () => this.cancel());
  },

  destroyed() {
    document.removeEventListener('mouseup', () => this.cancel());
  },

  data() {
    return {
      status: 'default',
      counter: 0,
      timer: null,
    };
  },

  methods: {
    triggerCount() {
      if (this.status === 'executing' || this.status === 'counting') return;
      this.status = 'counting';
      this.$emit('status', this.status);
      this.countAndConfirm();
    },
    execute() {
      this.status = 'executing';
      this.$emit('status', this.status);

      clearTimeout(this.timer);

      setTimeout(_ => {
        if (this.onConfirm) this.onConfirm();

        this.reset();
      }, 100);

      return;
    },
    countAndConfirm() {
      if (this.counter >= this.duration) {
        this.execute();
      }
      this.timer = setTimeout(() => {
        this.counter++;
        this.countAndConfirm();
      }, 1000);
    },

    reset() {
      this.status = 'default';
      this.$emit('status', this.status);

      this.cancel();
    },

    cancel() {
      if (this.status === 'executing') return;
      this.counter = 0;
      clearTimeout(this.timer);

      this.status = 'default';
      this.$emit('status', this.status);
    },
  },
};
</script>
