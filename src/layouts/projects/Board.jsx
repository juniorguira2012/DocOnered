/* eslint-disable react/no-unescaped-entities */
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import {
  Icon,
  Modal,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Grid,
  Dialog,
  Avatar,
  Select,
  MenuItem,
  Checkbox,
  AvatarGroup,
  Tooltip,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDProgress from "components/MDProgress";
import MDBadge from "components/MDBadge";

import { useMaterialUIController } from "context";
import TaskCard from "./TaskCard";

// Estilo para el punto de conexión (Online/Offline)
const StyledBadge = styled(Badge)(({ theme, isonline }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: isonline === "true" ? "#44b700" : "#bdbdbd",
    color: isonline === "true" ? "#44b700" : "#bdbdbd",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: isonline === "true" ? "ripple 1.2s infinite ease-in-out" : "none",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

// AÑADIDA PROP projectMembers
function Board({ project, onUpdateProject, onClose, allUsers = [], projectMembers = [] }) {
  const [controller] = useMaterialUIController();
  const { user } = controller;
  const isAdmin = user?.rol === "admin";
  const fileInputRef = useRef(null);

  const [searchTask, setSearchTask] = useState("");
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [newColumnName, setNewColumnName] = useState("");

  const [newComment, setNewComment] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [openDeleteTaskConfirm, setOpenDeleteTaskConfirm] = useState(false);

  const [openEditConfirm, setOpenEditConfirm] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState(null);
  const [tempColumnTitle, setTempColumnTitle] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const getAssignedUserData = (email) => {
    if (!email) return null;
    return allUsers.find((u) => u.email === email) || null;
  };

  const updateActiveTask = (updates) => {
    const updatedTasks = project.tareas.map((t) =>
      t.id === activeTask.id ? { ...t, ...updates } : t
    );
    onUpdateProject({ ...project, tareas: updatedTasks });
    setActiveTask((prev) => ({ ...prev, ...updates }));
  };

  const handleConfirmDeleteTask = () => {
    const updatedTareas = project.tareas.filter((t) => t.id !== activeTask.id);
    onUpdateProject({ ...project, tareas: updatedTareas });
    setOpenDeleteTaskConfirm(false);
    setOpenTaskDetail(false);
    setActiveTask(null);
  };

  const handleConfirmEditColumn = () => {
    if (!tempColumnTitle.trim()) return;
    const updatedColumnas = project.columnas.map((c) =>
      c.id === columnToEdit ? { ...c, title: tempColumnTitle.toUpperCase() } : c
    );
    onUpdateProject({ ...project, columnas: updatedColumnas });
    setOpenEditConfirm(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAttach = { id: Date.now(), url: reader.result, name: file.name, type: "local" };
      updateActiveTask({ attachments: [...(activeTask.attachments || []), newAttach] });
    };
    reader.readAsDataURL(file);
  };

  const handleAddAttachment = () => {
    if (!attachmentUrl.trim()) return;
    updateActiveTask({
      attachments: [
        ...(activeTask.attachments || []),
        { id: Date.now(), url: attachmentUrl, type: "remote" },
      ],
    });
    setAttachmentUrl("");
  };

  const handleRemoveAttachment = (id) => {
    updateActiveTask({ attachments: activeTask.attachments.filter((at) => at.id !== id) });
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = activeTask.comments.filter((c) => c.id !== commentId);
    updateActiveTask({ comments: updatedComments });
  };

  const handleSaveEditComment = (commentId) => {
    const updatedComments = activeTask.comments.map((c) =>
      c.id === commentId ? { ...c, texto: editingCommentText, fecha: `${c.fecha} (editado)` } : c
    );
    updateActiveTask({ comments: updatedComments });
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleConfirmDeleteColumn = () => {
    const updatedColumnas = project.columnas.filter((c) => c.id !== columnToDelete);
    const updatedTareas = project.tareas.filter((t) => t.status !== columnToDelete);
    onUpdateProject({ ...project, columnas: updatedColumnas, tareas: updatedTareas });
    setOpenDeleteConfirm(false);
  };

  const handleAddTask = (columnId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      text: "Nueva Tarea",
      status: columnId,
      description: "",
      priority: "Media",
      dueDate: "",
      checklist: [],
      comments: [],
      attachments: [],
    };
    onUpdateProject({ ...project, tareas: [...(project.tareas || []), newTask] });
    setActiveTask(newTask);
    setOpenTaskDetail(true);
  };

  const onDragEnd = (result) => {
    if (!isAdmin) return;
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    )
      return;
    const items = Array.from(project.tareas);
    const taskIdx = items.findIndex((t) => t.id === draggableId);
    const [movedItem] = items.splice(taskIdx, 1);
    movedItem.status = destination.droppableId;
    items.splice(destination.index, 0, movedItem);
    onUpdateProject({ ...project, tareas: items });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      usuario: user.nombre,
      avatar: user.avatar,
      texto: newComment,
      fecha: new Date().toLocaleString(),
    };
    updateActiveTask({ comments: [commentObj, ...(activeTask.comments || [])] });
    setNewComment("");
  };

  const getPriorityColor = (prio) => {
    switch (prio) {
      case "Alta":
        return "error";
      case "Media":
        return "warning";
      case "Baja":
        return "success";
      default:
        return "secondary";
    }
  };

  const calculateChecklistProgress = (task) => {
    if (!task?.checklist?.length) return 0;
    const completed = task.checklist.filter((i) => i.completed).length;
    return Math.round((completed / task.checklist.length) * 100);
  };

  return (
    <MDBox
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#f4f7f9",
        zIndex: 1210,
        overflowY: "auto",
      }}
    >
      <AppBar sx={{ position: "sticky", top: 0, bgcolor: "#1a73e8", zIndex: 10 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={onClose}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <MDTypography sx={{ ml: 2, flex: 1 }} variant="h6" color="white">
            Tablero: {project.nombre} {!isAdmin && "(MODO LECTURA)"}
          </MDTypography>

          {/* SECCIÓN DE USUARIOS ACTIVOS RESTAURADA */}
          <MDBox display="flex" alignItems="center" mr={3}>
            <MDTypography
              variant="button"
              color="white"
              fontWeight="regular"
              mr={1.5}
              sx={{ opacity: 0.8 }}
            >
              Equipo:
            </MDTypography>
            <AvatarGroup
              max={5}
              sx={{ "& .MuiAvatar-root": { width: 32, height: 32, fontSize: 14, border: "none" } }}
            >
              {projectMembers.map((u) => {
                const isOnline = u.email === user.email;
                return (
                  <Tooltip key={u.email} title={`${u.nombre} ${isOnline ? "(Tú)" : ""}`}>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      isonline={isOnline.toString()}
                    >
                      <Avatar src={u.avatar} alt={u.nombre} sx={{ border: "2px solid #1a73e8" }}>
                        {u.nombre.charAt(0)}
                      </Avatar>
                    </StyledBadge>
                  </Tooltip>
                );
              })}
            </AvatarGroup>
          </MDBox>

          <MDBox width="200px" mr={2}>
            <MDInput
              size="small"
              placeholder="Buscar tarea..."
              value={searchTask}
              onChange={(e) => setSearchTask(e.target.value)}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </MDBox>
        </Toolbar>
      </AppBar>

      <MDBox p={4}>
        {isAdmin && (
          <MDBox display="flex" gap={2} mb={4}>
            <MDInput
              label="Nueva columna..."
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <MDButton
              color="dark"
              onClick={() => {
                if (!newColumnName.trim()) return;
                onUpdateProject({
                  ...project,
                  columnas: [
                    ...(project.columnas || []),
                    { id: `col-${Date.now()}`, title: newColumnName.toUpperCase() },
                  ],
                });
                setNewColumnName("");
              }}
            >
              + Columna
            </MDButton>
          </MDBox>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <MDBox display="flex" gap={3} sx={{ overflowX: "auto", pb: 3, alignItems: "flex-start" }}>
            {project.columnas?.map((col) => (
              <MDBox
                key={col.id}
                sx={{
                  minWidth: "300px",
                  width: "300px",
                  bgcolor: "#ebecf0",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    sx={{ cursor: isAdmin ? "pointer" : "default" }}
                    onClick={() => {
                      if (isAdmin) {
                        setColumnToEdit(col.id);
                        setTempColumnTitle(col.title);
                        setOpenEditConfirm(true);
                      }
                    }}
                  >
                    {col.title}
                  </MDTypography>
                  {isAdmin && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setColumnToDelete(col.id);
                        setOpenDeleteConfirm(true);
                      }}
                    >
                      <Icon>delete_outline</Icon>
                    </IconButton>
                  )}
                </MDBox>
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <MDBox
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ minHeight: "10px" }}
                    >
                      {project.tareas
                        .filter(
                          (t) =>
                            t.status === col.id &&
                            t.text.toLowerCase().includes(searchTask.toLowerCase())
                        )
                        .map((t, index) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            index={index}
                            isAdmin={isAdmin}
                            getPriorityColor={getPriorityColor}
                            assignedUser={allUsers.find((u) => u.email === t.assignedTo)}
                            onClick={(task) => {
                              setActiveTask(task);
                              setOpenTaskDetail(true);
                            }}
                          />
                        ))}
                      {provided.placeholder}
                    </MDBox>
                  )}
                </Droppable>
                {isAdmin && (
                  <MDButton
                    variant="text"
                    color="info"
                    size="small"
                    fullWidth
                    sx={{ mt: 1, justifyContent: "flex-start" }}
                    onClick={() => handleAddTask(col.id)}
                  >
                    <Icon sx={{ mr: 1 }}>add</Icon>Añadir tarjeta
                  </MDButton>
                )}
              </MDBox>
            ))}
          </MDBox>
        </DragDropContext>
      </MDBox>

      {/* MODAL DETALLE DE TAREA */}
      <Modal open={openTaskDetail} onClose={() => setOpenTaskDetail(false)}>
        <MDBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", md: 900 },
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
          }}
        >
          <MDBox
            display="flex"
            justifyContent="flex-end"
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            {isAdmin && (
              <IconButton
                onClick={() => setOpenDeleteTaskConfirm(true)}
                color="error"
                sx={{ mr: 1 }}
              >
                <Icon>delete</Icon>
              </IconButton>
            )}
            <IconButton onClick={() => setOpenTaskDetail(false)}>
              <Icon>close</Icon>
            </IconButton>
          </MDBox>

          {activeTask && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                <MDInput
                  fullWidth
                  variant="standard"
                  value={activeTask.text}
                  onChange={(e) => updateActiveTask({ text: e.target.value })}
                  disabled={!isAdmin}
                  inputProps={{ style: { fontSize: 22, fontWeight: "bold" } }}
                />
                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={1}>
                    <Icon sx={{ mr: 1, verticalAlign: "middle" }}>description</Icon> Descripción
                  </MDTypography>
                  <MDInput
                    multiline
                    rows={3}
                    fullWidth
                    value={activeTask.description || ""}
                    onChange={(e) => updateActiveTask({ description: e.target.value })}
                  />
                </MDBox>
                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={1}>
                    <Icon sx={{ mr: 1, verticalAlign: "middle" }}>attach_file</Icon> Adjuntos
                  </MDTypography>
                  <MDBox display="flex" gap={1} mb={2} alignItems="center">
                    <MDInput
                      size="small"
                      fullWidth
                      placeholder="URL..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                    />
                    <MDButton size="small" color="info" onClick={handleAddAttachment}>
                      URL
                    </MDButton>
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <MDButton
                      size="small"
                      color="dark"
                      onClick={() => fileInputRef.current.click()}
                    >
                      PC
                    </MDButton>
                  </MDBox>
                  <Grid container spacing={1}>
                    {activeTask.attachments?.map((at) => (
                      <Grid item xs={3} key={at.id} sx={{ position: "relative" }}>
                        <MDBox
                          component="img"
                          src={at.url}
                          sx={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid #eee",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            bgcolor: "rgba(255,255,255,0.8)",
                          }}
                          onClick={() => handleRemoveAttachment(at.id)}
                        >
                          <Icon color="error" sx={{ fontSize: "16px" }}>
                            delete
                          </Icon>
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={1}>
                    <Icon sx={{ mr: 1, verticalAlign: "middle" }}>task_alt</Icon> Checklist
                  </MDTypography>
                  {activeTask.checklist?.length > 0 && (
                    <MDProgress
                      value={calculateChecklistProgress(activeTask)}
                      variant="gradient"
                      color="info"
                      sx={{ mb: 1 }}
                    />
                  )}
                  {activeTask.checklist?.map((item) => (
                    <MDBox key={item.id} display="flex" alignItems="center">
                      <Checkbox
                        checked={item.completed}
                        onChange={() => {
                          const updated = activeTask.checklist.map((i) =>
                            i.id === item.id ? { ...i, completed: !i.completed } : i
                          );
                          updateActiveTask({ checklist: updated });
                        }}
                      />
                      <MDTypography
                        variant="body2"
                        sx={{ flex: 1, textDecoration: item.completed ? "line-through" : "none" }}
                      >
                        {item.text}
                      </MDTypography>
                    </MDBox>
                  ))}
                  <MDBox display="flex" mt={1} gap={1}>
                    <MDInput
                      size="small"
                      fullWidth
                      placeholder="Nuevo paso..."
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                    />
                    <MDButton
                      size="small"
                      color="info"
                      onClick={() => {
                        if (!newChecklistItem.trim()) return;
                        updateActiveTask({
                          checklist: [
                            ...(activeTask.checklist || []),
                            { id: Date.now(), text: newChecklistItem, completed: false },
                          ],
                        });
                        setNewChecklistItem("");
                      }}
                    >
                      Añadir
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2 }}>
                  <MDTypography variant="button" fontWeight="bold">
                    PROPIEDADES
                  </MDTypography>
                  <MDBox mt={2}>
                    <MDTypography variant="caption" fontWeight="bold">
                      Asignar a
                    </MDTypography>
                    <Select
                      fullWidth
                      size="small"
                      value={activeTask.assignedTo || ""}
                      onChange={(e) => updateActiveTask({ assignedTo: e.target.value })}
                      sx={{ height: 40, mt: 0.5 }}
                    >
                      <MenuItem value="">
                        <em>Ninguno</em>
                      </MenuItem>
                      {allUsers.map((u) => (
                        <MenuItem key={u.email} value={u.email}>
                          <MDBox display="flex" alignItems="center" gap={1}>
                            <Avatar src={u.avatar} sx={{ width: 20, height: 20 }} />
                            {u.nombre}
                          </MDBox>
                        </MenuItem>
                      ))}
                    </Select>
                  </MDBox>
                  <MDBox mt={2}>
                    <MDTypography variant="caption" fontWeight="bold">
                      Prioridad
                    </MDTypography>
                    <Select
                      fullWidth
                      size="small"
                      value={activeTask.priority || ""}
                      onChange={(e) => updateActiveTask({ priority: e.target.value })}
                      sx={{ height: 40, mt: 0.5 }}
                    >
                      <MenuItem value="Baja">Baja</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Alta">Alta</MenuItem>
                    </Select>
                  </MDBox>
                  <MDBox mt={2}>
                    <MDTypography variant="caption" fontWeight="bold">
                      Fecha Límite
                    </MDTypography>
                    <MDInput
                      type="date"
                      fullWidth
                      size="small"
                      value={activeTask.dueDate || ""}
                      onChange={(e) => updateActiveTask({ dueDate: e.target.value })}
                      sx={{ mt: 0.5 }}
                    />
                  </MDBox>
                </MDBox>
                {/* SECCIÓN CHAT */}
                <MDBox mt={3} p={1}>
                  <MDTypography variant="h6" mb={1}>
                    <Icon sx={{ mr: 1, verticalAlign: "middle" }}>forum</Icon> Chat
                  </MDTypography>
                  <MDBox display="flex" gap={1} mb={2}>
                    <MDInput
                      size="small"
                      fullWidth
                      placeholder="Escribe..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <IconButton color="info" onClick={handleAddComment}>
                      <Icon>send</Icon>
                    </IconButton>
                  </MDBox>
                  <MDBox sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    {activeTask.comments?.map((comment) => (
                      <MDBox
                        key={comment.id}
                        mb={2}
                        p={1.5}
                        sx={{ bgcolor: "#fff", borderRadius: 2, border: "1px solid #eee" }}
                      >
                        <MDBox display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Avatar src={comment.avatar} sx={{ width: 24, height: 24 }} />
                          <MDTypography variant="caption" fontWeight="bold">
                            {comment.usuario}
                          </MDTypography>
                          <MDBox ml="auto">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingCommentText(comment.texto);
                              }}
                            >
                              <Icon sx={{ fontSize: "14px" }}>edit</Icon>
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Icon sx={{ fontSize: "14px" }}>delete</Icon>
                            </IconButton>
                          </MDBox>
                        </MDBox>
                        {editingCommentId === comment.id ? (
                          <MDBox>
                            <MDInput
                              fullWidth
                              multiline
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                            />
                            <MDBox display="flex" justifyContent="flex-end" mt={1} gap={1}>
                              <MDButton size="small" onClick={() => setEditingCommentId(null)}>
                                X
                              </MDButton>
                              <MDButton
                                size="small"
                                color="info"
                                onClick={() => handleSaveEditComment(comment.id)}
                              >
                                OK
                              </MDButton>
                            </MDBox>
                          </MDBox>
                        ) : (
                          <MDTypography variant="button" sx={{ fontSize: "13px" }}>
                            {comment.texto}
                          </MDTypography>
                        )}
                      </MDBox>
                    ))}
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
          )}
        </MDBox>
      </Modal>

      {/* DIÁLOGOS DE CONFIRMACIÓN (Eliminar, Editar Columna, etc) */}
      <Dialog open={openDeleteTaskConfirm} onClose={() => setOpenDeleteTaskConfirm(false)}>
        <MDBox p={3}>
          <MDTypography variant="h6">¿Eliminar esta tarjeta definitivamente?</MDTypography>
          <MDBox display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <MDButton onClick={() => setOpenDeleteTaskConfirm(false)}>Cancelar</MDButton>
            <MDButton color="error" onClick={handleConfirmDeleteTask}>
              Eliminar
            </MDButton>
          </MDBox>
        </MDBox>
      </Dialog>

      <Dialog open={openEditConfirm} onClose={() => setOpenEditConfirm(false)}>
        <MDBox p={3}>
          <MDTypography variant="h6">Editar nombre de columna</MDTypography>
          <MDInput
            fullWidth
            value={tempColumnTitle}
            onChange={(e) => setTempColumnTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <MDBox display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <MDButton onClick={() => setOpenEditConfirm(false)}>Cancelar</MDButton>
            <MDButton color="info" onClick={handleConfirmEditColumn}>
              Guardar
            </MDButton>
          </MDBox>
        </MDBox>
      </Dialog>

      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <MDBox p={3}>
          <MDTypography variant="h6">¿Eliminar columna?</MDTypography>
          <MDBox display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <MDButton onClick={() => setOpenDeleteConfirm(false)}>No</MDButton>
            <MDButton color="error" onClick={handleConfirmDeleteColumn}>
              Sí
            </MDButton>
          </MDBox>
        </MDBox>
      </Dialog>
    </MDBox>
  );
}

Board.propTypes = {
  project: PropTypes.object.isRequired,
  onUpdateProject: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  allUsers: PropTypes.array,
  projectMembers: PropTypes.array, // AÑADIDA PROP
};

export default Board;
