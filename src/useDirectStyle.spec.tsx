import * as React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { directstyled, useDirectStyle } from ".";

afterEach(cleanup);

function TestComponent() {
  const renderCount = React.useRef(0);
  renderCount.current++;

  const ref = React.useRef<HTMLDivElement>(null);

  const [directStyleEnabled, setDirectStyleEnabled] = React.useState(false);

  const [style, setStyle] = useDirectStyle();

  return (
    <>
      <directstyled.div
        ref={ref}
        data-testid="direct-styled"
        style={{
          width: 100,
          height: 100,
          ...(directStyleEnabled ? style : {})
        }}
      />
      <button onClick={() => setDirectStyleEnabled(true)}>
        Enable direct style
      </button>
      <button onClick={() => setStyle({ backgroundColor: "blue" })}>
        Set new style
      </button>
      <button onClick={() => (ref.current!.style.color = "red")}>
        Test forward ref
      </button>
    </>
  );
}

test("set styles directly, even when used ad-hoc", async () => {
  const tools = render(<TestComponent />);

  const element = tools.getByTestId("direct-styled");
  const enableButton = tools.getByText("Enable direct style");
  const applyStyleButton = tools.getByText("Set new style");
  const testForwardRef = tools.getByText("Test forward ref");

  expect(element.style.backgroundColor).toEqual("");

  fireEvent.click(enableButton);
  fireEvent.click(applyStyleButton);
  fireEvent.click(applyStyleButton);
  fireEvent.click(testForwardRef);

  expect(element.style.backgroundColor).toEqual("blue");
  expect(element.style.width).toEqual("100px");
  expect(element.style.color).toEqual("red");
});
