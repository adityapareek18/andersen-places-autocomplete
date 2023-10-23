import { useState, useEffect } from 'react';

export default function useScript(src) {
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(() => {
      if (!src) {
        setStatus("idle");
        return;
      }

      let script = document.querySelector(`script[src="${src}"]`);
      if (!script) {
        script = document.createElement("script");
        script.async = true;
        script.src = src;

        script.setAttribute("data-status", "loading");
        document.body.appendChild(script);

        const setAttributeFromEvent = (e) => {
          script.setAttribute("data-status", e.type === "load" ? "ready" : "error");
        };
        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        setStatus(script.getAttribute("data-status"));
      }

      const setStateFromEvent = (e) => {
        setStatus(e.type === "load" ? "ready" : "error");
      };
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
        }
      };
    },
  );

  return status;
}
