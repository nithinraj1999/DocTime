export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-gray-100 to-white">
      <h1 className="text-5xl font-bold mb-4">Your Health. Your Schedule.</h1>
      <p className="text-lg mb-8 max-w-xl">
        Book appointments with trusted doctors anytime, anywhere.
      </p>
      <a
        href="#"
        className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-500 transition"
      >
        Book Now
      </a>
    </section>
  );
}
