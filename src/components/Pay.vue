<template>
  <div @click="pay()" class="dot-wallet-pay-wrapper">
    <slot>
      <img
        :class="customClass ? customClass : 'dot-wallet-pay-button'"
        :src="imgSrc"
        alt="DotWallet Pay"
      />
    </slot>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  name: 'dotwallet-pay',
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: lang => ['en', 'zh'].indexOf(lang) !== -1,
    },
    itemName: {
      type: String,
      default: '',
      validator: name => name.length > 0,
    },
    orderAmount: {
      type: String,
      default: 0,
      validator: amt => parseInt(amt, 10) > 546,
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
    noticeUri: {
      type: String | undefined,
      default: undefined,
    },
    redirectUrl: {
      type: String,
      default: '',
      validator: url => url.includes('http://') || url.includes('https://'),
    },
    apiEndpoint: {
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
  data() {
    return {
      mousedown: false,
    };
  },
  computed: {
    imgSrc() {
      if (this.lang === 'zh')
        return 'https://gateway.pinata.cloud/ipfs/QmPz8h1GYET575Gdujrp7H25fGMkPmyQTHy4ufPGgyyJo3';
      else
        return 'https://gateway.pinata.cloud/ipfs/QmSxsQNXCRymA3KKyVheL3dRsz3FE24DC6vRFy3QgXKhKF';
    },
  },
  methods: {
    pay() {
      const orderData = {
        app_id: this.appId,
        merchant_order_sn: uuidv4(),
        item_name: this.itemName,
        order_amount: parseInt(this.orderAmount, 10),
        nonce_str: new Date().toString(),
        redirect_uri: this.redirectUrl,
        notice_uri: this.noticeUri,
      };
      if (this.log) console.log('order data', orderData);
      const options = {
        method: 'POST',
        body: JSON.stringify(orderData),
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
      if (this.log) console.log('fetch options', options);

      fetch(this.apiEndpoint, options)
        .then(orderSnResponse => orderSnResponse.json())
        .then(orderSnData => {
          if (this.log) console.log('order response', orderSnData);
          if (orderSnData.order_sn) {
            if (this.log) console.log('orderSn', orderSnData.order_sn);
            window.location.href = `https://www.ddpurse.com/desktop/open/order?order_sn=${orderSnData.order_sn}`;
          } else {
            if (this.log) console.log(orderSnData);
          }
        })
        .catch(error => {
          if (this.log) console.log(error);
        });
    },
  },
};
</script>

<style>
.dot-wallet-pay-wrapper {
  width: max-content;
}
.dot-wallet-pay-button {
  cursor: pointer;
  box-shadow: 0 0 10px gray;
}
.dot-wallet-pay-button:hover {
  box-shadow: 0 0 10px rgb(40, 40, 40);
}
.dot-wallet-pay-button:active {
  opacity: 0.7;
}
</style>
