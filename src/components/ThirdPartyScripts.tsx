'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function ThirdPartyScripts() {
  const [loadScripts, setLoadScripts] = useState(false);

  useEffect(() => {
    // Defer loading heavy 3rd-party scripts until user interaction or 3.5s idle timer
    const triggerLoad = () => {
      setLoadScripts(true);
      cleanup();
    };

    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) =>
      window.addEventListener(event, triggerLoad, { passive: true, once: true })
    );

    const timer = setTimeout(triggerLoad, 3500);

    const cleanup = () => {
      events.forEach((event) => window.removeEventListener(event, triggerLoad));
      clearTimeout(timer);
    };

    return cleanup;
  }, []);

  if (!loadScripts) return null;

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-P9WWQ4H7');`}
      </Script>

      {/* Google Ads gtag */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18199746339"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-18199746339');`}
      </Script>

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3441444514820988"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}
