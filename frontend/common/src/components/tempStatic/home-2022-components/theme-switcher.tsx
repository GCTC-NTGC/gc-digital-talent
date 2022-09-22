// Vendor dependencies
import React, { MouseEventHandler } from "react";

// Local helper dependencies

// Local component dependencies

// Create the page component
const ThemeSwitcher: React.FunctionComponent = () => {
  const enablePref: MouseEventHandler = () => {
    const hydrogen = document.querySelectorAll("[data-h2]");
    const switcher = document.querySelector("#switcher");
    if (hydrogen && switcher) {
      switcher.classList.remove("light");
      switcher.classList.remove("dark");
      switcher.classList.add("pref");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        hydrogen.forEach((item) => {
          if (item instanceof HTMLElement) {
            item.dataset.h2 = "dark";
          }
        });
      } else {
        hydrogen.forEach((item) => {
          if (item instanceof HTMLElement) {
            item.dataset.h2 = "";
          }
        });
      }
      localStorage.removeItem("theme");
    }
  };
  const enableLight: MouseEventHandler = () => {
    const hydrogen = document.querySelectorAll("[data-h2]");
    const switcher = document.querySelector("#switcher");
    if (hydrogen && switcher) {
      switcher.classList.add("light");
      switcher.classList.remove("dark");
      switcher.classList.remove("pref");
      hydrogen.forEach((item) => {
        if (item instanceof HTMLElement) {
          item.dataset.h2 = "";
        }
      });
      localStorage.theme = "light";
      return true;
    }
  };
  const enableDark: MouseEventHandler = () => {
    const hydrogen = document.querySelectorAll("[data-h2]");
    const switcher = document.querySelector("#switcher");
    if (hydrogen && switcher) {
      switcher.classList.remove("light");
      switcher.classList.add("dark");
      switcher.classList.remove("pref");
      hydrogen.forEach((item) => {
        if (item instanceof HTMLElement) {
          item.dataset.h2 = "dark";
        }
      });
      localStorage.theme = "dark";
      return true;
    }
  };
  return (
    <div
      id="switcher"
      data-h2-fill="
    base:children[#icon_pref *](tm-yellow.light)
    base:class[light]:children[#icon_pref *](black.lighter)
    base:class[dark]:children[#icon_pref *](white.dark)
    base:dark:children[#icon_pref *](tm-yellow.dark)
    base:children[#icon_sun *](black.lighter)
    base:class[light]:children[#icon_sun *](tm-yellow.light)
    base:class[dark]:children[#icon_sun *](white.dark)
    base:children[#icon_moon *](black.lighter)
    base:class[dark]:children[#icon_moon *](tm-yellow.dark)
    base:children[button:focus-visible #icon_pref *](black)
    base:children[button:focus-visible #icon_sun *](black)
    base:children[button:focus-visible #icon_moon *](black)"
      data-h2-transform="
    base:class[pref]:children[#highlight](translate(0, 0))
    base:class[light]:children[#highlight](translate(2rem, 0))
    base:class[dark]:children[#highlight](translate(4rem, 0))"
    >
      <div
        data-h2-border="base(all, 1px, solid, black.darker.2) base:dark(all, 1px, solid, white.2)"
        data-h2-radius="base(50px)"
        data-h2-padding="base(x.25)"
        data-h2-position="base(relative)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(.25rem)"
          data-h2-height="base:children[>div](1.75rem)"
          data-h2-width="base:children[>div](1.75rem)"
          data-h2-background-color="base:children[>div](rgba(230, 230, 230, 1)) base:children[>div]:dark(white.1)"
          data-h2-radius="base:children[>div](circle)"
        >
          <div />
          <div />
          <div />
        </div>
        <div
          data-h2-position="base(absolute)"
          data-h2-offset="base(x.25, auto, auto, x.25)"
          data-h2-display="base(flex)"
          data-h2-gap="base(.25rem)"
        >
          <div
            id="highlight"
            data-h2-height="base(1.75rem)"
            data-h2-width="base(1.75rem)"
            data-h2-transition="base(transform, .2s, ease, 0s)"
            data-h2-background-color="base:dark(white) base(black)"
            data-h2-radius="base(circle)"
          />
        </div>
        <div
          data-h2-position="base(absolute) base:children[>button](relative)"
          data-h2-offset="base(x.25, auto, auto, x.25)"
          data-h2-display="base(flex) base:children[>button](block)"
          data-h2-gap="base(.25rem)"
          data-h2-cursor="base:children[>button](pointer)"
          data-h2-background-color="base:children[>button](transparent) base:children[>button:focus-visible](focus)"
          data-h2-outline="base:children[>button](none)"
          data-h2-height="base:children[>button](1.75rem)"
          data-h2-width="base:children[>button](1.75rem)"
          data-h2-radius="base:children[>button](circle)"
          data-h2-border="base:children[>button](none)"
          data-h2-padding="base:children[>button](0)"
        >
          <button
            type="button"
            title="{{ switcher.preference_toggle.title[locale] }}"
            onClick={enablePref}
          >
            <svg
              id="icon_pref"
              data-h2-height="base(x.8)"
              data-h2-position="base(center)"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.16352 13.9031H9.00049H7.65912H6.26215C5.86037 13.9031 5.53467 14.2288 5.53467 14.6306C5.53467 15.0324 5.86037 15.3581 6.26215 15.3581H7.65912L9.00049 15.3581L9.00079 15.3581H9.16352L10.3975 15.3581C10.3976 15.3581 10.3977 15.3581 10.3978 15.3581L11.9019 15.3581C12.3036 15.3581 12.6293 15.0324 12.6293 14.6306C12.6293 14.2288 12.3036 13.9031 11.9019 13.9031H10.3975H9.16352Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.35449 11.7292L8.35449 11.8922L8.35449 13.2336L8.35449 14.6306C8.35449 15.0324 8.6802 15.3581 9.08197 15.3581C9.48375 15.3581 9.80945 15.0324 9.80945 14.6306L9.80945 13.2336L9.80945 11.8922L9.80945 11.8919L9.80945 11.7292L9.80945 10.4953C9.80945 10.4952 9.80945 10.4951 9.80945 10.495L9.80945 8.99088C9.80945 8.5891 9.48375 8.2634 9.08197 8.2634C8.6802 8.2634 8.35449 8.5891 8.35449 8.99088L8.35449 10.4953L8.35449 11.7292Z"
                fill="#36106E"
              />
              <rect
                x="2.89331"
                y="2.64194"
                width="12.3773"
                height="8.69228"
                rx="1"
                fill="#36106E"
              />
            </svg>
          </button>
          <button
            type="button"
            title="{{ switcher.light_toggle.title[locale] }}"
            onClick={enableLight}
          >
            <svg
              id="icon_sun"
              data-h2-height="base(x.8)"
              data-h2-position="base(center)"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9.00323" r="3.66357" fill="#36106E" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99994 0.414185C9.40172 0.414185 9.72742 0.739888 9.72742 1.14166L9.72742 3.88C9.72742 4.28178 9.40172 4.60748 8.99994 4.60748C8.59817 4.60748 8.27246 4.28178 8.27246 3.88L8.27246 1.14166C8.27246 0.739888 8.59816 0.414185 8.99994 0.414185Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99994 13.3925C9.40172 13.3925 9.72742 13.7182 9.72742 14.12L9.72742 16.8583C9.72742 17.2601 9.40172 17.5858 8.99994 17.5858C8.59817 17.5858 8.27246 17.2601 8.27246 16.8583L8.27246 14.12C8.27246 13.7182 8.59816 13.3925 8.99994 13.3925Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5859 9.00006C17.5859 9.40184 17.2602 9.72754 16.8585 9.72754L14.1201 9.72754C13.7183 9.72754 13.3926 9.40184 13.3926 9.00006C13.3926 8.59829 13.7183 8.27258 14.1201 8.27258L16.8585 8.27258C17.2602 8.27258 17.5859 8.59829 17.5859 9.00006Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.60742 9C4.60742 9.40178 4.28172 9.72748 3.87994 9.72748L1.1416 9.72748C0.739828 9.72748 0.414125 9.40178 0.414125 9C0.414125 8.59823 0.739828 8.27252 1.1416 8.27252L3.87994 8.27252C4.28172 8.27252 4.60742 8.59823 4.60742 9Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0715 15.0712C14.7874 15.3553 14.3268 15.3553 14.0427 15.0712L12.1064 13.1349C11.8223 12.8508 11.8223 12.3902 12.1064 12.1061C12.3905 11.822 12.8511 11.822 13.1352 12.1061L15.0715 14.0424C15.3556 14.3265 15.3556 14.7871 15.0715 15.0712Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.89429 5.89392C5.61019 6.17802 5.14957 6.17802 4.86547 5.89392L2.92918 3.95763C2.64508 3.67353 2.64508 3.21291 2.92918 2.92881C3.21328 2.64472 3.67389 2.64472 3.95799 2.92881L5.89429 4.86511C6.17838 5.14921 6.17838 5.60982 5.89429 5.89392Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.92895 15.071C2.64485 14.7869 2.64485 14.3263 2.92895 14.0422L4.86525 12.1059C5.14935 11.8218 5.60996 11.8218 5.89406 12.1059C6.17816 12.39 6.17816 12.8506 5.89406 13.1347L3.95777 15.071C3.67367 15.3551 3.21305 15.3551 2.92895 15.071Z"
                fill="#36106E"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.1062 5.8941C11.8221 5.61 11.8221 5.14939 12.1062 4.86529L14.0425 2.92899C14.3266 2.64489 14.7872 2.64489 15.0713 2.92899C15.3554 3.21309 15.3554 3.67371 15.0713 3.95781L13.135 5.8941C12.8509 6.1782 12.3903 6.1782 12.1062 5.8941Z"
                fill="#36106E"
              />
            </svg>
          </button>
          <button
            type="button"
            title="{{ switcher.dark_toggle.title[locale] }}"
            onClick={enableDark}
          >
            <svg
              id="icon_moon"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-h2-height="base(x.8)"
              data-h2-position="base(center)"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.2372 15.4923C12.8228 15.4923 15.7295 12.5856 15.7295 9.00001C15.7295 5.4144 12.8228 2.50769 9.2372 2.50769C6.63288 2.50769 4.38672 4.04111 3.35234 6.25433C4.13306 5.33054 5.30026 4.7439 6.60448 4.7439C8.95505 4.7439 10.8606 6.64942 10.8606 8.99999C10.8606 11.3506 8.95505 13.2561 6.60448 13.2561C5.30024 13.2561 4.13301 12.6694 3.35229 11.7456C4.38666 13.9589 6.63285 15.4923 9.2372 15.4923Z"
                fill="#36106E"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default ThemeSwitcher;
