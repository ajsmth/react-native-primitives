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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getStylesFn = exports.create = void 0;
var React = require("react");
var react_native_1 = require("react-native");
var selectorStore = createSelectorStore();
function create(component, config) {
    var styleFn = getStylesFn(config);
    config.selectors = config.selectors || {};
    function Component(props) {
        var style = styleFn(props);
        var selectorStyle = useSelectors(config.selectors, props);
        return React.createElement(component, __assign(__assign(__assign({}, props), config.props), { 
            // @ts-ignore
            style: [style, props.style, selectorStyle] }));
    }
    return Component;
}
exports.create = create;
function getStylesFn(options) {
    var styles = options.base || {};
    function handleVariantProps(props) {
        options.variants = options.variants || {};
        for (var key in props) {
            if (options.variants[key]) {
                var value = props[key];
                var styleValue = options.variants[key][value];
                if (styleValue) {
                    styles = react_native_1.StyleSheet.flatten(react_native_1.StyleSheet.compose(styles, styleValue));
                }
            }
        }
        return styles;
    }
    return handleVariantProps;
}
exports.getStylesFn = getStylesFn;
function createSelectorStore() {
    var activeSelectorMap = {};
    var dimensionMap = {};
    var listeners = [];
    var currentColorScheme = react_native_1.Appearance.getColorScheme();
    if (currentColorScheme != null) {
        if (currentColorScheme === "light") {
            activeSelectorMap["light"] = true;
            activeSelectorMap["dark"] = false;
        }
        else if (currentColorScheme === "dark") {
            activeSelectorMap["light"] = false;
            activeSelectorMap["dark"] = true;
        }
        notify(["light", "dark"]);
    }
    react_native_1.Appearance.addChangeListener(function (_a) {
        var colorScheme = _a.colorScheme;
        if (colorScheme === "light") {
            activeSelectorMap["light"] = true;
            activeSelectorMap["dark"] = false;
        }
        else if (colorScheme === "dark") {
            activeSelectorMap["light"] = false;
            activeSelectorMap["dark"] = true;
        }
        else {
            delete activeSelectorMap["light"];
            delete activeSelectorMap["dark"];
        }
        notify(["light", "dark"]);
    });
    var a11yTraits = [
        "boldTextChanged",
        "grayscaleChanged",
        "invertColorsChanged",
        "reduceMotionChanged",
        "reduceTransparencyChanged",
        "screenReaderChanged",
    ];
    a11yTraits.forEach(function (trait) {
        react_native_1.AccessibilityInfo.addEventListener(trait, function (isActive) {
            activeSelectorMap[trait] = isActive;
            notify([trait]);
        });
    });
    function getInitialValues() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, isBoldTextEnabled, isGrayscaleEnabled, isInvertColorsEnabled, isReduceMotionEnabled, isReduceTransparencyEnabled, isScreenReaderEnabled;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            react_native_1.AccessibilityInfo.isBoldTextEnabled(),
                            react_native_1.AccessibilityInfo.isGrayscaleEnabled(),
                            react_native_1.AccessibilityInfo.isInvertColorsEnabled(),
                            react_native_1.AccessibilityInfo.isReduceMotionEnabled(),
                            react_native_1.AccessibilityInfo.isReduceTransparencyEnabled(),
                            react_native_1.AccessibilityInfo.isScreenReaderEnabled(),
                        ])];
                    case 1:
                        _a = _b.sent(), isBoldTextEnabled = _a[0], isGrayscaleEnabled = _a[1], isInvertColorsEnabled = _a[2], isReduceMotionEnabled = _a[3], isReduceTransparencyEnabled = _a[4], isScreenReaderEnabled = _a[5];
                        activeSelectorMap["boldText"] = isBoldTextEnabled;
                        activeSelectorMap["grayScale"] = isGrayscaleEnabled;
                        activeSelectorMap["invertColors"] = isInvertColorsEnabled;
                        activeSelectorMap["reduceMotion"] = isReduceMotionEnabled;
                        activeSelectorMap["reduceTransparency"] = isReduceTransparencyEnabled;
                        activeSelectorMap["screenReader"] = isScreenReaderEnabled;
                        notify(a11yTraits);
                        return [2 /*return*/];
                }
            });
        });
    }
    getInitialValues();
    var _a = react_native_1.Dimensions.get("screen"), initialWidth = _a.width, initialHeight = _a.height;
    dimensionMap["width"] = initialWidth;
    dimensionMap["height"] = initialHeight;
    react_native_1.Dimensions.addEventListener("change", function (_a) {
        var screen = _a.screen;
        dimensionMap["width"] = screen.width;
        dimensionMap["height"] = screen.height;
        notify(["width", "height"]);
    });
    function subscribe(fn) {
        listeners.push(fn);
        notify([]);
        return function () {
            listeners = listeners.filter(function (l) { return l !== fn; });
        };
    }
    function getState() {
        return __assign(__assign({}, activeSelectorMap), dimensionMap);
    }
    function notify(keys) {
        var state = getState();
        listeners.forEach(function (listener) { return listener(keys, state); });
    }
    return {
        subscribe: subscribe
    };
}
function useSelectors(selectors, props) {
    var _a = React.useState({}), styles = _a[0], setStyles = _a[1];
    React.useEffect(function () {
        var unsubscribe = selectorStore.subscribe(function (keys, state) {
            var variants = {};
            Object.entries(state).forEach(function (_a) {
                var selectorKey = _a[0], selectorValue = _a[1];
                if (selectorValue !== false) {
                    if (selectorKey === "width" || selectorKey === "height") {
                        var queries = selectors[selectorKey];
                        for (var mediaQuery in queries) {
                            var expression = selectorValue + " " + mediaQuery;
                            try {
                                if (eval(expression)) {
                                    mergeDeep(variants, queries[mediaQuery]);
                                }
                            }
                            catch (error) {
                                console.warn("Did not pass in a valid query selector '" + expression + "' -> try a key with a valid expression like '> {number}'");
                            }
                        }
                    }
                    else {
                        mergeDeep(variants, selectors[selectorKey]);
                    }
                }
            });
            var activeStyles = {};
            Object.entries(props).forEach(function (_a) {
                var variantKey = _a[0], variantValue = _a[1];
                if (variants[variantKey] && variants[variantKey][variantValue]) {
                    mergeDeep(activeStyles, variants[variantKey][variantValue]);
                }
            });
            setStyles(activeStyles);
        });
        return function () { return unsubscribe(); };
    }, [selectors, props]);
    return styles;
}
function mergeDeep(target, source) {
    var isObject = function (obj) { return obj && typeof obj === "object"; };
    if (!isObject(target) || !isObject(source)) {
        return source;
    }
    Object.keys(source).forEach(function (key) {
        var targetValue = target[key];
        var sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        }
        else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });
    return target;
}
