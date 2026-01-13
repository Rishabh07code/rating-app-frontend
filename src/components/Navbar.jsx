import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ user }) {
  const { logout, changePassword } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async () => {
    if (!changePassword) return; // Guard if not implemented yet
    
    // Validate new password
    if (!validatePassword(newPassword)) {
      setPasswordMessage("Password must be 8-16 characters with at least one uppercase letter and one special character");
      return;
    }
    
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setIsModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordMessage('');
      alert("Password changed successfully");
    } else {
      setPasswordMessage(res.message);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-lg bg-indigo-600/10 text-indigo-600">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Store Rating App</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-200 rounded-full  size-9 border-2 border-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user.name.slice(0, 10)}&background=6366f1&color=fff`} alt="Profile" />
              </div>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-900">{user.name.slice(0, 10)}</span>
                <span className="text-xs text-slate-500">{user.role.toLowerCase()}</span>
              </div>
              <div className=''>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                </button>
              </div>
              <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              <button onClick={logout} className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-indigo-600">
                <span className="material-symbols-outlined text-xl">logout</span>
                <span className="text-sm font-medium">Logout</span>
              </button>

            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {passwordMessage && <p className="text-red-500 text-sm">{passwordMessage}</p>}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Current Password</label>
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm outline-none" type="password" placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">New Password</label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm outline-none" type="password" placeholder="••••••••"
                />
              </div>
            </div>
            <div className="p-6 pt-2 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg">Cancel</button>
              <button onClick={handlePasswordChange} className="px-6 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200">Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
