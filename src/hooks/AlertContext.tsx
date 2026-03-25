import React, { createContext, useState } from 'react';
import {IAlert} from "../components/utils/IAlert.tsx";
import {debounce} from "../utils/debounceThrottle";
import type {IAlertProps} from "../type";

interface AlertContextType {
  showAlert: (alert: IAlertProps, time?: number) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<IAlertProps | null>(null);

  const alertShowOpt = (alert: IAlertProps, time: number) => {
    setAlert(alert);
    setTimeout(hideAlert, time);// 隔time时间之后隐藏
  }
  const alertShowOptDebounce = debounce(alertShowOpt, 50);// 防抖一下

  const showAlert = (alert: IAlertProps, time = 3000) => {
    alertShowOptDebounce(alert, time);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && (
        <div style={{ position: 'fixed', left: '50%', top: 20, zIndex: 2025 }}>
          <IAlert {...alert} />
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlertMessage = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
