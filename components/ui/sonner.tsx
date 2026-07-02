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
            bg-[#18181b] border border-[#27272a]
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            !w-[380px] !max-w-[380px]
          `,
          description: 'text-zinc-400 text-sm',
          actionButton: 'bg-amber text-[#09090b] font-semibold rounded-lg',
          cancelButton: 'bg-zinc-800 text-zinc-400 rounded-lg',
          success: `
            group toast
            bg-[#18181b] border border-emerald-500/30
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            !w-[380px] !max-w-[380px]
          `,
          error: `
            group toast
            bg-[#18181b] border border-red-500/30
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            !w-[380px] !max-w-[380px]
          `,
          warning: `
            group toast
            bg-[#18181b] border border-amber/30
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            !w-[380px] !max-w-[380px]
          `,
          info: `
            group toast
            bg-[#18181b] border border-blue-500/30
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3
            !w-[380px] !max-w-[380px]
          `,
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
