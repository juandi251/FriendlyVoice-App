    import type { NextConfig } from 'next';

    const nextConfig: NextConfig = {
      /* config options here */
      typescript: {
        ignoreBuildErrors: true,
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**',
          },
          { 
            protocol: 'https',
            hostname: 'api.dicebear.com', 
            port: '',
            pathname: '/**',
          },
          { // ¡NUEVO! Añadido para imágenes o avatares que vengan de Firebase Storage
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com', // <--- ¡Asegúrate de añadir esta línea!
            port: '',
            pathname: '/**',
          },
        ],
      },
    };

    export default nextConfig;
    