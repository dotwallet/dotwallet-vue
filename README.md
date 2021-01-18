# dotwallet-vue

Vue components to quickly integrate DotWallet functionality into an app

[GitHub](https://github.com/dotwallet/dotwallet-vue)

## Install

```bash
npm install dotwallet-vue
```

## Use

```js
// main.js
import Dotwallet from 'dotwallet-vue';
Vue.use(Dotwallet);

// or in single file component
import {
  DotwalletLogin,
  DotwalletPay,
  DotWalletAutopay,
  DotwalletLoginRedirect,
} from 'dotwallet-vue';
export default {
  components: {
    DotwalletLogin,
    DotwalletPay,
    DotWalletAutopay,
    DotwalletLoginRedirect,
  },
};
```

```html
<template>
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
  ></dotwallet-pay>

  <dotwallet-autopay
    product-name="bananas"
    :order-amount="900"
    :receive-address="DEV_WALLET_ADDRESS"
    :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
    user-id="47ff7d23ba6f06703e29347da4889e5b"
  ></dotwallet-autopay>

  <!-- Kitchen sink examples -->

  <dotwallet-login
    lang="zh"
    client-id="89d001043806644fdb4fb14099ff6be5"
    scope="user.info autopay.bsv autopay.eth autopay.btc"
    :redirect-uri="YOUR_PAGE_URL"
    custom-class="my-override-class"
    :log="true"
    >CUSTOM SLOT<img src="custom-login-image.png"
  /></dotwallet-login>

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
    coin-type="ETH"
    :notify-url="YOUR_SERVER_URL + 'payment-result'"
    :fetch-headers="{ 'API-Key': 'secret' }"
    :fetch-options="{ credentials: 'same-origin' }"
    custom-class="my-override-class"
    @success="handleSuccess"
    @fail="handleFail"
    :log="true"
    >CUSTOM SLOT
  </dotwallet-pay>

  <dotwallet-autopay
    lang="zh"
    :receive-address="DEV_WALLET_ADDRESS"
    user-id="47ff7d23ba6f06703e29347da4889e5b"
    product-name="bananas"
    product-detail="5 large bananas"
    subject="bananas from the corner store"
    :order-amount="900"
    :duration="1"
    :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
    :notify-url="YOUR_SERVER_URL + 'payment-result'"
    :fetch-headers="{ 'API-Key': 'secret' }"
    :fetch-options="{ credentials: 'same-origin' }"
    custom-class="my-override-class"
    @status="handleStatusChange"
    @success="handleSuccess"
    @fail="handleFail"
    :log="true"
    >CUSTOM SLOT
    <img src="custom-login-image.png" />
  </dotwallet-autopay>

  <!-- Save data -->
  <input :v-model="saveData" type="text" />

  <dotwallet-autopay
    user-id="47ff7d23ba6f06703e29347da4889e5b"
    product-name="banana data"
    :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
    :data="{
        input: saveData,
      }"
  >
    SAVE DATA
  </dotwallet-autopay>

  <!-- Save data attached to a transaction -->
  <dotwallet-autopay
    user-id="47ff7d23ba6f06703e29347da4889e5b"
    :receive-address="DEV_WALLET_ADDRESS"
    product-name="banana payment and data"
    :order-amount="900"
    :autopay-endpoint="YOUR_SERVER_URL + 'autopay'"
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
    user-id="47ff7d23ba6f06703e29347da4889e5b"
  ></dotwallet-autopay>
</template>
<script>
  //...
  export default {
    //...
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
  /* will override the default hover and active effects as well */
  .my-override-class {
    box-shadow: 0 0 10px green;
  }
  /* for different autopay button status's */
  .my-override-class.counting {
    box-shadow: 0 0 10px yellow;
    cursor: grabbing;
  }
  .my-override-class.executing {
    box-shadow: 0 0 10px green;
  }
</style>
```

## Usage Details

DotwalletLogin, DotwalletPay, and DotwalletAutopay components can all accept a custom slot that could be an image, some text, or even another component.
You must have a backend server set up that can receive POST requests. Examples of such a server can be found [here](https://github.com/dotwallet/js-examples/blob/master/simple-store/src/index.js).
dotwallet-vue is also set to work perfectly with [dotwallet-node](https://github.com/dotwallet/dotwallet-node)

### dotwallet-login

Send the user to DotWallet's login page. You will receive a `code` and `state` at your provided `redirect-url`. You can then use the `code` to get a `user_access_token` and query user info. See the [docs](https://developers.dotwallet.com/documents/en/#user-authorization) for more.

- NOTE: When using the login button, the `state` will be saved to localStorage as `dotwalletLoginState`. When you receive the state at your `redirect-url`, please compare it to the saved state to avoid CSRF attacks.

To make comparing the state and obtaining `user_access_token` more convenient, we have included a component `DotwalletLoginRedirect`

#### dotwallet-login props

| Prop         | Type    | Required | Description                                                                                                                                                                                  |
| :----------- | :------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client-id    | string  |   YES    | Your application ID                                                                                                                                                                          |
| redirect-uri | string  |   YES    | Where to send the browser after success or failure. Must be valid URL with http:// or https://. Cannot be localhost.                                                                         |
| lang         | string  |    NO    | Language. Default is English. Options: ['en', 'zh']                                                                                                                                          |
| scope        | string  |    NO    | User permissions scopes. Default is user.info. To ask for autopay permissions, separate permissions with a space e.g. "user.info autopay.bsv autopay.btc autopay.eth"                        |
| custom-class | string  |    NO    | A class name for styling the DotWallet button. Note- this only works on the default DotWallet provided button when the slot is empty. If you have something in the slot, this has no effect. |
| log          | boolean |    NO    | Whether to console.log() events                                                                                                                                                              |

## dotwallet-login-redirect

Receives the `code` from the URL queries and calls your backend server, which will get the `user_access_token` from DotWallet for Developers API.

### dotwallet-login-redirect props/events

| Prop          | Type    | Required | Description                                                                                                                                                                                                                                                         |
| :------------ | :------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| auth-endpoint | string  |   YES    | Your application ID                                                                                                                                                                                                                                                 |
| fetch-headers | object  |    NO    | Used if you need to add some custom headers to the request to your backend.                                                                                                                                                                                         |
| fetch-options | object  |    NO    | Used if you need to add some custom options to the request to your backend. Because we use the javascript 'fetch()' for the request, this must be valid fetch options.                                                                                              |
| log           | boolean |    NO    | Whether to console.log() events                                                                                                                                                                                                                                     |
| @success      | event   |    NO    | The result from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment)              |
| @fail         | event   |    NO    | The result upon failure from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment) |

### dotwallet-pay

You must have a back-end server with an `create-order-endpoint` ready to receive the order info that this component produces. From your back-end, use the order info to create an order ID and respond with a JSON { "order_id": "<the-order-ID>"}

#### dotwallet-pay props/events

| Prop/Event            | Type    | Required | Description                                                                                                                                                                                                                                                         |
| :-------------------- | :------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| redirect-uri          | string  |  MAYBE   | Where to send the browser after success or failure. Must be valid URL with http:// or https://. Cannot be localhost. Each request must include either `notify_url` or `redirect_uri`.                                                                               |
| notify-url            | string  |  MAYBE   | Where to send the a notice after success or failure. Must be GET endpoint and a valid URL with http:// or https://. Cannot be localhost. Each request must include either `notify_url` or `redirect_uri`.                                                           |
| order-amount          | number  |   YES    | Order amount in Satoshis. Must be a valid number over 545 for BTC and BSV transactions. Can be 0 for ETH                                                                                                                                                            |
| create-order-endpoint | string  |   YES    | Your back-end server's endpoint for receiving and signing payment orders. can be localhost.                                                                                                                                                                         |
| receive-address       | string  |   YES    | Valid Bitcoin or ETH address                                                                                                                                                                                                                                        |
| lang                  | string  |    NO    | Language. Default is English. Options: ['en', 'zh']                                                                                                                                                                                                                 |
| product-name          | string  |    NO    | The item being paid for                                                                                                                                                                                                                                             |
| product-detail        | string  |    NO    | The item detailed description                                                                                                                                                                                                                                       |
| subject               | string  |    NO    | Order subject, heading or note                                                                                                                                                                                                                                      |
| coin-type             | string  |    NO    | Currency to use. If left blank, default is "BSV". Accepted values: "BSV", "BTC", and "ETH"                                                                                                                                                                          |
| fetch-headers         | object  |    NO    | Used if you need to add some custom headers to the request to your backend.                                                                                                                                                                                         |
| fetch-options         | object  |    NO    | Used if you need to add some custom options to the request to your backend. Because we use the javascript 'fetch()' for the request, this must be valid fetch options.                                                                                              |
| custom-class          | string  |    NO    | A class name for styling the DotWallet button. Note- this only works on the default DotWallet provided button when the slot is empty. If you have something in the slot, this has no effect.                                                                        |
| log                   | boolean |    NO    | Whether to console.log() events                                                                                                                                                                                                                                     |
| @success              | event   |    NO    | The result from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment)              |
| @fail                 | event   |    NO    | The result upon failure from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment) |

