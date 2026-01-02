// 📁 src/utils/toast.ts
import toast from 'react-hot-toast';

// Toast functions for different types
export const showToast = {
  // Success toast
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
    });
  },

  // Error toast
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
    });
  },

  // Loading toast (returns toastId for dismiss)
  loading: (message: string = 'Loading...') => {
    return toast.loading(message, {
      position: 'top-center',
    });
  },

  // Promise toast
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'top-center',
      }
    );
  },

  // Dismiss specific toast
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};