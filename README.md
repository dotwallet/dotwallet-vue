# dotwallet-vue

Vue components to quickly integrate DotWallet functionality into an app

[GitHub](https://github.com/dotwallet/dotwallet-vue)

## Install

```
npm install dotwallet-vue
```

## Use

```js
// main.js
import Dotwallet from 'dotwallet-vue';
Vue.use(Dotwallet);

// or in single file component
import { DotwalletLogin, DotwalletPay, DotWalletAutopay } from 'dotwallet-vue';
export default {
  components: {
    DotwalletLogin,
    DotwalletPay,
    DotWalletAutopay,
  },
};
```

```html
<template>
  <!-- Login button: Required fields -->
  <dotwallet-login
    app-id="89d0032043842644fdb4fb14099ff6be5"
    redirect-url="http://192.168.1.142:8080"
  ></dotwallet-login>
  <!-- with optional fields -->
  <dotwallet-login
    app-id="89d0032043842644fdb4fb14099ff6be5"
    redirect-url="http://192.168.1.142:8080"
    lang="zh"
    custom-class="my-override-class"
  ></dotwallet-login>

  <!-- Payment button: Required fields -->
  <dotwallet-pay
    lang="en"
    app-id="89d001043806644fdb4fb14099ff6be5"
    redirect-url="http://192.168.1.142:8080/payment-success"
    item-name="bananas"
    order-amount="900"
    api-endpoint="http://192.168.1.142:3000/create-order"
  ></dotwallet-pay>
  <!-- with optional fields -->
  <dotwallet-pay
    lang="en"
    app-id="89d001043806644fdb4fb14099ff6be5"
    redirect-url="http://192.168.1.142:8080/payment-success"
    custom-class="my-override-class"
    item-name="bananas"
    order-amount="900"
    api-endpoint="http://192.168.1.142:3000/create-order"
    notice-uri="http://192.168.1.142:3000/payment-result"
    :fetch-headers="{ 'API-Key': 'secret' }"
    :fetch-options="{ credentials: 'same-origin' }"
    :log="true"
    @succes="handleSuccess"
    @fail="handleFail"
  ></dotwallet-pay>

  <!-- Automatic Payment button: Required fields -->
  <dotwallet-autopay
    lang="en"
    app-id="89d001043806644fdb4fb14099ff6be5"
    user-open-id="47ff7d23ba6g06703e29347da4889e5b"
    item-name="bananas"
    order-amount="900"
    duration="2"
    api-endpoint="http://192.168.1.142:3000/create-autopayment"
  ></dotwallet-autopay>
  <!-- with optional fields -->
  <dotwallet-autopay
    lang="en"
    app-id="89d001043806644fdb4fb14099ff6be5"
    user-open-id="47ff7d23ba6f06703e29347da4889e5b"
    item-name="bananas"
    order-amount="900"
    duration="2"
    api-endpoint="http://192.168.1.142:3000/create-autopayment"
    :fetch-headers="{ 'API-Key': 'secret' }"
    :fetch-options="{ credentials: 'same-origin' }"
    :log="true"
    @status="handleStatusChange"
    @succes="handleSuccess"
    @fail="handleFail"
  ></dotwallet-autopay>
</template>
<script>
  //...
  export default {
    //...
    methods: {
      // status will be 'default', 'counting', or 'executing'
      handleStatusChange(status) {
        console.log('status', status);
      },
      handleSuccess(data) {
        console.log('handleSuccess', data);
      },
      handleFail(err) {
        console.log('handleFail', err);
      },
    },
  };
</script>

<style>
  /* will override the default hover and active effects as well */
  .my-override-class {
    box-shadow: 0 0 10px green;
  }
</style>
```

## to dev

```bash
yarn install
yarn dev
```

### to publish

> remember to build first

```bash
yarn build
npm publish
```
