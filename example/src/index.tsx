import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom";

import styled from "styled-components";
import { directstyled, useDirectStyle } from "direct-styled";

const Base = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  position: relative;
`;

const Wrapper = styled.div``;

const Box = styled.div`
  border: 1px solid grey;
  border-radius: 4px;
  background-color: white;
  width: 50vh;
  height: 50vh;
  overflow: hidden;
`;

const Circle = styled(directstyled.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background-color: red;
  pointer-events: none;
  border-radius: 50%;
`;

function App() {
  const [isInBox, setInBox] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const renderCount = React.useRef(0);
  renderCount.current++;

  const [mode, setMode] = React.useState<"fast" | "slow">("slow");

  const [directStyledStyle, setStyle] = useDirectStyle();

  function handleMove(evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (mode === "slow") {
      setPos({ x: evt.clientX, y: evt.clientY });
    } else {
      setStyle({
        transform: `translate(calc(${evt.clientX}px - 50%), calc(${
          evt.clientY
        }px - 50%))`
      });
    }
  }

  return (
    <>
      <Base>
        <Wrapper>
          <div style={{ textAlign: "center" }}>
            Move you move inside the box...
          </div>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            With direct-styled:{" "}
            <input
              type="checkbox"
              checked={mode === "fast"}
              onClick={() => setMode(mode === "fast" ? "slow" : "fast")}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            Render count: {renderCount.current}
          </div>
          <Box
            onMouseMove={handleMove}
            onMouseEnter={() => setInBox(true)}
            onMouseLeave={() => setInBox(false)}
          >
            <Circle
              style={
                mode === "slow"
                  ? {
                      transform: `translate(calc(${pos.x}px - 50%), calc(${
                        pos.y
                      }px - 50%))`
                    }
                  : { ...directStyledStyle }
              }
            />
          </Box>
        </Wrapper>
      </Base>
      {Array(10000)
        .fill(true)
        .map((_, index) => (
          <div
            key={index}
            style={{ width: 2, height: 2, backgroundColor: "black", margin: 1 }}
          />
        ))}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
