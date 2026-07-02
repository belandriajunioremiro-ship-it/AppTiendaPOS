import { toast } from 'sonner';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
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

const iconStyle = 'h-5 w-5 text-[#09090b]';

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
  close: <X className="h-4 w-4" />,
};

const iconContainer = (type: 'error' | 'success' | 'warning' | 'info') => {
  const colors = {
    error: 'bg-red-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber',
    info: 'bg-blue-500',
  };
  return colors[type];
};

export const showToast = {
  error: ({ message, description }: ToastOptions) => {
    toast.error(message, {
      description,
      icon: (
        <div className={`w-8 h-8 rounded-full ${iconContainer('error')} flex items-center justify-center shrink-0`}>
          {icons.error}
        </div>
      ),
      className: 'border-red-500/30',
      style: {
        borderColor: 'rgba(239, 68, 68, 0.3)',
      },
    });
  },

  success: ({ message, description }: ToastOptions) => {
    toast.success(message, {
      description,
      icon: (
        <div className={`w-8 h-8 rounded-full ${iconContainer('success')} flex items-center justify-center shrink-0`}>
          {icons.success}
        </div>
      ),
      className: 'border-emerald-500/30',
      style: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
      },
    });
  },

  warning: ({ message, description }: ToastOptions) => {
    toast.warning(message, {
      description,
      icon: (
        <div className={`w-8 h-8 rounded-full ${iconContainer('warning')} flex items-center justify-center shrink-0`}>
          {icons.warning}
        </div>
      ),
      className: 'border-amber/30',
      style: {
        borderColor: 'rgba(245, 158, 11, 0.3)',
      },
    });
  },

  info: ({ message, description }: ToastOptions) => {
    toast.info(message, {
      description,
      icon: (
        <div className={`w-8 h-8 rounded-full ${iconContainer('info')} flex items-center justify-center shrink-0`}>
          {icons.info}
        </div>
      ),
      className: 'border-blue-500/30',
      style: {
        borderColor: 'rgba(59, 130, 246, 0.3)',
      },
    });
  },

  credentials: () => {
    showToast.error({
      message: 'Credenciales incorrectas',
      description: 'El correo o la contraseña no son válidos. Intenta de nuevo.',
    });
  },

  network: () => {
    showToast.error({
      message: 'Error de conexión',
      description: 'No se pudo conectar al servidor. Verifica tu conexión.',
    });
  },

  server: () => {
    showToast.error({
      message: 'Error del servidor',
      description: 'Algo salió mal. Intenta de nuevo en unos segundos.',
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

export { icons, iconStyle, iconContainer };
