import * as React from "react";

import { Updater, StyleSetter, DirectStyledStyle } from "./types";

function useDirectStyle() {
  // keep track of updater functions
  const subsciptions = React.useRef<Updater[]>([]);

  // setter which applies styles to all subscribed components
  function set(style: React.CSSProperties) {
    subsciptions.current.forEach(updater => updater(style));
  }

  // create a `directStyledStyle`
  // wrap it in a useMemo, since it does not need to change
  const directStyledStyle = React.useMemo<DirectStyledStyle>(() => {
    return {
      _subscribe: onUpdate => {
        subsciptions.current.push(onUpdate);

        return () => subsciptions.current.filter(x => x !== onUpdate);
      }
    };
  }, []);

  return [directStyledStyle, set] as [React.CSSProperties, StyleSetter];
}

export default useDirectStyle;
