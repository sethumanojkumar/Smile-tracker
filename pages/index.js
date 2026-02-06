import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

export default function Home() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all children
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setChildren(data);
      setFilteredChildren(data);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChildren(children);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = children.filter(child => 
      child.name.toLowerCase().includes(searchLower) ||
      (child.parent_name || '').toLowerCase().includes(searchLower) ||
      (child.op_number || '').toLowerCase().includes(searchLower) ||
      child.age.toString().includes(searchLower)
    );
    setFilteredChildren(filtered);
  }, [searchTerm, children]);

  // Navigate to patient detail
  const viewPatientDetail = (id) => {
    router.push(`/patient/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 rainbow-border fade-in-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, parent, or age..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-indigo-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-lg transition-all"
            />
            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl bounce-gentle">
              🔍
            </span>
          </div>
          {searchTerm && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 slide-in-right">
              Found {filteredChildren.length} patient{filteredChildren.length === 1 ? '' : 's'} ✨
            </p>
          )}

          {/* Export Button for admin */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={async () => {
                try {
                  // Use the current children list (all records)
                  const rows = children.map(c => ({
                    id: c.id,
                    name: c.name,
                    age: c.age,
                    parent_name: c.parent_name,
                    op_number: c.op_number || '',
                    contact_details: c.contact_details,
                    treatment: c.treatment || '',
                    notes: c.notes || '',
                    image_url: c.image_url || ''
                  }));

                  if (!rows || rows.length === 0) {
                    alert('No patient data to export');
                    return;
                  }

                  const XLSX = await import('xlsx');
                  const ws = XLSX.utils.json_to_sheet(rows);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, 'Patients');
                  // Trigger download in browser
                  XLSX.writeFile(wb, 'smile-tracker-patients.xlsx');
                } catch (err) {
                  console.error('Export failed', err);
                  alert('Export failed: ' + (err.message || err));
                }
              }}
              className="ml-2 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all"
            >
              ⤓ Export Excel
            </button>
          </div>
        </div>

        {/* Children List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border-2 border-indigo-200 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl sm:text-2xl font-semibold text-indigo-900 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="float-animation">👶</span> Patient Records ({filteredChildren.length})
          </h2>
          
          {loading && (
            <div className="text-center py-8 sm:py-12 fade-in-up">
              <div className="text-4xl sm:text-6xl mb-4 spinner">⏳</div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">Loading patient records...</p>
            </div>
          )}

          {!loading && filteredChildren.length === 0 && (
            <div className="text-center py-8 sm:py-12 fade-in-up">
              <div className="text-4xl sm:text-6xl mb-4 pulse-slow">🦷</div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {searchTerm ? 'No patients found matching your search.' : 'No patient records yet. Add your first patient!'}
              </p>
            </div>
          )}

          {!loading && filteredChildren.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredChildren.map((child, index) => (
                <div
                  key={child.id}
                  onClick={() => viewPatientDetail(child.id)}
                  onKeyPress={(e) => e.key === 'Enter' && viewPatientDetail(child.id)}
                  role="button"
                  tabIndex={0}
                  className="card-hover border-2 border-indigo-200 rounded-lg sm:rounded-xl p-4 sm:p-5 cursor-pointer bg-gradient-to-br from-white to-indigo-50 shadow-md fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {/* Patient Image */}
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {child.image_url ? (
                      <img 
                        src={child.image_url} 
                        alt={child.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-indigo-300 shadow-lg transition-transform hover:scale-110"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-3xl sm:text-4xl border-4 border-indigo-300 transition-transform hover:scale-110">
                        👶
                      </div>
                    )}
                  </div>

                  {/* Patient Info */}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-bold text-indigo-900 mb-1 truncate" title={child.name}>
                      {child.name}
                    </h3>
                    <p className="text-sm sm:text-base text-indigo-600 font-semibold mb-2">Age: {child.age} years {child.op_number ? `· OP: ${child.op_number}` : ''}</p>
                    {child.treatment && (
                      <p className="text-xs text-green-700 font-medium mb-1 truncate bg-green-50 px-2 py-1 rounded-full mx-auto inline-block" title={child.treatment}>
                        🦷 {child.treatment}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 truncate mt-1" title={child.parent_name}>
                      Parent: {child.parent_name || '—'}
                    </p>
                    <p className="text-xs text-indigo-400 mt-2 sm:mt-3 font-medium">
                      Click to view details →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}