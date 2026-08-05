'use client';

export default function MaterialIconsLoader() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
      media="print"
      onLoad={(e) => {
        (e.currentTarget as HTMLLinkElement).media = 'all';
      }}
    />
  );
}
