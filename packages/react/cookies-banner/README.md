# React cookies banner

Display cookies banner and enable/disable tracking with google analytics or google tag manager.

## Usage

Copy / past the component folder in your React project:

```tsx
import { CookiesBanner } from "./CookiesBanner";

const App = () => {
  return (
    <div>
      <CookiesBanner trackingID={"..."} />
    </div>
  );
};
```

Change the style as needed in [CookiesBanner.less](cookiesBanner/CookiesBanner.less)

## Dependencies

Cookies Banner uses:

- [@wbe/debug](https://github.com/willybrauner/debug)

## props

| props               | type                                     | description                                                           | default value                       | optional |
| ------------------- | ---------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- | -------- |
| trackingID\*        | `string`                                 | ex: "UA-XXXXXXXX-X" for analytics or "GTM-XXXXXXXXXX" for tag manager | /                                   | false    |
| trackingType        | `ETrackingType`                          | GOOGLE_ANALYTICS or GOOGLE_TAG_MANAGER                                | GOOGLE_ANALYTICS                    | true     |
| show                | `boolean`                                | show the component (usefull to select new consent choise)             | true (depend of localStorage value) | true     |
| dispatchButtonClick | `(pEnableTrackingValue: boolean)=> void` | callback when button is clicked                                       | /                                   | true     |
| noticeText          | `string`                                 | (check default props)                                                 | /                                   | true     |
| moreText            | `string`                                 | (check default props)                                                 | /                                   | true     |
| moreLink            | `string`                                 | (check default props)                                                 | /                                   | true     |
| labelButtonAccept   | `string`                                 | (check default props)                                                 | /                                   | true     |
| labelButtonRefuse   | `string`                                 | (check default props)                                                 | /                                   | true     |
| className           | `string`                                 | (check default props)                                                 | /                                   | true     |

## Example

Install dependencies from root

```shell
npm i & lerna bootstrap
```

Start dev server from this package

```shell
npm run dev
```
