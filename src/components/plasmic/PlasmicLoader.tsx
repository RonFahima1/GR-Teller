'use client';

import { initPlasmicLoader } from '@plasmicapp/loader-nextjs';

export default function PlasmicLoaderComponent() {
  initPlasmicLoader({
    projects: [
      {
        id: "g6nEhkscPr3yPu5TXeD7BX",
        token: "Ta5J7sLUHhkWiRghk13tn4rPn9LK9iZia0RREP7grhtjHuZk6sTcQnWBqosvQJVxY3Ist12ZgEHqhXUaGiPA"
      }
    ],
    preview: true
  });

  return null;
}
