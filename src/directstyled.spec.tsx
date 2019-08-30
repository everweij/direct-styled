import * as React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { directstyled } from ".";
import { Updater } from "./types";

afterEach(cleanup);

test("accepts a tag-name as argument", async () => {
  const onClick = jest.fn();

  const tools = render(
    <directstyled.div data-testid="direct-styled" onClick={onClick} />
  );

  const element = tools.getByTestId("direct-styled");
  expect(element).toBeTruthy();

  fireEvent.click(element);

  expect(onClick).toBeCalled();
});

test("accepts a component as argument", async () => {
  const TestComponent = React.forwardRef((props: {}, ref: any) => (
    <div ref={ref} {...props} />
  ));
  const Enhanced = directstyled(TestComponent);

  const tools = render(<Enhanced data-testid="direct-styled" />);

  const element = tools.getByTestId("direct-styled");
  expect(element).toBeTruthy();
});

test("subscribes when the a `DirectStyledStyle` was provided", async () => {
  const fakeDirectStyledStyle = {
    _subscribe: jest.fn(() => () => null)
  };

  render(
    <directstyled.div
      data-testid="direct-styled"
      style={fakeDirectStyledStyle as React.CSSProperties}
    />
  );

  expect(fakeDirectStyledStyle._subscribe).toHaveBeenCalled();
});

test("Throws when wrapped component does not forward a ref, and a DirectStyledStyle was provided", async () => {
  const fakeDirectStyledStyle = {
    _subscribe: jest.fn(() => () => null)
  };

  // @ts-ignore
  const TestComponent = React.forwardRef((props: { style: any }, ref: any) => (
    // we are skipping the ref here
    <div ref={() => null} {...props} />
  ));
  const Enhanced = directstyled(TestComponent);

  const consoleError = console.error;
  console.error = () => null;

  expect(() => {
    render(
      <Enhanced
        data-testid="direct-styled"
        style={fakeDirectStyledStyle as React.CSSProperties}
      />
    );
  }).toThrow();

  console.error = consoleError;
});

test("updates a value directly via a provided updater function", async () => {
  let updater: Updater | null = null;

  const fakeDirectStyledStyle = {
    _subscribe: (arg: Updater) => (updater = arg)
  };

  const tools = render(
    <directstyled.div
      data-testid="direct-styled"
      style={fakeDirectStyledStyle as React.CSSProperties}
    />
  );

  expect(updater).toBeTruthy();

  updater!({ backgroundColor: "blue" });

  expect(tools.getByTestId("direct-styled").style.backgroundColor).toEqual(
    "blue"
  );
});
