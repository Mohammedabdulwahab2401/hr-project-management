import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from "../../services/supabaseClient";

const Signup = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data?.user) {
        await supabase.from('profiles').insert([{ id: data.user.id, role }]);
        onAuthChange();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/" className="inline-block text-2xl font-bold text-gray-900">
              <span className="text-blue-500">Pulse</span>Track
            </Link>
          </motion.div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="text-center mt-6 text-sm text-gray-600">
          <p>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-blue-500 hover:text-blue-600">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-500 hover:text-blue-600">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
