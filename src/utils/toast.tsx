import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface toastType {
  message: string;
  duration?: number;
}
const useToast = () => {
  const successMessage = ({ message, duration }: toastType) => {
    toast.success(message, {
      autoClose: duration || 5000,
      position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };
  const warningMessage = ({ message, duration }: toastType) => {
    toast.warning(message, {
      autoClose: duration || 5000,
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };
  const errorMessage = ({ message, duration }: toastType) => {
    toast.error(message, {
      autoClose: duration || 5000,
      position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  const functionThatReturnPromise = (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration));

  const successPromiseMessage = ({ message, duration }: toastType) => {
    const durationMs = duration || 1000;
    toast.promise(functionThatReturnPromise(durationMs), {
      pending: "Promise is pending",
      success: message || "Promise resolved",
    });
  };
  const errorPromiseMessage = ({ message, duration }: toastType) => {
    const durationMs = duration || 1000;
    toast.promise(functionThatReturnPromise(durationMs), {
      pending: "Promise is pending",
      error: message || "Promise resolved",
    });
  };

  const showToast = {
    successPromiseMessage,
    errorPromiseMessage,
    successMessage,
    warningMessage,
    errorMessage,
  };

  return showToast;
};

export { useToast };
