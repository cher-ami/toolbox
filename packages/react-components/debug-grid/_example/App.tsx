import React from "react";
import DebugGrid from "../debugGrid/DebugGrid";

const App = () => {
  return (
    <div>
      <DebugGrid columnsDesktop={40} columnsTablet={28} columnsMobile={20} maxSize={1440} triggerKey={"Space"} />
    </div>
  );
};

export default App;
