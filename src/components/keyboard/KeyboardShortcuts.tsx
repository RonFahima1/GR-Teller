"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Keyboard, X } from "lucide-react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const shortcuts = {
  global: [
    { key: "?", description: "Show keyboard shortcuts", action: "showShortcuts" },
    { key: "⌘ + /", description: "Toggle sidebar", action: "toggleSidebar" },
    { key: "⌘ + K", description: "Open command palette", action: "openCommandPalette" },
  ],
  navigation: [
    { key: "⌘ + 1", description: "Go to Dashboard", action: "navigate", path: "/dashboard" },
    { key: "⌘ + 2", description: "Go to Send Money", action: "navigate", path: "/send-money" },
    { key: "⌘ + 3", description: "Go to Clients", action: "navigate", path: "/clients" },
    { key: "⌘ + 4", description: "Go to Transactions", action: "navigate", path: "/transactions" },
  ],
  actions: [
    { key: "⌘ + N", description: "New Client", action: "navigate", path: "/clients/new" },
    { key: "⌘ + S", description: "Search", action: "focusSearch" },
    { key: "⌘ + P", description: "Print", action: "print" },
  ],
};

export function KeyboardShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog
      if (e.key === "?") {
        setShowShortcuts(true);
      }

      // Global shortcuts
      if (e.metaKey || e.ctrlKey) {
        let navPath: string | null = null;
        switch (e.key) {
          case "1":
            navPath = "/dashboard";
            break;
          case "2":
            navPath = "/send-money";
            break;
          case "3":
            navPath = "/clients";
            break;
          case "4":
            navPath = "/transactions";
            break;
          case "n":
            navPath = "/clients/new";
            break;
          case "s":
            const searchInput = document.querySelector('[data-tour="search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case "p":
            window.print();
            break;
          case "/":
            const sidebar = document.querySelector('[data-tour="sidebar"]');
            if (sidebar) {
              sidebar.classList.toggle("hidden");
            }
            break;
          case "k":
            const commandPalette = document.querySelector('[data-tour="command-palette"]');
            if (commandPalette) {
              commandPalette.classList.toggle("hidden");
            }
            break;
        }
        if (navPath) {
          setNavLoading(true);
          setTimeout(() => {
            window.location.href = navPath!;
          }, 50);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {navLoading && <LoadingOverlay />}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <Command>
            <CommandList>
              <CommandGroup heading="Global">
                {shortcuts.global.map((shortcut) => (
                  <CommandItem key={shortcut.key} className="flex justify-between">
                    <span>{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                      {shortcut.key}
                    </kbd>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Navigation">
                {shortcuts.navigation.map((shortcut) => (
                  <CommandItem key={shortcut.key} className="flex justify-between">
                    <span>{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                      {shortcut.key}
                    </kbd>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Actions">
                {shortcuts.actions.map((shortcut) => (
                  <CommandItem key={shortcut.key} className="flex justify-between">
                    <span>{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                      {shortcut.key}
                    </kbd>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
} 