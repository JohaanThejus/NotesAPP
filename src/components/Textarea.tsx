import React, { useState, useRef } from "react";
import { percentage } from "./helper/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
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
  const DRAG_THRESHOLD = 5;

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
    
  const saveContent = (id: string, content: string) => {
    let text = texts.find(obj => obj.id == id);
    if (text) {
      text.content = content;
      console.log(text.content)
    }
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

  const workspaceRect = workspaceRef.current.getBoundingClientRect();

  const textarea = document.getElementById(draggingId) as HTMLTextAreaElement;
  if (!textarea) return;

  const itemWidth = textarea.offsetWidth;
  const itemHeight = textarea.offsetHeight;

  let x = e.clientX - workspaceRect.left - offset.current.x;
  let y = e.clientY - workspaceRect.top - offset.current.y;

  x = Math.max(0, Math.min(x, workspaceRect.width - itemWidth));
  y = Math.max(0, Math.min(y, workspaceRect.height - itemHeight));

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
    let id = (e.target as HTMLTextAreaElement).id;
    let content = (e.target as HTMLTextAreaElement).value;
    saveContent(id, content)
    console.log(content, texts)
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
        <TextareaItem key={text.id} text={text} openMenuId={null} setOpenMenuId={function (_value: React.SetStateAction<string | null>): void {
          throw new Error("Function not implemented.");
        } }/>
      ))}
    </div>
  );
  
  function TextareaItem({
  text,
  openMenuId,
  setOpenMenuId
}: {
  text: Text;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  
  const isOpen = openMenuId === text.id;

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If this menu is already open → close it
    if (isOpen) setOpenMenuId(null);
    else setOpenMenuId(text.id); // Open this menu
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${text.top}px`,
        left: `${text.left}px`,
      }}
    >
      <textarea
        id={text.id}
        className="texts"
        onMouseDown={(e) => handleMouseDown(e, text.id)}
        defaultValue={text.content}
        placeholder="..."
        onChange={(e) => changeHandler(e)}
        onDoubleClick={(e) => e.stopPropagation()}
      />

      <button
        className="gear-icon"
        onClick={toggleMenu}
        onDoubleClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: "6px",
          right: "6px",
          height: "16px",
          width: "20px",
        }}
      >
        <FontAwesomeIcon icon={faGear} className="icon" />
      </button>
    </div>
  );
}
}