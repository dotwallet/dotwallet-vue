<template>
  <div class="dot-wallet-autopay-wrapper">
    <longpress @status="statusChange" :duration="parseInt(duration, 10)" :on-confirm="pay">
      <slot>
        <img
          :class="customClass ? customClass : ['autopay-button', status]"
          :src="imgSrc"
          alt="DotWallet Pay"
        />
      </slot>
    </longpress>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import Longpress from '../helpers/long-press';
export default {
  name: 'dotwallet-autopay',
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
      validator: amt => parseInt(amt, 10) > 700,
    },
    appId: {
      type: String,
      default: '',
      validator: id => id.length === 32,
    },
    userOpenId: {
      type: String,
      default: '',
      validator: id => id.length === 32,
    },
    customClass: {
      type: String | undefined,
      default: undefined,
    },
    apiEndpoint: {
      type: String,
      default: '',
      validator: url => url.includes('http://') || url.includes('https://'),
    },
    duration: {
      type: String,
      default: 3,
      validator: amt => 0 <= parseInt(amt, 10) < 11,
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
      status: 'default',
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
  components: { Longpress },
  methods: {
    statusChange(payload) {
      this.$emit('status', payload);
      this.status = payload;
    },
    pay() {
      const orderData = {
        app_id: this.appId,
        merchant_order_sn: uuidv4(),
        item_name: this.itemName,
        pre_amount: parseInt(this.orderAmount, 10),
        user_open_id: this.userOpenId,
      };
      if (this.log) console.log('order data:\n', orderData);
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
        .then(autoPaymentResponse => {
          if (this.log) console.log('order response full:\n', autoPaymentResponse);
          return autoPaymentResponse.json();
        })
        .then(data => {
          if (this.log) console.log('order response:\n', data);
          if (data.paytxid) {
            this.$emit('success', data);
          } else {
            this.$emit('fail', data);
          }
        })
        .catch(error => {
          this.$emit('fail', data);
          if (this.log) console.log('error:\n', error);
        });
    },
  },
};
</script>

<style scoped>
.dot-wallet-autopay-wrapper {
  width: max-content;
}
.autopay-button {
  box-shadow: 0 0 10px gray;
}
.autopay-button.default {
  cursor: pointer;
  transform: scale(1);
  transition-duration: 0.2s;
}
.autopay-button.counting {
  cursor: progress;
  transition-duration: 3s;
  transform: scale(0.7);
}
.autopay-button.executing {
  transform: scale(1);
  transition-duration: 0.2s;
  opacity: 0.7;
  cursor: denied;
}
.autopay-button:hover {
  box-shadow: 0 0 10px rgb(40, 40, 40);
}
.autopay-button:active {
  /* opacity: 0.7; */
}
</style>
