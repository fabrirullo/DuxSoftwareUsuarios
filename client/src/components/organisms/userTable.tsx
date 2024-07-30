import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect } from 'react';
import { fetchUsers, deleteUser } from '../../services/userService';
import { Button } from 'primereact/button';
import { User } from '../../types/types';
import styles from '../../styles/UserTable.module.css';

interface UserTableProps {
  onEditUser: (user: User) => void;
  onUserUpdated: () => void; 
}

const UserTable: React.FC<UserTableProps> = ({ onEditUser, onUserUpdated }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const statusOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' },
  ];

  useEffect(() => {
    loadUsers(page, searchQuery, statusFilter);
  }, [page, searchQuery, statusFilter]);

  const loadUsers = async (page: number, searchQuery?: string, statusFilter?: string) => {
    setLoading(true);
    const data = await fetchUsers(page, 10, searchQuery, statusFilter);
    setUsers(data.users);
    setTotalRecords(data.totalRecords);
    setLoading(false);
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    loadUsers(page, searchQuery, statusFilter); 
  };

  const handlePageChange = (e: { first: number }) => {
    setPage(e.first / 10 + 1);
  };

  useEffect(() => {
    onUserUpdated(); 
  }, [users]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <InputText
          type="text"
          placeholder="Buscar"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dropdown
          className={styles.filterSelect}
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => setStatusFilter(e.value as string)}
          placeholder="Filtrar por estado"
        />
      </div>
      <div className={styles.tableContainer}>
        <DataTable
          value={users}
          paginator
          rows={10}
          totalRecords={totalRecords}
          lazy
          first={(page - 1) * 10}
          onPage={handlePageChange}
          loading={loading}
          className={styles.dataTable}
        >
          <Column field="id" header="ID" style={{ width: '10%' }} />
          <Column field="usuario" header="Usuario" style={{ width: '40%' }} />
          <Column field="estado" header="Estado" style={{ width: '30%' }} />
          <Column
            body={(rowData) => (
              <div className={styles.actions}>
                <Button 
                  label="Editar" 
                  icon="pi pi-pencil" 
                  onClick={() => onEditUser(rowData)} 
                />
                <Button 
                  label="Eliminar" 
                  icon="pi pi-trash" 
                  className="p-button-danger" 
                  onClick={() => handleDeleteUser(rowData.id)} 
                />
              </div>
            )}
            header="Acciones"
            style={{ width: '20%' }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default UserTable;