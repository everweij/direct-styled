# direct-styled

Very tiny (2kb) lib built with Typescript containing a HOC and a hook which enables you to set rapid changing styles without causing React-re-render.

Advice: Try to update styles with normal React state first! React is very fast, and most of the time `React.useState` will suffice.

```jsx
import * as React from "react";
import { directstyled, useDirectStyle } from "direct-styled";

function Example() {
  const [style, setStyle] = useDirectStyle();

  return (
    <directstyled.div
      style={style}
      onMouseMove={evt =>
        setStyle({
          transform: `translate(${evt.clientX}px, ${evt.clientY}px)`
        })
      }
    />
  );
}
```

Checkout a working demo on [CodeSandbox](https://codesandbox.io/s/direct-styled-cd4xx)!

## Install

```bash
npm install --save direct-styled
```

or

```bash
yarn add direct-styled
```

## Usage

### directstyled

Just another HOC. Without the special style provided by `useDirectStyle`, no additional behavior is added.

```jsx
import { directstyled } from "direct-styled";

// use with shorthand
const x = <directstyled.div />;
// ...or
const x = <directstyled.article />;

// construct with a tag-name
const x = directstyled("div");

// construct with a component
const x = directstyled(MyButton);

// or with styled-components
const x = directstyled(styled.div``);
```

### useDirectStyle

```jsx
import { useDirectStyle } from "direct-styled";

function Example() {
  // pass `style` to a directstyled-component
  // use `setStyle` to react to series of rapid changes, ie. mouse and scroll events
  const [style, setStyle] = useDirectStyle();

  return (
    <div
      onMouseMove={evt =>
        // Set new css-transform values, unburden the work of React
        setStyle({
          transform: `translate(${evt.clientX}px, ${evt.clientY}px)`
        })
      }
    >
      {/* Multiple directstyled-components can share the same `style` */}
      <directstyled.div
        style={{ position: "absolute", top: 0, left: 0, ...style }}
      />
      /* Multiple directstyled-components can share the same `style` */}
      <directstyled.div
        style={{ position: "absolute", top: 50, left: 50, ...style }}
      />
    </div>
  );
}
```

## License

MIT © [everweij](https://github.com/everweij)
