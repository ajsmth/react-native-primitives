"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getStylesFn = exports.create = void 0;
var React = require("react");
var react_native_1 = require("react-native");
function create(component, config) {
    var styleFn = getStylesFn(config);
    config.selectors = config.selectors || {};
    function Component(props) {
        var style = styleFn(props);
        var styles = Object.values(fns).map(function (fn) { return fn(config.selectors, props); });
        return React.createElement(component, __assign(__assign(__assign({}, props), config.props), { 
            // @ts-ignore
            style: __spreadArray([style, props.style], styles, true) }));
    }
    return Component;
}
exports.create = create;
var fns = {
    light: function (selectors, props) {
        return useAppearance(selectors, props, "light");
    },
    dark: function (selectors, props) { return useAppearance(selectors, props, "dark"); },
    boldText: function (selectors, props) {
        return useA11yTrait(selectors, props, {
            selector: "boldText",
            a11yEventName: "boldTextChanged",
            getValueAsync: react_native_1.AccessibilityInfo.isBoldTextEnabled
        });
    },
    grayScale: function (selectors, props) {
        return useA11yTrait(selectors, props, {
            selector: "grayScale",
            a11yEventName: "grayscaleChanged",
            getValueAsync: react_native_1.AccessibilityInfo.isGrayscaleEnabled
        });
    },
    invertColors: function (selectors, props) {
        return useA11yTrait(selectors, props, {
            selector: "invertColors",
            a11yEventName: "invertColorsChanged",
            getValueAsync: react_native_1.AccessibilityInfo.isInvertColorsEnabled
        });
    },
    reduceTransparency: function (selectors, props) {
        return useA11yTrait(selectors, props, {
            selector: "reduceTransparency",
            a11yEventName: "reduceTransparencyChanged",
            getValueAsync: react_native_1.AccessibilityInfo.isReduceTransparencyEnabled
        });
    },
    screenReader: function (selectors, props) {
        return useA11yTrait(selectors, props, {
            selector: "screenReader",
            a11yEventName: "screenReaderChanged",
            getValueAsync: react_native_1.AccessibilityInfo.isScreenReaderEnabled
        });
    },
    width: function (selectors, props) {
        return useScreenSize(selectors, props, "width");
    },
    height: function (selectors, props) {
        return useScreenSize(selectors, props, "height");
    }
};
function getStylesFn(options) {
    var styles = options.base || {};
    function handleVariantProps(props) {
        options.variants = options.variants || {};
        for (var key in props) {
            if (options.variants[key]) {
                var value = props[key];
                var styleValue = options.variants[key][value];
                styles = react_native_1.StyleSheet.compose(styles, styleValue);
            }
        }
        return styles;
    }
    return handleVariantProps;
}
exports.getStylesFn = getStylesFn;
function useA11yTrait(selectors, props, config) {
    var _a = React.useState({}), style = _a[0], setStyles = _a[1];
    React.useEffect(function () {
        config.getValueAsync().then(function (isActive) {
            if (isActive) {
                var styles = getStylesForActiveSelector(selectors[config.selector], props);
                setStyles(styles);
            }
        });
    }, [selectors, props]);
    function onA11yChange(isActive) {
        var styles = {};
        if (isActive) {
            styles = getStylesForActiveSelector(selectors[config.selector], props);
        }
        setStyles(styles);
    }
    React.useEffect(function () {
        react_native_1.AccessibilityInfo.addEventListener(config.a11yEventName, onA11yChange);
        return function () {
            return react_native_1.AccessibilityInfo.removeEventListener(config.a11yEventName, onA11yChange);
        };
    }, []);
    return style;
}
function useAppearance(selectors, props, selector) {
    var _a = React.useState(function () {
        var colorScheme = react_native_1.Appearance.getColorScheme();
        var selectorActive = colorScheme === selector;
        if (selectorActive) {
            return getStylesForActiveSelector(selectors[selector], props);
        }
        return {};
    }), style = _a[0], setStyles = _a[1];
    function onAppearanceChange(appearance) {
        var styles = {};
        if (appearance.colorScheme === selector) {
            styles = getStylesForActiveSelector(selectors[selector], props);
        }
        setStyles(styles);
    }
    React.useEffect(function () {
        var styles = {};
        if (react_native_1.Appearance.getColorScheme() === selector) {
            styles = getStylesForActiveSelector(selectors[selector], props);
        }
        setStyles(styles);
    }, [selectors, props, selector]);
    React.useEffect(function () {
        react_native_1.Appearance.addChangeListener(onAppearanceChange);
        return function () { return react_native_1.Appearance.removeChangeListener(onAppearanceChange); };
    }, []);
    return style;
}
function useScreenSize(selectors, props, selector) {
    var _a = React.useState({}), style = _a[0], setStyles = _a[1];
    var dimensions = (0, react_native_1.useWindowDimensions)();
    var value = dimensions[selector];
    React.useEffect(function () {
        var _a;
        var styles = {};
        var sels = (_a = selectors[selector]) !== null && _a !== void 0 ? _a : {};
        for (var key in sels) {
            var expression = value + " " + key;
            try {
                if (eval(expression)) {
                    styles = getStylesForActiveSelector(selectors[selector][key], props);
                }
            }
            catch (error) {
                console.warn("Did not pass in a valid query selector '" + expression + "' -> try a key with a valid expression like '> {number}'");
            }
        }
        setStyles(styles);
    }, [value]);
    return style;
}
function getStylesForActiveSelector(selector, props) {
    var styles = {};
    for (var key in selector) {
        if (props[key] != null) {
            var matcher = props[key];
            Object.assign(styles, selector[key][matcher]);
        }
    }
    return styles;
}
