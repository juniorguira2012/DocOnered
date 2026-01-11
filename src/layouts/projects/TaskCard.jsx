import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import { Card, Icon, Avatar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

const TaskCard = React.memo(({ task, index, isAdmin, onClick, getPriorityColor, assignedUser }) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!isAdmin}>
      {(p) => (
        <Card
          ref={p.innerRef}
          {...p.draggableProps}
          {...p.dragHandleProps}
          onClick={() => onClick(task)}
          sx={{
            p: 2,
            mb: 1.5,
            cursor: "pointer",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
          }}
        >
          {task.priority && (
            <MDBox mb={1}>
              <MDBadge
                badgeContent={task.priority}
                color={getPriorityColor(task.priority)}
                variant="gradient"
                size="xs"
              />
            </MDBox>
          )}
          <MDTypography variant="button" fontWeight="medium" display="block" mb={1}>
            {task.text}
          </MDTypography>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex" gap={1} alignItems="center">
              {task.dueDate && (
                <Icon sx={{ fontSize: "16px", color: "text.secondary" }}>calendar_today</Icon>
              )}
              {task.checklist?.length > 0 && (
                <Icon sx={{ fontSize: "16px", color: "text.secondary" }}>assignment_turned_in</Icon>
              )}
              {task.attachments?.length > 0 && (
                <Icon sx={{ fontSize: "16px", color: "text.secondary" }}>attach_file</Icon>
              )}
            </MDBox>
            {assignedUser && (
              <Avatar src={assignedUser.avatar} sx={{ width: 22, height: 22, fontSize: 10 }}>
                {assignedUser.nombre.charAt(0)}
              </Avatar>
            )}
          </MDBox>
        </Card>
      )}
    </Draggable>
  );
});

TaskCard.displayName = "TaskCard";

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
  assignedUser: PropTypes.object,
};

export default TaskCard;
