import { useViewportSize } from "react-window-size-listener";

export const useIsKeyboardOpen = () => {
  const { height: viewportHeight } = useViewportSize();

  return window.innerHeight - viewportHeight > 300;
};
