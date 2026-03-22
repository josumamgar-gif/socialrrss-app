'use client';

import SocialBrandMark from '@/components/shared/SocialBrandMark';

export default function AppBanner() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-4 sm:gap-4 sm:py-5">
        <SocialBrandMark className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden />
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">
          <span className="text-gray-900">Social</span>
          <span className="text-primary-600">RRSS</span>
        </p>
      </div>
    </div>
  );
}
