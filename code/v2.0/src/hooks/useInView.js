import { useEffect, useRef, useState } from "react";

export default function useInView({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
} = {}) {
  const [ref, setRef] = useState(null);

  const [state, setState] = useState({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  });

  const callbackRef = useRef();
  callbackRef.current = onChange;

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    if (!ref) return;
    if (!("IntersectionObserver" in window)) return;
    if (frozen) return;

    let unobserve;

    const observer = new IntersectionObserver(
      (entries) => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some(
              (threshold) => entry.intersectionRatio >= threshold
            );

          setState({ isIntersecting, entry });

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ref,
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    freezeOnceVisible,
  ]);

  // ensures reinitialization if the observed element changes
  const prevRef = useRef(null);

  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);

  const result = [setRef, !!state.isIntersecting, state.entry];
  result.ref = result[0];
  result.isIntersecting = result[1];
  result.entry = result[2];

  return result;
}
