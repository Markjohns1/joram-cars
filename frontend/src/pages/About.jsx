/**
 * About Us Page
 */

import { motion } from 'framer-motion';
import { Shield, Clock, Users, Award, ThumbsUp, Car, Target, Eye } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-hero text-white py-16 lg:py-24">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">About Joram Cars</h1>
                        <p className="text-xl text-white/80">
                            Kenya's trusted destination for quality used cars. We've been connecting
                            buyers with reliable vehicles since 2014.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="section">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Joram Cars was founded with a simple mission: to make buying a used car
                                    in Kenya a trustworthy and enjoyable experience. We understand that
                                    purchasing a vehicle is a significant decision, and we're committed
                                    to making that process as smooth as possible.
                                </p>
                                <p>
                                    Over the years, we've built a reputation for honesty, quality, and
                                    exceptional customer service. Every vehicle in our inventory undergoes
                                    thorough inspection to ensure it meets our high standards.
                                </p>
                                <p>
                                    Whether you're looking for your first car, upgrading to something
                                    bigger, or searching for that perfect weekend ride, we're here to
                                    help you find the right vehicle at the right price.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center"
                        >
                            <Car size={100} className="text-gray-300" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Target size={28} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-gray-600">
                                To provide Kenyans with access to quality, affordable used vehicles
                                through transparent practices and exceptional customer service. We
                                strive to build lasting relationships based on trust and integrity.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                <Eye size={28} className="text-secondary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-gray-600">
                                To be Kenya's most trusted used car marketplace, known for quality
                                vehicles, fair pricing, and outstanding customer experience. We aim
                                to transform how Kenyans buy and sell used cars.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'Quality Assured', desc: 'Every vehicle is thoroughly inspected before listing' },
                            { icon: ThumbsUp, title: 'Fair Pricing', desc: 'Competitive prices with complete transparency' },
                            { icon: Clock, title: 'Fast Process', desc: 'Quick and hassle-free buying experience' },
                            { icon: Users, title: 'Customer First', desc: 'Dedicated support from enquiry to ownership' },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <value.icon size={28} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section bg-primary text-white">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '10+', label: 'Years Experience' },
                            { value: '500+', label: 'Happy Customers' },
                            { value: '1000+', label: 'Cars Sold' },
                            { value: '98%', label: 'Satisfaction Rate' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</p>
                                <p className="text-white/80">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
