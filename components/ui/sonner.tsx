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
          toast: `
            group toast
            bg-[#18181b] border border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            flex items-center gap-3
          `,
          title: 'text-amber font-bold text-sm',
          description: 'text-zinc-400 text-xs',
          actionButton: 'bg-amber text-[#09090b] font-semibold rounded-lg text-xs',
          cancelButton: 'bg-zinc-800 text-zinc-400 rounded-lg text-xs',
          success: `
            group toast
            bg-[#18181b] border border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            flex items-center gap-3
          `,
          error: `
            group toast
            bg-[#18181b] border border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            flex items-center gap-3
          `,
          warning: `
            group toast
            bg-[#18181b] border border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            flex items-center gap-3
          `,
          info: `
            group toast
            bg-[#18181b] border border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            flex items-center gap-3
          `,
          closeButton: 'text-zinc-500 hover:text-zinc-300',
        },
      }}
      icons={{
        error: null,
        success: null,
        warning: null,
        info: null,
      }}
      position="top-right"
      richColors={false}
      closeButton
      {...props}
    />
  );
};

export { Toaster };
