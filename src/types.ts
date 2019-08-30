import * as React from "react";

export type WrappedComponentOrTag =
  | React.ComponentType<any>
  | keyof JSX.IntrinsicElements;

type InferProps<
  C extends WrappedComponentOrTag
> = C extends React.ComponentType<infer P> ? P : React.HTMLAttributes<C>;

export type InferReturnType<
  C extends WrappedComponentOrTag
> = React.ForwardRefExoticComponent<InferProps<C> & React.RefAttributes<{}>>;

export type Updater = (style: React.CSSProperties) => void;
export type Unsubscriber = (updater: Updater) => void;
export type StyleSetter = Updater;

export type DirectStyledStyle = {
  _subscribe?: (updater: Updater) => Unsubscriber;
};

export type InnerProps = {
  style: (React.CSSProperties & DirectStyledStyle) | undefined;
  [key: string]: any;
};

type Shorthand = {
  [TTag in keyof JSX.IntrinsicElements]: InferReturnType<TTag>
};

export interface DirectStyled extends Shorthand {
  <C extends WrappedComponentOrTag>(component: C): InferReturnType<C>;
}
