import { toast } from 'sonner';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Mail,
  Lock,
  Wifi,
  WifiOff,
  Clock,
  Shield,
} from 'lucide-react';

interface ToastOptions {
  message: string;
  description?: string;
}

const iconStyle = 'h-4 w-4 text-[#09090b]';

const icons = {
  error: <AlertCircle className={iconStyle} />,
  success: <CheckCircle2 className={iconStyle} />,
  warning: <AlertTriangle className={iconStyle} />,
  info: <Info className={iconStyle} />,
  email: <Mail className={iconStyle} />,
  password: <Lock className={iconStyle} />,
  network: <WifiOff className={iconStyle} />,
  networkOk: <Wifi className={iconStyle} />,
  timeout: <Clock className={iconStyle} />,
  security: <Shield className={iconStyle} />,
};

export const showToast = {
  error: ({ message, description }: ToastOptions) => {
    toast.custom(
      () => (
        <div className="flex items-start gap-3 bg-dark-tertiary border border-amber rounded-xl p-4 shadow-xl min-w-[340px] max-w-[380px]">
          <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5 text-[#09090b]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber font-bold text-sm">{message}</p>
            {description && <p className="text-zinc-400 text-xs mt-0.5">{description}</p>}
          </div>
        </div>
      ),
      { duration: 4000, position: 'top-right' }
    );
  },

  success: ({ message, description }: ToastOptions) => {
    toast.custom(
      () => (
        <div className="flex items-start gap-3 bg-dark-tertiary border border-amber rounded-xl p-4 shadow-xl min-w-[340px] max-w-[380px]">
          <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#09090b]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber font-bold text-sm">{message}</p>
            {description && <p className="text-zinc-400 text-xs mt-0.5">{description}</p>}
          </div>
        </div>
      ),
      { duration: 4000, position: 'top-right' }
    );
  },

  warning: ({ message, description }: ToastOptions) => {
    toast.custom(
      () => (
        <div className="flex items-start gap-3 bg-dark-tertiary border border-amber rounded-xl p-4 shadow-xl min-w-[340px] max-w-[380px]">
          <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#09090b]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber font-bold text-sm">{message}</p>
            {description && <p className="text-zinc-400 text-xs mt-0.5">{description}</p>}
          </div>
        </div>
      ),
      { duration: 4000, position: 'top-right' }
    );
  },

  info: ({ message, description }: ToastOptions) => {
    toast.custom(
      () => (
        <div className="flex items-start gap-3 bg-dark-tertiary border border-amber rounded-xl p-4 shadow-xl min-w-[340px] max-w-[380px]">
          <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-3.5 w-3.5 text-[#09090b]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber font-bold text-sm">{message}</p>
            {description && <p className="text-zinc-400 text-xs mt-0.5">{description}</p>}
          </div>
        </div>
      ),
      { duration: 4000, position: 'top-right' }
    );
  },

  credentials: () => {
    showToast.error({
      message: 'Credenciales incorrectas',
      description: 'El correo o la contraseña no son válidos.',
    });
  },

  network: () => {
    showToast.error({
      message: 'Error de conexión',
      description: 'No se pudo conectar al servidor.',
    });
  },

  server: () => {
    showToast.error({
      message: 'Error del servidor',
      description: 'Algo salió mal. Intenta de nuevo.',
    });
  },

  rateLimit: () => {
    showToast.warning({
      message: 'Demasiados intentos',
      description: 'Espera un momento antes de intentar de nuevo.',
    });
  },

  sessionExpired: () => {
    showToast.warning({
      message: 'Sesión expirada',
      description: 'Tu sesión ha expirado. Inicia sesión de nuevo.',
    });
  },

  loginSuccess: (userName?: string) => {
    showToast.success({
      message: '¡Bienvenido!',
      description: userName
        ? `Hola ${userName}, has iniciado sesión correctamente.`
        : 'Has iniciado sesión correctamente.',
    });
  },
};
