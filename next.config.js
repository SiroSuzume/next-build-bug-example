/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The bug occurs with default settings
  // Uncommenting the line below fixes the issue
  // serverMinification: false,
}

module.exports = nextConfig