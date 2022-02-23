import React from "react";
import { CookiesBanner } from "../cookiesBanner/CookiesBanner";

const App = () => {
  return (
    <div>
      <CookiesBanner trackingID={"test-id"} />
    </div>
  );
};

export default App;
