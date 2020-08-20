<template>
  <div @click="openLink()" class="dot-wallet-login-wrapper">
    <slot>
      <img
        :class="customClass ? customClass : 'dot-wallet-login-button'"
        :src="imgSrc"
        alt="DotWallet Login"
      />
    </slot>
  </div>
</template>

<script>
export default {
  name: 'dotwallet-login',
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: lang => ['en', 'zh'].indexOf(lang) !== -1,
    },
    appId: {
      type: String,
      default: '',
      validator: id => id.length === 32,
    },
    redirectUrl: {
      type: String,
      default: '',
      validator: url => url.includes('http://') || url.includes('https://'),
    },
    customClass: {
      type: String | undefined,
      default: undefined,
    },
  },
  computed: {
    imgSrc() {
      if (this.lang === 'zh')
        return 'https://gateway.pinata.cloud/ipfs/QmbdwijHk8Ts3RLyL7WcQd2vS59TNj9g19e85AXKbERZsN';
      else
        return 'https://gateway.pinata.cloud/ipfs/QmYtzviCMz5juvHjGXYUHERdZQKryuvMTSSoNhGTAVkwHk';
    },
  },
  methods: {
    openLink: function() {
      window.location.href = `https://www.ddpurse.com/openapi/get_code?app_id=${this.appId}&redirect_uri=${this.redirectUrl}`;
    },
  },
};
</script>

<style>
.dot-wallet-login-wrapper {
  width: max-content;
}
.dot-wallet-login-button {
  cursor: pointer;
  box-shadow: 0 0 10px gray;
}
.dot-wallet-login-button:hover {
  box-shadow: 0 0 10px rgb(40, 40, 40);
}
.dot-wallet-login-button:active {
  opacity: 0.7;
}
</style>
