'use client';

import { Button } from './button';
import { CheckIcon } from './checkMarkCircle';
import { cn } from '@/lib/utils';
import { Package } from '../dashboard/Profile/Packages';

interface PackageCardProps {
  package: Package;
  showDetails: boolean;
  onToggleDetails: () => void;
  onChoosePackage: (pkg: Package) => void;
  isActivePackage?: boolean;
}

export function PackageCard({
  package: pkg,
  showDetails,
  onToggleDetails,
  onChoosePackage,
  isActivePackage = false,
}: PackageCardProps) {
  console.log(isActivePackage)
  // Pull metadata safely
  const meta = pkg.metadata || {};
  const { color, bgColor, btnText, badges, tagline, features, details } = meta;

  // Background color logic
  const bgColorStyle =
    bgColor?.startsWith('#') || bgColor?.startsWith('[#')
      ? { backgroundColor: bgColor.replace(/[[\]]/g, '') }
      : {};

  const bgColorClass =
    bgColor?.startsWith('#') || bgColor?.startsWith('[#')
      ? ''
      : `bg-${bgColor}`;

  return (
    <div className="w-full relative">
      <div
        className={cn(
          `${bgColorClass} py-2 px-2 shadow-md sm:mb-6 text-center h-[26rem] transition-all`
        )}
        style={bgColorStyle}
      >
        {/* Header */}
        <div className="flex text-center w-full mb-1 justify-center items-center">
          {[...Array(badges || 1)].map((_, i) => (
            <img
              key={i}
              src="icons/features-2.svg"
              alt="Badge"
              className="h-[40px] w-auto"
            />
          ))}
          <h3 className="text-2xl font-bold text-center ml-4 uppercase">
            {pkg.name}
          </h3>
        </div>

        {/* Tagline */}
        <p className="text-[14px] text-left mb-1">{tagline}</p>

        {/* Features */}
        <ul className="space-y-1 text-[14px] h-[6rem]">
          {features?.map((feature: string, index: number) => (
            <li key={index} className="flex items-left text-[14px]">
              <span className="rounded-full mr-1">
                <CheckIcon color={color || '#2F9B8C'} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Details */}
        {!showDetails ? (
          <ul className="space-y-1 text-[14px] mt-1">
            {details?.descriptions?.map((des, index) => (
              <li key={index} className="flex w-full gap-0 text-black">
                <span className="text-teal-600 ml-2">✓</span>
                <span className="text-left w-full ml-3 text-black">{des}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 pt-32 items-baseline">
            <div className="mb-4 text-left">
              <div className="text-[12px] font-semibold">
                {details?.yearlyPrice
                  ? `€${details.yearlyPrice.toFixed(0)} per jaar (of €${details.monthlyPrice} per maand)`
                  : `€${details?.monthlyPrice} per maand`}
              </div>
              <div className="mt-1 text-[12px] font-semibold">
                €{details?.requestPrice} per aanvraag
              </div>
            </div>

            {/* Button — only active package is dimmed */}
            <Button
              onClick={() => !isActivePackage && onChoosePackage(pkg)}
              disabled={isActivePackage}
              className={cn(
                'w-full font-bold text-white transition-all',
                isActivePackage
                  ? 'bg-gray-400 text-gray-100 opacity-70 cursor-not-allowed'
                  : 'bg-primary'
              )}
            >
              {isActivePackage ? 'Actief pakket' : btnText || `Kies ${pkg.name}`}
            </Button>
          </div>
        )}
      </div>

      {/* Toggle Details Button */}
      <div className="lg:-bottom-6 top-5 px-auto md:1/8 items-center relative">
        <Button
          name={pkg.name}
          onClick={onToggleDetails}
          className="w-[60%] mx-auto ml-20 absolute text-white font-bold bg-primary"
        >
          {!showDetails ? 'Meer informatie' : 'Terug naar overzicht'}
        </Button>
      </div>
    </div>
  );
}
