declare module "swagger-ui-react" {
  import type { FC } from "react";

  interface SwaggerUIProps {
    url?: string;
    spec?: Record<string, unknown>;
    [key: string]: unknown;
  }

  const SwaggerUI: FC<SwaggerUIProps>;
  export default SwaggerUI;
}

declare module "swagger-ui-react/swagger-ui.css";
