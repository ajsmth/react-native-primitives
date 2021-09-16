import * as React from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { create } from "../";

test("it renders the given component", async () => {
  const Heading = create(Text, {});
  const Box = create(View, {});

  let { toJSON: textJSON } = render(<Heading>Hi</Heading>);
  let json = textJSON();

  expect(json.type).toEqual("Text");

  let { toJSON: viewJSON } = render(<Box />);
  json = viewJSON();

  expect(json.type).toEqual("View");
});

test("it passes variant style props", async () => {
  const Heading = create(Text, {
    variants: {
      color: {
        success: {
          color: "green",
        },
        danger: {
          color: "red",
        },
      },

      size: {
        large: {
          fontSize: 38,
        },
      },
    },
  });

  const { toJSON } = render(
    <Heading color="success" size="large">
      Hi
    </Heading>
  );

  const json = toJSON();

  expect(json.props.style[0]).toEqual({
    color: "green",
    fontSize: 38,
  });
});

test("it passes base style props", async () => {
  const Heading = create(Text, {
    base: {
      fontFamily: "Helvetica",
    },
  });

  const { toJSON } = render(<Heading>Hi</Heading>);
  const json = toJSON();

  expect(json.props.style[0]).toEqual({ fontFamily: "Helvetica" });
});

test("it passes non-style props", () => {
  const Heading = create(Text, {
    props: {
      accessibilityRole: "header",
    },
  });

  const { toJSON } = render(<Heading>Hi</Heading>);
  const json = toJSON();

  expect(json.props.accessibilityRole).toEqual("header");
});
