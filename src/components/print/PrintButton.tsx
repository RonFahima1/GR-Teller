"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrintButtonProps {
  className?: string;
  printSelector?: string;
  title?: string;
}

export function PrintButton({
  className,
  printSelector = "main",
  title = "Print",
}: PrintButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = document.querySelector(printSelector);
    if (!content) return;

    const printContent = content.cloneNode(true) as HTMLElement;
    
    // Remove elements that shouldn't be printed
    const elementsToRemove = printContent.querySelectorAll(
      "button, .no-print, [data-tour], [data-command-palette]"
    );
    elementsToRemove.forEach((el) => el.remove());

    // Add print styles
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body {
          padding: 20px;
        }
        .no-print {
          display: none !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
      }
    `;

    printWindow.document.head.appendChild(style);
    printWindow.document.body.appendChild(printContent);

    // Add header and footer
    const header = document.createElement("header");
    header.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin: 0;">Global Remit Teller</h1>
        <p style="color: #666; margin: 5px 0;">${new Date().toLocaleString()}</p>
      </div>
    `;

    const footer = document.createElement("footer");
    footer.innerHTML = `
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #666; margin: 0;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></p>
      </div>
    `;

    printWindow.document.body.insertBefore(header, printContent);
    printWindow.document.body.appendChild(footer);

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handlePrint}
      className={cn("no-print", className)}
      title={title}
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
} 