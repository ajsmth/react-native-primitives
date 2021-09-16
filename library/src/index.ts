import * as React from "react";
import {
  Appearance,
  AccessibilityInfo,
  AccessibilityChangeEvent,
  AccessibilityChangeEventName,
  useWindowDimensions,
  StyleProp,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";

// TODO - add animated styles to type below
// TODO - conditional hooks (at least for production)

// this was the best way I could think of to get the right style props
// ordering is important - view style overrides the others when placed first
type StyleFor<T> = T extends { style?: StyleProp<ImageStyle> }
  ? StyleProp<ImageStyle>
  : T extends { style?: StyleProp<TextStyle> }
  ? StyleProp<TextStyle>
  : T extends { style?: StyleProp<ViewStyle> }
  ? StyleProp<ViewStyle>
  : never;

type Options<T> = {
  base?: StyleFor<T>;
  variants?: VariantMap<StyleFor<T>>;
};

type VariantMap<T> = { [key: string]: { [key2: string]: T } };

type Nested<Type> = {
  [Property in keyof Type]?: keyof Type[Property];
};

type PartialOption<Type> = {
  [Property in keyof Type]?: keyof Type[Property];
};

type SelectorMap<VariantMap, Style> = Partial<
  {
    [K in keyof VariantMap]?: {
      [T in keyof VariantMap[K]]?: StyleFor<Style>;
    };
  }
>;

type DynamicMap<V, S> = SelectorMap<V, S>;

type Selectors<VariantMap, Style> = {
  light?: SelectorMap<VariantMap, Style>;
  dark?: SelectorMap<VariantMap, Style>;
  boldText?: SelectorMap<VariantMap, Style>;
  grayScale?: SelectorMap<VariantMap, Style>;
  invertColors?: SelectorMap<VariantMap, Style>;
  reduceTransparency?: SelectorMap<VariantMap, Style>;
  screenReader?: SelectorMap<VariantMap, Style>;
  width?: { [key: string]: DynamicMap<VariantMap, Style> };
  height?: { [key: string]: SelectorMap<VariantMap, Style> };
};

export function create<T, O extends Options<T>>(
  component: React.ComponentType<T>,
  config: O & { selectors?: Selectors<O["variants"], T>; props?: T }
) {
  const styleFn = getStylesFn<T>(config);
  config.selectors = config.selectors || {};

  function Component(
    props: React.PropsWithChildren<T & Nested<typeof config["variants"]>>
  ) {
    const style = styleFn(props);
    const styles = Object.values(fns)
      .map((fn) => fn(config.selectors, props))
      .filter(Boolean);

    return React.createElement<T>(component, {
      ...props,
      ...config.props,
      // @ts-ignore
      style: [style, props.style, ...styles],
    });
  }

  return Component;
}

const fns = {
  light: (selectors: any, props: any) =>
    useAppearance(selectors, props, "light"),

  dark: (selectors: any, props: any) => useAppearance(selectors, props, "dark"),

  boldText: (selectors: any, props: any) =>
    useA11yTrait(selectors, props, {
      selector: "boldText",
      a11yEventName: "boldTextChanged",
      getValueAsync: AccessibilityInfo.isBoldTextEnabled,
    }),

  grayScale: (selectors: any, props: any) =>
    useA11yTrait(selectors, props, {
      selector: "grayScale",
      a11yEventName: "grayscaleChanged",
      getValueAsync: AccessibilityInfo.isGrayscaleEnabled,
    }),

  invertColors: (selectors: any, props: any) =>
    useA11yTrait(selectors, props, {
      selector: "invertColors",
      a11yEventName: "invertColorsChanged",
      getValueAsync: AccessibilityInfo.isInvertColorsEnabled,
    }),

  reduceTransparency: (selectors: any, props: any) =>
    useA11yTrait(selectors, props, {
      selector: "reduceTransparency",
      a11yEventName: "reduceTransparencyChanged",
      getValueAsync: AccessibilityInfo.isReduceTransparencyEnabled,
    }),

  screenReader: (selectors: any, props: any) =>
    useA11yTrait(selectors, props, {
      selector: "screenReader",
      a11yEventName: "screenReaderChanged",
      getValueAsync: AccessibilityInfo.isScreenReaderEnabled,
    }),

  width: (selectors: any, props: any) =>
    useScreenSize(selectors, props, "width"),
  height: (selectors: any, props: any) =>
    useScreenSize(selectors, props, "height"),
};

export function getStylesFn<T>(options: Options<T>) {
  let styles: any = options.base || {};

  function handleVariantProps(props: any) {
    options.variants = options.variants || {};

    for (let key in props) {
      if (options.variants[key]) {
        const value = props[key];
        const styleValue = options.variants[key][value];
        if (styleValue) {
          styles = StyleSheet.flatten(StyleSheet.compose(styles, styleValue));
        }
      }
    }

    return styles;
  }

  return handleVariantProps;
}

function useA11yTrait(
  selectors: any,
  props: any,
  config: {
    selector: string;
    a11yEventName: AccessibilityChangeEventName;
    getValueAsync: () => Promise<boolean>;
  }
) {
  const [style, setStyles] = React.useState({});

  React.useEffect(() => {
    config.getValueAsync().then((isActive) => {
      if (isActive) {
        const styles = getStylesForActiveSelector(
          selectors[config.selector],
          props
        );

        setStyles(styles);
      }
    });
  }, [selectors, props]);

  function onA11yChange(isActive: AccessibilityChangeEvent) {
    let styles = {};

    if (isActive) {
      styles = getStylesForActiveSelector(selectors[config.selector], props);
    }

    setStyles(styles);
  }

  React.useEffect(() => {
    AccessibilityInfo.addEventListener(config.a11yEventName, onA11yChange);

    return () => {
      if (process.env.NODE_ENV !== "test") {
        AccessibilityInfo.removeEventListener(
          config.a11yEventName,
          onA11yChange
        );
      }
    };
  }, []);

  if (!selectors[config.selector]) {
    return undefined;
  }

  return style;
}

function useAppearance(selectors: any, props: any, selector: "light" | "dark") {
  const [style, setStyles] = React.useState(() => {
    const colorScheme = Appearance.getColorScheme();
    const selectorActive = colorScheme === selector;

    if (selectorActive) {
      return getStylesForActiveSelector(selectors[selector], props);
    }

    return {};
  });

  function onAppearanceChange(appearance: Appearance.AppearancePreferences) {
    let styles = {};

    if (appearance.colorScheme === selector) {
      styles = getStylesForActiveSelector(selectors[selector], props);
    }
    setStyles(styles);
  }

  React.useEffect(() => {
    let styles = {};

    if (Appearance.getColorScheme() === selector) {
      styles = getStylesForActiveSelector(selectors[selector], props);
    }

    setStyles(styles);
  }, [selectors, props, selector]);

  React.useEffect(() => {
    Appearance.addChangeListener(onAppearanceChange);

    return () => {
      if (process.env.NODE_ENV !== "test") {
        Appearance.removeChangeListener(onAppearanceChange);
      }
    };
  }, []);

  if (!selectors[selector]) {
    return undefined;
  }

  return style;
}

function useScreenSize(
  selectors: any,
  props: any,
  selector: "width" | "height"
) {
  const [style, setStyles] = React.useState({});

  const dimensions = useWindowDimensions();
  const value = dimensions[selector];

  React.useEffect(() => {
    let styles = {};

    const sels = selectors[selector] ?? {};

    for (let key in sels) {
      const expression = `${value} ${key}`;
      try {
        if (eval(expression)) {
          styles = getStylesForActiveSelector(selectors[selector][key], props);
        }
      } catch (error) {
        console.warn(
          `Did not pass in a valid query selector '${expression}' -> try a key with a valid expression like '> {number}'`
        );
      }
    }

    setStyles(styles);
  }, [value]);

  if (!selectors[selector]) {
    return undefined;
  }

  return style;
}

function getStylesForActiveSelector(selector: any, props: any) {
  let styles = {};

  for (let key in selector) {
    if (props[key] != null) {
      const matcher = props[key];
      Object.assign(styles, selector[key][matcher]);
    }
  }

  return styles;
}
