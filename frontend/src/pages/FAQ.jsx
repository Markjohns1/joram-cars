/**
 * FAQ Page
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Input } from '../components/common';

const FAQ_CATEGORIES = [
    {
        name: 'Buying',
        faqs: [
            {
                question: 'How do I purchase a vehicle from Joram Cars?',
                answer: 'Browse our inventory online, find a vehicle you like, and contact us via WhatsApp or phone to schedule a viewing. Once you\'re satisfied, we\'ll handle the paperwork and transfer process.',
            },
            {
                question: 'Can I negotiate the price?',
                answer: 'Yes, we\'re open to reasonable negotiations. Our prices are competitive and based on market value, vehicle condition, and history. Contact us to discuss pricing.',
            },
            {
                question: 'Do you offer financing options?',
                answer: 'We can connect you with trusted financing partners who offer car loans. Contact us for more information about available financing options.',
            },
            {
                question: 'What documents do I need to buy a car?',
                answer: 'You\'ll need a valid National ID or Passport, KRA PIN, and proof of address. For financed purchases, additional documents may be required by the financing partner.',
            },
        ],
    },
    {
        name: 'Selling',
        faqs: [
            {
                question: 'How do I sell my car through Joram Cars?',
                answer: 'Fill out our "Sell Your Car" form with your vehicle details and photos. Our team will review and contact you within 24 hours with a valuation.',
            },
            {
                question: 'What is the difference between "Sell on Behalf" and "Direct Purchase"?',
                answer: '"Sell on Behalf" means we list your car and find a buyer (you keep ownership until sold). "Direct Purchase" means we buy your car directly at an agreed price.',
            },
            {
                question: 'How long does it take to sell my car?',
                answer: 'It depends on the vehicle and market demand. Popular models typically sell within 2-4 weeks. We\'ll provide realistic timelines during our consultation.',
            },
        ],
    },
    {
        name: 'Vehicles',
        faqs: [
            {
                question: 'Are your vehicles inspected?',
                answer: 'Yes, every vehicle undergoes a thorough inspection before listing. We check mechanical condition, service history, and documentation to ensure quality.',
            },
            {
                question: 'What does "Direct Import" mean?',
                answer: '"Direct Import" vehicles are sourced from Japan, UK, or other countries and shipped directly. They typically have lower mileage and better condition but may take 2-3 weeks to arrive.',
            },
            {
                question: 'Do you offer test drives?',
                answer: 'Yes, we encourage test drives for serious buyers. Contact us to schedule a viewing and test drive at our location.',
            },
            {
                question: 'What warranty do you offer?',
                answer: 'Warranty terms vary by vehicle. Some vehicles come with manufacturer warranty remaining. We also offer optional extended warranty packages.',
            },
        ],
    },
    {
        name: 'General',
        faqs: [
            {
                question: 'Where are you located?',
                answer: 'We\'re located in Nairobi, Kenya. Contact us for specific directions to our showroom.',
            },
            {
                question: 'What are your operating hours?',
                answer: 'We\'re open Monday to Saturday, 8:00 AM to 6:00 PM. Closed on Sundays and public holidays.',
            },
            {
                question: 'How can I contact you?',
                answer: 'You can reach us via WhatsApp, phone call, email, or by filling out our contact form. We typically respond within a few hours during business hours.',
            },
        ],
    },
];

function FAQItem({ faq, isOpen, onClick }) {
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-4 flex items-center justify-between text-left hover:text-primary transition-colors"
            >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-gray-600">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (categoryIndex, faqIndex) => {
        const key = `${categoryIndex}-${faqIndex}`;
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Filter FAQs based on search
    const filteredCategories = FAQ_CATEGORIES.map((category) => ({
        ...category,
        faqs: category.faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((category) => category.faqs.length > 0);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-hero text-white py-16">
                <div className="container text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-5xl font-bold mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto"
                    >
                        Find answers to common questions about buying and selling cars with Joram Cars.
                    </motion.p>
                </div>
            </section>

            <section className="section">
                <div className="container max-w-4xl">
                    {/* Search */}
                    <div className="relative mb-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-12 text-lg"
                        />
                    </div>

                    {/* FAQ Categories */}
                    {filteredCategories.length > 0 ? (
                        <div className="space-y-8">
                            {filteredCategories.map((category, categoryIndex) => (
                                <motion.div
                                    key={category.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    <div className="bg-gray-50 px-6 py-4 border-b">
                                        <h2 className="text-xl font-bold">{category.name}</h2>
                                    </div>
                                    <div className="px-6">
                                        {category.faqs.map((faq, faqIndex) => (
                                            <FAQItem
                                                key={faqIndex}
                                                faq={faq}
                                                isOpen={openItems[`${categoryIndex}-${faqIndex}`]}
                                                onClick={() => toggleItem(categoryIndex, faqIndex)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-gray-600">Try a different search term or browse all categories above.</p>
                        </div>
                    )}

                    {/* Still have questions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center bg-primary/5 rounded-2xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                        <p className="text-gray-600 mb-6">
                            Can't find the answer you're looking for? Get in touch with our team.
                        </p>
                        <a href="/contact" className="btn btn-primary">
                            Contact Us
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
