# React cookies banner

Display cookies banner and enable/disable tracking with google analytics or google tag manager.

## Example

Install dependencies from root

```shell
npm i & lerna bootstrap
```

Start dev server from this package

```shell
npm run dev
```

## props

| props               | type                                     | description                                                           | default value                       | optional |
| ------------------- | ---------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- | -------- |
| trackingID\*        | `string`                                 | ex: "UA-XXXXXXXX-X" for analytics or "GTM-XXXXXXXXXX" for tag manager | /                                   | false    |
| trackingType        | `ETrackingType`                          | GOOGLE_ANALYTICS or GOOGLE_TAG_MANAGER                                | GOOGLE_ANALYTICS                    | true     |
| show                | `boolean`                                | show the component (usefull to select new consent choise)             | true (depend of localStorage value) | true     |
| dispatchButtonClick | `(pEnableTrackingValue: boolean)=> void` | callback when button is clicked                                       | /                                   | true     |
| noticeText          | `string`                                 |                                                                       |                                     | true     |
| moreText            | `string`                                 |                                                                       |                                     | true     |
| moreLink            | `string`                                 |                                                                       |                                     | true     |
| labelButtonAccept   | `string`                                 |                                                                       |                                     | true     |
| labelButtonRefuse   | `string`                                 |                                                                       |                                     | true     |
| className           | `string`                                 |                                                                       | /                                   | true     |
