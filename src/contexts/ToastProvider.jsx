import { createContext, useContext, useState, useCallback } from "react";
import CustomToast from "../components/toast/MyToast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "brand",
    position: "center",
  });

  const showToast = useCallback(
    ({
      title,
      description,
      type = "brand",
      position = "center",
      duration = 5000,
    }) => {
      setToast({ isVisible: true, title, description, type, position });

      // Auto-dismiss logic
      setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, duration);
    },
    [],
  );

  const hideToast = () => setToast((prev) => ({ ...prev, isVisible: false }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast {...toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
