"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TourProvider, useTour } from "@reactour/tour";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

interface Step {
  selector: string;
  content: string;
}

interface Steps {
  [key: string]: Step[];
}

const steps: Steps = {
  dashboard: [
    {
      selector: '[data-tour="quick-stats"]',
      content: "Here you can see your daily transaction statistics and system status.",
    },
    {
      selector: '[data-tour="actions"]',
      content: "Quick access to common actions like sending money or managing clients.",
    },
    {
      selector: '[data-tour="recent-transactions"]',
      content: "View and manage your recent transactions here.",
    },
  ],
  clients: [
    {
      selector: '[data-tour="client-search"]',
      content: "Search for clients by name, phone, or ID.",
    },
    {
      selector: '[data-tour="client-list"]',
      content: "View and manage your client list. Click on a client to view details.",
    },
    {
      selector: '[data-tour="new-client"]',
      content: "Add new clients to your system.",
    },
  ],
  sendMoney: [
    {
      selector: '[data-tour="recipient-search"]',
      content: "Search for existing recipients or add new ones.",
    },
    {
      selector: '[data-tour="amount-input"]',
      content: "Enter the amount and select currencies for the transfer.",
    },
    {
      selector: '[data-tour="send-button"]',
      content: "Review and confirm the transaction.",
    },
  ],
};

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  startOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  isOnboardingComplete: false,
  completeOnboarding: () => {},
  startOnboarding: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const completed = localStorage.getItem("onboardingComplete") === "true";
    setIsOnboardingComplete(completed);
  }, []);

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem("onboardingComplete", "true");
  };

  const startOnboarding = () => {
    setIsOnboardingComplete(false);
    localStorage.removeItem("onboardingComplete");
  };

  const currentSteps = steps[pathname.split("/")[1] as keyof typeof steps] || [];

  return (
    <OnboardingContext.Provider
      value={{ isOnboardingComplete, completeOnboarding, startOnboarding }}
    >
      <TourProvider
        steps={currentSteps}
        styles={{
          popover: (base) => ({
            ...base,
            borderRadius: "12px",
            padding: "1.5rem",
          }),
        }}
        components={{
          Navigation: function Navigation(props) {
            const { current, setCurrent, steps } = props;
            return (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrent(current - 1)}
                  disabled={current === 0}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === current ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (current === steps.length - 1) {
                      completeOnboarding();
                    } else {
                      setCurrent(current + 1);
                    }
                  }}
                >
                  {current === steps.length - 1 ? "Finish" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          },
          Close: function Close(props) {
            const { onClick } = props;
            return (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClick}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            );
          },
        }}
      >
        {children}
      </TourProvider>
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext); 