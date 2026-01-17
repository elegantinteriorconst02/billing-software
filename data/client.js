/**
 * Data Management Logic for Clients
 * Storage: LocalStorage (Key: 'clients')
 */

const STORAGE_KEY = 'clients';

// Fetch all clients from localStorage
function getClients() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Get a single client by ID
function getClientById(id) {
    const clients = getClients();
    return clients.find(c => c.id === id);
}

// Save a new client (creates ID automatically)
function saveClient(client) {
    const clients = getClients();
    
    // Generate simple ID: CL-Timestamp
    client.id = `CL-${Date.now()}`;
    
    clients.push(client);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    return client;
}

// Update an existing client
function updateClient(updatedClient) {
    let clients = getClients();
    clients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// Delete client by ID
function deleteClient(id){
  const clients = getClients();
  const client = clients.find(c => c.id === id);
  if(!client) return;

  // 👉 recycle bin-এ পাঠানো
  moveToRecycleBin("client", client);

  const updated = clients.filter(c => c.id !== id);
  localStorage.setItem("clients", JSON.stringify(updated));
}
