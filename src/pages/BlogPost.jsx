import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllPosts } from './Blog';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const allPosts = getAllPosts();
    const foundPost = allPosts.find(p => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
    } else {
      navigate('/blog');
    }
  }, [id, navigate]);

  if (!post) return null;

  const embedUrl = getYoutubeEmbedUrl(post.videoUrl);

  return (
    <div className="w-full min-h-screen bg-black px-6 md:px-24 py-24 md:py-32 overflow-x-hidden selection:bg-[#a600ff] selection:text-white text-white">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_rgba(166,0,255,0.15)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-[800px] w-full mx-auto relative z-[20]">
        
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/blog')}
          className="group cursor-target flex items-center gap-4 mb-16 text-white/60 hover:text-white transition-colors duration-300 bg-transparent border-none outline-none"
        >
          <div className="h-[1px] w-8 bg-white/30 group-hover:bg-white group-hover:w-12 transition-all duration-300" />
          <span className="font-geist text-[10px] uppercase tracking-[0.4em] font-medium">RETURN TO ARCHIVE</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="font-geist text-[10px] text-[#a600ff] uppercase tracking-[0.4em] font-bold">
              {post.category}
            </span>
            <div className="h-1 w-1 rounded-full bg-white/30" />
            <span className="font-geist text-[10px] text-white/40 uppercase tracking-[0.3em]">
              {post.date}
            </span>
          </div>

          <h1 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase leading-[1.1] tracking-tighter mb-12">
            {post.title}
          </h1>

          <div className="w-full h-[1px] bg-white/10 mb-12 relative">
            <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-[#a600ff]" />
          </div>

          {post.imageUrl && (
            <div className="w-full mb-12 overflow-hidden border border-white/10 bg-white/[0.02]">
              <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
          )}

          {post.videoUrl && (
            <div className="w-full mb-12 aspect-video overflow-hidden border border-white/10 bg-black">
              {embedUrl ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={embedUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              ) : (
                <video controls className="w-full h-full">
                  <source src={post.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none font-geist text-white/70 leading-relaxed space-y-8 mb-20">
            <p className="text-xl md:text-2xl text-white/90 font-medium leading-snug">
              {post.excerpt}
            </p>
            
            {post.content ? (
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <>
                <p>
                  Here begins the main transmission log. In this article, we delve deep into the systems and methodologies necessary to achieve the desired outcomes. The intersection of modern tooling and creative design unlocks unprecedented possibilities for digital experiences. 
                </p>

                <h2 className="font-orbitron text-2xl text-white uppercase tracking-wider mt-12 mb-6 text-[#a600ff]">Core Methodologies</h2>
                
                <p>
                  Applying these concepts requires a fundamental shift in how we approach web development. It is no longer just about rendering elements on a screen; it's about orchestrating a symphony of graphics, interactions, and performance metrics.
                </p>

                <ul className="list-disc pl-6 space-y-4 marker:text-[#a600ff]">
                  <li>Performance budgets and their impact on rendering pipelines.</li>
                  <li>Shader optimization and avoiding unnecessary draw calls.</li>
                  <li>Implementing robust state management for interactive 3D components.</li>
                </ul>

                <p>
                  As we continue to push the boundaries of what is possible in the browser, these techniques will evolve. The key is to remain adaptable and constantly test against the limitations of current hardware.
                </p>
              </>
            )}
          </div>

          {post.refLinks && post.refLinks.length > 0 && (
            <div className="border-t border-white/10 pt-12 mt-12">
              <h3 className="font-orbitron text-sm uppercase tracking-[0.3em] mb-6 text-white/40">Reference Channels</h3>
              <div className="flex flex-wrap gap-6">
                {post.refLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group cursor-target flex items-center gap-3 text-white/60 hover:text-[#a600ff] transition-colors"
                  >
                    <div className="w-1 h-1 bg-[#a600ff] rounded-full group-hover:scale-150 transition-transform" />
                    <span className="font-geist text-[10px] uppercase tracking-widest">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;
