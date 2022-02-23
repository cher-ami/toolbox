import css from "./Marquee.module.less";
import React, { Fragment, useEffect, useState, useRef } from "react";

interface IProps {
  /**
   * Inline style for the container div
   * Type: object
   * Default: {}
   */
  style?: React.CSSProperties;
  /**
   * Class name to style the container div
   * Type: string
   * Default: ""
   */
  className?: string;
  /**
   * Whether to play or pause the marquee
   * Type: boolean
   * Default: true
   */
  play?: boolean;
  /**
   * Whether to pause the marquee when hovered
   * Type: boolean
   * Default: false
   */
  pauseOnHover?: boolean;
  /**
   * Whether to pause the marquee when clicked
   * Type: boolean
   * Default: false
   */
  pauseOnClick?: boolean;
  /**
   * The direction the marquee is sliding
   * Type: "left" or "right"
   * Default: "left"
   */
  direction?: "left" | "right";
  /**
   * Speed calculated as pixels/second
   * Type: number
   * Default: 20
   */
  speed?: number;
  /**
   * Duration to delay the animation after render, in seconds
   * Type: number
   * Default: 0
   */
  delay?: number;
  /**
   * The number of times the marquee should loop, 0 is equivalent to infinite
   * Type: number
   * Default: 0
   */
  loop?: number;
  /**
   * The children rendered inside the marquee
   * Type: ReactNode
   * Default: null
   */
  children?: React.ReactNode;

  /**
   * Clone child element if is smaller than window width
   */
  cloneChild?: boolean;
}

/**
 * @name Marquee
 */

const Marquee: React.FC<IProps> = ({
  style = {},
  className = "",
  play = true,
  pauseOnHover = false,
  pauseOnClick = false,
  direction = "left",
  speed = 20,
  delay = 0,
  loop = 0,
  cloneChild = true,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  /**
   * Check if component is mounted
   */
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Manage sizes
   */
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const [duration, setDuration] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);

    // Find width of container and width of marquee
    if (marqueeRef.current && wrapperRef.current) {
      setWrapperWidth(wrapperRef.current.getBoundingClientRect().width);
      setMarqueeWidth(marqueeRef.current.getBoundingClientRect().width);
    }

    if (marqueeWidth < wrapperWidth) {
      setDuration(wrapperWidth / speed);
    } else {
      setDuration(marqueeWidth / speed);
    }
  };

  useEffect(() => {
    handleResize();
    // Rerender on window resize
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  /**
   * Clone child element of one marquee div
   */
  const [cloneLength, setCloneLength] = useState<number>(1);
  useEffect(() => {
    if (!windowWidth || !marqueeWidth) return;

    if (!cloneChild) {
      setCloneLength(1);
      return;
    }
    // get marquee DOM child of marquee div
    const $marqueeChild = marqueeRef.current.querySelector(":scope > *");

    if ($marqueeChild) {
      const $marqueeChildRect = $marqueeChild.getBoundingClientRect?.();
      const childToCloneLength =
        Math.round(windowWidth / $marqueeChildRect.width) + 1;
      setCloneLength(childToCloneLength);
    }
  }, [children, windowWidth, marqueeWidth, cloneChild]);

  if (!isMounted) return null;

  return (
    <div className={[css.root, className].filter((e) => e).join(" ")}>
      <div
        className={css.wrapper}
        ref={wrapperRef}
        style={{
          ...style,
          ["--pause-on-hover" as string]: pauseOnHover ? "paused" : "running",
          ["--pause-on-click" as string]: pauseOnClick ? "paused" : "running",
        }}
      >
        {new Array(2).fill(null).map((el, i) => (
          <div
            key={i}
            ref={i === 0 ? marqueeRef : null}
            className={[css.marquee, cloneLength > 1 && css.marquee_cloned]
              .filter((e) => e)
              .join(" ")}
            style={{
              ["--play" as string]: play ? "running" : "paused",
              ["--direction" as string]:
                direction === "left" ? "normal" : "reverse",
              ["--duration" as string]: `${duration}s`,
              ["--delay" as string]: `${delay}s`,
              ["--iteration-count" as string]: !!loop ? `${loop}` : "infinite",
            }}
          >
            {cloneLength === 1
              ? children
              : new Array(cloneLength)
                  .fill(null)
                  .map((el, i) => (
                    <Fragment key={i}>
                      {React.Children.map(children, (child: any) =>
                        React.cloneElement(child)
                      )}
                    </Fragment>
                  ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
