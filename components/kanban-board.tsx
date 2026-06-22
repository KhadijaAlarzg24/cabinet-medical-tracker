"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle2, MoreVertical, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreatePatientDialog from "./create-patient-dialog";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientData {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ColumnData {
  _id: string;
  name: string;
  patients: PatientData[];
}

interface BoardData {
  _id: string;
  name: string;
  columns: ColumnData[];
}

interface KanbanBoardProps {
  board: BoardData;
  userId: string;
}

type ColConfig = {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: "bg-blue-500",
    icon: Calendar,
    description: "Rendez-vous nouveaux et planifiés",
  },
  {
    color: "bg-yellow-500",
    icon: Clock,
    description: "Consultations en cours et suivis",
  },
  {
    color: "bg-green-500",
    icon: CheckCircle2,
    description: "Visites et documents médicaux terminés",
  },
];

function DroppableColumn({
  column,
  config,
  boardId,
  allColumns,
}: {
  column: ColumnData;
  config: ColConfig;
  boardId: string;
  allColumns: ColumnData[];
}) {
  const router = useRouter();
  const patients = column.patients || [];

  async function movePatient(patientId: string, targetColumnId: string) {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: targetColumnId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to move patient");
      }
    } catch (error) {
      console.error("Error during moving patient:", error);
    }
  }

  return (
    <Card className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4 select-none">
      <CardHeader className={`${config.color} text-white py-3 px-4 flex flex-col gap-1`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <config.icon className="h-4 w-4" />
            <CardTitle className="text-sm font-semibold tracking-wide m-0">
              {column.name}
            </CardTitle>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              {patients.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreatePatientDialog columnId={column._id} boardId={boardId} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-xs text-white/85 font-light m-0 pl-6">
          {config.description}
        </p>
      </CardHeader>

      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <CardContent
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 pt-4 min-h-[450px] rounded-b-lg transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-slate-100/80" : "bg-gray-50/50"
            }`}
          >
            {patients.map((patient, index) => (
              <Draggable key={patient._id} draggableId={patient._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                    className={`bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${
                      snapshot.isDragging ? "shadow-md ring-2 ring-blue-500/20" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-full">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {patient.firstName} {patient.lastName}
                            </p>
                            {patient.phone && (
                              <p className="text-xs text-gray-500">{patient.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 justify-end pt-1 border-t border-gray-100">
                        {allColumns
                          .filter((c) => c._id !== column._id)
                          .map((targetCol) => {
                            let btnStyles = "bg-gray-100 text-gray-600 hover:bg-gray-200";
                            if (targetCol.name.toLowerCase().includes("cours")) {
                              btnStyles = "bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white border border-yellow-200";
                            } else if (targetCol.name.toLowerCase().includes("termin")) {
                              btnStyles = "bg-green-50 text-green-700 hover:bg-green-500 hover:text-white border border-green-200";
                            } else {
                              btnStyles = "bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white border border-blue-200";
                            }

                            return (
                              <button
                                key={targetCol._id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  movePatient(patient._id, targetCol._id);
                                }}
                                className={`text-[10px] px-2 py-1 rounded font-medium transition-all duration-200 ${btnStyles}`}
                                title={`Déplacer vers ${targetCol.name}`}
                              >
                                → {targetCol.name}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const columns = board?.columns || [];
  const router = useRouter();
  
  
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(true);
  }, []);

  if (!enabled) {
    return null;
  }

  
  if (process.env.NODE_DIR === "development") {
    console.log("Active user session:", userId);
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    try {
      const response = await fetch(`/api/patients/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: destination.droppableId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updates via drag and drop:", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col: ColumnData, key: number) => {
            const config = COLUMN_CONFIG[key] || {
              color: "bg-gray-500",
              icon: Calendar,
              description: "Gestion et suivi des tâches",
            };
            return (
              <DroppableColumn
                key={col._id ? col._id.toString() : `col-${key}`}
                column={col}
                config={config}
                boardId={board?._id || ""}
                allColumns={columns}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}