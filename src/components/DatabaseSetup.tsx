import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { populateDatabase } from '../services/sampleData';

const DatabaseSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePopulateDatabase = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await populateDatabase();
      if (result) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Failed to populate database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <Database className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Database Setup</h3>
        </div>
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-600 mb-3"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Database populated successfully!</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 mb-3"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
        
        <button
          onClick={handlePopulateDatabase}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Populating...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Populate Sample Data
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          This will add sample bookings, users, and contacts to your database.
        </p>
      </motion.div>
    </div>
  );
};

export default DatabaseSetup;