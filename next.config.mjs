const nextConfig = {
	reactStrictMode: true,

	// Image optimization configuration
	images: {
		domains: [
			"dknzebbrpsecloomozzj.supabase.co", // Your Supabase storage domain
			"yourdomain.com", // Your production domain (when you have one)
			"staging.yourdomain.com", // Your staging domain (when you have one)
		],
		formats: ["image/webp", "image/avif"],
		minimumCacheTTL: 60,
	},

	// Production optimisations
	swcMinify: true,
	compress: true,
	poweredByHeader: false,
	generateEtags: false,
};

export default nextConfig;
