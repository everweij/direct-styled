import * as React from "react";

import { Updater, StyleSetter, DirectStyledStyle } from "./types";

function useDirectStyle() {
  // keep track of updater functions
  const subsciptions = React.useRef<Updater[]>([]);

  // stash a style when set is called, but no subscriptions are present
  const stashedStyle = React.useRef<React.CSSProperties | null>();

  // setter which applies styles to all subscribed components
  function set(style: React.CSSProperties) {
    if (subsciptions.current.length === 0) {
      stashedStyle.current = style;
    } else {
      stashedStyle.current = null;
    }

    subsciptions.current.forEach(updater => updater(style));
  }

  // create a `directStyledStyle`
  // wrap it in a useMemo, since it does not need to change
  const directStyledStyle = React.useMemo<DirectStyledStyle>(() => {
    return {
      _subscribe: onUpdate => {
        subsciptions.current.push(onUpdate);

        if (stashedStyle.current) {
          onUpdate(stashedStyle.current);
        }

        return () =>
          (subsciptions.current = subsciptions.current.filter(
            x => x !== onUpdate
          ));
      }
    };
  }, []);

  return [directStyledStyle, set] as [React.CSSProperties, StyleSetter];
}

export default useDirectStyle;
