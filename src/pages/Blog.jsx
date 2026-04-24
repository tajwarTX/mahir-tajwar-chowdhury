import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

export const posts = [
  {
    id: 1,
    title: "Optimizing 3D Performance in React",
    date: "OCT 24, 2026",
    category: "ENGINEERING",
    excerpt: "Exploring advanced techniques to maintain 120 FPS when rendering complex 3D scenes with React Three Fiber, focusing on draw calls and geometry instancing.",
    content: "Maintaining high performance in 3D web applications is a constant challenge. When working with React Three Fiber, the key is to minimize bridge traffic and keep the render loop lean.\n\nTechniques such as geometry instancing allow you to render thousands of similar objects in a single draw call, drastically reducing overhead. Additionally, using performance budgets and monitoring tools like the Three.js rstats can help identify bottlenecks in real-time."
  },
  {
    id: 2,
    title: "Cinematic UI Design Principles",
    date: "SEP 12, 2026",
    category: "DESIGN",
    excerpt: "How to translate principles from film and motion graphics into web interfaces to create deep, immersive, and highly engaging user experiences.",
    content: "Web design is evolving from static layouts to cinematic experiences. By borrowing techniques from film—such as depth of field, color grading, and orchestrated motion—we can create interfaces that feel alive.\n\nTiming and easing are critical. Using tools like Framer Motion allows us to define complex orchestrations that guide the user's eye and create a sense of narrative flow throughout the digital journey."
  },
  {
    id: 3,
    title: "The Future of Spatial Computing",
    date: "AUG 05, 2026",
    category: "THOUGHTS",
    excerpt: "A deep dive into how spatial computing is reshaping human-computer interaction, and what it means for the next generation of web applications.",
    content: "Spatial computing is more than just AR and VR; it's about the computer understanding the physical world around it. This shift in paradigm means we need to rethink how we design for the web.\n\nInteraction models are moving away from clicks and taps toward gestures and gaze. Preparing for this future requires a deep understanding of 3D environments and the ability to create responsive, context-aware experiences that blend the digital and physical worlds."
  }
];

export const getAllPosts = () => {
  try {
    const customPosts = JSON.parse(localStorage.getItem('custom_blogs')) || [];
    const deletedStaticIds = JSON.parse(localStorage.getItem('deleted_static_blogs')) || [];
    
    const customIds = new Set(customPosts.map(p => p.id));
    const deletedIds = new Set(deletedStaticIds);

    // Filter out static posts that have a custom version (edited) OR have been deleted
    const filteredStatic = posts.filter(p => !customIds.has(p.id) && !deletedIds.has(p.id));
    
    // Combine and sort (newest custom posts first, though they don't have dates easily comparable unless we parse them)
    return [...customPosts, ...filteredStatic];
  } catch (e) {
    return posts;
  }
};

export const Blog = () => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    setAllPosts(getAllPosts());
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black px-6 md:px-24 py-20 md:py-32 overflow-hidden selection:bg-[#a600ff] selection:text-white">
      <div className="absolute top-1/4 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(166,0,255,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] w-full relative z-[20] flex flex-col pt-12 md:pt-0">
        <div className="flex flex-col items-start z-10 w-full relative mb-16">
          <h1 className="font-orbitron text-[40px] md:text-[80px] lg:text-[100px] font-extrabold text-white uppercase leading-[0.9] tracking-tighter">
            <ScrollLetterRevealDelayed text="LATEST" duration={200} delay={0} />
            <br />
            <span className="text-[#a600ff]">
               <ScrollLetterRevealDelayed text="TRANSMISSIONS" duration={200} delay={0.1} />
            </span>
          </h1>
          
          <div className="mt-8 flex items-center gap-4">
             <div className="h-[1px] w-12 bg-[#a600ff]" />
             <span className="font-geist text-[10px] md:text-[11px] text-white/60 uppercase tracking-[0.4em] font-medium">
               ARCHIVE_004 
             </span>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <Link to={`/blog/${post.id}`} className="group cursor-target border border-white/10 hover:border-[#a600ff]/50 bg-white/[0.02] hover:bg-[#a600ff]/5 p-8 transition-all duration-500 relative overflow-hidden flex flex-col h-full block">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a600ff]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                
                <div className="flex justify-between items-center mb-6">
                  <span className="font-geist text-[9px] text-[#a600ff] uppercase tracking-[0.3em] font-bold">
                    {post.category}
                  </span>
                  <span className="font-geist text-[9px] text-white/40 uppercase tracking-[0.2em]">
                    {post.date}
                  </span>
                </div>
                
                <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white uppercase tracking-tighter leading-tight mb-4 group-hover:text-[#a600ff] transition-colors duration-300">
                  {post.title}
                </h2>
                
                <p className="font-geist text-white/60 text-xs md:text-sm leading-relaxed mb-8 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center gap-3">
                  <span className="font-geist text-[10px] text-white uppercase tracking-[0.3em] font-medium group-hover:text-[#a600ff] transition-colors duration-300">
                    DECRYPT
                  </span>
                  <div className="h-[1px] w-6 bg-white/30 group-hover:bg-[#a600ff] group-hover:w-10 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
