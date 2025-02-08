import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white/90">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white/70 hover:text-white" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-0 right-0 top-auto z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:right-4 sm:max-w-[420px] sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}