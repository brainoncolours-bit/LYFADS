"use client";

import { unstableSetRender } from "antd";
import { createRoot } from "react-dom/client";

unstableSetRender((node, container) => {
  container.__antdReactRoot ||= createRoot(container);
  const root = container.__antdReactRoot;
  root.render(node);

  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
    delete container.__antdReactRoot;
  };
});

const AntdReactPatch = () => null;

export default AntdReactPatch;
