import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FiUpload, FiMapPin, FiInfo, FiTrash2 } from 'react-icons/fi';

const NewComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [departments, setDepartments] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const { showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await api.get('/departments');
        if (data.success) {
          setDepartments(data.departments);
          if (data.departments.length > 0) {
            setCategory(data.departments[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    };
    fetchDepartments();
  }, []);

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(', ');
            const shortAddress = parts.slice(0, 3).join(', ');
            setLocation(shortAddress);
            showToast('Location fetched successfully', 'success');
          } else {
            setLocation(`${latitude}, ${longitude}`);
            showToast('Using raw coordinates', 'info');
          }
        } catch {
          showToast('Failed to fetch address details', 'error');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (_error) => {
        showToast('Failed to get location. Please allow location access.', 'error');
        setIsFetchingLocation(false);
      }
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file sizes and counts
    if (files.length + selectedFiles.length > 5) {
      showToast('Maximum 5 files can be attached', 'error');
      return;
    }

    const invalidFile = selectedFiles.find((file) => file.size > 5 * 1024 * 1024);
    if (invalidFile) {
      showToast('Each file must be under 5MB', 'error');
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      showToast('Please fill in title, description and category', 'error');
      return;
    }

    setLoading(true);

    // Create Form Data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('priority', priority);
    formData.append('location', location);

    files.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      const data = await api.post('/complaints', formData, true);

      if (data.success) {
        showToast(`Complaint registered successfully: ${data.complaint.complaintId}`, 'success');
        navigate('/dashboard');
      } else {
        showToast(data.message || 'Submission failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'API request error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen p-6 sm:p-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">File New Grievance</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
            Submit details of the municipal or utility breakdown. You can attach images or PDFs for proof to help the resolution team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-3xl p-8 sm:p-12 flex flex-col gap-8 transition-colors duration-300"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Grievance Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water line burst near Sector 4 community hall"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Complaint Department *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all text-slate-800 dark:text-slate-100 cursor-pointer appearance-none"
                required
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id} className="dark:bg-slate-800">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Severity / Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all text-slate-800 dark:text-slate-100 cursor-pointer appearance-none"
              >
                <option value="low" className="dark:bg-slate-800">Low (14-Day Limit)</option>
                <option value="medium" className="dark:bg-slate-800">Medium (7-Day Limit)</option>
                <option value="high" className="dark:bg-slate-800">High (3-Day Limit)</option>
                <option value="critical" className="dark:bg-slate-800">Critical (24-Hr Limit)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex justify-between items-end mb-2.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Incident Location / Area Address
              </label>
              <button 
                type="button" 
                onClick={handleFetchLocation} 
                disabled={isFetchingLocation}
                className="text-brand-600 dark:text-brand-400 hover:underline text-xs font-bold flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <FiMapPin /> {isFetchingLocation ? 'FETCHING...' : 'USE CURRENT LOCATION'}
              </button>
            </div>
            <div className="relative group">
              <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Park Street Crossroad, Sector 4"
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-end mb-2.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Grievance Description *
              </label>
              <span className={`text-xs font-bold ${description.length >= 500 ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
                {description.length}/500
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issues in detail so resolving officers understand the context..."
              rows={6}
              maxLength={500}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              required
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Supporting Evidence Attachments
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-brand-50/30 dark:hover:bg-brand-900/20 transition-colors rounded-3xl p-10 text-center cursor-pointer relative group">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
              />
              <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-transform">
                <FiUpload className="text-2xl text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300 font-bold block mb-1">
                Drag and drop files here, or click to browse
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">
                Supports JPEG, PNG, PDF documents up to 5MB (Max 5 files)
              </span>
            </div>

            {/* Attached Files List */}
            {files.length > 0 && (
              <ul className="mt-6 flex flex-col gap-3">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-sm"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-xs">{file.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="w-8 h-8 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Info Box */}
          <div className="p-5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100/50 dark:border-brand-500/20 rounded-2xl text-brand-800 dark:text-brand-400 text-xs flex gap-3 items-start">
            <FiInfo className="text-xl flex-shrink-0 text-brand-500 dark:text-brand-400 mt-0.5" />
            <p className="leading-relaxed font-medium">
              By submitting this ticket, you certify that the provided information is accurate and factual. Abuse of public grievance systems may lead to suspension of e-governance accounts.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-8 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-brand-600 hover:bg-brand-500 dark:bg-brand-700 dark:hover:bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Registering Grievance...' : 'Submit Grievance Now'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-2xl transition-colors active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;



