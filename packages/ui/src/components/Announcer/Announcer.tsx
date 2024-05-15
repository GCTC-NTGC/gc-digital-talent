import * as React from "react";

type AnnouncerContextValue = {
  announce: (announcement: React.ReactNode) => void;
};

const AnnouncerContext = React.createContext<AnnouncerContextValue>({
  announce: () => {
    // PASS: Default announcement
  },
});

export const useAnnouncer = () => {
  const context = React.useContext(AnnouncerContext);

  return context;
};

type AnnouncerProps = {
  children: React.ReactNode;
  /**
   * How live the announcement is (`aria-live`)
   *
   * SEE: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
   *
   */
  live?: "off" | "polite" | "assertive" | undefined;
  /**
   * Set to announce the entire message or just changed parts
   *
   * True - Announce all (default)
   * False - Announce only changed part
   *
   * SEE: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-atomic
   */
  atomic?: boolean;
  /**
   * Set a delay to when the announcement is made (milliseconds)
   */
  timeout?: number;
};

const Announcer = ({
  children,
  live = "polite",
  atomic = true,
  timeout = 150,
}: AnnouncerProps) => {
  const [announcement, setAnnouncement] = React.useState<React.ReactNode>("");

  const announce = React.useCallback(
    (newAnnouncement: React.ReactNode) => {
      setAnnouncement("");
      setTimeout(() => {
        setAnnouncement(newAnnouncement);
      }, timeout);
    },
    [timeout],
  );

  const value = React.useMemo(() => ({ announce }), [announce]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div
        aria-atomic={atomic}
        aria-live={live}
        aria-relevant="all"
        data-h2-visually-hidden="base(invisible)"
      >
        {announcement}
      </div>
    </AnnouncerContext.Provider>
  );
};

export default Announcer;
