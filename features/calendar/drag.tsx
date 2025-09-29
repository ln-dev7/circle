'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactNode } from 'react';

interface DragDropProviderProps {
   children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
   return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}
