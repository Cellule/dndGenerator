import { createRoot } from "react-dom/client";
import App from "./App";

if (process.env.NODE_ENV === "production") {
  if (window.location.host === "www.npcgenerator.com") {
    console.log("you are accessing us via www. Redirecting you to non-www.");
    window.location.href = window.location.href.replace("www.", "");
  }
  // if (window.location.protocol === "http:") {
  //   console.log("you are accessing us via an insecure protocol (HTTP). Redirecting you to HTTPS.");
  //   window.location.href = window.location.href.replace("http:", "https:");
  // }
}

createRoot(document.getElementById("root")!).render(<App />);
