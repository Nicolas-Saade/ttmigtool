export default {};
export const Easing = {};
export const Animated = {
  timing: () => ({
    start: () => {},
  }),
};
export const createAnimatedComponent = (Component) => Component;
export const useSharedValue = (initialValue) => ({ value: initialValue });
export const useAnimatedStyle = () => ({});
export const withTiming = (value) => value;
export const withSpring = (value) => value;
export const withDelay = (delay, value) => value;