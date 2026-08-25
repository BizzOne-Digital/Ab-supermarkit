import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Users } from 'lucide-react';

const values = [
  { icon: Leaf, title: 'Freshness First', desc: 'We source the freshest produce and quality goods every day.' },
  { icon: ShieldCheck, title: 'Trust & Quality', desc: 'Every product meets our high standards before reaching shelves.' },
  { icon: Users, title: 'Community Focused', desc: 'Proudly serving our neighborhood with care and dedication.' },
];

export default function About() {
  return (
    <div>
      <section className="bg-black text-ivory section-py">
        <div className="container-app text-center">
          <h1 className="font-heading text-4xl sm:text-5xl mb-4">
            About <span className="text-gold">AB&apos;s Supermarket</span>
          </h1>
          <p className="text-ivory/70 max-w-2xl mx-auto text-lg">
            A trusted grocery destination built on quality, community, and everyday value.
          </p>
        </div>
      </section>

      <section className="section-py container-app grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl text-black mb-4">Our Journey</h2>
          <p className="text-charcoal/70 mb-4">
            AB&apos;s Supermarket started with a simple mission: bring fresh, quality groceries to our community at
            fair prices. Over the years, we&apos;ve grown into a trusted local destination, known for our friendly
            service and carefully curated selection.
          </p>
          <p className="text-charcoal/70">
            Today, we continue to build on that promise — offering fresh produce, quality essentials, and a
            seamless shopping experience both in-store and online.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="aspect-video bg-black rounded-lg bg-cover bg-center"
          style={{ backgroundImage: "url('/store.png')" }}
        />
      </section>

      <section className="section-py bg-creme">
        <div className="container-app">
          <h2 className="font-heading text-3xl text-black text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                className="bg-white rounded-lg shadow-card p-6 text-center"
              >
                <div className="h-12 w-12 mx-auto rounded-full bg-black flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-heading text-lg text-black mb-2">{title}</h3>
                <p className="text-sm text-charcoal/70">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
