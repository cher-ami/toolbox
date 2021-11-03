import css from "./Slider.module.less";
import React, { ReactNode, useRef, useState } from "react";
import { useWindowSize } from "@wbe/use-window-size";
import { useDrag } from "react-use-gesture";
import { gsap } from "gsap";
import { scrollLockService } from "./helpers/scrollLockService";
import { merge } from "./helpers/merge";

interface IProps {
  className?: string;
  children: ReactNode[];
}

/**
 * @name Slider
 */
function Slider(props: IProps) {
  const rootRef = useRef(null);
  const wrapperRef = useRef(null);
  const windowSize = useWindowSize();
  const isMobile = window.innerWidth < 768;

  const [isScrolling, setIsScrolling] = useState(false);
  const [preventLink, setPreventLink] = useState(false);

  /**
   * Wheel Drag handlder
   */
  const scrollXRef = useRef<number>(0);
  const lastScrollX = useRef<number>(0);
  const drag = useDrag(
    (e) => {
      scrollLockService[e.active ? "lock" : "unlock"]();
      setIsScrolling(e.active);

      // manage prevent link state for children
      e.active
        ? setPreventLink(true)
        : setTimeout(() => setPreventLink(false), 100);

      const deltaX = e.delta[0] * (e.velocity * (isMobile ? 5 : 1));
      const elRect = wrapperRef.current.getBoundingClientRect();

      // itemMargin depend of your slider
      const itemMargin = 70;
      const maxScroll = elRect.width - windowSize.width + itemMargin;

      scrollXRef.current = Math.max(
        0,
        Math.min(scrollXRef.current - deltaX, maxScroll)
      );

      const isScrollingInsideMinAndMax =
        scrollXRef.current > 0 && scrollXRef.current < maxScroll;

      const skewX =
        e.active && isScrollingInsideMinAndMax
          ? Math.round(e.velocity * 1.5)
          : 0;

      gsap.killTweensOf(wrapperRef.current);
      gsap.to(wrapperRef.current, {
        x: -scrollXRef.current,
        duration: 0.7,
        ease: "expo.out",
        // skewX: lastScrollX.current >= scrollXRef.current ? -skewX : skewX,
        overwrite: true,
        force3D: true,
        onUpdate: () => {
          const sliderEvent = new CustomEvent("slider", {
            detail: {
              x: -scrollXRef.current,
            },
          });
          window.dispatchEvent(sliderEvent);
        },
      });

      if (isScrollingInsideMinAndMax) {
        lastScrollX.current = scrollXRef.current;
      }
    },
    { axis: "x" }
  );

  return (
    <div
      className={merge([
        css.root,
        props.className,
        isScrolling && css.root_isScrolling,
      ])}
      {...drag()}
      ref={rootRef}
    >
      <div
        className={merge([css.wrapper, isScrolling && css.wrapper_isScrolling])}
        ref={wrapperRef}
      >
        {React.Children.map(props.children, (child: any) => {
          return React.cloneElement(child, {
            preventLink,
          });
        })}
      </div>
    </div>
  );
}

export default Slider;
