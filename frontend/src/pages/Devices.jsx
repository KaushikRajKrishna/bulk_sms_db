import React, { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import DeviceCard from '../components/DeviceCard';
import DeviceModal from '../components/DeviceModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../services/api';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditDevice(null);
    setModalOpen(true);
  }

  function openEdit(device) {
    setEditDevice(device);
    setModalOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editDevice) {
        const updated = await updateDevice(editDevice._id || editDevice.id, form);
        setDevices((d) => d.map((x) => (x._id === updated._id ? updated : x)));
        toast.success('Device updated');
      } else {
        const created = await createDevice(form);
        setDevices((d) => [created, ...d]);
        toast.success('Device added');
      }
    } catch (err) {
      toast.error(err.message);
      throw err; // keep modal open
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteDevice(deleteTarget._id || deleteTarget.id);
      setDevices((d) => d.filter((x) => x._id !== deleteTarget._id));
      toast.success('Device deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card bg-white/90 border-slate-200/80">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_auto] items-center">
          <div>
            <p className="section-title">Device Management</p>
            <h1 className="text-3xl font-semibold text-slate-900">Devices</h1>
            <p className="text-slate-600 text-sm mt-2">
              Configure your gateway endpoints and monitor message capacity across connected devices.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <button onClick={load} className="btn-secondary" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Device
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-slate-100 border border-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="card text-center py-16">
          <Smartphone className="w-14 h-14 mx-auto text-slate-400 mb-4" />
          <h3 className="text-slate-900 font-semibold text-lg mb-2">No devices yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Add your first Android SMS gateway device to start sending messages.
          </p>
          <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Device
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((d) => (
            <DeviceCard
              key={d._id || d.id}
              device={d}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <DeviceModal
        open={modalOpen}
        device={editDevice}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Device"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
