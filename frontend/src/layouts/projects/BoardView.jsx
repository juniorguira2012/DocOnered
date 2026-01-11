import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "./Board";
import { useMaterialUIController } from "context";

function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();

  // 1. Intentamos obtener usuarios del contexto
  const { allUsers: contextUsers } = controller;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    // 2. Carga de Proyecto
    const savedProjects = JSON.parse(localStorage.getItem("mis_proyectos_dashboard")) || [];
    const found = savedProjects.find((p) => String(p.id) === String(id));

    if (found) {
      setProject(found);
    }

    // 3. Respaldo de Usuarios: Si el contexto no tiene usuarios (por F5), leemos localStorage
    if (contextUsers && contextUsers.length > 0) {
      setUsersList(contextUsers);
    } else {
      const registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
      // Aseguramos el Admin si no está (misma lógica que en tu Index)
      const adminMaster = {
        nombre: "Admin Onered",
        email: "admin@oneredrd.info",
        rol: "admin",
        isMaster: true,
      };
      const existeAdmin = registrados.find((u) => u.email === adminMaster.email);
      setUsersList(existeAdmin ? registrados : [adminMaster, ...registrados]);
    }

    setLoading(false);
  }, [id, contextUsers]); // Se dispara si cambia el ID o si el contexto termina de cargar

  // 4. Filtramos los miembros específicos de ESTE proyecto para la barra superior
  const projectMembers = usersList.filter((u) => project?.members?.includes(u.email));

  const handleUpdateProject = (updatedProject) => {
    setProject(updatedProject);
    const savedProjects = JSON.parse(localStorage.getItem("mis_proyectos_dashboard")) || [];
    const updatedList = savedProjects.map((p) =>
      String(p.id) === String(updatedProject.id) ? updatedProject : p
    );
    localStorage.setItem("mis_proyectos_dashboard", JSON.stringify(updatedList));
  };

  if (loading) return <div style={{ padding: "20px" }}>Cargando proyecto...</div>;

  if (!project) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Proyecto no encontrado</h3>
        <button onClick={() => navigate("/projects")}>Volver a la lista</button>
      </div>
    );
  }

  return (
    <Board
      project={project}
      projectMembers={projectMembers} // Miembros arriba
      allUsers={usersList} // Lista completa para las tarjetas y selectores
      onUpdateProject={handleUpdateProject}
      onClose={() => navigate("/projects")}
    />
  );
}

export default BoardView;
