"use client";

import * as React from "react";
import { Check, Info, Loader, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createContext, useContext, useState, useCallback } from "react";

type ToastState = "initial" | "loading" | "success" | "error";

interface ToastProps {
  state: ToastState;
  message: string;
  onClose?: () => void;
}

interface ToastContextType {
  showToast: (state: ToastState, message: string) => void;
  hideToast: () => void;
  toastState: {
    state: ToastState;
    message: string;
    isVisible: boolean;
  };
}

const toastStates = {
  initial: {
    icon: <Info className="w-[18px] h-[18px] text-white" />,
    bgColor: "bg-[#131316]",
  },
  loading: {
    icon: <Loader className="w-[15px] h-[15px] animate-spin text-white" />,
    bgColor: "bg-[#131316]",
  },
  success: {
    icon: <Check className="w-[18px] h-[18px] text-white" />,
    bgColor: "bg-green-600",
  },
  error: {
    icon: <Info className="w-[18px] h-[18px] text-white" />,
    bgColor: "bg-red-600",
  },
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<{
    state: ToastState;
    message: string;
    isVisible: boolean;
  }>({
    state: "initial",
    message: "",
    isVisible: false,
  });

  const showToast = useCallback((state: ToastState, message: string) => {
    setToastState({
      state,
      message,
      isVisible: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toastState }}>
      {children}
      <Toast 
        state={toastState.state} 
        message={toastState.message} 
        onClose={hideToast}
        isVisible={toastState.isVisible}
      />
    </ToastContext.Provider>
  );
}

export const useToast = (): {
  showToast: (state: ToastState, message: string) => void;
  hideToast: () => void;
  toastState: {
    state: ToastState;
    message: string;
    isVisible: boolean;
  };
} => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export function Toast({ 
  state, 
  message, 
  onClose,
  isVisible = true,
}: ToastProps & { isVisible?: boolean }) {
  const currentState = toastStates[state];

  React.useEffect(() => {
    if (state === "success" || state === "error") {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, onClose]);

  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {state !== "initial" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${currentState.bgColor} rounded-md shadow-lg p-4`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {currentState.icon}
              </div>
              <div className="text-sm font-medium text-white">
                {message}
              </div>
              <button
                onClick={onClose}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
