import React, { useState, useEffect } from 'react';
import { posts as staticPosts, getAllPosts } from './Blog';

const ADMIN_HASH = "6a0245da77fb538f51a47068df00d04502b1fdd0f843160ac2e4d17eb39876dc";

async function sha256(message) {
  if (!window.crypto || !window.crypto.subtle) {
    return message; 
  }
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch {
    return message;
  }
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [refLinks, setRefLinks] = useState([{ label: '', url: '' }]);
  
  const [allDisplayPosts, setAllDisplayPosts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setAllDisplayPosts(getAllPosts());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const inputHash = await sha256(password);
      const isMatch = (username === 'admin' && (inputHash === ADMIN_HASH || password === "tajwarerwebsite"));
      
      if (isMatch) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials.');
      }
    } catch {
      setError('System Error.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setTitle('');
    setCategory('');
    setDate('');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setVideoUrl('');
    setRefLinks([{ label: '', url: '' }]);
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();
    
    const blogData = {
      id: editingId || Date.now(),
      title, category, date, excerpt, content, imageUrl, videoUrl,
      refLinks: refLinks.filter(l => l.label && l.url)
    };
    
    const customPosts = JSON.parse(localStorage.getItem('custom_blogs')) || [];
    let updatedCustom;
    
    const isEditingExistingCustom = customPosts.some(p => p.id === blogData.id);
    const isEditingStatic = staticPosts.some(s => s.id === blogData.id);

    if (isEditingExistingCustom || isEditingStatic) {
      // Update or override
      updatedCustom = customPosts.filter(p => p.id !== blogData.id);
      updatedCustom = [blogData, ...updatedCustom];
    } else {
      // New post
      updatedCustom = [blogData, ...customPosts];
    }
    
    localStorage.setItem('custom_blogs', JSON.stringify(updatedCustom));
    setAllDisplayPosts(getAllPosts()); // Refresh list
    setSuccessMsg('Changes saved to transmission archive!');
    resetForm();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setShowForm(true);
    setTitle(post.title || '');
    setCategory(post.category || '');
    setDate(post.date || '');
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setImageUrl(post.imageUrl || '');
    setVideoUrl(post.videoUrl || '');
    setRefLinks(post.refLinks && post.refLinks.length > 0 ? post.refLinks : [{ label: '', url: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transmission permanently?')) {
      // 1. If it's a static post, add to deleted list
      const isStatic = staticPosts.some(s => s.id === id);
      if (isStatic) {
        const deletedStatic = JSON.parse(localStorage.getItem('deleted_static_blogs')) || [];
        if (!deletedStatic.includes(id)) {
          localStorage.setItem('deleted_static_blogs', JSON.stringify([...deletedStatic, id]));
        }
      }
      
      // 2. Remove from custom posts (in case it was an edit of a static post or a new post)
      const customPosts = JSON.parse(localStorage.getItem('custom_blogs')) || [];
      const updatedCustom = customPosts.filter(p => p.id !== id);
      localStorage.setItem('custom_blogs', JSON.stringify(updatedCustom));
      
      setAllDisplayPosts(getAllPosts()); // Refresh
      setSuccessMsg('Transmission deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const addRefLink = () => setRefLinks([...refLinks, { label: '', url: '' }]);
  const updateRefLink = (index, field, value) => {
    const updated = [...refLinks];
    updated[index][field] = value;
    setRefLinks(updated);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pt-32 px-6 selection:bg-[#a600ff]">
      <div className="max-w-4xl mx-auto relative z-[100]">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-20">
            <form onSubmit={handleLogin} className="w-full max-w-md p-10 border border-white/10 bg-white/5 space-y-8">
              <h1 className="text-3xl font-orbitron font-bold text-center uppercase tracking-tighter">Admin Access</h1>
              {error && <p className="text-red-500 text-center text-xs uppercase">{error}</p>}
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-2">
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-transparent outline-none" required />
                </div>
                <div className="border-b border-white/20 pb-2">
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent outline-none" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#a600ff] hover:bg-[#b524ff] transition-colors font-bold uppercase tracking-widest">
                  {isLoading ? 'Verifying...' : 'Enter Dashboard'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            <div className="flex justify-between items-center border-b border-white/10 pb-8">
              <h1 className="text-4xl font-orbitron font-bold uppercase">Control Center</h1>
              <button onClick={() => setShowForm(!showForm)} className="bg-[#a600ff] px-8 py-3 font-bold uppercase text-xs">
                {showForm ? 'Close' : '+ New transmission'}
              </button>
            </div>

            {successMsg && <div className="p-4 bg-green-500/20 text-green-400 text-center uppercase text-xs tracking-widest">{successMsg}</div>}

            {showForm ? (
              <form onSubmit={handleSaveBlog} className="space-y-8 bg-white/5 p-10 border border-white/10 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" placeholder="Post Title" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 p-4" />
                  <input type="text" placeholder="Category" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black border border-white/10 p-4" />
                  <input type="text" placeholder="Date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black border border-white/10 p-4" />
                  <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-black border border-white/10 p-4" />
                  <input type="text" placeholder="Video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black border border-white/10 p-4 md:col-span-2" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs uppercase text-white/40">Reference Links</label>
                  {refLinks.map((link, i) => (
                    <div key={i} className="flex gap-4">
                      <input type="text" placeholder="Label" value={link.label} onChange={e => updateRefLink(i, 'label', e.target.value)} className="flex-1 bg-black border border-white/10 p-3 text-sm" />
                      <input type="text" placeholder="URL" value={link.url} onChange={e => updateRefLink(i, 'url', e.target.value)} className="flex-1 bg-black border border-white/10 p-3 text-sm" />
                    </div>
                  ))}
                  <button type="button" onClick={addRefLink} className="text-[#a600ff] text-xs uppercase">+ Add link</button>
                </div>

                <textarea placeholder="Short Excerpt" required value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="w-full bg-black border border-white/10 p-4" />
                <textarea placeholder="Full Blog Content" required value={content} onChange={e => setContent(e.target.value)} rows={12} className="w-full bg-black border border-white/10 p-4" />
                <button type="submit" className="w-full py-5 bg-[#a600ff] font-bold uppercase tracking-widest">{editingId ? 'Update Transmission' : 'Publish Transmission'}</button>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {allDisplayPosts.length === 0 ? (
                  <p className="text-white/20 text-center py-20 uppercase tracking-[0.3em]">No transmissions found.</p>
                ) : (
                  allDisplayPosts.map(post => (
                    <div key={post.id} className="flex justify-between items-center border border-white/10 p-8 bg-white/5 hover:bg-white/10 transition-colors group">
                      <div>
                        <h3 className="text-xl font-bold uppercase group-hover:text-[#a600ff] transition-colors">{post.title}</h3>
                        <p className="text-white/40 text-xs font-bold mt-1 uppercase">
                          {post.category} — {post.date}
                          {staticPosts.some(s => s.id === post.id) && !JSON.parse(localStorage.getItem('custom_blogs') || '[]').some(c => c.id === post.id) && <span className="ml-2 text-white/10 text-[10px] italic">[Original]</span>}
                        </p>
                      </div>
                      <div className="flex gap-8">
                        <button onClick={() => handleEdit(post)} className="text-white/40 hover:text-white uppercase text-xs tracking-widest">Edit</button>
                        <button onClick={() => handleDelete(post.id)} className="text-white/40 hover:text-red-500 uppercase text-xs tracking-widest">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
