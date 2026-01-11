const logActivity = (action, docTitle, docId) => {
  const currentActivity = JSON.parse(localStorage.getItem("doc_activity")) || [];
  const newLog = {
    id: Date.now(),
    action, // 'creó', 'editó', o 'eliminó'
    docTitle,
    docId,
    date: new Date().toISOString(),
  };

  // Guardamos solo los últimos 30 movimientos para no llenar el storage
  const updatedActivity = [newLog, ...currentActivity].slice(0, 30);
  localStorage.setItem("doc_activity", JSON.stringify(updatedActivity));
};
