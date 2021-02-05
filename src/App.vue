<template>
  <div id="app">
    <!-- Simple use examples with only required fields -->
    <dotwallet-login
      client-id="89d001043806644fdb4fb14099ff6be5"
      scope="user.info autopay.bsv"
      :redirect-uri="YOUR_PAGE_URL"
    ></dotwallet-login>

    <dotwallet-login-redirect
      :auth-endpoint="YOUR_SERVER_URL + 'auth'"
      @success="handleAuthSuccess"
    ></dotwallet-login-redirect>

    <dotwallet-pay
      product-name="bananas"
      :order-amount="900"
      :receive-address="DEV_WALLET_ADDRESS"
      :create-order-endpoint="YOUR_SERVER_URL + 'create-order'"
      :redirect-uri="YOUR_PAGE_URL"
      :log="true"
    ></dotwallet-pay>

    <dotwallet-autopay
      product-name="bananas"
      :order-amount="900"
      :receive-address="DEV_WALLET_ADDRESS"
      :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
      :user-id="DEV_USER_ID"
    ></dotwallet-autopay>

    <!-- Kitchen sink examples -->

    <dotwallet-login
      lang="zh"
      client-id="89d001043806644fdb4fb14099ff6be5"
      scope="user.info autopay.bsv autopay.eth autopay.btc"
      :redirect-uri="YOUR_PAGE_URL"
      custom-class="my-override-class"
      :log="true"
    ></dotwallet-login>

    <dotwallet-login-redirect
      :auth-endpoint="YOUR_SERVER_URL + 'auth'"
      :fetch-headers="{ 'API-Key': 'secret' }"
      :fetch-options="{ credentials: 'same-origin' }"
      @success="handleAuthSuccess"
      @fail="handleFail"
      :log="true"
    ></dotwallet-login-redirect>

    <dotwallet-pay
      :redirect-uri="YOUR_PAGE_URL"
      :order-amount="900"
      :create-order-endpoint="YOUR_SERVER_URL + 'create-order'"
      :receive-address="DEV_WALLET_ADDRESS"
      lang="zh"
      product-name="bananas"
      product-detail="5 large bananas"
      subject="bananas from the corner store"
      coin-type="BSV"
      :notify-url="YOUR_SERVER_URL + 'payment-result'"
      :fetch-headers="{ 'API-Key': 'secret' }"
      :fetch-options="{ credentials: 'same-origin' }"
      custom-class="my-override-class"
      @success="handleSuccess"
      @fail="handleFail"
      :log="true"
      >CUSTOM ORDER -- order pay</dotwallet-pay
    >

    <dotwallet-autopay
      :receive-address="DEV_WALLET_ADDRESS"
      :user-id="DEV_USER_ID"
      product-name="bananas"
      product-detail="5 large bananas"
      subject="bananas from the corner store"
      :order-amount="900"
      coin-type="BSV"
      :duration="1"
      :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
      :notify-url="YOUR_SERVER_URL + 'payment-result'"
      lang="zh"
      :fetch-headers="{ 'API-Key': 'secret' }"
      :fetch-options="{ credentials: 'same-origin' }"
      custom-class="my-override-class"
      @status="handleStatusChange"
      @success="handleSuccess"
      @fail="handleFail"
      :log="true"
    >
      CUSTOM SLOT -- autopay</dotwallet-autopay
    >

    <!-- Save data -->
    <input :v-model="saveData" type="text" />

    <dotwallet-autopay
      :duration="1"
      :user-id="DEV_USER_ID"
      product-name="banana data"
      :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
      @success="handleSuccess"
      :data="{
        input: saveData,
      }"
    >
      <button class="my-override-class"><p>SAVE DATA</p></button>
    </dotwallet-autopay>

    <!-- Save data attached to a transaction -->
    <dotwallet-autopay
      user-id="47ff7d23ba6f06703e29347da4889e5b"
      :receive-address="DEV_WALLET_ADDRESS"
      product-name="banana payment and data"
      :order-amount="900"
      :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
      @success="handleSuccess"
      :data="{
        input: saveData,
      }"
    >
      SAVE DATA ALONGSIDE TRANSACTION
    </dotwallet-autopay>

    <!-- Hidden payment button, trigger Autopay programmatically -->

    <dotwallet-autopay
      :toggle-pay="togglePay"
      style="display: none"
      product-name="bananas"
      :order-amount="900"
      :receive-address="DEV_WALLET_ADDRESS"
      :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
      @status="handleStatusChange"
      @success="handleSuccess"
      :log="true"
      :user-id="DEV_USER_ID"
    ></dotwallet-autopay>
    <button @click="togglePay = !togglePay">toggle hidden payment button</button>
  </div>
</template>

<script>
import Login from './components/Login';
import LoginRedirect from './components/LoginRedirect';
import Pay from './components/Pay';
import AutoPay from './components/AutoPay';
import { YOUR_SERVER_URL, YOUR_PAGE_URL, DEV_WALLET_ADDRESS, DEV_USER_ID } from './config';
export default {
  name: 'app',
  data() {
    return {
      YOUR_PAGE_URL,
      YOUR_SERVER_URL,
      DEV_WALLET_ADDRESS,
      DEV_USER_ID,
      togglePay: false,
      saveData: '',
    };
  },
  components: {
    DotwalletLogin: Login,
    DotwalletLoginRedirect: LoginRedirect,
    DotwalletPay: Pay,
    DotwalletAutopay: AutoPay,
  },
  methods: {
    handleSuccess(msg) {
      alert('success: \n' + JSON.stringify(msg));
      console.log('handleSuccess:\n', msg);
    },
    handleFail(err) {
      alert('failed: \n' + JSON.stringify(err));
      console.log('handleFail:\n', err);
    },

    // only for autopay button
    handleStatusChange(status) {
      console.log('status:\n', status);
    },
    // only for authcallback
    handleAuthSuccess(authInfo) {
      // your auth server will return the user_auth_token info and/or the user info.
      console.log('auth info', authInfo);
      // You'll probably want to save it somewhere:
      // store.commit('saveAuthInfo', authInfo)
    },
  },
};
</script>

<style>
.my-override-class {
  box-shadow: 0 0 10px purple;
  cursor: grab;
}
/* for different autopay button status's */
.my-override-class.counting {
  box-shadow: 0 0 10px yellow;
  cursor: grabbing;
}
.my-override-class.executing {
  box-shadow: 0 0 10px green;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
