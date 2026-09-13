import React, { useState, useEffect } from 'react';
import { User, GameState } from '../types';

interface AdminDashboardProps {
  user: User;
  gameState: GameState | null;
  onLogout: () => void;
  supabaseAdmin: any;
  supportEmail: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, gameState, onLogout, supabaseAdmin, supportEmail 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [banReason, setBanReason] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
    loadAuditLogs();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data) setAuditLogs(data);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const logAction = async (action: string, details: string) => {
    try {
      await supabaseAdmin.from('audit_logs').insert({
        admin_id: user.id,
        action,
        details,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      await supabaseAdmin
        .from('profiles')
        .update({ is_banned: true, ban_reason: reason })
        .eq('id', userId);
      
      await logAction('BAN_USER', `Banned user ${userId}. Reason: ${reason}`);
      loadUsers();
      alert('User banned successfully');
    } catch (error) {
      alert('Error banning user: ' + error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await supabaseAdmin
        .from('profiles')
        .update({ is_banned: false, ban_reason: null })
        .eq('id', userId);
      
      await logAction('UNBAN_USER', `Unbanned user ${userId}`);
      loadUsers();
      alert('User unbanned successfully');
    } catch (error) {
      alert('Error unbanning user: ' + error);
    }
  };

  const handleGrantPremium = async (userId: string, tier: string) => {
    try {
      await supabaseAdmin
        .from('profiles')
        .update({ premium_tier: tier })
        .eq('id', userId);
      
      await logAction('GRANT_PREMIUM', `Granted ${tier} premium to user ${userId}`);
      loadUsers();
      alert('Premium granted successfully');
    } catch (error) {
      alert('Error granting premium: ' + error);
    }
  };

  const handleUpdateStats = async () => {
    try {
      await supabaseAdmin
        .from('game_state')
        .update(editData)
        .eq('user_id', selectedUser.id);
      
      await logAction('UPDATE_STATS', `Updated stats for user ${selectedUser.id}: ${JSON.stringify(editData)}`);
      alert('Stats updated successfully');
    } catch (error) {
      alert('Error updating stats: ' + error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-green-400 mb-4">WARDEN CONTROL PANEL - OVERVIEW</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-gray-700 p-4">
          <p className="text-gray-400">Total Inmates</p>
          <p className="text-3xl text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-4">
          <p className="text-gray-400">Banned Accounts</p>
          <p className="text-3xl text-red-400">{users.filter(u => u.is_banned).length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-4">
          <p className="text-gray-400">Premium Users</p>
          <p className="text-3xl text-yellow-400">{users.filter(u => u.premium_tier !== 'free').length}</p>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 p-4">
        <h3 className="text-xl text-yellow-400 mb-4">ADMINISTRATOR</h3>
        <p className="text-white">Username: {user.username}</p>
        <p className="text-gray-400">ID: {user.prisonerId}</p>
        <p className="text-gray-400">Support: {supportEmail}</p>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-4">
      <h2 className="text-2xl text-green-400 mb-4">USER MANAGEMENT</h2>
      <div className="bg-gray-800 border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 text-gray-400">Prisoner ID</th>
              <th className="p-3 text-gray-400">Username</th>
              <th className="p-3 text-gray-400">Status</th>
              <th className="p-3 text-gray-400">Premium</th>
              <th className="p-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-3 text-white">{u.prisoner_id}</td>
                <td className="p-3 text-white">{u.username}</td>
                <td className="p-3">
                  {u.is_banned ? (
                    <span className="text-red-400">BANNED</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>
                <td className="p-3 text-yellow-400">{u.premium_tier}</td>
                <td className="p-3 space-x-2">
                  <button 
                    onClick={() => setSelectedUser(u)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
                  >
                    EDIT
                  </button>
                  {u.is_banned ? (
                    <button 
                      onClick={() => handleUnbanUser(u.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                    >
                      UNBAN
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const reason = prompt('Enter ban reason:');
                        if (reason) handleBanUser(u.id, reason);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                    >
                      BAN
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEditUser = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-2xl text-green-400 mb-4">EDIT USER: {selectedUser.username}</h2>
        <div className="bg-gray-800 border border-gray-700 p-4 space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Grant Premium Tier</label>
            <div className="space-x-2">
              <button onClick={() => handleGrantPremium(selectedUser.id, 'monthly')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Monthly</button>
              <button onClick={() => handleGrantPremium(selectedUser.id, 'yearly')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Yearly</button>
              <button onClick={() => handleGrantPremium(selectedUser.id, 'lifetime')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Lifetime</button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Edit Game Stats</label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder="Cash"
                onChange={(e) => setEditData({...editData, cash: parseInt(e.target.value)})}
                className="bg-gray-900 border border-gray-600 text-white p-2"
              />
              <input 
                type="number" 
                placeholder="Favors"
                onChange={(e) => setEditData({...editData, favors: parseInt(e.target.value)})}
                className="bg-gray-900 border border-gray-600 text-white p-2"
              />
              <input 
                type="number" 
                placeholder="STR"
                onChange={(e) => setEditData({...editData, stats: {...editData.stats, str: parseFloat(e.target.value)}})}
                className="bg-gray-900 border border-gray-600 text-white p-2"
              />
              <input 
                type="number" 
                placeholder="DEF"
                onChange={(e) => setEditData({...editData, stats: {...editData.stats, def: parseFloat(e.target.value)}})}
                className="bg-gray-900 border border-gray-600 text-white p-2"
              />
            </div>
            <button 
              onClick={handleUpdateStats}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            >
              UPDATE STATS
            </button>
          </div>
          
          <button 
            onClick={() => setSelectedUser(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
          >
            BACK TO USERS
          </button>
        </div>
      </div>
    );
  };

  const renderAuditLogs = () => (
    <div className="space-y-4">
      <h2 className="text-2xl text-green-400 mb-4">AUDIT LOGS</h2>
      <div className="bg-gray-800 border border-gray-700 p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 text-gray-400">Timestamp</th>
              <th className="p-3 text-gray-400">Admin</th>
              <th className="p-3 text-gray-400">Action</th>
              <th className="p-3 text-gray-400">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-gray-700">
                <td className="p-3 text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-3 text-white">{log.admin_id}</td>
                <td className="p-3 text-yellow-400">{log.action}</td>
                <td className="p-3 text-gray-300">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-green-400">WARDEN CONTROL PANEL</h1>
          <p className="text-gray-500 text-sm">Administrator: {user.username}</p>
        </div>
        <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2">LOGOUT</button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'User Management' },
              { id: 'edit', label: 'Edit User', show: !!selectedUser },
              { id: 'audit', label: 'Audit Logs' }
            ].filter(t => !t.show || t.show).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-2 px-3 ${activeTab === tab.id ? 'bg-gray-700 text-yellow-400' : 'hover:bg-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'edit' && renderEditUser()}
          {activeTab === 'audit' && renderAuditLogs()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center text-gray-500 text-sm">
        Support: {supportEmail} | Owner: Warden Surge
      </footer>
    </div>
  );
};

export default AdminDashboard;
