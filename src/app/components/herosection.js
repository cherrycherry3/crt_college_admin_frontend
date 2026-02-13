export default function HeroSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Build Faster with Next.js
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          A modern React framework for building fast, scalable, and
          production-ready web applications.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition">
            Get Started
          </button>

          <button className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}
