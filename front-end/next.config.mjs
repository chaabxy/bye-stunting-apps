/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Tambahkan konfigurasi untuk static assets dan model machine learning
  webpack: (config) => {
    // Konfigurasi untuk file binary besar seperti model TensorFlow.js
    config.module.rules.push({
      test: /\.bin$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/files',
            outputPath: 'static/files',
            name: '[name].[ext]',
          },
        },
      ],
    });
    return config;
  },
  // Pastikan file model dapat diakses dengan benar
  async headers() {
    return [
      {
        source: '/model-machine-learning/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
}

export default nextConfig
