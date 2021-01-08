<template>
  <div></div>
</template>

<script>
export default {
  props: {
    authEndpoint: {
      type: String,
      default: '',
      validator: url => url.includes('http://') || url.includes('https://'),
    },
    fetchHeaders: {
      type: Object | undefined,
    },
    fetchOptions: {
      type: Object | undefined,
    },
    log: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const code = urlParams.get('code');
    const savedState = localStorage.getItem('dotwalletLoginState');
    if (!code || !state) return null;
    if (this.log) console.log('state, saved state: ', state, savedState);
    if (this.log) console.log('saved state matches returned state: ', savedState === state);
    if (savedState === state) this.callAuthServer(code);
  },
  data() {
    return {};
  },
  methods: {
    // call your auth server to get the user_access_token and user info (if your server is set up to get the user info as well)
    callAuthServer(code) {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          code,
          redirect_uri: localStorage.getItem('dotwalletLoginRedirectUri'), // this must match step one but not urlencoded
        }),
      };
      if (this.fetchHeaders)
        options.headers = {
          ...this.fetchHeaders,
          'Content-type': 'application/json; charset=UTF-8',
        };
      else {
        options.headers = {
          'Content-type': 'application/json; charset=UTF-8',
        };
      }
      if (this.fetchOptions)
        for (const option in this.fetchOptions) options[option] = this.fetchOptions[option];
      if (this.log) console.log('fetch options:\n', options);
      fetch(this.authEndpoint, options)
        .then(res => res.json())
        .then(authResponse => {
          if (this.log) console.log('authResponse', authResponse);
          this.$emit('success', authResponse);
        })
        .catch(error => {
          this.$emit('fail', error);
          if (this.log) console.log('error: ', error);
        });
    },
  },
};
</script>

<style></style>
