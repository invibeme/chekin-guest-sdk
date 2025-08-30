# React + TypeScript + Webpack


The SDK has everything the same as the guestapp but also has some special things. It's used by clients on their side. Using special api-key from the dashboard and a reservation id. It's used by external clients and delivered by CDN.

## Instructions:
1. First of all you need to create an api-key in [this page](https://dashboard.chekin.com/account/online-checkin/), for that you should register your domain name there.
2. Next using the cdn link enable the SDK in your own application, here is an example:

Script connection:
```html
<script src="https://cdn.chekin.com/v{VERSION}/ChekinPro.js"></script>
<script>
    const api = new ChekinPro();

    sdk.initialize({
      apiKey: API_KEY,
      reservationId: RESERVATION_ID,
    });

    sdk.renderApp({targetNode: YOU_ROOT_ELEMENT});
</script>
```
`https://cdn.chekin.com/v{VERSION}/...` - particular version
`https://cdn.chekin.com/latest/...` - latest version
`https://cdn.chekin.com/developmentV2/...` - staging/development version

- `VERSION` is an actual version.
- `API_KEY` is api key which you got in the previous step.
- `YOU_ROOT_ELEMENT` is element where the SDK should be rendered

3. That's it. It should work now.

### Props

| Name                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Type                   | Optional | Default value  |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|---------|----------------|
| apiKey                    | Api key which is created in the Chekin dashboard.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | string                 | ❌       |                |
| reservationId             | Id of the particular reservation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | string                 | ✅       |                |
| externalId                | Special parameter for PMS clients. Note, if you pass `externalId` and `reservationId` then the `externalId` will have more priority and `reservationId` will be ignored.                                                                                                                                                                                                                                                                                                                                                                                  | string                 | ✅       |                |
| enableGuestsRemoval       | Enable removing guests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | boolean                | ✅       | false          |
| canEditReservationDetails | Enable edit reservation details. This way guests will be able to edit number of guests in a special settings.                                                                                                                                                                                                                                                                                                                                                                                                                                             | boolean                | ✅       | true           |
| canShareRegistrationLink  | Enable sharing registration link. This way guests will be able to share registration link using the special modal.                                                                                                                                                                                                                                                                                                                                                                                                                                        | boolean                | ✅       | false          |
| mode                      | Mode of the SDK, 'ALL' is default behaviour, 'ONLY_GUEST_FORM' means that you will be able to use only registration form and related components just to register guests and nothing more.                                                                                                                                                                                                                                                                                                                                                                 | 'ALL', 'ONLY_GUEST_FORM' | ✅       | 'ALL'          |
| onGuestRegistered         | Function that is called every time when a guest is registered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | function               | ✅       |                |
| onAllGuestsRegistered     | Function that is called when all guests are registered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | function               | ✅       |                |
| onReservationFound        | Function that is called when the reservation is loaded successfully                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | function               | ✅       |                |
| onReservationFetched      | Function that is called when the reservation is loaded with any result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | function               | ✅       |                |
| styles                    | Styles that will be injected into the SDK iframe to overwrite default ones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string                 | ✅       |                |
| stylesLink                | Link to a separate file with your styles. This way you can create an isolated styles.css file with your styles, pass link to this file and it will be injected into the SDK, similar to the `styles` prop                                                                                                                                                                                                                                                                                                                                                 | string                 | ✅       |                |
| defaultLanguage           | Default language which will be init as the first language. Otherwise it will be detected automatically from your browser settings.                                                                                                                                                                                                                                                                                                                                                                                                                        | string                 | ✅       | Auto detection |
| onConnectionError         | Fallback function that is called when an authentication error occurred. If you pass wrong apikey or reservation id it will be called. It has an argument which is an error message                                                                                                                                                                                                                                                                                                                                                                        | function               | ✅       |                |
| onError                   | Fallback function that is called when a code error occurred. It won't be called due to an authentication error. It has an argument which is an error                                                                                                                                                                                                                                                                                                                                                                                                      | function               | ✅       |                |
| onScreenChanged           | Fallback function that is called when screen/page is changed. It returns the following arguments: <br/>1. `type`:<br/> 'PAYMENTS_CART' - type of the `/payments` page,<br/> 'ORDER_HISTORY' - type of the `/payments/order-history` page;<br/> 2. `reservationId`: string;<br/> 3. `meta`: any.<br/> The `meta` may contain additional information. For example, when you get to the screen with the 'PAYMENTS_CART' type, the meta contains the following data: `currency`, `total_amount_to_pay`, `pre_auth_payments_total`, `retention_payments_total` | function               | ✅       |                |


## Installation
Before starting the project create `.env.local` and copy `.env.{environment}` to it.


## Scripts
* `yarn serve` - Start working on the SDK app in development mode.
* `yarn build:sdk:production` - Build the SDK app in production mode.
* `yarn build:sdk:staging` - Build the SDK app in development mode.
* `yarn lint`  - Run lint in the SDK app
* `yarn prettier`: - Run prettier for SDK
* `yarn test`: - Run unit tests


## GuestSDK

Connection:

```
<script src="https://cdn.chekin.com/v{VERSION}/ChekinPro.js"></script>
<script>
    const api = new ChekinPro();

    sdk.initialize({
      apiKey: API_KEY,
      reservationId: RESERVATION_ID,
    });

    sdk.renderApp({targetNode: YOU_ROOT_ELEMENT});
</script>
```

`https://cdn.chekin.com/v{VERSION}/...` - particular version `https://cdn.chekin.com/latest/...` - latest version `https://cdn.chekin.com/developmentV2/...` - staging/development version

- `VERSION` is a SDK version.
- `API_KEY` is api key which [you got in dashboard](https://www.notion.so/SDK-Instructions-f76f672fbe054cd682a308029b48639d?pvs=21).
- `YOU_ROOT_ELEMENT` is element where the SDK should be rendered. It means to be an element id. For example: `sdk.renderApp({targetNode: 'root'});`

**Return**:

| Method | Description | Props |
| --- | --- | --- |
| initialize | Initialization method. It’s used to pass init params. | [Here](https://www.notion.so/SDK-Instructions-f76f672fbe054cd682a308029b48639d?pvs=21) |
| renderApp | It’s used for render the SDK in a particular container. | [Here](https://www.notion.so/SDK-Instructions-f76f672fbe054cd682a308029b48639d?pvs=21) |
| unmount | For unmounting the SDK from your container. |   - |
| initAndRender | Works the same as initialize and renderApp in the same method and takes the same parameters. | The same as initialize and renderApp methods in one object |

**Props**

| Name | Description | Type | Optional | Default value |
| --- | --- | --- | --- | --- |
| apiKey | Api key which is created in the Chekin dashboard. | string | ❌ |  |
| reservationId | Id of the particular reservation. | string | ✅ |  |
| externalId | Special parameter for PMS clients. Note, if you pass `externalId` and `reservationId` then the `externalId` will have more priority and `reservationId` will be ignored. | string | ✅ |  |
| housingId | Id of the particular housing. It is needed for the `PROPERTY_LINK` mode. | string | ✅ |  |
| prefillData(**BETA**) | Parameter necessary for filling in the data fields of specific forms.
[See details](https://www.notion.so/SDK-Instructions-f76f672fbe054cd682a308029b48639d?pvs=21) | {
   guestForm: Object
} | ✅ |  |
| enableGuestsRemoval | Enable removing guests. | boolean | ✅ | false |
| canEditReservationDetails | Enable edit reservation details. This way guests will be able to edit number of guests in a special settings. | boolean | ✅ | true |
| canShareRegistrationLink | Enable sharing registration link. This way guests will be able to share registration link using the special modal. | boolean | ✅ | false |
| autoHeight
(available since **v2.14.0**) | Adjust height automatically. Since the sdk uses iframe it might a problem for some cases, for example if `ONLY_GUEST_FORM` mode is active. Although it is intended to be used as application and fill the screen completely | boolean | ✅ | false |
| mode | Mode of the SDK, 'ALL' is default behaviour.
`ONLY_GUEST_FORM` means that you will be able to use only registration form and related components just to register guests and nothing more.
`ONLY_IV` provides only IV views. As soon as the IV is finished the onIVFinished will be called with results of the IV check. 
`PROPERTY_LINK` provides only  views and functionality to find reservation of particular housing. If reservation is not found you will have a view to create a new reservation. A housing id should be passed for this mode | 'ALL', 'ONLY_GUEST_FORM' | ✅ | 'ALL' |
| onGuestRegistered | Function that is called every time when a guest is registered. | function | ✅ |  |
| onAllGuestsRegistered | Function that is called when all guests are registered. | function | ✅ |  |
| onReservationFound | Function that is called when the reservation is loaded successfully | function | ✅ |  |
| onReservationFetched | Function that is called when the reservation is loaded with any result. | function | ✅ |  |
| onIVFinished | Function that is called when IV has been passed.
It is called with an argument that contains details:
{
ocrPassed: *boolean*; biomatchPassed: *boolean*;
distance: *number* | *null*;
imagesDetails: any
} | function | ✅ |  |
| onReservationCreated | Is used in the `PROPERTY_LINK` mode. It is called when a reservation created in the new-reservation view. | function | ✅ |  |
| onReservationFoundFromHousing | Is used in the `PROPERTY_LINK` mode. It is called when a reservation found by booking reference or check-in date with guest email. | function | ✅ |  |
| onHeightChanged
(available since **v2.14.0**) | Function that is called on every height change and is used only with `autoHeight: true`. It is needed in case you want to control or be updated and give you height as an argument.

`onHeightChanged: (height: *number*) => *void*`fd | function | ✅ |  |
| styles | Styles that will be injected into the SDK iframe to overwrite default ones. | string | ✅ |  |
| stylesLink | Link to a separate file with your styles. This way you can create an isolated styles.css file with your styles, pass link to this file and it will be injected into the SDK, similar to the `styles` prop | string | ✅ |  |
| defaultLanguage | Default language which will be init as the first language. Otherwise it will be detected automatically from your browser settings. | 'en', 'es', 'it', 'de',  'fr', 'hu', 'ru', 'cs', 'bg', 'pt', 'ro', 'et',  'pl', 'ca', | ✅ | Auto detection |
| onConnectionError | Fallback function that is called when an authentication error occurred. If you pass wrong apiKey or reservation id it will be called. It has an argument which is an error message | function | ✅ |  |
| onError | Fallback function that is called when a code error occurred. It won't be called due to an authentication error. It has an argument which is an error | function | ✅ |  |
| onScreenChanged | Fallback function that is called when screen/page is changed. It returns the following arguments: 1. `type`: 'PAYMENTS_CART' | 'ORDER_HISTORY'
- 'PAYMENTS_CART' - type of the `/payments` page;
- 'ORDER_HISTORY' - type of the `/payments/order-history` page;
2. `reservationId`: string;
3. `meta`: any; 
The `meta` may contain additional information. For example, when you get to the screen with the 'PAYMENTS_CART' type, the meta contains the following data: `currency`, `total_amount_to_pay` `pre_auth_payments_total`, `retention_payments_total` | function | ✅ |  |

Example of onScreenChanged usage:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3f87cda6-c0df-4a30-893f-ccf0eb82c399/a07212af-48ec-443e-aa0c-b05a51483660/image.png)

**renderApp props**

| Name | Description | Type | Optional | Default value |
| --- | --- | --- | --- | --- |
| targetNode | Id of you target container where the SDK should be rendered. | string | ❌ |  |

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3f87cda6-c0df-4a30-893f-ccf0eb82c399/12dda34f-0de3-4bbb-9360-a6b89be0d5ce/image.png)

### The prefillData parameter

guestForm:

List of all possible fields for filling in:

`'name','surname','second_surname','gender','birth_date','nationality','document_type','document_number','visa_number','document_issue_date','document_expiration_date','birth_place_country','birth_place_address','residence_country','document_expedition_country','residence_address','next_destination_country','next_destination_district','next_destination_municipality','next_destination_address','residence_postal_code','citizenship','purpose_of_stay','arrived_from_country','arrived_from_district','phone','document_support_number','kinship_relationship','fiscal_code','email',` 

| **Fields** | **Format** | **Example** |
| --- | --- | --- |
| `phone` | { 
   code: string,
   number: string
} | { 
   code: “+546”, 
   number: “333333333”
} |
| `nationality, birth_place_country , residence_country, document_expedition_country, next_destination_country, next_destination_district, next_destination_municipality, citizenship, arrived_from_country, arrived_from_district,` | { 
   label: string,
   value: string
} | { 
   label: “Spanish”,
   value: “ES”
} |
| `birth_date, document_issue_date, document_expiration_date`  | Date or valid string | new Date(”2024-05-25”)
or
”2024-05-25” |
| `gender` | M | F | “M” |
| Rest fields | string |  |

Example of full usage:

![image.png](attachment:4c39dd28-1750-407a-a0f3-f9f78e7702d9:image.png)
