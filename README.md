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
    client-id="89d0032043842644fdb4fb14099ff6be5"
    redirect-url="http://192.168.1.142:8080"
  ></dotwallet-login>
  <!-- with optional fields -->
  <dotwallet-login
    client-id="89d0032043842644fdb4fb14099ff6be5"
    redirect-url="http://192.168.1.142:8080"
    lang="zh"
    custom-class="my-override-class"
    scope="user.info autopay.bsv autopay.btc autopay.eth"
  >
    <img src="..." alt="Custom Login Button" />
  </dotwallet-login>

  <!-- Payment button: Required fields -->
  <dotwallet-pay
    redirect-url="http://192.168.1.142:8080/payment-success"
    order-amount="900"
    api-endpoint="http://192.168.1.142:3000/create-order"
    receive-address="1MS3HE9M3oEqW81KXp8iK9nBMTGXekdxAP"
  ></dotwallet-pay>
  <!-- with optional fields -->
  <dotwallet-pay
    redirect-url="http://192.168.1.142:8080/payment-success"
    order-amount="900"
    api-endpoint="http://192.168.1.142:3000/create-order"
    lang="en"
    receive-address="1MS3HE9M3oEqW81KXp8iK9nBMTGXekdxAP"
    item-name="bananas"
    coin-type="BTC"
    notify-url="http://192.168.1.142:3000/payment-result"
    custom-class="my-override-class"
    :fetch-headers="{ 'API-Key': 'secret' }"
    :fetch-options="{ credentials: 'same-origin' }"
    :log="true"
    custom-class="my-override-class"
    @success="handleSuccess"
    @fail="handleFail"
  >
    <img src="..." alt="Custom Pay Button" />
  </dotwallet-pay>

  <!-- Automatic Payment button: Required fields -->
  <dotwallet-autopay
    client-id="89d001043806644fdb4fb14099ff6be5"
    user-open-id="47ff7d23ba6g06703e29347da4889e5b"
    item-name="bananas"
    order-amount="900"
    api-endpoint="http://192.168.1.142:3000/create-autopayment"
  ></dotwallet-autopay>
  <!-- with optional fields -->
  <dotwallet-autopay
    lang="en"
    client-id="89d001043806644fdb4fb14099ff6be5"
    user-open-id="47ff7d23ba6f06703e29347da4889e5b"
    item-name="bananas"
    order-amount="900"
    duration="2"
    api-endpoint="http://192.168.1.142:3000/create-autopayment"
    receive-address="1MS3HE9M3oEqW81KXp8iK9nBMTGXekdxAP"
    :fetch-headers="{ 'API-Key': 'secret' }"
    :fetch-options="{ credentials: 'same-origin' }"
    :log="true"
    custom-class="my-override-class"
    @status="handleStatusChange"
    @success="handleSuccess"
    @fail="handleFail"
  >
    <img src="..." alt="Custom Pay Button" />
  </dotwallet-autopay>
