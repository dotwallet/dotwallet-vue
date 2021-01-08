<template>
  <div
    @touchend="cancel()"
    @touchstart.prevent="triggerCount()"
    @mouseup="cancel()"
    @mousedown.prevent="triggerCount()"
    class="dot-wallet-autopay-wrapper"
  >
    <slot>
      <pay-button-zh
        v-if="lang == 'zh'"
        :class="customClass ? [customClass, status] : ['longpress-button', status]"
      ></pay-button-zh>
      <pay-button-eng
        v-else
        :class="customClass ? [customClass, status] : ['longpress-button', status]"
      ></pay-button-eng>
    </slot>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import PayButtonEng from '../../public/svg/dotwallet-pay-button-blue-138x48-en.svg';
import PayButtonZh from '../../public/svg/dotwallet-paybutton-blue-152x48-zh.svg';
import { Buffer } from 'buffer';
import { DOTWALLET_API } from '../config';

export default {
  name: 'dotwallet-autopay',
  components: {
    PayButtonEng,
    PayButtonZh,
  },
  created() {
    document.addEventListener('mouseup', () => this.cancel());
  },
  destroyed() {
    document.removeEventListener('mouseup', () => this.cancel());
  },
  watch: {
    status() {
      this.$emit('status', this.status);
    },
    togglePay() {
      console.log('pay toggled');
      this.pay();
    },
  },
  props: {
    togglePay: {
      type: Boolean,
      default: false,
    },
    data: { required: false },
    lang: {
      type: String,
      default: 'en',
      validator: lang => ['en', 'zh'].indexOf(lang) !== -1,
    },
    productName: {
      type: String,
      required: true,
      validator: name => name.length > 0,
    },
    orderAmount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
      validator: id => id.length === 32,
    },
    customClass: {
      type: String,
    },
    autopayEndpoint: {
      type: String,
      required: true,
      validator: url => url.includes('http://') || url.includes('https://'),
    },
    duration: {
      type: Number,
      default: 3,
      validator: amt => 0 <= amt <= 10,
    },
    receiveAddress: {
      type: String,
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
      validator: type => type == 'BSV' || type == 'BTC' || type == 'ETH',
    },
    notifyUrl: {
      type: String,
    },
    fetchHeaders: {
      type: Object,
    },
    fetchOptions: {
      type: Object,
    },
    log: {
      type: Boolean,
      default: false,
    },
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
      this.countAndConfirm();
    },
    execute() {
      this.status = 'executing';
      clearTimeout(this.timer);

      setTimeout(_ => {
        try {
          this.pay();
        } catch (error) {
          if (this.log) console.log('error', error);
        }

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
      this.cancel();
    },

    cancel() {
      if (this.status === 'executing') return;
      this.counter = 0;
      clearTimeout(this.timer);

      this.status = 'default';
    },

    pay() {
      // pure data transaction:
      // if data prop exists, orderAmount can be zero, receiveAddress can be empty
      // transfer + data transaction:
      // if data prop exists, and orderAmount is not zero, and receiveAddress is not empty, then add an extra 'to' object.
      if (!this.data) {
        if (
          (this.coinType == 'BSV' && this.orderAmount < 540) ||
          (this.coinType == 'BTC' && this.orderAmount < 540)
        ) {
          if (this.log)
            console.log('order amount cannot be under 540 except for saving data and scripts');
          return null;
        }
        if (!this.receiveAddress) {
          if (this.log)
            console.log('recieve address cannot be empty except for saving data and scripts');

          return null;
        }
      } else {
        if (this.coinType !== 'BSV') {
          console.log('data transactions are onnly available with BSV');

          return null;
        }
        if (this.receiveAddress && this.orderAmount < 540) {
          console.log(
            'including data attached to a transaction also needs to meet minimum transaction amount --- 540 satoshi'
          );
          return null;
        }
      }
      const orderData = {
        out_order_id: uuidv4(),
        user_id: this.userId,
        coin_type: this.coinType,
        to: [],
        product: {
          id: uuidv4(),
          name: this.productName,
          detail: this.productDetail,
        },
      };
      if (this.data) {
        const hexEncoded = Buffer.from(JSON.stringify(this.data), 'utf8').toString('hex');
        // pure data transaction
        if (this.orderAmount === 0) {
          orderData.to.push({
            type: 'script',
            content: `006a${hexEncoded}`,
            amount: this.orderAmount,
          });
        } else {
          // transaction + data transaction
          orderData.to.push({
            type: 'address',
            content: this.receiveAddress,
            amount: this.orderAmount,
          });
          orderData.to.push({
            type: 'script',
            content: `006a${hexEncoded}`,
            amount: 0,
          });
        }
      } else {
        orderData.to.push({
          type: 'address',
          content: this.receiveAddress,
          amount: this.orderAmount,
        });
      }

      if (this.notifyUrl) orderData.notify_url = this.notifyUrl;
      if (this.subject) orderData.subject = this.subject;
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

      fetch(this.autopayEndpoint, options)
        .then(autoPaymentResponse => autoPaymentResponse.json())
        .then(data => {
          if (this.log) console.log('order response:\n', data);
          if (data.txid) {
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
  height: max-content;
}
.longpress-button {
  box-shadow: 0 0 10px gray;
}
.longpress-button.default {
  cursor: pointer;
  transform: scale(1);
  transition-duration: 0.2s;
}
.longpress-button.counting {
  cursor: progress;
  transition-duration: 3s;
  transform: scale(0.7);
}
.longpress-button.executing {
  transform: scale(1);
  transition-duration: 0.2s;
  opacity: 0.7;
  cursor: denied;
}
.longpress-button:hover {
  box-shadow: 0 0 10px rgb(40, 40, 40);
}
.longpress-button:active {
  /* opacity: 0.7; */
}
</style>
