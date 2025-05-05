"use client"
import React, { useState, useEffect } from 'react';
import { UserTableData, AccessLevel } from '@/app/utils/types/roleManagementType';
import { 
  getAllUsers, 
  updateUserAccess, 
  getSupervisedUsers,
  updateSupervisionAssignments
} from '@/app/utils/services/roleManagementService';
import Spinner from '../spinner';
import SupervisedUsersModal from './supervisedUsersModal';

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<UserTableData | null>(null);
  const [availableConsultants, setAvailableConsultants] = useState<UserTableData[]>([]);
  const [supervisedUsers, setSupervisedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cargar todos los usuarios al inicio
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    void fetchUsers();
  }, []);

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cambiar el nivel de acceso de un usuario
  const handleAccessLevelChange = async (userId: string, consultantId: number | undefined, newLevel: AccessLevel) => {
    try {
      setSaving(true);
      
      // Si es supervisor, se necesitará abrir el modal para asignar supervisados
      if (newLevel === 'supervisor') {
        const user = users.find(u => u.id === userId);
        if (user) {
          setSelectedSupervisor({...user, accessLevel: newLevel});
          
          // Filtrar consultantes disponibles (excluir administradores y el propio usuario)
          const consultants = users.filter(u => 
            u.consultantId && 
            u.id !== userId && 
            u.accessLevel !== 'administrator'
          );
          
          setAvailableConsultants(consultants);
          
          // Si ya tenía supervisados, cargarlos
          if (consultantId) {
            try {
              const supervised = await getSupervisedUsers(consultantId);
              setSupervisedUsers(supervised);
            } catch (error) {
              console.error("Error al cargar supervisados:", error);
              setSupervisedUsers([]);
            }
          } else {
            setSupervisedUsers([]);
          }
          
          setModalOpen(true);
          setSaving(false);
          return;
        }
      }
      
      // Para otros roles, actualizar directamente
      const updated = await updateUserAccess({
        userId,
        consultantId,
        accessLevel: newLevel
      });
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? {...user, ...updated} : user
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar nivel de acceso');
    } finally {
      setSaving(false);
    }
  };

  // Guardar asignaciones de supervisión desde el modal
  const handleSaveSupervisionAssignments = async () => {
    if (!selectedSupervisor || !selectedSupervisor.consultantId) return;
    
    try {
      setSaving(true);
      
      // Primero actualizar el rol a supervisor si no lo era
      if (selectedSupervisor.accessLevel !== 'supervisor') {
        await updateUserAccess({
          userId: selectedSupervisor.id,
          consultantId: selectedSupervisor.consultantId,
          accessLevel: 'supervisor',
          supervisedUsers
        });
      } else {
        // Solo actualizar las asignaciones de supervisión
        await updateSupervisionAssignments(
          selectedSupervisor.consultantId,
          supervisedUsers
        );
      }
      
      // Actualizar la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedSupervisor.id 
            ? {...user, accessLevel: 'supervisor' as AccessLevel} 
            : user
        )
      );
      
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar asignaciones de supervisión');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      
      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
      
      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Nombre</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Nivel de Acceso</th>
              <th className="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={user.accessLevel}
                    onChange={(e) => handleAccessLevelChange(
                      user.id, 
                      user.consultantId, 
                      e.target.value as AccessLevel
                    )}
                    disabled={saving}
                    className="px-2 py-1 border rounded-md"
                  >
                    <option value="unassigned">No Asignado</option>
                    <option value="consultant">Consultor</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrator">Administrador</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  {user.accessLevel === 'supervisor' && (
                    <button
                      onClick={() => {
                        setSelectedSupervisor(user);
                        setAvailableConsultants(users.filter(u => 
                          u.consultantId && 
                          u.id !== user.id && 
                          u.accessLevel !== 'administrator'
                        ));
                        if (user.consultantId) {
                          getSupervisedUsers(user.consultantId)
                            .then(supervised => setSupervisedUsers(supervised))
                            .catch(() => setSupervisedUsers([]));
                        }
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-black rounded hover:bg-blue-600"
                    >
                      Gestionar Supervisados
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No se encontraron usuarios que coincidan con la búsqueda
        </div>
      )}
      
      {/* Modal para gestionar supervisados */}
      {modalOpen && selectedSupervisor && (
        <SupervisedUsersModal
          supervisor={selectedSupervisor}
          availableConsultants={availableConsultants}
          selectedConsultants={supervisedUsers}
          onSelect={(consultantId, isSelected) => {
            if (isSelected) {
              setSupervisedUsers(prev => [...prev, consultantId]);
            } else {
              setSupervisedUsers(prev => prev.filter(id => id !== consultantId));
            }
          }}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveSupervisionAssignments}
          isSaving={saving}
        />
      )}
    </div>
  );
};

export default UserManagementTable;