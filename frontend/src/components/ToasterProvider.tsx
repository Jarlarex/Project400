"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#3D405B",
          color: "#F4F1DE",
          borderRadius: "6px",
          border: "1px solid rgba(244,241,222,0.07)",
        },
        success: {
          iconTheme: {
            primary: "#E07A5F",
            secondary: "#2D3142",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#2D3142",
          },
          style: {
            background: "#3D405B",
            color: "#F4F1DE",
            borderRadius: "6px",
            border: "1px solid rgba(239,68,68,0.2)",
          },
        },
      }}
    />
  );
}
