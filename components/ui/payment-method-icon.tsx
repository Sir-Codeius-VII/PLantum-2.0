import React from 'react';
import Image from 'next/image';

interface PaymentMethodIconProps {
  brand: string;
  className?: string;
}

export function PaymentMethodIcon({ brand, className = '' }: PaymentMethodIconProps) {
  const getIconPath = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '/icons/payment/visa.svg';
      case 'mastercard':
        return '/icons/payment/mastercard.svg';
      case 'amex':
        return '/icons/payment/amex.svg';
      case 'discover':
        return '/icons/payment/discover.svg';
      default:
        return '/icons/payment/generic.svg';
    }
  };

  return (
    <div className={`relative w-12 h-8 ${className}`}>
      <Image
        src={getIconPath(brand)}
        alt={`${brand} card icon`}
        fill
        className="object-contain"
      />
    </div>
  );
} 