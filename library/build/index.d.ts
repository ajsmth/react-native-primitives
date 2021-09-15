import * as React from "react";
import { StyleProp, ViewStyle, ImageStyle, TextStyle } from "react-native";
declare type StyleFor<T> = T extends {
    style?: StyleProp<ImageStyle>;
} ? StyleProp<ImageStyle> : T extends {
    style?: StyleProp<TextStyle>;
} ? StyleProp<TextStyle> : T extends {
    style?: StyleProp<ViewStyle>;
} ? StyleProp<ViewStyle> : never;
declare type Options<T> = {
    base?: StyleFor<T>;
    variants?: VariantMap<StyleFor<T>>;
    queries?: Queries<StyleFor<T>>;
    props?: Partial<T>;
};
declare type Queries<T> = {
    appearance?: {
        light?: any;
        dark?: any;
    };
    accessibility?: {
        boldText?: any;
        grayScale?: any;
        invertColors?: any;
        reduceTransparency?: any;
    };
    screen?: ScreenSizeQuery<T>;
};
declare type ScreenSizeQuery<T> = {
    height?: {
        [key: string]: T;
    };
    width?: {
        [key: string]: T;
    };
};
declare type VariantMap<T> = {
    [key: string]: {
        [key2: string]: T;
    };
};
declare type Nested<Type> = {
    [Property in keyof Type]?: keyof Type[Property];
};
declare type SelectorMap<VariantMap, Style> = Partial<{
    [K in keyof VariantMap]: {
        [T in keyof VariantMap[K]]?: StyleFor<Style>;
    };
}>;
declare type Selectors<VariantMap, Style> = {
    light?: SelectorMap<VariantMap, Style>;
    dark?: SelectorMap<VariantMap, Style>;
    boldText?: SelectorMap<VariantMap, Style>;
    grayScale?: SelectorMap<VariantMap, Style>;
    invertColors?: SelectorMap<VariantMap, Style>;
    reduceTransparency?: SelectorMap<VariantMap, Style>;
    screenReader?: SelectorMap<VariantMap, Style>;
    width?: Record<string, SelectorMap<VariantMap, Style>>;
    height?: Record<string, SelectorMap<VariantMap, Style>>;
};
export declare function create<T, O extends Options<T>>(component: React.ComponentType<T>, config: O & {
    selectors?: Selectors<O["variants"], T>;
}): (props: React.PropsWithChildren<T & Nested<typeof config["variants"]>>) => React.ReactElement<T, string | React.JSXElementConstructor<any>>;
export declare function getStylesFn<T>(options: Options<T>): (props: any) => any;
export {};
