import "./CookiesBanner.less";
import React, { useEffect, useRef } from "react";
import debug from "@wbe/debug";

// class component name
const componentName: string = `CookiesBanner`;
const log = debug(`front:${componentName}`);

// ----------------------------------------------------------------------------- STRUCT

export enum ETrackingType {
  GOOGLE_ANALYTICS,
  GOOGLE_TAG_MANAGER,
}

interface IProps {
  // class element
  className?: string;

  // show cookie banner even if choice as been already made
  show?: boolean;

  // type of tracking
  trackingType?: ETrackingType;

  // ex: "UA-XXXXXXXX-X" for analytics
  // ou "GTM-XXXXXXXXXX" for tag manager
  trackingID: string;

  // texts
  noticeText?: string;
  moreText?: string;
  moreLink?: string;
  labelButtonAccept?: string;
  labelButtonRefuse?: string;

  // dispatch on click button
  dispatchButtonClick?: (pEnableTrackingValue: boolean) => void;
}

CookiesBanner.defaultProps = {
  show: false,
  noticeText: `Nous aimerions utiliser des cookies pour réaliser des statistiques de visites. Vous pouvez gérer ou retirer votre consentement à tout moment.`,
  moreText: `Pour plus d’informations sur l’utilisation des cookies, consultez notre politique des cookies`,
  moreLink: "www.google.fr",
  labelButtonAccept: "oui",
  labelButtonRefuse: "non",
  trackingType: ETrackingType.GOOGLE_ANALYTICS,
};

/**
 * Cookies Banner
 * This component allow to users to enable or disable google analytics tracking.
 * This component is build in order to be customized as much as possible.
 *
 * 1. Change default texts entries
 * 2. Set tracking ID of your Google Analytics
 * 3. Modifie CSS (Less) properties in "CookiesBanner.less" file.
 */
