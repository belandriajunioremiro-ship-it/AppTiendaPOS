'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: '!bg-transparent !shadow-none !p-0 !border-0 !w-auto !max-w-none',
          closeButton: 'text-zinc-500 hover:text-zinc-300',
        },
      }}
      position="top-right"
      richColors={false}
      closeButton
      {...props}
    />
  );
};

export { Toaster };
