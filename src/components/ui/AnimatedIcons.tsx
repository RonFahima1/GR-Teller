import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Users, FileText, DollarSign, CheckCircle, 
  CreditCard, Wallet, Send, ArrowRight, ArrowLeft,
  Clock, Calendar, Globe, Banknote, Landmark,
  Smartphone, Laptop, Plane, Car, Home,
  ShieldCheck, Lock, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  strokeWidth?: number;
  animate?: boolean;
  className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  type,
  size = 'md',
  color,
  strokeWidth = 2,
  animate = true,
  className
}) => {
  // Size mapping
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };
  
  const iconSize = sizeMap[size];
  
  // Animation variants
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    hover: animate ? { 
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    } : { scale: 1 },
    tap: animate ? { scale: 0.9 } : { scale: 1 }
  };
  
  // Icon specific animations
  type AnimationVariant = {
    animate: {
      [key: string]: any;
      transition: {
        repeat: number;
        repeatType: "reverse" | "loop" | "mirror";
        duration: number;
      };
    };
  };

  const specialAnimations: Record<string, AnimationVariant> = {
    send: {
      animate: {
        x: [0, 5, 0],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.5
        }
      }
    },
    dollar: {
      animate: {
        y: [0, -3, 0],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.5
        }
      }
    },
    check: {
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.5
        }
      }
    },
    user: {
      animate: {
        rotate: [-5, 5, -5],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2
        }
      }
    },
    users: {
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2
        }
      }
    },
    file: {
      animate: {
        y: [0, -2, 0],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2
        }
      }
    },
    shield: {
      animate: {
        scale: [1, 1.1, 1],
        filter: [
          'drop-shadow(0 0 0 rgba(0, 0, 0, 0))',
          'drop-shadow(0 0 3px rgba(34, 197, 94, 0.5))',
          'drop-shadow(0 0 0 rgba(0, 0, 0, 0))'
        ],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2
        }
      }
    },
    alert: {
      animate: {
        scale: [1, 1.1, 1],
        rotate: [-5, 5, -5],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 0.5
        }
      }
    }
  };
  
  // Get the appropriate icon and animation
  const getIcon = () => {
    let IconComponent;
    let specialAnimation: AnimationVariant | undefined;
    
    switch (type.toLowerCase()) {
      case 'sender':
      case 'user':
        IconComponent = User;
        specialAnimation = specialAnimations.user;
        break;
      case 'receiver':
      case 'users':
        IconComponent = Users;
        specialAnimation = specialAnimations.users;
        break;
      case 'details':
      case 'file':
      case 'filetext':
        IconComponent = FileText;
        specialAnimation = specialAnimations.file;
        break;
      case 'amount':
      case 'dollar':
      case 'dollarSign':
        IconComponent = DollarSign;
        specialAnimation = specialAnimations.dollar;
        break;
      case 'confirm':
      case 'check':
      case 'checkcircle':
        IconComponent = CheckCircle;
        specialAnimation = specialAnimations.check;
        break;
      case 'card':
      case 'creditcard':
        IconComponent = CreditCard;
        break;
      case 'wallet':
        IconComponent = Wallet;
        break;
      case 'send':
        IconComponent = Send;
        specialAnimation = specialAnimations.send;
        break;
      case 'arrowright':
      case 'right':
        IconComponent = ArrowRight;
        break;
      case 'arrowleft':
      case 'left':
        IconComponent = ArrowLeft;
        break;
      case 'clock':
      case 'time':
        IconComponent = Clock;
        break;
      case 'calendar':
      case 'date':
        IconComponent = Calendar;
        break;
      case 'globe':
      case 'world':
        IconComponent = Globe;
        break;
      case 'banknote':
      case 'cash':
      case 'money':
        IconComponent = Banknote;
        break;
      case 'landmark':
      case 'bank':
        IconComponent = Landmark;
        break;
      case 'smartphone':
      case 'phone':
        IconComponent = Smartphone;
        break;
      case 'laptop':
      case 'computer':
        IconComponent = Laptop;
        break;
      case 'plane':
      case 'flight':
        IconComponent = Plane;
        break;
      case 'car':
      case 'vehicle':
        IconComponent = Car;
        break;
      case 'home':
      case 'house':
        IconComponent = Home;
        break;
      case 'shield':
      case 'shieldcheck':
      case 'security':
        IconComponent = ShieldCheck;
        specialAnimation = specialAnimations.shield;
        break;
      case 'lock':
      case 'secure':
        IconComponent = Lock;
        break;
      case 'alert':
      case 'alertcircle':
      case 'warning':
        IconComponent = AlertCircle;
        specialAnimation = specialAnimations.alert;
        break;
      default:
        IconComponent = User;
    }
    
    return { IconComponent, specialAnimation };
  };
  
  const { IconComponent, specialAnimation } = getIcon();
  
  return (
    <motion.div
      className={cn('inline-flex items-center justify-center', className)}
      initial="initial"
      animate={animate ? ["animate", ...(specialAnimation?.animate ? ["special"] : [])] : "animate"}
      whileHover="hover"
      whileTap="tap"
      variants={{
        ...iconVariants,
        ...(specialAnimation?.animate ? { special: specialAnimation.animate } : {})
      }}
    >
      <IconComponent 
        size={iconSize} 
        color={color} 
        strokeWidth={strokeWidth} 
      />
    </motion.div>
  );
};
