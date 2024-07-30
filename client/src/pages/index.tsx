import { useState } from 'react';
import UserTable from '../components/organisms/userTable';
import UserModal from '../components/organisms/userModal';
import { Button } from 'primereact/button';
import { User } from '../types/types';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSaveUser = () => {
    setShowModal(false);
  };

  const handleUserUpdated = () => {
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Usuarios</h1>
        <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={handleAddUser} />
      </div>
      <div className={styles['table-container']}>
        <UserTable onEditUser={handleEditUser} onUserUpdated={handleUserUpdated} />
      </div>
      <UserModal visible={showModal} onHide={() => setShowModal(false)} user={selectedUser} onSave={handleSaveUser} />
    </div>
  );
};

export default Home;