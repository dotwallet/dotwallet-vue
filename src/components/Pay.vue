<template>
  <div @click="pay()" class="dot-wallet-pay-wrapper">
    <slot>
      <pay-button-zh
        v-if="lang === 'zh'"
        :class="customClass ? customClass : 'dot-wallet-pay-button'"
      ></pay-button-zh>
      <pay-button-eng
        v-else
        :class="customClass ? customClass : 'dot-wallet-pay-button'"
      ></pay-button-eng>
    </slot>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import PayButtonEng from '../../public/svg/dotwallet-pay-button-blue-138x48-en.svg';
import PayButtonZh from '../../public/svg/dotwallet-paybutton-blue-152x48-zh.svg';
import { DOTWALLET_API } from '../config';

export default {
  components: {
    PayButtonEng,
    PayButtonZh,
  },
  name: 'dotwallet-pay',
  props: {
    lang: {
      type: String,
      default: 'en',
      validator: (lang) => ['en', 'zh'].indexOf(lang) !== -1,
    },
    productName: {
      type: String,
      required: true,
      validator: (name) => name.length > 0,
    },
    orderAmount: {
      type: Number,
      required: true,
      validator: (amount) => {
        if (this.coinType === 'BSV' || this.coinType === 'BTC') return amount >= 546;
        else return true;
      },
    },
    createOrderEndpoint: {
      type: String,
      required: true,
      validator: (url) => url.includes('http://') || url.includes('https://'),
    },
    receiveAddress: {
      type: String,
      validator: (add) => 25 < add.length < 36,
      required: true,
    },

    productDetail: {
      type: String,
    },
    subject: {
      type: String,
    },
    coinType: {
      type: String,
      default: 'BSV',
      validator: (type) => type === 'BSV' || type === 'BTC' || type === 'ETH',
    },
    notifyUrl: {
      type: String,
    },
    redirectUri: {
      type: String,
      validator: (url) => url.includes('http://') || url.includes('https://'),
    },

    fetchHeaders: {
      type: Object,
    },
    fetchOptions: {
      type: Object,
    },
    customClass: {
      type: String,
    },
    log: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (!this.notifyUrl && !this.redirectUri) {
      console.log('notify-url and redirect-uri cannot both be empty');
    }
  },
  data() {
    return {
      mousedown: false,
    };
  },
  methods: {
    pay() {
      if (!this.receiveAddress) {
        if (this.log) console.log('no receive address');
        return null;
      }
      if (!this.notifyUrl && !this.redirectUri) {
        if (this.log) console.log('must have either notify_url or redirect_uri');
      }

      const orderData = {
        out_order_id: uuidv4(),
        coin_type: this.coinType,
        to: [
          {
            type: 'address',
            content: this.receiveAddress,
            amount: this.orderAmount,
          },
        ],
        product: {
          id: uuidv4(),
          name: this.productName,
          detail: this.productDetail,
        },
      };
      if (this.notifyUrl) orderData.notify_url = this.notifyUrl;
      if (this.redirectUri) orderData.redirect_uri = this.redirectUri;
      if (this.subject) orderData.subject = this.subject;
      if (this.log) console.log('order data:\n', orderData);
      const options = {
        method: 'POST',
        body: JSON.stringify(orderData),
      };
      if (this.fetchHeaders)
        options.headers = {
          ...this.fetchHeaders,
        };
      else {
        options.headers = {
          'Content-type': 'application/json; charset=UTF-8',
        };
      }
      if (this.fetchOptions)
        for (const option in this.fetchOptions) options[option] = this.fetchOptions[option];
      if (this.log) console.log('fetch options:\n', options);

      fetch(this.createOrderEndpoint, options)
        .then((orderResponse) => orderResponse.json())
        .then((orderData) => {
          if (this.log) console.log('order response data:\n', orderData);
          if (orderData.order_id) {
            window.location.href = `${DOTWALLET_API}transact/order/apply_payment?order_id=${orderData.order_id}`;
            this.$emit('success', orderData);
          } else {
            this.$emit('fail', orderData);
          }
        })
        .catch((error) => {
          this.$emit('fail', error);
          if (this.log) console.log('error:\n', error);
        });
    },
  },
};
</script>

<style scoped>
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
