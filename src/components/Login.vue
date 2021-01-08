<template>
  <div @click="openLink()" class="dot-wallet-login-wrapper">
    <slot>
      <login-button-zh
        v-if="lang == 'zh'"
        :class="customClass ? customClass : 'dot-wallet-login-button'"
      ></login-button-zh>
      <login-button-eng
        v-else
        :class="customClass ? customClass : 'dot-wallet-login-button'"
      ></login-button-eng>
    </slot>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { DOTWALLET_API } from '../config';
import LoginButtonEng from '../../public/svg/dotwallet-login-button-blue-254x48-en.svg';
import LoginButtonZh from '../../public/svg/dotwallet-loginbutton-blue-152x48-zh.svg';
export default {
  name: 'dotwallet-login',
  components: {
    LoginButtonEng,
    LoginButtonZh,
  },
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: lang => ['en', 'zh'].indexOf(lang) !== -1,
    },
    clientId: {
      type: String,
      default: '',
      validator: id => id.length === 32,
    },
    redirectUri: {
      type: String,
      default: '',
      validator: url => url.includes('http://') || url.includes('https://'),
    },
    scope: {
      type: String,
      default: 'user.info',
    },
    customClass: {
      type: String | undefined,
      default: undefined,
    },
  },
  methods: {
    openLink: function() {
      const scope = encodeURIComponent(this.scope);
      const redirectURI = encodeURIComponent(this.redirectUri);
      const loginState = uuidv4();
      localStorage.setItem('dotwalletLoginState', loginState);
      localStorage.setItem('dotwalletLoginRedirectUri', this.redirectUri);
      const url = `${DOTWALLET_API}oauth2/authorize?client_id=${this.clientId}&redirect_uri=${redirectURI}&response_type=code&state=${loginState}&scope=${scope}`;
      window.location.href = url;
    },
  },
};
</script>

<style scoped>
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
