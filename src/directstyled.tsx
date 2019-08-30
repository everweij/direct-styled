import * as React from "react";

import tags from "./tags";
import {
  InferReturnType,
  InnerProps,
  WrappedComponentOrTag,
  DirectStyled
} from "./types";

/**
 * Util functions
 */

// Allows us to inject an inline style object into `cssText` later on
function inlineStyleToCss(style: React.CSSProperties) {
  return Object.keys(style).reduce((css, styleProp) => {
    const value = style[styleProp as keyof React.CSSProperties];

    // skip non-css values (ie. "_subscribe")
    if (typeof value === "function") {
      return css;
    }

    // convert "marginTop" to "margin-top" for instance
    const cssProp = styleProp.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

    // concat number values with 'px'
    const cssValue = typeof value === "number" ? `${value + "px"}` : value;

    // concat our new style rule
    return css + ` ${cssProp}: ${cssValue}; \n`;
  }, "");
}

function capitalize(word: string) {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
}

// return "directstyled(Button)" or "directstyled(Div)"
function getWrappedComponentName(wrapped: WrappedComponentOrTag): string {
  return typeof wrapped === "string"
    ? capitalize(wrapped)
    : wrapped.displayName || wrapped.name || "Component";
}

function combineRefs(
  ...refs: Array<React.RefObject<any> | ((element: HTMLElement) => void)>
) {
  return function applyRef(element: HTMLElement) {
    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(element);
        return;
      }

      if ("current" in ref) {
        // @ts-ignore
        ref.current = element;
      }
    });
  };
}

/**
 * HOC
 */

function directstyled<C extends WrappedComponentOrTag>(tagOrComponent: C) {
  const wrappedComponentName = getWrappedComponentName(tagOrComponent);

  function Wrapper(props: InnerProps, forwardRef: any) {
    // keep a reference to the dom-element for future manipulation
    const ref = React.useRef<HTMLElement | null>(null);

    // ref to keep track of latest style
    const lastStyleRef = React.useRef<React.CSSProperties | undefined>(
      props.style
    );

    const subscriber = (props.style && props.style._subscribe) || false;

    // todo: add dependency to _subscribe
    React.useEffect(() => {
      if (!props.style || !props.style._subscribe) {
        return;
      }

      if (!ref.current) {
        throw new Error(
          `You've wrapped your component (${wrappedComponentName}) with direct-styled, but didn't forward a ref :(`
        );
      }

      // on every external style update...
      // run this function
      function onUpdate(externalStyle: React.CSSProperties) {
        const generatedCss = inlineStyleToCss({
          ...(lastStyleRef.current || {}),
          ...externalStyle
        });

        if (!ref.current) {
          return;
        }

        // commit style to dom-element at once by `cssText`
        ref.current!.style.cssText = generatedCss;
      }

      // subscribe our update function
      const unsubscribe = props.style._subscribe(onUpdate);

      // unsubscribe on unmount, or when _subscribe changes
      return () => unsubscribe(onUpdate);

      // eslint-disable-next-line
    }, [subscriber]);

    // effect to set last style
    React.useEffect(() => {
      lastStyleRef.current = props.style;
    }, [props.style]);

    // forward all props and assign refs
    return React.createElement(tagOrComponent, {
      ...props,
      ref: combineRefs(ref, forwardRef)
    });
  }

  Wrapper.displayName = `directstyled(${wrappedComponentName})`;

  return React.forwardRef(Wrapper) as InferReturnType<C>;
}

// create 'shorthands' for most common tags
// ie. <directstyled.div />
tags.forEach(element => {
  directstyled[element] = directstyled(element as keyof JSX.IntrinsicElements);
});

export default directstyled as DirectStyled;
