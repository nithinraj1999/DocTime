const features = [
  { title: '24/7 Access', desc: 'Book anytime that fits your schedule.' },
  { title: 'Verified Doctors', desc: 'Only certified professionals.' },
  { title: 'Easy Rescheduling', desc: 'Cancel or reschedule in one click.' },
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white text-center">
      <h2 className="text-3xl font-bold mb-10">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, i) => (
          <div key={i} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
