import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { createUser, updateUser, checkUserExists, checkIdExists } from '../../services/userService';
import { User } from '../../types/types';
import styles from '../../styles/UserModal.module.css';

type Estado = 'ACTIVO' | 'INACTIVO';

interface UserModalProps {
  visible: boolean;
  onHide: () => void;
  user: User | null;
  onSave: () => void; 
}

const UserModal: React.FC<UserModalProps> = ({ visible, onHide, user, onSave }) => {
  const [id, setId] = useState(user ? user.id.toString() : ''); 
  const [usuario, setUsuario] = useState(user ? user.usuario : '');
  const [estado, setEstado] = useState<Estado>(user ? user.estado : 'ACTIVO');
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    if (user) {
      setId(user.id.toString());
      setUsuario(user.usuario);
      setEstado(user.estado);
    }
  }, [user]);

  const handleSave = async () => {
    setError(null);

    if (!user) { 
      if (await checkUserExists(usuario)) {
        setError('El nombre de usuario ya existe.');
        return;
      }

      if (await checkIdExists(Number(id))) {
        setError('El ID ya existe.');
        return;
      }
    }

    const userData = { id: Number(id), usuario, estado, sector: 4000 };

    if (user) {
      await updateUser(user.id, userData);
    } else {
      await createUser(userData);
    }

    onSave(); 
    onHide(); 
  };

  const handleCancel = () => {
    onHide();
  };

  const estadoOptions = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' },
  ];

  return (
    <Dialog 
      header={user ? "Editar Usuario" : "Crear Usuario"} 
      visible={visible} 
      onHide={onHide}
      className={styles.pDialog}
      headerClassName={styles.header}
      footer={
        <div className={styles.dialogFooter}>
          <Button 
            label="Confirmar" 
            icon="pi pi-check" 
            onClick={handleSave} 
            className={`${styles.button} ${styles.saveButton}`}
          />         
          <Button 
            label="Cancelar" 
            icon="pi pi-times"
            onClick={handleCancel} 
            className={`${styles.button} ${styles.cancelButton}`}
          />
        </div>
      }
    >
      <div className={styles.dialogContent}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label htmlFor="id">ID</label>
          <InputText 
            id="id" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            className={styles.input}
            disabled={!!user} 
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="usuario">Nombre</label>
          <InputText 
            id="usuario" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)} 
            className={styles.input}
            disabled={!!user}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="estado">Estado</label>
          <Dropdown 
            id="estado" 
            value={estado} 
            options={estadoOptions}
            onChange={(e) => setEstado(e.value as Estado)} 
            className={styles.dropdown}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default UserModal;