export function CookiesBanner(props: IProps) {
  // target root
  const rootRef = useRef(null);

  // ------------------------------------------------------------------------- INJECT ANALYTICS OR TAG_MANAGER

  /**
   * Inject or remove google tag manager script in dom
   * https://developers.google.com/tag-manager/quickstart
   */
  const googleTagManagerInjection = (
    injectScriptTags: boolean = true,
    trackingID: string = props?.trackingID
  ) => {
    // create New google manager script
    const gTagManagerScript = document.createElement("script");

    // inject code in tracking script tag.
    gTagManagerScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${trackingID}');
    `;

    // add ID
    gTagManagerScript.setAttribute("id", "__gaTagManagerScript");

    const gTagManagerNoScript = document.createElement("noscript");
    const gTagManagerNoScriptIFrame = document.createElement("iframe");
    gTagManagerNoScriptIFrame.src = `https://www.googletagmanager.com/ns.html?id=${trackingID}`;
    gTagManagerNoScriptIFrame.style.height = "0";
    gTagManagerNoScriptIFrame.style.width = "0";
    gTagManagerNoScriptIFrame.style.display = "none";
    gTagManagerNoScriptIFrame.style.visibility = "hidden";

    gTagManagerNoScript.append(gTagManagerNoScriptIFrame);
    gTagManagerNoScript.setAttribute("id", "__gaTagManagerNoScript");

    const $gTagManagerScript = document.getElementById("__gaTagManagerScript");
    const $gTagManagerNoScript = document.getElementById(
      "__gaTagManagerNoScript"
    );

    // if injection script tags is enable
    if (injectScriptTags) {
      if ($gTagManagerScript || $gTagManagerNoScript) {
        debug(
          "$gTagManagerNoScript or $gTagManagerNoScript already exist in DOM, NOT create new scripts. return. "
        );
        return;
      }
      debug("ADD script tags to DOM.");
      // add scripts at the body tag end.
      document.head.append(gTagManagerScript);
      document.body.prepend(gTagManagerNoScript);
      trackingChoice(trackingID, false);

      // remove script tag if exist
    } else {
      const scriptsToRemove: HTMLElement[] = [
        $gTagManagerScript,
        $gTagManagerNoScript,
        // auto generated when script is injected in DOM, we remove it too.
        document.querySelector(
          'script[src$="https://www.google-analytics.com/analytics.js"]'
        ),
      ];

      debug("remove script tags from DOM.");
      scriptsToRemove?.forEach((el) => el?.remove());
      trackingChoice(trackingID, true);
    }
  };

  /**
   * inject or not google analytics scripts tags in DOM
   * @param injectScriptTags: Inject or Remove scriptTags in DOM
   * @param trackingID: ID needed for google analytics
   */
  const googleAnalyticsInjection = (
    injectScriptTags: boolean = true,
    trackingID: string = props?.trackingID
  ): void => {
    if (!trackingID) return;

    // create New google manager script
    const gaScript = document.createElement("script");
    // keep it async
    gaScript.async = true;
    // set it an URL
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingID}`;
    // add ID
    gaScript.setAttribute("id", "__ga");

    // create new tracking script
    const trackingScript = document.createElement("script");

    // inject code in tracking script tag.
    trackingScript.innerHTML = [
      `window.dataLayer = window.dataLayer || [];`,
      `function gtag(){dataLayer.push(arguments);}`,
      `gtag('js', new Date());`,
      `gtag('config', '${trackingID}');`,
    ].join("\n");
    // add ID
    trackingScript.setAttribute("id", "__tracking");

    // get dom script tags
    const $ga = document.getElementById("__ga");
    const $tracking = document.getElementById("__tracking");

    // if injection script tags is enable
    if (injectScriptTags) {
      if ($ga || $tracking) {
        debug(
          "$ga or $tracking already exist in DOM, NOT create new scripts. return. "
        );
        return;
      }
      debug("ADD script tags to DOM.");
      // add scripts at the body tag end.
      document.body.append(gaScript);
      document.body.append(trackingScript);
      trackingChoice(trackingID, false);

      // remove script tag if exist
    } else {
      const scriptsToRemove: HTMLElement[] = [
        $ga,
        $tracking,
        // auto generated when script is injected in DOM, we remove it too.
        document.querySelector(
          'script[src$="https://www.google-analytics.com/analytics.js"]'
        ),
      ];

      debug("remove script tags from DOM.");
      scriptsToRemove?.forEach((el) => el?.remove());
      trackingChoice(trackingID, true);
    }
  };

  /**
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/user-opt-out
   * @param trackingID
   * @param disableTracking
   */
  const trackingChoice = (trackingID: string, disableTracking: boolean) => {
    if (props?.trackingType === ETrackingType.GOOGLE_ANALYTICS) {
      window[`ga-disable-${trackingID}`] = disableTracking;
    }
  };

  /**
   * Final script injection depend of props type choice
   * @param injectScriptTags
   */
  const scriptsInjection = (injectScriptTags: boolean = true) => {
    if (props?.trackingType === ETrackingType.GOOGLE_ANALYTICS) {
      googleAnalyticsInjection(injectScriptTags);
    }
    if (props?.trackingType === ETrackingType.GOOGLE_TAG_MANAGER) {
      googleTagManagerInjection(injectScriptTags);
    }
  };

  // --------------------------------------------------------------------------- LOCAL STORAGE

  // This is the key value who store the choice
  const localStorageKey = "enable-tracking";

  /**
   * Check if a choice as been already made
   */
  const localStorageChoiceExist = (): boolean =>
    localStorage?.getItem(localStorageKey) !== null;

  /**
   * Get value in local storage
   */
  const getLocalStorageValue = (): string =>
    localStorage?.getItem(localStorageKey);

  /**
   * Set value in local storage
   * @param pEnableTracking
   */
  const setLocalStorageValue = (pEnableTracking: boolean): void =>
    localStorage.setItem(localStorageKey, `${pEnableTracking}`);

  // ------------------------------------------------------------------------- CLICK

  /**
   * buttons click handler
   * @param {boolean} pEnableTracking, no tracking by default
   */
  const buttonsClickHandler = (pEnableTracking: boolean = false) => {
    log("buttonsClickHandler > pEnableTracking", pEnableTracking);
    // set variable in window object
    scriptsInjection(pEnableTracking);
    // store choice in localStorage
    setLocalStorageValue(pEnableTracking);
    // hide component
    componentAnim(false);

    props.dispatchButtonClick?.(pEnableTracking);
  };

  // ------------------------------------------------------------------------- MANAGE TRANSITION

  /**
   * Add transition class to root component
   */
  const componentAnim = (
    show: boolean = true,
    el = rootRef?.current as HTMLElement,
    modifier = `${componentName}-show`
  ): void => {
    show ? el?.classList?.add(modifier) : el?.classList?.remove(modifier);
  };

  /**
   * On update
   * re-show this component if props show change
   */
  // Create a ref about initial mount
  const initialMount = useRef(true);
  useEffect(() => {
    // if it's first mount
    if (initialMount.current) {
      initialMount.current = false;
    } else {
      // toggle show class
      componentAnim(true);
    }
  }, [props.show]);

  /**
   * Init
   * Check if a value exist in local storage
   * Start tracking choice on mount
   */
  useEffect(() => {
    // if choice exist in local storage
    if (localStorageChoiceExist()) {
      log("init > localStorageChoiceExist() ", localStorageChoiceExist());
      log("init > getLocalStorageValue() ", getLocalStorageValue());

      // localstorage value is a string, we need to check it
      const localStorageValueIsTrue = getLocalStorageValue() === "true";
      log("init > localStorageValueIsTrue", localStorageValueIsTrue);
      // inject or remove google analytics from DOM
      scriptsInjection(localStorageValueIsTrue);
    } else {
      log(
        "init > localStorageChoiceExist() doesnt exist, anim show component",
        localStorageChoiceExist()
      );
      // add show class
      componentAnim(true);
    }
  }, []);

  // ------------------------------------------------------------------------- RENDERING

  return (
    <div
      className={[componentName, props.className].filter((v) => v).join(" ")}
      ref={rootRef}
    >
      <div className={`${componentName}_wrapper`}>
        {/* Texts content */}
        <p className={`${componentName}_texts`}>
          {props?.noticeText}
          <a href={props.moreLink} target={"_blank"}>
            {props.moreText}
          </a>
        </p>

        {/* Buttons content */}
        <div className={`${componentName}_buttons`}>
          {props?.labelButtonAccept && (
            <button
              aria-label="accept"
              className={`${componentName}_button ${componentName}_button-accept`}
              children={props.labelButtonAccept}
              onClick={() => buttonsClickHandler(true)}
            />
          )}
          {props?.labelButtonRefuse && (
            <button
              aria-label="refuse"
              className={`${componentName}_button ${componentName}_button-refuse`}
              children={props?.labelButtonRefuse}
              onClick={() => buttonsClickHandler(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
