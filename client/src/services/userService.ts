const API_URL = 'https://staging.duxsoftware.com.ar/api/personal';
const SECTOR_ID = 4000;

export const fetchUsers = async (page: number, limit: number, searchQuery?: string, statusFilter?: string) => {
  let url = `${API_URL}?sector=${SECTOR_ID}&_limit=${limit}&_page=${page}`;
  
  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`;
  }
  
  if (statusFilter && statusFilter !== 'Todos') {
    url += `&estado=${encodeURIComponent(statusFilter)}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    users: data,
    totalRecords: 100,
  };
};

// verifico si el nombre de usuario ya existe
export const checkUserExists = async (username: string) => {
  const response = await fetch(`${API_URL}?sector=${SECTOR_ID}&usuario=${encodeURIComponent(username)}`);
  const data = await response.json();
  return data.length > 0; 
};

// verifico si el id existe
export const checkIdExists = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}?sector=${SECTOR_ID}`);
  return response.ok; 
};

export const createUser = async (user: any) => {
  const response = await fetch(`${API_URL}?sector=${SECTOR_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const updateUser = async (id: number, user: any) => {
  const response = await fetch(`${API_URL}/${id}?sector=${SECTOR_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}?sector=${SECTOR_ID}`, {
    method: 'DELETE',
  });
  return response.json();
};