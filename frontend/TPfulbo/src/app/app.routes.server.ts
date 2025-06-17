import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'matchesTentative/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Replace with your actual backend URL
      const backendUrl = process.env['BACKEND_URL'] || 'https://tp-fulbo-backend.onrender.com';
      try {
        const response = await fetch(`${backendUrl}/api/MatchTentative`);
        if (!response.ok) {
          console.error(`Failed to fetch tentative matches: ${response.status} ${response.statusText}`);
          return [];
        }
        const data = await response.json();

        // Assuming data.data is an array of match objects with an 'idMatch' property
        if (data && data.data && Array.isArray(data.data)) {
          return data.data.map((match: any) => ({
            id: match.idMatch.toString()
          }));
        }
      } catch (error) {
        console.error('Error fetching tentative matches for prerendering:', error);
      }
      return [];
    },
  },
  {
    path: 'matches/new/:idMatch',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const backendUrl = process.env['BACKEND_URL'] || 'https://tp-fulbo-backend.onrender.com';
      try {
        const response = await fetch(`${backendUrl}/api/MatchConfirmed`);
        if (!response.ok) {
          console.error(`Failed to fetch confirmed matches: ${response.status} ${response.statusText}`);
          return [];
        }
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          return data.data.map((match: any) => ({
            idMatch: match.idMatch.toString()
          }));
        }
      } catch (error) {
        console.error('Error fetching confirmed matches for prerendering:', error);
      }
      return [];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
