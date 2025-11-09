import React, { useState, useRef } from "react";
import { percentage } from "./helper/helper";
import "../styles/Workspace.css";
import "../styles/general.css";

interface Text {
  id: string;
  top: number;
  left: number;
  content: string;
}

export default function Textarea() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; id: string } | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);

  const percentum = percentage(screen.width, 25);
  const DRAG_THRESHOLD = 5; // pixels to move before dragging starts

  const handleWorkspaceDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createNewText(y, x);
    e.stopPropagation();
  };

  const createNewText = (top: number, left: number) => {
    const id = crypto.randomUUID();
    setTexts((prev) => [
      ...prev,
      {
        id,
        top,
        left,
        content: "",
      },
    ]);
    console.log(percentum);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    e.stopPropagation();
    const target = e.target as HTMLTextAreaElement;
    const rect = target.getBoundingClientRect();

    const isNearResize =
      e.clientX > rect.right - 16 && e.clientY > rect.bottom - 16;
    if (isNearResize) return;

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      id,
    };
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStart.current && !draggingId) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > DRAG_THRESHOLD) {
        setDraggingId(dragStart.current.id);
      }
    }

    if (!draggingId || !workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.current.x;
    const y = e.clientY - rect.top - offset.current.y;

    setTexts((prev) =>
      prev.map((t) =>
        t.id === draggingId ? { ...t, top: y, left: x } : t
      )
    );
    e.stopPropagation();
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    dragStart.current = null;
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let content = (e.target as HTMLElement).textContent;
    console.log(content)
  };

  return (
    <div
      ref={workspaceRef}
      className="workspace"
      onDoubleClick={handleWorkspaceDoubleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {texts.map((text) => (
        <TextareaItem key={text.id} text={text}/>
      ))}
    </div>
  );
  
  function TextareaItem(props: {text: Text}) {
    return (
      <textarea
          id={props.text.id}
          style={{
            position: "absolute",
            top: `${props.text.top}px`,
            left: `${props.text.left}px`,
          }}
          className="texts"
          onMouseDown={(e) => handleMouseDown(e, props.text.id)}
          defaultValue={props.text.content}
          placeholder="..."
          onChange={(e) => changeHandler(e)}
          onDoubleClick={(e) => e.stopPropagation()}
        />
    );
  }
}