import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { create } from "react-native-primitives";

const Heading = create(Text, {
  base: {
    fontFamily: "Helvetica",
  },
  variants: {
    align: {
      center: {
        textAlign: "center",
      },
      left: {
        textAlign: "left",
      },
    },
    size: {
      large: {
        fontSize: 28,
        lineHeight: 34,
      },
      medium: {
        fontSize: 20,
        lineHeight: 28,
      },
      small: {
        fontSize: 18,
        lineHeight: 22,
      },
    },
    color: {
      normal: {
        color: "blue",
      },
      success: {
        color: "green",
      },
      danger: {
        color: "red",
      },
    },
  },
  selectors: {
    // when device theme is 'light'...
    light: {
      color: {
        // ...any `Heading` with `color="success"`...
        success: {
          // ...will have these styles applied
          color: "orange",
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
      "> 500": {},
    },
  },

  props: {
    accessibilityRole: "header",
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Heading size="large" color="success">
        Hi...try updating the theme
      </Heading>

      <View style={{ height: 12 }} />

      <Heading size="medium" color="normal" align="center">
        ...and rotating the phone
      </Heading>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
