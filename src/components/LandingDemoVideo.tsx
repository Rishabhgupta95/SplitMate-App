import { useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type LandingDemoVideoProps = {
  videoUrl: string;
  buttonLabel?: string;
  title?: string;
};

const LandingDemoVideo = ({
  videoUrl,
  buttonLabel = "View demo",
  title = "Splitmate demo",
}: LandingDemoVideoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const openDemo = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const closeDemo = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const minimizeDemo = () => {
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const toggleMaximizeDemo = () => {
    setIsMaximized((prev) => !prev);
    setIsMinimized(false);
  };

  return (
    <>
      <Button size="lg" variant="outline" onClick={openDemo}>
        {buttonLabel}
      </Button>

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            className={`rounded-2xl border border-border bg-card/95 shadow-elevated backdrop-blur transition-smooth ${isMaximized ? "w-[min(96vw,1280px)]" : "w-[min(92vw,960px)]"}`}
          >
            <div className="flex items-center justify-between border-b border-border bg-gradient-surface px-4 py-3">
              <div className="text-sm font-semibold">{title}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={minimizeDemo}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label="Minimize demo video"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleMaximizeDemo}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label={isMaximized ? "Restore demo video size" : "Maximize demo video"}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={closeDemo}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label="Close demo video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/20">
                <iframe
                  className="h-full w-full"
                  src={videoUrl}
                  title={`${title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && isMinimized && (
        <div className="fixed bottom-4 right-4 z-50 w-[min(90vw,320px)] rounded-2xl border border-border bg-card/95 shadow-elevated backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-sm font-semibold">{title}</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground/40"
                aria-label="Demo video minimized"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={toggleMaximizeDemo}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                aria-label="Restore demo video"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeDemo}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                aria-label="Close demo video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingDemoVideo;
