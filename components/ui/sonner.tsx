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
            bg-[#18181b] border-2 border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3.5
            !w-[380px] !max-w-[380px]
            !pl-14
          `,
          description: 'text-zinc-400 text-sm mt-0.5',
          actionButton: 'bg-amber text-[#09090b] font-semibold rounded-lg',
          cancelButton: 'bg-zinc-800 text-zinc-400 rounded-lg',
          success: `
            group toast
            bg-[#18181b] border-2 border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3.5
            !w-[380px] !max-w-[380px]
            !pl-14
          `,
          error: `
            group toast
            bg-[#18181b] border-2 border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3.5
            !w-[380px] !max-w-[380px]
            !pl-14
          `,
          warning: `
            group toast
            bg-[#18181b] border-2 border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3.5
            !w-[380px] !max-w-[380px]
            !pl-14
          `,
          info: `
            group toast
            bg-[#18181b] border-2 border-amber
            text-zinc-100 shadow-xl
            rounded-xl px-4 py-3.5
            !w-[380px] !max-w-[380px]
            !pl-14
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
