import { useDispatch } from "react-redux";
import { addToast, removeToast } from "../slices/uiSlice";

export const useToast = () => {
  const dispatch = useDispatch();

  const toast = {
    success: (message, duration = 4000) => {
      dispatch(addToast({ message, type: "success", duration }));
    },
    error: (message, duration = 5000) => {
      dispatch(addToast({ message, type: "error", duration }));
    },
    info: (message, duration = 4000) => {
      dispatch(addToast({ message, type: "info", duration }));
    },
    dismiss: (id) => {
      dispatch(removeToast(id));
    },
  };

  return toast;
};

export default useToast;
