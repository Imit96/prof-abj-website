import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import professorImage from '../assets/placeholder-profile.png';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1"
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            <span className="block">Prof. Amos Olalekan</span>
            <span className="text-primary">Abolaji</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-text-light mb-6">
            PROFESSOR OF BIOCHEMISTRY
          </h2>
          <p className="text-text mb-8 max-w-lg">
            Welcome to the official website of Prof. Amos Olalekan Abolaji, a distinguished Professor at the Department of Biochemistry, Faculty of Basic Medical Science, College of Medicine, University of Ibadan, Nigeria.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/publications" className="btn-primary">
              Publications
            </Link>
            <Link to="/about" className="btn-outline">
              Learn More
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="order-1 md:order-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl"></div>
            <img 
              src={professorImage} 
              alt="Professor Amos Olalekan Abolaji" 
              className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-white shadow-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 