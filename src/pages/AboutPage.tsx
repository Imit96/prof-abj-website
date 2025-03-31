import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { FileText, Award, Briefcase, GraduationCap, User } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      <motion.section 
        className="bg-primary/10 py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">About Prof. Amos Olalekan Abolaji</h1>
            <p className="text-lg text-text-light">
              A distinguished biochemist with a passion for research and education.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Biography Section */}
      <section className="section bg-white" id="biography">
        <div className="container">
          <SectionHeader 
            title="Biography" 
            subtitle="Learn about Professor Abolaji's academic journey and professional background."
          />
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="prose prose-lg max-w-none">
                <p>
                  Dr Amos Abolaji received his Masters (Biochemistry) from the Department of Biochemistry, University of Ibadan, Ibadan, Nigeria; and his Ph.D. (Dr.rer.nat) in Toxicology from TU Dresden, Germany. He was a Visiting Scientist at University of Bonn (2016), University of Cape Town (2018) and University of Konstanz, Germany (2017-2019) having a specialization in Drosophila neurotoxicology.
                </p>
                <p>
                  His research interests center on investigating molecular toxicological mechanisms with a focus on studying oxidative stress and biotransformation reactions within the model organism, Drosophila melanogaster. These studies aim to enhance our understanding of xenobiotic-induced neurodegenerative disorders, with a particular emphasis on Parkinson's Disease.
                </p>
                <p>
                  Prof. Abolaji's research has been supported by various international and national grants, including those from the Alexander von Humboldt Foundation, German Research Foundation (DFG), National Research Foundation (NRF) of South Africa, and Tertiary Education Trust Fund (TETFund) of Nigeria.
                </p>
                <p>
                  He serves in editorial roles for journals including Archives of Basic and Applied Medicine and as an international reviewer for numerous high-impact journals. Prof. Abolaji's contributions to the scientific community include over 100 peer-reviewed publications, and his expertise has been recognized through various awards and professional memberships.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="card p-6">
                <h3 className="text-xl font-medium mb-4 font-serif">Professional Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Current Position</h4>
                      <p className="text-text-light text-sm">
                        Professor of Biochemistry, Department of Biochemistry, Faculty of Basic Medical Science, College of Medicine, University of Ibadan, Nigeria
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Education</h4>
                      <p className="text-text-light text-sm">
                        Ph.D. (Dr.rer.nat) in Toxicology, TU Dresden, Germany<br />
                        M.Sc Biochemistry, University of Ibadan, Nigeria
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Research Focus</h4>
                      <p className="text-text-light text-sm">
                        Molecular Toxicology, Oxidative Stress, Drosophila Neurotoxicology, Neurodegenerative Disorders
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                      <Award size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Recognitions</h4>
                      <p className="text-text-light text-sm">
                        Alexander von Humboldt Research Fellowship, German Research Foundation (DFG) Grant, Various Academic Awards
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Work Section */}
      <section className="section bg-background-alt" id="research">
        <div className="container">
          <SectionHeader 
            title="Research Work" 
            subtitle="Explore Professor Abolaji's research interests and ongoing projects."
          />
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-medium mb-4 font-serif">Drosophila Neurotoxicology</h3>
              <p className="text-text-light mb-4">
                Utilizing Drosophila melanogaster as a model organism to investigate neurotoxic mechanisms of environmental compounds, with a focus on pesticides and other xenobiotics that may contribute to neurodegenerative disorders.
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Pesticide-induced oxidative stress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Parkinson's disease modeling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Behavioral and biochemical studies</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-xl font-medium mb-4 font-serif">Molecular Mechanisms of Toxicity</h3>
              <p className="text-text-light mb-4">
                Investigating the biochemical and molecular pathways involved in xenobiotic-induced toxicity, with emphasis on oxidative stress, biotransformation reactions, and cellular defense mechanisms.
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Oxidative stress biomarkers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Antioxidant defense systems</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Xenobiotic metabolism</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-xl font-medium mb-4 font-serif">Neuroprotective Agents</h3>
              <p className="text-text-light mb-4">
                Evaluating the potential neuroprotective effects of natural compounds and plant extracts against xenobiotic-induced neurotoxicity in both in vitro and in vivo models.
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Plant-derived antioxidants</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Neuroprotective mechanisms</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Therapeutic applications</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-xl font-medium mb-4 font-serif">Environmental Toxicology</h3>
              <p className="text-text-light mb-4">
                Studying the health implications of environmental toxicants, with particular focus on pesticides, heavy metals, and air pollutants and their potential role in the development of neurodegenerative disorders.
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Pesticide toxicity assessment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Heavy metal neurotoxicity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span>Risk assessment</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="section bg-white" id="membership">
        <div className="container">
          <SectionHeader 
            title="Professional Memberships" 
            subtitle="Organizations and societies where Professor Abolaji contributes his expertise."
          />
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary mt-1">•</div>
                  <div>
                    <h4 className="font-medium">Society of Toxicology (SOT)</h4>
                    <p className="text-text-light text-sm">Member since 2018</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary mt-1">•</div>
                  <div>
                    <h4 className="font-medium">International Society of Neuroscience (ISN)</h4>
                    <p className="text-text-light text-sm">Member since 2019</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary mt-1">•</div>
                  <div>
                    <h4 className="font-medium">International Society of Environmental Toxicology (ISET)</h4>
                    <p className="text-text-light text-sm">Member since 2015</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="card p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary mt-1">•</div>
                  <div>
                    <h4 className="font-medium">Nigerian Society of Biochemistry and Molecular Biology (NSBMB)</h4>
                    <p className="text-text-light text-sm">Member since 2010</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary mt-1">•</div>
                  <div>
                    <h4 className="font-medium">Alexander von Humboldt Foundation</h4>
                    <p className="text-text-light text-sm">Fellow</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-primary mt-1">•</div>
                  <div>
                    <h4 className="font-medium">African Academy of Sciences</h4>
                    <p className="text-text-light text-sm">Member</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CV Section */}
      <section className="section bg-background-alt" id="cv">
        <div className="container">
          <SectionHeader 
            title="Curriculum Vitae" 
            subtitle="Professional background and academic achievements."
          />
          
          <div className="mt-10 text-center">
            <div className="inline-block p-8 bg-white rounded-lg shadow-md">
              <FileText size={48} className="mx-auto text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Download CV</h3>
              <p className="text-text-light mb-4">
                Get a comprehensive overview of Professor Abolaji's academic and professional experience.
              </p>
              <button className="btn-primary">
                Download CV (PDF)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 