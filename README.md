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
import { DotwalletLogin } from 'dotwallet-vue';
export default {
  components: {
    DotwalletLogin,
  },
};
```

```html
<!-- Login button -->
<dotwallet-login
  lang="zh"
  app-id="89d0032043842644fdb4fb14099ff6be5"
  redirect-url="http://192.168.1.142:8080"
  custom-class="my-override-class"
>
</dotwallet-login>

<style>
  /* will override the default hover and active effects as well */
  .my-override-class {
    box-shadow: 0 0 10px green;
  }
</style>

<!-- Payment button -->
<!-- Required fields -->
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
></dotwallet-pay>
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
