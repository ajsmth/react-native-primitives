# react-native-primitives

A utility to generate a set of themed react-native components.

Features:

- theme-ability
- typesafety
- clear and flexible API

## API

```tsx
import { Text } from "react-native";
import { create } from "react-native-primitives";

const Heading = create(Text, {
  base: {
    fontFamily: "Helvetica",
  },

  variants: {
    size: {
      large: {
        fontSize: 28,
        lineHeight: 34,
      },
      medium: {
        fontSize: 22,
        lineHeight: 28,
      },
      small: {
        fontSize: 18,
        lineHeight: 22,
      },
    },
    color: {
      success: {
        color: "green",
      },
      danger: {
        color: "red",
      },
    },
  },
});
```

This above produces a `Heading` component that can be used like so:

```tsx
function App() {
  return (
    <Heading size="medium" color="success">
      Hi
    </Heading>
  );
}
```

All of the variants are captured by typescript which makes using them a breeze.

## Declarative Selectors

We can extend the `Heading` component above with selectors:

```tsx
const Heading = create(RNText, {
  variants: {
    // ....
  },
  selectors: {
    // when device theme is 'light'...
    light: {
      color: {
        // ...any `Heading` with `color="success"`...
        success: {
          // ...will have these styles applied
          color: "tomato",
        },
      },
    },

    // selectors can also target a11y traits
    grayScale: {
      color: {
        success: {
          color: "lightgray",
        },
      },
    },

    //  ...and screen width and height
    width: {
      // when `width > 768`...
      "> 768": {
        size: {
          // ...update these styles
          medium: {
            fontSize: 32,
            lineHeight: 36,
          },
        },
      },
    },
  },
});
```

## Flexibility

You can use any style library you'd like - for example using tailwind for a terser, readable configuration.

```tsx
import tw from 'somewhere'
import { create } from "react-native-primitives";

const Heading = create(RNText, {
  size: {
    large: tw("text-4xl"),
    medium: tw("text-3xl"),
    small: tw("text-2xl"),
  },
  weight: {
    normal: tw("font-medium"),
    heavy: tw("font-semibold"),
  },
  color: {
    success: tw("text-green-500"),
    danger: tw("text-red-500"),
  },
});
```
