import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import PublicationCard from '../components/PublicationCard';

const HomePage = () => {
  // Sample featured publications
  const featuredPublications = [
    {
      title: "Mechanisms of action of botanical insecticides: Emphasis on oxidative stress-induced neuronal toxicity",
      authors: "Abolaji AO, Teixeira da Silva JA, Adedara IA, Akinola FF, Abajingin AO",
      journal: "Journal of Applied Toxicology",
      year: 2023,
      doi: "10.1002/jat.4438"
    },
    {
      title: "Neuroprotective effects of Drosophila melanogaster models of Parkinson's disease",
      authors: "Abolaji AO, Olaiya CO, Oluwadahunsi OJ, Farombi EO",
      journal: "Molecular Neurobiology",
      year: 2022,
      doi: "10.1007/s12035-022-02988-z"
    },
    {
      title: "Insecticides and Parkinson's disease: Mechanisms of neurodegeneration and therapeutic approaches",
      authors: "Abolaji AO, Adedara IA, Abajingin AO, Farombi EO",
      journal: "Neurotoxicology",
      year: 2021,
      doi: "10.1016/j.neuro.2021.06.002"
    }
  ];

  return (
    <div>
      <HeroSection />
      
      {/* Featured Sections */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader 
            title="Professor Abolaji's Profile"
            subtitle="A distinguished biochemist and researcher with focus on neurotoxicology and oxidative stress."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <motion.div
              className="card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Publications</h3>
              <p className="text-text-light mb-4">Explore Professor Abolaji's extensive research publications and academic contributions.</p>
              <Link to="/portfolio#publications" className="btn-outline py-2 px-4 text-sm">
                View Publications
              </Link>
            </motion.div>
            
            <motion.div
              className="card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Membership</h3>
              <p className="text-text-light mb-4">Learn about Professor Abolaji's professional affiliations and society memberships.</p>
              <Link to="/about#membership" className="btn-outline py-2 px-4 text-sm">
                View Memberships
              </Link>
            </motion.div>
            
            <motion.div
              className="card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Foundation</h3>
              <p className="text-text-light mb-4">Discover the work of Professor Abolaji's foundation and its impact on society.</p>
              <Link to="/foundation" className="btn-outline py-2 px-4 text-sm">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Publications */}
      <section className="section bg-background-alt">
        <div className="container">
          <SectionHeader 
            title="Selected Publications"
            subtitle="Explore some of Professor Abolaji's most impactful research publications."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {featuredPublications.map((publication, index) => (
              <PublicationCard 
                key={index}
                index={index}
                {...publication}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/portfolio#publications" className="btn-primary">
              View All Publications
            </Link>
          </div>
        </div>
      </section>
      
      {/* News & Events Section */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader 
            title="News & Events"
            subtitle="Stay updated with the latest news and upcoming events."
          />
          
          <div className="mt-10 p-10 rounded-lg bg-primary/5 text-center">
            <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
            <p className="text-text-light">
              This section will be updated with the latest news and events soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 