### dotwallet-autopay

You must have a back-end server with an `autopay-endpoint` ready to receive the order info and complete the payment.

#### dotwallet-autopay props/events

| Prop/Event       | Type    | Required | Description                                                                                                                                                                                                                                                                 |
| :--------------- | :------ | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| order-amount     | number  |   YES    | Order amount in Satoshis. Must be a valid number over 545 for BTC and BSV transactions. Can be 0 for ETH                                                                                                                                                                    |
| receive-address  | string  |   YES    | Stringified JSON array of address objects [{"address": "1MS3HE9M3oEqW81KXp8iK9nBMTGXekdxAP","amount": 622}]                                                                                                                                                                 |
| user-id          | string  |   YES    | The user's ID. make sure they have autopay enabled and their balance is high enough                                                                                                                                                                                         |
| autopay-endpoint | string  |   YES    | Your back-end server's endpoint for receiving autopayment orders. can be localhost.                                                                                                                                                                                         |
| product-name     | string  |   YES    | The item being paid for                                                                                                                                                                                                                                                     |
| product-detail   | string  |    NO    | The item detailed description                                                                                                                                                                                                                                               |
| subject          | string  |    NO    | Order subject, heading or note                                                                                                                                                                                                                                              |
| duration         | string  |    NO    | To protect users, autopay will only trigger after a set number of seconds. Passed as a string, but must be a valid number. Default = '3'                                                                                                                                    |
| coin-type        | string  |    NO    | Currency to use. If left blank, default is "BSV". Accepted values: "BSV", "BTC", and "ETH"                                                                                                                                                                                  |
| lang             | string  |    NO    | Language. Default is English. Options: ['en', 'zh']                                                                                                                                                                                                                         |
| notify-url       | string  |    NO    | Where to send the a notice after success or failure. Must be GET endpoint and a valid URL with http:// or https://. Cannot be localhost.                                                                                                                                    |
| custom-class     | string  |    NO    | A class name for styling the DotWallet button. Note- this only works on the default DotWallet provided button when the slot is empty. If you have something in the slot, this has no effect.                                                                                |
| fetch-headers    | object  |    NO    | Used if you need to add some custom headers to the request to your backend.                                                                                                                                                                                                 |
| fetch-options    | object  |    NO    | Used if you need to add some custom options to the request to your backend. Because we use the javascript 'fetch()' for the request, this must be valid fetch options.                                                                                                      |
| @status          | event   |    NO    | Payload will be 'default', 'counting', or 'executing'. While the user is pressing the button it will be 'counting' and when the set duration is reached and the button is calling the API, it will be 'executing', finally returning to 'default' when the call is complete |
| @success         | event   |    NO    | The result from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment)                      |
| @fail            | event   |    NO    | The result upon failure from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment)         |
| log              | boolean |    NO    | Whether to console.log() events                                                                                                                                                                                                                                             |

### to dev

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
