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

const IconCircle = ({ icon }: { icon: React.ReactNode }) => (
  <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center shrink-0">
    {icon}
  </div>
);

export const showToast = {
  error: ({ message, description }: ToastOptions) => {
    toast.error(message, {
      description,
      icon: <IconCircle icon={icons.error} />,
      style: {
        borderColor: 'rgba(245, 158, 11, 0.4)',
      },
    });
  },

  success: ({ message, description }: ToastOptions) => {
    toast.success(message, {
      description,
      icon: <IconCircle icon={icons.success} />,
      style: {
        borderColor: 'rgba(245, 158, 11, 0.4)',
      },
    });
  },

  warning: ({ message, description }: ToastOptions) => {
    toast.warning(message, {
      description,
      icon: <IconCircle icon={icons.warning} />,
      style: {
        borderColor: 'rgba(245, 158, 11, 0.4)',
      },
    });
  },

  info: ({ message, description }: ToastOptions) => {
    toast.info(message, {
      description,
      icon: <IconCircle icon={icons.info} />,
      style: {
        borderColor: 'rgba(245, 158, 11, 0.4)',
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

export { icons, iconStyle, IconCircle };
