import { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadImage } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AddPatient() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: '', 
    age: '', 
    parent_name: '', 
    op_number: '',
    contact_details: '',
    treatment: '',
    notes: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file 📸');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB 📦');
      return;
    }

    setImageFile(file);
    toast.success('Image selected! 🎉');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to Supabase
  const handleImageUpload = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    const uploadToast = toast.loading('Uploading image... 📤');
    
    try {
      const imageUrl = await uploadImage(imageFile);
      toast.success('Image uploaded successfully! ✨', {
        id: uploadToast,
      });
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image 😢', {
        id: uploadToast,
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Create a new patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    // parent_name is optional now
    if (!formData.name || !formData.age || !formData.contact_details) return;

    setLoading(true);
    const loadingToast = toast.loading('Adding patient record... 📝');
    
    try {
      // Upload image first if selected
      let image_url = null;
      if (imageFile) {
        toast.dismiss(loadingToast);
        image_url = await handleImageUpload();
        if (imageFile && !image_url) {
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image_url }),
      });

      if (res.ok) {
        const newPatient = await res.json();
        toast.success('Patient added successfully! 🎉', {
          id: imageFile ? undefined : loadingToast,
        });
        router.push(`/patient/${newPatient.id}`);
      } else {
        toast.error('Failed to add patient 😢', {
          id: imageFile ? undefined : loadingToast,
        });
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to add patient', {
        id: imageFile ? undefined : loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // Custom confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="font-semibold text-gray-800">
          ⚠️ Unsaved Changes
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to cancel? Any unsaved changes will be lost.
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              router.push('/');
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Keep Editing
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        minWidth: '350px',
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-all fade-in-up hover:gap-3 text-sm sm:text-base"
        >
          <span>←</span> Cancel
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border-2 rainbow-border fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-2 flex items-center gap-2 sm:gap-3">
            <span className="tooth-sparkle text-2xl sm:text-3xl">➕</span> Add New Patient
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 font-medium">Enter the patient&apos;s information below</p>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-8 slide-in-right" style={{ animationDelay: '0.2s' }}>
              <label className="block text-gray-800 text-sm font-bold mb-3" htmlFor="photo">
                Patient Photo (Optional) 📸
              </label>
              <div className="flex items-center gap-6">
                {imagePreview ? (
                  <div className="relative float-animation">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        toast.success('Image removed');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-5xl border-4 border-indigo-200 pulse-slow">
                    👶
                  </div>
                )}
                <div className="flex-1">
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer file:transition-all"
                  />
                  <p className="text-xs text-gray-600 mt-2 font-medium">Recommended: Clear face photo, Max size: 5MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Child Name */}
              <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="name">
                  Child&apos;s Full Name * 👶
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter child&apos;s full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Age */}
              <div className="fade-in-up" style={{ animationDelay: '0.35s' }}>
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="age">
                  Age * 🎂
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="18"
                  placeholder="Age in years"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Parent Name */}
              <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="parent_name">
                  Parent/Guardian Name (optional) 👨‍👩‍👧
                </label>
                <input
                  id="parent_name"
                  type="text"
                  placeholder="Enter parent&apos;s full name"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* OP Number */}
              <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="op_number">
                  OP Number (optional)
                </label>
                <input
                  id="op_number"
                  type="text"
                  placeholder="Enter OP number"
                  value={formData.op_number}
                  onChange={(e) => setFormData({ ...formData, op_number: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Contact Details */}
              <div className="fade-in-up" style={{ animationDelay: '0.45s' }}>
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="contact_details">
                  Contact Details * 📞
                </label>
                <input
                  id="contact_details"
                  type="text"
                  placeholder="Phone and/or email"
                  value={formData.contact_details}
                  onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Treatment */}
              <div className="fade-in-up" style={{ animationDelay: '0.5s' }}>
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="treatment">
                  Treatment 🦷
                </label>
                <input
                  id="treatment"
                  type="text"
                  placeholder="e.g., Cleaning, Filling, Checkup"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Notes - Full Width */}
            <div className="mb-8 fade-in-up" style={{ animationDelay: '0.55s' }}>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="notes">
                Notes 📝
              </label>
              <textarea
                id="notes"
                placeholder="Add any additional notes about the patient..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-vertical"
                rows="4"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="btn-primary flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading || uploadingImage ? '⏳ Processing...' : '➕ Add Patient'}
              </button>
              <button
                type="button"
                onClick={goBack}
                disabled={loading || uploadingImage}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl focus:outline-none focus:shadow-outline transition-all text-base sm:text-lg disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ✖️ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
