import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPatient(data);
      } else {
        toast.error('Patient not found 😢');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient details');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/patient/edit/${id}`);
  };

  const handleDelete = async () => {
    // Custom confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="font-semibold text-gray-800">
          🗑️ Delete Patient Record?
        </div>
        <p className="text-sm text-gray-600">
          This action cannot be undone. All patient data will be permanently deleted.
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete();
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
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

  const confirmDelete = async () => {
    setDeleting(true);
    const loadingToast = toast.loading('Deleting patient record... 🗑️');
    
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Patient record deleted successfully! ✨', {
          id: loadingToast,
        });
        router.push('/');
      } else {
        toast.error('Failed to delete patient record 😢', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient record', {
        id: loadingToast,
      });
    } finally {
      setDeleting(false);
    }
  };

  const goBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center fade-in-up">
          <div className="text-4xl sm:text-6xl mb-4 spinner">⏳</div>
          <p className="text-gray-700 text-base sm:text-lg font-medium">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center fade-in-up">
          <div className="text-4xl sm:text-6xl mb-4 pulse-slow">❌</div>
          <p className="text-gray-700 text-base sm:text-lg font-medium">Patient not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-all fade-in-up hover:gap-3 text-sm sm:text-base"
        >
          <span>←</span> Back to All Patients
        </button>

        {/* Patient Details Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border-2 rainbow-border fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Image */}
            <div className="md:col-span-1 flex flex-col items-center slide-in-right">
              {patient.image_url ? (
                <img 
                  src={patient.image_url} 
                  alt={patient.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 sm:border-8 border-indigo-300 shadow-lg mb-4 float-animation"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-6xl sm:text-7xl lg:text-8xl border-4 sm:border-8 border-indigo-300 mb-4 float-animation">
                  👶
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">Patient ID</p>
                <p className="text-lg font-mono text-indigo-700 font-bold">#{patient.id}</p>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">{patient.name}</h1>
                <p className="text-xl sm:text-2xl text-indigo-600 font-semibold">{patient.age} years old {patient.op_number ? `· OP: ${patient.op_number}` : ''}</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Parent/Guardian */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200 card-hover">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl bounce-gentle">👨‍👩‍👧</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-semibold mb-1">Parent/Guardian</p>
                      <p className="text-xl text-gray-800 font-medium">{patient.parent_name}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border-2 border-indigo-200 card-hover">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl bounce-gentle" style={{ animationDelay: '0.5s' }}>📞</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-semibold mb-1">Contact Information</p>
                      <p className="text-xl text-gray-800 font-medium">{patient.contact_details}</p>
                    </div>
                  </div>
                </div>

                {/* Treatment */}
                {patient.treatment && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 card-hover">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl bounce-gentle" style={{ animationDelay: '1s' }}>🦷</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-semibold mb-1">Treatment</p>
                        <p className="text-xl text-gray-800 font-medium">{patient.treatment}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {patient.notes && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border-2 border-amber-200 card-hover">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl bounce-gentle" style={{ animationDelay: '1.5s' }}>📝</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-semibold mb-1">Notes</p>
                        <p className="text-base text-gray-800 whitespace-pre-wrap">{patient.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Record Info */}
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-5 border-2 border-gray-200 card-hover">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1 font-semibold">Record Created</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {new Date(patient.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1 font-semibold">Last Updated</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {new Date(patient.updated_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  onClick={handleEdit}
                  className="btn-primary flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  ✏️ Edit Patient
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-primary flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  {deleting ? '⏳ Deleting...' : '🗑️ Delete Patient'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
