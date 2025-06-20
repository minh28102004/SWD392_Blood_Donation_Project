import { useState } from "react";

export const useLoadingDelay = (delayTime = 500) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setTimeout(() => {
      setIsLoading(false); 
    }, delayTime);
  };

  return [isLoading, startLoading, stopLoading];
};
