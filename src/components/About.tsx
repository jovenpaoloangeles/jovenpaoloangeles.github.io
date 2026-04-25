import { motion } from 'framer-motion';
import { Briefcase, Download, FlaskConical, Mail, Printer, Target, Users, Github, Cpu, TrendingUp } from 'lucide-react';
import { GitHubCalendar, type ThemeInput } from 'react-github-calendar';
import { useTheme } from '@/hooks/useTheme';

export function About() {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
<div className="grid md:grid-cols-[auto_1fr] gap-x-6 gap-y-8 items-start">
  
  {/* 1. THE SCIENTIST: Merged Ph.D. Identity with Research Goals for immediate impact */}
  <FlaskConical className="w-5 h-5 text-primary mt-1 shrink-0" />
  <p className="text-muted-foreground leading-relaxed text-justify">
    I am a Ph.D. candidate in Materials Science at the University of the Philippines, developing a <strong>Bayesian Optimization Framework</strong> to accelerate nanoparticle synthesis. My goal is to <strong>cut experimental cost and time </strong>, applying responsible AI principles to make nanomaterial research more reproducible, sustainable, and accessible for multiple applications.
  </p>

  {/* 2. THE ENGINEER: Focused on production and scale */}
  <Briefcase className="w-5 h-5 text-primary mt-1 shrink-0" />
  <p className="text-muted-foreground leading-relaxed text-justify">
    As a <strong>Senior AI Engineer</strong>, I architect production-grade <strong>Retrieval-Augmented Generation (RAG)</strong> and multi-agent systems for government use. My work focuses on the hard engineering behind AI: building ELT pipelines, optimizing agentic retrieval, and deploying document processing systems that serve real stakeholders. I prioritize reliability over hype, ensuring these systems work effectively outside the lab.
  </p>

  {/* 3. THE EXPLORER: Algorithmic Trading & Self-Hosted Infrastructure */}
  <Cpu className="w-5 h-5 text-primary mt-1 shrink-0" />
  <p className="text-muted-foreground leading-relaxed text-justify">
    My long-standing interest in stocks and cryptocurrency has evolved into a technical playground. I currently run my own <strong>automated ML-based trading algorithms</strong> and am exploring <strong>Federated Learning</strong> to train decentralized trading bots. This workflow relies on my <strong>home lab</strong>, which serves as both a research hub and a family utility. It handles scheduled AI model training and blockchain experiments while simultaneously running my smart home, a centralized NAS, and a suite of self-hosted apps that replace commercial subscriptions.
  </p>

  {/* 4. THE CREATOR: The human element */}
  <Printer className="w-5 h-5 text-primary mt-1 shrink-0" />
  <p className="text-muted-foreground leading-relaxed text-justify">
    Beyond the code, I bridge precision with expression. I run <strong><a href="https://print3dmnl.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PRINT3D.MNL</a></strong>, a 3D printing studio for computational design, and explore <strong>generative art</strong> and photography. 
    <br />
    For me, science and art are different expressions of the same drive: to understand, optimize, and create.
  </p>

  {/* 5. CALL TO ACTION: Consolidated hook */}
  <Users className="w-5 h-5 text-primary mt-1 shrink-0" />
  <p className="text-muted-foreground leading-relaxed text-justify">
    <strong>Let's collaborate&nbsp;🤝</strong>&nbsp;—&nbsp;Whether you're exploring AI leadership, sustainable nanomaterials, or the fusion of blockchain and machine learning, feel free to reach out.
  </p>
</div>
      {/*––– GitHub Activity –––*/}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Github className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">GitHub Activity</h3>
        </div>
        <div className="bg-card flex items-center justify-center rounded-lg p-4 border border-border">
          <GitHubCalendar
            username="jovenpaoloangeles"
            blockSize={10}
            blockMargin={4}
            fontSize={12}
            colorScheme={theme}
          />
        </div>
      </div>

      {/*––– action buttons –––*/}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <a
          href="/Angeles_CV.pdf" download="Joven-Paolo-Angeles-Academic-CV.pdf"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Academic CV
        </a>
        <a
          href="/cv-photography.pdf"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Photography CV
        </a>
        <a
          href="mailto:jovenpaoloangeles@gmail.com"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Me
        </a>
      </div>
    </motion.div>
  );
}