</template>
<script>
  //...
  export default {
    //...
    methods: {
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

## Usage Details

Login, DotwalletPay, and DotwalletAutopay components can all accept a custom slot that could be an image, some text, or even another component.

### dotwallet-login

Send the user to DotWallet's login page. You will receive a `code` and `state` at your provided `redirect-url`. You can then use the `code` to get a `user_access_token` and query user info. See the docs for more.

- NOTE: When using the login button, the `state` will be saved to localStorage as `dotwalletLoginState`. When you receive the state at your `redirect-url`, please compare it to the saved state to avoid CSRF attacks.

#### props

| Prop         | Type   | Required | Description                                                                                                                                                                                  |
| :----------- | :----- | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client-id    | string |   YES    | Your application ID                                                                                                                                                                          |
| redirect-url | string |   YES    | Where to send the browser after success or failure. Must be valid URL with http:// or https://. Cannot be localhost.                                                                         |
| lang         | string |    NO    | Language. Default is English. Options: ['en', 'zh']                                                                                                                                          |
| scope        | string |    NO    | User permissions scopes. Default is user.info. to ask for autopay permissions, seperate permissions with a space e.g. "user.info autopay.bsv autopay.btc autopay.eth"                        |
| custom-class | string |    NO    | A class name for styling the DotWallet button. Note- this only works on the default DotWallet provided button when the slot is empty. If you have something in the slot, this has no effect. |

### dotwallet-pay

You must have a back-end server with an `api-endpoint` ready to receive the order info that this component produces. From your back-end, use the order info to create an order ID and respond with a JSON { "order_id": "<the-order-ID>"}

#### props/events

| Prop/Event   | Type   | Required | Description                                                                                                          |
| :----------- | :----- | :------: | :------------------------------------------------------------------------------------------------------------------- |
| client-id    | string |   YES    | Your application ID                                                                                                  |
| redirect-url | string |   YES    | Where to send the browser after success or failure. Must be valid URL with http:// or https://. Cannot be localhost. |

| order-amount | string | YES | Order amount in Satoshis. Passed as a string, but must be a valid number over 545 for BTC and BSV transactions. Can be 0 for ETH |
| api-endpoint | string | YES | Your back-end server's endpoint for receiving and signing payment orders. can be localhost. |
| item-name | string | NO | The item being paid for |
| coin-type | string | NO | Currency to use. If left blank, default is "BSV". Accepted values: "BTC" and "ETH" |
| lang | string | NO | Language. Default is English. Options: ['en', 'zh'] |
| custom-class | string | NO | A class name for styling the DotWallet button. Note- this only works on the default DotWallet provided button when the slot is empty. If you have something in the slot, this has no effect. |
| notify-url | string | NO | Where to send the a notice after success or failure. Must be GET endpoint and a valid URL with http:// or https://. Cannot be localhost. |
| receive-address | string | NO | Valid Bitcoin or ETH address |
| :fetch-headers | object | NO | Used if you need to add some custom headers to the request to your backend. |
| :fetch-options | object | NO | Used if you need to add some custom options to the request to your backend. Because we use the javascript 'fetch()' for the request, this must be valid fetch options. |
| :log | boolean | NO | Whether to console.log() events |
| @success | event | NO | The result from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment) |
| @failure | event | NO | The result upon failure from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment) |

### dotwallet-autopay

#### props/events

| Prop/Event                                                                         | Type    | Required | Description                                                                                                                                                                                                                                                                 |
| :--------------------------------------------------------------------------------- | :------ | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client-id                                                                          | string  |   YES    | Your application ID                                                                                                                                                                                                                                                         |
| user-open-id                                                                       | string  |   YES    | The user's ID. make sure they have autopay enabled and their balance is high enough                                                                                                                                                                                         |
| item-name                                                                          | string  |   YES    | The item being paid for                                                                                                                                                                                                                                                     |
| order-amount                                                                       | string  |   YES    |
| Order amount in satoshis. Passed as a string, but must be a valid number over 700. |
| duration                                                                           | string  |   YES    | To protect users, autopay will only trigger after a set number of seconds. Passed as a string, but must be a valid number. Default = '3'                                                                                                                                    |
| api-endpoint                                                                       | string  |   YES    | Your back-end server's endpoint for receiving autopayment orders. can be localhost.                                                                                                                                                                                         |
| lang                                                                               | string  |    NO    | Language. Default is English. Options: ['en', 'zh']                                                                                                                                                                                                                         |
| custom-class                                                                       | string  |    NO    | A class name for styling the DotWallet button. Note- this only works on the default DotWallet provided button when the slot is empty. If you have something in the slot, this has no effect.                                                                                |
| receive-address                                                                    | string  |    NO    | Stringified JSON array of address objects [{"address": "1MS3HE9M3oEqW81KXp8iK9nBMTGXekdxAP","amount": 622}]                                                                                                                                                                 |
| :fetch-headers                                                                     | object  |    NO    | Used if you need to add some custom headers to the request to your backend.                                                                                                                                                                                                 |
| :fetch-options                                                                     | object  |    NO    | Used if you need to add some custom options to the request to your backend. Because we use the javascript 'fetch()' for the request, this must be valid fetch options.                                                                                                      |
| :log                                                                               | boolean |    NO    | Whether to console.log() events                                                                                                                                                                                                                                             |
| @status                                                                            | event   |    NO    | Payload will be 'default', 'counting', or 'executing'. While the user is pressing the button it will be 'counting' and when the set duration is reached and the button is calling the API, it will be 'executing', finally returning to 'default' when the call is complete |
| @success                                                                           | event   |    NO    | The result from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment)                      |
| @failure                                                                           | event   |    NO    | The result upon failure from the call to your endpoint. If your endpoint directly passes on the data from the call to the DotWallet API, then this event's payload will be the response object from step 1 [here](https://developers.dotwallet.com/en/docs/payment)         |

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
